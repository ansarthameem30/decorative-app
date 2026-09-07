'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface RoyalRingRevealProps {
  onSparkleClick?: () => void;
}

export const RoyalRingReveal: React.FC<RoyalRingRevealProps> = ({ onSparkleClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sparkleSeed, setSparkleSeed] = useState(0);

  // Automatically trigger the box opening after mount with cinematic delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const triggerSparkle = () => {
    setSparkleSeed((prev) => prev + 1);
    if (onSparkleClick) onSparkleClick();
  };

  return (
    <div 
      className="relative w-full max-w-[340px] h-[300px] sm:h-[330px] mx-auto flex items-center justify-center select-none cursor-pointer overflow-visible"
      onClick={triggerSparkle}
      title="Click or tap to sparkle the diamond"
    >
      {/* 1. Dramatic Volumetric Starlight Beam upon opening */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{
          opacity: isOpen ? [0, 0.9, 0.45] : 0,
          scaleY: isOpen ? 1 : 0,
        }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        style={{ transformOrigin: 'bottom center' }}
        className="absolute bottom-16 w-56 h-72 bg-gradient-to-t from-pink-400/40 via-purple-500/20 to-transparent blur-2xl pointer-events-none"
      />

      {/* 2. Ambient Ethereal Violet Bloom */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.5, 0.85, 0.5],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-700/35 via-pink-500/25 to-purple-400/15 blur-[60px] pointer-events-none"
      />

      {/* 3. Ascending Stardust Embers */}
      {isOpen && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={`stardust-${i}-${sparkleSeed}`}
              initial={{
                opacity: 0,
                y: 20,
                x: (i - 4) * 22 + (Math.random() - 0.5) * 20,
                scale: 0.4,
              }}
              animate={{
                opacity: [0, 0.9, 0],
                y: -120 - Math.random() * 40,
                scale: [0.4, 1.2, 0.2],
              }}
              transition={{
                duration: 2.4 + (i % 3) * 0.5,
                delay: i * 0.15,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              className="absolute bottom-20 left-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-300 via-white to-purple-300 shadow-[0_0_8px_#f0abfc]"
            />
          ))}
        </div>
      )}

      {/* 4. 3D Perspective Velvet Jeweler Case */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center [perspective:1000px]">
        
        {/* Shadow Beneath Case */}
        <div className="absolute bottom-6 w-52 h-10 rounded-[100%] bg-black/85 blur-md pointer-events-none" />

        {/* --- OPENING LID (Hinged backward in 3D) --- */}
        <motion.div
          initial={{ rotateX: 0, y: 0, zIndex: 10 }}
          animate={{
            rotateX: isOpen ? -78 : 0,
            y: isOpen ? -38 : 0,
            zIndex: isOpen ? 5 : 15,
          }}
          transition={{
            duration: 1.2,
            type: 'spring',
            damping: 18,
            stiffness: 120,
          }}
          style={{ transformOrigin: 'top center' }}
          className="absolute top-12 w-48 sm:w-52 h-28 rounded-t-3xl bg-gradient-to-b from-[#2a0845] via-[#1a042e] to-[#120220] border-t-2 border-x-2 border-purple-400/40 shadow-[0_-8px_30px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.25)] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Quilted Velvet Interior Pattern of Lid */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-purple-950/80 pointer-events-none" />
          <div className="absolute inset-2 rounded-t-2xl border border-purple-400/20 flex flex-col items-center justify-center p-2">
            <span className="font-heading text-[10px] tracking-widest uppercase text-pink-300/80 font-bold">
              Mikrokosmos
            </span>
            <span className="text-[9px] text-purple-300/60 font-serif italic mt-0.5">
              Forever & Always
            </span>
          </div>

          {/* Golden Exterior Clasp (when closed) */}
          {!isOpen && (
            <div className="absolute bottom-0 w-8 h-4 rounded-t-md bg-gradient-to-b from-[#fef08a] via-[#eab308] to-[#ca8a04] border border-[#fef08a] shadow-[0_0_10px_#fde68a] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#713f12]" />
            </div>
          )}
        </motion.div>

        {/* --- LOWER VELVET PEDESTAL & CUSHION (Base) --- */}
        <div className="relative z-10 w-48 sm:w-52 h-36 rounded-b-3xl bg-gradient-to-b from-[#180327] via-[#10011c] to-[#08010e] border-b-2 border-x-2 border-purple-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_-2px_6px_rgba(0,0,0,0.8)] flex flex-col items-center justify-start pt-2 mt-12 overflow-hidden">
          
          {/* Gold Interior Rim Inlay */}
          <div className="absolute top-0 inset-x-3 h-[2px] bg-gradient-to-r from-transparent via-[#fde68a] to-transparent opacity-75 shadow-[0_0_6px_#fde68a]" />

          {/* Plush Velvet Ring Bed / Pillow */}
          <div className="relative w-40 sm:w-44 h-24 rounded-2xl bg-gradient-to-b from-[#2a0845] via-[#19042c] to-[#120220] border border-purple-400/30 shadow-[inset_0_4px_16px_rgba(0,0,0,0.95)] flex flex-col items-center justify-center">
            
            {/* Center Dark Velvet Ring Slit */}
            <div className="w-20 h-2.5 rounded-full bg-[#05000a] shadow-[inset_0_2px_4px_#000000,0_0_6px_rgba(168,85,247,0.3)] my-auto" />
            
            {/* BTS Inscription on Ring Cushion Bed */}
            <div className="absolute bottom-1.5 text-center">
              <span className="font-heading text-[8px] tracking-[0.25em] uppercase text-pink-300/60 font-semibold">
                VII · BORAHAE FOREVER
              </span>
            </div>
          </div>
        </div>

        {/* --- THE SOLITAIRE DIAMOND RING (Rises dramatically upon open) --- */}
        <motion.div
          initial={{ y: 25, scale: 0.65, opacity: 0 }}
          animate={{
            y: isOpen ? -10 : 25,
            scale: isOpen ? 1.08 : 0.65,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{
            duration: 1.1,
            delay: 0.35,
            type: 'spring',
            damping: 16,
            stiffness: 140,
          }}
          className="absolute z-20 top-14 flex flex-col items-center justify-center pointer-events-auto"
        >
          {/* Radiant Halo Behind Diamond */}
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.6, 1, 0.6],
              rotate: [0, 90, 180],
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: 'easeInOut',
            }}
            className="absolute -top-6 w-32 h-32 rounded-full bg-gradient-to-tr from-pink-400/30 via-white/25 to-purple-400/30 blur-xl pointer-events-none"
          />

          {/* SVG PHOTOREALISTIC SOLITAIRE DIAMOND RING */}
          <svg
            viewBox="0 0 200 200"
            className="w-36 h-36 sm:w-40 sm:h-40 drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] filter"
          >
            <defs>
              {/* Platinum Band Gradient */}
              <linearGradient id="platinumBand" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="20%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#e9d5ff" />
                <stop offset="70%" stopColor="#f3e8ff" />
                <stop offset="90%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>

              {/* Band Inner Shadow */}
              <linearGradient id="bandDepth" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e0836" />
                <stop offset="100%" stopColor="#0c0217" />
              </linearGradient>

              {/* Diamond Table Facet */}
              <linearGradient id="diamondTable" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#f5d0fe" />
                <stop offset="70%" stopColor="#e0e7ff" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>

              {/* Diamond Side Facets (Prismatic Refraction) */}
              <linearGradient id="facetPink" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f472b6" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
              </linearGradient>

              <linearGradient id="facetViolet" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
              </linearGradient>

              <linearGradient id="facetWhite" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#d8b4fe" stopOpacity="0.75" />
              </linearGradient>

              {/* Gold Prong Accent */}
              <linearGradient id="goldProng" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
            </defs>

            {/* --- 1. Ring Inner Hollow (Depth) --- */}
            <ellipse cx="100" cy="120" rx="46" ry="22" fill="url(#bandDepth)" stroke="#270a45" strokeWidth="2" />

            {/* --- 2. Back Platinum Arc --- */}
            <path
              d="M 54,120 A 46,22 0 0,1 146,120"
              fill="none"
              stroke="#581c87"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* --- 3. Front Lustrous Platinum Band with Micro-Pavé --- */}
            <path
              d="M 54,120 A 46,24 0 0,0 146,120"
              fill="none"
              stroke="url(#platinumBand)"
              strokeWidth="8.5"
              strokeLinecap="round"
              filter="drop-shadow(0 4px 10px rgba(168,85,247,0.5))"
            />

            {/* Micro-pavé diamond studs along shoulder */}
            {[62, 70, 78, 86, 114, 122, 130, 138].map((px) => (
              <circle
                key={`pave-${px}`}
                cx={px}
                cy={128 + Math.sin((px - 54) / 92 * Math.PI) * 15}
                r="1.8"
                fill="#ffffff"
                stroke="#d8b4fe"
                strokeWidth="0.5"
              />
            ))}

            {/* --- 4. 6-Prong Setting Crown --- */}
            <g>
              {/* Center V-neck Mount */}
              <path d="M 91,85 L 100,105 L 109,85 Z" fill="url(#platinumBand)" stroke="#3b0764" strokeWidth="0.8" />

              {/* Side Struts */}
              <line x1="84" y1="83" x2="94" y2="104" stroke="url(#platinumBand)" strokeWidth="3" strokeLinecap="round" />
              <line x1="116" y1="83" x2="106" y2="104" stroke="url(#platinumBand)" strokeWidth="3" strokeLinecap="round" />

              {/* Gold Prong Tips */}
              <circle cx="76" cy="68" r="2.2" fill="url(#goldProng)" />
              <circle cx="124" cy="68" r="2.2" fill="url(#goldProng)" />
              <circle cx="88" cy="80" r="2" fill="url(#goldProng)" />
              <circle cx="112" cy="80" r="2" fill="url(#goldProng)" />
              <circle cx="100" cy="82" r="2.2" fill="url(#goldProng)" />
            </g>

            {/* --- 5. BRILLIANT SOLITAIRE DIAMOND (Crown & Pavilion) --- */}
            <g id="solitaire-diamond" filter="drop-shadow(0 0 16px rgba(240,171,252,0.85))">
              {/* Pavilion (Lower Cone) */}
              <polygon points="100,86 78,66 122,66" fill="url(#facetViolet)" stroke="#ffffff" strokeWidth="0.75" />
              <polygon points="100,86 86,66 114,66" fill="url(#diamondTable)" stroke="#c084fc" strokeWidth="0.5" opacity="0.9" />

              {/* Girdle & Crown Upper Angles */}
              <polygon points="78,66 84,54 116,54 122,66" fill="url(#facetPink)" stroke="#ffffff" strokeWidth="0.75" />

              {/* Crown Facets (Geometric Triangle Cuts) */}
              <polygon points="84,54 100,60 78,66" fill="url(#facetWhite)" stroke="#ffffff" strokeWidth="0.5" />
              <polygon points="116,54 100,60 122,66" fill="url(#facetWhite)" stroke="#ffffff" strokeWidth="0.5" />
              <polygon points="100,60 84,54 116,54" fill="url(#diamondTable)" stroke="#ffffff" strokeWidth="0.75" />

              {/* Central Diamond Table Facet (Mirror Crisp Surface) */}
              <polygon points="87,54 113,54 118,63 100,65 82,63" fill="url(#diamondTable)" stroke="#ffffff" strokeWidth="1" />

              {/* Brilliant Specular Light Refraction Lines */}
              <line x1="88" y1="56" x2="100" y2="64" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="112" y1="56" x2="100" y2="64" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          </svg>

          {/* --- 6. DYNAMIC MULTI-POINT DIAMOND SPARKLE STARS --- */}
          {/* Main Top Sparkle (Twinkling continuously) */}
          <motion.div
            animate={{
              scale: [0.6, 1.4, 0.6],
              rotate: [0, 45, 90],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.1,
              ease: 'easeInOut',
            }}
            className="absolute top-2 left-[48%] -translate-x-1/2 pointer-events-none"
          >
            <div className="relative w-8 h-8 flex items-center justify-center">
              {/* 8-Point Diamond Star Flare */}
              <div className="absolute w-7 h-1 bg-white rounded-full shadow-[0_0_12px_#ffffff]" />
              <div className="absolute h-7 w-1 bg-white rounded-full shadow-[0_0_12px_#ffffff]" />
              <div className="absolute w-5 h-0.5 bg-pink-200 rounded-full rotate-45" />
              <div className="absolute h-5 w-0.5 bg-pink-200 rounded-full rotate-45" />
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_#f0abfc]" />
            </div>
          </motion.div>

          {/* Secondary Shoulder Sparkle Right */}
          <motion.div
            animate={{
              scale: [0.2, 1.1, 0.2],
              rotate: [45, 90, 135],
              opacity: [0.2, 0.95, 0.2],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.8,
              delay: 0.9,
              ease: 'easeInOut',
            }}
            className="absolute top-6 right-6 pointer-events-none"
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <div className="absolute w-5 h-0.5 bg-pink-100 rounded-full shadow-[0_0_8px_#f472b6]" />
              <div className="absolute h-5 w-0.5 bg-pink-100 rounded-full shadow-[0_0_8px_#f472b6]" />
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </motion.div>

          {/* Third Shoulder Sparkle Left */}
          <motion.div
            animate={{
              scale: [0.2, 1, 0.2],
              rotate: [-30, 30, -30],
              opacity: [0.3, 0.9, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              delay: 1.4,
              ease: 'easeInOut',
            }}
            className="absolute top-7 left-6 pointer-events-none"
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <div className="absolute w-4 h-0.5 bg-purple-100 rounded-full shadow-[0_0_8px_#c084fc]" />
              <div className="absolute h-4 w-0.5 bg-purple-100 rounded-full shadow-[0_0_8px_#c084fc]" />
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Sparkle Prompt Tag */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 0.75 : 0 }}
        transition={{ delay: 1.2 }}
        className="absolute -bottom-1 font-heading text-[10px] tracking-widest uppercase text-pink-300/80 bg-purple-950/70 border border-purple-400/30 px-3 py-1 rounded-full pointer-events-none shadow-sm"
      >
        ✦ Tap ring to sparkle
      </motion.span>
    </div>
  );
};
