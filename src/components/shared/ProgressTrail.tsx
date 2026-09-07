import React from 'react';
import { useJourney } from '../../context/JourneyContext';

interface ProgressTrailProps {
  onNavigate: (sectionNum: number) => void;
}

const SECTIONS = [
  { num: 1, roman: "I", label: "Threshold" },
  { num: 2, roman: "II", label: "The Cosmos" },
  { num: 3, roman: "III", label: "Convergence" },
  { num: 4, roman: "IV", label: "Whispers" },
  { num: 5, roman: "V", label: "The Sanctuary" },
  { num: 6, roman: "VI", label: "The Vow" },
  { num: 7, roman: "VII", label: "The Enigma" },
  { num: 8, roman: "VIII", label: "The Wishing Sky" },
  { num: 9, roman: "IX", label: "The Enchantment" },
  { num: 10, roman: "X", label: "Epilogue" },
];

export const ProgressTrail: React.FC<ProgressTrailProps> = ({ onNavigate }) => {
  const { journeyState } = useJourney();
  const { currentSection, entryUnlocked, discoveredCount, hiddenRealmUnlocked } = journeyState;

  if (!entryUnlocked) return null;

  return (
    <>
      {/* Desktop side progress trail: minimal, architectural, luxury */}
      <aside aria-label="Journey progress" className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3 pointer-events-auto">
        {/* Archive Discovery Counter */}
        <div className="text-[10px] font-cinzel tracking-[0.25em] uppercase text-purple-300/80 px-3 py-1 rounded-full bg-[#120824]/90 border border-purple-500/20 backdrop-blur-md shadow-2xl mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          <span>{discoveredCount} / 15 Discovered</span>
        </div>

        {/* Minimal Timeline */}
        <div className="relative flex flex-col items-center py-2">
          <div className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-purple-500/30 to-transparent" />

          {SECTIONS.map((sec) => {
            const isCurrent = currentSection === sec.num;
            const isPassed = currentSection > sec.num;
            const isSecretLocked = sec.num === 7 && !hiddenRealmUnlocked;

            return (
              <button
                key={sec.num}
                onClick={() => onNavigate(sec.num)}
                className="group relative my-2.5 flex items-center justify-end transition-all duration-300 focus:outline-none"
              >
                {/* Title revealed on hover */}
                <span className="absolute right-7 font-cinzel text-[11px] tracking-[0.2em] uppercase text-purple-200/90 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 px-2.5 py-0.5 rounded bg-[#150a28]/95 border border-purple-500/20 shadow-xl backdrop-blur-md">
                  {sec.roman} · {sec.label} {isSecretLocked && "✦ Locked"}
                </span>

                {/* Geometric indicator marker */}
                <div
                  className={`relative flex items-center justify-center transition-all duration-300 ${
                    isCurrent
                      ? 'w-6 h-6 rounded-full border border-purple-300/80 bg-purple-950/80 shadow-[0_0_12px_rgba(192,132,252,0.8)]'
                      : 'w-4 h-4 rounded-full hover:border hover:border-purple-400/40'
                  }`}
                >
                  <span
                    className={`font-cinzel text-[9px] transition-colors ${
                      isCurrent
                        ? 'text-white font-bold'
                        : isPassed
                        ? 'text-purple-400/80'
                        : isSecretLocked
                        ? 'text-purple-800'
                        : 'text-purple-500/60 group-hover:text-purple-300'
                    }`}
                  >
                    {sec.roman}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Mobile bottom luxury status pill with safe-area inset */}
      <nav
        aria-label="Mobile journey progress"
        className="lg:hidden fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-40 px-4 py-1.5 rounded-full bg-[#120824]/95 border border-purple-500/30 backdrop-blur-xl shadow-2xl flex items-center gap-3 text-xs pointer-events-auto"
      >
        <span className="font-cinzel text-[11px] tracking-[0.2em] text-purple-200">
          PART {SECTIONS[currentSection - 1]?.roman || 'I'}
        </span>
        <div className="w-[1px] h-3 bg-purple-600/30" />
        <span className="text-[10px] font-sans tracking-wider text-purple-300/70">
          {discoveredCount}/15 UNVEILED
        </span>
      </nav>
    </>
  );
};
