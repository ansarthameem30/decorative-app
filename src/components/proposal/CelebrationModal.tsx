'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ProposalConfig } from '../../types/proposal';
import { audioEngine } from '../../services/audioEngine';
import { RoyalRingReveal } from './RoyalRingReveal';

interface CelebrationModalProps {
  config: ProposalConfig;
  onClose: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({ config, onClose }) => {
  useEffect(() => {
    audioEngine.swellClimax();

    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 65,
        origin: { x: 0 },
        colors: ['#f0abfc', '#c084fc', '#ffffff', '#a855f7'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 65,
        origin: { x: 1 },
        colors: ['#f0abfc', '#8b5cf6', '#ffffff', '#d8b4fe'],
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleWhatsAppSend = () => {
    const text = encodeURIComponent(`I said YES! I purple you, forever and always!`);
    const phone = config.whatsappPhone ? config.whatsappPhone.replace(/[^0-9]/g, '') : '';
    const url = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  const handleSparkleClick = () => {
    audioEngine.playStarGlimmer();
    confetti({
      particleCount: 15,
      spread: 45,
      origin: { y: 0.45 },
      colors: ['#ffffff', '#f0abfc', '#e9d5ff', '#ffd700'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/92 backdrop-blur-2xl overflow-y-auto">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 25 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 240 }}
        className="relative w-full max-w-lg bg-gradient-to-b from-[#240a3d] via-[#150524] to-[#0a0212] rounded-3xl p-5 sm:p-8 text-center border border-pink-400/50 shadow-[0_0_80px_rgba(240,171,252,0.4)] my-4 max-h-[92vh] overflow-y-auto"
      >
        {/* Animated Royal Jeweler Box Opening & Solitaire Diamond Ring Reveal */}
        <div className="w-full mx-auto -mt-2 -mb-2 flex items-center justify-center">
          <RoyalRingReveal onSparkleClick={handleSparkleClick} />
        </div>

        <span className="font-heading text-xs tracking-widest uppercase text-pink-300 font-semibold block mb-1">
          An Everlasting Vow
        </span>

        <h2 className="font-display text-3xl sm:text-5xl font-normal text-white text-glow-blush mb-3 leading-tight">
          {config.celebrationTitle}
        </h2>

        {/* Keepsake Certificate Frame */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0f0417]/80 border border-purple-400/30 my-5 shadow-inner">
          <div className="flex items-center justify-center gap-3 text-lg sm:text-xl font-heading font-medium text-purple-200">
            <span>{config.yourName}</span>
            <span className="text-pink-400 font-light">&</span>
            <span>{config.herName}</span>
          </div>

          <p className="font-heading text-xs text-purple-300/70 tracking-wider uppercase mt-2">
            Inscribed on {todayFormatted}
          </p>

          <p className="font-display text-base sm:text-lg text-purple-100 italic mt-3 leading-relaxed">
            "{config.celebrationMessage}"
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-5">
          <button
            onClick={handleWhatsAppSend}
            className="w-full font-heading text-xs sm:text-sm font-semibold tracking-wide uppercase px-7 py-3.5 rounded-full bg-gradient-to-r from-purple-800 to-pink-600 hover:from-purple-700 hover:to-pink-500 text-white shadow-xl transition-all active:scale-95"
          >
            Tell Him: "I Said YES"
          </button>

          <button
            onClick={onClose}
            className="w-full font-heading text-xs font-medium tracking-wide uppercase px-6 py-2.5 rounded-full border border-purple-400/30 text-purple-200 hover:text-white bg-purple-900/30 transition-colors"
          >
            Relive Our Proposal
          </button>
        </div>
      </motion.div>
    </div>
  );
};
