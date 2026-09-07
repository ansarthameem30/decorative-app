'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface RoyalRingBoxProps {
  isOpened?: boolean;
}

export const RoyalRingBox: React.FC<RoyalRingBoxProps> = ({ isOpened = false }) => {
  return (
    <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center select-none pointer-events-auto my-2">
      {/* Ambient Velvet Spotlight Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600/30 via-pink-500/20 to-purple-400/10 blur-[50px] pointer-events-none" />

      {/* Floating 3D Royal Jeweler Box */}
      <motion.div
        animate={{
          y: [-4, 4, -4],
          rotateX: [0, 4, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 3.5,
          ease: 'easeInOut',
        }}
        className="relative flex flex-col items-center justify-center"
      >
        {/* Box Shadow on Pedestal */}
        <div className="absolute -bottom-4 w-36 h-8 rounded-full bg-black/60 blur-md pointer-events-none" />

        {/* Closed Royal Velvet Case */}
        <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-b from-[#2d094a] via-[#1a042d] to-[#0d0117] border-2 border-purple-400/40 shadow-[0_15px_40px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.3)] flex flex-col items-center justify-center overflow-hidden">
          {/* Velvet Texture Sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-500/10 to-pink-300/10 pointer-events-none" />

          {/* Gold Hinge Seam Across Middle */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] bg-gradient-to-r from-transparent via-[#fde68a] to-transparent shadow-[0_0_8px_#fde68a] opacity-80" />

          {/* Polished Gold Jeweler Clasp */}
          <div className="relative z-10 w-8 h-5 rounded-lg bg-gradient-to-b from-[#fef08a] via-[#eab308] to-[#ca8a04] border border-[#fef08a] shadow-[0_0_12px_rgba(253,230,138,0.6)] flex items-center justify-center">
            {/* Clasp Keyhole / Gem Accents */}
            <div className="w-1.5 h-2 rounded-full bg-[#713f12]" />
          </div>

          {/* Glowing Seam Light (Pulsing anticipation of what lies within) */}
          <motion.div
            animate={{
              opacity: [0.3, 0.9, 0.3],
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: 'easeInOut',
            }}
            className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-transparent via-[#f0abfc] to-transparent blur-[3px]"
          />

          {/* Top Embossed Monogram / Crown Accent */}
          <div className="absolute top-4 text-center">
            <span className="font-heading text-[10px] tracking-widest uppercase text-pink-300/80 font-semibold block">
              Borahae
            </span>
          </div>

          {/* Bottom Satin Trim */}
          <div className="absolute bottom-3 text-center">
            <span className="font-heading text-[9px] tracking-wider uppercase text-purple-400/60 font-medium block">
              For Eternity
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
