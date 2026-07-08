import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { dbService } from '../../../../lib/db';
import { supabase } from '../../../../lib/supabase';
import { getOrTranslateTemplate, personalizeAndRenderTemplate } from '@/lib/emailService';
import { isRateLimited } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (await isRateLimited(ip, 3, 60000, 'signup')) {
      return NextResponse.json({ success: false, error: 'Too many signup attempts. Please try again in a minute.' }, { status: 429 });
    }

    const { firstName, lastName, email, password, preferredLang, selectedCourses, redirectUrl } = await request.json();

    // Server-side password complexity enforcement (12 chars min + complexity)
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=._\-\[\]{}()]).{12,}$/;
    if (!password || !PASSWORD_REGEX.test(password)) {
      const msgs: Record<string, string> = {
        FR: 'Le mot de passe doit contenir au moins 12 caractères, incluant une lettre majuscule, une lettre minuscule, un nombre et un caractère spécial.',
        ES: 'La contraseña debe tener al menos 12 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial.',
        DE: 'Das Passwort muss mindestens 12 Zeichen lang sein und einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten.',
        ZH: '密码长度必须至少为 12 个字符，且必须包含大小写字母、数字及特殊字符。',
        EN: 'Password must be at least 12 characters long, including an uppercase letter, a lowercase letter, a number, and a special character.'
      };
      const lang = (preferredLang || 'EN').toUpperCase();
      return NextResponse.json({ success: false, error: msgs[lang] || msgs.EN }, { status: 400 });
    }

    const host = request.headers.get('host') || 'localhost:3000';
    const proto = request.headers.get('x-forwarded-proto') || 'http';
    const resendApiKey = process.env.RESEND_API_KEY;

    // 1. Generate unique verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // 2. Create the user profile in local/Supabase database (unverified)
    const fName = (firstName || '').trim();
    const lName = (lastName || '').trim();
    const fullName = fName || lName ? `${fName} ${lName}`.trim() : "";
    const newUserProfile = {
      id: `u_${Date.now()}`,
      name: fullName,
      email,
      role: 'student' as const,
      preferredLang,
      selectedCourses,
      // Internal tracking
      isEmailVerified: false,
      verificationToken
    };

    // Save user profile using dbService
    await dbService.createUser({
      id: newUserProfile.id,
      name: newUserProfile.name,
      email: newUserProfile.email,
      role: newUserProfile.role,
      preferredLang: newUserProfile.preferredLang,
      password
    });

    // NOTE: Token is persisted only in Supabase auth_verification table.
    // The global in-memory store was removed: it is unreliable in serverless environments
    // (evaporates on cold starts) and was a security anti-pattern.

    // Save token in Supabase auth_verification table if available
    try {
      const { error: dbVerError } = await supabase.from('auth_verification').upsert({
        email: email,
        token: verificationToken,
        profile: newUserProfile,
        created_at: new Date().toISOString()
      });
      if (dbVerError) {
        console.warn('[SIGNUP WARNING] Failed to persist verification token to Supabase auth_verification:', dbVerError);
      } else {
        console.log(`[SIGNUP SUCCESS] Persisted verification token for ${email} in Supabase storage.`);
      }
    } catch (dbErr) {
      console.warn('[SIGNUP WARNING] Supabase connection error in persisting verification token:', dbErr);
    }

    let verificationUrl = `${proto}://${host}/signup?token=${verificationToken}&email=${encodeURIComponent(email)}`;
    if (redirectUrl) {
      verificationUrl += `&redirect=${encodeURIComponent(redirectUrl)}`;
    }

    // Get email template from database or translate dynamically
    const dbTemplate = await getOrTranslateTemplate('verify_email', preferredLang || 'EN');
    const { subject, html: emailHtml } = personalizeAndRenderTemplate(dbTemplate, {
      firstName: fName,
      lastName: lName,
      actionUrl: verificationUrl
    });

    // 3. Dispatch validation email using Resend
    if (resendApiKey) {
      console.log(`[RESEND] Dispatching signup verification mail to ${email}...`);
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'OpenPrimer <onboarding@openprimer.app>',
          to: email,
          subject: subject,
          html: emailHtml
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`[RESEND SIGNUP ERROR]`, errorText);
      } else {
        console.log(`[RESEND SIGNUP SUCCESS] Verification email sent to ${email}.`);
      }
    } else {
      console.warn('[RESEND WARNING] RESEND_API_KEY not configured. Falling back to console verification token delivery.');
    }

    // C-1 FIX: Never return the raw token or verification URL in the API response.
    // Doing so would allow any caller to self-verify without clicking the email link.
    return NextResponse.json({
      success: true,
      isRealSent: !!resendApiKey
    });
  } catch (err: any) {
    console.error(`[SIGNUP API ERROR]`, err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

