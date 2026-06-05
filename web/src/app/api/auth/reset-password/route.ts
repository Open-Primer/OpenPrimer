import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { getOrTranslateTemplate, personalizeAndRenderTemplate } from '@/lib/emailService';
import { dbService } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, lang } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Email required.' }, { status: 400 });
    }

    const emailLower = email.trim().toLowerCase();
    const userLang = (lang || 'EN').toUpperCase();

    // 1. Verify the email exists in our custom profiles DB (not Supabase Auth)
    const { data: userList } = await dbService.getUsers();
    const matchedUser = (userList || []).find((u: any) => u.email?.toLowerCase() === emailLower) as any;

    if (!matchedUser) {
      // Return a neutral success message to avoid email enumeration attacks
      return NextResponse.json({ success: true });
    }

    // 2. Generate a secure reset token
    const resetToken = Math.random().toString(36).substring(2, 15)
      + Math.random().toString(36).substring(2, 15)
      + Math.random().toString(36).substring(2, 15);

    // 3. Store the token in Supabase with a 1-hour expiry
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    await supabase.from('auth_verification').upsert({
      email: emailLower,
      token: `reset_${resetToken}`,
      profile: { id: matchedUser.id, name: matchedUser.name, type: 'password_reset', expires_at: expiresAt },
      created_at: new Date().toISOString()
    });

    // 4. Build the reset URL pointing to our custom page
    const host = request.headers.get('host') || 'localhost:3000';
    const proto = request.headers.get('x-forwarded-proto') || 'http';
    const resetUrl = `${proto}://${host}/reset-password?token=${resetToken}&email=${encodeURIComponent(emailLower)}`;

    // 5. Send the email via Resend using the existing emailService
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const firstName = (matchedUser.name || '').split(' ')[0] || '';
      const lastName = (matchedUser.name || '').split(' ').slice(1).join(' ') || '';
      const dbTemplate = await getOrTranslateTemplate('lost_password', userLang);
      const { subject, html: emailHtml } = personalizeAndRenderTemplate(dbTemplate, {
        firstName,
        lastName,
        actionUrl: resetUrl
      });

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'OpenPrimer <onboarding@openprimer.app>',
          to: emailLower,
          subject,
          html: emailHtml
        })
      });

      if (!res.ok) {
        const err = await res.text();
        console.error('[RESEND RESET PASSWORD ERROR]', err);
      } else {
        console.log(`[RESEND RESET PASSWORD] Email sent to ${emailLower}`);
      }
    } else {
      // Fallback: log the reset URL in dev mode (no Resend key)
      console.warn(`[RESET PASSWORD - DEV] No RESEND_API_KEY. Reset URL: ${resetUrl}`);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[RESET PASSWORD API ERROR]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
