"use client";
// ============================================================================
// FastBars — fast-streaking horizontal data bars that shoot across the hero.
//
// 14 bars at different vertical positions, lengths, speeds, colors. Each
// bar starts off-screen left, accelerates across the full hero width, then
// loops. The opacity ramps up at the leading edge and fades on the trailing
// tail so the motion reads as "data streaming in" rather than blocks sliding.
//
// Pure CSS keyframes — no JS per-frame, runs at 60fps on the GPU.
// ============================================================================

const BARS = [
  { top: '8%',   width: 220, dur: 2.4, delay: 0,    color: 'rgba(255, 255, 255, 0.85)', height: 1.5 },
  { top: '14%',  width: 140, dur: 1.8, delay: 0.7,  color: 'rgba(255, 255, 255, 0.30)', height: 1 },
  { top: '20%',  width: 320, dur: 3.0, delay: 0.3,  color: 'rgba(255, 255, 255, 0.55)', height: 2 },
  { top: '26%',  width: 180, dur: 2.0, delay: 1.1,  color: 'rgba(255, 255, 255, 0.20)', height: 1 },
  { top: '32%',  width: 260, dur: 2.6, delay: 0.5,  color: 'rgba(255, 255, 255, 0.95)', height: 1.5 },
  { top: '40%',  width: 100, dur: 1.6, delay: 1.4,  color: 'rgba(255, 255, 255, 0.40)', height: 1 },
  { top: '48%',  width: 380, dur: 3.4, delay: 0.2,  color: 'rgba(255, 255, 255, 0.45)', height: 2 },
  { top: '55%',  width: 200, dur: 2.2, delay: 1.8,  color: 'rgba(255, 255, 255, 0.70)', height: 1.5 },
  { top: '62%',  width: 160, dur: 1.9, delay: 0.9,  color: 'rgba(255, 255, 255, 0.25)', height: 1 },
  { top: '70%',  width: 290, dur: 2.8, delay: 0.1,  color: 'rgba(255, 255, 255, 0.50)', height: 1.5 },
  { top: '76%',  width: 120, dur: 1.5, delay: 1.6,  color: 'rgba(255, 255, 255, 0.18)', height: 1 },
  { top: '83%',  width: 240, dur: 2.5, delay: 0.6,  color: 'rgba(255, 255, 255, 0.65)', height: 2 },
  { top: '88%',  width: 170, dur: 2.1, delay: 1.2,  color: 'rgba(255, 255, 255, 0.22)', height: 1 },
  { top: '94%',  width: 310, dur: 3.2, delay: 0.4,  color: 'rgba(255, 255, 255, 0.45)', height: 1.5 },
];

export default function FastBars() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {BARS.map((b, i) => (
        <div
          key={i}
          className="fast-bar"
          style={{
            position: 'absolute',
            top: b.top,
            left: 0,
            width: `${b.width}px`,
            height: `${b.height}px`,
            background: `linear-gradient(90deg, transparent 0%, ${b.color} 30%, ${b.color} 70%, transparent 100%)`,
            boxShadow: b.color.includes('34, 211, 238') ? `0 0 12px ${b.color}` : 'none',
            animation: `streakAcross ${b.dur}s linear infinite`,
            animationDelay: `${b.delay}s`,
            willChange: 'transform, opacity',
          }}
        />
      ))}

      <style jsx global>{`
        @keyframes streakAcross {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translateX(100vw);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
