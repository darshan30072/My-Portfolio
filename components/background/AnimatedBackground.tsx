"use client";

import Aurora from "./Aurora";
import Noise from "./Noise";
import MouseGlow from "./MouseGlow";

export default function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Base gradient / solid */}
      <div className="absolute inset-0 bg-[var(--bg-base)]" />

      {/* Animated aurora layers */}
      <Aurora />

      {/* Cursor spotlight */}
      <MouseGlow />

      {/* Procedural noise overlay */}
      <Noise />

      {/* Optional subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 40%,
            rgba(0,0,0,0.25) 100%
          )`,
        }}
      />
    </div>
  );
}