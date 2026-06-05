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
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.supabase.co https://*.googleapis.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; connect-src 'self' https://*.supabase.co https://*.googleapis.com https://api.resend.com; font-src 'self' data:; object-src 'none'; frame-ancestors 'none';"
  }
];

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/**': ['content/**/*']
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  }
};

export default nextConfig;
