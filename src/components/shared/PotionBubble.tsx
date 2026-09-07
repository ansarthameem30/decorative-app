import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { InsideJoke } from '../../types';
import { audioEngine } from '../../services/audioEngine';

interface PotionBubbleProps {
  joke: InsideJoke;
  isPopped: boolean;
  onPop: () => void;
  index: number;
}

export const PotionBubble: React.FC<PotionBubbleProps> = ({ joke, isPopped, onPop, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePop = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPopped) {
      onPop();
    }
    setIsOpen(true);
    audioEngine.playBubblePop();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 20,
      spread: 45,
      origin: { x, y },
      colors: ['#c084fc', '#a78bfa', '#e9d5ff', '#8b5cf6'],
      disableForReducedMotion: true,
      gravity: 0.7,
      ticks: 120,
      shapes: ['circle'],
    });
  };

  const floatDelay = index * 0.4;
  const floatDuration = 5 + (index % 3);

  return (
    <>
      <motion.div
        animate={{
          y: [-5, 5, -5],
          x: [-2, 2, -2],
        }}
        transition={{
          repeat: Infinity,
          duration: floatDuration,
          delay: floatDelay,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={handlePop}
        className="relative cursor-pointer select-none m-2 sm:m-4"
      >
        {/* Luminous Celestial Orb - Scaled for thumb ergonomics */}
        <div
          className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full relative flex flex-col items-center justify-center p-3 sm:p-4 text-center transition-all duration-700 ${
            isPopped
              ? 'bg-[#10061e]/50 border border-purple-500/20 opacity-60'
              : 'bg-gradient-to-tr from-purple-950/70 via-purple-800/30 to-purple-400/20 border border-purple-400/40 shadow-[0_0_25px_rgba(192,132,252,0.25)] backdrop-blur-md active:border-purple-300'
          }`}
        >
          {!isPopped && (
            <div className="absolute top-2.5 left-3.5 w-3.5 h-1.5 rounded-full bg-white/30 rotate-[-40deg] blur-[0.5px]" />
          )}

          <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.2em] text-purple-300/80 uppercase mb-1">
            Echo {index + 1}
          </span>
          <span className="font-display font-medium text-xs sm:text-sm text-purple-100 line-clamp-2 px-1">
            {joke.teaser}
          </span>

          <span className="text-[8px] sm:text-[9px] font-cinzel tracking-widest text-purple-400/60 mt-1.5 uppercase">
            {isPopped ? 'Unveiled' : 'Touch to Open'}
          </span>
        </div>
      </motion.div>

      {/* Intimate Joke Reveal Modal (Mobile Bottom Sheet + Desktop Centered) */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/85 backdrop-blur-xl"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full sm:max-w-md mobile-bottom-sheet sm:rounded-3xl p-6 sm:p-9 shadow-2xl text-center border-t sm:border border-purple-400/30 max-h-[90dvh] overflow-y-auto"
            >
              <div className="sm:hidden w-12 h-1 bg-purple-400/30 rounded-full mx-auto mb-5" />

              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 text-purple-400/60 hover:text-white transition-colors text-sm font-sans focus:outline-none"
              >
                ✕
              </button>

              <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-purple-400/80">
                Shared Cadence · Echo {index + 1}
              </span>

              <h4 className="font-display text-2xl sm:text-3xl text-purple-100 font-semibold mt-2 mb-4">
                {joke.teaser}
              </h4>

              <div className="my-4 sm:my-5 p-4 sm:p-5 rounded-2xl bg-purple-950/40 border border-purple-500/20 text-left">
                <p className="font-display text-base sm:text-lg text-purple-200 leading-relaxed italic">
                  "{joke.punchline}"
                </p>
              </div>

              {joke.reaction && (
                <p className="font-sans text-xs text-purple-300/80 leading-relaxed mt-2 font-light">
                  {joke.reaction}
                </p>
              )}

              <button
                onClick={() => setIsOpen(false)}
                className="mt-6 font-cinzel text-[10px] sm:text-xs tracking-[0.2em] uppercase px-6 py-2.5 rounded-full border border-purple-400/30 text-purple-200 hover:text-white bg-purple-900/40 transition-colors"
              >
                Cherish Memory
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
