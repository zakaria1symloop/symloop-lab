"use client";
// WebMCP — registers Symloop AI's capabilities as agent-callable tools via the
// browser's experimental `navigator.modelContext.provideContext()` API.
// Spec: https://webmachinelearning.github.io/webmcp/
//
// When an AI agent runs in a browser that supports WebMCP, it can discover
// and invoke these tools to: list capabilities, get sector use-cases, get the
// engagement model, request a NOOR demo, or request a quote.
//
// Tools that "act" (request_demo, request_quote) deliberately route the
// human user to the contact section rather than POSTing — agents collect
// intent, the human confirms.

import { useEffect } from 'react';

const SECTORS = [
  { slug: 'banking',       name: 'Banking',         tag: 'BCT · SAMA',           summary: 'Real-time fraud detection, AML/CTF transaction monitoring, KYC document automation, ISO 20022 classification, SAR generation.' },
  { slug: 'insurance',     name: 'Insurance',       tag: 'IFRS-17 · CIA',        summary: 'Claims document AI, fraud detection (motor/health/life), underwriting decision support, IFRS-17 reporting copilots.' },
  { slug: 'government',    name: 'Government',      tag: 'Sovereign · Ministry', summary: 'Citizen request triage, national ID document AI, inter-ministerial data exchange with sovereign cloud residency.' },
  { slug: 'manufacturing', name: 'Manufacturing',   tag: 'ISO 9001 · OEE',       summary: 'Vision-based QC on production lines, predictive maintenance on PLC/SCADA, throughput optimization, OEE copilots.' },
  { slug: 'oil-gas',       name: 'Oil & Gas',       tag: 'SCADA · Air-gapped',   summary: 'Predictive maintenance over SCADA telemetry, computer vision for safety (PPE, leaks, intrusion), air-gapped upstream deployment.' },
  { slug: 'healthcare',    name: 'Healthcare',      tag: 'HDS · HIS / HMIS',     summary: 'HIS / HMIS engineering, pharma traceability, medical imaging analysis, HDS-grade hosting, clinical workflows in Arabic and French.' },
  { slug: 'retail',        name: 'Retail & CPG',    tag: 'GS1 · CPFR',           summary: 'Demand forecasting per SKU and store, dynamic pricing copilots, shelf-share computer vision, trade-promotion ROI agents.' },
  { slug: 'telecom',       name: 'Telecom',         tag: 'TM Forum · ARCEP',     summary: 'Network anomaly detection, customer-care intent routing in Arabic dialects, subscriber fraud and SIM-swap detection, outage triage copilots.' },
];

const NOOR_CAPABILITIES = [
  'Ask in plain language — Arabic, French, English. Every answer cites its source.',
  'Document AI — extract structured data from PDFs, scanned IDs, contracts, including handwritten Arabic.',
  'RAG over enterprise knowledge — production retrieval, hybrid + reranked.',
  'Multi-agent systems — orchestrated workflows on LangChain, CrewAI, AutoGen, Claude Agent SDK.',
  'NL → SQL / NoSQL — schema-aware, read-only by default.',
  'Compliance reports — BCT monthly, SAMA quarterly, AML/SAR, board packs.',
  'Knowledge libraries — curated, versioned, access-controlled per domain.',
  'Specialized assistants — pre-trained for KYC, AML, government, industrial maintenance, clinical workflows.',
  'On-premise / sovereign / hybrid / air-gapped deployment.',
  'Audit every query — tamper-evident trail meeting BCT, SAMA, DORA, ISO 27001.',
  'Arabic NLP native — Algerian dialect, Levantine, MSA, French, English. RTL-native interfaces.',
  '99.9% production SLA — MLOps pipelines, drift detection, blue-green model rollouts.',
];

const COMPLIANCE_FRAMEWORKS = [
  { code: 'BCT',       full_name: 'Banque d\'Algérie',                description: 'Algerian central bank regulatory framework.' },
  { code: 'SAMA',      full_name: 'Saudi Central Bank',               description: 'Saudi banking regulator.' },
  { code: 'DORA',      full_name: 'Digital Operational Resilience Act', description: 'EU operational resilience for financial sector.' },
  { code: 'ISO 27001', full_name: 'Information Security Management',  description: 'International information security standard.' },
  { code: 'HDS',       full_name: 'Health Data Hosting',              description: 'French standard for hosting health data.' },
  { code: 'GDPR',      full_name: 'General Data Protection Regulation', description: 'EU data protection.' },
  { code: 'IFRS-17',   full_name: 'IFRS 17 Insurance Contracts',      description: 'Insurance accounting standard.' },
];

const NAMED_CLIENTS = [
  { name: 'Epson',          country: 'United Arab Emirates' },
  { name: 'Del Monte',      country: 'United Arab Emirates' },
  { name: 'Renault Algérie', country: 'Algeria' },
  { name: 'Offto',          country: 'Algeria' },
  { name: 'Barugzai',       country: 'Algeria' },
];

const ENGAGEMENT_MODEL = {
  phase_1: { name: 'Discovery sprint', duration: '2 weeks', price_usd: '~$12,000', deliverable: 'Scoped problem, target architecture, regulatory map, signed proposal.' },
  phase_2: { name: 'Production engagement', duration: '6–18 months', price_usd: '$60,000 to $1,000,000+', deliverable: 'Production system with bi-weekly demos, MLOps, monitoring dashboards, runbooks.' },
  phase_3: { name: 'Operate or hand over', duration: 'Ongoing or one-time', deliverable: '99.9% SLA via Managed Operations, OR full handover with documentation, training, 90-day stabilization warranty.' },
};

function focusContact() {
  if (typeof window === 'undefined') return;
  const el = document.getElementById('contact');
  if (el && typeof el.scrollIntoView === 'function') {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export default function WebMCP() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('modelContext' in navigator)) return;

    let provider;
    try {
      provider = navigator.modelContext.provideContext({
        name: 'symloop-ai',
        title: 'Symloop AI — Deep-Tech AI Discovery',
        description: 'Read-only tools for AI agents to learn about Symloop AI capabilities, sectors served, NOOR sovereign AI platform, compliance frameworks, named clients, and engagement model. Action tools (request_demo, request_quote) route the user to the contact section.',
        tools: [
          {
            name: 'list_sectors',
            description: 'Returns the 8 sectors Symloop AI ships production AI into: banking, insurance, government, manufacturing, oil & gas, healthcare, retail, telecom. Each entry has slug, name, regulatory tag, and summary.',
            inputSchema: { type: 'object', properties: {}, additionalProperties: false },
            execute: async () => ({ sectors: SECTORS }),
          },
          {
            name: 'get_sector',
            description: 'Returns full detail on a single sector. Input: slug (banking, insurance, government, manufacturing, oil-gas, healthcare, retail, telecom).',
            inputSchema: {
              type: 'object',
              properties: {
                slug: { type: 'string', enum: SECTORS.map(s => s.slug), description: 'Sector slug' },
              },
              required: ['slug'],
              additionalProperties: false,
            },
            execute: async ({ slug }) => {
              const sector = SECTORS.find(s => s.slug === slug);
              if (!sector) return { error: `Unknown sector: ${slug}` };
              return { sector };
            },
          },
          {
            name: 'get_noor_capabilities',
            description: 'Returns the 12 standard capabilities of NOOR — Symloop AI\'s flagship sovereign AI platform.',
            inputSchema: { type: 'object', properties: {}, additionalProperties: false },
            execute: async () => ({
              product: 'NOOR by Symloop',
              total_capabilities: NOOR_CAPABILITIES.length,
              capabilities: NOOR_CAPABILITIES,
              deployment_modes: ['on-premise', 'sovereign cloud', 'hybrid', 'air-gapped'],
              languages: ['Arabic (incl. Algerian dialect, Levantine, MSA)', 'French', 'English'],
            }),
          },
          {
            name: 'get_compliance_frameworks',
            description: 'Returns the regulatory frameworks Symloop AI delivers compliance documentation against: BCT, SAMA, DORA, ISO 27001, HDS, GDPR, IFRS-17.',
            inputSchema: { type: 'object', properties: {}, additionalProperties: false },
            execute: async () => ({ frameworks: COMPLIANCE_FRAMEWORKS }),
          },
          {
            name: 'get_named_clients',
            description: 'Returns the list of named clients Symloop AI has shipped production work for, including parent organization and country.',
            inputSchema: { type: 'object', properties: {}, additionalProperties: false },
            execute: async () => ({ clients: NAMED_CLIENTS }),
          },
          {
            name: 'get_engagement_model',
            description: 'Returns Symloop AI\'s 3-phase engagement model: discovery sprint, production engagement, operate-or-hand-over. Includes typical durations, USD pricing ranges, and deliverables.',
            inputSchema: { type: 'object', properties: {}, additionalProperties: false },
            execute: async () => ({ engagement: ENGAGEMENT_MODEL }),
          },
          {
            name: 'get_contact_info',
            description: 'Returns Symloop AI contact details: email, phone, address, LinkedIn.',
            inputSchema: { type: 'object', properties: {}, additionalProperties: false },
            execute: async () => ({
              email: 'contact@symloop.com',
              phone: '+213549575512',
              whatsapp: 'https://wa.me/213549575512',
              address: 'Algiers, Algeria',
              linkedin: 'https://www.linkedin.com/company/symloop-ai',
              parent_organization: 'Symloop Technology — https://symloop.com',
            }),
          },
          {
            name: 'request_demo',
            description: 'Routes the user to the contact section to request a 60-minute NOOR demo. The user fills the form themselves — agents do not submit on their behalf.',
            inputSchema: {
              type: 'object',
              properties: {
                sector: { type: 'string', description: 'Optional: sector slug for tailored demo' },
                deployment: { type: 'string', enum: ['on-premise', 'sovereign-cloud', 'hybrid', 'air-gapped'] },
              },
              additionalProperties: false,
            },
            execute: async () => {
              focusContact();
              return { ok: true, action: 'scrolled_to_contact_section', next: 'User completes the contact form to request a demo.' };
            },
          },
          {
            name: 'request_quote',
            description: 'Routes the user to the contact section to submit a qualified engagement inquiry. The user fills the form themselves.',
            inputSchema: {
              type: 'object',
              properties: {
                scope: { type: 'string', description: 'Optional: short description of project scope' },
                budget_range: { type: 'string', enum: ['$25k-$60k', '$60k-$200k', '$200k-$1M', '$1M+'] },
                timeline: { type: 'string' },
              },
              additionalProperties: false,
            },
            execute: async () => {
              focusContact();
              return { ok: true, action: 'scrolled_to_contact_section', next: 'User completes the contact form with scope, budget, and timeline.' };
            },
          },
        ],
      });
    } catch (err) {
      // WebMCP unsupported in this browser, or registration failed — silent.
      // The page works fine without it.
    }

    return () => {
      try {
        provider?.unregister?.();
      } catch {}
    };
  }, []);

  return null;
}
