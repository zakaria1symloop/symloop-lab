"use client";
import { useEffect, useState } from 'react';

// A soft glow that follows the cursor — subtle ambient interaction in the
// hero. Disabled on touch devices automatically (no mouse events fire).
export default function MouseGlow({ color = 'rgba(99, 102, 241, 0.18)', size = 600 }) {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(hover: none)').matches) return;
    setEnabled(true);
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  if (!enabled) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: `radial-gradient(${size}px circle at ${pos.x}px ${pos.y}px, ${color}, transparent 60%)`,
        transition: 'background 80ms linear',
      }}
    />
  );
}
