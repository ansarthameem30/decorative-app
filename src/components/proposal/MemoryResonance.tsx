'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioEngine } from '../../services/audioEngine';

interface FrequencyTrack {
  id: string;
  hz: string;
  title: string;
  vow: string;
  detail: string;
  color: string;
}

const FREQUENCIES: FrequencyTrack[] = [
  {
    id: 'freq-1',
    hz: '432 Hz',
    title: 'The First Step',
    vow: 'The frequency where our beginnings unite.',
    detail: 'As new as we are to this journey, every second spent with you feels like home. I want to spend all our tomorrows discovering every wonderful thing about you.',
    color: '#c084fc',
  },
  {
    id: 'freq-2',
    hz: '528 Hz',
    title: 'A Lifetime of Laughter',
    vow: 'The golden frequency of your smile.',
    detail: 'The sound of your unguarded laugh is my favorite melody in the world. Can we promise to make each other smile and laugh until our cheeks hurt for years to come?',
    color: '#f0abfc',
  },
  {
    id: 'freq-3',
    hz: '639 Hz',
    title: 'Our Unshakable Shelter',
    vow: 'The warmth that will outlast every winter ahead.',
    detail: 'Through sunny days, quiet autumns, and every cold winter ahead, I promise to be your steady anchor. Can we be each other\'s calm in every storm?',
    color: '#d8b4fe',
  },
  {
    id: 'freq-4',
    hz: '852 Hz',
    title: 'Our Future Mikrokosmos',
    vow: 'A vow for all our tomorrows.',
    detail: 'In a cosmos of seven billion lights, you are the only one I want to build a life with. Can we take this step together into our forever?',
    color: '#fbcfe8',
  },
];

export const MemoryResonance: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('freq-1');
  const [unlockedIds, setUnlockedIds] = useState<string[]>(['freq-1']);

  const handleSelectFrequency = (freq: FrequencyTrack) => {
    setActiveId(freq.id);
    if (!unlockedIds.includes(freq.id)) {
      setUnlockedIds(prev => [...prev, freq.id]);
    }
    audioEngine.playStarGlimmer();
  };

  const currentTrack = FREQUENCIES.find(f => f.id === activeId) || FREQUENCIES[0];

  return (
    <section className="relative w-full py-16 sm:py-28 px-4 sm:px-8 select-none z-20 overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[560px] h-[360px] sm:h-[560px] rounded-full bg-purple-900/15 blur-[130px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10 sm:mb-16 px-2">
        <span className="font-heading text-xs tracking-widest text-purple-300 uppercase block mb-1.5 font-medium">
          Chapter 06 · The Harmony of Tomorrow
        </span>
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-normal text-purple-50 text-glow">
          The Frequency of Our Future
        </h2>
        <p className="font-sans text-xs sm:text-sm text-purple-200/70 mt-2 font-normal">
          Touch each harmonic frequency to discover the promises I want to make for our lifetime ahead.
        </p>
      </div>

      {/* Interactive Resonance Box */}
      <div className="relative max-w-2xl mx-auto rounded-3xl border border-purple-500/25 bg-gradient-to-b from-[#140628]/85 via-[#0b0217]/90 to-[#06010d]/95 backdrop-blur-2xl p-6 sm:p-9 shadow-2xl">
        {/* Frequency Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
          {FREQUENCIES.map((freq) => {
            const isActive = activeId === freq.id;
            const isUnlocked = unlockedIds.includes(freq.id);

            return (
              <button
                key={freq.id}
                onClick={() => handleSelectFrequency(freq)}
                className={`relative p-3 rounded-2xl border transition-all duration-300 text-left flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#22093d] border-pink-400/60 shadow-[0_0_20px_rgba(240,171,252,0.3)] scale-[1.03]'
                    : isUnlocked
                    ? 'bg-[#120422] border-purple-500/30 text-purple-300 hover:border-purple-400/50'
                    : 'bg-[#0d031c]/60 border-purple-500/15 text-purple-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-heading text-xs font-semibold tracking-wider text-pink-300">
                    {freq.hz}
                  </span>
                  {isUnlocked && (
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                  )}
                </div>
                <span className="font-heading text-[11px] text-purple-100 font-medium line-clamp-1">
                  {freq.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Central Dynamic Audio Wave / Harmonic Visualizer */}
        <div className="w-full h-12 flex items-center justify-center gap-1.5 mb-6 overflow-hidden">
          {[12, 28, 40, 22, 35, 48, 26, 18, 38, 44, 20, 32, 46, 24, 16].map((h, idx) => (
            <motion.div
              key={idx}
              animate={{
                height: [h * 0.4, h, h * 0.4],
                backgroundColor: idx % 2 === 0 ? '#f0abfc' : '#c084fc',
              }}
              transition={{
                repeat: Infinity,
                duration: 1.2 + (idx % 4) * 0.2,
                ease: 'easeInOut',
              }}
              className="w-1 rounded-full shadow-[0_0_6px_#f0abfc]"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>

        {/* Active Frequency Illuminated Story Card */}
        <div className="min-h-[160px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full text-center space-y-3"
            >
              <div className="inline-block px-4 py-1 rounded-full bg-purple-900/40 border border-purple-400/30 text-pink-300 font-heading text-xs tracking-wider uppercase font-semibold">
                {currentTrack.hz} · {currentTrack.title}
              </div>

              <h4 className="font-display text-xl sm:text-2xl text-purple-50 font-normal leading-snug">
                "{currentTrack.vow}"
              </h4>

              <p className="font-sans text-xs sm:text-sm text-purple-200/80 max-w-lg mx-auto leading-relaxed font-normal">
                {currentTrack.detail}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Tuning Status */}
        <div className="mt-8 pt-4 border-t border-purple-500/20 flex items-center justify-between text-xs font-heading">
          <span className="text-purple-300/70 font-medium">
            Tuning Progress: {unlockedIds.length} of {FREQUENCIES.length} Frequencies Aligned
          </span>
          <span className="text-pink-300 font-semibold tracking-wide">
            {unlockedIds.length === FREQUENCIES.length ? 'Perfect Harmonic Resonance' : 'Tune all 4'}
          </span>
        </div>
      </div>
    </section>
  );
};
