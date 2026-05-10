"use client";
// ============================================================================
// FloatingOrbs — six soft, heavily-blurred orbs drifting across the hero.
//
// Each orb is a radial gradient with a long, slow CSS keyframe animation
// that moves it diagonally over many tens of seconds. Sizes, colors, blurs,
// opacities, and trajectories are all different so the field never repeats.
//
// Pure CSS / no JS per-frame — runs at 60fps on the GPU.
// ============================================================================

const ORBS = [
  // Visible accents — drifting across the hero (faster cadence)
  { size: 620, top: '5%',   left: '4%',   color: 'rgba(255, 255, 255, 0.45)', blur: 100, dur: 22, anim: 'driftA', delay: 0 },
  { size: 540, top: '48%',  left: '68%',  color: 'rgba(255, 255, 255, 0.40)', blur: 110, dur: 28, anim: 'driftB', delay: 2 },
  { size: 460, top: '70%',  left: '8%',   color: 'rgba(255, 255, 255, 0.32)', blur: 90,  dur: 24, anim: 'driftC', delay: 4 },

  // Soft depth — never overpowering
  { size: 580, top: '15%',  left: '52%',  color: 'rgba(255, 255, 255, 0.22)', blur: 120, dur: 30, anim: 'driftD', delay: 1 },
  { size: 380, top: '38%',  left: '28%',  color: 'rgba(255, 255, 255, 0.20)', blur: 100, dur: 19, anim: 'driftE', delay: 3 },
  { size: 500, top: '76%',  left: '54%',  color: 'rgba(255, 255, 255, 0.28)', blur: 130, dur: 34, anim: 'driftF', delay: 5 },
];

export default function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {ORBS.map((o, i) => (
        <div
          key={i}
          className={`floating-orb orb-${i}`}
          style={{
            position: 'absolute',
            width: o.size,
            height: o.size,
            top: o.top,
            left: o.left,
            background: `radial-gradient(circle at center, ${o.color} 0%, transparent 70%)`,
            filter: `blur(${o.blur}px)`,
            borderRadius: '50%',
            animation: `${o.anim} ${o.dur}s ease-in-out infinite`,
            animationDelay: `${o.delay}s`,
            willChange: 'transform',
          }}
        />
      ))}

      <style jsx global>{`
        /* Marked global because inline-style animation references the
           keyframe name and styled-jsx local scoping renames keyframes. */
        @keyframes driftA {
          0%, 100% { transform: translate(0, 0)         scale(1); }
          25%      { transform: translate(120px, -60px)  scale(1.08); }
          50%      { transform: translate(220px,  80px)  scale(0.95); }
          75%      { transform: translate( 80px, 160px)  scale(1.05); }
        }
        @keyframes driftB {
          0%, 100% { transform: translate(0, 0)         scale(1); }
          33%      { transform: translate(-160px,  90px) scale(1.1); }
          66%      { transform: translate(-80px,  -120px) scale(0.92); }
        }
        @keyframes driftC {
          0%, 100% { transform: translate(0, 0)         scale(1); }
          25%      { transform: translate( 90px,  -110px) scale(0.95); }
          50%      { transform: translate(180px,   60px) scale(1.12); }
          75%      { transform: translate( 50px,   140px) scale(1); }
        }
        @keyframes driftD {
          0%, 100% { transform: translate(0, 0)         scale(1); }
          50%      { transform: translate(-220px, -100px) scale(1.15); }
        }
        @keyframes driftE {
          0%, 100% { transform: translate(0, 0)         scale(1); }
          25%      { transform: translate( 140px,  140px) scale(0.9); }
          50%      { transform: translate(-100px,  100px) scale(1.05); }
          75%      { transform: translate(-180px, -60px)  scale(1); }
        }
        @keyframes driftF {
          0%, 100% { transform: translate(0, 0)         scale(1); }
          40%      { transform: translate(-120px,  -150px) scale(1.08); }
          70%      { transform: translate(-260px,    40px) scale(0.95); }
        }
      `}</style>
    </div>
  );
}
