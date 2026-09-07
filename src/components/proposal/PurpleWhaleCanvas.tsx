import React, { useEffect, useRef } from 'react';

export const PurpleWhaleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Starlight trail particles left by the whale
    const trailParticles: Array<{
      x: number;
      y: number;
      alpha: number;
      size: number;
      color: string;
    }> = [];

    // Whale position parameters (gliding smoothly along an infinity curve)
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      time += 0.004;

      // Whale gliding trajectory across the viewport
      const centerX = width * 0.5 + Math.sin(time) * (width * 0.35);
      const centerY = height * 0.45 + Math.cos(time * 1.5) * (height * 0.18);
      const heading = Math.atan2(
        -Math.sin(time * 1.5) * (height * 0.18) * 1.5,
        Math.cos(time) * (width * 0.35)
      );

      // Spawn stardust from whale flukes
      if (Math.random() < 0.6) {
        trailParticles.push({
          x: centerX - Math.cos(heading) * 60 + (Math.random() - 0.5) * 20,
          y: centerY - Math.sin(heading) * 60 + (Math.random() - 0.5) * 20,
          alpha: 0.8,
          size: Math.random() * 2.5 + 1,
          color: Math.random() > 0.5 ? '#f0abfc' : '#c084fc',
        });
      }

      // Draw stardust trail
      for (let i = trailParticles.length - 1; i >= 0; i--) {
        const p = trailParticles[i];
        p.alpha -= 0.008;
        p.y += 0.15;

        if (p.alpha <= 0) {
          trailParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw Ethereal Cosmic Whale Silhouette
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(heading);

      const scale = width < 640 ? 0.75 : 1.1;
      ctx.scale(scale, scale);

      // Bioluminescent Body Gradient
      const bodyGrad = ctx.createLinearGradient(-70, 0, 70, 0);
      bodyGrad.addColorStop(0, 'rgba(139, 92, 246, 0.2)');
      bodyGrad.addColorStop(0.5, 'rgba(192, 132, 252, 0.6)');
      bodyGrad.addColorStop(0.8, 'rgba(240, 171, 252, 0.7)');
      bodyGrad.addColorStop(1, 'rgba(255, 255, 255, 0.8)');

      ctx.fillStyle = bodyGrad;
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 18;

      // Whale Body Path (Smooth organic contour)
      ctx.beginPath();
      // Head
      ctx.moveTo(65, 0);
      // Top spine to tail
      ctx.bezierCurveTo(45, -18, 0, -22, -45, -8);
      ctx.bezierCurveTo(-55, -5, -62, -2, -72, -12); // Upper fluke
      ctx.lineTo(-68, 0); // Fluke notch
      ctx.lineTo(-72, 12); // Lower fluke
      ctx.bezierCurveTo(-62, 2, -55, 5, -45, 8); // Tail bottom
      // Belly
      ctx.bezierCurveTo(-10, 26, 35, 22, 65, 0);
      ctx.closePath();
      ctx.fill();

      // Pectoral Fin (Glowing feather wing)
      ctx.beginPath();
      ctx.moveTo(15, 6);
      ctx.bezierCurveTo(0, 28, -25, 36, -30, 28);
      ctx.bezierCurveTo(-22, 18, -5, 10, 15, 6);
      ctx.fillStyle = 'rgba(216, 180, 254, 0.45)';
      ctx.fill();

      // Star cluster constellations inside whale body
      const constellationStars = [
        { x: 45, y: -4 },
        { x: 30, y: -8 },
        { x: 10, y: -6 },
        { x: -10, y: 0 },
        { x: -30, y: 2 },
        { x: -50, y: 0 },
      ];

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      constellationStars.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();

      // Star points
      constellationStars.forEach((pt) => {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full opacity-70"
    />
  );
};
