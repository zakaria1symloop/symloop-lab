"use client";
// ============================================================================
// NetworkVisualization — interactive canvas-based abstract AI network.
//
// Renders a slowly-drifting node-graph. Lines connect nearby nodes with
// opacity proportional to their distance. The cursor radiates out into the
// network, lighting up nearby nodes with a cyan accent. Each node has a
// subtle pulse cycle so the whole field always feels alive.
//
// Built from scratch in ~200 lines of vanilla canvas — no Three.js, no Rive,
// no external dependencies. Smooth 60fps on every device.
//
// The aesthetic intent: "this is what the inside of a production AI system
// looks like" — premium, technical, abstract, not decorative.
// ============================================================================

import { useEffect, useRef } from 'react';

const CONFIG = {
  nodeCount:        70,
  maxDistance:      150,
  nodeRadius:       1.5,
  drift:            0.18,
  pulseSpeed:       0.0015,
  cursorRadius:     220,
  cursorFalloff:    1.6,
  baseColor:        'rgba(255, 255, 255, ',  // alpha appended at draw time
  accentColor:      'rgba(255, 255, 255, ',
  lineColor:        'rgba(255, 255, 255, ',
  accentLineColor:  'rgba(255, 255, 255, ',
};

export default function NetworkVisualization({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let raf;
    let nodes = [];
    let mouse = { x: -10000, y: -10000, active: false };
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width  = rect.width  * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawnNodes() {
      const rect = canvas.getBoundingClientRect();
      nodes = Array.from({ length: CONFIG.nodeCount }, () => ({
        x:    Math.random() * rect.width,
        y:    Math.random() * rect.height,
        vx:  (Math.random() - 0.5) * CONFIG.drift,
        vy:  (Math.random() - 0.5) * CONFIG.drift,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }

    function onLeave() {
      mouse.active = false;
      mouse.x = -10000;
      mouse.y = -10000;
    }

    function frame(now) {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Update node positions + bounce off edges
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > rect.width)  n.vx *= -1;
        if (n.y < 0 || n.y > rect.height) n.vy *= -1;
      }

      // Draw connecting lines (proportional opacity by distance)
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > CONFIG.maxDistance) continue;
          const t = 1 - dist / CONFIG.maxDistance; // 0..1, closer = stronger

          // Cursor proximity boost — average of both endpoints
          let boost = 0;
          if (mouse.active) {
            const mx1 = a.x - mouse.x, my1 = a.y - mouse.y;
            const d1  = Math.hypot(mx1, my1);
            const mx2 = b.x - mouse.x, my2 = b.y - mouse.y;
            const d2  = Math.hypot(mx2, my2);
            const ed  = Math.min(d1, d2);
            if (ed < CONFIG.cursorRadius) {
              boost = Math.pow(1 - ed / CONFIG.cursorRadius, CONFIG.cursorFalloff);
            }
          }

          const baseAlpha = t * 0.18;
          const accentAlpha = boost * 0.55;

          // Base line
          ctx.strokeStyle = CONFIG.lineColor + (baseAlpha + boost * 0.1) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();

          // Cyan overlay where cursor is close
          if (boost > 0.05) {
            ctx.strokeStyle = CONFIG.accentLineColor + accentAlpha + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes (with pulse)
      for (const n of nodes) {
        const pulse = (Math.sin(now * CONFIG.pulseSpeed + n.phase) + 1) / 2; // 0..1
        const r = CONFIG.nodeRadius + pulse * 0.8;

        // Cursor proximity
        let proximity = 0;
        if (mouse.active) {
          const dist = Math.hypot(n.x - mouse.x, n.y - mouse.y);
          if (dist < CONFIG.cursorRadius) {
            proximity = Math.pow(1 - dist / CONFIG.cursorRadius, CONFIG.cursorFalloff);
          }
        }

        // Base node
        ctx.fillStyle = CONFIG.baseColor + (0.3 + pulse * 0.25 + proximity * 0.4) + ')';
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Accent halo when cursor close
        if (proximity > 0.1) {
          ctx.fillStyle = CONFIG.accentColor + (proximity * 0.6) + ')';
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + proximity * 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    spawnNodes();
    raf = requestAnimationFrame(frame);

    const onResize = () => { resize(); spawnNodes(); };
    window.addEventListener('resize', onResize);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
}
