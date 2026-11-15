import { ApiError } from './http';

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/**
 * Best-effort per-instance limiter. Serverless/edge instances do not share
 * memory, so this is a first line of defence, not a global quota. Production
 * deployments should also enable the provider's rate limits and a shared
 * limiter (for example Upstash Redis or Vercel KV). See docs/ARCHITECTURE.md.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): void {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  if (current.count >= limit) {
    const retrySeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    throw new ApiError(429, 'RATE_LIMITED', `Too many requests. Try again in ${retrySeconds}s.`);
  }
  current.count += 1;
}

/** Test-only helper. */
export function resetRateLimits(): void {
  buckets.clear();
}
