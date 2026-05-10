// Subtle technical dot-grid background. CSS-only, zero JS, zero runtime cost.
// Used as the global atmosphere instead of gradients — gives the page an
// engineering / blueprint feel without any color wash.
export default function GridBackground({ className = '', dotOpacity = 0.06 }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: `radial-gradient(rgba(255,255,255,${dotOpacity}) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }}
    />
  );
}
