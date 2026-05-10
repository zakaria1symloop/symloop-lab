"use client";
// ============================================================================
// ImpactMetrics — animated ROI dashboard for the hero.
//
// Four large metric tiles, each with:
//   - Dramatic number that ticks up with a spring (not a linear count)
//   - Cyan SVG sparkline that draws itself + continues to oscillate
//   - Pulsing status dot
//   - Subtle "+ delta" trail underneath the number
//
// Composition: stacked grid where every tile feels like a live KPI panel
// pulled from a banking trading floor or a procurement war-room dashboard.
// The motion communicates compounding ROI without any sector mention.
// ============================================================================

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { TrendingUp, ShieldCheck, Zap, Activity } from 'lucide-react';

// ── Sparkline path generator ────────────────────────────────────────────
// Generates an upward-trending wavy path for a tile's mini chart. Each tile
// gets a different seed so the four sparklines look distinct.
function buildSparkline(points, w, h, seed) {
  const step = w / (points - 1);
  const r = (i) => Math.sin(seed + i * 0.7) * 0.5 + Math.cos(seed * 2 + i * 1.1) * 0.3;
  let d = '';
  for (let i = 0; i < points; i++) {
    const x = i * step;
    // base trend rises from h*0.85 to h*0.10
    const trend = h * 0.85 - (h * 0.75) * (i / (points - 1));
    const noise = r(i) * h * 0.10;
    const y = trend + noise;
    d += (i === 0 ? 'M' : ' L') + ` ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

const TILES = [
  {
    Icon:  TrendingUp,
    badge: '+',
    value: 340,
    suffix: '%',
    decimals: 0,
    duration: 2.1,
    sparkSeed: 0.7,
    en:  { label: 'Throughput uplift',           sub: 'Tasks · agents · transactions' },
    fr:  { label: 'Hausse de débit',              sub: 'Tâches · agents · transactions' },
    ar:  { label: 'زيادة الإنتاجية',              sub: 'مهام · وكلاء · معاملات' },
  },
  {
    Icon:  Zap,
    badge: '×',
    value: 12.4,
    suffix: 'M',
    decimals: 1,
    prefix: '€',
    duration: 2.6,
    sparkSeed: 2.3,
    en:  { label: 'Annual ROI per engagement',   sub: 'Average · 18-month horizon' },
    fr:  { label: 'ROI annuel par engagement',    sub: 'Moyen · horizon 18 mois' },
    ar:  { label: 'ROI سنوي لكل ارتباط',          sub: 'متوسط · أفق 18 شهراً' },
  },
  {
    Icon:  ShieldCheck,
    badge: '−',
    value: 87,
    suffix: '%',
    decimals: 0,
    duration: 1.8,
    sparkSeed: 1.4,
    en:  { label: 'Less manual review',           sub: 'Automated · audit-logged' },
    fr:  { label: 'Moins de revue manuelle',      sub: 'Automatisé · loggué pour audit' },
    ar:  { label: 'مراجعة يدوية أقل',             sub: 'مؤتمت · مسجل للتدقيق' },
  },
  {
    Icon:  Activity,
    badge: '↑',
    value: 99.9,
    suffix: '%',
    decimals: 1,
    duration: 2.3,
    sparkSeed: 3.5,
    en:  { label: 'Operational SLA',               sub: 'On-prem · sovereign · 24/7' },
    fr:  { label: 'SLA opérationnel',              sub: 'On-prem · souverain · 24/7' },
    ar:  { label: 'SLA تشغيلي',                    sub: 'on-prem · سيادي · 24/7' },
  },
];

function CounterValue({ value, prefix = '', suffix = '', decimals = 0, duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (v) => v.toFixed(decimals));

  useEffect(() => { if (inView) motionValue.set(value); }, [inView, value, motionValue]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}<motion.span>{display}</motion.span>{suffix}
    </span>
  );
}

function Tile({ tile, locale, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const Icon = tile.Icon;
  const t = tile[locale] || tile.en;

  const sparkD = buildSparkline(28, 200, 60, tile.sparkSeed);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-black/45 backdrop-blur-md border border-white/[0.08] hover:border-white/30 transition-colors p-5 lg:p-6 overflow-hidden"
    >
      {/* Header — icon + status pulse */}
      <div className="flex items-center justify-between mb-5">
        <Icon className="w-4 h-4 text-white/90" strokeWidth={1.25} />
        <span className="block w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ boxShadow: '0 0 8px rgba(255, 255, 255,0.7)' }} />
      </div>

      {/* Big counter */}
      <div className="text-[40px] lg:text-[52px] font-light tracking-[-0.02em] text-white leading-none mb-1 flex items-baseline gap-1">
        <span className="text-white/90/90 text-[24px] lg:text-[28px] mr-0.5">{tile.badge}</span>
        {inView && (
          <CounterValue
            value={tile.value}
            prefix={tile.prefix || ''}
            suffix={tile.suffix}
            decimals={tile.decimals}
            duration={tile.duration}
          />
        )}
      </div>

      {/* Label + sub */}
      <div className="text-[12px] text-white/65 leading-snug font-light mb-1">{t.label}</div>
      <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/30 mb-4">{t.sub}</div>

      {/* Sparkline */}
      <svg className="w-full h-12 -mb-1" viewBox="0 0 200 60" preserveAspectRatio="none">
        {/* baseline grid */}
        <line x1="0" y1="48" x2="200" y2="48" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 4" />
        {/* sparkline path — animated stroke-dashoffset draw-in */}
        <motion.path
          d={sparkD}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 0 4px rgba(255, 255, 255,0.5))' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2.6, delay: 0.6 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* end-of-line glowing dot */}
        <motion.circle
          cx="200"
          cy={(() => {
            // approximate the y-coordinate of the last point
            const last = 200;
            const r = (i) => Math.sin(tile.sparkSeed + i * 0.7) * 0.5 + Math.cos(tile.sparkSeed * 2 + i * 1.1) * 0.3;
            const i = 27;
            return 60 * 0.85 - (60 * 0.75) * (i / 27) + r(i) * 60 * 0.10;
          })()}
          r="2.5"
          fill="#ffffff"
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 3.0 + index * 0.12 }}
        >
          <animate attributeName="r" values="2.5;4;2.5" dur="2s" repeatCount="indefinite" />
        </motion.circle>
      </svg>
    </motion.div>
  );
}

export default function ImpactMetrics({ locale = 'en' }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:gap-4 w-full">
      {TILES.map((tile, i) => (
        <Tile key={i} tile={tile} locale={locale} index={i} />
      ))}
    </div>
  );
}
