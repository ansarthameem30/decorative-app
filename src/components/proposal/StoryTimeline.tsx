'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StorySlide } from '../../types/proposal';
import { audioEngine } from '../../services/audioEngine';

interface StoryTimelineProps {
  slides: StorySlide[];
}

export const StoryTimeline: React.FC<StoryTimelineProps> = ({ slides }) => {
  // Filter out any game slide so this carousel is purely our photo & milestone memories
  const memorySlides = slides.filter(s => !s.isGameSlide);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev < memorySlides.length - 1 ? prev + 1 : 0));
    audioEngine.playStarGlimmer();
  }, [memorySlides.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : memorySlides.length - 1));
    audioEngine.playStarGlimmer();
  }, [memorySlides.length]);

  // Keyboard navigation for desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  const currentSlide = memorySlides[currentIndex];

  return (
    <section className="relative w-full py-16 sm:py-28 px-4 sm:px-8 select-none z-20 overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] rounded-full bg-purple-900/15 blur-[120px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-10 sm:mb-16 px-2">
        <span className="font-heading text-xs tracking-widest text-purple-300 uppercase block mb-1.5 font-medium">
          Chapter 02 · The Journey Ahead
        </span>
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-normal text-purple-50 text-glow">
          The Constellation of Our Tomorrows
        </h2>
        <p className="font-sans text-xs sm:text-sm text-purple-200/70 mt-2 font-normal">
          Glide through the dreams and promises I want to write with you across a lifetime.
        </p>
      </div>

      {/* Sliding Carousel Container - Zero Browser Scrollbar */}
      <div className="relative max-w-xl mx-auto flex flex-col items-center">
        <div className="w-full min-h-[480px] sm:min-h-[530px] relative overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, x: 50, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.98 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -40) handleNext();
                else if (info.offset.x > 40) handlePrev();
              }}
              className="w-full obsidian-card rounded-3xl p-5 sm:p-7 border border-purple-400/25 shadow-2xl flex flex-col justify-between cursor-grab active:cursor-grabbing backdrop-blur-2xl"
            >
              {/* Card Top Meta */}
              <div className="flex items-center justify-between mb-3 border-b border-purple-500/15 pb-2.5">
                <span className="font-heading text-xs tracking-wider uppercase text-pink-300 font-semibold">
                  {currentSlide.tag}
                </span>
                <span className="font-heading text-xs tracking-wide text-purple-300/80 font-medium">
                  {currentSlide.date}
                </span>
              </div>

              {/* Memory Photo */}
              {currentSlide.imageUrl && (
                <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden mb-4 border border-purple-500/25 shadow-lg bg-[#110522]">
                  <img
                    src={currentSlide.imageUrl}
                    alt={currentSlide.title}
                    className="w-full h-full object-cover pointer-events-none"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d031c] via-transparent to-transparent opacity-60" />
                </div>
              )}

              {/* Title & Narrative */}
              <div className="space-y-2">
                <h3 className="font-display text-2xl sm:text-3xl text-purple-50 font-semibold leading-tight">
                  {currentSlide.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-purple-200/90 leading-relaxed font-normal">
                  {currentSlide.description}
                </p>
              </div>

              {/* Dot Indicators */}
              <div className="flex items-center justify-center gap-1.5 mt-5 pt-3 border-t border-purple-500/15">
                {memorySlides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      audioEngine.playStarGlimmer();
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'w-7 bg-gradient-to-r from-pink-400 to-purple-400 shadow-[0_0_10px_#f0abfc]'
                        : 'w-1.5 bg-purple-600/40 hover:bg-purple-400/60'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center justify-between w-full mt-4 px-2">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1.5 font-heading text-xs font-medium tracking-wide px-5 py-2.5 rounded-full border border-purple-500/25 bg-[#140626]/80 text-purple-200 hover:text-white transition-all active:scale-95 shadow-md touch-manipulation"
          >
            Previous
          </button>

          <span className="font-heading text-xs text-purple-300/70 font-medium">
            {currentIndex + 1} of {memorySlides.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 font-heading text-xs font-semibold tracking-wide px-6 py-2.5 rounded-full border border-purple-400/40 bg-gradient-to-r from-purple-800 to-pink-600 text-white hover:from-purple-700 hover:to-pink-500 transition-all active:scale-95 shadow-xl touch-manipulation"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};
