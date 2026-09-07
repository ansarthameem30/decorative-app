'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { GameStar } from '../../types/proposal';
import { audioEngine } from '../../services/audioEngine';

interface StarlightMiniGameProps {
  stars: GameStar[];
  onComplete: () => void;
}

export const StarlightMiniGame: React.FC<StarlightMiniGameProps> = ({ stars, onComplete }) => {
  const [collectedStarIds, setCollectedStarIds] = useState<number[]>([]);
  const [activeStar, setActiveStar] = useState<GameStar | null>(null);
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);

  const handleStarTap = (star: GameStar) => {
    if (!collectedStarIds.includes(star.id)) {
      const updated = [...collectedStarIds, star.id];
      setCollectedStarIds(updated);
      audioEngine.playStarGlimmer();

      if (updated.length === stars.length) {
        audioEngine.swellClimax();
        onComplete();
        // Trigger celebratory stardust burst
        setTimeout(() => {
          confetti({
            particleCount: 45,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f0abfc', '#c084fc', '#ffffff', '#fbcfe8'],
          });
          setShowSurpriseModal(true);
        }, 500);
      }
    }
    setActiveStar(star);
  };

  // Coordinated so ALL stars stay between y: 18% and y: 58% - ZERO OVERLAP with bottom note card
  const starCoords = [
    { x: 18, y: 20 },
    { x: 82, y: 18 },
    { x: 50, y: 28 },
    { x: 22, y: 45 },
    { x: 78, y: 43 },
    { x: 36, y: 58 },
    { x: 64, y: 58 },
  ];

  const isAllCollected = collectedStarIds.length === stars.length;

  return (
    <section className="relative w-full py-16 sm:py-28 px-4 sm:px-8 select-none z-20 overflow-hidden">
      {/* Background Ambient Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[580px] h-[380px] sm:h-[580px] rounded-full bg-purple-900/15 blur-[130px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-10 sm:mb-16 px-2">
        <span className="font-heading text-xs tracking-widest text-purple-300 uppercase block mb-1.5 font-medium">
          Chapter 03 · The Celestial Map
        </span>
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-normal text-purple-50 text-glow">
          Gather the Seven Stars of Us
        </h2>
        <p className="font-sans text-xs sm:text-sm text-purple-200/70 mt-2 font-normal">
          Touch each floating star to illuminate our constellation ({collectedStarIds.length} of {stars.length} gathered).
        </p>
      </div>

      {/* Interactive Celestial Dome - Height increased to ensure generous touch space */}
      <div className="relative w-full max-w-2xl h-[440px] sm:h-[490px] mx-auto rounded-3xl border border-purple-500/25 bg-gradient-to-b from-[#130526]/80 via-[#0a0215]/90 to-[#06010d]/95 backdrop-blur-2xl overflow-hidden p-5 flex flex-col justify-between shadow-2xl">
        {/* Arena Top Bar */}
        <div className="z-20 flex items-center justify-between w-full px-2">
          <span className="font-heading text-xs text-purple-200 font-medium tracking-wide">
            {isAllCollected ? "Constellation Fully United" : "Mikrokosmos Alignment"}
          </span>

          <div className="flex items-center gap-2">
            <div className="w-24 sm:w-36 h-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-400 to-pink-300"
                initial={{ width: 0 }}
                animate={{ width: `${(collectedStarIds.length / stars.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="font-heading text-[11px] text-pink-300 font-semibold">
              {collectedStarIds.length}/{stars.length}
            </span>
          </div>
        </div>

        {/* Dynamic Luminous Constellation Lines SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {collectedStarIds.map((id, index) => {
            if (index === 0) return null;
            const prevId = collectedStarIds[index - 1];
            const prevCoord = starCoords[(prevId - 1) % starCoords.length];
            const currCoord = starCoords[(id - 1) % starCoords.length];
            return (
              <line
                key={`${prevId}-${id}`}
                x1={`${prevCoord.x}%`}
                y1={`${prevCoord.y}%`}
                x2={`${currCoord.x}%`}
                y2={`${currCoord.y}%`}
                stroke={isAllCollected ? '#fbcfe8' : '#c084fc'}
                strokeWidth={isAllCollected ? '2' : '1.2'}
                strokeDasharray={isAllCollected ? 'none' : '4 3'}
                strokeOpacity="0.75"
                className="transition-all duration-500"
              />
            );
          })}
        </svg>

        {/* Floating Stars Interactive Layer - Positioned above lines, below modal */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {stars.map((star, idx) => {
            const coord = starCoords[idx % starCoords.length];
            const isCollected = collectedStarIds.includes(star.id);

            return (
              <div
                key={star.id}
                style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer p-4 touch-manipulation z-20"
                onClick={() => handleStarTap(star)}
              >
                <motion.div
                  animate={{
                    y: [-4, 4, -4],
                    scale: isCollected ? [1, 1.08, 1] : [1, 1.04, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.8 + (idx % 3),
                    ease: 'easeInOut',
                  }}
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative flex items-center justify-center min-w-[48px] min-h-[48px]"
                >
                  {/* Concentric Starlight Aura */}
                  {isCollected && (
                    <div className="absolute w-12 h-12 rounded-full bg-pink-400/20 animate-ping pointer-events-none" />
                  )}

                  {/* Celestial Starlight Point */}
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full transition-all duration-300 flex items-center justify-center border shadow-lg ${
                      isCollected
                        ? 'bg-gradient-to-tr from-purple-600 via-pink-600 to-pink-400 border-pink-200 shadow-[0_0_20px_rgba(240,171,252,0.9)]'
                        : 'bg-[#15042a]/90 border-purple-400/40 hover:border-pink-300 hover:bg-purple-900/50'
                    }`}
                  >
                    <span
                      className={`font-heading text-xs sm:text-sm font-semibold ${
                        isCollected ? 'text-white' : 'text-purple-300'
                      }`}
                    >
                      {star.id}
                    </span>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Bottom Dedicated Note Card Area - Completely separated from stars area */}
        <div className="z-30 w-full min-h-[95px] flex items-center justify-center text-center px-2 pointer-events-auto mt-auto">
          <AnimatePresence mode="wait">
            {activeStar ? (
              <motion.div
                key={activeStar.id}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-md p-4 rounded-2xl bg-[#17052e]/95 border border-purple-400/40 backdrop-blur-2xl shadow-2xl"
              >
                <span className="font-heading text-xs tracking-wider text-pink-300 uppercase block mb-1 font-semibold">
                  Star {activeStar.id} · {activeStar.title}
                </span>
                <p className="font-display text-sm sm:text-base text-purple-100 italic leading-snug">
                  "{activeStar.note}"
                </p>
              </motion.div>
            ) : isAllCollected ? (
              <motion.button
                onClick={() => setShowSurpriseModal(true)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-800 via-pink-600 to-purple-800 border border-pink-400/60 text-white font-heading text-xs font-semibold tracking-wide uppercase shadow-[0_0_25px_rgba(240,171,252,0.4)] active:scale-95 transition-all"
              >
                Open Our Galaxy Secret
              </motion.button>
            ) : (
              <span className="font-heading text-xs tracking-wide text-purple-300/80 font-normal">
                Touch any star in the dome to illuminate our promise for tomorrow
              </span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Surprise Constellation Revelation Modal */}
      <AnimatePresence>
        {showSurpriseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#220738] via-[#120422] to-[#080112] border border-pink-400/50 shadow-[0_0_60px_rgba(240,171,252,0.4)] text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-purple-400 mx-auto flex items-center justify-center shadow-[0_0_20px_#f472b6]">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
                </svg>
              </div>

              <span className="font-heading text-xs tracking-widest text-pink-300 uppercase font-semibold block">
                The Constellation of Us Awakened
              </span>

              <h3 className="font-display text-2xl sm:text-3xl font-normal text-white text-glow">
                Our Seven Stars are Aligned
              </h3>

              <div className="p-4 rounded-2xl bg-[#17052a]/80 border border-purple-500/30 text-left space-y-2">
                <p className="font-display text-base sm:text-lg text-purple-100 italic leading-relaxed">
                  "In a universe of seven billion souls, gravity is drawing our paths into one. Every star you just touched is a lifelong promise I dedicate to you—to protect your happiness, to hold your hand through every winter, and to choose you as our tomorrow unfolds."
                </p>
                <span className="font-heading text-xs text-pink-300/90 font-medium block pt-1">
                  — Forever Borahae
                </span>
              </div>

              <button
                onClick={() => setShowSurpriseModal(false)}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-purple-700 via-pink-600 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white font-heading text-xs font-semibold uppercase tracking-wider shadow-lg active:scale-95 transition-all"
              >
                Seal Our Constellation & Journey Onward
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
