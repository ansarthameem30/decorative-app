'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProposalConfig } from '../../types/proposal';
import { audioEngine } from '../../services/audioEngine';
import { RoyalRingBox } from './RoyalRingBox';

interface ProposalQuestionProps {
  config: ProposalConfig;
  onSayYes: () => void;
}

const RUNAWAY_QUIPS = [
  "Written in our stars",
  "Borahae is forever",
  "Option unavailable",
  "You know your heart says yes",
  "We are forever",
  "Destiny has chosen us"
];

export const ProposalQuestion: React.FC<ProposalQuestionProps> = ({ config, onSayYes }) => {
  const [runawayOffset, setRunawayOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [runawayQuipIndex, setRunawayQuipIndex] = useState(0);
  const [isDodgeActive, setIsDodgeActive] = useState(false);

  const lines = config.letterLines;

  const handleDodge = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDodgeActive(true);
    audioEngine.playStarGlimmer();

    const randomX = (Math.random() - 0.5) * (window.innerWidth < 640 ? 140 : 250);
    const randomY = (Math.random() - 0.5) * (window.innerWidth < 640 ? 90 : 150);

    setRunawayOffset({ x: randomX, y: randomY });
    setRunawayQuipIndex(prev => (prev + 1) % RUNAWAY_QUIPS.length);
  };

  return (
    <section className="relative w-full min-h-screen py-20 sm:py-32 px-4 sm:px-8 flex flex-col items-center justify-center select-none z-20 text-center">
      {/* Deep Violet-Champagne Spotlight Atmosphere */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[340px] sm:w-[650px] h-[340px] sm:h-[650px] rounded-full bg-gradient-to-tr from-purple-900/30 via-pink-600/15 to-purple-400/10 blur-[140px]" />
      </div>

      {/* Love Letter Narrative - Direct & Steady */}
      <div className="max-w-xl w-full mb-8 min-h-0 flex flex-col items-center gap-3 px-2">
        {lines.map((line, idx) => (
          <p
            key={idx}
            className="font-display text-base sm:text-2xl text-purple-200 leading-relaxed font-light"
          >
            "{line}"
          </p>
        ))}
      </div>

      {/* Closed Royal Velvet Jeweler Case */}
      <div className="relative my-2 flex flex-col items-center w-full max-w-lg">
        {/* Closed Ring Box */}
        <RoyalRingBox />

        {/* Proposal Headline */}
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-pink-200 text-glow-blush my-6 leading-snug px-2">
          {config.proposalQuestion}
        </h2>

        {/* Response Buttons */}
        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-2 w-full max-w-md px-2">
          {/* Primary YES Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSayYes}
            className="w-full sm:w-auto font-heading text-xs sm:text-sm font-semibold tracking-wide uppercase px-9 py-4 rounded-full bg-gradient-to-r from-purple-800 via-pink-600 to-purple-800 hover:from-purple-700 hover:to-pink-500 text-white shadow-[0_0_40px_rgba(240,171,252,0.45)] border border-pink-200 transition-all z-20 touch-manipulation"
          >
            Yes, I Purple You
          </motion.button>

          {/* Playful Runaway Dodge Button */}
          <motion.div
            animate={{
              x: runawayOffset.x,
              y: runawayOffset.y,
            }}
            transition={{ type: 'spring', damping: 18, stiffness: 260 }}
            className="w-full sm:w-auto"
          >
            <button
              onMouseEnter={handleDodge}
              onTouchStart={handleDodge}
              onClick={handleDodge}
              className="w-full sm:w-auto font-heading text-xs font-medium tracking-wide uppercase px-6 py-3.5 rounded-full border border-purple-500/30 bg-[#120624]/80 text-purple-300 hover:text-white transition-colors touch-manipulation"
            >
              {isDodgeActive ? RUNAWAY_QUIPS[runawayQuipIndex] : "Let me think..."}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
