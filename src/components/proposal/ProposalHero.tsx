'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ProposalConfig } from '../../types/proposal';
import { audioEngine } from '../../services/audioEngine';

interface ProposalHeroProps {
  config: ProposalConfig;
  onExploreStory: () => void;
}

export const ProposalHero: React.FC<ProposalHeroProps> = ({
  config,
  onExploreStory,
}) => {
  const handleStart = () => {
    audioEngine.startAudio();
    audioEngine.playStarGlimmer();
    onExploreStory();
  };

  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col items-center justify-between py-12 sm:py-20 px-4 sm:px-8 select-none overflow-hidden text-center z-20">
      {/* Ambient Starlight Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] rounded-full bg-purple-900/15 blur-[140px] pointer-events-none" />

      {/* Top Header Tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pt-4"
      >
        <span className="font-heading text-xs tracking-widest text-purple-200 font-medium px-4 py-1.5 rounded-full bg-[#16062a]/90 border border-purple-500/35 backdrop-blur-md shadow-xl">
          보라해 · Borahae · Our Mikrokosmos
        </span>
      </motion.div>

      {/* Centerpiece: Clean, High-Fashion Editorial Typography */}
      <div className="my-auto flex flex-col items-center max-w-xl w-full px-2 py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.8 }}
          className="w-full flex flex-col items-center"
        >
          <span className="font-heading text-xs sm:text-sm tracking-wider uppercase text-pink-300/90 mb-2 font-semibold">
            A Love Inscribed in the Stars
          </span>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-normal text-purple-50 tracking-tight leading-[1.1] text-glow mb-4">
            For {config.herName}
          </h1>

          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-purple-400/80 to-transparent my-3" />

          {/* BTS Quote Glass Card */}
          <div className="w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#150529]/85 via-[#0e031c]/90 to-[#07010e]/95 border border-purple-400/25 backdrop-blur-2xl shadow-2xl space-y-3">
            <p className="font-display text-base sm:text-xl text-purple-100 italic leading-relaxed font-light">
              "{config.invitationSubtitle || "In this vast universe of seven billion lights, you are my only Mikrokosmos. Every road, every winter, and every song was leading me to you."}"
            </p>
            <span className="font-heading text-xs tracking-wider text-pink-300 font-medium block pt-1">
              I Purple You · Always and Forever
            </span>
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 w-full max-w-xs"
        >
          <button
            onClick={handleStart}
            className="w-full font-heading text-xs sm:text-sm font-semibold tracking-wide py-4 px-8 rounded-full bg-gradient-to-r from-purple-700 via-pink-600 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white shadow-[0_0_30px_rgba(240,171,252,0.35)] border border-pink-300/40 transition-all active:scale-95 touch-manipulation"
          >
            Begin Our Journey
          </button>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="pb-3 flex flex-col items-center gap-1.5 cursor-pointer"
        onClick={handleStart}
      >
        <span className="font-heading text-[11px] tracking-wider text-purple-300/80 font-medium">
          Scroll down to explore
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_8px_#f472b6]"
        />
      </motion.div>
    </section>
  );
};
