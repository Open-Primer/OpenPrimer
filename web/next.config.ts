import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(self), geolocation=(), interest-cohort=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cayylzaasyqqpvuezufy.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https:; connect-src 'self' https://cayylzaasyqqpvuezufy.supabase.co https://aiplatform.googleapis.com https://api.resend.com; font-src 'self' data: https://fonts.gstatic.com; frame-src 'self' https://*.youtube.com https://*.youtube-nocookie.com https://*.vimeo.com https://player.vimeo.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin'
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-origin'
  }
  // COEP require-corp is commented out to allow embedding external videos via iframe (YouTube/Vimeo)
  // {
  //   key: 'Cross-Origin-Embedder-Policy',
  //   value: 'require-corp'
  // }
];

const nextConfig: NextConfig = {
  // Supprime le header "X-Powered-By: Next.js" qui fingerprinte le stack aux attaquants
  poweredByHeader: false,
  output: "standalone",
  outputFileTracingIncludes: {
    '/**': ['content/**/*']
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // Cache strict pour les pages HTML (no-store évite la mise en cache de données utilisateur)
      {
        source: '/((?!_next/static|_next/image|favicon.ico).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0'
          }
        ]
      },
      // Cache immuable long pour les assets statiques hachés
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
