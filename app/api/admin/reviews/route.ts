import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'reviews.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function isAuthorized(password: string | null | undefined) {
    return ADMIN_PASSWORD && password === ADMIN_PASSWORD;
}

function readReviews() {
    const data = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(data);
}

function writeReviews(reviews: unknown[]) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(reviews, null, 2));
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');

    if (!isAuthorized(password)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reviews = readReviews();
    return NextResponse.json(reviews);
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

    const reviews = readReviews();
    const review = reviews.find((r: { id: string }) => r.id === id);
    if (!review) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    review.status = status;
    writeReviews(reviews);

    return NextResponse.json({ message: `Review ${status}` });
}

export async function DELETE(request: Request) {
    const body = await request.json();
    const { id, password } = body;

    if (!isAuthorized(password)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let reviews = readReviews();
    const before = reviews.length;
    reviews = reviews.filter((r: { id: string }) => r.id !== id);

    if (reviews.length === before) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    writeReviews(reviews);
    return NextResponse.json({ message: 'Review deleted' });
}
