import { NextResponse } from 'next/server';
import { dispatchTasks } from '@/lib/dispatcher';
import { verifySession } from '@/lib/authHelper';

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  const { searchParams } = new URL(request.url);
  const secretParam = searchParams.get('secret');
  const cronSecret = process.env.CRON_SECRET;
  const isProd = process.env.NODE_ENV === 'production';

  let isAuthorized = false;

  if (cronSecret && (authHeader === `Bearer ${cronSecret}` || secretParam === cronSecret)) {
    isAuthorized = true;
  }

  if (!isAuthorized) {
    try {
      const user = await verifySession(request);
      if (user) {
        isAuthorized = true;
      }
    } catch (err) {
      console.error('[SECURITY] Error during verifySession:', err);
    }
  }

  const devBypass = !isProd && process.env.ALLOW_OPEN_TASKS === 'true';
  if (!devBypass && !isAuthorized) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const result = await dispatchTasks(request.url);
  return NextResponse.json(result);
}

export async function GET(request: Request) {
  return POST(request);
}
