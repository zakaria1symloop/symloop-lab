// ============================================================================
// SYMLOOP AI — Homepage (technical / AI-aesthetic, no gradients, B2B-direct)
//
// Visual language:
//   - Pure black background, white text, ONE accent (cyan #ffffff)
//   - Hairline borders + subtle dot-grid background
//   - Mono small-caps for all technical labels
//   - Status indicators (pulsing cyan dots) where relevant
//   - Big numerals on stats, no decoration
//   - No color washes, no gradients, no glass blur
//
// Sections:
//   1. Header (sticky, blur on scroll, locale switcher, anchor nav)
//   2. Hero (B2B-direct: title + dek + framework badges + 2 CTAs + stat strip)
//   3. Manifesto (clean line reveal — no blur)
//   4. Capabilities (technical card grid with mono numerals, hover lift)
//   5. Sectors (4-cell grid, mono spec layout, cyan accent on hover)
//   6. Pillars (3 clean cards, hairline borders, no glass)
//   7. Process (numbered timeline)
//   8. FAQ
//   9. Contact (real form/details before footer)
//   10. Footer (4-col + trust strip)
// ============================================================================

import Head from 'next/head';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/router';
import {
  ArrowRight, ArrowLeft, ArrowUpRight, MessageSquare,
  FileText, Search, Network, Database, FileBarChart,
  Library, Users, Server, ShieldCheck, ShieldHalf, Languages, Activity,
  Building2, Landmark, Factory, Fuel, Store, RadioTower,
  HeartPulse, Code2, Mail, Phone, MapPin,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GridBackground from '../components/GridBackground';
import ChartBackground from '../components/ChartBackground';
import Counter from '../components/Counter';
import ClientMarquee from '../components/ClientMarquee';
import FloatingOrbs from '../components/FloatingOrbs';
import AnimatedHeroTitle from '../components/AnimatedHeroTitle';
import ImpactMetrics from '../components/ImpactMetrics';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const CAPS = [
  { num: '01', icon: MessageSquare, en: { t: 'Ask in plain language', d: 'Operators query the platform in Arabic, French, English. Answers cite every source.' }, fr: { t: 'Posez en langage naturel', d: 'Opérateurs en arabe, français, anglais. Chaque réponse cite ses sources.' }, ar: { t: 'اسأل بلغة عادية', d: 'المشغلون بالعربية، الفرنسية، الإنجليزية. كل إجابة تستشهد بمصدرها.' } },
  { num: '02', icon: FileText, en: { t: 'Document AI', d: 'Extract structured data from PDFs, scanned IDs, contracts — including handwritten Arabic.' }, fr: { t: 'IA documentaire', d: "Extraction depuis PDF, cartes d'identité, contrats — y compris l'arabe manuscrit." }, ar: { t: 'ذكاء المستندات', d: 'استخراج من PDF، البطاقات، العقود — بما في ذلك العربية بخط اليد.' } },
  { num: '03', icon: Search, en: { t: 'RAG over knowledge', d: 'Production retrieval over private wikis, file shares, contracts. Hybrid + reranked.' }, fr: { t: 'RAG sur vos connaissances', d: 'Retrieval production sur wikis, fichiers, contrats. Hybride + reranking.' }, ar: { t: 'RAG على معرفتك', d: 'استرجاع إنتاجي على الويكي، الملفات، العقود. هجين مع إعادة ترتيب.' } },
  { num: '04', icon: Network, en: { t: 'Multi-agent systems', d: 'Orchestrated agents on LangChain, CrewAI, AutoGen, Claude Agent SDK.' }, fr: { t: 'Systèmes multi-agents', d: 'Agents orchestrés sur LangChain, CrewAI, AutoGen, Claude Agent SDK.' }, ar: { t: 'أنظمة متعددة الوكلاء', d: 'وكلاء منسقون على LangChain, CrewAI, AutoGen, Claude Agent SDK.' } },
  { num: '05', icon: Database, en: { t: 'NL → SQL', d: 'Natural language to SQL or your warehouse dialect. Schema-aware. Read-only by default.' }, fr: { t: 'Langage → SQL', d: 'Naturel vers SQL ou dialecte entrepôt. Schema-aware. Read-only par défaut.' }, ar: { t: 'لغة طبيعية → SQL', d: 'الطبيعية إلى SQL أو لهجة المستودع. يفهم المخطط. للقراءة افتراضياً.' } },
  { num: '06', icon: FileBarChart, en: { t: 'Compliance reports', d: 'BCT monthly, SAMA quarterly, AML/SAR, board packs. Scheduled or on-demand.' }, fr: { t: 'Rapports conformité', d: 'BCT mensuels, SAMA trimestriels, AML/SAR, board packs.' }, ar: { t: 'تقارير الامتثال', d: 'BCT شهرية، SAMA ربعية، AML/SAR، حزم المجلس.' } },
  { num: '07', icon: Library, en: { t: 'Knowledge libraries', d: 'Curated, versioned, access-controlled per domain.' }, fr: { t: 'Bibliothèques de savoir', d: "Curatées, versionnées, avec contrôle d'accès par domaine." }, ar: { t: 'مكتبات المعرفة', d: 'منسقة، ذات إصدارات، بتحكم وصول لكل مجال.' } },
  { num: '08', icon: Users, en: { t: 'Specialized assistants', d: 'Pre-trained for KYC, AML, government, industrial maintenance, clinical workflows.' }, fr: { t: 'Assistants spécialisés', d: 'Pré-entraînés pour KYC, AML, gouvernement, maintenance, clinique.' }, ar: { t: 'مساعدون متخصصون', d: 'مدربون لـKYC، AML، الحكومة، الصيانة، السريرية.' } },
  { num: '09', icon: Server, en: { t: 'On-premise / sovereign', d: 'Fully on-premise, sovereign cloud, or hybrid. Air-gapped variant available.' }, fr: { t: 'On-premise / souverain', d: 'On-premise, cloud souverain, hybride. Variante air-gapped.' }, ar: { t: 'على الموقع / سيادي', d: 'on-premise، السحابة السيادية، أو هجين. متاحة نسخة air-gapped.' } },
  { num: '10', icon: ShieldCheck, en: { t: 'Audit every query', d: 'Tamper-evident trail meeting BCT, SAMA, DORA, ISO 27001 from day one.' }, fr: { t: 'Auditez chaque requête', d: 'Piste inviolable conforme BCT, SAMA, DORA, ISO 27001 dès le départ.' }, ar: { t: 'دقق كل استعلام', d: 'مسار مقاوم للعبث يلبي BCT، SAMA، DORA، ISO 27001 من البداية.' } },
  { num: '11', icon: Languages, en: { t: 'Arabic NLP native', d: 'Algerian dialect, Levantine, MSA, French, English. RTL-native interfaces.' }, fr: { t: 'NLP arabe natif', d: 'Algérien, levantin, MSA, français, anglais. Interfaces RTL natives.' }, ar: { t: 'NLP عربي أصلي', d: 'الجزائرية، الشامية، الفصحى، الفرنسية، الإنجليزية. واجهات RTL أصلية.' } },
  { num: '12', icon: Activity, en: { t: '99.9% production SLA', d: 'MLOps, drift detection, blue-green model rollouts. Operated by our SRE.' }, fr: { t: 'SLA 99.9% production', d: 'MLOps, détection de drift, déploiements blue-green. Opéré par notre SRE.' }, ar: { t: 'SLA 99.9% للإنتاج', d: 'MLOps، اكتشاف الانحراف، نشر blue-green. تشغيل من قبل SRE لدينا.' } },
];

// SECTORS — NOOR is a horizontal sovereign AI platform. The list reflects
// every regulated or compliance-heavy vertical we currently ship into.
const SECTORS = [
  { num: '01', icon: Building2,  en: { t: 'Banking',           d: 'Real-time fraud detection. AML/CTF transaction monitoring. KYC document automation. ISO 20022 classification. SAR generation against BCT and SAMA.',        tag: 'BCT · SAMA' },             fr: { t: 'Banque',           d: 'Fraude temps réel. Monitoring AML/CTF. Automatisation KYC. Classification ISO 20022. SAR conformes BCT et SAMA.',          tag: 'BCT · SAMA' },             ar: { t: 'المصارف',           d: 'كشف الاحتيال الفوري. AML/CTF. أتمتة KYC. تصنيف ISO 20022. SAR وفقاً لـ BCT و SAMA.',                                tag: 'BCT · SAMA' } },
  { num: '02', icon: ShieldHalf, en: { t: 'Insurance',         d: 'Claims document AI. Fraud detection across motor, health, and life lines. Underwriting decision support. Reserves and IFRS-17 reporting copilots.',     tag: 'IFRS-17 · CIA' },          fr: { t: 'Assurance',        d: 'IA documentaire pour sinistres. Détection de fraude (auto, santé, vie). Aide à la souscription. Copilotes provisions et IFRS-17.', tag: 'IFRS-17 · CIA' },          ar: { t: 'التأمين',           d: 'ذكاء اصطناعي لمستندات المطالبات. كشف الاحتيال (سيارات، صحة، حياة). دعم اكتتاب. مساعدات IFRS-17.',                tag: 'IFRS-17 · CIA' } },
  { num: '03', icon: Landmark,   en: { t: 'Government',        d: 'Citizen request triage. National ID document AI. Inter-ministerial data exchange with sovereign cloud residency.',                                       tag: 'Sovereign · Ministry' },   fr: { t: 'Gouvernement',     d: 'Triage des demandes citoyennes. IA documentaire pour cartes d\'identité. Échange inter-ministériel souverain.',           tag: 'Souverain · Ministère' },   ar: { t: 'الحكومة',           d: 'فرز طلبات المواطنين. ذكاء اصطناعي للهوية الوطنية. تبادل بين الوزارات بسحابة سيادية.',                            tag: 'سيادي · وزاري' } },
  { num: '04', icon: Factory,    en: { t: 'Manufacturing',     d: 'Vision-based quality control on production lines. Predictive maintenance on PLC/SCADA telemetry. Throughput and yield optimization. OEE copilots.',     tag: 'ISO 9001 · OEE' },         fr: { t: 'Industrie',        d: 'Contrôle qualité par vision sur ligne. Maintenance prédictive PLC/SCADA. Optimisation rendement. Copilotes OEE.',           tag: 'ISO 9001 · OEE' },         ar: { t: 'الصناعة',           d: 'مراقبة جودة بالرؤية على خط الإنتاج. صيانة تنبؤية PLC/SCADA. تحسين الإنتاجية. مساعدات OEE.',                       tag: 'ISO 9001 · OEE' } },
  { num: '05', icon: Fuel,       en: { t: 'Oil & Gas',         d: 'Predictive maintenance over SCADA. Computer vision for safety (PPE, leaks, intrusion). Air-gapped deployment for upstream operators.',                  tag: 'SCADA · Air-gapped' },     fr: { t: 'Oil & Gas',        d: 'Maintenance prédictive SCADA. Vision sécurité (EPI, fuites, intrusion). Déploiement air-gapped upstream.',                tag: 'SCADA · Air-gapped' },     ar: { t: 'النفط والغاز',      d: 'صيانة تنبؤية على SCADA. رؤية سلامة (PPE، تسريبات، تطفل). نشر air-gapped لـupstream.',                              tag: 'SCADA · Air-gapped' } },
  { num: '06', icon: HeartPulse, en: { t: 'Healthcare',        d: 'HIS / HMIS engineering, pharma traceability, medical imaging analysis, HDS-grade hosting, clinical workflows in Arabic and French.',                    tag: 'HDS · HIS / HMIS' },       fr: { t: 'Santé',            d: 'Ingénierie HIS / HMIS, traçabilité pharma, imagerie médicale, hébergement HDS, workflows cliniques arabe et français.', tag: 'HDS · HIS / HMIS' },       ar: { t: 'الصحة',             d: 'هندسة HIS / HMIS، تتبع الأدوية، التصوير الطبي، استضافة HDS، سير العمل السريري بالعربية والفرنسية.',                tag: 'HDS · HIS / HMIS' } },
  { num: '07', icon: Store,      en: { t: 'Retail & CPG',      d: 'Demand forecasting across SKUs and stores. Dynamic pricing copilots. Shelf-share computer vision. Trade-promotion ROI agents.',                          tag: 'GS1 · CPFR' },             fr: { t: 'Retail & CPG',     d: 'Prévision de la demande par SKU et magasin. Copilotes de pricing dynamique. Vision part de linéaire. Agents ROI promo.',  tag: 'GS1 · CPFR' },             ar: { t: 'التجزئة والسلع',  d: 'تنبؤ الطلب حسب SKU والمتاجر. مساعدات التسعير الديناميكي. رؤية حصة الرف. وكلاء ROI للترويج.',                  tag: 'GS1 · CPFR' } },
  { num: '08', icon: RadioTower, en: { t: 'Telecom',           d: 'Network anomaly detection. Customer-care intent routing in Arabic dialects. Subscriber fraud and SIM-swap detection. Outage triage copilots.',         tag: 'TM Forum · ARCEP' },        fr: { t: 'Télécom',          d: 'Détection d\'anomalies réseau. Routage d\'intention en dialectes arabes. Fraude abonné et SIM-swap. Copilotes outage.',     tag: 'TM Forum · ARCEP' },        ar: { t: 'الاتصالات',         d: 'كشف شذوذ الشبكة. توجيه النوايا باللهجات العربية. كشف احتيال المشترك وSIM-swap. مساعدات الانقطاع.',          tag: 'TM Forum · ARCEP' } },
];

const PILLARS = [
  { num: '01', icon: Code2,       en: { t: 'A company. Not an agency.',     d: 'Twenty-five senior engineers, salaried, in one office in Algiers. We do not subcontract. The same lead who scopes a project ships it to production and operates it under SLA.' }, fr: { t: 'Une entreprise. Pas une agence.', d: 'Vingt-cinq ingénieurs seniors, salariés, dans un seul bureau à Alger. Pas de sous-traitance. Le même lead cadre, livre, et opère.' }, ar: { t: 'شركة. ليست وكالة.',           d: 'خمسة وعشرون مهندساً، موظفون، في مكتب واحد بالجزائر. لا مقاولات من الباطن.' } },
  { num: '02', icon: Server,      en: { t: 'On-premise by default.',         d: 'Your data stays in Algeria, on your hardware — or on the sovereign cloud you have already approved. Hybrid only when the regulator allows.' }, fr: { t: 'On-premise par défaut.',          d: 'Vos données restent en Algérie, sur votre matériel — ou sur le cloud souverain approuvé. Hybride seulement si le régulateur le permet.' }, ar: { t: 'على الموقع افتراضياً.',         d: 'بياناتك تبقى في الجزائر، على أجهزتك — أو على السحابة السيادية المعتمدة.' } },
  { num: '03', icon: ShieldCheck, en: { t: 'Audited by design.',             d: 'Every system designed from day one to clear BCT, SAMA, DORA, ISO 27001, HDS audits. Audit trails are the floor — not features added later.' }, fr: { t: 'Audité dès la conception.',       d: 'Chaque système conçu pour passer BCT, SAMA, DORA, ISO 27001, HDS dès le départ.' }, ar: { t: 'مدقق بالتصميم.',                d: 'كل نظام مصمم لاجتياز BCT، SAMA، DORA، ISO 27001، HDS من اليوم الأول.' } },
];

const PHASES = [
  { num: 'I',   en: { t: 'Discovery sprint',         d: '2 weeks paid. Engineering lead embedded. Output: scoped problem, target architecture, regulatory map, signed proposal.' }, fr: { t: 'Sprint de découverte',         d: '2 semaines payées. Lead embarqué. Livrable : problème cadré, architecture cible, carte réglementaire, proposition signée.' }, ar: { t: 'جلسة الاستكشاف',             d: 'أسبوعان مدفوعان. قائد مدمج. النتيجة: مشكلة محددة، بنية مستهدفة، خريطة تنظيمية، اقتراح موقع.' } },
  { num: 'II',  en: { t: 'Production engagement',    d: '6–18 months typical. Bi-weekly demos to your steering committee. Production handover with runbooks, MLOps, monitoring dashboards.' }, fr: { t: 'Engagement de production',     d: '6–18 mois typique. Démos bi-hebdomadaires. Transfert avec runbooks, MLOps, monitoring.' }, ar: { t: 'التزام الإنتاج',              d: 'من 6 إلى 18 شهراً. عروض كل أسبوعين. تسليم مع كتيبات تشغيل وMLOps ومراقبة.' } },
  { num: 'III', en: { t: 'Operate or hand over',     d: '99.9% SLA via Managed Operations — or full handover with documentation, training, 90-day stabilization warranty.' }, fr: { t: 'Opérer ou transférer',         d: 'SLA 99.9% via Managed Operations — ou transfert complet avec documentation, formation, garantie 90 jours.' }, ar: { t: 'تشغيل أو تسليم',             d: 'SLA 99.9% بـManaged Operations — أو تسليم كامل مع التوثيق والتدريب وضمان 90 يوماً.' } },
];

const FAQS = [
  { en: { q: 'How do you differ from a generalist consulting firm?',                   a: 'We engineer; we do not subcontract. The same team that scopes the engagement ships the production system and operates it under SLA. Twenty-five senior engineers, all salaried, all in one office in Algiers.' }, fr: { q: 'Quelle différence avec un cabinet de conseil généraliste ?',         a: 'Nous faisons l\'ingénierie; nous ne sous-traitons pas. La même équipe cadre, livre et opère. Vingt-cinq ingénieurs seniors, tous salariés, tous à Alger.' }, ar: { q: 'كيف تختلفون عن شركة استشارات عامة؟',                  a: 'نحن نهندس؛ لا نتعاقد من الباطن. نفس الفريق يحدد، يطلق، ويشغل. خمسة وعشرون مهندساً بكبار الخبرات، موظفون، في الجزائر.' } },
  { en: { q: 'Can the AI run on-premise with no outbound internet?',                    a: 'Yes. Three modes: fully on-premise (your hardware), sovereign cloud (national clouds), or hybrid. Air-gapped variant available for upstream and defense work.' }, fr: { q: 'L\'IA peut-elle tourner on-premise sans Internet sortant ?', a: 'Oui. Trois modes : on-premise complet, cloud souverain, ou hybride. Variante air-gapped pour upstream et missions défense.' }, ar: { q: 'هل يمكن تشغيل AI on-premise بدون إنترنت خارجي؟',                a: 'نعم. ثلاثة أوضاع: on-premise بالكامل، السحابة السيادية، أو هجين. متاحة نسخة air-gapped.' } },
  { en: { q: 'Which compliance frameworks have you delivered against?',                a: 'BCT, SAMA, DORA, ISO 27001, HDS, GDPR. Every system designed from day one to pass these audits — we carry the documentation, evidence, and regulator-facing artifacts.' }, fr: { q: 'Quels cadres de conformité avez-vous livrés ?',           a: 'BCT, SAMA, DORA, ISO 27001, HDS, RGPD. Chaque système conçu dès le départ pour passer ces audits.' }, ar: { q: 'ما أطر الامتثال التي سلمتموها؟',                       a: 'BCT، SAMA، DORA، ISO 27001، HDS، GDPR.' } },
  { en: { q: 'Engagement timeline and budget?',                                         a: 'Discovery: ~$12K USD, 2 weeks. Production engagements: $60K to $1M+ over 6–18 months depending on scope and SLA.' }, fr: { q: 'Calendrier et budget d\'un engagement ?',                                                                                 a: 'Découverte : ~12K USD, 2 semaines. Production : 60K à 1M+ USD sur 6–18 mois selon scope et SLA.' }, ar: { q: 'الجدول الزمني والميزانية؟',                                  a: 'الاستكشاف: ~12 ألف دولار، أسبوعان. الإنتاج: 60 ألف إلى أكثر من 1 مليون دولار على 6–18 شهراً.' } },
  { en: { q: 'Who owns the IP at engagement end?',                                       a: 'You. Source code, model weights, MLOps, runbooks, training materials, documentation — all delivered. We retain no IP claim.' }, fr: { q: 'Qui possède l\'IP en fin d\'engagement ?',                                                                                 a: 'Vous. Code source, poids modèles, MLOps, runbooks, formation, documentation — tout livré. Nous ne retenons rien.' }, ar: { q: 'من يملك الملكية الفكرية في النهاية؟',                       a: 'أنت. كل شيء مُسلَّم. لا نحتفظ بأي شيء.' } },
];

const FRAMEWORKS = ['BCT', 'SAMA', 'DORA', 'ISO 27001', 'HDS', 'GDPR'];

const COPY = {
  en: {
    metaTitle: 'Symloop AI — Deep-Tech AI · Sovereign AI for Banking, Insurance, Manufacturing, Government, Oil & Gas, Healthcare, Retail, Telecom · Algeria · Kuwait · UAE',
    metaDesc:  "Symloop AI is the deep-tech AI engineering arm of Symloop Technology. Production AI across eight sectors — banking, insurance, government, manufacturing, oil & gas, healthcare, retail, telecom. NOOR — our sovereign AI platform — on-premise by default, audited against BCT, SAMA, DORA, ISO 27001, HDS, IFRS-17. Trusted worldwide by Epson (UAE), Del Monte (UAE), Renault Algérie, Offto and Barugzai. Algiers HQ since 2012, 25+ senior engineers.",
    metaKeywords: 'deep tech AI Algeria, sovereign AI MENA, AI engineering company Algiers, AI for banks MENA, AI for insurance, AI for manufacturing, AI for production factories, AI for government MENA, AI for oil and gas Algeria, AI for healthcare, AI for retail, AI for telecom, NOOR sovereign AI, on-premise AI deployment, Arabic NLP, multi-agent AI systems, BCT compliance AI, SAMA compliance AI, DORA, ISO 27001, IFRS-17 AI, AI engineering Kuwait, AI engineering UAE, AI Epson UAE, AI Del Monte UAE',
    hero: {
      titleA:    'AI that compounds',
      titleB:    'your business returns.',
      dek:       'Engineered AI systems that pay back the integration cost in 4–9 months. Production-grade SLA, audit-trail by default, sovereign deployment — earning their keep from day one.',
      ctaPrimary: 'Start an engagement',
      ctaSecondary: '+213 549 575 512',
      auditedLabel: 'Audited:',
    },
    clientsLabel: 'Trusted by',
    manifesto: { label: '— Manifesto', lines: [ 'AI engineered for accountability.', 'AI that runs on hardware you own.', 'AI with an audit trail on every query.', 'AI that ships under contract SLA.', 'Not a chatbot. Not a demo. Not a slide.', 'Just production engineering.' ] },
    capabilities: { eyebrow: 'Capabilities', title: 'Twelve primitives. Production-grade.', sub: 'Each capability ships with audit trail, access control, and on-premise deployment from day one.' },
    sectors:      { eyebrow: 'Sectors',      title: 'Where we ship in production.', sub: 'Each sector deployment is grounded in the regulator that governs it.' },
    pillars:      { eyebrow: 'Why us',       title: 'A different kind of AI partner.' },
    process:      { eyebrow: 'How we work',  title: 'Three phases. No surprises.' },
    faq:          { eyebrow: 'FAQ',          title: 'Procurement-grade questions.' },
    contact: {
      eyebrow: 'Contact',
      title:   'Engage the team.',
      sub:     'Two-week paid discovery sprint. You walk away with a scoped engagement proposal and a target architecture, even if you do not proceed.',
      labels:  { email: 'Email', phone: 'Phone', address: 'Address', response: 'Response time' },
      values:  { email: 'lab@symloop.com', phone: '+213 549 575 512', address: 'Algiers, Algeria', response: 'Within 1 business day' },
      ctaA:    'Email lab@symloop.com',
      ctaB:    'Symloop Technology →',
    },
  },
  fr: {
    metaTitle: "Symloop AI — Deep-Tech IA · IA Souveraine pour Banque, Assurance, Industrie, Gouvernement, Oil & Gas, Santé, Retail, Télécom · Alger · Koweït · UAE",
    metaDesc:  "Symloop AI est le bras d'ingénierie IA deep-tech de Symloop Technology. IA de production sur huit secteurs — banque, assurance, gouvernement, industrie, oil & gas, santé, retail, télécom. NOOR — notre plateforme d'IA souveraine — on-premise par défaut, auditée BCT, SAMA, DORA, ISO 27001, HDS, IFRS-17. Référencée par Epson (UAE), Del Monte (UAE), Renault Algérie, Offto et Barugzai. Siège Alger depuis 2012, 25+ ingénieurs seniors.",
    metaKeywords: "deep tech IA Algérie, IA souveraine MENA, société IA Alger, IA banques MENA, IA assurance, IA industrie, IA usines de production, IA gouvernement, IA oil and gas Algérie, IA santé, IA retail, IA télécom, NOOR IA souveraine, déploiement IA on-premise, NLP arabe, systèmes IA multi-agents, conformité BCT, conformité SAMA, DORA, ISO 27001, IFRS-17 IA, ingénierie IA Koweït, ingénierie IA UAE, IA Epson UAE, IA Del Monte UAE",
    hero: {
      titleA:    "Une IA qui compose",
      titleB:    'la rentabilité de votre entreprise.',
      dek:       "Des systèmes IA conçus pour rentabiliser leur intégration en 4 à 9 mois. SLA production, traçabilité d'audit native, déploiement souverain — productifs dès le premier jour.",
      ctaPrimary: 'Démarrer un engagement',
      ctaSecondary: '+213 549 575 512',
      auditedLabel: 'Audité :',
    },
    clientsLabel: 'Ils nous font confiance',
    manifesto: { label: '— Manifeste', lines: [ "Une IA conçue pour la responsabilité.", "Une IA qui tourne sur votre matériel.", "Une IA avec une trace d'audit pour chaque requête.", "Une IA livrée sous SLA contractuel.", 'Pas un chatbot. Pas une démo. Pas une slide.', "Juste de l'ingénierie de production." ] },
    capabilities: { eyebrow: 'Capacités', title: 'Douze primitives. Production-grade.',          sub: 'Chaque capacité livrée avec piste d\'audit, contrôle d\'accès, et déploiement on-premise dès le premier jour.' },
    sectors:      { eyebrow: 'Secteurs',  title: 'Où nous livrons en production.',                 sub: 'Chaque déploiement est ancré dans le régulateur qui le gouverne.' },
    pillars:      { eyebrow: 'Pourquoi',  title: 'Un autre type de partenaire IA.' },
    process:      { eyebrow: 'Comment',   title: 'Trois phases. Pas de surprises.' },
    faq:          { eyebrow: 'FAQ',        title: 'Questions de procurement.' },
    contact: {
      eyebrow: 'Contact',
      title:   'Engagez l\'équipe.',
      sub:     'Sprint de découverte payant de deux semaines. Vous repartez avec une proposition cadrée et une architecture cible, même si vous ne continuez pas.',
      labels:  { email: 'Email', phone: 'Téléphone', address: 'Adresse', response: 'Délai de réponse' },
      values:  { email: 'lab@symloop.com', phone: '+213 549 575 512', address: 'Alger, Algérie', response: 'Sous 1 jour ouvré' },
      ctaA:    'Écrire à lab@symloop.com',
      ctaB:    'Symloop Technology →',
    },
  },
  ar: {
    metaTitle: 'سيملوب AI — Deep-Tech للذكاء الاصطناعي · ذكاء اصطناعي سيادي للمصارف، التأمين، الصناعة، الحكومة، النفط والغاز، الصحة، التجزئة، الاتصالات · الجزائر · الكويت · الإمارات',
    metaDesc:  'سيملوب AI هو الذراع الهندسي للذكاء الاصطناعي العميق لشركة سيملوب تكنولوجي. ذكاء اصطناعي إنتاجي عبر ثمانية قطاعات — المصارف، التأمين، الحكومة، الصناعة، النفط والغاز، الصحة، التجزئة، الاتصالات. NOOR — منصتنا للذكاء الاصطناعي السيادي — on-premise افتراضياً، مدقق وفقاً لـ BCT و SAMA و DORA و ISO 27001 و HDS و IFRS-17. عملاء حول العالم: Epson (الإمارات)، Del Monte (الإمارات)، Renault Algérie، Offto، Barugzai. مقرنا الجزائر العاصمة منذ 2012، أكثر من 25 مهندساً.',
    metaKeywords: 'deep tech ذكاء اصطناعي الجزائر, ذكاء اصطناعي سيادي MENA, شركة ذكاء اصطناعي الجزائر العاصمة, NOOR ذكاء اصطناعي سيادي, ذكاء اصطناعي on-premise, NLP عربي, ذكاء اصطناعي للتأمين, ذكاء اصطناعي للصناعة, ذكاء اصطناعي للتجزئة, ذكاء اصطناعي للاتصالات, ذكاء اصطناعي الكويت, ذكاء اصطناعي الإمارات, Epson الإمارات, Del Monte الإمارات',
    hero: {
      titleA:    'ذكاء اصطناعي يضاعف',
      titleB:    'عوائد أعمالك.',
      dek:       'أنظمة ذكاء اصطناعي مصممة لتسترد كلفة دمجها خلال 4 إلى 9 أشهر. SLA إنتاجي، مسار تدقيق أصلي، نشر سيادي — منتجة من اليوم الأول.',
      ctaPrimary: 'ابدأ ارتباطاً',
      ctaSecondary: '+213 549 575 512',
      auditedLabel: 'مدقق:',
    },
    clientsLabel: 'يثقون بنا',
    manifesto: { label: '— البيان', lines: [ 'ذكاء اصطناعي مصمم للمساءلة.', 'ذكاء اصطناعي يعمل على أجهزة تملكها.', 'ذكاء اصطناعي بمسار تدقيق لكل استعلام.', 'ذكاء اصطناعي يُسلَّم بـSLA تعاقدي.', 'ليس روبوت محادثة. ليس عرضاً. ليس شريحة.', 'فقط هندسة إنتاج.' ] },
    capabilities: { eyebrow: 'القدرات',  title: 'اثنتا عشرة بدائية. جاهزة للإنتاج.', sub: 'كل قدرة تُسلَّم مع مسار تدقيق وتحكم وصول ونشر on-premise من اليوم الأول.' },
    sectors:      { eyebrow: 'القطاعات', title: 'أين نطلق في الإنتاج.',                sub: 'كل نشر متجذر في المنظم الذي يحكمه.' },
    pillars:      { eyebrow: 'لماذا نحن', title: 'نوع مختلف من شريك AI.' },
    process:      { eyebrow: 'كيف نعمل',  title: 'ثلاث مراحل. بلا مفاجآت.' },
    faq:          { eyebrow: 'الأسئلة',    title: 'أسئلة بمستوى الشراء.' },
    contact: {
      eyebrow: 'تواصل',
      title:   'تواصل مع الفريق.',
      sub:     'جلسة مدفوعة لأسبوعين. تخرج باقتراح ارتباط محدد وبنية مستهدفة.',
      labels:  { email: 'البريد', phone: 'الهاتف', address: 'العنوان', response: 'وقت الاستجابة' },
      values:  { email: 'lab@symloop.com', phone: '+213 549 575 512', address: 'الجزائر العاصمة', response: 'خلال يوم عمل واحد' },
      ctaA:    'راسل lab@symloop.com',
      ctaB:    'سيملوب تكنولوجي ←',
    },
  },
};

// ─── HERO — ROI-led split: animated title left, live impact dashboard right ──
function Hero({ c, locale, isRtl, arrow }) {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden border-b border-white/[0.08]">
      {/* Ambient — soft drifting blurred orbs across the full hero */}
      <FloatingOrbs />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 w-full pt-36 lg:pt-44 pb-24 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">

          {/* LEFT — title + dek + frameworks + CTAs */}
          <div className="lg:col-span-7">
            <AnimatedHeroTitle
              titleA={c.hero.titleA}
              titleB={c.hero.titleB}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight leading-[1.05] text-white mb-8"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-base lg:text-lg text-white/65 leading-relaxed max-w-xl font-light mb-9"
            >
              {c.hero.dek}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center gap-2 mb-9"
            >
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/40 mr-2">{c.hero.auditedLabel}</span>
              {FRAMEWORKS.map(f => (
                <span key={f} className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/75 px-2.5 py-1.5 border border-white/[0.14] hover:border-white/50 hover:text-white transition-colors">
                  {f}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center gap-4"
            >
              <a href="#contact" className="group inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-sm font-medium tracking-wide hover:bg-white/90 transition-colors">
                <span>{c.hero.ctaPrimary}</span>
                {arrow}
              </a>
              <a href="tel:+213549575512" className="group inline-flex items-center gap-3 border border-white/20 hover:border-white/60 text-white px-8 py-4 text-sm font-medium tracking-wide transition-colors hover:text-white">
                <Phone className="w-4 h-4" strokeWidth={1.75} />
                <span>{c.hero.ctaSecondary}</span>
              </a>
            </motion.div>
          </div>

          {/* RIGHT — animated ROI impact dashboard */}
          <div className="lg:col-span-5 w-full">
            <ImpactMetrics locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── MANIFESTO — clean line reveal, no blur, no gradients ───────────────
function Manifesto({ c }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const lines = c.manifesto.lines;

  return (
    <section ref={ref} className="relative min-h-[140vh] bg-black border-b border-white/[0.08]">
      <GridBackground dotOpacity={0.04} />
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center px-6 lg:px-10">
        {/* Live-telemetry chart in background — gives the manifesto an
            engineering / live-system feel. Fades into view, sits behind text. */}
        <ChartBackground topLabel="MANIFESTO · LIVE TELEMETRY" />
        <div className="max-w-5xl w-full relative z-10">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35 mb-12 flex items-center gap-3">
            <span className="block w-1.5 h-1.5 bg-white rounded-full" />
            <span>{c.manifesto.label}</span>
          </div>
          <ul className="space-y-5 lg:space-y-7">
            {lines.map((line, i) => {
              const start = i / lines.length;
              const end = (i + 1) / lines.length;
              const opacity = useTransform(scrollYProgress, [start, end - 0.05, end], [0.18, 1, 1]);
              return (
                <motion.li
                  key={i}
                  style={{ opacity }}
                  className="text-[26px] md:text-[40px] lg:text-[56px] font-light tracking-[-0.02em] leading-[1.15] text-white"
                >
                  {line}
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ─── CAPABILITIES — technical 3-col grid ────────────────────────────────
function Capabilities({ c, locale }) {
  return (
    <section id="capabilities" className="relative bg-black border-b border-white/[0.08]">
      <GridBackground dotOpacity={0.04} />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={stagger}>
          <motion.div variants={fadeUp} className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/35 mb-5">{c.capabilities.eyebrow}</motion.div>
          <motion.h2 variants={fadeUp} className="text-[34px] md:text-[52px] lg:text-[64px] font-light tracking-tight leading-[1.05] text-white max-w-4xl mb-4">{c.capabilities.title}</motion.h2>
          <motion.p variants={fadeUp} className="text-[14px] lg:text-[15px] text-white/45 font-light max-w-2xl mb-16">{c.capabilities.sub}</motion.p>

          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.08] border border-white/[0.08]">
            {CAPS.map((cap) => {
              const Icon = cap.icon;
              const t = cap[locale] || cap.en;
              return (
                <motion.article key={cap.num} variants={fadeUp} className="group bg-black p-7 lg:p-8 hover:bg-white/[0.015] transition-colors flex flex-col">
                  <div className="flex items-center justify-between mb-7">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 group-hover:text-white/90 transition-colors">{cap.num}</span>
                    <Icon className="w-4 h-4 text-white/40 group-hover:text-white/90 transition-colors" strokeWidth={1.25} />
                  </div>
                  <h3 className="text-[18px] lg:text-[20px] font-light leading-[1.2] tracking-tight text-white mb-3">{t.t}</h3>
                  <p className="text-[13px] leading-[1.7] text-white/50 font-light">{t.d}</p>
                </motion.article>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── SECTORS — clean 2x2 grid, no gradient washes ────────────────────────
function Sectors({ c, locale }) {
  return (
    <section id="sectors" className="relative bg-black border-b border-white/[0.08]">
      <GridBackground dotOpacity={0.04} />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={stagger}>
          <motion.div variants={fadeUp} className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/35 mb-5">{c.sectors.eyebrow}</motion.div>
          <motion.h2 variants={fadeUp} className="text-[34px] md:text-[52px] lg:text-[64px] font-light tracking-tight leading-[1.05] text-white max-w-4xl mb-4">{c.sectors.title}</motion.h2>
          <motion.p variants={fadeUp} className="text-[14px] lg:text-[15px] text-white/45 font-light max-w-2xl mb-16">{c.sectors.sub}</motion.p>

          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.08] border border-white/[0.08]">
            {SECTORS.map((s) => {
              const Icon = s.icon;
              const t = s[locale] || s.en;
              return (
                <motion.article key={s.num} variants={fadeUp} className="group bg-black p-8 lg:p-12 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center justify-between mb-10">
                    <span className="font-mono text-[60px] lg:text-[80px] font-light text-white/10 group-hover:text-white/90/30 leading-none transition-colors">{s.num}</span>
                    <Icon className="w-7 h-7 text-white/40 group-hover:text-white/90 transition-colors" strokeWidth={1} />
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/35 mb-3">{t.tag}</div>
                  <h3 className="text-[28px] lg:text-[36px] font-light tracking-tight text-white mb-6">{t.t}</h3>
                  <p className="text-[14px] leading-[1.75] text-white/55 font-light">{t.d}</p>
                </motion.article>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── PILLARS — clean technical cards ────────────────────────────────────
function Pillars({ c, locale }) {
  return (
    <section className="relative bg-black border-b border-white/[0.08]">
      <GridBackground dotOpacity={0.04} />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={stagger}>
          <motion.div variants={fadeUp} className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/35 mb-5">{c.pillars.eyebrow}</motion.div>
          <motion.h2 variants={fadeUp} className="text-[34px] md:text-[52px] lg:text-[64px] font-light tracking-tight leading-[1.05] text-white max-w-4xl mb-16">{c.pillars.title}</motion.h2>

          <motion.div variants={stagger} className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/[0.08] border border-white/[0.08]">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              const t = p[locale] || p.en;
              return (
                <motion.article key={p.num} variants={fadeUp} className="group bg-black p-8 lg:p-10 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center justify-between mb-12">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 group-hover:text-white/90 transition-colors">{p.num}</span>
                    <Icon className="w-5 h-5 text-white/45 group-hover:text-white/90 transition-colors" strokeWidth={1.25} />
                  </div>
                  <h3 className="text-[22px] lg:text-[26px] font-light leading-[1.15] tracking-tight text-white mb-6">{t.t}</h3>
                  <p className="text-[14px] leading-[1.75] text-white/55 font-light">{t.d}</p>
                </motion.article>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── PROCESS — numbered timeline ────────────────────────────────────────
function Process({ c, locale }) {
  return (
    <section id="process" className="relative bg-black border-b border-white/[0.08]">
      <GridBackground dotOpacity={0.04} />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={stagger}>
          <motion.div variants={fadeUp} className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/35 mb-5">{c.process.eyebrow}</motion.div>
          <motion.h2 variants={fadeUp} className="text-[34px] md:text-[52px] lg:text-[64px] font-light tracking-tight leading-[1.05] text-white max-w-4xl mb-20">{c.process.title}</motion.h2>

          <motion.ol variants={stagger} className="space-y-px bg-white/[0.08] border border-white/[0.08]">
            {PHASES.map((p) => {
              const t = p[locale] || p.en;
              return (
                <motion.li key={p.num} variants={fadeUp} className="bg-black p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start group hover:bg-white/[0.015] transition-colors">
                  <div className="lg:col-span-2 font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 group-hover:text-white/90 transition-colors">
                    <span className="block text-[40px] lg:text-[56px] tracking-tight text-white/15 group-hover:text-white/90/40 font-light leading-none mb-3 transition-colors">{p.num}</span>
                    <span>Phase {p.num}</span>
                  </div>
                  <div className="lg:col-span-4">
                    <h3 className="text-[22px] lg:text-[28px] font-light tracking-tight text-white leading-[1.15]">{t.t}</h3>
                  </div>
                  <p className="lg:col-span-6 text-[14px] leading-[1.75] text-white/55 font-light">{t.d}</p>
                </motion.li>
              );
            })}
          </motion.ol>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FAQ ────────────────────────────────────────────────────────────────
function FAQ({ c, locale }) {
  return (
    <section id="faq" className="relative bg-black border-b border-white/[0.08]">
      <GridBackground dotOpacity={0.04} />
      <div className="relative max-w-5xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={stagger}>
          <motion.div variants={fadeUp} className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/35 mb-5">{c.faq.eyebrow}</motion.div>
          <motion.h2 variants={fadeUp} className="text-[30px] md:text-[44px] font-light tracking-tight leading-[1.1] text-white mb-14">{c.faq.title}</motion.h2>

          <div className="border-t border-white/[0.08]">
            {FAQS.map((f, i) => {
              const t = f[locale] || f.en;
              return (
                <motion.details
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group border-b border-white/[0.08] py-8 hover:bg-white/[0.01] transition-colors px-2"
                >
                  <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
                    <h3 className="text-[18px] lg:text-[22px] font-light tracking-tight text-white leading-snug flex-1">{t.q}</h3>
                    <span className="font-mono text-[24px] text-white/30 group-open:rotate-45 group-hover:text-white/90 transition-all leading-none mt-1">+</span>
                  </summary>
                  <p className="mt-6 text-[14px] leading-[1.75] text-white/60 font-light max-w-3xl">{t.a}</p>
                </motion.details>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── CONTACT — real contact section before footer ───────────────────────
function Contact({ c, isRtl }) {
  return (
    <section id="contact" className="relative bg-black border-b border-white/[0.08]">
      <GridBackground dotOpacity={0.05} />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={stagger}>
          <motion.div variants={fadeUp} className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/35 mb-5 flex items-center gap-3">
            <span className="block w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span>{c.contact.eyebrow}</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-[36px] md:text-[60px] lg:text-[80px] font-light tracking-[-0.02em] leading-[1] text-white mb-10 max-w-4xl">{c.contact.title}</motion.h2>
          <motion.p variants={fadeUp} className="text-[16px] md:text-[18px] leading-[1.7] text-white/55 font-light max-w-3xl mb-14">{c.contact.sub}</motion.p>

          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.08] border border-white/[0.08] mb-12">
            {[
              { Icon: Mail,    label: c.contact.labels.email,    value: c.contact.values.email,    href: `mailto:${c.contact.values.email}` },
              { Icon: Phone,   label: c.contact.labels.phone,    value: c.contact.values.phone,    href: 'tel:+213549575512' },
              { Icon: MapPin,  label: c.contact.labels.address,  value: c.contact.values.address },
              { Icon: Activity,label: c.contact.labels.response, value: c.contact.values.response },
            ].map((it, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-black p-7 lg:p-8 group hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/35">{it.label}</span>
                  <it.Icon className="w-4 h-4 text-white/40 group-hover:text-white/90 transition-colors" strokeWidth={1.25} />
                </div>
                {it.href ? (
                  <a href={it.href} className="text-[15px] lg:text-[17px] font-light text-white hover:text-white/90 transition-colors break-all">{it.value}</a>
                ) : (
                  <div className="text-[15px] lg:text-[17px] font-light text-white">{it.value}</div>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
            <a href={`mailto:${c.contact.values.email}`} className="group inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-[12px] tracking-[0.1em] uppercase font-mono hover:bg-white transition-colors">
              <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>{c.contact.ctaA}</span>
            </a>
            <a href="https://symloop.com/" className="group inline-flex items-center gap-3 px-8 py-4 border border-white/20 hover:border-white/50 text-[12px] tracking-[0.1em] uppercase font-mono text-white/75 hover:text-white transition-colors">
              <span>{c.contact.ctaB}</span>
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const locale = router.locale || 'en';
  const isRtl = locale === 'ar';
  const c = COPY[locale] || COPY.en;
  const arrow = isRtl ? <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} /> : <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />;

  const webPageLd = { '@context': 'https://schema.org', '@type': 'WebPage', name: c.metaTitle, description: c.metaDesc, url: 'https://symloop-ai.com/', inLanguage: locale };
  const serviceLd = {
    '@context': 'https://schema.org', '@type': 'Service',
    serviceType: 'Deep-tech AI engineering for regulated industries',
    provider: { '@type': 'Organization', '@id': 'https://symloop-ai.com/#organization', name: 'Symloop AI', url: 'https://symloop-ai.com' },
    areaServed: [
      { '@type': 'Country', name: 'Algeria' },
      { '@type': 'Country', name: 'Kuwait' },
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Country', name: 'Saudi Arabia' },
      { '@type': 'Country', name: 'Qatar' },
      { '@type': 'Country', name: 'Morocco' },
      { '@type': 'Country', name: 'Tunisia' },
      { '@type': 'Country', name: 'Egypt' }
    ],
    hasOfferCatalog: { '@type': 'OfferCatalog', name: 'AI capabilities', itemListElement: CAPS.map((cap, i) => ({ '@type': 'Offer', position: i + 1, itemOffered: { '@type': 'Service', name: cap.en.t, description: cap.en.d } })) },
  };
  // Worldwide client roster as schema.org/ItemList — named entities LLMs can cite.
  // Pairing the Symloop AI brand with recognized global names (Epson, Del Monte,
  // Renault) is the off-site signal that drives ChatGPT recommendations.
  const clientsLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Symloop AI — Worldwide Client Roster',
    description: 'Named clients across Algeria, UAE, and the wider MENA region. Symloop AI serves regulated industries, multinational enterprises, and digital-native operators.',
    itemListElement: [
      { '@type': 'Organization', name: 'Epson', sameAs: 'https://www.epson.com', location: { '@type': 'Country', name: 'United Arab Emirates' } },
      { '@type': 'Organization', name: 'Del Monte', sameAs: 'https://www.delmonte.com', location: { '@type': 'Country', name: 'United Arab Emirates' } },
      { '@type': 'Organization', name: 'Renault Algérie', sameAs: 'https://www.renault.dz', location: { '@type': 'Country', name: 'Algeria' } },
      { '@type': 'Organization', name: 'Offto' },
      { '@type': 'Organization', name: 'Barugzai' },
    ].map((org, i) => ({ '@type': 'ListItem', position: i + 1, item: org })),
  };
  const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f[locale]?.q || f.en.q, acceptedAnswer: { '@type': 'Answer', text: f[locale]?.a || f.en.a } })) };

  return (
    <>
      <Head>
        <title>{c.metaTitle}</title>
        <meta name="description" content={c.metaDesc} />
        {c.metaKeywords && <meta name="keywords" content={c.metaKeywords} />}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={c.metaTitle} />
        <meta property="og:description" content={c.metaDesc} />
        <meta property="og:url" content="https://symloop-ai.com/" />
        <meta property="og:site_name" content="Symloop AI" />
        <meta property="og:locale" content={locale === 'ar' ? 'ar_DZ' : locale === 'fr' ? 'fr_DZ' : 'en_US'} />
        <meta property="og:image" content={`https://symloop-ai.com/api/og?title=${encodeURIComponent(c.hero.titleA + ' ' + c.hero.titleB)}&eyebrow=${encodeURIComponent('Deep-Tech AI · Sovereign AI · Algeria · Kuwait · UAE')}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={c.metaTitle} />
        <meta name="twitter:description" content={c.metaDesc} />
        <meta name="twitter:image" content={`https://symloop-ai.com/api/og?title=${encodeURIComponent(c.hero.titleA + ' ' + c.hero.titleB)}&eyebrow=${encodeURIComponent('Deep-Tech AI · Sovereign AI · Algeria · Kuwait · UAE')}`} />
        <meta name="geo.region" content="DZ-16" />
        <meta name="geo.placename" content="Algiers, Algeria" />
        <meta name="geo.position" content="36.7538;3.0588" />
        <meta name="ICBM" content="36.7538, 3.0588" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(clientsLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      </Head>

      <Header />

      <main dir={isRtl ? 'rtl' : 'ltr'} className="bg-black text-white">
        <Hero c={c} locale={locale} isRtl={isRtl} arrow={arrow} />
        <ClientMarquee label={c.clientsLabel} />
        <Manifesto c={c} />
        <Capabilities c={c} locale={locale} />
        <Sectors c={c} locale={locale} />
        <Pillars c={c} locale={locale} />
        <Process c={c} locale={locale} />
        <FAQ c={c} locale={locale} />
        <Contact c={c} isRtl={isRtl} />
      </main>

      <Footer />
    </>
  );
}
