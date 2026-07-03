import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slugQuery = searchParams.get('slug');

  if (!slugQuery) {
    return NextResponse.json({ exists: {}, error: 'Missing slug parameter' }, { status: 400 });
  }

  const slugs = slugQuery
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  if (slugs.length === 0) {
    return NextResponse.json({ exists: {} });
  }

  try {
    const { data, error } = await supabase
      .from('courses')
      .select('slug')
      .in('slug', slugs);

    if (error) {
      console.error("[check-course] Database query error:", error);
      return NextResponse.json({ exists: {}, error: error.message }, { status: 500 });
    }

    const foundSlugs = new Set((data || []).map((c: any) => c.slug.toLowerCase()));
    const existsMap: Record<string, boolean> = {};
    slugs.forEach(s => {
      existsMap[s] = foundSlugs.has(s);
    });

    return NextResponse.json({ exists: existsMap });
  } catch (err: any) {
    console.error("[check-course] Server exception:", err);
    return NextResponse.json({ exists: {}, error: err.message }, { status: 500 });
  }
}
