import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'reviews.json');

function readReviews() {
    const data = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(data);
}

function writeReviews(reviews: unknown[]) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(reviews, null, 2));
}

export async function GET() {
    const reviews = readReviews();
    const approved = reviews.filter((r: { status: string }) => r.status === 'approved');
    return NextResponse.json(approved);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { name, location, content, rating, jobType } = body;

    if (!name || !location || !content || !rating || !jobType) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
        return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const reviews = readReviews();
    const newReview = {
        id: `web-${Date.now()}`,
        name: name.trim(),
        location: location.trim(),
        content: content.trim(),
        rating: Number(rating),
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        jobType: jobType.trim(),
        status: 'pending',
        source: 'website',
    };

    reviews.push(newReview);
    writeReviews(reviews);

    return NextResponse.json({ message: 'Review submitted for approval' }, { status: 201 });
}
