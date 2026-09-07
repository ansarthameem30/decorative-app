'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { audioEngine } from '@/services/audioEngine';

interface RibbonCuttingEntranceProps {
  herName: string;
  onCutComplete: () => void;
}

export const RibbonCuttingEntrance: React.FC<RibbonCuttingEntranceProps> = ({
  herName,
  onCutComplete,
}) => {
  const [isCutting, setIsCutting] = useState(false);
  const [hasCut, setHasCut] = useState(false);

  const handleCutRibbon = async () => {
    if (isCutting || hasCut) return;
    setIsCutting(true);

    // Audio chime & ballad start
    audioEngine.playStarGlimmer();
    try {
      await audioEngine.startAudio();
    } catch (e) {
      console.log('Audio autoplay handled', e);
    }

    // Confetti burst from center ribbon seam
    const count = 75;
    const defaults = {
      origin: { y: 0.5, x: 0.5 },
      colors: ['#f0abfc', '#c084fc', '#e879f9', '#ffffff', '#ffd700', '#8b5cf6'],
    };

    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.6),
      spread: 90,
      startVelocity: 35,
    });
    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.4),
      spread: 120,
      startVelocity: 45,
    });

    // Sequence delay before opening gates
    setTimeout(() => {
      setHasCut(true);
      setTimeout(() => {
        onCutComplete();
      }, 900);
    }, 600);
  };

  return (
    <AnimatePresence>
      {!hasCut && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#080214] via-[#100326] to-[#05010a] select-none overflow-hidden px-4 py-8 sm:py-12 text-center"
        >
          {/* Volumetric Amethyst & Nebula Atmospheres */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-gradient-to-tr from-purple-800/30 via-pink-600/20 to-purple-400/10 blur-[130px]" />
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[300px] sm:w-[500px] h-[250px] rounded-full bg-gradient-to-t from-purple-900/25 to-transparent blur-[100px]" />
            
            {/* Ambient floating dust particles */}
            {[...Array(14)].map((_, i) => (
              <motion.div
                key={`dust-${i}`}
                animate={{
                  y: [-15, 15, -15],
                  x: [-8, 8, -8],
                  opacity: [0.2, 0.7, 0.2],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4 + (i % 4),
                  delay: i * 0.3,
                  ease: 'easeInOut',
                }}
                style={{
                  top: `${10 + (i * 6)}%`,
                  left: `${8 + (i * 7)}%`,
                }}
                className="absolute w-1 h-1 rounded-full bg-pink-300/60 shadow-[0_0_6px_#f472b6]"
              />
            ))}
          </div>

          {/* --- TOP TEASER & WELCOME --- */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-20 space-y-2 pt-2 sm:pt-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/70 border border-purple-400/30 text-pink-300 text-[11px] font-heading font-semibold uppercase tracking-widest shadow-md">
              <span className="animate-pulse text-xs">💜</span>
              <span>A Special Surprise For {herName || 'You'}</span>
              <span className="animate-pulse text-xs">💜</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-white text-glow-blush font-normal tracking-wide max-w-2xl mx-auto leading-tight pt-2">
              Are you ready to begin?
            </h1>

            <p className="font-heading text-xs sm:text-sm text-purple-200/80 font-light tracking-wide max-w-md mx-auto px-4">
              A journey of memories, starlight, and forever is waiting for you.
            </p>
          </motion.div>

          {/* --- HORIZONTAL ROYAL PURPLE SATIN RIBBON --- */}
          <div className="relative w-full my-auto flex items-center justify-center py-10">
            
            {/* Left Ribbon Wing */}
            <motion.div
              initial={{ scaleX: 1, x: 0 }}
              animate={isCutting ? {
                x: '-110%',
                rotate: -12,
                opacity: [1, 1, 0],
                transition: { duration: 0.7, ease: 'easeIn' },
              } : {
                x: 0,
                scaleX: [0.99, 1.01, 0.99],
              }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              style={{ transformOrigin: 'right center' }}
              className="absolute right-1/2 mr-10 sm:mr-14 w-[65vw] h-10 sm:h-12 bg-gradient-to-r from-transparent via-[#7e22ce] to-[#a855f7] border-y-2 border-yellow-300/70 shadow-[0_0_25px_rgba(168,85,247,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] flex items-center"
            >
              {/* Satin Gold Thread Trim */}
              <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#fde68a] to-[#fef08a] opacity-80" />
              {/* Shimmer traversal */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
            </motion.div>

            {/* Right Ribbon Wing */}
            <motion.div
              initial={{ scaleX: 1, x: 0 }}
              animate={isCutting ? {
                x: '110%',
                rotate: 12,
                opacity: [1, 1, 0],
                transition: { duration: 0.7, ease: 'easeIn' },
              } : {
                x: 0,
                scaleX: [0.99, 1.01, 0.99],
              }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              style={{ transformOrigin: 'left center' }}
              className="absolute left-1/2 ml-10 sm:ml-14 w-[65vw] h-10 sm:h-12 bg-gradient-to-r from-[#a855f7] via-[#7e22ce] to-transparent border-y-2 border-yellow-300/70 shadow-[0_0_25px_rgba(168,85,247,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] flex items-center"
            >
              {/* Satin Gold Thread Trim */}
              <div className="w-full h-[1.5px] bg-gradient-to-r from-[#fef08a] via-[#fde68a] to-transparent opacity-80" />
              {/* Shimmer traversal */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2.8, delay: 0.4, ease: 'easeInOut' }}
                className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
            </motion.div>

            {/* Center Royal Rosette Bow with Gold Crystal Seal */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={isCutting ? {
                scale: [1, 1.3, 0],
                rotate: [0, 45, 90],
                opacity: [1, 1, 0],
                transition: { duration: 0.6, ease: 'easeOut' },
              } : {
                scale: [1, 1.05, 1],
                opacity: 1,
              }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              onClick={handleCutRibbon}
              className="relative z-30 cursor-pointer group flex flex-col items-center justify-center p-3"
            >
              {/* Soft Pulsing Golden-Pink Aura */}
              <div className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-pink-500/40 via-purple-600/30 to-yellow-400/20 blur-xl group-hover:scale-125 transition-transform duration-500" />

              {/* Silk Bow Wings SVG */}
              <svg viewBox="0 0 160 120" className="w-28 h-20 sm:w-36 sm:h-24 drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] filter">
                <defs>
                  <linearGradient id="silkRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="50%" stopColor="#7e22ce" />
                    <stop offset="100%" stopColor="#4c1d95" />
                  </linearGradient>
                  <linearGradient id="goldEdge" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#ca8a04" />
                  </linearGradient>
                </defs>

                {/* Left Bow Loop */}
                <path
                  d="M 80,60 C 50,20 15,30 20,60 C 25,90 60,80 80,60 Z"
                  fill="url(#silkRibbon)"
                  stroke="url(#goldEdge)"
                  strokeWidth="2"
                />
                {/* Left Inner Fold */}
                <path d="M 45,45 C 35,55 45,70 65,62" fill="none" stroke="#f3e8ff" strokeWidth="1.5" opacity="0.6" />

                {/* Right Bow Loop */}
                <path
                  d="M 80,60 C 110,20 145,30 140,60 C 135,90 100,80 80,60 Z"
                  fill="url(#silkRibbon)"
                  stroke="url(#goldEdge)"
                  strokeWidth="2"
                />
                {/* Right Inner Fold */}
                <path d="M 115,45 C 125,55 115,70 95,62" fill="none" stroke="#f3e8ff" strokeWidth="1.5" opacity="0.6" />

                {/* Bow Tails Drooping Down */}
                <path
                  d="M 75,65 C 65,85 50,105 40,115 L 55,115 C 68,100 78,85 80,70 Z"
                  fill="url(#silkRibbon)"
                  stroke="url(#goldEdge)"
                  strokeWidth="1.5"
                />
                <path
                  d="M 85,65 C 95,85 110,105 120,115 L 105,115 C 92,100 82,85 80,70 Z"
                  fill="url(#silkRibbon)"
                  stroke="url(#goldEdge)"
                  strokeWidth="1.5"
                />

                {/* Center Knot Rosette Medallion */}
                <circle cx="80" cy="60" r="14" fill="url(#goldEdge)" stroke="#ffffff" strokeWidth="1" filter="drop-shadow(0 0 6px rgba(254,240,138,0.8))" />
                <circle cx="80" cy="60" r="10" fill="#6b21a8" />
                {/* Center Heart Icon */}
                <path
                  d="M 80,64 C 77,61 74,58 74,56 C 74,54 76,52 78,52 C 79.5,52 80,53 80,54 C 80,53 80.5,52 82,52 C 84,52 86,54 86,56 C 86,58 83,61 80,64 Z"
                  fill="#f472b6"
                />
              </svg>

              {/* Scissor Cue Tag */}
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                className="mt-1 text-[10px] font-heading font-semibold text-pink-200 tracking-wider uppercase bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-pink-400/40 shadow-sm"
              >
                ✦ Tap to cut
              </motion.span>
            </motion.div>
          </div>

          {/* --- BOTTOM INTERACTIVE CUT ACTION BUTTON --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative z-20 w-full max-w-sm mx-auto pb-2 sm:pb-4 space-y-3"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              disabled={isCutting}
              onClick={handleCutRibbon}
              className="w-full min-h-[54px] py-4 px-8 rounded-full bg-gradient-to-r from-purple-800 via-pink-600 to-purple-800 hover:from-purple-700 hover:to-pink-500 text-white font-heading text-xs sm:text-sm font-semibold uppercase tracking-widest shadow-[0_0_35px_rgba(240,171,252,0.5)] border border-pink-300/50 flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-95"
            >
              <span className="text-lg">✂️</span>
              <span>{isCutting ? 'Opening Universe...' : 'Cut The Ribbon & Enter'}</span>
              <span className="text-sm">✦</span>
            </motion.button>

            <p className="text-[11px] text-purple-300/60 font-heading tracking-wider uppercase">
              Sound will start softly upon opening
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
