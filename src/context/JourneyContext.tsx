import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { JourneyState, WishStar } from '../types';
import { contentConfig } from '../config/content';
import { audioEngine } from '../services/audioEngine';

interface JourneyContextType {
  journeyState: JourneyState;
  unlockEntry: () => void;
  setCurrentSection: (section: number) => void;
  discoverItem: (category: 'beginningSpell' | 'laughingPotion' | 'secretGarden' | 'fireflies', id: string) => void;
  addWish: (text: string) => void;
  setHerSpell: (text: string) => void;
  setFinalMessageSeen: () => void;
  toggleAudio: () => void;
  isItemDiscovered: (category: 'beginningSpell' | 'laughingPotion' | 'secretGarden' | 'fireflies', id: string) => boolean;
}

const TOTAL_KEY_ITEMS = contentConfig.beginningSpells.length + contentConfig.insideJokes.length + contentConfig.gardenPlaces.length; // 5 + 6 + 4 = 15

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export const JourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [journeyState, setJourneyState] = useState<JourneyState>({
    entryUnlocked: false,
    currentSection: 1,
    discovered: {
      beginningSpell: [],
      laughingPotion: [],
      secretGarden: [],
      fireflies: [],
    },
    discoveredCount: 0,
    hiddenRealmUnlocked: false,
    wishesAdded: contentConfig.preSeededWishes,
    finalMessageSeen: false,
    herSpell: null,
    audioEnabled: false,
  });

  const unlockEntry = () => {
    setJourneyState(prev => ({
      ...prev,
      entryUnlocked: true,
      currentSection: 2,
    }));
  };

  const setCurrentSection = (section: number) => {
    setJourneyState(prev => {
      if (prev.currentSection === section) return prev;
      
      // Dynamic audio response based on section
      if (prev.audioEnabled) {
        if (section === 9) {
          audioEngine.swellClimax();
        } else if (section === 10) {
          audioEngine.settlePeaceful();
        }
      }

      return {
        ...prev,
        currentSection: section,
      };
    });
  };

  const discoverItem = (category: 'beginningSpell' | 'laughingPotion' | 'secretGarden' | 'fireflies', id: string) => {
    setJourneyState(prev => {
      const existing = prev.discovered[category];
      if (existing.includes(id)) return prev;

      const updatedCategory = [...existing, id];
      const updatedDiscovered = {
        ...prev.discovered,
        [category]: updatedCategory,
      };

      // Count only main discoverables towards the Easter egg unlock
      const totalDiscovered =
        updatedDiscovered.beginningSpell.length +
        updatedDiscovered.laughingPotion.length +
        updatedDiscovered.secretGarden.length;

      const progressRatio = totalDiscovered / TOTAL_KEY_ITEMS;
      const isUnlocked = progressRatio >= 0.70; // 70%+ unlocks the hidden realm

      return {
        ...prev,
        discovered: updatedDiscovered,
        discoveredCount: totalDiscovered,
        hiddenRealmUnlocked: isUnlocked,
      };
    });
  };

  const isItemDiscovered = (category: 'beginningSpell' | 'laughingPotion' | 'secretGarden' | 'fireflies', id: string) => {
    return journeyState.discovered[category].includes(id);
  };

  const addWish = (text: string) => {
    const newWish: WishStar = {
      id: `wish-${Date.now()}`,
      text: text.trim(),
      author: 'her',
      timestamp: Date.now(),
      x: Math.floor(Math.random() * 60) + 20,
      y: Math.floor(Math.random() * 40) + 25,
    };

    setJourneyState(prev => ({
      ...prev,
      wishesAdded: [newWish, ...prev.wishesAdded],
    }));

    audioEngine.playStarGlimmer();
  };

  const setHerSpell = (text: string) => {
    setJourneyState(prev => ({
      ...prev,
      herSpell: text,
    }));
    audioEngine.playStarGlimmer();
  };

  const setFinalMessageSeen = () => {
    setJourneyState(prev => ({
      ...prev,
      finalMessageSeen: true,
    }));
  };

  const toggleAudio = async () => {
    const active = audioEngine.toggleAudio();
    setJourneyState(prev => ({
      ...prev,
      audioEnabled: active,
    }));
  };

  return (
    <JourneyContext.Provider
      value={{
        journeyState,
        unlockEntry,
        setCurrentSection,
        discoverItem,
        addWish,
        setHerSpell,
        setFinalMessageSeen,
        toggleAudio,
        isItemDiscovered,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = () => {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
};
