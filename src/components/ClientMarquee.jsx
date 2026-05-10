// Client logo marquee — infinite horizontal scroll. Pure CSS animation,
// duplicates the logos so the loop is seamless. No JS scroll listeners.
import Image from 'next/image';

const CLIENTS = [
  { name: 'Renault Algérie', src: '/clients/renault.png',  w: 96, h: 32 },
  { name: 'Epson',           src: '/clients/epson.png',    w: 92, h: 32 },
  { name: 'Del Monte',       src: '/clients/delmonte.png', w: 88, h: 32 },
  { name: 'Offto',           src: '/clients/offto.png',    w: 86, h: 32 },
  { name: 'Barugzai',        src: '/clients/barugzai.png', w: 92, h: 32 },
];

export default function ClientMarquee({ label }) {
  return (
    <div className="relative w-full border-y border-white/[0.08] bg-black/60 overflow-hidden">
      {/* Edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10" style={{ background: 'linear-gradient(to right, #000, transparent)' }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10" style={{ background: 'linear-gradient(to left, #000, transparent)' }} />

      {/* Label */}
      {label && (
        <div className="absolute top-1/2 -translate-y-1/2 left-6 lg:left-10 z-20 font-mono text-[10px] tracking-[0.25em] uppercase text-white/40 bg-black px-3 py-1 border border-white/[0.06]">
          {label}
        </div>
      )}

      {/* Track — render the list twice so the keyframe loop is seamless */}
      <div className="flex w-max animate-marquee py-7">
        {[...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS].map((c, i) => (
          <div key={i} className="flex items-center justify-center px-12 lg:px-16 shrink-0">
            <Image
              src={c.src}
              alt={c.name}
              width={c.w * 1.6}
              height={c.h * 1.6}
              className="h-9 lg:h-11 w-auto object-contain opacity-50 hover:opacity-90 transition-opacity duration-300"
              style={{ filter: 'grayscale(100%) brightness(1.6) contrast(0.9)' }}
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        .animate-marquee {
          animation: marquee 32s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
