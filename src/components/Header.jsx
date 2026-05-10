"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

// Sticky technical header. Goes from transparent → blurred-black on scroll.
// Mono small-caps brand mark + terminal-style nav links + locale switch + CTA.
export default function Header() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#capabilities', label: 'Capabilities' },
    { href: '#sectors',      label: 'Sectors' },
    { href: '#process',      label: 'Process' },
    { href: '#faq',          label: 'FAQ' },
    { href: '#contact',      label: 'Contact' },
  ];

  const locales = [
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
    { code: 'ar', label: 'AR' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/[0.08]' : 'bg-transparent border-b border-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between">
        {/* Brand — parent Symloop logo + LAB sub-brand badge */}
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/sym-logo.png"
            alt="Symloop"
            width={140}
            height={36}
            priority
            className="h-7 lg:h-8 w-auto object-contain brightness-0 invert"
          />
          <span className="block h-5 w-px bg-white/15" aria-hidden />
          <span className="lab-mark font-mono text-[12px] tracking-[0.32em] uppercase text-white" aria-label="Lab">
            <span className="lab-letter">L</span>
            <span className="lab-letter">A</span>
            <span className="lab-letter">B</span>
          </span>
        </Link>

        <style jsx>{`
          @keyframes labPulse {
            0%, 60%, 100% { opacity: 0.45; text-shadow: 0 0 0 rgba(255,255,255,0); }
            30%           { opacity: 1;    text-shadow: 0 0 14px rgba(255,255,255,0.55); }
          }
          .lab-mark { display: inline-flex; gap: 0.05em; }
          .lab-letter {
            display: inline-block;
            animation: labPulse 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            will-change: opacity, text-shadow;
          }
          .lab-letter:nth-child(1) { animation-delay: 0s; }
          .lab-letter:nth-child(2) { animation-delay: 0.18s; }
          .lab-letter:nth-child(3) { animation-delay: 0.36s; }
          @media (prefers-reduced-motion: reduce) {
            .lab-letter { animation: none; opacity: 1; }
          }
        `}</style>

        {/* Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href} className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/55 hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        {/* Locale + CTA */}
        <div className="flex items-center gap-5">
          <div className="hidden md:flex items-center gap-1 font-mono text-[10px] tracking-[0.15em] uppercase">
            {locales.map((l, i) => (
              <span key={l.code} className="flex items-center">
                {i > 0 && <span className="text-white/15 mx-1">·</span>}
                <Link
                  href={router.asPath}
                  locale={l.code}
                  className={l.code === (router.locale || 'en')
                    ? 'text-white'
                    : 'text-white/30 hover:text-white/70 transition-colors'}
                >
                  {l.label}
                </Link>
              </span>
            ))}
          </div>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 px-4 py-2 lg:px-5 lg:py-2.5 border border-white/30 hover:border-white/80 text-white/90 hover:text-white transition-colors font-mono text-[10px] tracking-[0.2em] uppercase"
          >
            <span className="block w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span>Get in touch</span>
          </a>
        </div>
      </div>
    </header>
  );
}
