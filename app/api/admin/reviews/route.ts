import { NextResponse } from 'next/server';
import { sql, ensureSchema } from '@/lib/db';
import { verifyAdmin } from '@/lib/admin-auth';

export async function GET(request: Request) {
    // Password comes in via header, never the URL — keeps it out of logs/history.
    const password = request.headers.get('x-admin-password');
    const auth = await verifyAdmin(request, password);
    if (!auth.ok) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
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
        console.error('Admin reviews GET error:', err);
        return NextResponse.json({ error: 'Could not load reviews' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { id, status, password } = body as Record<string, string>;

    const auth = await verifyAdmin(request, password);
    if (!auth.ok) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    if (!id || !['approved', 'rejected'].includes(status)) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    try {
        const rows = await sql`
            UPDATE reviews SET status = ${status} WHERE id = ${id} RETURNING id
        `;
        if (rows.length === 0) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        }
        return NextResponse.json({ message: `Review ${status}` });
    } catch (err) {
        console.error('Admin reviews PATCH error:', err);
        return NextResponse.json({ error: 'Could not update review' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { id, password } = body as Record<string, string>;

    const auth = await verifyAdmin(request, password);
    if (!auth.ok) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await sql`DELETE FROM reviews WHERE id = ${id}`;
        return NextResponse.json({ message: 'Review deleted' });
    } catch (err) {
        console.error('Admin reviews DELETE error:', err);
        return NextResponse.json({ error: 'Could not delete review' }, { status: 500 });
    }
}
