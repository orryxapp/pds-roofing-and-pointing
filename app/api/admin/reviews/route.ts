import { NextResponse } from 'next/server';
import { sql, ensureSchema } from '@/lib/db';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function isAuthorized(password: string | null | undefined) {
    return ADMIN_PASSWORD && password === ADMIN_PASSWORD;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');

    if (!isAuthorized(password)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await ensureSchema();
        const rows = await sql`
            SELECT id, name, location, content, rating, date, job_type, status, source
            FROM reviews
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
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const body = await request.json();
    const { id, status, password } = body;

    if (!isAuthorized(password)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!id || !['approved', 'rejected'].includes(status)) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    try {
        const result = await sql`
            UPDATE reviews SET status = ${status} WHERE id = ${id}
        `;
        if (result.length === 0 && (result as { rowCount?: number }).rowCount === 0) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        }
        return NextResponse.json({ message: `Review ${status}` });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const body = await request.json();
    const { id, password } = body;

    if (!isAuthorized(password)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await sql`DELETE FROM reviews WHERE id = ${id}`;
        return NextResponse.json({ message: 'Review deleted' });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
