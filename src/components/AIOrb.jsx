"use client";
// ============================================================================
// AIOrb — animated geometric "AI core". Pure SVG + CSS, no canvas, no Three.js.
//
// Composition:
//   - Outer wireframe sphere (rotating great-circle latitude / longitude lines)
//   - Three concentric rings rotating at different speeds and tilts
//   - Pulsing core dot at center
//   - Orbital data points that travel each ring
//   - Subtle outer glow (no gradient) via radial-gradient mask
// ============================================================================

import { motion } from 'framer-motion';

export default function AIOrb({ size = 'min(560px, 80vw)' }) {
  return (
    <div
      className="relative mx-auto select-none"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* Soft cyan halo behind the orb (no UI gradient — used as ambient depth) */}
      <div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle at center, rgba(255, 255, 255,0.18), transparent 60%)' }}
      />

      {/* Concentric rings */}
      <svg viewBox="0 0 600 600" className="absolute inset-0 w-full h-full">
        <defs>
          <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* OUTER RING — slow */}
        <g style={{ transformOrigin: '300px 300px', animation: 'spin 60s linear infinite' }}>
          <ellipse cx="300" cy="300" rx="270" ry="270"
                   fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
          <circle cx="300" cy="30" r="3" fill="#ffffff" filter="url(#cyanGlow)" />
        </g>

        {/* MIDDLE RING — counter-rotation, tilted */}
        <g style={{ transformOrigin: '300px 300px', animation: 'spinReverse 38s linear infinite', transform: 'rotateX(28deg)' }}>
          <ellipse cx="300" cy="300" rx="200" ry="200"
                   fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          <circle cx="500" cy="300" r="2.5" fill="#ffffff" />
          <circle cx="100" cy="300" r="1.5" fill="rgba(255,255,255,0.6)" />
        </g>

        {/* INNER RING — fast */}
        <g style={{ transformOrigin: '300px 300px', animation: 'spin 18s linear infinite' }}>
          <ellipse cx="300" cy="300" rx="135" ry="135"
                   fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
          <circle cx="300" cy="165" r="3" fill="#ffffff" filter="url(#cyanGlow)" />
          <circle cx="435" cy="300" r="1.5" fill="rgba(255,255,255,0.4)" />
        </g>

        {/* WIREFRAME LATITUDE LINES (static — gives sphere depth) */}
        <g stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none">
          <ellipse cx="300" cy="300" rx="270" ry="60" />
          <ellipse cx="300" cy="300" rx="270" ry="120" />
          <ellipse cx="300" cy="300" rx="270" ry="180" />
          <ellipse cx="300" cy="300" rx="270" ry="240" />
        </g>

        {/* WIREFRAME LONGITUDE LINES */}
        <g stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none">
          <ellipse cx="300" cy="300" rx="60"  ry="270" />
          <ellipse cx="300" cy="300" rx="120" ry="270" />
          <ellipse cx="300" cy="300" rx="180" ry="270" />
          <ellipse cx="300" cy="300" rx="240" ry="270" />
        </g>

        {/* CONSTELLATION DOTS — random AI "knowledge nodes" on the sphere */}
        <g fill="rgba(255,255,255,0.45)">
          <circle cx="380" cy="220" r="1.2" />
          <circle cx="220" cy="380" r="1.2" />
          <circle cx="430" cy="380" r="1.2" />
          <circle cx="170" cy="240" r="1.2" />
          <circle cx="370" cy="160" r="1.2" />
          <circle cx="270" cy="450" r="1.2" />
          <circle cx="480" cy="290" r="1.2" />
          <circle cx="120" cy="320" r="1.2" />
        </g>

        {/* CORE — pulsing center dot */}
        <g style={{ transformOrigin: '300px 300px' }}>
          <circle cx="300" cy="300" r="14" fill="#ffffff" opacity="0.15" filter="url(#cyanGlow)">
            <animate attributeName="r"        values="14;28;14" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="opacity"  values="0.3;0.05;0.3" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="300" cy="300" r="6" fill="#ffffff" filter="url(#cyanGlow)">
            <animate attributeName="opacity"  values="1;0.5;1" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="300" cy="300" r="2.5" fill="#fff" />
        </g>

        {/* DATA STREAMS — short cyan arcs that fade in/out */}
        <g style={{ transformOrigin: '300px 300px', animation: 'spin 12s linear infinite' }}>
          <path d="M 300 90 A 210 210 0 0 1 510 300" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
            <animate attributeName="opacity" values="0;0.7;0" dur="3s" repeatCount="indefinite" />
          </path>
          <path d="M 90 300 A 210 210 0 0 1 300 90" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.4">
            <animate attributeName="opacity" values="0;0.5;0" dur="3.5s" begin="0.5s" repeatCount="indefinite" />
          </path>
        </g>
      </svg>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}
