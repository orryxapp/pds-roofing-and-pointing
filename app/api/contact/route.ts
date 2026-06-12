import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getClientIp, allowRequest } from '@/lib/rate-limit';

const resend = new Resend(process.env.RESEND_API_KEY);

// Max quote requests accepted per IP per hour before we ask them to call instead.
const MAX_PER_HOUR = 5;

function escapeHtml(value: unknown): string {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export async function POST(request: Request) {
    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { name, email, phone, postcode, jobType, description, preferredDate, hp_field } = body as Record<string, string>;

    // Honeypot: real users never see or fill this field. Pretend success so bots don't retry.
    if (hp_field) {
        return NextResponse.json({ message: 'Email sent successfully' });
    }

    if (!name || !phone || !postcode || !jobType || !description) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
        return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    // Rate limit per IP so the contact form can't be used to flood the inbox
    // or burn through the Resend quota.
    try {
        const ip = getClientIp(request);
        const allowed = await allowRequest('contact', ip, MAX_PER_HOUR, 60);
        if (!allowed) {
            return NextResponse.json(
                { error: "You've sent several requests recently. Please call us on 07856 417543 and we'll help right away." },
                { status: 429 },
            );
        }
    } catch (err) {
        // If the rate-limit store is unavailable, don't block a genuine lead — just log it.
        console.error('Rate limit check failed:', err);
    }

    try {
        const { error: resendError } = await resend.emails.send({
            from: 'PDS Roofing <quotes@pdsroofing.com>',
            to: 'sfitz0181@gmail.com',
            replyTo: email && typeof email === 'string' ? email : undefined,
            subject: `New Quote Request: ${escapeHtml(jobType)} — ${escapeHtml(name)}`,
            html: `
                <h2>New Quote Request from PDS Roofing Website</h2>
                <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
                    <tr><td style="padding: 8px; font-weight: bold;">Name</td><td style="padding: 8px;">${escapeHtml(name)}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Phone</td><td style="padding: 8px;">${escapeHtml(phone)}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Email</td><td style="padding: 8px;">${email ? escapeHtml(email) : 'Not provided'}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Postcode</td><td style="padding: 8px;">${escapeHtml(postcode)}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Job Type</td><td style="padding: 8px;">${escapeHtml(jobType)}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Preferred Date</td><td style="padding: 8px;">${preferredDate ? escapeHtml(preferredDate) : 'Flexible'}</td></tr>
                </table>
                <h3>Job Description</h3>
                <p>${escapeHtml(description).replace(/\n/g, '<br>')}</p>
            `,
        });

        if (resendError) {
            console.error('Resend error:', resendError);
            return NextResponse.json({ error: 'Could not send your request. Please call us instead.' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Email sent successfully' });
    } catch (err) {
        console.error('Contact route error:', err);
        return NextResponse.json({ error: 'Something went wrong. Please call us instead.' }, { status: 500 });
    }
}
