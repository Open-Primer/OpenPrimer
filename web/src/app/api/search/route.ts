import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { dbService } from '../../../lib/db';
import { isRateLimited } from '../../../lib/rateLimit';

export async function GET(req: NextRequest) {
  // Rate limit: 30 searches per minute per IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
  if (await isRateLimited(ip, 30, 60000, 'search')) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query || query.trim().length === 0) return NextResponse.json([]);
  if (query.length > 200) {
    return NextResponse.json({ error: 'Query too long' }, { status: 400 });
  }

  try {
    const isOffline = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project');
    let data: any[] = [];

    if (isOffline) {
      const { data: localCrs } = await dbService.getAllCourses();
      data = localCrs?.filter((c: any) => c.title.toLowerCase().includes(query.toLowerCase())) || [];
    } else {
      const { data: dbData, error } = await supabase
        .from('courses')
        .select('*')
        .ilike('title', `%${query}%`)
        .limit(10);
      if (error) throw error;
      data = dbData || [];
    }

    const wasSuccessful = data.length > 0;
    try {
      await dbService.addSearchHistoryEntry({ query, wasSuccessful });
    } catch (e) {
      console.warn('[SEARCH LOGGING ERROR] Failed to record search log.', e);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[SEARCH ERROR]', error);
    try {
      await dbService.addSearchHistoryEntry({ query, wasSuccessful: false });
    } catch (e) {}
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
