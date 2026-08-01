"use client";

import { useEffect, useRef } from "react";

export default function Noise() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationId: number;
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    const drawNoise = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Clear with slight transparency so previous frames fade
      ctx.clearRect(0, 0, w, h);

      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;

      // Generate procedural noise (simple + fast)
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;     // R
        data[i + 1] = value; // G
        data[i + 2] = value; // B
        data[i + 3] = 18;    // Alpha – very subtle
      }

      ctx.putImageData(imageData, 0, 0);
      frame++;
    };

    // Throttle to ~15–20 FPS for noise (no need for 60)
    let lastTime = 0;
    const animate = (time: number) => {
      if (time - lastTime > 50) {
        // ~20 FPS
        drawNoise();
        lastTime = time;
      }
      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay"
      aria-hidden="true"
    />
  );
}