import { NextResponse } from 'next/server';
import { dbService } from '../../../lib/db';
import { isRateLimited } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    // 1. IP-Based Rate Limiting (5 requests per minute)
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (isRateLimited(ip, 5, 60000)) {
      return NextResponse.json({ success: false, error: 'Too many feedback requests. Please try again in a minute.' }, { status: 429 });
    }

    const { name, email, message } = await request.json();
    const redirectionEmail = process.env.SUPPORT_EMAIL_REDIRECTION || 'vanguard.mysterious@gmail.com';
    const resendApiKey = process.env.RESEND_API_KEY;

    // Persist submission in database
    await dbService.saveContactFeedback({ name, email, message });

    if (resendApiKey) {
      console.log(`[RESEND] Dispatching real email from ${email} to ${redirectionEmail}...`);
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'OpenPrimer Feedback <onboarding@resend.dev>',
          to: redirectionEmail,
          subject: `OpenPrimer: Nouveau Message de ${name}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
              <h2 style="color: #6d28d9; margin-top: 0;">Nouveau message de contact</h2>
              <p><strong>Nom :</strong> ${name}</p>
              <p><strong>E-mail :</strong> ${email}</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #666;">Ce message a été envoyé via le formulaire de contact de OpenPrimer.</p>
            </div>
          `
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`[RESEND ERROR] Failed to send email via Resend: ${errorText}`);
      } else {
        console.log(`[RESEND SUCCESS] Email sent successfully via Resend API.`);
      }
    } else {
      console.warn('[RESEND WARNING] RESEND_API_KEY not configured. Falling back to local console mock.');
      console.log(`[MAIL DISPATCH MOCK] Sending email from ${email} (${name}) to ${redirectionEmail}...`);
      console.log(`[CONTENT] ${message}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(`[CONTACT ERROR]`, err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
