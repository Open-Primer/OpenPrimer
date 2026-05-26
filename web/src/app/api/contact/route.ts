import { NextResponse } from 'next/server';
import { dbService } from '../../../lib/db';

export async function POST(request: Request) {
  const { name, email, message } = await request.json();
  const redirectionEmail = process.env.SUPPORT_EMAIL_REDIRECTION || 'vanguard.mysterious@gmail.com';

  console.log(`[MAIL DISPATCH] Sending email from ${email} (${name}) to ${redirectionEmail}...`);
  console.log(`[CONTENT] ${message}`);

  // Persist submission in database with 90-day retention
  await dbService.saveContactFeedback({ name, email, message });

  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return NextResponse.json({ success: true });
}
