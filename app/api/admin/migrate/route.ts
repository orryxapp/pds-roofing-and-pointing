import { NextResponse } from 'next/server';
import { sql, ensureSchema } from '@/lib/db';
import fs from 'fs';
import path from 'path';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function isAuthorized(password: string | null | undefined) {
    return ADMIN_PASSWORD && password === ADMIN_PASSWORD;
}

interface SeedReview {
    id: string;
    name: string;
    location: string;
    content: string;
    rating: number;
    date: string;
    jobType: string;
    status: string;
    source: string;
}

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');

    if (!isAuthorized(password)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await ensureSchema();

        const dataPath = path.join(process.cwd(), 'data', 'reviews.json');
        const file = fs.readFileSync(dataPath, 'utf-8');
        const reviews: SeedReview[] = JSON.parse(file);

        let imported = 0;
        let skipped = 0;
        for (const r of reviews) {
            const existing = await sql`SELECT id FROM reviews WHERE id = ${r.id}`;
            if (existing.length > 0) {
                skipped++;
                continue;
            }
            await sql`
                INSERT INTO reviews (id, name, location, content, rating, date, job_type, status, source)
                VALUES (${r.id}, ${r.name}, ${r.location}, ${r.content}, ${r.rating}, ${r.date}, ${r.jobType}, ${r.status}, ${r.source})
            `;
            imported++;
        }

        return NextResponse.json({ message: `Migration complete`, imported, skipped });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
