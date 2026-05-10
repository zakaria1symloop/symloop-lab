"use client";
// ============================================================================
// AnimatedHeroTitle — word-by-word stagger reveal with a continuous cyan
// shimmer that sweeps across the second line every few seconds.
//
// Built for the Symloop AI hero. Each word slides up from below + fades in
// with its own delay, like a curtain lifting one column at a time. The
// second line ("for business.") has a slow cyan gradient shimmer so the
// hero never looks static after the initial reveal.
// ============================================================================

import { motion } from 'framer-motion';

const wordSpring = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show:   {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: { opacity: 1 },
  show:   { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

function splitWords(text) {
  return text.split(/(\s+)/).filter(Boolean);
}

export default function AnimatedHeroTitle({ titleA, titleB, className = '' }) {
  const wordsA = splitWords(titleA);
  const wordsB = splitWords(titleB);

  return (
    <motion.h1
      initial="hidden"
      animate="show"
      variants={stagger}
      className={className}
      aria-label={`${titleA} ${titleB}`}
    >
      <span className="block">
        {wordsA.map((w, i) => /^\s+$/.test(w) ? (
          <span key={`a-${i}`}> </span>
        ) : (
          <span key={`a-${i}`} className="inline-block overflow-hidden align-baseline pb-[0.06em]">
            <motion.span variants={wordSpring} className="inline-block">{w}</motion.span>
          </span>
        ))}
      </span>

      <span className="block relative">
        {wordsB.map((w, i) => /^\s+$/.test(w) ? (
          <span key={`b-${i}`}> </span>
        ) : (
          <span key={`b-${i}`} className="inline-block overflow-hidden align-baseline pb-[0.06em]">
            <motion.span
              variants={wordSpring}
              className="shimmer-word inline-block"
              style={{
                color: 'rgba(255,255,255,0.55)',
                backgroundImage: 'linear-gradient(110deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.55) 30%, #ffffff 50%, rgba(255,255,255,0.55) 70%, rgba(255,255,255,0.55) 100%)',
                backgroundSize: '300% 100%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'titleShimmer 6s ease-in-out infinite',
                animationDelay: `${1.4 + i * 0.4}s`,
              }}
            >
              {w}
            </motion.span>
          </span>
        ))}
      </span>

      <style jsx global>{`
        @keyframes titleShimmer {
          0%, 100% { background-position: 100% 50%; }
          50%      { background-position: 0%   50%; }
        }
      `}</style>
    </motion.h1>
  );
}
