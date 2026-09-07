'use client';

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number; // Depth 1 to 4
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  hasFlare: boolean;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  color: string;
}

interface CosmicDust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

interface ParticleFieldProps {
  interactiveParallax?: boolean;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({ interactiveParallax = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const touchVelocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastTouchPosRef = useRef<{ x: number; y: number } | null>(null);
  const fluidSwirlRef = useRef<{ x: number; y: number; strength: number }>({ x: 0.5, y: 0.5, strength: 0 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;
    const starCount = isMobile ? 85 : 190;
    const dustCount = isMobile ? 25 : 50;

    const stars: Star[] = [];
    const meteors: Meteor[] = [];
    const dustMotes: CosmicDust[] = [];

    const starPalette = ['#ffffff', '#e9d5ff', '#c084fc', '#fbcfe8', '#818cf8'];
    const dustPalette = ['#c084fc', '#8b5cf6', '#a78bfa', '#f0abfc'];

    // Initialize multi-depth stars with realistic optical traits
    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < starCount; i++) {
        const z = Math.random() < 0.5 ? 1 : Math.random() < 0.8 ? 2 : Math.random() < 0.95 ? 3 : 4;
        const size = z === 1 ? Math.random() * 0.9 + 0.4 : z === 2 ? Math.random() * 1.4 + 0.7 : z === 3 ? Math.random() * 2.2 + 1.2 : Math.random() * 3.2 + 2;
        const hasFlare = z >= 3 && Math.random() < 0.4;
        const baseAlpha = z === 1 ? 0.3 : z === 2 ? 0.6 : z === 3 ? 0.85 : 0.95;

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          size,
          baseAlpha,
          alpha: baseAlpha,
          twinkleSpeed: Math.random() * 0.025 + 0.008,
          twinklePhase: Math.random() * Math.PI * 2,
          color: starPalette[Math.floor(Math.random() * starPalette.length)],
          hasFlare,
        });
      }
    };

    // Initialize floating cosmic dust motes
    const initDust = () => {
      dustMotes.length = 0;
      for (let i = 0; i < dustCount; i++) {
        dustMotes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25 - 0.08,
          size: Math.random() * 3 + 1,
          alpha: Math.random() * 0.45 + 0.1,
          color: dustPalette[Math.floor(Math.random() * dustPalette.length)],
        });
      }
    };

    initStars();
    initDust();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
      initDust();
    };

    window.addEventListener('resize', handleResize);

    // Interactive fluid turbulence on mouse / touch
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else return;

      fluidSwirlRef.current.x = clientX / width;
      fluidSwirlRef.current.y = clientY / height;
      fluidSwirlRef.current.strength = Math.min(1.5, fluidSwirlRef.current.strength + 0.12);

      if (lastTouchPosRef.current) {
        touchVelocityRef.current = {
          x: (clientX - lastTouchPosRef.current.x) * 0.08,
          y: (clientY - lastTouchPosRef.current.y) * 0.08,
        };
      }
      lastTouchPosRef.current = { x: clientX, y: clientY };
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Spawn shooting star periodically
    let meteorCooldown = 0;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Render loop
    const render = (time: number) => {
      const t = time * 0.00035;

      // Base void deep space gradient
      const bgGrad = ctx.createRadialGradient(
        width * (0.5 + Math.sin(t * 0.5) * 0.1),
        height * (0.45 + Math.cos(t * 0.4) * 0.1),
        width * 0.05,
        width * 0.5,
        height * 0.5,
        width * 0.85
      );
      bgGrad.addColorStop(0, '#150628');
      bgGrad.addColorStop(0.45, '#0d031c');
      bgGrad.addColorStop(1, '#05010a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Billowing Volumetric Nebula Layer 1 (Ultraviolet plasma cloud)
      const swirlX = fluidSwirlRef.current.x * width;
      const swirlY = fluidSwirlRef.current.y * height;
      const swirlStrength = fluidSwirlRef.current.strength;

      const nebX1 = width * 0.3 + Math.sin(t) * 70 + (swirlX - width * 0.3) * 0.05 * swirlStrength;
      const nebY1 = height * 0.35 + Math.cos(t * 0.8) * 50 + (swirlY - height * 0.35) * 0.05 * swirlStrength;
      const nebGrad1 = ctx.createRadialGradient(nebX1, nebY1, 10, nebX1, nebY1, width * 0.55);
      nebGrad1.addColorStop(0, 'rgba(107, 33, 168, 0.16)');
      nebGrad1.addColorStop(0.4, 'rgba(59, 7, 100, 0.09)');
      nebGrad1.addColorStop(0.8, 'rgba(24, 4, 42, 0.03)');
      nebGrad1.addColorStop(1, 'rgba(5, 1, 10, 0)');
      ctx.fillStyle = nebGrad1;
      ctx.fillRect(0, 0, width, height);

      // Billowing Volumetric Nebula Layer 2 (Luminous amethyst & blush dust)
      const nebX2 = width * 0.75 - Math.cos(t * 0.7) * 80 + (swirlX - width * 0.75) * 0.06 * swirlStrength;
      const nebY2 = height * 0.65 + Math.sin(t * 0.6) * 60 + (swirlY - height * 0.65) * 0.06 * swirlStrength;
      const nebGrad2 = ctx.createRadialGradient(nebX2, nebY2, 20, nebX2, nebY2, width * 0.6);
      nebGrad2.addColorStop(0, 'rgba(147, 51, 234, 0.14)');
      nebGrad2.addColorStop(0.35, 'rgba(88, 28, 135, 0.08)');
      nebGrad2.addColorStop(0.7, 'rgba(168, 85, 247, 0.02)');
      nebGrad2.addColorStop(1, 'rgba(5, 1, 10, 0)');
      ctx.fillStyle = nebGrad2;
      ctx.fillRect(0, 0, width, height);

      // Dissipate swirl strength gradually
      fluidSwirlRef.current.strength = Math.max(0, fluidSwirlRef.current.strength - 0.01);
      touchVelocityRef.current.x *= 0.94;
      touchVelocityRef.current.y *= 0.94;

      // Draw Stars
      for (let star of stars) {
        if (!prefersReducedMotion) {
          star.twinklePhase += star.twinkleSpeed;
          star.alpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.35;
        }

        const depthFactor = star.z * 0.3;
        const renderX = (star.x + touchVelocityRef.current.x * depthFactor + width) % width;
        const renderY = (star.y + touchVelocityRef.current.y * depthFactor + height) % height;

        ctx.save();
        ctx.globalAlpha = Math.max(0.12, Math.min(1, star.alpha));
        ctx.fillStyle = star.color;

        // Foreground stars have optical bloom & diffraction cross flares
        if (star.hasFlare) {
          ctx.shadowColor = '#c084fc';
          ctx.shadowBlur = star.size * 5;

          // Core
          ctx.beginPath();
          ctx.arc(renderX, renderY, star.size, 0, Math.PI * 2);
          ctx.fill();

          // Anamorphic Cross Flare
          ctx.strokeStyle = 'rgba(240, 171, 252, 0.45)';
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(renderX - star.size * 4.5, renderY);
          ctx.lineTo(renderX + star.size * 4.5, renderY);
          ctx.moveTo(renderX, renderY - star.size * 4.5);
          ctx.lineTo(renderX, renderY + star.size * 4.5);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(renderX, renderY, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Meteors / Shooting Stars
      meteorCooldown++;
      if (meteorCooldown > 260 && Math.random() < 0.04 && meteors.length < 2) {
        meteorCooldown = 0;
        meteors.push({
          x: Math.random() * width * 0.8 + width * 0.1,
          y: Math.random() * height * 0.3,
          length: Math.random() * 120 + 80,
          speed: Math.random() * 12 + 10,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
          alpha: 1,
          color: Math.random() > 0.5 ? '#f0abfc' : '#ffffff',
        });
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.alpha -= 0.022;

        if (m.alpha <= 0 || m.x > width + 100 || m.y > height + 100) {
          meteors.splice(i, 1);
          continue;
        }

        ctx.save();
        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const meteorGrad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        meteorGrad.addColorStop(0, 'rgba(192, 132, 252, 0)');
        meteorGrad.addColorStop(0.7, 'rgba(216, 180, 254, 0.4)');
        meteorGrad.addColorStop(1, m.color);

        ctx.strokeStyle = meteorGrad;
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
        ctx.restore();
      }

      // Floating Cosmic Dust Motes
      for (let dust of dustMotes) {
        dust.x += dust.vx;
        dust.y += dust.vy;

        if (dust.y < -10) dust.y = height + 10;
        if (dust.x < -10) dust.x = width + 10;
        if (dust.x > width + 10) dust.x = -10;

        ctx.save();
        ctx.globalAlpha = dust.alpha;
        ctx.fillStyle = dust.color;
        ctx.shadowColor = dust.color;
        ctx.shadowBlur = dust.size * 3;
        ctx.beginPath();
        ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
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
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [interactiveParallax]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
    />
  );
};
