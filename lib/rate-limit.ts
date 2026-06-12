import { sql } from './db';

let schemaReady = false;

async function ensureRateLimitSchema() {
    if (schemaReady) return;
    await sql`
        CREATE TABLE IF NOT EXISTS rate_limits (
            id BIGSERIAL PRIMARY KEY,
            action TEXT NOT NULL,
            identifier TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup ON rate_limits (action, identifier, created_at)`;
    schemaReady = true;
}

/** Best-effort client IP from Vercel's forwarding headers. */
export function getClientIp(request: Request): string {
    const fwd = request.headers.get('x-forwarded-for');
    if (fwd) return fwd.split(',')[0].trim();
    return request.headers.get('x-real-ip') || 'unknown';
}

/** Number of recorded hits for an action+identifier within the window. */
export async function countRecent(action: string, identifier: string, windowMinutes: number): Promise<number> {
    await ensureRateLimitSchema();
    const rows = await sql`
        SELECT COUNT(*)::int AS count FROM rate_limits
        WHERE action = ${action}
          AND identifier = ${identifier}
          AND created_at > NOW() - make_interval(mins => ${windowMinutes})
    `;
    return (rows[0]?.count as number) ?? 0;
}

/** Record a single hit, and opportunistically prune rows older than a day. */
export async function recordHit(action: string, identifier: string): Promise<void> {
    await ensureRateLimitSchema();
    await sql`INSERT INTO rate_limits (action, identifier) VALUES (${action}, ${identifier})`;
    await sql`DELETE FROM rate_limits WHERE created_at < NOW() - make_interval(days => 1)`;
}

/**
 * Returns true if the request is under the limit (and records the hit).
 * Returns false if the limit has already been reached — the hit is NOT recorded.
 */
export async function allowRequest(
    action: string,
    identifier: string,
    max: number,
    windowMinutes: number,
): Promise<boolean> {
    const count = await countRecent(action, identifier, windowMinutes);
    if (count >= max) return false;
    await recordHit(action, identifier);
    return true;
}
