import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL!);

export interface Review {
    id: string;
    name: string;
    location: string;
    content: string;
    rating: number;
    date: string;
    job_type: string;
    status: string;
    source: string;
}

export async function ensureSchema() {
    await sql`
        CREATE TABLE IF NOT EXISTS reviews (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            content TEXT NOT NULL,
            rating INTEGER NOT NULL,
            date TEXT NOT NULL,
            job_type TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            source TEXT NOT NULL DEFAULT 'website',
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `;
}
