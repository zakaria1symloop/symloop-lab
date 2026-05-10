"use client";
// ============================================================================
// AIConsole — animated demonstration of what the AI actually does.
//
// Cycles through four scenarios, each showing an end-to-end AI workflow:
//
//   1. Banking — fraud detection on a real-time transaction
//   2. Government — citizen petition triage and routing
//   3. Oil & Gas — predictive maintenance on SCADA telemetry
//   4. Compliance — automated BCT monthly report
//
// Each scenario plays as a sequence of typed steps:
//   - Input arrives (typewriter effect)
//   - Sources are pulled (line-by-line with checkmarks)
//   - Decision/output emerges with confidence + citations
//   - Pause, fade, next scenario
//
// Built in vanilla React + framer-motion — no Three.js, no Rive. Premium
// editorial aesthetic, not green-on-black terminal cliché.
// ============================================================================

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, CheckCircle2, FileText, Wrench, ScrollText,
  Building2, Landmark, Factory, FileBarChart,
} from 'lucide-react';

// Each scenario is fully data-driven: lines arrive on a timeline of `at` ms
// so the visual rhythm is hand-tuned (not a uniform crawl).
const SCENARIOS = [
  {
    Icon:    Building2,
    sectorEn: 'Banking · BCT', sectorFr: 'Banque · BCT', sectorAr: 'المصارف · BCT',
    titleEn: 'Real-time fraud detection', titleFr: 'Détection de fraude en temps réel', titleAr: 'كشف الاحتيال الفوري',
    queryEn: '› Transaction · 240,000 DZD · merchant 4× / 30s',
    queryFr: '› Transaction · 240 000 DZD · marchand 4× / 30 s',
    queryAr: '› معاملة · 240,000 د.ج · تاجر 4× / 30 ث',
    steps: [
      { at: 1200, kind: 'check', en: 'Cross-checked customer pattern · 18 mo history',                fr: 'Profil client vérifié · 18 mo d\'historique',                       ar: 'تم فحص نمط العميل · 18 شهراً' },
      { at: 1800, kind: 'check', en: 'Velocity rule fired · 4 of 4 same-merchant under 30 s',         fr: 'Règle de vélocité déclenchée · 4 sur 4 même marchand en < 30 s',     ar: 'قاعدة السرعة مفعَّلة · 4 من 4 نفس التاجر خلال 30 ث' },
      { at: 2400, kind: 'check', en: 'Geo-fence violated · 2 cities, 14 km, 11 s apart',              fr: 'Geo-fence violée · 2 villes, 14 km, 11 s d\'écart',                  ar: 'تم خرق Geo-fence · مدينتان، 14 كم، 11 ث' },
      { at: 3200, kind: 'alert', en: 'BLOCKED · SAR drafted for BCT · agent notified',                fr: 'BLOQUÉ · SAR rédigé pour BCT · agent notifié',                       ar: 'محظور · تم صياغة SAR لـ BCT · إشعار للمسؤول' },
    ],
    out: { en: 'Decision in 142 ms · 99.4% confidence', fr: 'Décision en 142 ms · 99,4 % de confiance', ar: 'قرار في 142 مللي ثانية · ثقة 99.4%' },
  },
  {
    Icon:    Landmark,
    sectorEn: 'Government · Wilaya', sectorFr: 'Gouvernement · Wilaya', sectorAr: 'الحكومة · ولاية',
    titleEn: 'Citizen petition triage',  titleFr: 'Triage des requêtes citoyennes', titleAr: 'فرز طلبات المواطنين',
    queryEn: '› Petition #4,287 · Arabic dialect · 2 photos attached',
    queryFr: '› Pétition n°4 287 · arabe dialectal · 2 photos jointes',
    queryAr: '› طلب رقم 4,287 · عربية دارجة · صورتان مرفقتان',
    steps: [
      { at: 1100, kind: 'check', en: 'Language detected · Algerian Darija',                            fr: 'Langue détectée · darija algérien',                                  ar: 'اللغة المكتشفة · الدارجة الجزائرية' },
      { at: 1700, kind: 'check', en: 'Intent classified · housing aid request',                        fr: 'Intention classée · demande d\'aide au logement',                    ar: 'النية المصنفة · طلب مساعدة سكن' },
      { at: 2300, kind: 'check', en: 'National ID extracted · CNI matched in registry',                fr: 'CNI extraite · correspondance dans le registre',                     ar: 'استخراج بطاقة التعريف · مطابقة في السجل' },
      { at: 3000, kind: 'check', en: 'Routed · Direction du Logement · Wilaya/Algiers',                fr: 'Routé · Direction du Logement · Wilaya/Alger',                       ar: 'تم التوجيه · مديرية السكن · ولاية الجزائر' },
    ],
    out: { en: 'Assigned to officer in 3.1 s · audit-logged', fr: 'Assigné à l\'agent en 3,1 s · loggué pour audit', ar: 'تم الإسناد للموظف خلال 3.1 ث · مسجل للتدقيق' },
  },
  {
    Icon:    Factory,
    sectorEn: 'Oil & Gas · Upstream', sectorFr: 'Oil & Gas · Upstream', sectorAr: 'النفط والغاز · upstream',
    titleEn: 'Predictive maintenance', titleFr: 'Maintenance prédictive', titleAr: 'الصيانة التنبؤية',
    queryEn: '› SCADA stream · pump P-204 · 14 sensors · 6 hr window',
    queryFr: '› Flux SCADA · pompe P-204 · 14 capteurs · fenêtre 6 h',
    queryAr: '› تدفق SCADA · مضخة P-204 · 14 مستشعراً · نافذة 6 س',
    steps: [
      { at: 1300, kind: 'check', en: 'Vibration anomaly · band 4–6 kHz · trending up',                fr: 'Anomalie vibratoire · bande 4-6 kHz · en hausse',                    ar: 'شذوذ اهتزازي · نطاق 4-6 كيلوهرتز · يتصاعد' },
      { at: 1900, kind: 'check', en: 'Bearing temp · +8°C above baseline · 47 min',                    fr: 'Temp roulement · +8°C au-dessus de la baseline · 47 min',            ar: 'درجة حرارة المحمل · +8°م فوق الأساس · 47 دقيقة' },
      { at: 2500, kind: 'check', en: 'Cross-correlated with 22 historical failures',                  fr: 'Corrélé avec 22 défaillances historiques',                           ar: 'تم الربط مع 22 حالة فشل سابقة' },
      { at: 3300, kind: 'alert', en: 'Predicted failure window · 71 ± 6 hours · work order issued',   fr: 'Fenêtre de défaillance prédite · 71 ± 6 h · ordre de travail émis',  ar: 'نافذة الفشل المتوقعة · 71 ± 6 ساعة · إصدار أمر عمل' },
    ],
    out: { en: 'Avoided downtime · est. 4.2M USD',     fr: "Arrêt évité · estimé 4,2 M USD",          ar: 'تجنب التوقف · تقدير 4.2 مليون دولار' },
  },
  {
    Icon:    FileBarChart,
    sectorEn: 'Compliance · BCT monthly', sectorFr: 'Conformité · BCT mensuel', sectorAr: 'الامتثال · BCT شهري',
    titleEn: 'Automated regulator report', titleFr: 'Rapport régulateur automatisé', titleAr: 'تقرير تنظيمي آلي',
    queryEn: '› BCT Form 17 · April 2026 · 1.4M transactions',
    queryFr: '› Formulaire BCT 17 · avril 2026 · 1,4 M transactions',
    queryAr: '› نموذج BCT 17 · أبريل 2026 · 1.4 مليون معاملة',
    steps: [
      { at: 1100, kind: 'check', en: 'Aggregated · 47 categories · 1,408,512 records',                 fr: 'Agrégé · 47 catégories · 1 408 512 enregistrements',                  ar: 'تم التجميع · 47 فئة · 1,408,512 سجلاً' },
      { at: 1700, kind: 'check', en: 'Cross-validated against general ledger · 100 % match',           fr: 'Croisé avec grand livre · 100 % correspondance',                      ar: 'تم التحقق مع دفتر الأستاذ · مطابقة 100%' },
      { at: 2300, kind: 'check', en: 'AML/SAR section auto-populated · 12 flagged items',              fr: 'Section AML/SAR remplie · 12 items signalés',                         ar: 'قسم AML/SAR مملوء · 12 بنداً مُعلَّم' },
      { at: 3100, kind: 'check', en: 'Signed · digital seal · ready for submission',                   fr: 'Signé · sceau numérique · prêt à soumettre',                          ar: 'موقَّع · ختم رقمي · جاهز للتقديم' },
    ],
    out: { en: '96 hours of analyst work · saved each month',     fr: '96 h de travail analyste · économisées par mois',        ar: '96 ساعة عمل محلل · موفرة كل شهر' },
  },
];

const TOTAL_DURATION = 5400; // ms per scenario

function useTypewriter(text, durationMs = 700) {
  const [out, setOut] = useState('');
  useEffect(() => {
    setOut('');
    if (!text) return;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      const len = Math.floor(t * text.length);
      setOut(text.slice(0, len));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, durationMs]);
  return out;
}

function pickLocaleField(obj, suffix, locale) {
  // obj has fields like sectorEn / sectorFr / sectorAr
  const key = suffix + (locale === 'fr' ? 'Fr' : locale === 'ar' ? 'Ar' : 'En');
  return obj[key];
}

export default function AIConsole({ locale = 'en' }) {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [tick, setTick] = useState(0);
  const startedAt = useRef(performance.now());

  // Drive a tick every 50ms so the steps gate themselves on `step.at`
  useEffect(() => {
    let raf;
    const loop = (now) => {
      setTick(now - startedAt.current);
      if (now - startedAt.current > TOTAL_DURATION) {
        startedAt.current = now;
        setScenarioIdx((i) => (i + 1) % SCENARIOS.length);
        setTick(0);
      } else {
        raf = requestAnimationFrame(loop);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [scenarioIdx]);

  const scenario = SCENARIOS[scenarioIdx];
  const Icon  = scenario.Icon;
  const sector = pickLocaleField(scenario, 'sector', locale);
  const title  = pickLocaleField(scenario, 'title',  locale);
  const query  = pickLocaleField(scenario, 'query',  locale);
  const out    = scenario.out[locale] || scenario.out.en;

  const queryDisplayed = useTypewriter(query, 700);

  return (
    <div className="relative w-full bg-black/60 backdrop-blur-md border border-white/[0.08] overflow-hidden font-mono">
      {/* Header strip */}
      <div className="flex items-center justify-between px-5 lg:px-6 py-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <span className="block w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ boxShadow: '0 0 8px rgba(255, 255, 255,0.7)' }} />
          <Icon className="w-3.5 h-3.5 text-white/90" strokeWidth={1.5} />
          <span className="text-[10px] tracking-[0.25em] uppercase text-white/55">{sector}</span>
        </div>
        <div className="text-[10px] tracking-[0.18em] uppercase text-white/30 hidden sm:block">live</div>
      </div>

      {/* Title */}
      <div className="px-5 lg:px-6 pt-5 pb-3">
        <AnimatePresence mode="wait">
          <motion.h3
            key={`title-${scenarioIdx}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-[15px] lg:text-[16px] font-light tracking-tight text-white leading-tight"
            style={{ fontFamily: 'var(--font-ibm-plex-arabic), system-ui, sans-serif' }}
          >
            {title}
          </motion.h3>
        </AnimatePresence>
      </div>

      {/* Query line — typewriter */}
      <div className="px-5 lg:px-6 pb-4">
        <div className="text-[12px] lg:text-[13px] text-white/90/90 leading-relaxed min-h-[1.5em]">
          {queryDisplayed}<span className="inline-block w-1.5 h-3 bg-white/80 ml-1 align-middle animate-pulse" />
        </div>
      </div>

      {/* Steps */}
      <ul className="px-5 lg:px-6 space-y-2 min-h-[160px] pb-5">
        {scenario.steps.map((step, i) => {
          const visible = tick >= step.at;
          const text  = step[locale] || step.en;
          const isAlert = step.kind === 'alert';
          return (
            <motion.li
              key={`${scenarioIdx}-${i}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start gap-3 text-[12px] lg:text-[13px] leading-relaxed"
            >
              {isAlert ? (
                <AlertTriangle className="w-3.5 h-3.5 text-white/90 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-white/60 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              )}
              <span className={isAlert ? 'text-white font-medium' : 'text-white/70'}>{text}</span>
            </motion.li>
          );
        })}
      </ul>

      {/* Outcome footer */}
      <div className="px-5 lg:px-6 py-4 border-t border-white/[0.08] bg-white/[0.03]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`out-${scenarioIdx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: tick > 3500 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between gap-3"
          >
            <span className="text-[11px] tracking-[0.18em] uppercase text-white/90">{out}</span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">
              {scenarioIdx + 1} / {SCENARIOS.length}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.04]">
        <motion.div
          key={scenarioIdx}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: TOTAL_DURATION / 1000, ease: 'linear' }}
          className="h-full bg-white/60 origin-left"
        />
      </div>
    </div>
  );
}
