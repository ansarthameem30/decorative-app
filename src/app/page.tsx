'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ParticleField } from '@/components/shared/ParticleField';
import { CursorTrail } from '@/components/shared/CursorTrail';
import { ProposalHero } from '@/components/proposal/ProposalHero';
import { StoryTimeline } from '@/components/proposal/StoryTimeline';
import { StarlightMiniGame } from '@/components/proposal/StarlightMiniGame';
import { WishingSkySection } from '@/components/proposal/WishingSkySection';
import { InteractiveReasons } from '@/components/proposal/InteractiveReasons';
import { TimeCapsuleSection } from '@/components/proposal/TimeCapsuleSection';
import { PillarsOfTomorrow } from '@/components/proposal/PillarsOfTomorrow';
import { ProposalQuestion } from '@/components/proposal/ProposalQuestion';
import { CelebrationModal } from '@/components/proposal/CelebrationModal';
import { RoyalRibbonEntrance } from '@/components/proposal/RoyalRibbonEntrance';
import { defaultProposalConfig } from '@/config/proposalContent';
import { ProposalConfig } from '@/types/proposal';
import { audioEngine } from '@/services/audioEngine';

export default function ProposalMainPage() {
  const [config, setConfig] = useState<ProposalConfig>(defaultProposalConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [isClientReady, setIsClientReady] = useState(false);
  const [hasCutRibbon, setHasCutRibbon] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);

  const heroRef = useRef<HTMLDivElement | null>(null);
  const storyRef = useRef<HTMLDivElement | null>(null);

  // Check localStorage immediately on client mount so unlocked users never see the ribbon entrance flash
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('reset') === '1' || urlParams.get('entrance') === '1') {
          localStorage.removeItem('mikrokosmos_unlocked');
          setHasCutRibbon(false);
        } else {
          const savedUnlocked = localStorage.getItem('mikrokosmos_unlocked');
          if (savedUnlocked === 'true') {
            setHasCutRibbon(true);
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage access not available:', e);
    } finally {
      setIsClientReady(true);
    }
  }, []);

  // Strictly lock viewport and body scroll while entrance seal is active (zero vertical scroll leak!)
  useEffect(() => {
    if (!isClientReady) return;

    if (!hasCutRibbon) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100dvh';
      document.body.style.touchAction = 'none';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100dvh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    };
  }, [hasCutRibbon, isClientReady]);

  // Fetch proposal configuration from Supabase via Next.js API
  useEffect(() => {
    async function fetchConfig() {
      const startTime = performance.now();
      try {
        const res = await fetch('/api/config');
        const data = await res.json();
        if (data.config) {
          setConfig(data.config);
          if (data.config.bgmUrl) {
            audioEngine.setCustomAudioUrl(data.config.bgmUrl);
          }
        }
      } catch (err) {
        console.warn('Could not fetch from API, using default content:', err);
      } finally {
        // Enforce minimum 1.2s for adorable theatrical loader animation
        const elapsed = performance.now() - startTime;
        const remaining = Math.max(0, 1200 - elapsed);
        setTimeout(() => {
          setIsLoading(false);
        }, remaining);
      }
    }

    fetchConfig();
  }, []);

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
    <div className={`relative w-full ${!hasCutRibbon ? 'h-screen h-[100dvh] overflow-hidden' : 'min-h-screen overflow-x-hidden'} bg-[#05010a] text-[#f8f6fc] selection:bg-purple-600/30 selection:text-purple-100 antialiased`}>
      {/* Haute-Couture Royal Ribbon & Gold Imperial Seal Entrance Ceremony */}
      {isClientReady && !hasCutRibbon && (
        <RoyalRibbonEntrance
          herName={config.herName}
          isLoading={isLoading}
          onOpenComplete={() => {
            if (typeof window !== 'undefined') {
              localStorage.setItem('mikrokosmos_unlocked', 'true');
            }
            setHasCutRibbon(true);
            setIsAudioActive(true);
          }}
        />
      )}

      {/* Dynamic Interactive Volumetric Cosmos Background */}
      <ParticleField />

      {/* Fluid Swiping Starlight Ribbon Cursor Trail & Touch Particles */}
      <CursorTrail />

      {/* Main Proposal Content - ONLY rendered when unlocked so no vertical scroll or below leak can ever occur */}
      {isClientReady && hasCutRibbon && (
        <>
          {/* Minimal Luxury Top Bar - ZERO customize/personalize buttons visible! */}
          <header className="fixed top-3 inset-x-0 z-40 px-4 sm:px-8 flex items-center justify-between pointer-events-none">
            <span className="pointer-events-auto font-heading text-xs tracking-widest text-purple-200/90 uppercase font-semibold">
              Our Mikrokosmos
            </span>

            {/* Audio Ballad Player */}
            <button
              onClick={handleToggleAudio}
              className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#120422]/90 hover:bg-[#1c0836] border border-purple-500/30 text-purple-200 text-xs font-heading font-medium tracking-wide backdrop-blur-xl transition-all shadow-lg active:scale-95 touch-manipulation"
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
          </header>

          {/* Main Proposal Experience - Complete Multi-Chapter Interactive Narrative */}
          <main className="relative z-10 w-full flex flex-col">
        {/* Chapter 01: The Luminous Entrance */}
        <div ref={heroRef} className="w-full">
          <ProposalHero
            config={config}
            onExploreStory={handleExploreStory}
          />
        </div>

        {/* Chapter 02: Horizontal Sliding Memory Reel (Zero Browser Scrollbars) */}
        <div ref={storyRef} className="w-full">
          <StoryTimeline
            slides={config.storySlides}
          />
        </div>

        {/* Chapter 03: 7-Stars Constellation Quest (Touch overlap fixed!) */}
        <div className="w-full">
          <StarlightMiniGame
            stars={config.gameStars}
            onComplete={() => audioEngine.playStarGlimmer()}
          />
        </div>

        {/* Chapter 04: The Wishing Sky & Starlight Lanterns (Touch overlap fixed!) */}
        <div className="w-full">
          <WishingSkySection />
        </div>

        {/* Chapter 05: One-by-One Interactive Love Reasons */}
        <div className="w-full">
          <InteractiveReasons
            reasons={config.reasons}
          />
        </div>

        {/* Chapter 06: The Time Capsule of Our Tomorrows */}
        <div className="w-full">
          <TimeCapsuleSection letters={config.futureLetters} />
        </div>

        {/* Chapter 07: [NEW] The Pillars of Our Tomorrow */}
        <div className="w-full">
          <PillarsOfTomorrow />
        </div>

        {/* Chapter 08: The Grand Proposal & Tiffany 3D Solitaire Diamond Ring */}
        <div className="w-full">
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
        </>
      )}
    </div>
  );
}
