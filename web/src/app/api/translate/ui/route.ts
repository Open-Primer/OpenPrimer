import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang');
    if (!lang) {
      return NextResponse.json({ success: false, error: 'Language parameter is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('system_parameters')
      .select('value')
      .eq('key', `ui_strings_${lang.toUpperCase()}`)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: 'Translations not found in system_parameters' }, { status: 404 });
    }

    return NextResponse.json({ success: true, strings: JSON.parse(data.value) });
  } catch (err: any) {
    console.error('[API translate/ui ERROR]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
