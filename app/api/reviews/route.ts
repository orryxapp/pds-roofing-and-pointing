import { NextResponse } from 'next/server';
import { sql, ensureSchema } from '@/lib/db';
import { getClientIp, allowRequest } from '@/lib/rate-limit';

// Max review submissions per IP per hour (keeps the moderation queue clean).
const MAX_PER_HOUR = 5;

export async function GET() {
    try {
        await ensureSchema();
        const rows = await sql`
            SELECT id, name, location, content, rating, date, job_type, status, source
            FROM reviews
            WHERE status = 'approved'
            ORDER BY created_at DESC
        `;
        const reviews = rows.map((r) => ({
            id: r.id,
            name: r.name,
            location: r.location,
            content: r.content,
            rating: r.rating,
            date: r.date,
            jobType: r.job_type,
            status: r.status,
            source: r.source,
        }));
        return NextResponse.json(reviews);
    } catch (err) {
        console.error('Reviews GET error:', err);
        return NextResponse.json({ error: 'Could not load reviews' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { name, location, content, rating, jobType, hp_field } = body as Record<string, string>;

    // Honeypot: silently accept bot submissions without storing them.
    if (hp_field) {
        return NextResponse.json({ message: 'Review submitted for approval' }, { status: 201 });
    }

    if (!name || !location || !content || !rating || !jobType) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    try {
        await ensureSchema();

        try {
            const ip = getClientIp(request);
            const allowed = await allowRequest('review', ip, MAX_PER_HOUR, 60);
            if (!allowed) {
                return NextResponse.json(
                    { error: "You've submitted several reviews recently. Please try again later." },
                    { status: 429 },
                );
            }
        } catch (err) {
            console.error('Rate limit check failed:', err);
        }

        const id = `web-${Date.now()}`;
        const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

        await sql`
            INSERT INTO reviews (id, name, location, content, rating, date, job_type, status, source)
            VALUES (${id}, ${String(name).trim()}, ${String(location).trim()}, ${String(content).trim()}, ${ratingNum}, ${date}, ${String(jobType).trim()}, 'pending', 'website')
        `;

        return NextResponse.json({ message: 'Review submitted for approval' }, { status: 201 });
    } catch (err) {
        console.error('Reviews POST error:', err);
        return NextResponse.json({ error: 'Could not submit your review. Please try again.' }, { status: 500 });
    }
}
