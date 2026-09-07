'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { audioEngine } from '@/services/audioEngine';

interface RoyalRibbonEntranceProps {
  herName: string;
  isLoading?: boolean;
  onOpenComplete: () => void;
}

export const RoyalRibbonEntrance: React.FC<RoyalRibbonEntranceProps> = ({
  herName,
  isLoading = false,
  onOpenComplete,
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const handleBreakSeal = async () => {
    if (isOpening || isDismissed || isLoading) return;
    setIsOpening(true);

    // Trigger sweet starlight chime and romantic piano ballad
    audioEngine.playStarGlimmer();
    try {
      await audioEngine.startAudio();
    } catch (e) {
      console.log('Audio autoplay started on user touch', e);
    }

    // Elegant Champagne & Violet Luxury Stardust Confetti
    const count = 80;
    const defaults = {
      origin: { y: 0.5, x: 0.5 },
      colors: ['#fde68a', '#fef08a', '#e9d5ff', '#c084fc', '#ffffff', '#f472b6'],
    };

    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.6),
      spread: 80,
      startVelocity: 30,
    });
    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.4),
      spread: 110,
      startVelocity: 42,
    });

    // Opening animation sequence
    setTimeout(() => {
      setIsDismissed(true);
      setTimeout(() => {
        onOpenComplete();
      }, 850);
    }, 650);
  };

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(10px)' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#04010a] select-none overflow-hidden p-4 sm:p-8 text-center"
        >
          {/* 1. Cinematic Volumetric Lighting (High-fashion spotlight from above) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
            <div className="absolute -top-32 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] rounded-full bg-gradient-to-b from-purple-800/25 via-pink-500/15 to-transparent blur-[140px]" />
            <div className="absolute bottom-[-10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-purple-950/20 blur-[130px]" />
            
            {/* Subtle floating gold stardust embers */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`stardust-${i}`}
                animate={{
                  y: [-20, 20, -20],
                  opacity: [0.15, 0.6, 0.15],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4.5 + (i % 4),
                  delay: i * 0.4,
                  ease: 'easeInOut',
                }}
                style={{
                  top: `${12 + (i * 7)}%`,
                  left: `${10 + (i * 8)}%`,
                }}
                className="absolute w-1 h-1 rounded-full bg-[#fde68a] shadow-[0_0_8px_#fde68a]"
              />
            ))}
          </div>

          {/* 2. Haute-Couture Editorial Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="relative z-20 space-y-3 mb-6 sm:mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#120422]/90 border border-[#fde68a]/30 shadow-lg backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fde68a] shadow-[0_0_6px_#fde68a]" />
              <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.28em] text-[#fef08a] uppercase font-medium">
                Private Invitation · Mikrokosmos
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#fde68a] shadow-[0_0_6px_#fde68a]" />
            </div>

            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-normal text-white tracking-wide text-glow-blush leading-[1.1] pt-1">
              Are you ready to begin?
            </h1>

            <p className="font-display italic text-base sm:text-xl text-purple-200/80 font-light max-w-lg mx-auto px-4 leading-relaxed">
              For {herName || 'My Love'} — In a universe of seven billion lights, this journey was written only for you.
            </p>
          </motion.div>

          {/* 3. The 3D Royal Velvet Keepsake Folio with Silk Ribbon & Imperial Gold Seal */}
          <div className="relative z-20 w-full max-w-[340px] sm:max-w-[420px] my-2 [perspective:1200px]">
            
            {/* Folio Outer Shadow & Ambient Glow */}
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-purple-700/20 via-pink-500/10 to-transparent blur-2xl pointer-events-none" />

            {/* The Sealed Royal Folio Card */}
            <motion.div
              animate={{
                y: [-3, 3, -3],
                rotateX: [0, 2, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: 'easeInOut',
              }}
              className="relative w-full h-[220px] sm:h-[250px] rounded-3xl bg-gradient-to-b from-[#18052e] via-[#100320] to-[#080112] border-2 border-purple-400/30 shadow-[0_25px_60px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.15)] flex items-center justify-center overflow-hidden"
            >
              {/* Velvet Texture & Film Sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-500/10 to-pink-300/5 pointer-events-none" />

              {/* Gold Filigree Corner Borders */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-[#fde68a]/50 rounded-tl pointer-events-none" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-[#fde68a]/50 rounded-tr pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-[#fde68a]/50 rounded-bl pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-[#fde68a]/50 rounded-br pointer-events-none" />

              {/* Subtle Inscribed Monogram Watermark on Velvet */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                <span className="font-cinzel text-9xl text-white font-bold tracking-widest">
                  VII
                </span>
              </div>

              {/* --- HORIZONTAL ROYAL SATIN SILK RIBBON --- */}
              <div className="absolute inset-x-0 h-10 sm:h-12 flex items-center justify-center pointer-events-none">
                {/* Left Ribbon Half */}
                <motion.div
                  animate={isOpening ? {
                    x: '-120%',
                    rotate: -15,
                    opacity: 0,
                    transition: { duration: 0.6, ease: 'easeIn' },
                  } : {
                    x: 0,
                    opacity: 1,
                  }}
                  className="absolute right-1/2 mr-7 sm:mr-9 w-full h-full bg-gradient-to-r from-transparent via-[#6b21a8] to-[#8b5cf6] border-y-[1.5px] border-[#fde68a]/80 shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center"
                >
                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#fde68a] to-[#fef08a] opacity-75" />
                </motion.div>

                {/* Right Ribbon Half */}
                <motion.div
                  animate={isOpening ? {
                    x: '120%',
                    rotate: 15,
                    opacity: 0,
                    transition: { duration: 0.6, ease: 'easeIn' },
                  } : {
                    x: 0,
                    opacity: 1,
                  }}
                  className="absolute left-1/2 ml-7 sm:ml-9 w-full h-full bg-gradient-to-r from-[#8b5cf6] via-[#6b21a8] to-transparent border-y-[1.5px] border-[#fde68a]/80 shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center"
                >
                  <div className="w-full h-[1px] bg-gradient-to-r from-[#fef08a] via-[#fde68a] to-transparent opacity-75" />
                </motion.div>
              </div>

              {/* --- VERTICAL ROYAL SATIN SILK RIBBON --- */}
              <div className="absolute inset-y-0 w-10 sm:w-12 flex items-center justify-center pointer-events-none">
                <motion.div
                  animate={isOpening ? {
                    scaleY: 0,
                    opacity: 0,
                    transition: { duration: 0.5 },
                  } : {
                    scaleY: 1,
                    opacity: 1,
                  }}
                  className="w-full h-full bg-gradient-to-b from-[#6b21a8] via-[#8b5cf6] to-[#4c1d95] border-x-[1.5px] border-[#fde68a]/80 shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                />
              </div>

              {/* --- EMBOSSED 3D GOLD IMPERIAL SEAL (CENTER MEDALLION) --- */}
              <motion.div
                animate={isOpening ? {
                  scale: [1, 1.35, 0],
                  rotate: [0, 90, 180],
                  opacity: [1, 1, 0],
                  transition: { duration: 0.6, ease: 'easeOut' },
                } : {
                  scale: [1, 1.04, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: 'easeInOut',
                }}
                onClick={handleBreakSeal}
                className="relative z-30 cursor-pointer group flex flex-col items-center justify-center select-none touch-manipulation"
                title="Tap to break the royal seal"
              >
                {/* Ambient Golden Pulsar Glow */}
                <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-[#fef08a]/35 via-[#eab308]/25 to-purple-600/20 blur-xl group-hover:scale-125 transition-transform duration-500" />

                {/* 3D Brushed Champagne Gold Seal Medallion */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-[#fef08a] via-[#eab308] to-[#92400e] p-[2.5px] shadow-[0_12px_28px_rgba(0,0,0,0.85),0_0_35px_rgba(253,230,138,0.45)] flex items-center justify-center">
                  
                  {/* Outer Coin Rim Milling */}
                  <div className="w-full h-full rounded-full bg-[#160528] border-2 border-[#ca8a04] flex flex-col items-center justify-center relative overflow-hidden">
                    
                    {/* Radial Gold Grain Sheen */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-950 via-transparent to-[#fde68a]/20 pointer-events-none" />

                    {/* Regal Roman Numeral VII (BTS Borahae 7) */}
                    <span className="font-cinzel text-lg sm:text-xl font-bold tracking-widest text-[#fef08a] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] z-10">
                      VII
                    </span>

                    {/* Surrounding Inscription */}
                    <span className="font-cinzel text-[7px] tracking-[0.2em] uppercase text-[#fde68a]/80 font-semibold mt-0.5 z-10">
                      MIKROKOSMOS
                    </span>

                    {/* Micro Solitaire Star Facet */}
                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff] mt-0.5 z-10" />
                  </div>
                </div>

                {/* Elegant Tap Cue */}
                <span className="mt-2 font-cinzel text-[9px] tracking-[0.25em] uppercase text-[#fef08a]/80 bg-black/60 px-3 py-0.5 rounded-full border border-[#fde68a]/30 backdrop-blur-sm shadow-sm group-hover:text-white transition-colors">
                  Tap To Break Seal
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* 4. Luxury Action Button (High-fashion frosted obsidian pill) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="relative z-20 w-full max-w-xs sm:max-w-sm mx-auto mt-6 sm:mt-8 space-y-3"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={isOpening || isLoading}
              onClick={handleBreakSeal}
              className="w-full min-h-[52px] py-3.5 px-8 rounded-full bg-gradient-to-r from-[#24083d] via-[#3b105a] to-[#24083d] hover:from-[#2e0b4e] hover:to-[#2e0b4e] text-white font-cinzel text-xs tracking-[0.22em] uppercase font-semibold border border-[#fde68a]/60 shadow-[0_0_35px_rgba(253,230,138,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Aligning Our Universe...</span>
              ) : isOpening ? (
                <span>Opening Gates...</span>
              ) : (
                <span>Break The Seal & Enter</span>
              )}
            </motion.button>

            <p className="font-heading text-[10px] tracking-[0.18em] uppercase text-purple-300/50">
              Sound will initiate softly upon entering
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
