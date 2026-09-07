import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { contentConfig } from '../../config/content';

export const Section6StarlitPromises: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeReason, setActiveReason] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const scrollableDist = rect.height - windowHeight;
      const current = -rect.top;
      const prog = Math.max(0, Math.min(1, current / (scrollableDist || 1)));
      setScrollProgress(prog);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalReasons = contentConfig.reasons.length;
  const visibleCount = Math.min(
    totalReasons,
    Math.floor(scrollProgress * (totalReasons + 1))
  );

  const isComplete = visibleCount >= totalReasons;

  return (
    <div ref={containerRef} className="relative w-full h-[220vh] select-none">
      <div className="sticky top-0 w-full h-screen-dvh flex flex-col items-center justify-between p-4 sm:p-8 md:p-12 overflow-hidden">
        {/* Header */}
        <div className="text-center max-w-xl z-10 pt-2 sm:pt-4 px-2">
          <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.3em] text-purple-400/80 uppercase block mb-1.5 sm:mb-2">
            Chapter V · Starlit Promises
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-purple-100 text-glow">
            Constellation of Devotion
          </h2>
          <p className="font-sans text-[11px] sm:text-xs text-purple-200/60 mt-1.5 font-light">
            Scroll gently. With each turn of the stars, another vow connects into place ({visibleCount}/{totalReasons}).
          </p>
        </div>

        {/* Celestial Heart Geometry Frame - Responsively Scaled */}
        <div className="relative w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] md:w-[460px] md:h-[460px] aspect-square flex items-center justify-center my-auto">
          {/* Concentric astronomical coordinate rings */}
          <div className="absolute inset-4 sm:inset-8 rounded-full border border-purple-500/10 pointer-events-none" />
          <div className="absolute inset-12 sm:inset-20 rounded-full border border-dashed border-purple-500/10 pointer-events-none" />

          <svg
            viewBox="0 0 100 100"
            className="w-full h-full overflow-visible"
            fill="none"
          >
            {/* Connecting Star Chart Lines */}
            {contentConfig.reasons.map((star, idx) => {
              if (idx === 0) return null;
              const prevStar = contentConfig.reasons[idx - 1];
              const isLineVisible = visibleCount > idx;

              return (
                <motion.line
                  key={`line-${idx}`}
                  x1={prevStar.x}
                  y1={prevStar.y}
                  x2={star.x}
                  y2={star.y}
                  stroke={isComplete ? '#f0abfc' : '#a78bfa'}
                  strokeWidth="0.8"
                  strokeDasharray="2 1.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: isLineVisible ? 1 : 0,
                    opacity: isLineVisible ? (isComplete ? 0.9 : 0.6) : 0,
                  }}
                  transition={{ duration: 0.6 }}
                  className={isComplete ? 'filter drop-shadow-[0_0_4px_#f0abfc]' : ''}
                />
              );
            })}

            {/* Closing Line */}
            {isComplete && (
              <motion.line
                x1={contentConfig.reasons[totalReasons - 1].x}
                y1={contentConfig.reasons[totalReasons - 1].y}
                x2={contentConfig.reasons[0].x}
                y2={contentConfig.reasons[0].y}
                stroke="#f0abfc"
                strokeWidth="0.8"
                strokeDasharray="2 1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.9 }}
                transition={{ duration: 0.8 }}
                className="filter drop-shadow-[0_0_4px_#f0abfc]"
              />
            )}
          </svg>

          {/* Interactive Star Nodes with Generous Touch Tap Targets */}
          {contentConfig.reasons.map((star, idx) => {
            const isVisible = visibleCount > idx;
            const isHovered = activeReason === star.number;

            return (
              <div
                key={star.id}
                style={{ left: `${star.x}%`, top: `${star.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 touch-manipulation"
                onMouseEnter={() => isVisible && setActiveReason(star.number)}
                onMouseLeave={() => setActiveReason(null)}
                onClick={() => isVisible && setActiveReason(star.number === activeReason ? null : star.number)}
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: isVisible ? (isHovered ? 1.4 : isComplete ? 1.15 : 1) : 0,
                    opacity: isVisible ? 1 : 0,
                  }}
                  transition={{ duration: 0.4 }}
                  className="relative cursor-pointer p-3 sm:p-2 flex items-center justify-center group"
                >
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      isComplete
                        ? 'bg-fuchsia-100 shadow-[0_0_12px_#f0abfc]'
                        : 'bg-purple-200 shadow-[0_0_8px_#a78bfa]'
                    }`}
                  />
                  {isComplete && (
                    <div className="absolute inset-0 rounded-full border border-fuchsia-300/40 animate-ping" />
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Active Reason Callout Display */}
        <div className="z-20 w-full max-w-lg min-h-[90px] flex items-center justify-center text-center px-3 pb-4">
          {activeReason !== null ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full p-3 sm:p-4 rounded-2xl bg-[#120724]/95 border border-purple-400/30 backdrop-blur-xl shadow-2xl"
            >
              <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.25em] text-purple-400 uppercase">
                Vow {activeReason.toString().padStart(2, '0')} · {contentConfig.reasons[activeReason - 1].short}
              </span>
              <p className="font-display text-base sm:text-lg text-purple-100 italic mt-1 leading-relaxed">
                "{contentConfig.reasons[activeReason - 1].full}"
              </p>
            </motion.div>
          ) : isComplete ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-cinzel text-[10px] sm:text-xs tracking-[0.2em] text-purple-300 uppercase px-2"
            >
              The Constellation is Sealed · Touch any node to reflect upon our vows
            </motion.div>
          ) : (
            <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.25em] text-purple-400/50 uppercase">
              Descend to link the celestial coordinates...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
