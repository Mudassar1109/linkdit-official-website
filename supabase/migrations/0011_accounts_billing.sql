-- ===========================================================================
-- 0011_accounts_billing.sql — Public accounts, subscriptions, billing,
-- entitlements, and the server-authoritative entitlement service.
-- ===========================================================================
-- Design principles:
--   * Prices, plan mapping, subscription state and entitlements live here and
--     are decided by the database, never by the browser.
--   * Users may READ their own billing data. They may not INSERT/UPDATE/DELETE
--     subscriptions, transactions, grants, prices, or verified webhook events.
--   * Every state change is performed by a SECURITY DEFINER function that is
--     callable only by the trusted service role (payment webhook / server API).
--   * Pro is granted only when a verified subscription is active/trialing,
--     `last_verified_at` is set, and `current_period_end` is in the future.
--   * Cancellation at period end keeps access until the paid-through time.
--   * Unknown, pending, past_due, cancelled, expired, refunded => deny Pro.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- PROFILES
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  user_id              uuid primary key references auth.users (id) on delete cascade,
  email                text not null,
  display_name         text,
  locale               text not null default 'en',
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create unique index if not exists profiles_email_lower_idx on public.profiles (lower(email));

-- Create a profile for every new auth user. Uses to_jsonb(new) so this also
-- works on hosts whose auth.users has extra columns.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_name text;
begin
  v_name := nullif(btrim(coalesce(to_jsonb(new) -> 'raw_user_meta_data' ->> 'display_name', '')), '');
  insert into public.profiles (user_id, email, display_name)
  values (new.id, coalesce(new.email, ''), v_name)
  on conflict (user_id) do update set email = excluded.email, updated_at = now();
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.handle_auth_email_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.profiles set email = coalesce(new.email, ''), updated_at = now()
  where user_id = new.id;
  return new;
end $$;

drop trigger if exists on_auth_user_email_changed on auth.users;
create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row execute function public.handle_auth_email_change();

-- Backfill profiles for accounts that already existed before this migration.
insert into public.profiles (user_id, email)
select u.id, coalesce(u.email, '')
from auth.users u
on conflict (user_id) do nothing;

-- ---------------------------------------------------------------------------
-- PLANS / PRICES
-- ---------------------------------------------------------------------------
create table if not exists public.plans (
  key          text primary key check (key in ('free','pro')),
  name         text not null,
  description  text not null default '',
  is_public    boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

create table if not exists public.prices (
  id                uuid primary key default gen_random_uuid(),
  plan_key          text not null references public.plans (key),
  billing_interval  text not null check (billing_interval in ('month','year')),
  amount_cents      int not null check (amount_cents > 0),
  currency          text not null check (currency ~ '^[a-z]{3}$'),
  provider          text not null,
  provider_price_id text,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (plan_key, billing_interval, provider)
);

create index if not exists prices_plan_interval_idx on public.prices (plan_key, billing_interval) where is_active;

insert into public.plans (key, name, description, is_public, sort_order) values
  ('free', 'Free', 'Core local writing workspace. No payment or account required.', true, 10),
  ('pro',  'Pro',  'Advanced print/PDF, imported fonts, and advanced image tools.', true, 20)
on conflict (key) do update set
  name = excluded.name, description = excluded.description,
  is_public = excluded.is_public, sort_order = excluded.sort_order;

-- Sandbox/test price rows. They intentionally have no live provider price ID.
-- A production provider adapter must add its own rows in a later migration or
-- via the Supabase dashboard. The server never accepts a client-supplied price.
insert into public.prices (plan_key, billing_interval, amount_cents, currency, provider, provider_price_id, is_active) values
  ('pro', 'month', 599,  'usd', 'sandbox', 'sandbox_pro_monthly', true),
  ('pro', 'year',  4799, 'usd', 'sandbox', 'sandbox_pro_yearly',  true)
on conflict (plan_key, billing_interval, provider) do update set
  amount_cents = excluded.amount_cents, currency = excluded.currency,
  provider_price_id = excluded.provider_price_id, is_active = excluded.is_active,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- ENTITLEMENT DEFINITIONS (canonical mapping)
-- ---------------------------------------------------------------------------
create table if not exists public.entitlements (
  key         text primary key,
  description text not null default '',
  created_at  timestamptz not null default now()
);

create table if not exists public.plan_entitlements (
  plan_key        text not null references public.plans (key),
  entitlement_key text not null references public.entitlements (key),
  primary key (plan_key, entitlement_key)
);

insert into public.entitlements (key, description) values
  ('editor.core',        'Core editing, tabs, split view, local files, autosave, recovery, search, themes, RTL'),
  ('files.local',        'Local open/save/import/export workflows'),
  ('print.pdf.basic',    'Basic Windows print and PDF workflow'),
  ('print.pdf.advanced', 'Advanced print/PDF pack: presets, ranges, N-up, scaling, grayscale, page numbers'),
  ('fonts.import',       'Imported TTF/OTF font library'),
  ('images.advanced',    'Advanced image resize, crop, and alignment')
on conflict (key) do nothing;

insert into public.plan_entitlements (plan_key, entitlement_key) values
  ('free', 'editor.core'),
  ('free', 'files.local'),
  ('free', 'print.pdf.basic'),
  ('pro',  'editor.core'),
  ('pro',  'files.local'),
  ('pro',  'print.pdf.basic'),
  ('pro',  'print.pdf.advanced'),
  ('pro',  'fonts.import'),
  ('pro',  'images.advanced')
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- BILLING CUSTOMERS / SUBSCRIPTIONS / TRANSACTIONS
-- ---------------------------------------------------------------------------
create table if not exists public.billing_customers (
  user_id              uuid primary key references auth.users (id) on delete cascade,
  provider             text not null,
  provider_customer_id text not null,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique (provider, provider_customer_id)
);

create table if not exists public.subscriptions (
  id                         uuid primary key default gen_random_uuid(),
  user_id                    uuid references auth.users (id) on delete set null,
  plan_key                   text not null references public.plans (key),
  price_id                   uuid references public.prices (id) on delete set null,
  status                     text not null check (status in (
                               'pending','trialing','active','past_due',
                               'cancelled','expired','refunded')),
  provider                   text not null,
  provider_customer_id       text,
  provider_checkout_session_id text,
  provider_subscription_id   text,
  provider_status            text,
  current_period_start       timestamptz,
  current_period_end         timestamptz,
  trial_end                  timestamptz,
  cancel_at_period_end       boolean not null default false,
  cancelled_at               timestamptz,
  ended_at                   timestamptz,
  last_verified_at           timestamptz,
  metadata                   jsonb not null default '{}'::jsonb,
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now(),
  unique (provider, provider_checkout_session_id),
  unique (provider, provider_subscription_id)
);

create index if not exists subscriptions_user_idx on public.subscriptions (user_id, created_at desc);
create index if not exists subscriptions_live_idx on public.subscriptions (status, current_period_end);
create index if not exists subscriptions_provider_customer_idx on public.subscriptions (provider, provider_customer_id);

create table if not exists public.payment_transactions (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid references auth.users (id) on delete set null,
  subscription_id          uuid references public.subscriptions (id) on delete set null,
  provider                 text not null,
  provider_transaction_id  text not null,
  kind                     text not null check (kind in ('payment','refund','adjustment')),
  status                   text not null check (status in ('pending','succeeded','failed','refunded')),
  amount_cents             bigint not null,
  currency                 text not null check (currency ~ '^[a-z]{3}$'),
  description              text not null default '',
  occurred_at              timestamptz not null default now(),
  created_at               timestamptz not null default now(),
  unique (provider, provider_transaction_id)
);

create index if not exists payment_transactions_user_idx on public.payment_transactions (user_id, occurred_at desc);
create index if not exists payment_transactions_subscription_idx on public.payment_transactions (subscription_id);

-- ---------------------------------------------------------------------------
-- VERIFIED WEBHOOK EVENTS / AUDIT HISTORY / ENTITLEMENT GRANTS
-- ---------------------------------------------------------------------------
create table if not exists public.provider_events (
  id                 uuid primary key default gen_random_uuid(),
  provider           text not null,
  provider_event_id  text not null,
  event_type         text not null,
  payload            jsonb not null,
  signature_verified boolean not null default false,
  status             text not null default 'received'
                     check (status in ('received','processed','ignored','error')),
  error              text,
  received_at        timestamptz not null default now(),
  processed_at       timestamptz,
  unique (provider, provider_event_id)
);

create index if not exists provider_events_status_idx on public.provider_events (status, received_at);

create table if not exists public.subscription_events (
  id              uuid primary key default gen_random_uuid(),
  subscription_id uuid references public.subscriptions (id) on delete set null,
  user_id         uuid references auth.users (id) on delete set null,
  event_type      text not null,
  from_status     text,
  to_status       text,
  source          text not null default 'webhook',
  provider_event_id text,
  occurred_at     timestamptz not null default now(),
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);

create index if not exists subscription_events_user_idx on public.subscription_events (user_id, occurred_at desc);
create index if not exists subscription_events_subscription_idx on public.subscription_events (subscription_id, occurred_at desc);

create table if not exists public.entitlement_grants (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users (id) on delete cascade,
  entitlement_key text not null references public.entitlements (key),
  subscription_id uuid references public.subscriptions (id) on delete cascade,
  source          text not null default 'subscription',
  granted_at      timestamptz not null default now(),
  expires_at      timestamptz,
  revoked_at      timestamptz,
  provider_event_id text
);

create unique index if not exists entitlement_grants_active_idx
  on public.entitlement_grants (user_id, entitlement_key, subscription_id)
  where revoked_at is null;
create index if not exists entitlement_grants_user_idx on public.entitlement_grants (user_id) where revoked_at is null;

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------
alter table public.profiles              enable row level security;
alter table public.plans                 enable row level security;
alter table public.prices                enable row level security;
alter table public.entitlements          enable row level security;
alter table public.plan_entitlements     enable row level security;
alter table public.billing_customers     enable row level security;
alter table public.subscriptions         enable row level security;
alter table public.payment_transactions  enable row level security;
alter table public.provider_events       enable row level security;
alter table public.subscription_events   enable row level security;
alter table public.entitlement_grants    enable row level security;

-- Public catalogue (safe, non-secret). No write grants to clients.
grant select on public.plans, public.prices, public.entitlements, public.plan_entitlements
  to anon, authenticated;

-- Own data only.
grant select on public.profiles to authenticated;
grant select on public.billing_customers, public.subscriptions,
  public.payment_transactions, public.subscription_events, public.entitlement_grants
  to authenticated;

-- Service role needs operational reads/writes (RLS is bypassed by service_role).
grant select, insert, update, delete on public.profiles, public.plans, public.prices,
  public.entitlements, public.plan_entitlements, public.billing_customers,
  public.subscriptions, public.payment_transactions, public.provider_events,
  public.subscription_events, public.entitlement_grants
  to service_role;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select to authenticated using (user_id = auth.uid());

drop policy if exists plans_public_read on public.plans;
create policy plans_public_read on public.plans
  for select to anon, authenticated using (is_public);

drop policy if exists prices_public_read on public.prices;
create policy prices_public_read on public.prices
  for select to anon, authenticated using (is_active);

drop policy if exists entitlements_public_read on public.entitlements;
create policy entitlements_public_read on public.entitlements
  for select to anon, authenticated using (true);

drop policy if exists plan_entitlements_public_read on public.plan_entitlements;
create policy plan_entitlements_public_read on public.plan_entitlements
  for select to anon, authenticated using (true);

drop policy if exists billing_customers_select_own on public.billing_customers;
create policy billing_customers_select_own on public.billing_customers
  for select to authenticated using (user_id = auth.uid());

drop policy if exists subscriptions_select_own on public.subscriptions;
create policy subscriptions_select_own on public.subscriptions
  for select to authenticated using (user_id = auth.uid());

drop policy if exists payment_transactions_select_own on public.payment_transactions;
create policy payment_transactions_select_own on public.payment_transactions
  for select to authenticated using (user_id = auth.uid());

drop policy if exists subscription_events_select_own on public.subscription_events;
create policy subscription_events_select_own on public.subscription_events
  for select to authenticated using (user_id = auth.uid());

drop policy if exists entitlement_grants_select_own on public.entitlement_grants;
create policy entitlement_grants_select_own on public.entitlement_grants
  for select to authenticated using (user_id = auth.uid());

-- provider_events has RLS enabled and NO policies: only the service role can
-- reach it. Raw webhook payloads are never exposed to clients.

-- No INSERT/UPDATE/DELETE policies or grants are defined for clients on any
-- billing table. Direct client writes are denied by the privilege layer.

-- ---------------------------------------------------------------------------
-- PROFILE / ACCOUNT FUNCTIONS (authenticated users)
-- ---------------------------------------------------------------------------
create or replace function public.account_update_profile(p_display_name text)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_name text;
begin
  if v_user is null then raise exception 'Authentication required.'; end if;
  v_name := nullif(btrim(coalesce(p_display_name, '')), '');
  if v_name is not null and length(v_name) > 80 then
    raise exception 'Display name must be 80 characters or fewer.';
  end if;
  update public.profiles set display_name = v_name, updated_at = now() where user_id = v_user;
end $$;

grant execute on function public.account_update_profile(text) to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- ENTITLEMENT SERVICE — the single authoritative source of truth.
-- ---------------------------------------------------------------------------
create or replace function public.current_plan_key()
returns text language sql stable security definer set search_path = public as $$
  select case when exists (
    select 1
    from public.subscriptions s
    where s.user_id = auth.uid()
      and s.plan_key = 'pro'
      and s.status in ('trialing','active')
      and s.last_verified_at is not null
      and s.current_period_end is not null
      and s.current_period_end > now()
      and (s.status <> 'trialing' or s.trial_end is null or s.trial_end > now())
  ) then 'pro' else 'free' end;
$$;

create or replace function public.effective_entitlements()
returns table (entitlement_key text, plan_key text, source text, valid_until timestamptz)
language plpgsql stable security definer set search_path = public as $$
declare
  v_plan text := public.current_plan_key();
  v_until timestamptz;
begin
  if auth.uid() is null then
    return;
  end if;

  if v_plan = 'pro' then
    select max(s.current_period_end) into v_until
      from public.subscriptions s
      where s.user_id = auth.uid() and s.plan_key = 'pro'
        and s.status in ('trialing','active')
        and s.current_period_end > now();

    return query
      select pe.entitlement_key, 'pro'::text, 'subscription'::text, v_until
      from public.plan_entitlements pe
      where pe.plan_key = 'pro'
      order by pe.entitlement_key;
  else
    return query
      select pe.entitlement_key, 'free'::text, 'plan'::text, null::timestamptz
      from public.plan_entitlements pe
      where pe.plan_key = 'free'
      order by pe.entitlement_key;
  end if;
end $$;

create or replace function public.has_entitlement(p_key text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.effective_entitlements() e where e.entitlement_key = p_key
  );
$$;

create or replace function public.require_entitlement(p_key text)
returns void language plpgsql stable security definer set search_path = public as $$
begin
  if not public.has_entitlement(p_key) then
    raise exception 'Entitlement required: %', p_key using errcode = '42501';
  end if;
end $$;

-- Safe snapshot for the website and the desktop application. Contains no
-- provider customer ID, checkout ID, payment credentials, or secrets.
create or replace function public.entitlement_snapshot()
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'plan_key', public.current_plan_key(),
    'evaluated_at', now(),
    'entitlements', coalesce((
      select jsonb_agg(e.entitlement_key order by e.entitlement_key)
      from public.effective_entitlements() e
    ), '[]'::jsonb),
    'subscription', (
      select jsonb_build_object(
        'status', s.status,
        'plan_key', s.plan_key,
        'provider', s.provider,
        'current_period_start', s.current_period_start,
        'current_period_end', s.current_period_end,
        'cancel_at_period_end', s.cancel_at_period_end,
        'trial_end', s.trial_end
      )
      from public.subscriptions s
      where s.user_id = auth.uid()
      order by s.created_at desc
      limit 1
    )
  );
$$;

grant execute on function public.current_plan_key() to authenticated, service_role;
grant execute on function public.effective_entitlements() to authenticated, service_role;
grant execute on function public.has_entitlement(text) to authenticated, service_role;
grant execute on function public.require_entitlement(text) to authenticated, service_role;
grant execute on function public.entitlement_snapshot() to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- SERVER-ONLY BILLING FUNCTIONS
-- ---------------------------------------------------------------------------

-- Idempotent webhook registration. Returns {"status":"received"} or
-- {"status":"duplicate"}. Only a server that verified the signature may call.
create or replace function public.billing_register_event(
  p_provider text,
  p_event_id text,
  p_event_type text,
  p_payload jsonb,
  p_signature_verified boolean
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_id uuid;
begin
  if not p_signature_verified then
    raise exception 'Webhook signature not verified.';
  end if;
  if p_provider is null or btrim(p_provider) = '' then raise exception 'Provider is required.'; end if;
  if p_event_id is null or btrim(p_event_id) = '' then raise exception 'Event ID is required.'; end if;

  insert into public.provider_events
    (provider, provider_event_id, event_type, payload, signature_verified, status)
  values (p_provider, p_event_id, coalesce(p_event_type,'unknown'), coalesce(p_payload,'{}'::jsonb), true, 'received')
  on conflict (provider, provider_event_id) do nothing
  returning id into v_id;

  if v_id is null then
    return jsonb_build_object('status', 'duplicate');
  end if;
  return jsonb_build_object('status', 'received', 'id', v_id);
end $$;

create or replace function public.billing_finish_event(
  p_provider text,
  p_event_id text,
  p_status text,
  p_error text
) returns void language plpgsql security definer set search_path = public as $$
begin
  if p_status not in ('processed','ignored','error') then
    raise exception 'Invalid event status.';
  end if;
  update public.provider_events
    set status = p_status, error = left(coalesce(p_error,''), 1000), processed_at = now()
    where provider = p_provider and provider_event_id = p_event_id;
end $$;

-- Create a pending subscription before redirecting to checkout. The server
-- passes the price found by its own lookup; the browser amount is never used.
create or replace function public.billing_create_pending_subscription(
  p_provider text,
  p_user_id uuid,
  p_plan_key text,
  p_price_id uuid,
  p_checkout_session_id text
) returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_id uuid;
  v_price public.prices;
begin
  if not exists (select 1 from auth.users where id = p_user_id) then
    raise exception 'Unknown user.';
  end if;
  if p_plan_key not in ('free','pro') or p_plan_key = 'free' then
    raise exception 'Only Pro can be purchased.';
  end if;
  select * into v_price from public.prices
    where id = p_price_id and plan_key = p_plan_key and provider = p_provider and is_active;
  if not found then raise exception 'Unknown or inactive price.'; end if;

  if exists (
    select 1 from public.subscriptions
    where user_id = p_user_id and status in ('trialing','active','past_due')
  ) then
    raise exception 'An active subscription already exists for this user.';
  end if;

  insert into public.subscriptions
    (user_id, plan_key, price_id, status, provider, provider_checkout_session_id)
  values (p_user_id, p_plan_key, p_price_id, 'pending', p_provider, p_checkout_session_id)
  on conflict (provider, provider_checkout_session_id) do update set updated_at = now()
  returning id into v_id;

  insert into public.subscription_events (subscription_id, user_id, event_type, to_status, source)
  values (v_id, p_user_id, 'checkout.pending', 'pending', 'checkout');

  return v_id;
end $$;

-- Apply an authoritative subscription state from a verified webhook, the
-- reconciliation job, or an authorised server action. Idempotent by provider
-- subscription ID.
create or replace function public.billing_apply_subscription_state(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_sub public.subscriptions;
  v_id uuid;
  v_user uuid := nullif(p_payload->>'user_id','')::uuid;
  v_provider text := p_payload->>'provider';
  v_provider_sub text := nullif(p_payload->>'provider_subscription_id','');
  v_checkout text := nullif(p_payload->>'provider_checkout_session_id','');
  v_customer text := nullif(p_payload->>'provider_customer_id','');
  v_status text := p_payload->>'status';
  v_plan text := coalesce(nullif(p_payload->>'plan_key',''), 'pro');
  v_from text;
  v_period_start timestamptz := nullif(p_payload->>'current_period_start','')::timestamptz;
  v_period_end timestamptz := nullif(p_payload->>'current_period_end','')::timestamptz;
  v_trial_end timestamptz := nullif(p_payload->>'trial_end','')::timestamptz;
  v_cancel boolean := coalesce((p_payload->>'cancel_at_period_end')::boolean, false);
  v_occurred timestamptz := coalesce(nullif(p_payload->>'occurred_at','')::timestamptz, now());
  v_event text := coalesce(nullif(p_payload->>'event_type',''), 'subscription.updated');
  v_event_id text := nullif(p_payload->>'provider_event_id','');
  v_live boolean;
begin
  if v_provider is null or btrim(v_provider) = '' then raise exception 'Provider is required.'; end if;
  if v_provider_sub is null then raise exception 'Provider subscription ID is required.'; end if;
  if v_status not in ('pending','trialing','active','past_due','cancelled','expired','refunded') then
    raise exception 'Invalid subscription status.';
  end if;
  if v_status in ('trialing','active') and v_period_end is null then
    raise exception 'An active subscription requires current_period_end.';
  end if;
  if v_plan not in ('free','pro') or v_plan = 'free' then
    raise exception 'Invalid paid plan.';
  end if;

  select * into v_sub from public.subscriptions
    where provider = v_provider and provider_subscription_id = v_provider_sub
    for update;

  if not found and v_checkout is not null then
    select * into v_sub from public.subscriptions
      where provider = v_provider and provider_checkout_session_id = v_checkout
      for update;
  end if;

  if found then
    if v_sub.user_id is not null and v_user is not null and v_sub.user_id <> v_user then
      raise exception 'Subscription user mismatch.';
    end if;
    v_id := v_sub.id;
    v_user := coalesce(v_sub.user_id, v_user);
    v_from := v_sub.status;

    update public.subscriptions set
      user_id = v_user,
      plan_key = v_plan,
      status = v_status,
      provider_customer_id = coalesce(v_customer, provider_customer_id),
      provider_subscription_id = coalesce(v_provider_sub, provider_subscription_id),
      provider_checkout_session_id = coalesce(v_checkout, provider_checkout_session_id),
      provider_status = coalesce(nullif(p_payload->>'provider_status',''), provider_status),
      current_period_start = coalesce(v_period_start, current_period_start),
      current_period_end = coalesce(v_period_end, current_period_end, now()),
      trial_end = coalesce(v_trial_end, trial_end),
      cancel_at_period_end = v_cancel,
      cancelled_at = case when v_status in ('cancelled','expired','refunded') then coalesce(cancelled_at, v_occurred) else cancelled_at end,
      ended_at = case when v_status in ('cancelled','expired','refunded') then coalesce(ended_at, v_occurred) else null end,
      last_verified_at = now(),
      metadata = coalesce(nullif(p_payload->>'metadata','')::jsonb, metadata),
      updated_at = now()
    where id = v_id;
  else
    if v_user is null then raise exception 'user_id is required for a new subscription.'; end if;
    insert into public.subscriptions
      (user_id, plan_key, status, provider, provider_customer_id,
       provider_checkout_session_id, provider_subscription_id, provider_status,
       current_period_start, current_period_end, trial_end, cancel_at_period_end,
       cancelled_at, ended_at, last_verified_at, metadata)
    values
      (v_user, v_plan, v_status, v_provider, v_customer,
       v_checkout, v_provider_sub, nullif(p_payload->>'provider_status',''),
       v_period_start, v_period_end, v_trial_end, v_cancel,
       case when v_status in ('cancelled','expired','refunded') then v_occurred else null end,
       case when v_status in ('cancelled','expired','refunded') then v_occurred else null end,
       now(), coalesce(nullif(p_payload->>'metadata','')::jsonb, '{}'::jsonb))
    returning id into v_id;
    v_from := null;
  end if;

  if v_customer is not null and v_user is not null then
    insert into public.billing_customers (user_id, provider, provider_customer_id)
    values (v_user, v_provider, v_customer)
    on conflict (user_id) do update set
      provider = excluded.provider,
      provider_customer_id = excluded.provider_customer_id,
      updated_at = now();
  end if;

  insert into public.subscription_events
    (subscription_id, user_id, event_type, from_status, to_status, source,
     provider_event_id, occurred_at, metadata)
  values
    (v_id, v_user, v_event, v_from, v_status,
     coalesce(nullif(p_payload->>'source',''), 'webhook'),
     v_event_id, v_occurred, coalesce(nullif(p_payload->>'metadata','')::jsonb, '{}'::jsonb));

  v_live := v_status in ('trialing','active') and v_period_end is not null and v_period_end > now();

  if v_live and v_user is not null then
    insert into public.entitlement_grants
      (user_id, entitlement_key, subscription_id, source, expires_at, provider_event_id)
    select v_user, pe.entitlement_key, v_id, 'subscription', v_period_end, v_event_id
    from public.plan_entitlements pe
    where pe.plan_key = 'pro'
    on conflict (user_id, entitlement_key, subscription_id) where revoked_at is null
    do update set expires_at = excluded.expires_at, provider_event_id = excluded.provider_event_id;

    update public.entitlement_grants
      set expires_at = v_period_end
      where subscription_id = v_id and revoked_at is null;
  else
    update public.entitlement_grants
      set revoked_at = coalesce(revoked_at, v_occurred)
      where subscription_id = v_id and revoked_at is null;
  end if;

  return jsonb_build_object(
    'subscription_id', v_id,
    'user_id', v_user,
    'status', v_status,
    'effective_plan', case when v_live then 'pro' else 'free' end
  );
end $$;

-- Idempotent transaction recording. A successful refund marks the related
-- subscription refunded and revokes entitlements immediately.
create or replace function public.billing_record_transaction(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_provider text := p_payload->>'provider';
  v_txn text := p_payload->>'provider_transaction_id';
  v_kind text := p_payload->>'kind';
  v_status text := p_payload->>'status';
  v_sub_id uuid := nullif(p_payload->>'subscription_id','')::uuid;
  v_provider_sub text := nullif(p_payload->>'provider_subscription_id','');
  v_user uuid := nullif(p_payload->>'user_id','')::uuid;
  v_amount bigint := coalesce((p_payload->>'amount_cents')::bigint, 0);
  v_currency text := lower(coalesce(p_payload->>'currency','usd'));
  v_id uuid;
  v_inserted boolean := false;
begin
  if v_provider is null or btrim(v_provider) = '' then raise exception 'Provider is required.'; end if;
  if v_txn is null or btrim(v_txn) = '' then raise exception 'Transaction ID is required.'; end if;
  if v_kind not in ('payment','refund','adjustment') then raise exception 'Invalid transaction kind.'; end if;
  if v_status not in ('pending','succeeded','failed','refunded') then raise exception 'Invalid transaction status.'; end if;
  if v_amount < 0 then raise exception 'Amount cannot be negative.'; end if;
  if v_currency !~ '^[a-z]{3}$' then raise exception 'Invalid currency.'; end if;

  if v_sub_id is null and v_provider_sub is not null then
    select s.id, coalesce(v_user, s.user_id) into v_sub_id, v_user
      from public.subscriptions s
      where s.provider = v_provider and s.provider_subscription_id = v_provider_sub;
  elsif v_sub_id is not null then
    v_user := coalesce(v_user, (select user_id from public.subscriptions where id = v_sub_id));
  end if;

  insert into public.payment_transactions
    (user_id, subscription_id, provider, provider_transaction_id, kind, status,
     amount_cents, currency, description, occurred_at)
  values
    (v_user, v_sub_id, v_provider, v_txn, v_kind, v_status,
     v_amount, v_currency, coalesce(p_payload->>'description',''),
     coalesce(nullif(p_payload->>'occurred_at','')::timestamptz, now()))
  on conflict (provider, provider_transaction_id) do nothing
  returning id into v_id;

  if v_id is not null then
    v_inserted := true;
  else
    select id into v_id from public.payment_transactions
      where provider = v_provider and provider_transaction_id = v_txn;
    update public.payment_transactions set
      status = v_status,
      subscription_id = coalesce(v_sub_id, subscription_id),
      user_id = coalesce(v_user, user_id),
      amount_cents = v_amount,
      description = coalesce(p_payload->>'description', description)
    where id = v_id;
  end if;

  if v_kind = 'refund' and v_status = 'succeeded' and v_sub_id is not null then
    update public.subscriptions set
      status = 'refunded', cancelled_at = coalesce(cancelled_at, now()),
      ended_at = now(), last_verified_at = now(), updated_at = now()
    where id = v_sub_id and status <> 'refunded';

    if found then
      insert into public.subscription_events
        (subscription_id, user_id, event_type, to_status, source, provider_event_id, metadata)
      values
        (v_sub_id, v_user, 'subscription.refunded', 'refunded', 'webhook',
         nullif(p_payload->>'provider_event_id',''),
         jsonb_build_object('transaction_id', v_txn));
    end if;

    update public.entitlement_grants set revoked_at = coalesce(revoked_at, now())
      where subscription_id = v_sub_id and revoked_at is null;
  end if;

  return jsonb_build_object('transaction_id', v_id, 'duplicate', not v_inserted);
end $$;

-- Cancel at period end (default) or immediately. The server must first ask the
-- payment provider to cancel; this records the resulting authoritative state.
create or replace function public.billing_set_cancellation(
  p_subscription_id uuid,
  p_at_period_end boolean,
  p_source text,
  p_provider_event_id text
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_sub public.subscriptions;
begin
  select * into v_sub from public.subscriptions where id = p_subscription_id for update;
  if not found then raise exception 'Unknown subscription.'; end if;

  if p_at_period_end then
    update public.subscriptions set
      cancel_at_period_end = true,
      cancelled_at = coalesce(cancelled_at, now()),
      last_verified_at = now(),
      updated_at = now()
    where id = p_subscription_id;

    insert into public.subscription_events
      (subscription_id, user_id, event_type, from_status, to_status, source, provider_event_id)
    values
      (p_subscription_id, v_sub.user_id, 'subscription.cancel_scheduled',
       v_sub.status, v_sub.status, coalesce(p_source,'api'), p_provider_event_id);
  else
    update public.subscriptions set
      status = 'cancelled',
      cancel_at_period_end = false,
      cancelled_at = now(),
      ended_at = now(),
      last_verified_at = now(),
      updated_at = now()
    where id = p_subscription_id;

    update public.entitlement_grants set revoked_at = coalesce(revoked_at, now())
      where subscription_id = p_subscription_id and revoked_at is null;

    insert into public.subscription_events
      (subscription_id, user_id, event_type, from_status, to_status, source, provider_event_id)
    values
      (p_subscription_id, v_sub.user_id, 'subscription.cancelled',
       v_sub.status, 'cancelled', coalesce(p_source,'api'), p_provider_event_id);
  end if;

  return jsonb_build_object(
    'subscription_id', p_subscription_id,
    'status', case when p_at_period_end then v_sub.status else 'cancelled' end,
    'cancel_at_period_end', p_at_period_end
  );
end $$;

-- Expire subscriptions whose paid-through time has passed. Safe to run from a
-- scheduled job or the reconciliation endpoint.
create or replace function public.billing_expire_stale_subscriptions()
returns int language plpgsql security definer set search_path = public as $$
declare
  v_row record;
  v_count int := 0;
begin
  for v_row in
    select * from public.subscriptions
    where status in ('active','trialing','past_due')
      and current_period_end is not null
      and current_period_end <= now()
    for update
  loop
    update public.subscriptions set
      status = 'expired',
      ended_at = coalesce(ended_at, v_row.current_period_end, now()),
      updated_at = now()
    where id = v_row.id;

    update public.entitlement_grants set revoked_at = coalesce(revoked_at, now())
      where subscription_id = v_row.id and revoked_at is null;

    insert into public.subscription_events
      (subscription_id, user_id, event_type, from_status, to_status, source)
    values
      (v_row.id, v_row.user_id, 'subscription.expired', v_row.status, 'expired', 'maintenance');

    v_count := v_count + 1;
  end loop;
  return v_count;
end $$;

-- Lock all server-only billing RPCs to the service role. No anon/authenticated
-- caller can forge a subscription, event, price, grant, or transaction.
do $$
declare fn text;
begin
  foreach fn in array array[
    'billing_register_event(text,text,text,jsonb,boolean)',
    'billing_finish_event(text,text,text,text)',
    'billing_create_pending_subscription(text,uuid,text,uuid,text)',
    'billing_apply_subscription_state(jsonb)',
    'billing_record_transaction(jsonb)',
    'billing_set_cancellation(uuid,boolean,text,text)',
    'billing_expire_stale_subscriptions()'
  ] loop
    execute format('revoke all on function public.%s from public, anon, authenticated', fn);
    execute format('grant execute on function public.%s to service_role', fn);
  end loop;
end $$;
