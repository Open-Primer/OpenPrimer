import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js Edge Network Boundary Layer — OpenPrimer Security & Proxy
 *
 * Responsibilities:
 * 1. Block obvious bad bots and scanners by User-Agent
 * 2. Enforce CORS origin validation on /api/* routes
 * 3. Block direct access to internal cron endpoint (must come from Vercel scheduler)
 * 4. Rate-limiting for AI and sensitive API routes
 */

const ALLOWED_ORIGINS = [
  'https://open-primer.vercel.app',
  'https://openprimer.vercel.app',
  'https://openprimer.app',
  'https://www.openprimer.app',
];

// Patterns that identify automated scanners, not legitimate browsers
const BLOCKED_UA_PATTERNS = [
  /sqlmap/i,
  /nikto/i,
  /nessus/i,
  /masscan/i,
  /zgrab/i,
  /dirbuster/i,
  /nuclei/i,
  /acunetix/i,
  /nmap/i,
  /burpsuite/i,
  /openvas/i,
  /w3af/i,
  /havij/i,
];

// In-memory store for rate limiting (simplified for prototype)
// Note: In production, use Redis (Upstash) for persistent shared state.
const rateLimitStore = new Map<string, { count: number, lastReset: number }>();

const LIMIT = 10; // requests per minute
const WINDOW = 60 * 1000; // 1 minute in ms

function isBlockedBot(ua: string): boolean {
  return BLOCKED_UA_PATTERNS.some(pattern => pattern.test(ua));
}

function isCorsViolation(origin: string | null, request: NextRequest): boolean {
  const { pathname } = request.nextUrl;
  // Only enforce CORS on API routes in production
  if (process.env.NODE_ENV !== 'production') return false;
  if (!pathname.startsWith('/api/')) return false;
  // Allow requests with no origin (server-to-server, Vercel cron, curl with auth)
  if (!origin) return false;
  // Allow localhost for development previews
  if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) return false;

  // Allow same-origin requests dynamically in production
  if (origin === request.nextUrl.origin) return false;

  return !ALLOWED_ORIGINS.includes(origin);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ua = request.headers.get('user-agent') ?? '';
  const origin = request.headers.get('origin');

  // 1. Block known scanner user agents
  if (isBlockedBot(ua)) {
    return new NextResponse(null, {
      status: 403,
      statusText: 'Forbidden',
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // 2. CORS enforcement for API routes
  if (isCorsViolation(origin, request)) {
    return new NextResponse(
      JSON.stringify({ error: 'Forbidden: Cross-origin request not allowed' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // 3. Cron endpoint: block direct browser access (must have CRON_SECRET auth header)
  //    Secondary check — primary check is already inside the route handler itself
  if (pathname === '/api/content/cron') {
    const auth = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && auth !== `Bearer ${cronSecret}`) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // 4. Rate-limiting for AI and sensitive API routes
  if (pathname.startsWith('/api/tutor') || pathname.startsWith('/api/generate')) {
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

  // Allow all other requests through
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
