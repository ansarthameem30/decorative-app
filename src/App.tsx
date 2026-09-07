import React, { useState, useRef } from 'react';
import { ParticleField } from './components/shared/ParticleField';
import { CursorTrail } from './components/shared/CursorTrail';
import { ProposalHero } from './components/proposal/ProposalHero';
import { StoryTimeline } from './components/proposal/StoryTimeline';
import { StarlightMiniGame } from './components/proposal/StarlightMiniGame';
import { WishingSkySection } from './components/proposal/WishingSkySection';
import { ReasonsGrid } from './components/proposal/ReasonsGrid';
import { ProposalQuestion } from './components/proposal/ProposalQuestion';
import { CelebrationModal } from './components/proposal/CelebrationModal';
import { ProposalStudioModal } from './components/proposal/ProposalStudioModal';
import { getStoredProposalConfig } from './config/proposalContent';
import { isGiftModeActive } from './utils/proposalShare';
import { ProposalConfig } from './types/proposal';
import { audioEngine } from './services/audioEngine';

export default function App() {
  const [config, setConfig] = useState<ProposalConfig>(getStoredProposalConfig);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showStudio, setShowStudio] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);

  // Check if opened as her surprise gift (?gift=1) to hide creator controls
  const isGift = isGiftModeActive();

  const heroRef = useRef<HTMLDivElement | null>(null);
  const storyRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<HTMLDivElement | null>(null);
  const wishingRef = useRef<HTMLDivElement | null>(null);
  const reasonsRef = useRef<HTMLDivElement | null>(null);
  const proposalRef = useRef<HTMLDivElement | null>(null);

  const handleExploreStory = () => {
    storyRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSayYes = () => {
    setShowCelebration(true);
  };

  const handleToggleAudio = () => {
    const active = audioEngine.toggleAudio();
    setIsAudioActive(active);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#05010a] text-[#f8f6fc] overflow-x-hidden selection:bg-purple-600/30 selection:text-purple-100 antialiased">
      {/* Dynamic Interactive Volumetric Cosmos Background */}
      <ParticleField />

      {/* Fluid Swiping Starlight Ribbon Cursor Trail & Touch Particles */}
      <CursorTrail />

      {/* Minimal Luxury Top Bar */}
      <header className="fixed top-3 inset-x-0 z-40 px-4 sm:px-8 flex items-center justify-between pointer-events-none">
        <span className="pointer-events-auto font-heading text-xs tracking-widest text-purple-200/90 uppercase font-semibold">
          Our Mikrokosmos
        </span>

        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          {/* Proposal Studio Creator Pill (Hidden for girlfriend when opened via gift link) */}
          {!isGift && (
            <button
              onClick={() => setShowStudio(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18062d]/90 hover:bg-[#250942] border border-pink-400/40 text-pink-200 text-xs font-heading font-medium tracking-wide backdrop-blur-xl transition-all shadow-[0_0_20px_rgba(240,171,252,0.2)] active:scale-95 touch-manipulation"
              title="Personalize names, photos, and copy her surprise link"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
              <span>Customize</span>
            </button>
          )}

          {/* Audio Ballad Player */}
          <button
            onClick={handleToggleAudio}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#120422]/90 hover:bg-[#1c0836] border border-purple-500/30 text-purple-200 text-xs font-heading font-medium tracking-wide backdrop-blur-xl transition-all shadow-lg active:scale-95 touch-manipulation"
          >
            {isAudioActive ? (
              <>
                <span className="flex items-center gap-0.5">
                  <span className="w-[2px] h-2.5 bg-pink-300 animate-pulse" />
                  <span className="w-[2px] h-3.5 bg-pink-300 animate-pulse delay-75" />
                  <span className="w-[2px] h-2 bg-pink-300 animate-pulse delay-150" />
                </span>
                <span className="text-[11px]">Ballad Playing</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span className="text-[11px]">Play Ballad</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Proposal Experience - 6 Unique Vertical Interactive Concepts */}
      <main className="relative z-10 w-full flex flex-col">
        {/* Concept 1: The Luminous BTS Mikrokosmos Entrance */}
        <div ref={heroRef} className="w-full">
          <ProposalHero
            config={config}
            onExploreStory={handleExploreStory}
          />
        </div>

        {/* Concept 2: Horizontal Sliding Memory Reel (Zero Browser Scrollbars) */}
        <div ref={storyRef} className="w-full">
          <StoryTimeline
            slides={config.storySlides}
          />
        </div>

        {/* Concept 3: Interactive 7-Stars Celestial Mini-Game */}
        <div ref={gameRef} className="w-full">
          <StarlightMiniGame
            stars={config.gameStars}
            onComplete={() => audioEngine.playStarGlimmer()}
          />
        </div>

        {/* Concept 4: Interactive Wishing Sky & Floating Starlight Lanterns */}
        <div ref={wishingRef} className="w-full">
          <WishingSkySection />
        </div>

        {/* Concept 5: Direct Open Cards of Love (Why It Has Always Been You) */}
        <div ref={reasonsRef} className="w-full">
          <ReasonsGrid
            reasons={config.reasons}
          />
        </div>

        {/* Concept 6: The Grand Proposal with 3D Diamond Solitaire Ring */}
        <div ref={proposalRef} className="w-full">
          <ProposalQuestion
            config={config}
            onSayYes={handleSayYes}
          />
        </div>
      </main>

      {/* Celebration Supernova Modal */}
      {showCelebration && (
        <CelebrationModal
          config={config}
          onClose={() => setShowCelebration(false)}
        />
      )}

      {/* Luxury Proposal Studio Modal */}
      {showStudio && (
        <ProposalStudioModal
          config={config}
          onSave={(updated) => setConfig(updated)}
          onClose={() => setShowStudio(false)}
        />
      )}
    </div>
  );
}
