'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CelestialLoaderProps {
  isLoading: boolean;
  onFinish?: () => void;
}

const CELESTIAL_WHISPERS = [
  "Aligning the seven lights of Mikrokosmos...",
  "Gathering the starlit memories of us...",
  "Tuning our frequency across the universe...",
  "Inscribing our forever beneath purple skies...",
  "Our universe is ready for you..."
];

export const CelestialLoader: React.FC<CelestialLoaderProps> = ({ isLoading, onFinish }) => {
  const [whisperIndex, setWhisperIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWhisperIndex(prev => (prev + 1) % CELESTIAL_WHISPERS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {isLoading && (
        <motion.div
          key="celestial-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05010a] text-center select-none overflow-hidden"
        >
          {/* Volumetric Amethyst Bloom */}
          <div className="absolute w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-gradient-to-tr from-purple-900/30 via-pink-600/20 to-purple-400/10 blur-[120px] pointer-events-none" />

          {/* Adorable Orbital Starlight Assembly */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center mb-8">
            {/* Outer Orbit Ring with Rotating Star */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-purple-500/20"
            >
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-pink-300 shadow-[0_0_12px_#f472b6]" />
            </motion.div>

            {/* Middle Counter-Rotating Ring with Orbiting Star */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              className="absolute inset-4 rounded-full border border-dashed border-pink-400/30"
            >
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-purple-300 shadow-[0_0_10px_#c084fc]" />
            </motion.div>

            {/* Inner Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
              className="absolute inset-8 rounded-full border border-purple-400/25"
            >
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
            </motion.div>

            {/* Pulsing Core: Adorable Luminous Amethyst Heart / Star */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                boxShadow: [
                  '0 0 25px rgba(240, 171, 252, 0.5)',
                  '0 0 50px rgba(192, 132, 252, 0.8)',
                  '0 0 25px rgba(240, 171, 252, 0.5)',
                ],
              }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-purple-700 via-pink-500 to-purple-400 flex items-center justify-center border border-pink-200 shadow-2xl relative"
            >
              {/* Internal Crystal Gleam */}
              <div className="w-4 h-4 rounded-full bg-white/80 blur-[1px]" />
            </motion.div>

            {/* Seven Micro Starlight Orbiters (BTS Borahae 7 Lights) */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const angle = (i / 7) * Math.PI * 2;
              const radius = 70;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <motion.div
                  key={i}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.3, 0.8],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.4,
                    delay: i * 0.3,
                    ease: 'easeInOut',
                  }}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                  className="absolute w-1.5 h-1.5 rounded-full bg-pink-300 shadow-[0_0_6px_#f472b6]"
                />
              );
            })}
          </div>

          {/* Editorial Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-2 px-4"
          >
            <span className="font-heading text-xs tracking-widest text-pink-300 uppercase font-semibold block">
              보라해 · Borahae
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-normal text-purple-50 tracking-wide text-glow">
              Our Mikrokosmos
            </h2>
          </motion.div>

          {/* Cycling Poetic Whisper */}
          <div className="h-8 mt-4 flex items-center justify-center px-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={whisperIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
                className="font-sans text-xs sm:text-sm text-purple-200/80 italic font-normal"
              >
                {CELESTIAL_WHISPERS[whisperIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Delicate Shimmer Progress Bar */}
          <div className="w-36 h-1 rounded-full bg-purple-950/80 border border-purple-500/30 overflow-hidden mt-6">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="w-full h-full bg-gradient-to-r from-transparent via-pink-400 to-transparent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
