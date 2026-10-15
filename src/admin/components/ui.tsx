import React, { useEffect, useRef } from 'react';

/* ------------------------------------------------------------------------- */
/* Admin-only design primitives. Scoped to the dark navy LinkDit Pad identity */
/* (dark navy base, cyan/blue and gold accents). These classes are only ever   */
/* rendered inside the lazy-loaded /admin bundle, so they never affect the     */
/* public website or its Tailwind theme tokens.                               */
/* ------------------------------------------------------------------------- */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/* ------------------------------ Buttons --------------------------------- */

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'gold';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 focus-visible:outline-cyan-400 font-semibold',
  secondary: 'bg-[#1b2942] text-slate-100 hover:bg-[#233453] border border-[#2a3a5c]',
  danger: 'bg-rose-600 text-white hover:bg-rose-500 font-semibold',
  ghost: 'bg-transparent text-slate-300 hover:bg-[#1b2942] hover:text-white',
  gold: 'bg-amber-400 text-slate-950 hover:bg-amber-300 font-semibold',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  loading,
  className,
  children,
  disabled,
  ...rest
}) => (
  <button
    {...rest}
    disabled={disabled || loading}
    className={cx(
      'inline-flex items-center justify-center gap-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
      size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-sm',
      BUTTON_VARIANTS[variant],
      className,
    )}
  >
    {loading && <Spinner className="h-3.5 w-3.5" />}
    {children}
  </button>
);

/* ------------------------------ Spinner --------------------------------- */

export const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={cx('animate-spin', className ?? 'h-4 w-4')} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

/* ------------------------------ Status badge ---------------------------- */

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  approved: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  active: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  draft: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  archived: 'bg-slate-600/15 text-slate-400 border-slate-600/30',
  submitted: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  in_review: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  rejected: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  inactive: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  restricted: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  ordinary: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
};

export const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className }) => (
  <span
    className={cx(
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize',
      STATUS_STYLES[status] ?? 'bg-slate-500/15 text-slate-300 border-slate-500/30',
      className,
    )}
  >
    {status.replace(/_/g, ' ')}
  </span>
);

/* ------------------------------ Form fields ----------------------------- */

interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({ label, htmlFor, hint, error, required, children }) => (
  <div className="space-y-1.5">
    <label htmlFor={htmlFor} className="block text-xs font-medium text-slate-300">
      {label} {required && <span className="text-rose-400">*</span>}
    </label>
    {children}
    {hint && !error && <p className="text-[11px] text-slate-500">{hint}</p>}
    {error && (
      <p className="text-[11px] text-rose-400" role="alert">
        {error}
      </p>
    )}
  </div>
);

const INPUT_CLASS =
  'w-full rounded-md border border-[#2a3a5c] bg-[#0b1220] px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50';

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...rest }) => (
  <input {...rest} className={cx(INPUT_CLASS, className)} />
);

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...rest }) => (
  <textarea {...rest} className={cx(INPUT_CLASS, 'font-mono text-[13px] leading-relaxed', className)} />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className, children, ...rest }) => (
  <select {...rest} className={cx(INPUT_CLASS, 'appearance-none', className)}>
    {children}
  </select>
);

/* ------------------------------ Panels ---------------------------------- */

export const Panel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cx('rounded-lg border border-[#1e2a44] bg-[#0f172a]', className)}>{children}</div>
);

export const SectionHeader: React.FC<{ title: string; description?: string; actions?: React.ReactNode }> = ({
  title,
  description,
  actions,
}) => (
  <div className="flex flex-wrap items-start justify-between gap-3">
    <div>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-slate-400">{description}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

/* ------------------------------ Alerts ---------------------------------- */

const ALERT_STYLES = {
  error: 'border-rose-500/40 bg-rose-500/10 text-rose-200',
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
  info: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-100',
  warning: 'border-amber-500/40 bg-amber-500/10 text-amber-100',
};

export const Alert: React.FC<{ tone?: keyof typeof ALERT_STYLES; children: React.ReactNode; className?: string }> = ({
  tone = 'info',
  children,
  className,
}) => (
  <div
    role={tone === 'error' ? 'alert' : 'status'}
    className={cx('rounded-md border px-3.5 py-2.5 text-sm', ALERT_STYLES[tone], className)}
  >
    {children}
  </div>
);

/* ------------------------------ Empty / loading ------------------------- */

export const EmptyState: React.FC<{ title: string; description?: string; action?: React.ReactNode }> = ({
  title,
  description,
  action,
}) => (
  <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#2a3a5c] bg-[#0b1220] px-6 py-14 text-center">
    <p className="text-sm font-medium text-slate-300">{title}</p>
    {description && <p className="max-w-md text-xs text-slate-500">{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export const LoadingBlock: React.FC<{ label?: string }> = ({ label = 'Loading…' }) => (
  <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-400" role="status">
    <Spinner /> {label}
  </div>
);

/* ------------------------------ Modal ----------------------------------- */

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  labelledBy?: string;
}

export const Modal: React.FC<ModalProps> = ({ open, title, onClose, children, footer }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const first = ref.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    first?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:p-8">
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="my-8 w-full max-w-lg rounded-lg border border-[#1e2a44] bg-[#0f172a] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#1e2a44] px-5 py-3.5">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded p-1 text-slate-400 hover:bg-[#1b2942] hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-[#1e2a44] px-5 py-3.5">{footer}</div>}
      </div>
    </div>
  );
};

/* ------------------------------ Confirm dialog -------------------------- */

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  /** Optional reason field (required for restricted/owner-direct ops). */
  reason?: { required?: boolean; label?: string; value: string; onChange: (v: string) => void; hint?: string };
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  destructive,
  loading,
  onConfirm,
  onCancel,
  reason,
}) => (
  <Modal
    open={open}
    title={title}
    onClose={onCancel}
    footer={
      <>
        <Button variant="ghost" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant={destructive ? 'danger' : 'primary'}
          onClick={onConfirm}
          loading={loading}
          disabled={Boolean(reason?.required) && reason?.value.trim().length === 0}
        >
          {confirmLabel}
        </Button>
      </>
    }
  >
    <p className="text-sm text-slate-300">{message}</p>
    {reason && (
      <div className="mt-4">
        <Field label={reason.label ?? 'Reason'} required={reason.required} hint={reason.hint}>
          <Textarea
            rows={3}
            value={reason.value}
            onChange={(e) => reason.onChange(e.target.value)}
            placeholder="Explain this action for the audit log…"
          />
        </Field>
      </div>
    )}
  </Modal>
);

/* ------------------------------ Table ----------------------------------- */

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#1e2a44]">
      <table className="w-full min-w-[640px] border-collapse text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children?: React.ReactNode; className?: string; key?: React.Key }) {
  return (
    <th
      scope="col"
      className={cx(
        'border-b border-[#1e2a44] bg-[#0b1220] px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400',
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }: { children: React.ReactNode; className?: string; key?: React.Key }) {
  return <td className={cx('border-b border-[#16203a] px-4 py-3 align-top text-slate-300', className)}>{children}</td>;
}

export const Mono: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <span className={cx('font-mono text-[12px] text-slate-400', className)}>{children}</span>
);
