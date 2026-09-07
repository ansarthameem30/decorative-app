'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioEngine } from '../../services/audioEngine';

interface Pillar {
  id: string;
  roman: string;
  title: string;
  vow: string;
  description: string;
}

const PILLARS: Pillar[] = [
  {
    id: 'pillar-1',
    roman: 'I',
    title: 'Sanctuary of Home',
    vow: 'A shelter of warmth, music, and effortless peace.',
    description: 'To build a haven where our souls exhale, where every Tuesday dinner feels like a celebration, and where you never doubt you are cherished.',
  },
  {
    id: 'pillar-2',
    roman: 'II',
    title: 'Endless Adventures',
    vow: 'Walking every road and taking every wrong turn with laughter.',
    description: 'To explore midnight city lights, foreign shores, and quiet morning coffee shops—because with you, every single place becomes paradise.',
  },
  {
    id: 'pillar-3',
    roman: 'III',
    title: 'Unwavering Anchor',
    vow: 'Holding your hand through every season and storm.',
    description: 'When the world is loud and exhausting, I promise to be your calm harbor. I will protect your dreams and hold you tight until morning breaks.',
  },
  {
    id: 'pillar-4',
    roman: 'IV',
    title: 'Everlasting Devotion',
    vow: 'Loving you deeper with every passing sunrise.',
    description: 'To choose you consciously every single day, to marvel at the woman you are, and to love you until the stars themselves burn out.',
  },
];

export const PillarsOfTomorrow: React.FC = () => {
  const [ignitedPillarIds, setIgnitedPillarIds] = useState<string[]>([]);
  const [selectedPillar, setSelectedPillar] = useState<Pillar | null>(PILLARS[0]);

  const handleIgnite = (pillar: Pillar) => {
    setSelectedPillar(pillar);
    if (!ignitedPillarIds.includes(pillar.id)) {
      const updated = [...ignitedPillarIds, pillar.id];
      setIgnitedPillarIds(updated);
      audioEngine.playStarGlimmer();

      if (updated.length === PILLARS.length) {
        audioEngine.swellClimax();
      }
    }
  };

  const isAllIgnited = ignitedPillarIds.length === PILLARS.length;
  const progressPercent = Math.round((ignitedPillarIds.length / PILLARS.length) * 100);

  return (
    <section className="relative w-full py-16 sm:py-28 px-4 sm:px-8 select-none z-20 overflow-hidden">
      {/* Background Soft Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[600px] h-[380px] sm:h-[600px] rounded-full bg-purple-900/15 blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10 sm:mb-16 px-2">
        <span className="font-heading text-xs tracking-widest text-purple-300 uppercase block mb-1.5 font-medium">
          Chapter 07 · The Sacred Foundations
        </span>
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-normal text-purple-50 text-glow">
          The Pillars of Our Tomorrow
        </h2>
        <p className="font-sans text-xs sm:text-sm text-purple-200/70 mt-2 font-normal">
          Touch and ignite the four eternal pillars of our future ({ignitedPillarIds.length} of 4 ignited).
        </p>
      </div>

      {/* Interactive Pillars Grid & Gateway */}
      <div className="relative max-w-3xl mx-auto rounded-3xl border border-purple-500/25 bg-gradient-to-b from-[#15062a]/85 via-[#0c0218]/90 to-[#06010d]/95 backdrop-blur-2xl p-6 sm:p-9 shadow-2xl">
        {/* Progress Tracker Bar */}
        <div className="flex items-center justify-between mb-8 px-1">
          <span className="font-heading text-xs text-purple-200 font-medium tracking-wide">
            {isAllIgnited ? "Gateway of Destiny Unlocked" : "Igniting Our Foundations"}
          </span>
          <div className="flex items-center gap-2">
            <div className="w-28 sm:w-44 h-1.5 rounded-full bg-purple-950 border border-purple-500/30 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-400 to-pink-300"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.35 }}
              />
            </div>
            <span className="font-heading text-xs text-pink-300 font-semibold">{progressPercent}%</span>
          </div>
        </div>

        {/* 4 Sacred Pillars Display */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {PILLARS.map((pillar) => {
            const isIgnited = ignitedPillarIds.includes(pillar.id);
            const isSelected = selectedPillar?.id === pillar.id;

            return (
              <button
                key={pillar.id}
                onClick={() => handleIgnite(pillar)}
                className={`relative p-4 sm:p-5 rounded-2xl border transition-all duration-300 text-center flex flex-col items-center justify-between min-h-[140px] sm:min-h-[160px] ${
                  isIgnited
                    ? isSelected
                      ? 'bg-gradient-to-b from-[#2a0c47] to-[#150526] border-pink-400/80 shadow-[0_0_25px_rgba(240,171,252,0.4)] scale-[1.03]'
                      : 'bg-[#18062d]/90 border-purple-400/50 shadow-lg'
                    : 'bg-[#10031f]/70 border-purple-500/20 text-purple-400 hover:border-purple-400/40 hover:bg-[#140526]'
                }`}
              >
                {/* Roman Numeral Emblem */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-heading text-xs sm:text-sm font-semibold mb-2 border transition-all ${
                    isIgnited
                      ? 'bg-gradient-to-tr from-pink-600 to-purple-600 border-pink-200 text-white shadow-[0_0_12px_#f472b6]'
                      : 'bg-purple-950/60 border-purple-500/30 text-purple-400'
                  }`}
                >
                  {pillar.roman}
                </div>

                <div className="space-y-1 my-auto">
                  <h4 className="font-heading text-xs sm:text-sm font-medium text-purple-100">
                    {pillar.title}
                  </h4>
                  <span className="text-[10px] text-pink-300/80 block font-heading tracking-wider uppercase font-semibold">
                    {isIgnited ? 'Ignited' : 'Tap to Ignite'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Pillar Detailed Inscription */}
        <div className="min-h-[130px] flex items-center justify-center text-center px-2">
          <AnimatePresence mode="wait">
            {selectedPillar && (
              <motion.div
                key={selectedPillar.id}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-lg space-y-2 p-4 rounded-2xl bg-[#17052e]/80 border border-purple-500/25 backdrop-blur-xl"
              >
                <span className="font-heading text-xs tracking-wider text-pink-300 uppercase block font-semibold">
                  Pillar {selectedPillar.roman} · {selectedPillar.vow}
                </span>
                <p className="font-display text-sm sm:text-base text-purple-100 italic leading-relaxed">
                  "{selectedPillar.description}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Climax Gateway Unlocked Banner */}
        {isAllIgnited && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-purple-900/90 via-pink-900/90 to-purple-900/90 border border-pink-400/60 text-center shadow-[0_0_30px_rgba(240,171,252,0.3)]"
          >
            <span className="font-heading text-xs tracking-widest uppercase text-pink-300 font-semibold block mb-0.5">
              The Horizon is Complete
            </span>
            <p className="font-display text-base sm:text-lg text-white font-normal">
              All four sacred pillars are lit. Now, step forward into our forever below...
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
