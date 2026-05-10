// Dynamic sitemap — auto-generated at request time. Currently a single-page
// site, but structured to scale: when /capabilities/, /sectors/, /case-studies/
// arrive, just add to staticPaths. ISR-cached at edge for 1 hour.

const SITE_URL = 'https://symloop-ai.com';
const LOCALES = ['en', 'fr', 'ar'];
const DEFAULT_LOCALE = 'en';

function generateSitemap(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(({ path: urlPath, lastmod, changefreq, priority }) => {
  const localeUrl = (locale) => locale === DEFAULT_LOCALE
    ? `${SITE_URL}${urlPath}`
    : `${SITE_URL}/${locale}${urlPath}`;
  return `  <url>
    <loc>${localeUrl(DEFAULT_LOCALE)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${LOCALES.map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${localeUrl(l)}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${localeUrl(DEFAULT_LOCALE)}"/>
  </url>`;
}).join('\n')}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  const today = new Date().toISOString().split('T')[0];
  const urls = [
    { path: '/', lastmod: today, changefreq: 'weekly', priority: '1.0' },
  ];

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=600');
  res.write(generateSitemap(urls));
  res.end();
  return { props: {} };
}

export default function Sitemap() {
  return null;
}
