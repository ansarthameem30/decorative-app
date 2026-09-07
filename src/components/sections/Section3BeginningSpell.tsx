import React from 'react';
import { motion } from 'framer-motion';
import { useJourney } from '../../context/JourneyContext';
import { contentConfig } from '../../config/content';
import { SpellCard } from '../shared/SpellCard';

export const Section3BeginningSpell: React.FC = () => {
  const { isItemDiscovered, discoverItem } = useJourney();

  return (
    <section className="relative w-full min-h-screen py-20 sm:py-28 px-4 sm:px-14 flex flex-col items-center justify-center select-none">
      {/* Header */}
      <div className="text-center max-w-2xl mb-12 sm:mb-16 z-10 px-2">
        <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.3em] text-purple-400/80 uppercase block mb-2 sm:mb-3">
          Chapter II · The First Convergence
        </span>
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-normal text-purple-100 text-glow">
          How Our Story Began
        </h2>
        <p className="font-sans text-xs sm:text-sm text-purple-200/60 mt-3 sm:mt-4 max-w-md mx-auto leading-relaxed font-light">
          Tap each archival fragment to reveal how two independent orbits crossed into one shared gravity.
        </p>
      </div>

      {/* Memory Archival Grid */}
      <div className="relative w-full max-w-6xl z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10">
          {contentConfig.beginningSpells.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className={idx === 4 ? "sm:col-span-2 lg:col-span-1 lg:col-start-2" : ""}
            >
              <SpellCard
                card={card}
                index={idx}
                isDiscovered={isItemDiscovered('beginningSpell', card.id)}
                onOpen={() => discoverItem('beginningSpell', card.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
