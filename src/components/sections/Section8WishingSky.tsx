import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../../context/JourneyContext';
import { WishStar } from '../../types';

export const Section8WishingSky: React.FC = () => {
  const { journeyState, addWish } = useJourney();
  const { wishesAdded } = journeyState;

  const [isComposing, setIsComposing] = useState(false);
  const [wishText, setWishText] = useState('');
  const [activeWish, setActiveWish] = useState<WishStar | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;
    addWish(wishText.trim());
    setWishText('');
    setIsComposing(false);
  };

  return (
    <section className="relative w-full min-h-screen py-20 sm:py-28 px-4 sm:px-14 flex flex-col items-center justify-between select-none overflow-hidden">
      {/* Header */}
      <div className="text-center max-w-2xl z-10 px-2">
        <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.3em] text-purple-400/80 uppercase block mb-2 sm:mb-3">
          Chapter VII · The Wishing Sky
        </span>
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-normal text-purple-100 text-glow">
          Inscribe Your Wish into the Deep
        </h2>
        <p className="font-sans text-xs sm:text-sm text-purple-200/60 mt-3 sm:mt-4 max-w-md mx-auto leading-relaxed font-light">
          Touch each stellar node to read the wishes I have cast for us. When ready, inscribe your own wish to ascend into our permanent celestial canopy.
        </p>
      </div>

      {/* Celestial Dome Canvas Area - Responsive Height */}
      <div className="relative w-full max-w-5xl h-[360px] sm:h-[460px] my-4 sm:my-6 rounded-3xl border border-purple-500/20 bg-[#100520]/40 backdrop-blur-md overflow-hidden z-20 shadow-2xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,rgba(192,132,252,0.25)_0,transparent_70%)]" />

        {/* Wish Stars */}
        {wishesAdded.map((wish, index) => {
          const isHerWish = wish.author === 'her';
          const defaultPositions = [
            { x: 20, y: 32 },
            { x: 78, y: 26 },
            { x: 48, y: 18 },
            { x: 30, y: 65 },
            { x: 70, y: 70 },
            { x: 50, y: 80 },
          ];
          const pos = defaultPositions[index % defaultPositions.length];
          const x = wish.x ?? pos.x;
          const y = wish.y ?? pos.y;

          return (
            <motion.div
              key={wish.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: [0, -5, 0],
              }}
              transition={{
                y: { repeat: Infinity, duration: 4.5 + (index % 3), ease: 'easeInOut' },
                default: { duration: 0.8 },
              }}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group p-3 touch-manipulation"
              onMouseEnter={() => setActiveWish(wish)}
              onMouseLeave={() => setActiveWish(null)}
              onClick={() => setActiveWish(wish === activeWish ? null : wish)}
            >
              <div className="relative flex items-center justify-center">
                <div
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                    isHerWish
                      ? 'bg-pink-100 shadow-[0_0_16px_#f0abfc] ring-2 ring-pink-300/40'
                      : 'bg-purple-100 shadow-[0_0_12px_#c084fc]'
                  }`}
                />
              </div>

              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] sm:text-[9px] font-cinzel tracking-widest text-purple-300 uppercase whitespace-nowrap bg-[#120724]/90 px-2 py-0.5 rounded-full border border-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {isHerWish ? 'Her Starlight' : 'His Starlight'}
              </div>
            </motion.div>
          );
        })}

        {/* Center Prompt when not composing */}
        {!isComposing && (
          <motion.div
            animate={{
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{ repeat: Infinity, duration: 3 }}
            style={{ left: '50%', top: '50%' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer flex flex-col items-center touch-manipulation p-4"
            onClick={() => setIsComposing(true)}
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-dashed border-purple-400/40 flex items-center justify-center bg-[#180a30]/50 hover:border-purple-300 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-300 animate-ping" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-cinzel tracking-[0.25em] text-purple-300/80 uppercase mt-2.5">
              Touch to Cast a Wish
            </span>
          </motion.div>
        )}

        {/* Active Wish Card */}
        <AnimatePresence>
          {activeWish && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-3 left-3 right-3 sm:left-10 sm:right-10 z-30 p-4 sm:p-5 rounded-2xl bg-[#120724]/95 border border-purple-400/30 backdrop-blur-xl text-center shadow-2xl"
            >
              <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-purple-400/80 block mb-1">
                {activeWish.author === 'her' ? "Her Inscribed Wish" : "My Wish for You"}
              </span>
              <p className="font-display text-base sm:text-xl text-purple-100 italic leading-relaxed">
                "{activeWish.text}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Luxury Archival Wish Composer (Mobile Bottom Sheet + Desktop Modal) */}
      <AnimatePresence>
        {isComposing && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/85 backdrop-blur-xl"
            onClick={() => setIsComposing(false)}
          >
            <motion.form
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSubmit}
              className="relative w-full sm:max-w-xl mobile-bottom-sheet sm:rounded-3xl p-6 sm:p-8 text-left border-t sm:border border-purple-400/35 shadow-2xl flex flex-col gap-4 max-h-[90dvh] overflow-y-auto"
            >
              <div className="sm:hidden w-12 h-1 bg-purple-400/30 rounded-full mx-auto mb-3" />

              <div className="flex items-center justify-between">
                <span className="font-cinzel text-[11px] sm:text-xs tracking-[0.3em] text-purple-200 uppercase">
                  Inscribe Upon the Stars
                </span>
                <button
                  type="button"
                  onClick={() => setIsComposing(false)}
                  className="text-purple-400/60 hover:text-white text-sm font-sans"
                >
                  ✕
                </button>
              </div>

              <textarea
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                placeholder="Inscribe your quiet wish for us here..."
                rows={3}
                maxLength={180}
                className="w-full p-4 rounded-xl bg-[#0e0419]/70 border border-purple-500/25 text-purple-100 placeholder:text-purple-400/40 font-display text-base sm:text-lg focus:outline-none focus:border-purple-400 resize-none leading-relaxed"
                autoFocus
              />

              <div className="flex items-center justify-between pt-1">
                <span className="font-cinzel text-[9px] sm:text-[10px] tracking-wider text-purple-400/60">
                  {180 - wishText.length} Characters Left
                </span>
                <button
                  type="submit"
                  disabled={!wishText.trim()}
                  className="font-cinzel text-[10px] sm:text-xs tracking-[0.2em] uppercase px-5 sm:px-6 py-2.5 rounded-full border border-purple-400/30 text-purple-100 hover:text-white bg-purple-900/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
                >
                  Release to the Cosmos ✦
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {!isComposing && (
        <button
          onClick={() => setIsComposing(true)}
          className="z-20 font-cinzel text-[10px] sm:text-xs tracking-[0.25em] uppercase px-6 sm:px-7 py-2.5 rounded-full border border-purple-500/25 hover:border-purple-400/50 bg-[#120724]/70 text-purple-200 hover:text-white transition-all backdrop-blur-md shadow-xl active:scale-95"
        >
          Add Another Wish Node ✦
        </button>
      )}
    </section>
  );
};
