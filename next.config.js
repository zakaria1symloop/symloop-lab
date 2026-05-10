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
    // RFC 8288 Link header — agent discovery. Each entry advertises a
    // resource an AI agent or crawler can fetch to learn how to interact
    // with the site. Multiple link-values are comma-separated.
    const agentDiscoveryLink = [
      '</llms.txt>; rel="https://llmstxt.org/rel/llms"; type="text/plain"',
      '</sitemap.xml>; rel="sitemap"; type="application/xml"',
      '</.well-known/agent-skills/index.json>; rel="agent-skills"; type="application/json"',
      '</.well-known/mcp/server-card.json>; rel="mcp-server-card"; type="application/json"',
      '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
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
      // Force correct Content-Type on the JSON well-known files.
      // Next.js serves files in /public/.well-known/ as-is, but extensionless
      // files default to application/octet-stream which breaks discovery.
      {
        source: '/.well-known/agent-skills/index.json',
        headers: [
          { key: 'Content-Type', value: 'application/json; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=300, must-revalidate' },
        ],
      },
      {
        source: '/.well-known/mcp/server-card.json',
        headers: [
          { key: 'Content-Type', value: 'application/json; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=300, must-revalidate' },
        ],
      },
      {
        source: '/.well-known/api-catalog',
        headers: [
          // RFC 9727 mandates application/linkset+json for the catalog.
          { key: 'Content-Type', value: 'application/linkset+json; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=300, must-revalidate' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
