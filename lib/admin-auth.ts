import { createHash, timingSafeEqual } from 'crypto';
import { getClientIp, countRecent, recordHit } from './rate-limit';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const MAX_FAILURES = 10;
const WINDOW_MINUTES = 15;

/** Length-safe, constant-time string comparison (compares SHA-256 digests). */
function safeEqual(a: string, b: string): boolean {
    const ha = createHash('sha256').update(a).digest();
    const hb = createHash('sha256').update(b).digest();
    return timingSafeEqual(ha, hb);
}

export interface AuthResult {
    ok: boolean;
    status: number;
    error?: string;
}

/**
 * Verifies the admin password while rate-limiting failed attempts per IP.
 * After MAX_FAILURES bad tries within WINDOW_MINUTES, further attempts from
 * that IP are blocked (429) until the window passes — even correct ones.
 */
export async function verifyAdmin(
    request: Request,
    password: string | null | undefined,
): Promise<AuthResult> {
    const ip = getClientIp(request);

    const failures = await countRecent('admin_fail', ip, WINDOW_MINUTES);
    if (failures >= MAX_FAILURES) {
        return { ok: false, status: 429, error: 'Too many attempts. Please wait 15 minutes and try again.' };
    }

    if (!ADMIN_PASSWORD || !password || !safeEqual(password, ADMIN_PASSWORD)) {
        await recordHit('admin_fail', ip);
        return { ok: false, status: 401, error: 'Incorrect password' };
    }

    return { ok: true, status: 200 };
}
