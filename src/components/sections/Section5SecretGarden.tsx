import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../../context/JourneyContext';
import { contentConfig } from '../../config/content';
import { GardenPlace, FireflySecret } from '../../types';
import { audioEngine } from '../../services/audioEngine';

export const Section5SecretGarden: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedPlace, setSelectedPlace] = useState<GardenPlace | null>(null);
  const [caughtFirefly, setCaughtFirefly] = useState<FireflySecret | null>(null);

  const { isItemDiscovered, discoverItem } = useJourney();

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const totalDist = rect.height + windowHeight;
      const current = windowHeight - rect.top;
      const prog = Math.max(0, Math.min(1, current / totalDist));
      setScrollProgress(prog);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFlowerClick = (place: GardenPlace) => {
    setSelectedPlace(place);
    discoverItem('secretGarden', place.id);
    audioEngine.playStarGlimmer();
  };

  const handleFireflyClick = (ff: FireflySecret) => {
    setCaughtFirefly(ff);
    discoverItem('fireflies', ff.id);
    audioEngine.playFireflyCatch();
  };

  const pathLength = 1400;
  const strokeOffset = pathLength * (1 - Math.min(1, scrollProgress * 1.35));

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[135vh] py-20 sm:py-28 px-4 sm:px-14 flex flex-col items-center justify-start select-none overflow-hidden"
    >
      {/* Deep Amethyst Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-5 sm:left-10 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-purple-900/10 blur-[110px]" />
        <div className="absolute bottom-1/4 right-5 sm:right-10 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-fuchsia-950/10 blur-[110px]" />
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mb-12 sm:mb-16 z-10 px-2">
        <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.3em] text-purple-400/80 uppercase block mb-2 sm:mb-3">
          Chapter IV · The Secret Sanctuary
        </span>
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-normal text-purple-100 text-glow">
          Where Our Memories Rooted
        </h2>
        <p className="font-sans text-xs sm:text-sm text-purple-200/60 mt-3 sm:mt-4 max-w-md mx-auto leading-relaxed font-light">
          With each scroll increment, celestial vines branch toward the sanctuaries we hold sacred. Touch each blooming node and wandering light.
        </p>
      </div>

      {/* Roaming Starlight Embers */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {contentConfig.fireflySecrets.map((ff, i) => {
          const isCaught = isItemDiscovered('fireflies', ff.id);
          const xPositions = [18, 80, 50];
          const yPositions = [30, 52, 75];

          return (
            <motion.div
              key={ff.id}
              animate={{
                x: [0, 20, -15, 10, 0],
                y: [0, -20, 12, -12, 0],
                opacity: [0.4, 0.9, 0.5, 0.9, 0.4],
              }}
              transition={{
                repeat: Infinity,
                duration: 7 + i * 2,
                ease: 'easeInOut',
              }}
              style={{
                left: `${xPositions[i]}%`,
                top: `${yPositions[i]}%`,
              }}
              className="absolute pointer-events-auto cursor-pointer p-4 touch-manipulation"
              onClick={() => handleFireflyClick(ff)}
            >
              <div className="relative flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-amber-100 shadow-[0_0_12px_#fde047]" />
                <div className="absolute inset-0 rounded-full border border-amber-300/40 animate-ping" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Botanical Botanical Vine SVG - Mobile Responsive Portrait S-Curve */}
      <div className="relative w-full max-w-3xl z-20 my-auto h-[600px] sm:h-[720px]">
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 600 700"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Luminous Hairline Vine Path */}
          <path
            d="M 160 40 Q 300 120 400 80 T 500 190 T 260 360 T 480 520 T 180 660"
            stroke="#c084fc"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={strokeOffset}
            className="transition-all duration-150 filter drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]"
          />

          <path
            d="M 400 80 Q 460 40 490 60"
            stroke="#a78bfa"
            strokeWidth="1"
            strokeDasharray="200"
            strokeDashoffset={Math.max(0, 200 - scrollProgress * 300)}
            opacity="0.4"
          />
          <path
            d="M 260 360 Q 180 320 150 350"
            stroke="#a78bfa"
            strokeWidth="1"
            strokeDasharray="200"
            strokeDashoffset={Math.max(0, 200 - scrollProgress * 300)}
            opacity="0.4"
          />
        </svg>

        {/* 4 Blooming Nodes along vine - Mobile Ergonomic Coordinates */}
        {[
          { place: contentConfig.gardenPlaces[0], top: '10%', left: '50%' },
          { place: contentConfig.gardenPlaces[1], top: '27%', left: '78%' },
          { place: contentConfig.gardenPlaces[2], top: '51%', left: '38%' },
          { place: contentConfig.gardenPlaces[3], top: '75%', left: '72%' },
        ].map(({ place, top, left }, idx) => {
          const isDiscovered = isItemDiscovered('secretGarden', place.id);
          const bloomThreshold = 0.12 + idx * 0.18;
          const isBloomed = scrollProgress >= bloomThreshold;

          return (
            <div
              key={place.id}
              style={{ top, left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group p-2 touch-manipulation"
              onClick={() => isBloomed && handleFlowerClick(place)}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isBloomed ? 1 : 0.3,
                  opacity: isBloomed ? 1 : 0.3,
                }}
                whileHover={{ scale: isBloomed ? 1.15 : 1 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex flex-col items-center"
              >
                {/* Botanical Blossom Glyph */}
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
                  {[0, 60, 120, 180, 240, 300].map((angle) => (
                    <div
                      key={angle}
                      className="absolute w-3.5 h-6 sm:w-4 sm:h-7 origin-bottom rounded-full bg-gradient-to-t from-purple-900/80 via-purple-500/40 to-purple-200/60 border border-purple-400/30"
                      style={{
                        transform: `rotate(${angle}deg)`,
                        bottom: '50%',
                      }}
                    />
                  ))}
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-100 shadow-[0_0_10px_#fde047] z-10" />
                </div>

                {/* Location Name Tag */}
                <div className="mt-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#120724]/90 border border-purple-500/25 text-purple-200 text-[8px] sm:text-[10px] font-cinzel tracking-wider uppercase backdrop-blur-md shadow-xl whitespace-nowrap">
                  {place.name} {isDiscovered && "✦"}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Sanctuary Detail Modal (Mobile Bottom Sheet + Desktop Center) */}
      <AnimatePresence>
        {selectedPlace && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/85 backdrop-blur-xl"
            onClick={() => setSelectedPlace(null)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full sm:max-w-lg mobile-bottom-sheet sm:rounded-3xl p-6 sm:p-10 shadow-2xl text-left border-t sm:border border-purple-400/30 max-h-[90dvh] overflow-y-auto"
            >
              <div className="sm:hidden w-12 h-1 bg-purple-400/30 rounded-full mx-auto mb-5" />

              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute top-5 right-5 text-purple-400/60 hover:text-white transition-colors text-sm font-sans focus:outline-none"
              >
                ✕
              </button>

              <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.3em] uppercase text-purple-400/80 block mb-1.5">
                Sanctuary · {selectedPlace.subtext}
              </span>

              <h3 className="font-display text-2xl sm:text-4xl text-purple-100 font-bold mb-3 text-glow">
                {selectedPlace.name}
              </h3>

              <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/40 border border-purple-500/20 my-4">
                <p className="font-display text-base sm:text-lg text-purple-200/90 leading-relaxed italic">
                  "{selectedPlace.memory}"
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-purple-300/70 pt-3 border-t border-purple-500/20">
                <span className="font-cinzel tracking-widest uppercase text-[9px] sm:text-[10px]">
                  Anchored in Time
                </span>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="font-cinzel text-[10px] sm:text-xs tracking-[0.2em] uppercase px-5 py-2 rounded-full border border-purple-400/30 text-purple-200 hover:text-white bg-purple-900/40 transition-colors"
                >
                  Continue Wandering
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Caught Light Mote Secret Modal (Mobile Bottom Sheet + Desktop Center) */}
      <AnimatePresence>
        {caughtFirefly && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/85 backdrop-blur-xl"
            onClick={() => setCaughtFirefly(null)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full sm:max-w-md mobile-bottom-sheet sm:rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(253,224,71,0.15)] border-t sm:border border-amber-300/30"
            >
              <div className="sm:hidden w-12 h-1 bg-amber-300/30 rounded-full mx-auto mb-5" />

              <div className="w-2.5 h-2.5 rounded-full bg-amber-100 shadow-[0_0_15px_#fde047] mx-auto mb-3" />
              <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.3em] uppercase text-amber-200/90 block mb-2">
                A Whispered Starlight Secret
              </span>
              <p className="font-display text-lg sm:text-xl text-purple-100 italic leading-relaxed my-4">
                "{caughtFirefly.secret}"
              </p>
              <button
                onClick={() => setCaughtFirefly(null)}
                className="font-cinzel text-[10px] sm:text-xs tracking-[0.2em] uppercase px-6 py-2 rounded-full border border-amber-300/30 text-amber-200 hover:text-white transition-colors"
              >
                Release gently ✦
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
