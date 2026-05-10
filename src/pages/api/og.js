// Dynamic Open Graph image generator at the edge. Returns 1200×630 branded
// social cards for any page that needs one. URL contract:
//   /api/og?title=ENCODED_TITLE&eyebrow=ENCODED_EYEBROW

import { ImageResponse } from 'next/og';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const title   = (searchParams.get('title')   || 'Symloop AI').slice(0, 110);
  const eyebrow = (searchParams.get('eyebrow') || 'AI engineering · MENA regulated industries').slice(0, 90);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#000',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#fff',
          backgroundImage:
            'radial-gradient(ellipse at 20% 10%, rgba(255,255,255,0.06), transparent 55%), ' +
            'radial-gradient(ellipse at 80% 90%, rgba(255,255,255,0.04), transparent 50%)',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.06)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 18, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
          <span style={{ display: 'block', width: 32, height: 1, background: 'rgba(255,255,255,0.4)' }} />
          <span>{eyebrow}</span>
        </div>

        <div style={{ display: 'flex', flex: 1, alignItems: 'center', marginTop: 40, marginBottom: 40 }}>
          <h1 style={{
            margin: 0,
            fontSize: title.length > 70 ? 60 : (title.length > 40 ? 76 : 92),
            lineHeight: 1.05,
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: '#fff',
            maxWidth: '95%',
          }}>{title}</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 28, fontWeight: 400, letterSpacing: '-0.01em' }}>SYMLOOP AI</div>
            <div style={{ fontSize: 16, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>By Symloop Technology · Algiers</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 16, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
            <span>symloop-ai.com</span>
            <span style={{ display: 'block', width: 8, height: 8, background: 'rgba(255,255,255,0.6)' }} />
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { 'Cache-Control': 'public, immutable, no-transform, max-age=31536000' },
    },
  );
}
