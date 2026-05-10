"use client";
// ============================================================================
// OutcomesPanel — animated "what you get when you choose AI" panel.
//
// Sits on the right of the hero. Six outcome cards with:
//   - Animated counter to the value
//   - Live "ticker" label that rotates between operations
//   - Pulsing cyan status dots
//
// All numbers are intentionally directional, not specific client claims.
// ============================================================================
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { TrendingUp, Clock, ShieldCheck, FileBarChart, Activity, Zap } from 'lucide-react';

const OUTCOMES = [
  { Icon: Clock,         num: 87, suf: '%',        labelEn: 'Less manual review',         labelFr: 'Moins de revue manuelle',     labelAr: 'مراجعة يدوية أقل',           tickerEn: ['Compliance reports', 'KYC documents', 'Audit packs'], tickerFr: ['Rapports de conformité', 'Documents KYC', 'Packs d\'audit'], tickerAr: ['تقارير الامتثال', 'مستندات KYC', 'حزم التدقيق'] },
  { Icon: TrendingUp,    num: 340, suf: '%',       labelEn: 'Throughput uplift',          labelFr: 'Hausse de débit',              labelAr: 'زيادة الإنتاجية',           tickerEn: ['Transactions / hour', 'Tickets resolved', 'Cases triaged'],   tickerFr: ['Transactions / heure', 'Tickets résolus', 'Cas triés'],   tickerAr: ['معاملات / ساعة', 'تذاكر محلولة', 'حالات مفروزة'] },
  { Icon: ShieldCheck,   num: 100, suf: '%',       labelEn: 'Audit coverage',             labelFr: "Couverture d'audit",            labelAr: 'تغطية تدقيق',               tickerEn: ['Every query logged', 'Every source cited', 'Every model versioned'], tickerFr: ['Chaque requête loggée', 'Chaque source citée', 'Chaque modèle versionné'], tickerAr: ['كل استعلام مسجل', 'كل مصدر مستشهد', 'كل نموذج معرَّف'] },
  { Icon: FileBarChart,  num: 96, suf: 'h',        labelEn: 'Hours saved / month',         labelFr: 'Heures gagnées / mois',         labelAr: 'ساعات موفرة / شهر',         tickerEn: ['Per compliance officer', 'Per analyst', 'Per ops team'],     tickerFr: ['Par responsable conformité', 'Par analyste', 'Par équipe ops'], tickerAr: ['لكل ضابط امتثال', 'لكل محلل', 'لكل فريق عمليات'] },
  { Icon: Activity,      num: 99.9, suf: '%', d:1, labelEn: 'Operational SLA',             labelFr: 'SLA opérationnel',             labelAr: 'SLA تشغيلي',                tickerEn: ['Edge-redundant', 'Auto-failover', 'Drift-monitored'],         tickerFr: ['Edge redondant', 'Bascule automatique', 'Drift surveillé'],     tickerAr: ['إيدج متعدد', 'انتقال تلقائي', 'مراقبة الانحراف'] },
  { Icon: Zap,           num: 14, suf: 'ms',       labelEn: 'P95 query latency',           labelFr: 'Latence P95',                  labelAr: 'زمن استجابة P95',           tickerEn: ['On-prem deployed', 'GPU optimized', 'Edge cached'],            tickerFr: ['Déployé on-prem', 'Optimisé GPU', 'Cache edge'],               tickerAr: ['نشر on-prem', 'محسَّن GPU', 'كاش edge'] },
];

function MicroCounter({ value, suffix = '', decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1800, bounce: 0 });
  const display = useTransform(spring, (v) => v.toFixed(decimals));
  useEffect(() => { if (inView) motionValue.set(value); }, [inView, value, motionValue]);
  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

function Ticker({ items }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % items.length), 2500);
    return () => clearInterval(id);
  }, [items.length]);
  return (
    <span className="block h-4 overflow-hidden relative" aria-live="polite">
      {items.map((label, idx) => (
        <motion.span
          key={idx}
          initial={false}
          animate={{ y: idx === i ? 0 : (idx < i ? -16 : 16), opacity: idx === i ? 1 : 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 right-0 font-mono text-[10px] tracking-[0.18em] uppercase text-white/40"
        >
          {label}
        </motion.span>
      ))}
    </span>
  );
}

export default function OutcomesPanel({ locale = 'en', headerLabel }) {
  return (
    <div className="relative w-full">
      {/* Panel header */}
      <div className="flex items-center gap-3 mb-5 font-mono text-[10px] tracking-[0.25em] uppercase text-white/45">
        <span className="block w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ boxShadow: '0 0 8px rgba(255, 255, 255,0.7)' }} />
        <span>{headerLabel}</span>
      </div>

      {/* 2x3 grid of outcome cards */}
      <div className="grid grid-cols-2 gap-px bg-white/[0.08] border border-white/[0.08]">
        {OUTCOMES.map((o, i) => {
          const Icon = o.Icon;
          const label  = locale === 'fr' ? o.labelFr  : locale === 'ar' ? o.labelAr  : o.labelEn;
          const ticker = locale === 'fr' ? o.tickerFr : locale === 'ar' ? o.tickerAr : o.tickerEn;
          return (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group bg-black p-5 lg:p-6 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center justify-between mb-5">
                <Icon className="w-4 h-4 text-white/70 group-hover:text-white/90 transition-colors" strokeWidth={1.25} />
                <span className="block w-1 h-1 bg-white rounded-full" />
              </div>
              <div className="text-[28px] lg:text-[34px] font-light tracking-[-0.01em] text-white leading-none mb-3">
                <MicroCounter value={o.num} suffix={o.suf} decimals={o.d || 0} />
              </div>
              <div className="text-[12px] text-white/55 font-light leading-snug mb-3">{label}</div>
              <Ticker items={ticker} />
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
