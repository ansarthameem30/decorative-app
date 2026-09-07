import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { contentConfig } from '../../config/content';
import { useJourney } from '../../context/JourneyContext';
import { audioEngine } from '../../services/audioEngine';

export const Section9FinalEnchantment: React.FC = () => {
  const { setFinalMessageSeen } = useJourney();
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [showPeakLine, setShowPeakLine] = useState(false);
  const [showClosingVow, setShowClosingVow] = useState(false);

  const vortexCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const lines = contentConfig.finalClimax.lines;

  // Swirling Cosmic Vortex Canvas
  useEffect(() => {
    const canvas = vortexCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 65 : 150;

    interface VortexParticle {
      radius: number;
      angle: number;
      speed: number;
      radialSpeed: number;
      size: number;
      color: string;
      alpha: number;
    }

    const particles: VortexParticle[] = [];
    const colors = ['#8b5cf6', '#c084fc', '#f0abfc', '#e9d5ff', '#ffffff'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        radius: Math.random() * (Math.max(canvas.width, canvas.height) * 0.65) + 20,
        angle: Math.random() * Math.PI * 2,
        speed: (Math.random() * 0.012 + 0.006) * (Math.random() > 0.5 ? 1 : -1),
        radialSpeed: Math.random() * 0.35 + 0.1,
        size: Math.random() * 2.5 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.3,
      });
    }

    let render = () => {
      ctx.fillStyle = 'rgba(6, 2, 14, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let p of particles) {
        p.angle += p.speed;
        p.radius -= p.radialSpeed;
        if (p.radius < 15) {
          p.radius = Math.max(canvas.width, canvas.height) * 0.65;
        }

        const x = centerX + Math.cos(p.angle) * p.radius;
        const y = centerY + Math.sin(p.angle) * p.radius;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Heartbeat sub-bass pulse
  useEffect(() => {
    const heartbeatInterval = setInterval(() => {
      audioEngine.playHeartbeat();
    }, 1200);

    return () => clearInterval(heartbeatInterval);
  }, []);

  // Cinematic line-by-line reveal
  useEffect(() => {
    if (currentLineIdx < lines.length) {
      const timer = setTimeout(() => {
        setCurrentLineIdx(prev => prev + 1);
      }, 3600);
      return () => clearTimeout(timer);
    } else if (!showPeakLine) {
      const peakTimer = setTimeout(() => {
        setShowPeakLine(true);
        audioEngine.swellClimax();
        setFinalMessageSeen();

        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f0abfc', '#8b5cf6', '#c084fc', '#ffffff'],
        });
      }, 3200);
      return () => clearTimeout(peakTimer);
    } else if (!showClosingVow) {
      const vowTimer = setTimeout(() => {
        setShowClosingVow(true);
      }, 4200);
      return () => clearTimeout(vowTimer);
    }
  }, [currentLineIdx, showPeakLine, showClosingVow, lines.length, setFinalMessageSeen]);

  return (
    <section className="relative w-full min-h-screen-dvh py-20 sm:py-28 px-4 sm:px-14 flex flex-col items-center justify-center select-none overflow-hidden text-center">
      {/* Background Vortex Canvas */}
      <canvas
        ref={vortexCanvasRef}
        className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      />

      {/* Heartbeat Pulsing Sub-Atmosphere */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1, 1.08, 1],
          opacity: [0.35, 0.75, 0.35, 0.65, 0.35],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: 'easeInOut',
        }}
        className="absolute z-10 pointer-events-none w-72 h-72 sm:w-96 sm:h-96 md:w-[480px] md:h-[480px] rounded-full bg-gradient-to-tr from-purple-800/20 via-pink-600/15 to-purple-400/10 blur-3xl"
      />

      {/* Header Tag */}
      <div className="z-20 mb-6 sm:mb-8">
        <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.35em] uppercase text-pink-300/80 px-3.5 py-1.5 rounded-full bg-[#120724]/80 border border-pink-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(240,171,252,0.2)]">
          Chapter VIII · The Final Enchantment
        </span>
      </div>

      {/* Cinematic Materializing Lines - Fluid Mobile Typography */}
      <div className="relative z-20 max-w-3xl flex flex-col items-center gap-5 sm:gap-7 px-3 min-h-[280px] sm:min-h-[320px]">
        {lines.slice(0, currentLineIdx).map((line, idx) => (
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
            animate={{ opacity: 0.9, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2 }}
            className="font-display text-lg sm:text-2xl md:text-3xl text-purple-200 tracking-wide leading-relaxed font-light"
          >
            {line}
          </motion.p>
        ))}

        {/* Peak Line (accent-blush) */}
        <AnimatePresence>
          {showPeakLine && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
              className="my-4 sm:my-6 p-6 sm:p-10 rounded-3xl bg-[#140624]/85 border border-pink-400/40 shadow-[0_0_60px_rgba(240,171,252,0.35)] backdrop-blur-xl max-w-full"
            >
              <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-[#f0abfc] text-glow-blush leading-tight">
                "{contentConfig.finalClimax.peakLine}"
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Closing Vow */}
        <AnimatePresence>
          {showClosingVow && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5 }}
              className="font-cinzel text-[10px] sm:text-xs md:text-sm text-purple-200/90 tracking-[0.25em] sm:tracking-[0.3em] uppercase mt-3 sm:mt-4 px-2"
            >
              ✦ {contentConfig.finalClimax.closingVow} ✦
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
