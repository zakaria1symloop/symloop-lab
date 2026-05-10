"use client";
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-black border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand block — parent logo + LAB sub-brand badge */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/sym-logo.png"
                alt="Symloop"
                width={140}
                height={36}
                className="h-7 w-auto object-contain brightness-0 invert"
              />
              <span className="block h-5 w-px bg-white/15" aria-hidden />
              <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.28em] uppercase text-white/90">
                <span className="block w-1.5 h-1.5 bg-white rounded-full" style={{ boxShadow: '0 0 8px rgba(255, 255, 255,0.6)' }} />
                <span>Lab</span>
              </span>
            </div>
            <p className="text-[14px] leading-[1.7] text-white/55 font-light max-w-md mb-6">
              AI engineering company for MENA's regulated industries. The AI-engineering arm of Symloop Technology — Algiers, founded 2012, 25+ senior engineers.
            </p>
            <a href="https://symloop.com/" className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/45 hover:text-white transition-colors inline-flex items-center gap-2">
              <span>Symloop Technology</span>
              <span aria-hidden>↗</span>
            </a>
          </div>

          {/* Sitemap */}
          <div className="md:col-span-3">
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/30 mb-5">Site</div>
            <ul className="space-y-3">
              {[
                ['Capabilities', '#capabilities'],
                ['Sectors',      '#sectors'],
                ['How we work',  '#process'],
                ['FAQ',          '#faq'],
                ['Contact',      '#contact'],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="text-[13px] text-white/55 hover:text-white transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance trust strip */}
          <div className="md:col-span-4">
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/30 mb-5">Audited against</div>
            <ul className="grid grid-cols-2 gap-3">
              {[
                { code: 'BCT',       scope: "Banque d'Algérie" },
                { code: 'SAMA',      scope: 'Saudi Central Bank' },
                { code: 'DORA',      scope: 'EU resilience' },
                { code: 'ISO 27001', scope: 'Info security' },
                { code: 'HDS',       scope: 'Health data' },
                { code: 'GDPR',      scope: 'EU data' },
              ].map(f => (
                <li key={f.code} className="border border-white/[0.06] px-3 py-2.5">
                  <div className="font-mono text-[11px] text-white">{f.code}</div>
                  <div className="text-[10px] text-white/40 mt-0.5">{f.scope}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-16 pt-8 border-t border-white/[0.08] flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="block w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">All systems · production</span>
          </div>
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/30">
            © {year} Symloop AI · Algiers · Engineered for MENA regulated industries
          </div>
        </div>
      </div>
    </footer>
  );
}
