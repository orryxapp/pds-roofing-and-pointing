import { NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import { verifyAdmin } from '@/lib/admin-auth';

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];

export async function POST(request: Request) {
    let formData: FormData;
    try {
        formData = await request.formData();
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const password = formData.get('password') as string;
    const file = formData.get('file') as File;

    const auth = await verifyAdmin(request, password);
    if (!auth.ok) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    if (!file || typeof file === 'string') {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: 'Image must be under 10 MB' }, { status: 400 });
    }

    try {
        // Strip any path components from the original filename before storing.
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const blob = await put(`gallery/${Date.now()}-${safeName}`, file, {
            access: 'public',
            contentType: file.type,
        });
        return NextResponse.json({ url: blob.url, pathname: blob.pathname });
    } catch (err) {
        console.error('Gallery upload error:', err);
        return NextResponse.json({ error: 'Could not upload image' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { url, password } = body as Record<string, string>;

    const auth = await verifyAdmin(request, password);
    if (!auth.ok) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    if (!url) {
        return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    try {
        await del(url);
        return NextResponse.json({ message: 'Image deleted' });
    } catch (err) {
        console.error('Gallery delete error:', err);
        return NextResponse.json({ error: 'Could not delete image' }, { status: 500 });
    }
}
