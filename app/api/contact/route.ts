import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.Resend_key);

export async function POST(request: Request) {
    const body = await request.json();
    const { name, email, phone, postcode, jobType, description, preferredDate } = body;

    if (!name || !phone || !postcode || !jobType || !description) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.Resend_key) {
        return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    try {
        const { data, error: resendError } = await resend.emails.send({
            from: 'PDS Roofing <quotes@pdsroofing.com>',
            to: 'sfitz0181@gmail.com',
            subject: `New Quote Request: ${jobType} — ${name}`,
            html: `
                <h2>New Quote Request from PDS Roofing Website</h2>
                <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
                    <tr><td style="padding: 8px; font-weight: bold;">Name</td><td style="padding: 8px;">${name}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Phone</td><td style="padding: 8px;">${phone}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Email</td><td style="padding: 8px;">${email || 'Not provided'}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Postcode</td><td style="padding: 8px;">${postcode}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Job Type</td><td style="padding: 8px;">${jobType}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Preferred Date</td><td style="padding: 8px;">${preferredDate || 'Flexible'}</td></tr>
                </table>
                <h3>Job Description</h3>
                <p>${description}</p>
            `,
        });

        if (resendError) {
            return NextResponse.json({ error: resendError.message }, { status: 500 });
        }

        return NextResponse.json({ message: 'Email sent successfully', id: data?.id });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
