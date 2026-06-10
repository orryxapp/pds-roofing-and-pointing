import { NextResponse } from 'next/server';
import { sql, ensureSchema } from '@/lib/db';

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
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await ensureSchema();
        const body = await request.json();
        const { name, location, content, rating, jobType } = body;

        if (!name || !location || !content || !rating || !jobType) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
        }

        const id = `web-${Date.now()}`;
        const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

        await sql`
            INSERT INTO reviews (id, name, location, content, rating, date, job_type, status, source)
            VALUES (${id}, ${name.trim()}, ${location.trim()}, ${content.trim()}, ${Number(rating)}, ${date}, ${jobType.trim()}, 'pending', 'website')
        `;

        return NextResponse.json({ message: 'Review submitted for approval' }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
