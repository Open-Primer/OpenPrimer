import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { dbService } from '../../../lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) return NextResponse.json([]);

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

    // Persist log
    try {
      await dbService.addSearchHistoryEntry({ query, wasSuccessful });
    } catch (e) {
      console.warn('[SEARCH LOGGING ERROR] Failed to record search log.', e);
    }

    return NextResponse.json(data);
  } catch (error) {
    try {
      await dbService.addSearchHistoryEntry({ query, wasSuccessful: false });
    } catch (e) {}
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
