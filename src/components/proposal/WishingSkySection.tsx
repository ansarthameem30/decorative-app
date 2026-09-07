'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { audioEngine } from '../../services/audioEngine';

interface Wish {
  id: string;
  text: string;
  author: 'you' | 'her';
  x: number;
  y: number;
}

const INITIAL_WISHES: Wish[] = [
  {
    id: 'wish-1',
    text: 'To walk beneath the spring cherry blossoms in Seoul, holding your hand forever.',
    author: 'you',
    x: 20,
    y: 24,
  },
  {
    id: 'wish-2',
    text: 'To build a warm home filled with music, spontaneous laughter, and effortless peace.',
    author: 'you',
    x: 80,
    y: 22,
  },
  {
    id: 'wish-3',
    text: 'To never let go of your hand, through every winter and every high.',
    author: 'you',
    x: 50,
    y: 18,
  },
  {
    id: 'wish-4',
    text: 'To love and cherish you more tomorrow than I do today, across every lifetime.',
    author: 'you',
    x: 32,
    y: 42,
  },
  {
    id: 'wish-5',
    text: 'To make your eyes smile every single morning we wake up together.',
    author: 'you',
    x: 68,
    y: 44,
  },
];

export const WishingSkySection: React.FC = () => {
  const [wishes, setWishes] = useState<Wish[]>(INITIAL_WISHES);
  const [isComposing, setIsComposing] = useState(false);
  const [wishText, setWishText] = useState('');
  const [activeWish, setActiveWish] = useState<Wish | null>(null);
  const [showLanternSurprise, setShowLanternSurprise] = useState(false);

  const handleCastWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;

    const newWish: Wish = {
      id: 'wish-' + Date.now(),
      text: wishText.trim(),
      author: 'her',
      x: Math.floor(Math.random() * 50) + 25,
      y: Math.floor(Math.random() * 25) + 20,
    };

    setWishes(prev => [...prev, newWish]);
    setActiveWish(newWish);
    setWishText('');
    setIsComposing(false);
    audioEngine.playStarGlimmer();

    // Trigger lantern stardust celebration
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#fbcfe8', '#f0abfc', '#ffffff', '#c084fc', '#fde68a'],
      });
      setShowLanternSurprise(true);
    }, 400);
  };

  return (
    <section className="relative w-full py-16 sm:py-28 px-4 sm:px-8 select-none z-20 overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[540px] h-[360px] sm:h-[540px] rounded-full bg-purple-900/15 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10 sm:mb-16 px-2">
        <span className="font-heading text-xs tracking-widest text-purple-300 uppercase block mb-1.5 font-medium">
          Chapter 04 · The Wishing Sky
        </span>
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-normal text-purple-50 text-glow">
          Inscribe a Wish to the Cosmos
        </h2>
        <p className="font-sans text-xs sm:text-sm text-purple-200/70 mt-2 font-normal">
          Touch each floating lantern to read my promises, or release your own dream into our night sky.
        </p>
      </div>

      {/* Interactive Starlight Canopy Area - Ample height so lanterns never overlap bottom display */}
      <div className="relative w-full max-w-3xl h-[420px] sm:h-[480px] mx-auto rounded-3xl border border-purple-500/25 bg-gradient-to-b from-[#110426]/75 via-[#0a0216]/85 to-[#06010d]/90 backdrop-blur-2xl overflow-hidden shadow-2xl flex flex-col justify-between p-5">
        {/* Floating Wishes Lanterns - Upper 55% only */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {wishes.map((wish, index) => {
            const isHer = wish.author === 'her';
            return (
              <div
                key={wish.id}
                style={{ left: `${wish.x}%`, top: `${wish.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer p-4 touch-manipulation z-20"
                onClick={() => {
                  setActiveWish(wish);
                  audioEngine.playStarGlimmer();
                }}
              >
                <motion.div
                  animate={{
                    y: [-5, 5, -5],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3.5 + (index % 3),
                    ease: 'easeInOut',
                  }}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative flex items-center justify-center min-w-[44px] min-h-[44px]"
                >
                  {/* Outer Lantern Glow */}
                  <div
                    className={`absolute w-9 h-9 rounded-full blur-sm transition-opacity duration-300 ${
                      isHer ? 'bg-pink-400/50' : 'bg-purple-400/40'
                    }`}
                  />

                  {/* Core Starlight Lantern */}
                  <div
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all duration-300 border shadow-lg ${
                      isHer
                        ? 'bg-gradient-to-tr from-pink-500 to-white border-pink-200 shadow-[0_0_15px_#f472b6]'
                        : 'bg-gradient-to-tr from-purple-400 to-white border-purple-200 shadow-[0_0_12px_#c084fc]'
                    }`}
                  />
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Top bar with count & button */}
        <div className="z-20 flex items-center justify-between w-full px-2">
          <span className="font-heading text-xs tracking-wide text-purple-200 font-medium">
            {wishes.length} Wishes Inscribed in Starlight
          </span>

          <button
            onClick={() => setIsComposing(true)}
            className="font-heading text-xs font-semibold tracking-wide py-2 px-5 rounded-full bg-gradient-to-r from-purple-800 to-pink-600 hover:from-purple-700 hover:to-pink-500 text-white shadow-lg border border-pink-300/30 transition-all active:scale-95 touch-manipulation"
          >
            Release a Wish
          </button>
        </div>

        {/* Center / Bottom Active Wish Display - Dedicated space at bottom */}
        <div className="z-30 w-full min-h-[95px] flex items-center justify-center text-center px-2 pointer-events-auto mt-auto">
          <AnimatePresence mode="wait">
            {activeWish ? (
              <motion.div
                key={activeWish.id}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-lg p-4 rounded-2xl bg-[#150529]/95 border border-purple-400/35 backdrop-blur-2xl shadow-2xl"
              >
                <span className="font-heading text-xs tracking-wider text-pink-300 uppercase block mb-1 font-semibold">
                  {activeWish.author === 'her' ? 'Your Inscribed Wish' : 'My Promise to You'}
                </span>
                <p className="font-display text-sm sm:text-base text-purple-100 italic leading-snug">
                  "{activeWish.text}"
                </p>
              </motion.div>
            ) : (
              <span className="font-heading text-xs text-purple-300/70 font-normal">
                Touch any lantern in the sky to unveil its promise
              </span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Wish Composer Modal */}
      <AnimatePresence>
        {isComposing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#1b0733] to-[#0c0218] border border-purple-400/40 shadow-2xl text-center"
            >
              <h4 className="font-display text-2xl text-purple-50 font-normal mb-1">
                Release a Wish
              </h4>
              <p className="font-sans text-xs text-purple-300/70 mb-4 font-normal">
                Inscribe a dream, a promise, or a feeling to float upward into our stars.
              </p>

              <form onSubmit={handleCastWish} className="flex flex-col gap-3">
                <textarea
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  placeholder="What is your wish for our future together?"
                  rows={3}
                  className="w-full p-3.5 rounded-xl bg-[#120324] border border-purple-500/30 text-purple-100 font-sans text-sm focus:outline-none focus:border-pink-400 resize-none transition-colors"
                  autoFocus
                />

                <div className="flex items-center justify-end gap-2.5 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsComposing(false)}
                    className="font-heading text-xs px-4 py-2 rounded-full border border-purple-500/30 text-purple-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="font-heading text-xs font-semibold px-5 py-2 rounded-full bg-gradient-to-r from-purple-800 to-pink-600 hover:from-purple-700 hover:to-pink-500 text-white shadow-lg transition-all active:scale-95"
                  >
                    Release to the Cosmos
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Surprise Floating Lantern Blessing Modal */}
      <AnimatePresence>
        {showLanternSurprise && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#220738] via-[#120422] to-[#080112] border border-pink-400/50 shadow-[0_0_60px_rgba(240,171,252,0.4)] text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-amber-300 mx-auto flex items-center justify-center shadow-[0_0_20px_#fde68a]">
                <svg className="w-7 h-7 text-amber-950 drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a1 1 0 011 1v1.07A7.002 7.002 0 0119 11v3a2 2 0 01-2 2h-1v2a1 1 0 01-2 0v-2h-4v2a1 1 0 01-2 0v-2H7a2 2 0 01-2-2v-3a7.002 7.002 0 016-6.93V3a1 1 0 011-1zm0 4a5 5 0 00-5 5v3h10v-3a5 5 0 00-5-5z" />
                </svg>
              </div>

              <span className="font-heading text-xs tracking-widest text-pink-300 uppercase font-semibold block">
                The Lantern Has Ascended
              </span>

              <h3 className="font-display text-2xl sm:text-3xl font-normal text-white text-glow">
                Woven Into Our Night Sky
              </h3>

              <div className="p-4 rounded-2xl bg-[#17052a]/80 border border-purple-500/30 text-left space-y-2">
                <p className="font-display text-base sm:text-lg text-purple-100 italic leading-relaxed">
                  "Your wish has taken flight among our stars. In this life and in all our tomorrows, no star shines brighter than your happiness. I promise to spend every day turning your dreams into our reality."
                </p>
                <span className="font-heading text-xs text-pink-300/90 font-medium block pt-1">
                  — Inscribed for Eternity
                </span>
              </div>

              <button
                onClick={() => setShowLanternSurprise(false)}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-purple-700 via-pink-600 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white font-heading text-xs font-semibold uppercase tracking-wider shadow-lg active:scale-95 transition-all"
              >
                Carry Our Wishes Forward
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
