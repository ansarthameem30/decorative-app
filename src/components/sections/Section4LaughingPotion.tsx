import React from 'react';
import { useJourney } from '../../context/JourneyContext';
import { contentConfig } from '../../config/content';
import { PotionBubble } from '../shared/PotionBubble';

export const Section4LaughingPotion: React.FC = () => {
  const { isItemDiscovered, discoverItem } = useJourney();

  return (
    <section className="relative w-full min-h-screen py-20 sm:py-28 px-4 sm:px-14 flex flex-col items-center justify-center select-none overflow-hidden">
      {/* Background Ambient Bloom */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] rounded-full bg-purple-900/10 blur-[110px]" />
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mb-10 sm:mb-16 z-10 px-2">
        <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.3em] text-purple-400/80 uppercase block mb-2 sm:mb-3">
          Chapter III · Whispered Moments
        </span>
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-normal text-purple-100 text-glow">
          Our Shared Cadence
        </h2>
        <p className="font-sans text-xs sm:text-sm text-purple-200/60 mt-3 sm:mt-4 max-w-md mx-auto leading-relaxed font-light">
          Beyond the grandeur of the stars lies the warmth of our everyday intimacy—the private banter, sweet habits, and unscripted joy.
        </p>
      </div>

      {/* Floating Luminous Orbs Field */}
      <div className="relative w-full max-w-5xl z-20 flex flex-wrap items-center justify-center gap-1 sm:gap-4">
        {contentConfig.insideJokes.map((joke, index) => (
          <PotionBubble
            key={joke.id}
            joke={joke}
            index={index}
            isPopped={isItemDiscovered('laughingPotion', joke.id)}
            onPop={() => discoverItem('laughingPotion', joke.id)}
          />
        ))}
      </div>
    </section>
  );
};
