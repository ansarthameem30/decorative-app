'use client';

import React, { useEffect, useRef } from 'react';

export const CelestialRingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const rotationRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-DPI crisp rendering
    const dpr = window.devicePixelRatio || 1;
    const displaySize = 300;
    canvas.width = displaySize * dpr;
    canvas.height = displaySize * dpr;
    ctx.scale(dpr, dpr);

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientY : (e as MouseEvent).clientY;
      if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
        mouseRef.current.x = ((clientX - rect.left) / rect.width - 0.5) * 2;
        mouseRef.current.y = ((clientY - rect.top) / rect.height - 0.5) * 2;
      }
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, displaySize, displaySize);

      rotationRef.current += 0.015;
      const angle = rotationRef.current;
      const wobbleX = mouseRef.current.x * 0.35 + Math.sin(angle * 0.7) * 0.08;
      const wobbleY = mouseRef.current.y * 0.25 + Math.cos(angle * 0.5) * 0.06;

      const cx = displaySize / 2;
      const cy = displaySize / 2 + 15;

      // 1. Ethereal Violet-Champagne Ambient Bloom
      const auraGrad = ctx.createRadialGradient(cx, cy - 40, 5, cx, cy - 40, 110);
      auraGrad.addColorStop(0, 'rgba(240, 171, 252, 0.35)');
      auraGrad.addColorStop(0.4, 'rgba(192, 132, 252, 0.15)');
      auraGrad.addColorStop(0.8, 'rgba(139, 92, 246, 0.04)');
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(cx, cy - 40, 110, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(cx, cy);

      // Subtle 3D tilt perspective
      ctx.transform(1, wobbleY * 0.2, wobbleX * 0.2, 1, 0, 0);

      // 2. 3D Platinum Band
      const bandRadiusX = 58;
      const bandRadiusY = 22;

      // Band Depth & Occlusion (Back Arc)
      ctx.lineWidth = 7;
      ctx.strokeStyle = '#3b1d60';
      ctx.beginPath();
      ctx.ellipse(0, 0, bandRadiusX, bandRadiusY, 0, Math.PI, 2 * Math.PI);
      ctx.stroke();

      // Band Inner Glow
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, 0, bandRadiusX - 1, bandRadiusY - 1, 0, Math.PI, 2 * Math.PI);
      ctx.stroke();

      // Front Arc (Lustrous Platinum-Gold Metallic Sheen)
      const platGrad = ctx.createLinearGradient(-bandRadiusX, 0, bandRadiusX, 0);
      platGrad.addColorStop(0, '#d8b4fe');
      platGrad.addColorStop(0.25, '#ffffff');
      platGrad.addColorStop(0.45, '#f3e8ff');
      platGrad.addColorStop(0.7, '#e9d5ff');
      platGrad.addColorStop(0.9, '#ffffff');
      platGrad.addColorStop(1, '#c084fc');

      ctx.lineWidth = 7.5;
      ctx.strokeStyle = platGrad;
      ctx.shadowColor = '#f0abfc';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.ellipse(0, 0, bandRadiusX, bandRadiusY, 0, 0, Math.PI);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 3. Pave Micro-Diamonds on Ring Shoulders
      const paveCount = 7;
      for (let i = 0; i < paveCount; i++) {
        const t = 0.25 + (i / paveCount) * 0.5; // Positions along shoulders
        const px = Math.cos(t * Math.PI) * bandRadiusX;
        const py = Math.sin(t * Math.PI) * bandRadiusY;
        const glint = Math.sin(angle * 3 + i * 1.5) * 0.5 + 0.5;

        ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + glint * 0.6})`;
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Crown Setting & 6 Platinum Prongs
      const diamondCenterY = -48;
      const diamondRadius = 26;

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      // Left and right main prongs
      ctx.moveTo(-18, -4);
      ctx.lineTo(-diamondRadius * 0.75, diamondCenterY + 4);
      ctx.moveTo(18, -4);
      ctx.lineTo(diamondRadius * 0.75, diamondCenterY + 4);
      // Center bridge prongs
      ctx.moveTo(-6, -8);
      ctx.lineTo(-diamondRadius * 0.35, diamondCenterY + 12);
      ctx.moveTo(6, -8);
      ctx.lineTo(diamondRadius * 0.35, diamondCenterY + 12);
      ctx.stroke();

      // 5. Flawless Solitaire Brilliant Cut Diamond
      ctx.save();
      ctx.translate(0, diamondCenterY);

      // Pavilion (V-shaped base)
      const pavGrad = ctx.createLinearGradient(0, 18, 0, -5);
      pavGrad.addColorStop(0, '#ffffff');
      pavGrad.addColorStop(0.5, '#e9d5ff');
      pavGrad.addColorStop(1, '#f5d0fe');

      ctx.fillStyle = pavGrad;
      ctx.beginPath();
      ctx.moveTo(0, 18); // Culet (point)
      ctx.lineTo(-diamondRadius, -2); // Left girdle
      ctx.lineTo(diamondRadius, -2); // Right girdle
      ctx.closePath();
      ctx.fill();

      // Crown (Top trapezoid)
      const crownGrad = ctx.createLinearGradient(0, -2, 0, -diamondRadius * 0.85);
      crownGrad.addColorStop(0, '#fdf4ff');
      crownGrad.addColorStop(0.6, '#ffffff');
      crownGrad.addColorStop(1, '#fae8ff');

      ctx.fillStyle = crownGrad;
      ctx.beginPath();
      ctx.moveTo(-diamondRadius, -2);
      ctx.lineTo(-diamondRadius * 0.62, -diamondRadius * 0.8);
      ctx.lineTo(diamondRadius * 0.62, -diamondRadius * 0.8);
      ctx.lineTo(diamondRadius, -2);
      ctx.closePath();
      ctx.fill();

      // Facet Refraction Network (Internal crystal reflections)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 1;

      // Table & Star Facets
      ctx.beginPath();
      // Table flat top
      ctx.moveTo(-diamondRadius * 0.62, -diamondRadius * 0.8);
      ctx.lineTo(diamondRadius * 0.62, -diamondRadius * 0.8);
      // Triangles from girdle to table
      ctx.moveTo(-diamondRadius, -2);
      ctx.lineTo(0, -diamondRadius * 0.8);
      ctx.lineTo(diamondRadius, -2);
      // Pavilion facet lines down to culet
      ctx.moveTo(-diamondRadius * 0.5, -2);
      ctx.lineTo(0, 18);
      ctx.moveTo(diamondRadius * 0.5, -2);
      ctx.lineTo(0, 18);
      ctx.moveTo(0, -2);
      ctx.lineTo(0, 18);
      ctx.stroke();

      // 6. Chromatic Dispersion (Prismatic Rainbow Glints)
      const dispersionAlpha = Math.sin(angle * 2.5) * 0.4 + 0.5;
      // Cyan-blue glint on left facet
      ctx.fillStyle = `rgba(147, 197, 253, ${dispersionAlpha * 0.6})`;
      ctx.beginPath();
      ctx.moveTo(-diamondRadius * 0.62, -diamondRadius * 0.8);
      ctx.lineTo(0, -diamondRadius * 0.8);
      ctx.lineTo(-diamondRadius * 0.3, -2);
      ctx.closePath();
      ctx.fill();

      // Orchid-amber glint on right facet
      ctx.fillStyle = `rgba(244, 114, 182, ${dispersionAlpha * 0.65})`;
      ctx.beginPath();
      ctx.moveTo(diamondRadius * 0.62, -diamondRadius * 0.8);
      ctx.lineTo(0, -diamondRadius * 0.8);
      ctx.lineTo(diamondRadius * 0.3, -2);
      ctx.closePath();
      ctx.fill();

      // 7. Dynamic Anamorphic Lens Flare Sparkle on Table Edge
      const sparkleAlpha = 0.5 + Math.sin(angle * 4) * 0.5;
      const flareSize = 24 + Math.sin(angle * 3) * 10;

      ctx.save();
      ctx.translate(Math.sin(angle * 1.5) * 8, -diamondRadius * 0.8);
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 15;

      // 4-Point Starlight Flare
      ctx.strokeStyle = `rgba(255, 255, 255, ${sparkleAlpha})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-flareSize, 0);
      ctx.lineTo(flareSize, 0);
      ctx.moveTo(0, -flareSize);
      ctx.lineTo(0, flareSize);
      ctx.stroke();

      // Diagonal secondary flare
      ctx.strokeStyle = `rgba(240, 171, 252, ${sparkleAlpha * 0.6})`;
      ctx.lineWidth = 1;
      const diag = flareSize * 0.45;
      ctx.beginPath();
      ctx.moveTo(-diag, -diag);
      ctx.lineTo(diag, diag);
      ctx.moveTo(-diag, diag);
      ctx.lineTo(diag, -diag);
      ctx.stroke();

      // Bright Core Dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      ctx.restore();
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center pointer-events-auto">
      <canvas
        ref={canvasRef}
        style={{ width: '280px', height: '280px' }}
        className="drop-shadow-[0_0_40px_rgba(240,171,252,0.5)] cursor-pointer"
        title="Interactive Diamond Solitaire Ring"
      />
    </div>
  );
};
