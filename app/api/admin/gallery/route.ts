import { NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function isAuthorized(password: string | null | undefined) {
    return ADMIN_PASSWORD && password === ADMIN_PASSWORD;
}

export async function POST(request: Request) {
    const formData = await request.formData();
    const password = formData.get('password') as string;
    const file = formData.get('file') as File;

    if (!isAuthorized(password)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    try {
        const blob = await put(`gallery/${Date.now()}-${file.name}`, file, {
            access: 'public',
            contentType: file.type,
        });
        return NextResponse.json({ url: blob.url, pathname: blob.pathname });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const body = await request.json();
    const { url, password } = body;

    if (!isAuthorized(password)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!url) {
        return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    try {
        await del(url);
        return NextResponse.json({ message: 'Image deleted' });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
