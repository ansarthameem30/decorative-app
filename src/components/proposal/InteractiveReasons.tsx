'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProposalReason } from '../../types/proposal';
import { audioEngine } from '../../services/audioEngine';

interface InteractiveReasonsProps {
  reasons: ProposalReason[];
}

export const InteractiveReasons: React.FC<InteractiveReasonsProps> = ({ reasons }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex(prev => (prev < reasons.length - 1 ? prev + 1 : 0));
    audioEngine.playStarGlimmer();
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : reasons.length - 1));
    audioEngine.playStarGlimmer();
  };

  const currentReason = reasons[currentIndex];

  return (
    <section className="relative w-full py-16 sm:py-28 px-4 sm:px-8 select-none z-20 overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[560px] h-[380px] sm:h-[560px] rounded-full bg-purple-900/15 blur-[130px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14 px-2">
        <span className="font-heading text-xs tracking-widest text-purple-300 uppercase block mb-1.5 font-medium">
          Chapter 05 · Inscribed in My Heart
        </span>
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-normal text-purple-50 text-glow">
          Why It Has Always Been You
        </h2>
        <p className="font-sans text-xs sm:text-sm text-purple-200/70 mt-2 font-normal">
          Swipe or tap through the reasons that made my soul choose yours.
        </p>
      </div>

      {/* Interactive One-by-One Card Showcase */}
      <div className="relative max-w-xl mx-auto flex flex-col items-center">
        {/* Heart Progression Indicator Bar */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6">
          {reasons.map((r, idx) => {
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  audioEngine.playStarGlimmer();
                }}
                className={`transition-all duration-300 flex items-center justify-center ${
                  isCurrent
                    ? 'scale-125'
                    : 'hover:scale-110 opacity-70'
                }`}
                title={`Reason ${idx + 1}`}
              >
                <svg
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${
                    isCompleted
                      ? 'text-pink-400 drop-shadow-[0_0_8px_#f472b6]'
                      : 'text-purple-950 stroke-purple-600/40'
                  }`}
                  fill={isCompleted ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            );
          })}
        </div>

        {/* Swipeable Reason Card */}
        <div className="w-full min-h-[360px] sm:min-h-[380px] relative overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentReason.id}
              initial={{ opacity: 0, x: 40, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                if (info.offset.x < -40) handleNext();
                else if (info.offset.x > 40) handlePrev();
              }}
              className="w-full obsidian-card rounded-3xl p-7 sm:p-9 border border-purple-400/30 shadow-2xl flex flex-col justify-between cursor-grab active:cursor-grabbing backdrop-blur-2xl text-center relative"
            >
              {/* Card Meta Badge */}
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-3 mb-4">
                <span className="font-heading text-xs tracking-wider uppercase text-pink-300 font-semibold">
                  Reason 0{currentReason.number}
                </span>
                <span className="font-heading text-xs text-purple-300/80 font-medium">
                  {currentIndex + 1} of {reasons.length}
                </span>
              </div>

              {/* Central Romantic Narrative */}
              <div className="my-auto space-y-4 py-2">
                <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-purple-50 font-normal leading-tight text-glow">
                  {currentReason.short}
                </h3>

                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto my-2" />

                <p className="font-display text-base sm:text-xl text-purple-100 italic leading-relaxed font-light px-2">
                  "{currentReason.detail}"
                </p>
              </div>

              {/* Bottom Subtle Swipe Hint */}
              <div className="pt-4 border-t border-purple-500/15 flex items-center justify-center">
                <span className="font-heading text-[11px] text-purple-400/80 font-medium">
                  Swipe or tap next for more reasons
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Prev / Next Action Controls */}
        <div className="flex items-center justify-between w-full mt-5 px-2">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1.5 font-heading text-xs font-medium tracking-wide px-5 py-2.5 rounded-full border border-purple-500/25 bg-[#140626]/80 text-purple-200 hover:text-white transition-all active:scale-95 shadow-md touch-manipulation"
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 font-heading text-xs font-semibold tracking-wide px-6 py-2.5 rounded-full border border-purple-400/40 bg-gradient-to-r from-purple-800 to-pink-600 text-white hover:from-purple-700 hover:to-pink-500 transition-all active:scale-95 shadow-xl touch-manipulation"
          >
            Next Reason
          </button>
        </div>
      </div>
    </section>
  );
};
