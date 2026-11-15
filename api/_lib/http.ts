const NO_STORE = {
  'Cache-Control': 'no-store, max-age=0',
  'Content-Type': 'application/json; charset=utf-8',
};

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...NO_STORE, ...extraHeaders },
  });
}

export function apiError(status: number, code: string, message: string): Response {
  return json({ error: { code, message } }, status);
}

export function handleError(error: unknown): Response {
  if (error instanceof ApiError) {
    return apiError(error.status, error.code, error.message);
  }
  console.error('[api] unhandled error', error instanceof Error ? error.message : String(error));
  return apiError(500, 'INTERNAL_ERROR', 'An unexpected server error occurred.');
}

export function methodNotAllowed(allowed: string[]): Response {
  return json(
    { error: { code: 'METHOD_NOT_ALLOWED', message: `Use ${allowed.join(', ')}.` } },
    405,
    { Allow: allowed.join(', ') },
  );
}

export function requireMethod(request: Request, method: string): void {
  if (request.method !== method) {
    throw new ApiError(405, 'METHOD_NOT_ALLOWED', `Use ${method}.`);
  }
}

export async function readJsonObject(request: Request): Promise<Record<string, unknown>> {
  const raw = await request.text();
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('not an object');
    }
    return parsed as Record<string, unknown>;
  } catch {
    throw new ApiError(400, 'INVALID_JSON', 'Request body must be a JSON object.');
  }
}

export function bearerToken(request: Request): string | undefined {
  const header = request.headers.get('authorization') ?? '';
  const match = /^Bearer\s+(.+)$/i.exec(header);
  return match?.[1]?.trim() || undefined;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip') ?? 'unknown';
}
