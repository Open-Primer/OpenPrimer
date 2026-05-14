import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, email, message } = await request.json();
  const redirectionEmail = process.env.SUPPORT_EMAIL_REDIRECTION || 'vanguard.mysterious@gmail.com';

  console.log(`[MAIL DISPATCH] Sending email from ${email} (${name}) to ${redirectionEmail}...`);
  console.log(`[CONTENT] ${message}`);

  // In production, use Resend or Nodemailer:
  /*
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'OpenPrimer <ops@openprimer.org>',
    to: redirectionEmail,
    subject: `New Inquiry from ${name}`,
    text: message,
    reply_to: email
  });
  */

  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return NextResponse.json({ success: true });
}
