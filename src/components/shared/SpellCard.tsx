import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MemoryCard } from '../../types';
import { audioEngine } from '../../services/audioEngine';

interface SpellCardProps {
  card: MemoryCard;
  isDiscovered: boolean;
  onOpen: () => void;
  index: number;
}

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI"];

export const SpellCard: React.FC<SpellCardProps> = ({ card, isDiscovered, onOpen, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCardClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      onOpen();
      audioEngine.playStarGlimmer();
    }
  };

  return (
    <>
      {/* Archival Obsidian Constellation Card */}
      <motion.div
        whileHover={{
          y: -5,
          transition: { duration: 0.3, ease: 'easeOut' },
        }}
        whileTap={{ scale: 0.97 }}
        onClick={handleCardClick}
        className={`group relative cursor-pointer rounded-2xl p-5 sm:p-7 text-left transition-all duration-500 obsidian-card ${
          isDiscovered ? 'border-purple-400/30' : 'border-purple-500/15'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="font-cinzel text-[11px] sm:text-xs tracking-[0.25em] text-purple-400/80 uppercase">
            Fragment {ROMAN_NUMERALS[index] || "I"}
          </span>
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-purple-400/30 flex items-center justify-center group-hover:border-purple-300 transition-colors">
            <div className={`w-1.5 h-1.5 rounded-full ${isDiscovered ? 'bg-purple-300 shadow-[0_0_8px_#c084fc]' : 'bg-purple-600'}`} />
          </div>
        </div>

        <h4 className="font-display text-xl sm:text-2xl text-purple-100 font-semibold tracking-wide group-hover:text-purple-200 transition-colors mb-1.5">
          {card.title}
        </h4>

        {card.date && (
          <p className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.2em] text-purple-400/70 mb-2.5 uppercase">
            {card.date}
          </p>
        )}

        <p className="font-sans text-xs text-purple-200/65 line-clamp-2 leading-relaxed font-light">
          {card.snippet}
        </p>

        <div className="mt-4 pt-3 border-t border-purple-500/15 flex items-center justify-between">
          <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-purple-400/60 group-hover:text-purple-300 transition-colors">
            Unfold Memory
          </span>
          <span className="text-purple-400/50 text-xs group-hover:translate-x-1 transition-transform">
            →
          </span>
        </div>
      </motion.div>

      {/* Luxury Archival Unfold Modal (Mobile Bottom Sheet + Desktop Centered) */}
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
              className="relative w-full sm:max-w-xl mobile-bottom-sheet sm:rounded-3xl p-6 sm:p-10 text-left border-t sm:border border-purple-400/30 max-h-[90dvh] overflow-y-auto shadow-2xl"
            >
              {/* Mobile grab handle bar */}
              <div className="sm:hidden w-12 h-1 bg-purple-400/30 rounded-full mx-auto mb-5" />

              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 text-purple-400/70 hover:text-white transition-colors p-2 text-sm font-sans focus:outline-none"
              >
                ✕
              </button>

              <div className="mb-2">
                <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.3em] uppercase text-purple-300/80">
                  {card.date || "Celestial Archive"} · Fragment {ROMAN_NUMERALS[index] || "I"}
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-4xl text-purple-100 font-bold mb-3 tracking-wide text-glow">
                {card.title}
              </h3>

              <div className="relative pl-4 sm:pl-5 py-2 my-4 border-l border-purple-400/40">
                <p className="font-display text-lg sm:text-xl text-purple-200/95 italic leading-relaxed">
                  "{card.snippet}"
                </p>
              </div>

              {card.detail && (
                <p className="font-sans text-xs sm:text-base text-purple-200/80 leading-relaxed mt-4 font-light">
                  {card.detail}
                </p>
              )}

              <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-purple-500/20 flex items-center justify-between">
                <span className="font-cinzel text-[10px] tracking-[0.2em] text-purple-400/60 uppercase">
                  Recorded in Starlight
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="font-cinzel text-[10px] sm:text-xs tracking-[0.2em] uppercase px-5 py-2 rounded-full border border-purple-400/30 text-purple-200 hover:text-white bg-purple-900/40 transition-colors"
                >
                  Close Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
