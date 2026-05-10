/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  poweredByHeader: false,
  compress: true,
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'ar'],
    localeDetection: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },

  // ════════════════════════════════════════════════════════════
  // HTTP HEADERS — security + agent discovery
  // ════════════════════════════════════════════════════════════
  async headers() {
    const agentDiscoveryLink = [
      '</llms.txt>; rel="https://llmstxt.org/rel/llms"; type="text/plain"',
      '</sitemap.xml>; rel="sitemap"; type="application/xml"',
    ].join(', ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Link', value: agentDiscoveryLink },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
