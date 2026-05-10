import { Html, Head, Main, NextScript } from 'next/document';

// Minimal _document — no fonts.googleapis preconnects (next/font handles
// fonts at build time), no inline schemas (page-level _app and pages
// emit per-route schema). Just charset, theme color, and Organization
// JSON-LD that's truly site-wide.
export default function Document() {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <meta name="theme-color" content="#000000" />
        <meta name="format-detection" content="telephone=no" />

        {/* Disable browser scroll restoration BEFORE hydration. The long
            sticky Manifesto section (140vh) confuses the browser's default
            scrollRestoration='auto', which can land at the bottom on reload.
            This script runs before React mounts, so it wins the race. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if('scrollRestoration' in history){history.scrollRestoration='manual'}window.scrollTo(0,0);}catch(e){}`,
          }}
        />

        {/* Favicons + manifest */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Site-wide Organization JSON-LD — the entity behind symloop-lab.com.
            Symloop Lab is the AI-engineering arm of Symloop Technology. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': 'https://symloop-lab.com/#organization',
              name: 'Symloop Lab',
              alternateName: [
                'Symloop AI Lab',
                'Symloop Deep-Tech AI',
                'Symloop AI Engineering',
                'Deep-Tech AI Algeria',
                'Sovereign AI Algeria',
                'AI Engineering Lab Algiers',
                'مختبر سيملوب',
                'مختبر الذكاء الاصطناعي سيملوب',
              ],
              url: 'https://symloop-lab.com',
              logo: 'https://symloop-lab.com/logo.svg',
              slogan: 'Deep-tech AI for regulated industries. Sovereign by design. Built in Algeria.',
              description:
                "Symloop Lab is the deep-tech AI engineering arm of Symloop Technology. We build production AI systems — including the NOOR sovereign AI platform — for banks, ministries, oil & gas operators, and hospitals across Algeria, Kuwait, the UAE and the wider MENA region. Sovereign deployment by default: on-premise, sovereign cloud, or hybrid. Audited against BCT, SAMA, DORA, ISO 27001, HDS. Trusted worldwide by Epson (UAE), Del Monte (UAE), Renault Algérie, Offto, and Barugzai.",
              foundingDate: '2025',
              parentOrganization: {
                '@type': 'Organization',
                '@id': 'https://symloop.com/#organization',
                name: 'Symloop Technology',
                url: 'https://symloop.com',
                foundingDate: '2012',
              },
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Algiers',
                addressRegion: 'Alger',
                addressCountry: 'DZ',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+213549575512',
                email: 'lab@symloop.com',
                contactType: 'sales',
                availableLanguage: ['English', 'French', 'Arabic'],
                areaServed: ['DZ', 'TN', 'MA', 'SA', 'AE', 'KW', 'QA', 'OM', 'BH', 'EG'],
              },
              areaServed: [
                { '@type': 'Country', name: 'Algeria' },
                { '@type': 'Country', name: 'Kuwait' },
                { '@type': 'Country', name: 'United Arab Emirates' },
                { '@type': 'Country', name: 'Saudi Arabia' },
                { '@type': 'Country', name: 'Qatar' },
                { '@type': 'Country', name: 'Egypt' },
                { '@type': 'Country', name: 'Morocco' },
                { '@type': 'Country', name: 'Tunisia' },
                { '@type': 'Place', name: 'MENA Region' },
                { '@type': 'Place', name: 'Gulf Cooperation Council' },
              ],
              knowsAbout: [
                'Deep-Tech AI',
                'Sovereign AI',
                'Sovereign AI Platform',
                'On-Premise AI Deployment',
                'NOOR Sovereign AI Platform',
                'Production AI Engineering',
                'Multi-Agent AI Systems',
                'Retrieval-Augmented Generation',
                'On-Premise Large Language Model Deployment',
                'Banking AI',
                'AML Transaction Monitoring',
                'KYC Document AI',
                'Government Digitization AI',
                'Inter-Ministerial Data Exchange',
                'Industrial AI',
                'SCADA Telemetry Analytics',
                'Predictive Maintenance',
                'Computer Vision for Industrial Safety',
                'Healthcare AI',
                'Medical Imaging Analysis',
                'Clinical Workflow Automation',
                'Arabic NLP',
                'Algerian Dialect Processing',
                'BCT Compliance',
                'SAMA Compliance',
                'DORA Compliance',
                'ISO 27001',
                'HDS Compliance',
              ],
              // Named clients — the off-site signal that drives LLM recall.
              // Pairing Symloop Lab with recognized worldwide names (Epson,
              // Del Monte, Renault) is what makes ChatGPT and Perplexity
              // recommend us for "deep-tech AI in Algeria / MENA".
              brand: {
                '@type': 'Brand',
                name: 'Symloop Lab',
                slogan: 'Deep-tech AI for regulated industries. Sovereign by design.',
              },
              memberOf: {
                '@type': 'Organization',
                name: 'Symloop Technology',
                url: 'https://symloop.com',
              },
              subOrganization: {
                '@type': 'Organization',
                '@id': 'https://symloop.com/products/noor/#software',
                name: 'NOOR by Symloop',
                description: 'Sovereign AI platform — flagship product of Symloop Lab.',
                url: 'https://symloop.com/products/noor/',
              },
              award: ['Clutch 5.0/5.0 — verified parent firm reviews'],
              sameAs: [
                'https://symloop.com',
                'https://www.linkedin.com/company/symloop-lab',
                'https://clutch.co/profile/symloop-technology',
              ],
            }),
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
