import React from 'react';
import { motion } from 'framer-motion';

export type TransitionVariant = 'shatter' | 'bloom' | 'ink-spread' | 'glow-wipe' | 'petal-dissolve';

interface SectionTransitionProps {
  variant: TransitionVariant;
}

export const SectionTransition: React.FC<SectionTransitionProps> = ({ variant }) => {
  switch (variant) {
    case 'bloom':
      return (
        <div className="relative w-full h-24 pointer-events-none flex items-center justify-center overflow-hidden">
          <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            whileInView={{ scale: 1.8, opacity: 0.35 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="w-48 h-12 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-800 blur-2xl"
          />
        </div>
      );

    case 'ink-spread':
      return (
        <div className="relative w-full h-20 pointer-events-none flex items-center justify-center">
          <div className="w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: '60%', opacity: 0.8 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute h-[2px] bg-gradient-to-r from-transparent via-purple-300 to-transparent blur-[1px]"
          />
        </div>
      );

    case 'glow-wipe':
      return (
        <div className="relative w-full h-28 pointer-events-none flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            className="w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_20px_#c084fc]"
          />
        </div>
      );

    case 'petal-dissolve':
      return (
        <div className="relative w-full h-24 pointer-events-none flex items-center justify-center">
          <div className="text-purple-400/50 text-xl tracking-[1.5em] select-none">
            ✦ · ✧ · ✦
          </div>
        </div>
      );

    case 'shatter':
    default:
      return (
        <div className="relative w-full h-20 pointer-events-none flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 blur-xl animate-pulse-slow" />
        </div>
      );
  }
};
