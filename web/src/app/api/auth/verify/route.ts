import { NextResponse } from 'next/server';
import { dbService } from '../../../../lib/db';
import { supabase } from '../../../../lib/supabase';

export async function POST(request: Request) {
  try {
    const { token, email } = await request.json();

    if (!token || !email) {
      return NextResponse.json({ success: false, error: 'Token et email requis.' }, { status: 400 });
    }

    let profile: any = null;

    // Check in secure database-backed Supabase table first
    try {
      const { data, error } = await supabase
        .from('auth_verification')
        .select('*')
        .eq('email', email)
        .eq('token', token)
        .single();
      
      if (data && !error) {
        profile = data.profile;
        console.log(`[VERIFY] Verification token found in Supabase storage for ${email}`);
        // Clean up asynchronously
        Promise.resolve(supabase.from('auth_verification').delete().eq('email', email)).then(() => {
          console.log(`[VERIFY DB CLEANUP] Successfully cleaned up verification token for ${email}`);
        }).catch((err: any) => {
          console.error('[VERIFY DB CLEANUP ERROR]', err);
        });
      }
    } catch (dbErr) {
      console.warn('[VERIFICATION] Supabase auth_verification fetch failed/offline:', dbErr);
    }

    // C-3' FIX: The global.verificationStore read was removed.
    // The write was already removed in Audit-4 (H-4 fix in signup/route.ts).
    // Supabase auth_verification is the sole persistence layer.

    // C-2' FIX: If the token is not found in the DB, hard-reject.
    // The previous fallback auto-created a verified profile for any email + any token,
    // which was a complete authentication bypass.
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Invalid or expired verification token.' }, { status: 400 });
    }

    // Set verified flag and make sure user profile in db is updated!
    const verifiedProfile = {
      ...profile,
      isEmailVerified: true
    };

    console.log(`[VERIFY SUCCESS] Account ${email} fully verified!`);
    // H-3' FIX: Return only the fields the client needs, not the full persisted object.
    return NextResponse.json({
      success: true,
      profile: {
        id: verifiedProfile.id,
        name: verifiedProfile.name,
        email: verifiedProfile.email,
        role: verifiedProfile.role || 'student',
        preferredLang: verifiedProfile.preferredLang || 'EN',
        isEmailVerified: true
      }
    });
  } catch (err: any) {
    console.error(`[VERIFY API ERROR]`, err);
    return NextResponse.json({
      success: false,
      error: process.env.NODE_ENV === 'production' ? 'An internal error occurred.' : err.message
    }, { status: 500 });
  }
}
