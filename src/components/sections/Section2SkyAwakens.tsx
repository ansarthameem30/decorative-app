import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useJourney } from '../../context/JourneyContext';
import { contentConfig } from '../../config/content';

interface Section2Props {
  onScrollNext: () => void;
}

const DISTANT_OBJECTS = [
  { id: 'c1', name: 'Hourglass of First Looks', coord: 'RA 18h 36m · Dec +38°', x: '20%', y: '30%' },
  { id: 'c2', name: 'Serenade at 03:42 AM', coord: 'RA 20h 12m · Dec +42°', x: '80%', y: '24%' },
  { id: 'c3', name: 'The Laughing Corona', coord: 'RA 16h 44m · Dec -12°', x: '78%', y: '68%' },
  { id: 'c4', name: 'Haven of Silent Sanctuaries', coord: 'RA 12h 26m · Dec +28°', x: '22%', y: '70%' },
  { id: 'c5', name: 'The Twin Orbit of Us', coord: 'RA 00h 42m · Dec +41°', x: '50%', y: '38%' },
];

export const Section2SkyAwakens: React.FC<Section2Props> = ({ onScrollNext }) => {
  const { journeyState, toggleAudio } = useJourney();
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);

  return (
    <section className="relative w-full h-screen-dvh flex flex-col items-center justify-between p-4 sm:p-8 select-none overflow-hidden">
      {/* Audio Affordance Button */}
      <div className="w-full flex justify-end items-center z-30 pt-2 pr-1">
        <button
          onClick={toggleAudio}
          className="flex items-center gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#120724]/80 border border-purple-500/25 text-purple-200/80 hover:text-white text-[9px] sm:text-[10px] font-cinzel tracking-[0.2em] uppercase backdrop-blur-md transition-all hover:border-purple-400/50 shadow-xl"
        >
          {journeyState.audioEnabled ? (
            <>
              <span className="flex items-center gap-0.5">
                <span className="w-[1px] h-2.5 bg-purple-300 animate-pulse" />
                <span className="w-[1px] h-3.5 bg-purple-300 animate-pulse delay-75" />
                <span className="w-[1px] h-2 bg-purple-300 animate-pulse delay-150" />
              </span>
              <span>Audio On</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60" />
              <span>Tap for Sound</span>
            </>
          )}
        </button>
      </div>

      {/* Interactive Celestial Coordinate Anchors */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {DISTANT_OBJECTS.map((obj) => (
          <div
            key={obj.id}
            style={{ left: obj.x, top: obj.y }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group p-2"
            onMouseEnter={() => setHoveredObject(obj.id)}
            onMouseLeave={() => setHoveredObject(null)}
            onClick={() => setHoveredObject(hoveredObject === obj.id ? null : obj.id)}
          >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-purple-200/80 shadow-[0_0_10px_#c084fc] group-hover:scale-125 transition-transform" />
              <div className="absolute inset-0 rounded-full border border-purple-500/20 group-hover:border-purple-400/50 transition-colors" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{
                opacity: hoveredObject === obj.id ? 1 : 0,
                y: hoveredObject === obj.id ? 0 : 4,
              }}
              className="absolute left-1/2 -translate-x-1/2 -bottom-8 px-2.5 py-1 rounded bg-[#100520]/95 border border-purple-500/30 text-[9px] text-purple-200 whitespace-nowrap shadow-2xl backdrop-blur-md pointer-events-none flex flex-col items-center gap-0.5"
            >
              <span className="font-cinzel tracking-wider uppercase font-semibold text-purple-100">{obj.name}</span>
              <span className="font-sans text-[7px] text-purple-400/70 tracking-widest">{obj.coord}</span>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Main Celestial Quote Layout */}
      <div className="z-20 text-center max-w-3xl my-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-4 sm:mb-6"
        >
          <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.35em] uppercase text-purple-400/70">
            Chapter I · The Celestial Awakening
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="font-display text-3xl sm:text-5xl md:text-7xl text-purple-100 font-normal leading-[1.2] text-glow"
        >
          "{contentConfig.heroSubtitle}"
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7 }}
          className="font-sans text-xs sm:text-sm text-purple-200/60 mt-4 sm:mt-6 max-w-md mx-auto leading-relaxed font-light tracking-wide px-2"
        >
          Drift among the coordinates before you descend. Each point of light marks a memory anchored in our sky.
        </motion.p>
      </div>

      {/* Minimal Scroll Cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="z-20 flex flex-col items-center pb-3 cursor-pointer group"
        onClick={onScrollNext}
      >
        <span className="font-cinzel text-[9px] sm:text-[10px] text-purple-400/60 tracking-[0.25em] uppercase group-hover:text-purple-200 transition-colors">
          Descend into our story
        </span>
        <span className="text-purple-400 text-xs mt-1.5 group-hover:translate-y-1 transition-transform">
          ↓
        </span>
      </motion.div>
    </section>
  );
};
