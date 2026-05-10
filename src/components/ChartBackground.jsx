"use client";
import { useEffect, useRef, useState } from 'react';

// ChartBackground — animated LINE chart that only renders when the parent
// section enters the viewport. Used behind the Manifesto: the user scrolls,
// the manifesto comes into view, and a single rising line draws itself
// behind the text along with floating financial figures ($ ARR, ROI %, etc).
//
// Pure SVG + CSS keyframes. No JS per-frame, no chart library.
//
// Use:
//   <section className="relative">
//     <ChartBackground topLabel="ROI · LIVE" />
//     <div className="relative z-10">{your content}</div>
//   </section>

// Single rising line — deliberately monotonic-up because the manifesto
// is about compounding business returns. Values normalized to a 0..1 box.
const LINE_POINTS = [
  [0.00, 0.82],
  [0.06, 0.78],
  [0.12, 0.81],
  [0.18, 0.74],
  [0.24, 0.68],
  [0.30, 0.71],
  [0.36, 0.62],
  [0.42, 0.58],
  [0.48, 0.50],
  [0.54, 0.46],
  [0.60, 0.42],
  [0.66, 0.34],
  [0.72, 0.30],
  [0.78, 0.24],
  [0.84, 0.20],
  [0.90, 0.14],
  [0.96, 0.10],
  [1.00, 0.06],
];

// Financial annotations — the "text of money" floating in the chart.
// Positioned at percentage of viewport, anchored to specific x ranges so
// they appear next to the line as it rises.
const MONEY_LABELS = [
  { x: '8%',  y: '76%',  text: '+0%',     sub: 'baseline',    delay: 0.4  },
  { x: '24%', y: '60%',  text: '+18%',    sub: 'month 3',     delay: 0.9  },
  { x: '46%', y: '42%',  text: '$640K',   sub: 'pipeline',    delay: 1.4  },
  { x: '62%', y: '30%',  text: '+47%',    sub: 'ROI · q2',    delay: 1.8  },
  { x: '80%', y: '18%',  text: '$2.4M',   sub: 'arr · q3',    delay: 2.2  },
  { x: '94%', y: '8%',   text: '$8.1M',   sub: 'arr · q4',    delay: 2.6  },
];

export default function ChartBackground({ topLabel = 'ROI · LIVE TELEMETRY' }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  // Trigger only when the parent section enters the viewport.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setInView(true);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // SVG path string — line through all points in a 0..100 viewBox space.
  const pathD = LINE_POINTS
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${(x * 100).toFixed(2)} ${(y * 100).toFixed(2)}`)
    .join(' ');

  // Approximate path length for stroke-dash animation. The actual length
  // depends on the rendered viewBox; an upper bound of 220 covers the path
  // length comfortably so the dashoffset cleanly reveals the whole line.
  const PATH_LEN = 220;

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden chart-bg ${inView ? 'is-visible' : ''}`}
    >
      {/* Top label — terminal-style indicator above the chart */}
      <div className="absolute top-6 lg:top-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 font-mono text-[10px] tracking-[0.32em] uppercase text-white/30">
        <span className="block w-1.5 h-1.5 bg-white rounded-full chart-pulse" />
        <span>{topLabel}</span>
      </div>

      {/* Y-axis hairlines */}
      <div className="absolute inset-x-0 top-[18%] bottom-[12%]">
        {[0, 0.33, 0.66, 1].map(p => (
          <div
            key={p}
            className="absolute left-0 right-0 h-px bg-white/[0.04]"
            style={{ top: `${p * 100}%` }}
          />
        ))}
      </div>

      {/* The line itself — SVG, drawn on viewport entry */}
      <svg
        className="absolute inset-x-0 top-[18%] w-full chart-svg"
        style={{ height: '70%' }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Soft fill below the line for depth (very subtle) */}
        <path
          d={`${pathD} L 100 100 L 0 100 Z`}
          fill="url(#chartFill)"
          className="chart-fill"
        />
        {/* The stroke line */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="0.35"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="chart-line"
        />
        {/* Endpoint dot */}
        <circle
          cx={LINE_POINTS[LINE_POINTS.length - 1][0] * 100}
          cy={LINE_POINTS[LINE_POINTS.length - 1][1] * 100}
          r="0.9"
          fill="white"
          className="chart-dot"
        />
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.10)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Financial annotations — "text of money" floating along the line */}
      <div className="absolute inset-x-0 top-[18%] money-layer" style={{ height: '70%' }}>
        {MONEY_LABELS.map((m, i) => (
          <div
            key={i}
            className="money-label absolute"
            style={{
              left: m.x,
              top: m.y,
              transform: 'translate(-50%, -110%)',
              animationDelay: `${m.delay}s`,
            }}
          >
            <div className="font-mono text-[13px] lg:text-[15px] tracking-[0.04em] text-white/55 leading-none">
              {m.text}
            </div>
            <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/25 mt-1.5 leading-none">
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom axis */}
      <div className="absolute left-0 right-0 bottom-[12%] h-px bg-white/[0.08]" />

      <style jsx>{`
        @keyframes chartPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.4); }
        }
        .chart-pulse { animation: chartPulse 1.6s ease-in-out infinite; }

        /* Line draw — only runs when .is-visible is set on the parent */
        .chart-line {
          stroke-dasharray: ${PATH_LEN};
          stroke-dashoffset: ${PATH_LEN};
        }
        .is-visible .chart-line {
          animation: chartDraw 3.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes chartDraw {
          to { stroke-dashoffset: 0; }
        }

        /* Fill fade-in after the line draws */
        .chart-fill { opacity: 0; }
        .is-visible .chart-fill {
          animation: fadeIn 1.2s ease-in-out 2.4s forwards;
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }

        /* Endpoint dot — appears at the end of the draw and pulses */
        .chart-dot { opacity: 0; }
        .is-visible .chart-dot {
          animation: dotIn 0.4s ease-out 3.2s forwards, chartPulse 1.6s ease-in-out 3.6s infinite;
        }
        @keyframes dotIn {
          from { opacity: 0; r: 0.4; }
          to   { opacity: 1; r: 0.9; }
        }

        /* Money labels appear in sequence as the line passes them */
        .money-label {
          opacity: 0;
          transform: translate(-50%, -90%);
          will-change: opacity, transform;
        }
        .is-visible .money-label {
          animation: moneyIn 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes moneyIn {
          from { opacity: 0; transform: translate(-50%, -90%); }
          to   { opacity: 1; transform: translate(-50%, -110%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .chart-line, .chart-fill, .chart-dot, .money-label, .chart-pulse {
            animation: none !important;
          }
          .chart-line  { stroke-dashoffset: 0; }
          .chart-fill  { opacity: 1; }
          .chart-dot   { opacity: 1; }
          .money-label { opacity: 1; transform: translate(-50%, -110%); }
        }
      `}</style>
    </div>
  );
}
