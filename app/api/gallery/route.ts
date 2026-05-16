import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET() {
    try {
        const { blobs } = await list({ prefix: 'gallery/' });
        const images = blobs.map(blob => ({
            url: blob.url,
            pathname: blob.pathname,
            uploadedAt: blob.uploadedAt,
        }));
        return NextResponse.json(images);
    } catch {
        return NextResponse.json([], { status: 200 });
    }
}
