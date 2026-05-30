import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { progressService } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Support local development & authenticated requests
  const adminSession = request.headers.get('x-admin-session');
  const adminToken = request.headers.get('x-admin-token');
  const host = request.headers.get('host') || '';
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');

  if (adminSession !== 'true' && adminToken !== 'OP-ADMIN-SECRET-2026' && !isLocal) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Administrative access required' }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from('service_uptime_logs')
      .select('*')
      .order('date', { ascending: true });

    if (!error && data && data.length > 0) {
      const history = data.map(row => ({
        date: row.date,
        db: Number(row.db),
        email: Number(row.email),
        ai: Number(row.ai),
        images: Number(row.images)
      }));
      return NextResponse.json({ success: true, source: 'database', data: history });
    }
  } catch (dbErr: any) {
    console.warn("[SLA API] Fallback to seeded PRNG SLA history due to:", dbErr?.message || dbErr);
  }

  // Fallback to seeded PRNG SLA history
  const prngHistory = progressService.getSlaHistory();
  return NextResponse.json({ success: true, source: 'prng', data: prngHistory });
}
