'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FutureLetter } from '../../types/proposal';
import { audioEngine } from '../../services/audioEngine';

interface TimeCapsuleSectionProps {
  letters?: FutureLetter[];
}

const DEFAULT_LETTERS: FutureLetter[] = [
  {
    id: 'letter-1',
    roman: 'I',
    tag: 'THE FIRST YEAR · 2027',
    year: 'Year One',
    milestone: 'When The Newness Turns Into Deep Comfort',
    excerpt: 'Looking back at the moment you said yes, knowing this was only the sweet beginning.',
    fullLetter: 'Can we promise that one year from today, we will look back at this exact proposal and smile, realizing that choosing each other was the easiest and sweetest decision of our lives? I want to spend these next 365 days memorizing every expression you make, discovering your favorite foods, and learning how to love you better with every passing sunrise.',
  },
  {
    id: 'letter-2',
    roman: 'II',
    tag: 'OUR SACRED HAVEN · 2030',
    year: 'Our First Home',
    milestone: 'When We Unlock Our Own Front Door',
    excerpt: 'Sunday morning coffee in our own kitchen, sunlight spilling across the floor.',
    fullLetter: 'Can we picture it? Sunday mornings with sunlight spilling across our wooden floor, the kettle whistling on the stove, and soft music playing while you laugh as I try to cook. More than any grand mansion, I want to build a haven with you where your heart can kick off its shoes, exhale, and know it is completely, unconditionally safe.',
  },
  {
    id: 'letter-3',
    roman: 'III',
    tag: 'OUR ANCHOR IN THE STORM',
    year: 'When Seasons Change',
    milestone: 'To Read Whenever The World Feels Heavy',
    excerpt: 'You will never have to face an exhausting day or cold winter alone again.',
    fullLetter: 'If life ever brings a season of heavy clouds, quiet doubts, or exhausting work, open this letter to remember: you will never face anything alone again. I promise to be your calm harbor, to hold your hand under the blankets, and to remind you how deeply you are cherished until the storm passes.',
  },
  {
    id: 'letter-4',
    roman: 'IV',
    tag: 'OUR SILVER DECADES · FOREVER',
    year: 'Decades Ahead',
    milestone: 'When Our Hair Has Streaks of Gray',
    excerpt: 'Sitting together on a quiet porch, smiling at a lifetime of laughter.',
    fullLetter: 'When decades have passed and we sit side-by-side watching the purple twilight, I know my heart will still race every time you smile. Borahae isn\'t just a promise for our youth—it is my lifelong vow that across every year, every laugh line, and every sunset, I will choose you and love you more than the day before.',
  },
];

export const TimeCapsuleSection: React.FC<TimeCapsuleSectionProps> = ({ letters = DEFAULT_LETTERS }) => {
  const [activeLetterId, setActiveLetterId] = useState<string>(letters[0]?.id || 'letter-1');
  const [unsealedIds, setUnsealedIds] = useState<string[]>([letters[0]?.id || 'letter-1']);
  const [showCelebrationBadge, setShowCelebrationBadge] = useState(false);

  const activeLetter = letters.find((l) => l.id === activeLetterId) || letters[0];
  const isAllUnsealed = unsealedIds.length === letters.length;

  const handleUnseal = (letter: FutureLetter) => {
    setActiveLetterId(letter.id);

    if (!unsealedIds.includes(letter.id)) {
      const updated = [...unsealedIds, letter.id];
      setUnsealedIds(updated);
      audioEngine.playSealBreak();

      if (updated.length === letters.length) {
        audioEngine.swellClimax();
        setTimeout(() => {
          confetti({
            particleCount: 60,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#fde68a', '#fbcfe8', '#c084fc', '#ffffff'],
          });
          setShowCelebrationBadge(true);
        }, 600);
      }
    } else {
      audioEngine.playStarGlimmer();
    }
  };

  return (
    <section className="relative w-full py-16 sm:py-28 px-4 sm:px-8 select-none z-20 overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[600px] h-[380px] sm:h-[600px] rounded-full bg-purple-900/15 blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10 sm:mb-16 px-2">
        <span className="font-heading text-xs tracking-widest text-purple-300 uppercase block mb-1.5 font-medium">
          Chapter 06 · The Sacred Time Capsule
        </span>
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-normal text-purple-50 text-glow">
          Letters to Our Future Selves
        </h2>
        <p className="font-sans text-xs sm:text-sm text-purple-200/70 mt-2 font-normal">
          Touch and unseal each royal letter addressed to the milestones we will share ({unsealedIds.length} of {letters.length} unsealed).
        </p>
      </div>

      {/* Main Interactive Time Capsule Vault */}
      <div className="relative max-w-3xl mx-auto rounded-3xl border border-purple-500/25 bg-gradient-to-b from-[#16062c]/85 via-[#0d021b]/90 to-[#07010e]/95 backdrop-blur-2xl p-5 sm:p-9 shadow-2xl">
        
        {/* Progress Tracker Bar */}
        <div className="flex items-center justify-between mb-8 px-1">
          <span className="font-heading text-xs text-purple-200 font-medium tracking-wide">
            {isAllUnsealed ? 'All Future Letters Inscribed' : 'Unsealing Our Tomorrows'}
          </span>
          <div className="flex items-center gap-2">
            <div className="w-28 sm:w-44 h-1.5 rounded-full bg-purple-950 border border-purple-500/30 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-400 to-amber-300"
                initial={{ width: 0 }}
                animate={{ width: `${(unsealedIds.length / letters.length) * 100}%` }}
                transition={{ duration: 0.35 }}
              />
            </div>
            <span className="font-heading text-xs text-pink-300 font-semibold">
              {unsealedIds.length}/{letters.length}
            </span>
          </div>
        </div>

        {/* 4 Interactive Royal Velvet Envelopes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {letters.map((letter) => {
            const isUnsealed = unsealedIds.includes(letter.id);
            const isActive = activeLetterId === letter.id;

            return (
              <button
                key={letter.id}
                onClick={() => handleUnseal(letter)}
                className={`group relative p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-between min-h-[145px] sm:min-h-[165px] text-center ${
                  isActive
                    ? 'bg-gradient-to-b from-[#2d0a4e] to-[#170528] border-pink-400/80 shadow-[0_0_25px_rgba(240,171,252,0.4)] scale-[1.03]'
                    : isUnsealed
                    ? 'bg-[#18052d]/90 border-purple-400/45 shadow-lg hover:border-purple-300'
                    : 'bg-[#10031f]/70 border-purple-500/20 text-purple-400 hover:border-purple-400/40 hover:bg-[#140526]'
                }`}
              >
                {/* Envelope Outer Gold Flap Seam */}
                <div className="absolute top-0 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-[#fde68a]/50 to-transparent" />

                {/* 3D Wax Seal Button Centerpiece */}
                <div className="relative my-auto flex flex-col items-center">
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-cinzel text-xs sm:text-sm font-bold border-2 transition-all shadow-md ${
                      isUnsealed
                        ? 'bg-gradient-to-b from-[#fef08a] via-[#eab308] to-[#92400e] border-[#fde68a] text-purple-950 shadow-[0_0_15px_rgba(253,230,138,0.5)]'
                        : 'bg-[#220738] border-purple-400/40 text-purple-300 group-hover:border-pink-300'
                    }`}
                  >
                    {letter.roman}
                  </div>
                </div>

                {/* Envelope Meta Labels */}
                <div className="w-full space-y-1 mt-auto">
                  <span className="font-heading text-[11px] sm:text-xs text-purple-100 font-medium block truncate">
                    {letter.year}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-pink-300/80 font-heading tracking-wider uppercase font-semibold block">
                    {isUnsealed ? 'Unsealed' : 'Break Seal'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Letter Display - Unfolded Royal Parchment Letter */}
        <div className="relative min-h-[220px] sm:min-h-[250px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {activeLetter && (
              <motion.div
                key={activeLetter.id}
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#200836]/95 via-[#130324]/98 to-[#0a0114] border border-pink-400/40 shadow-2xl relative overflow-hidden text-left space-y-4"
              >
                {/* Delicate Gold Leaf Filigree Corners */}
                <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-[#fde68a]/50 rounded-tl pointer-events-none" />
                <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-[#fde68a]/50 rounded-tr pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-[#fde68a]/50 rounded-bl pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[#fde68a]/50 rounded-br pointer-events-none" />

                {/* Letter Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-purple-500/20 pb-3 gap-1">
                  <div className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#fde68a] shadow-[0_0_6px_#fde68a]" />
                    <span className="font-heading text-xs uppercase tracking-widest text-pink-300 font-semibold">
                      {activeLetter.tag}
                    </span>
                  </div>
                  <span className="font-heading text-xs text-purple-300/80 italic font-light">
                    {activeLetter.milestone}
                  </span>
                </div>

                {/* Letter Body - Cursive Romantic Editorial Tone */}
                <p className="font-display text-base sm:text-xl text-purple-50 leading-relaxed italic font-light pt-1">
                  "{activeLetter.fullLetter}"
                </p>

                {/* Letter Footer Inscription */}
                <div className="pt-2 flex items-center justify-between border-t border-purple-500/15 text-[11px] text-purple-300/70 font-heading">
                  <span>To be opened together across all our tomorrows</span>
                  <span className="text-pink-300 font-medium">Borahae · 보라해</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Celebratory All-Unsealed Keepsake Badge */}
        <AnimatePresence>
          {showCelebrationBadge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-purple-900/50 via-pink-900/40 to-purple-900/50 border border-pink-400/50 text-center flex items-center justify-between flex-col sm:flex-row gap-3"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#fef08a] via-[#eab308] to-purple-800 flex items-center justify-center text-purple-950 font-cinzel font-bold text-sm shadow-lg flex-shrink-0">
                  VII
                </div>
                <div>
                  <h4 className="font-heading text-xs font-semibold uppercase text-pink-200 tracking-wider">
                    Time Capsule Sealed Into Destiny
                  </h4>
                  <p className="text-xs text-purple-200/80 font-normal">
                    All four letters are now bound to our stars. Our future begins here.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCelebrationBadge(false)}
                className="text-xs font-heading text-pink-300 uppercase px-4 py-1.5 rounded-full border border-pink-400/30 hover:bg-pink-950/40 transition-colors"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
