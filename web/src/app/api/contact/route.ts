import { NextResponse } from 'next/server';
import { dbService } from '../../../lib/db';
import { isRateLimited } from '@/lib/rateLimit';
import { getOrTranslateTemplate, personalizeAndRenderTemplate } from '@/lib/emailService';
import { sanitizeString, detectPromptInjection, isSpam, validateEmail } from '@/lib/security';

export async function POST(request: Request) {
  try {
    // 1. IP-Based Rate Limiting (Reduced to 3 requests per minute to prevent flooding)
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (await isRateLimited(ip, 3, 60000, 'contact')) {
      return NextResponse.json({ success: false, error: 'Too many feedback requests. Please try again in a minute.' }, { status: 429 });
    }

    const { name, email, message, lang, website } = await request.json();

    // 2. Honeypot Anti-Spam Check
    if (website && website.trim() !== '') {
      console.warn(`[SPAM BLOCK] Honeypot field 'website' filled: "${website}". Rejecting submission.`);
      // Return success to trick spam bots into believing they succeeded without sending mail or saving to DB
      return NextResponse.json({ success: true });
    }

    // 3. Email Validation
    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      return NextResponse.json({ success: false, error: emailCheck.reason || 'Invalid email address.' }, { status: 400 });
    }

    // 4. Content Spam Validation
    if (isSpam(message) || isSpam(name)) {
      console.warn(`[SPAM BLOCK] Spam indicators found in message or name.`);
      return NextResponse.json({ success: false, error: 'Your submission has been flagged as spam.' }, { status: 400 });
    }

    // 5. Prompt Injection Check (protect template parsing and administrative view)
    if (detectPromptInjection(message) || detectPromptInjection(name)) {
      console.warn(`[SECURITY BLOCK] Prompt injection patterns detected in contact form submission.`);
      return NextResponse.json({ success: false, error: 'Invalid message content. Prompt injection patterns detected.' }, { status: 400 });
    }

    // 6. Input Sanitization
    const cleanName = sanitizeString(name);
    const cleanEmail = email.trim();
    const cleanMessage = sanitizeString(message);

    const redirectionEmail = process.env.SUPPORT_EMAIL_REDIRECTION || 'vanguard.mysterious@gmail.com';
    const resendApiKey = process.env.RESEND_API_KEY;

    // Persist submission in database
    await dbService.saveContactFeedback({ name: cleanName, email: cleanEmail, message: cleanMessage });

    if (resendApiKey) {
      console.log(`[RESEND] Dispatching real notification email from ${cleanEmail} to ${redirectionEmail}...`);
      
      // Send admin notification
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'OpenPrimer Feedback <feedback@openprimer.app>',
          to: redirectionEmail,
          subject: `OpenPrimer: Nouveau Message de ${cleanName}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
              <h2 style="color: #6d28d9; margin-top: 0;">Nouveau message de contact</h2>
              <p><strong>Nom :</strong> ${cleanName}</p>
              <p><strong>E-mail :</strong> ${cleanEmail}</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="white-space: pre-wrap; line-height: 1.6;">${cleanMessage}</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #666;">Ce message a été envoyé via le formulaire de contact de OpenPrimer.</p>
            </div>
          `
        })
      });

      // Send personalized receipt to the student
      const nameParts = (cleanName || '').trim().split(/\s+/);
      const fName = nameParts[0] || '';
      const lName = nameParts.slice(1).join(' ') || '';

      const userLang = (lang || 'EN').toUpperCase();
      const dbTemplate = await getOrTranslateTemplate('feedback', userLang);
      const { subject, html: emailHtml } = personalizeAndRenderTemplate(dbTemplate, {
        firstName: fName,
        lastName: lName,
        message: cleanMessage
      });

      console.log(`[RESEND] Dispatching personalized feedback receipt email to ${cleanEmail}...`);
      const userRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'OpenPrimer <support@openprimer.app>',
          to: cleanEmail,
          subject: subject,
          html: emailHtml
        })
      });

      if (!userRes.ok) {
        const errorText = await userRes.text();
        console.error(`[RESEND USER FEEDBACK ERROR]`, errorText);
      } else {
        console.log(`[RESEND USER FEEDBACK SUCCESS] Confirmation receipt sent to ${cleanEmail}.`);
      }
    } else {
      console.warn('[RESEND WARNING] RESEND_API_KEY not configured. Falling back to local console mock.');
      console.log(`[MAIL DISPATCH MOCK] Sending email from ${cleanEmail} (${cleanName}) to ${redirectionEmail}...`);
      console.log(`[CONTENT] ${cleanMessage}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(`[CONTACT ERROR]`, err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
