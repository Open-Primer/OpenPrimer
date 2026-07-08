import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { dbService } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { token, email, newPassword } = await request.json();

    if (!token || !email || !newPassword) {
      return NextResponse.json({ success: false, error: 'Token, email and new password are required.' }, { status: 400 });
    }

    const emailLower = email.trim().toLowerCase();

    // 1. Validate password complexity (same rules as signup)
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=._\-\[\]{}()]).{12,}$/;
    if (!PASSWORD_REGEX.test(newPassword)) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 12 characters long, including an uppercase letter, a lowercase letter, a number, and a special character.'
      }, { status: 400 });
    }

    // 2. Retrieve and validate the reset token from Supabase
    const { data: record, error: fetchError } = await supabase
      .from('auth_verification')
      .select('*')
      .eq('email', emailLower)
      .eq('token', `reset_${token}`)
      .single();

    if (fetchError || !record) {
      return NextResponse.json({ success: false, error: 'Invalid or expired reset token.' }, { status: 400 });
    }

    // 3. Check expiry
    const profile = record.profile as any;
    if (profile?.expires_at && new Date(profile.expires_at) < new Date()) {
      // Clean up expired token
      await supabase.from('auth_verification').delete().eq('email', emailLower);
      return NextResponse.json({ success: false, error: 'This reset link has expired. Please request a new one.' }, { status: 400 });
    }

    const userId = profile?.id;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Invalid reset token data.' }, { status: 400 });
    }

    // 4. Update the password in our custom profiles table via dbService
    const { error: updateError } = await dbService.updateUserPassword(userId, newPassword);
    if (updateError) {
      console.error('[CONFIRM RESET] Password update failed:', updateError);
      return NextResponse.json({ success: false, error: 'Failed to update password. Please try again.' }, { status: 500 });
    }

    // 5. Clean up the used token
    await supabase.from('auth_verification').delete().eq('email', emailLower);

    console.log(`[CONFIRM RESET] Password successfully reset for ${emailLower}`);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[CONFIRM RESET API ERROR]', err);
    return NextResponse.json({
      success: false,
      error: process.env.NODE_ENV === 'production' ? 'An internal error occurred.' : err.message
    }, { status: 500 });
  }
}
