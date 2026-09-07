import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../../context/JourneyContext';
import { contentConfig } from '../../config/content';
import { audioEngine } from '../../services/audioEngine';

interface Point {
  x: number;
  y: number;
}

export const Section1IncantationGate: React.FC = () => {
  const { unlockEntry } = useJourney();
  const [typedName, setTypedName] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isShattering, setIsShattering] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shatterCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const fullName = `FOR ${contentConfig.herName.toUpperCase()}`;
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < fullName.length) {
        setTypedName(fullName.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
        setTypingComplete(true);
      }
    }, 75);

    return () => clearInterval(interval);
  }, []);

  const triggerShatter = () => {
    setIsShattering(true);
    audioEngine.playChime("C6");

    const canvas = shatterCanvasRef.current;
    if (!canvas) {
      setTimeout(() => unlockEntry(), 900);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setTimeout(() => unlockEntry(), 900);
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Shard {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      angle: number;
      vAngle: number;
      color: string;
      alpha: number;
    }

    const shards: Shard[] = [];
    const colors = ['#a78bfa', '#c084fc', '#e9d5ff', '#ffffff', '#8b5cf6'];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < 110; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      shards.push({
        x: centerX + (Math.random() - 0.5) * 80,
        y: centerY + (Math.random() - 0.5) * 80,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 8 + 3,
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() - 0.5) * 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
      });
    }

    const startTime = performance.now();
    const duration = 900;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const shard of shards) {
        shard.x += shard.vx;
        shard.y += shard.vy;
        shard.angle += shard.vAngle;
        shard.alpha = Math.max(0, 1 - elapsed / duration);

        ctx.save();
        ctx.translate(shard.x, shard.y);
        ctx.rotate(shard.angle);
        ctx.globalAlpha = shard.alpha;
        ctx.fillStyle = shard.color;
        ctx.shadowColor = shard.color;
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.moveTo(0, -shard.size * 1.5);
        ctx.lineTo(shard.size * 0.4, 0);
        ctx.lineTo(0, shard.size * 1.5);
        ctx.lineTo(-shard.size * 0.4, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      if (elapsed < duration) {
        requestAnimationFrame(animate);
      } else {
        unlockEntry();
      }
    };

    requestAnimationFrame(animate);
  };

  const handleStartDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (isShattering) return;
    setIsDrawing(true);
    setFeedbackMsg('');
    const pos = getPoint(e);
    setDrawingPoints([pos]);
  };

  const handleDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isShattering) return;
    const pos = getPoint(e);
    setDrawingPoints(prev => [...prev, pos]);
    drawTrail();
  };

  const handleEndDraw = () => {
    if (!isDrawing || isShattering) return;
    setIsDrawing(false);

    if (drawingPoints.length < 12) {
      setAttempts(prev => prev + 1);
      setFeedbackMsg('Draw a slightly larger heart on the starlight');
      clearCanvas();
      return;
    }

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    drawingPoints.forEach(p => {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    });

    const width = maxX - minX;
    const height = maxY - minY;
    const aspectRatio = width / (height || 1);

    const isValidSize = width > 35 && height > 35;
    const isValidProportion = aspectRatio > 0.3 && aspectRatio < 3.0;

    if (isValidSize && isValidProportion) {
      triggerShatter();
    } else {
      setAttempts(prev => prev + 1);
      setFeedbackMsg('Almost aligned... inscribe once more');
      clearCanvas();
    }
  };

  const getPoint = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    const mouseEvent = e as React.MouseEvent;
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top,
    };
  };

  const drawTrail = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx || drawingPoints.length < 2) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = '#8b5cf6';
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.moveTo(drawingPoints[0].x, drawingPoints[0].y);
    for (let i = 1; i < drawingPoints.length; i++) {
      ctx.lineTo(drawingPoints[i].x, drawingPoints[i].y);
    }
    ctx.stroke();
  };

  const clearCanvas = () => {
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      setDrawingPoints([]);
    }, 300);
  };

  return (
    <section className="relative w-full h-screen-dvh flex flex-col items-center justify-center bg-[#06020e] overflow-hidden select-none px-4 py-6">
      {/* Astrolabe Celestial Compass Rings */}
      <div className="relative z-10 mb-4 sm:mb-6 pointer-events-none flex items-center justify-center scale-90 sm:scale-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
          className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-purple-500/20 flex items-center justify-center"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-dashed border-purple-400/30" />
        </motion.div>

        {/* Center Pulsing Core */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="absolute w-3 h-3 rounded-full bg-white shadow-[0_0_25px_#c084fc]"
        />
      </div>

      {/* Her Name in Editorial Luxury Serif */}
      <div className="z-10 text-center mb-5 sm:mb-7 max-w-lg px-2">
        <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.35em] uppercase text-purple-400/70 mb-2 block">
          A Celestial Inscription
        </span>

        <h1 className="font-cinzel text-2xl sm:text-4xl md:text-6xl font-normal tracking-[0.12em] text-[#f8f6fc] text-glow leading-tight">
          {typedName}
          {!typingComplete && (
            <span className="inline-block w-[1px] h-6 sm:h-8 ml-1 bg-purple-400 animate-pulse align-middle" />
          )}
        </h1>

        <AnimatePresence>
          {typingComplete && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-display text-base sm:text-xl text-purple-200/80 italic tracking-wider mt-3"
            >
              Draw a heart upon the starlight to awaken our archive
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Celestial Canvas Frame - Ergonomic Mobile Size */}
      {typingComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-20 w-[260px] h-[260px] sm:w-72 sm:h-72 rounded-3xl border border-purple-500/25 bg-[#120724]/45 backdrop-blur-md shadow-[0_0_40px_rgba(6,2,14,0.9)] flex items-center justify-center touch-none cursor-crosshair group"
        >
          <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t border-l border-purple-400/40 pointer-events-none" />
          <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t border-r border-purple-400/40 pointer-events-none" />
          <div className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 border-b border-l border-purple-400/40 pointer-events-none" />
          <div className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b border-r border-purple-400/40 pointer-events-none" />

          <canvas
            ref={canvasRef}
            width={288}
            height={288}
            onMouseDown={handleStartDraw}
            onMouseMove={handleDraw}
            onMouseUp={handleEndDraw}
            onTouchStart={handleStartDraw}
            onTouchMove={handleDraw}
            onTouchEnd={handleEndDraw}
            className="w-full h-full rounded-3xl"
          />

          {drawingPoints.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-30 group-hover:opacity-50 transition-opacity">
              <svg viewBox="0 0 100 100" className="w-14 h-14 sm:w-16 sm:h-16 stroke-purple-400 fill-none stroke-[0.8] stroke-dasharray-[3,3]">
                <path d="M 50 35 C 40 20, 20 25, 20 45 C 20 65, 50 82, 50 82 C 50 82, 80 65, 80 45 C 80 25, 60 20, 50 35 Z" />
              </svg>
              <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.25em] text-purple-300 uppercase mt-2.5">
                Trace with your finger
              </span>
            </div>
          )}
        </motion.div>
      )}

      {feedbackMsg && (
        <p className="z-10 mt-2.5 font-cinzel text-[9px] sm:text-[10px] tracking-[0.2em] text-purple-300/80 uppercase">
          {feedbackMsg}
        </p>
      )}

      {/* Failsafe Button */}
      {(attempts >= 2 || typingComplete) && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={triggerShatter}
          className="z-20 mt-4 sm:mt-6 font-cinzel text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-purple-400/80 hover:text-purple-200 transition-colors py-2 px-5 rounded-full border border-purple-500/20 hover:border-purple-400/40 bg-[#120724]/70 backdrop-blur-md"
        >
          Or Tap to Awaken the Stars ✦
        </motion.button>
      )}

      {isShattering && (
        <canvas
          ref={shatterCanvasRef}
          className="fixed inset-0 z-50 pointer-events-none w-full h-full"
        />
      )}
    </section>
  );
};
