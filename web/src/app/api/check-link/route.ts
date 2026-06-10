import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ valid: false, error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    const isAbsolute = /^https?:\/\//i.test(url) || url.startsWith('//');
    if (!isAbsolute) {
      return NextResponse.json({ valid: false, reason: 'Not an absolute URL' });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout

    // Try HEAD request first (more efficient)
    try {
      const res = await fetch(url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: controller.signal,
        cache: 'no-store'
      });
      clearTimeout(timeoutId);

      // If status is not 404, we consider it valid (e.g. 200, 301, 302, or even 403/401/405 depending on blocking)
      if (res.status !== 404) {
        return NextResponse.json({ valid: true, status: res.status });
      }
    } catch (headError) {
      // If HEAD fails, fallback to GET (some servers block HEAD)
    }

    // Try GET request as fallback
    const getController = new AbortController();
    const getTimeoutId = setTimeout(() => getController.abort(), 3500);

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: getController.signal,
        cache: 'no-store'
      });
      clearTimeout(getTimeoutId);

      if (res.status !== 404) {
        return NextResponse.json({ valid: true, status: res.status });
      } else {
        return NextResponse.json({ valid: false, status: 404 });
      }
    } catch (getError) {
      // If it's a network error or abort, let's treat it as invalid/offline
      return NextResponse.json({ valid: false, error: 'Network error or timed out' });
    }
  } catch (error: any) {
    return NextResponse.json({ valid: false, error: error.message || 'Verification failed' });
  }
}
