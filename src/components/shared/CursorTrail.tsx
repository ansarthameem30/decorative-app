'use client';

import React, { useEffect, useRef } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  time: number;
  width: number;
}

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  rotation: number;
  vRot: number;
}

export const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const pointsRef = useRef<TrailPoint[]>([]);
  const sparklesRef = useRef<SparkleParticle[]>([]);
  const lastPosRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-DPI support for ultra-crisp trails on Retina / mobile screens
    let dpr = window.devicePixelRatio || 1;
    let width = (canvas.width = window.innerWidth * dpr);
    let height = (canvas.height = window.innerHeight * dpr);
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      dpr = window.devicePixelRatio || 1;
      width = canvas.width = window.innerWidth * dpr;
      height = canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    const SPARKLE_COLORS = ['#ffffff', '#f0abfc', '#c084fc', '#fbcfe8', '#fde68a', '#e9d5ff'];

    const spawnSparkles = (x: number, y: number, count = 2, speedScale = 1) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 1.8 + 0.6) * speedScale;
        sparklesRef.current.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3 + 1.2,
          alpha: 1,
          decay: Math.random() * 0.035 + 0.02,
          color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.15,
        });
      }
      // Cap sparkles for peak performance
      if (sparklesRef.current.length > 90) {
        sparklesRef.current.splice(0, sparklesRef.current.length - 90);
      }
    };

    const addPoint = (clientX: number, clientY: number) => {
      const now = performance.now();
      let dynamicWidth = 10;

      if (lastPosRef.current) {
        const dx = clientX - lastPosRef.current.x;
        const dy = clientY - lastPosRef.current.y;
        const dt = Math.max(1, now - lastPosRef.current.time);
        const dist = Math.hypot(dx, dy);
        const velocity = dist / dt; // pixels per ms

        // Dynamic width based on velocity: fast swipe = wider, expressive swoosh
        dynamicWidth = Math.min(22, Math.max(8, velocity * 8));

        // Spawn intermediate points if moved fast
        if (dist > 16) {
          const steps = Math.min(4, Math.floor(dist / 12));
          for (let i = 1; i <= steps; i++) {
            const frac = i / (steps + 1);
            const ix = lastPosRef.current.x + dx * frac;
            const iy = lastPosRef.current.y + dy * frac;
            pointsRef.current.push({
              x: ix,
              y: iy,
              time: now - dt * (1 - frac),
              width: dynamicWidth,
            });
            if (Math.random() < 0.4) spawnSparkles(ix, iy, 1, 0.8);
          }
        }
      }

      pointsRef.current.push({
        x: clientX,
        y: clientY,
        time: now,
        width: dynamicWidth,
      });

      spawnSparkles(clientX, clientY, 2, 1);
      lastPosRef.current = { x: clientX, y: clientY, time: now };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e && e.touches.length > 0) {
        for (let i = 0; i < e.touches.length; i++) {
          addPoint(e.touches[i].clientX, e.touches[i].clientY);
        }
      } else if ('clientX' in e) {
        addPoint(e.clientX, e.clientY);
      }
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      let cx = 0;
      let cy = 0;
      if ('touches' in e && e.touches.length > 0) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      } else if ('clientX' in e) {
        cx = (e as MouseEvent).clientX;
        cy = (e as MouseEvent).clientY;
      }
      lastPosRef.current = { x: cx, y: cy, time: performance.now() };
      spawnSparkles(cx, cy, 6, 2.2); // Burst on click/tap
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    window.addEventListener('touchstart', handlePointerDown, { passive: true });

    const TRAIL_LIFETIME = 380; // ms trail remains visible

    const render = () => {
      const now = performance.now();
      const cssWidth = window.innerWidth;
      const cssHeight = window.innerHeight;
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      // Clean up dead points
      pointsRef.current = pointsRef.current.filter((p) => now - p.time < TRAIL_LIFETIME);

      const points = pointsRef.current;

      // 1. Render Fluid Tapered Ribbon Trail
      if (points.length >= 2) {
        ctx.save();

        // Draw multiple passes for ethereal celestial glow
        // Pass A: Outer soft bloom
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          const ageRatio = (now - p1.time) / TRAIL_LIFETIME; // 0 = newest, 1 = oldest
          const alpha = Math.max(0, (1 - ageRatio) * 0.55);
          const currentWidth = p1.width * (1 - ageRatio * 0.85);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(192, 132, 252, ${alpha * 0.5})`;
          ctx.lineWidth = currentWidth + 6;
          ctx.shadowColor = '#f0abfc';
          ctx.shadowBlur = 14;
          ctx.stroke();
        }

        // Pass B: Inner radiant silk core
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          const ageRatio = (now - p1.time) / TRAIL_LIFETIME;
          const alpha = Math.max(0, 1 - ageRatio);
          const currentWidth = Math.max(1.5, p1.width * (1 - ageRatio * 0.85) * 0.5);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          // High starlight white-pink core
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
          ctx.lineWidth = currentWidth;
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 8;
          ctx.stroke();
        }

        ctx.restore();
      }

      // 2. Render Stardust Sparkles
      for (let i = sparklesRef.current.length - 1; i >= 0; i--) {
        const s = sparklesRef.current[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.95;
        s.vy *= 0.95;
        s.alpha -= s.decay;
        s.rotation += s.vRot;

        if (s.alpha <= 0) {
          sparklesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.globalAlpha = Math.max(0, s.alpha);

        // 4-Point Micro Starburst
        const rad = s.size;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = s.size * 3;

        ctx.beginPath();
        // Star cross
        ctx.moveTo(-rad * 2, 0);
        ctx.lineTo(rad * 2, 0);
        ctx.moveTo(0, -rad * 2);
        ctx.lineTo(0, rad * 2);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Center dot
        ctx.beginPath();
        ctx.arc(0, 0, rad * 0.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 w-full h-full"
    />
  );
};
