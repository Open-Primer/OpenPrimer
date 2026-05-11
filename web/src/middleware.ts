import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory store for rate limiting (simplified for prototype)
// Note: In production, use Redis (Upstash) for persistent shared state.
const rateLimitStore = new Map<string, { count: number, lastReset: number }>();

const LIMIT = 10; // requests per minute
const WINDOW = 60 * 1000; // 1 minute in ms

export function middleware(request: NextRequest) {
  // Only apply to AI and sensitive API routes
  if (request.nextUrl.pathname.startsWith('/api/tutor') || 
      request.nextUrl.pathname.startsWith('/api/generate')) {
    
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const userData = rateLimitStore.get(ip) || { count: 0, lastReset: now };

    // Reset window if time passed
    if (now - userData.lastReset > WINDOW) {
      userData.count = 0;
      userData.lastReset = now;
    }

    userData.count++;
    rateLimitStore.set(ip, userData);

    if (userData.count > LIMIT) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please wait a minute." }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
