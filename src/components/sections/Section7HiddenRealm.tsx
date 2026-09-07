import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../../context/JourneyContext';
import { contentConfig } from '../../config/content';
import { audioEngine } from '../../services/audioEngine';

export const Section7HiddenRealm: React.FC = () => {
  const { journeyState } = useJourney();
  const { hiddenRealmUnlocked, discoveredCount } = journeyState;
  const [isOpen, setIsOpen] = useState(false);

  const handleReveal = () => {
    if (!hiddenRealmUnlocked) return;
    setIsOpen(true);
    audioEngine.playStarGlimmer();
  };

  const handHeartNodes = [
    { id: 1, x: 50, y: 70 },
    { id: 2, x: 42, y: 55 },
    { id: 3, x: 35, y: 38 },
    { id: 4, x: 42, y: 25 },
    { id: 5, x: 50, y: 35 },
    { id: 6, x: 58, y: 25 },
    { id: 7, x: 65, y: 38 },
    { id: 8, x: 58, y: 55 },
  ];

  return (
    <section className="relative w-full min-h-screen py-20 sm:py-28 px-4 sm:px-14 flex flex-col items-center justify-center select-none overflow-hidden">
      {/* Deep Nebula Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className={`w-[320px] sm:w-[450px] h-[320px] sm:h-[450px] rounded-full transition-all duration-1000 ${
          hiddenRealmUnlocked
            ? 'bg-purple-800/20 blur-[110px]'
            : 'bg-purple-950/20 blur-[80px]'
        }`} />
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mb-8 sm:mb-12 z-10 px-2">
        <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.3em] text-purple-400/80 uppercase block mb-2 sm:mb-3">
          Chapter VI · The Hidden Realm
        </span>

        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-normal text-purple-100 text-glow">
          {hiddenRealmUnlocked ? "The Starlit Hand-Heart" : "An Enigma in Shadow"}
        </h2>

        <p className="font-sans text-xs sm:text-sm text-purple-200/60 mt-3 sm:mt-4 max-w-md mx-auto leading-relaxed font-light">
          {hiddenRealmUnlocked
            ? "Your curiosity has awakened the secret constellation. Touch the twin hands to unveil its whisper."
            : `${contentConfig.hiddenRealmMotif.clue} (${discoveredCount}/11 Unveiled)`}
        </p>
      </div>

      {/* Abstract Hand-Heart Constellation - Scaled for Mobile */}
      <div
        onClick={handleReveal}
        className={`relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 my-2 sm:my-4 z-20 flex items-center justify-center rounded-3xl transition-all duration-500 touch-manipulation ${
          hiddenRealmUnlocked
            ? 'cursor-pointer hover:scale-105 active:scale-95 filter drop-shadow-[0_0_30px_rgba(192,132,252,0.35)]'
            : 'opacity-35 cursor-not-allowed'
        }`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <path
            d="M 50 70 L 42 55 L 35 38 L 42 25 L 50 35 L 58 25 L 65 38 L 58 55 Z"
            stroke={hiddenRealmUnlocked ? "#c084fc" : "#3b1d6e"}
            strokeWidth="1"
            strokeDasharray="3 2"
            fill={hiddenRealmUnlocked ? "rgba(139, 92, 246, 0.08)" : "none"}
            className="transition-all duration-700"
          />

          {handHeartNodes.map((node) => (
            <circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r={hiddenRealmUnlocked ? 2 : 1.5}
              className={`transition-all duration-500 ${
                hiddenRealmUnlocked
                  ? 'fill-purple-100 filter drop-shadow-[0_0_6px_#c084fc]'
                  : 'fill-purple-900'
              }`}
            />
          ))}
        </svg>

        {!hiddenRealmUnlocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-purple-400/50">
              Veiled in darkness
            </span>
          </div>
        )}

        {hiddenRealmUnlocked && (
          <div className="absolute bottom-4 sm:bottom-6 px-4 py-1.5 rounded-full bg-[#120724]/90 border border-purple-400/30 text-purple-200 text-[9px] sm:text-[10px] font-cinzel tracking-[0.25em] uppercase shadow-2xl backdrop-blur-md animate-pulse">
            Touch to Unveil Whisper ✦
          </div>
        )}
      </div>

      {/* Secret Message Modal (Mobile Bottom Sheet + Desktop Centered) */}
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
              className="relative w-full sm:max-w-lg mobile-bottom-sheet sm:rounded-3xl p-6 sm:p-10 text-center border-t sm:border border-purple-400/40 shadow-2xl max-h-[90dvh] overflow-y-auto"
            >
              <div className="sm:hidden w-12 h-1 bg-purple-400/30 rounded-full mx-auto mb-5" />

              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 text-purple-400/60 hover:text-white transition-colors text-sm font-sans focus:outline-none"
              >
                ✕
              </button>

              <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.3em] uppercase text-purple-400/80 block mb-2">
                A Secret Whisper in the Stars
              </span>

              <h3 className="font-display text-2xl sm:text-4xl text-purple-100 font-bold mb-4 text-glow">
                {contentConfig.hiddenRealmMotif.title}
              </h3>

              <div className="p-4 sm:p-6 rounded-2xl bg-purple-950/40 border border-purple-500/25 my-4 text-left">
                <p className="font-display text-base sm:text-xl text-purple-100 italic leading-relaxed">
                  "{contentConfig.hiddenRealmMotif.message}"
                </p>
              </div>

              <p className="font-sans text-xs text-purple-300/60 mt-3 font-light">
                Some melodies carry meaning far beyond spoken words.
              </p>

              <button
                onClick={() => setIsOpen(false)}
                className="mt-6 font-cinzel text-[10px] sm:text-xs tracking-[0.2em] uppercase px-7 py-2.5 rounded-full border border-purple-400/30 text-purple-200 hover:text-white bg-purple-900/40 transition-colors"
              >
                Preserve in Heart
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
