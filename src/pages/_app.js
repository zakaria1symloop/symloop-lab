import '../styles/globals.css';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { IBM_Plex_Sans_Arabic, JetBrains_Mono, Instrument_Serif } from 'next/font/google';

// WebMCP — exposes Symloop AI capabilities as agent-callable tools when
// the browser supports navigator.modelContext. No-op otherwise. Loaded
// client-only because navigator.modelContext is a browser API.
const WebMCP = dynamic(() => import('../components/WebMCP'), { ssr: false });

// Self-hosted Google Fonts via next/font — same exact font set as the parent
// symloop.com site so the visual DNA is identical. Variable name is matched
// to parent (--font-ibm-plex-arabic) so brand assets and templates carry
// over without rewrites.
const fontIbmPlex = IBM_Plex_Sans_Arabic({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['arabic', 'latin'],
  variable: '--font-ibm-plex-arabic',
  display: 'swap',
});
const fontMono = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});
const fontSerif = Instrument_Serif({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const SITE_URL = 'https://symloop-ai.com';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Always start at top on reload + route change. The long sticky-Manifesto
  // section makes the browser's default scrollRestoration='auto' land at the
  // bottom on reload — even with manual restoration, framer-motion useScroll
  // and layout shifts can re-trigger scroll. We defend on multiple events:
  // mount, RAF (after layout), load, and pageshow (bfcache restore).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    const toTop = () => window.scrollTo(0, 0);
    toTop();
    // Run after the next paint — by then layout has settled and any
    // sticky/useScroll handlers are wired up.
    const rafId = requestAnimationFrame(() => {
      toTop();
      requestAnimationFrame(toTop);
    });
    // Catch full-page load (assets, fonts) — sometimes triggers a final reflow.
    window.addEventListener('load', toTop);
    // Catch back/forward cache restores (Safari especially).
    window.addEventListener('pageshow', toTop);
    const onRouteChange = () => toTop();
    router.events.on('routeChangeComplete', onRouteChange);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('load', toTop);
      window.removeEventListener('pageshow', toTop);
      router.events.off('routeChangeComplete', onRouteChange);
    };
  }, [router.events]);

  // Per-route canonical + complete hreflang set. Pages can override the
  // canonical by emitting their own <link rel="canonical" key="canonical">.
  // Default locale is FR (matches next.config.js i18n.defaultLocale: 'fr'),
  // so FR pages live at the apex (no prefix) and EN/AR get /en /ar prefixes.
  const locale = router.locale || 'fr';
  const defaultLocale = router.defaultLocale || 'fr';
  const path = (router.asPath || '/').split('?')[0].split('#')[0];
  const localePrefix = locale === defaultLocale ? '' : `/${locale}`;
  const canonicalUrl = `${SITE_URL}${localePrefix}${path}`;
  const hreflangs = [
    { lang: 'fr',        href: `${SITE_URL}${path}` },
    { lang: 'en',        href: `${SITE_URL}/en${path}` },
    { lang: 'ar',        href: `${SITE_URL}/ar${path}` },
    { lang: 'x-default', href: `${SITE_URL}${path}` },
  ];

  const fontVars = `${fontIbmPlex.variable} ${fontMono.variable} ${fontSerif.variable}`;

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" href={canonicalUrl} key="canonical" />
        {hreflangs.map(h => (
          <link key={`hreflang-${h.lang}`} rel="alternate" hrefLang={h.lang} href={h.href} />
        ))}
      </Head>

      <div className={`${fontVars} bg-black text-white min-h-screen`}>
        <Component {...pageProps} />
      </div>

      {/* WebMCP — registers agent-callable tools via navigator.modelContext */}
      <WebMCP />

      <SpeedInsights />
      <Analytics />
    </>
  );
}
