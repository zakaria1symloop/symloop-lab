"use client";
// ============================================================================
// HeroWaves — full-bleed animated wave field for the hero background.
//
// Eight layered SVG sine paths, each with a different amplitude, frequency,
// vertical position, opacity, and animation duration. Two of them carry the
// cyan accent. The motion is pure CSS keyframes (translateX) so it runs on
// the GPU at 60fps with zero JS per-frame cost.
//
// Designed to sit BEHIND the hero content. A vignette is applied at the
// edges so foreground text stays legible.
// ============================================================================

const WAVES = [
  { y: 22, a: 22, freq: 0.012, opacity: 0.10, color: 'white', dur: 38, dir:  1 },
  { y: 35, a: 30, freq: 0.009, opacity: 0.07, color: 'white', dur: 52, dir: -1 },
  { y: 48, a: 38, freq: 0.011, opacity: 0.18, color: 'cyan',  dur: 30, dir:  1 },
  { y: 55, a: 26, freq: 0.014, opacity: 0.08, color: 'white', dur: 42, dir: -1 },
  { y: 65, a: 44, freq: 0.008, opacity: 0.22, color: 'cyan',  dur: 26, dir:  1 },
  { y: 72, a: 30, freq: 0.010, opacity: 0.06, color: 'white', dur: 60, dir: -1 },
  { y: 82, a: 36, freq: 0.013, opacity: 0.12, color: 'white', dur: 34, dir:  1 },
  { y: 90, a: 24, freq: 0.015, opacity: 0.05, color: 'white', dur: 48, dir: -1 },
];

// Build one wave path that's twice the viewBox width so we can translate
// by exactly 50% (=one period) for a seamless infinite scroll.
function buildPath({ y, a, freq, viewW = 2400, viewH = 100 }) {
  const cy = (y / 100) * viewH;
  const stepX = 8;
  let d = `M 0 ${cy}`;
  for (let x = 0; x <= viewW; x += stepX) {
    const yy = cy + Math.sin(x * freq) * a;
    d += ` L ${x} ${yy}`;
  }
  return d;
}

export default function HeroWaves() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" aria-hidden>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
      >
        <defs>
          {/* soft glow for the cyan accent waves */}
          <filter id="cyanWaveGlow" x="-5%" y="-50%" width="110%" height="200%">
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>

        {WAVES.map((w, i) => {
          const stroke = w.color === 'cyan' ? '#ffffff' : '#ffffff';
          const filter = w.color === 'cyan' ? 'url(#cyanWaveGlow)' : undefined;
          const translateClass = `wave-${w.dir > 0 ? 'right' : 'left'}-${w.dur}`;
          return (
            <g
              key={i}
              style={{
                animation: `${w.dir > 0 ? 'flowRight' : 'flowLeft'} ${w.dur}s linear infinite`,
              }}
            >
              {/* Render the path twice, side by side, so translating by -50%
                  produces a seamless loop. */}
              <path
                d={buildPath({ y: w.y, a: w.a, freq: w.freq, viewW: 2400 })}
                fill="none"
                stroke={stroke}
                strokeWidth="0.8"
                strokeLinecap="round"
                opacity={w.opacity}
                filter={filter}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          );
        })}
      </svg>

      <style jsx>{`
        @keyframes flowRight {
          from { transform: translateX(0); }
          to   { transform: translateX(-1200px); }
        }
        @keyframes flowLeft {
          from { transform: translateX(-1200px); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
