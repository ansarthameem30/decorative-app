import React from 'react';
import { motion } from 'framer-motion';
import { ProposalReason } from '../../types/proposal';

interface ReasonsGridProps {
  reasons: ProposalReason[];
}

export const ReasonsGrid: React.FC<ReasonsGridProps> = ({ reasons }) => {
  return (
    <section className="relative w-full py-16 sm:py-24 px-4 sm:px-8 select-none z-20">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16 px-2">
        <span className="font-heading text-xs tracking-widest text-purple-300 uppercase block mb-1.5 font-medium">
          From the Depths of My Soul
        </span>
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-normal text-purple-50 text-glow">
          Why It Has Always Been You
        </h2>
        <p className="font-sans text-xs sm:text-sm text-purple-200/70 mt-2 max-w-md mx-auto leading-relaxed font-normal">
          The truths I carry in my heart every single day.
        </p>
      </div>

      {/* Direct Open Cards Grid - No Tap to Reveal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto px-1">
        {reasons.map((r, idx) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className="obsidian-card rounded-2xl p-6 flex flex-col justify-between border border-purple-400/25 shadow-xl hover:border-pink-400/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-3 border-b border-purple-500/15 pb-2">
              <span className="font-heading text-xs tracking-wider text-pink-300 uppercase font-semibold">
                Reason {r.number.toString().padStart(2, '0')}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60" />
            </div>

            <h3 className="font-display text-xl sm:text-2xl text-purple-50 font-semibold mb-3">
              {r.short}
            </h3>

            <p className="font-sans text-xs sm:text-sm text-purple-200/80 leading-relaxed font-normal italic">
              "{r.detail}"
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
