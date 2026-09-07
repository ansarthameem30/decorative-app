export type CursorVariant = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface MemoryCard {
  id: string;
  title: string;
  date?: string;
  snippet: string;
  photo?: string;
  detail?: string;
}

export interface InsideJoke {
  id: string;
  teaser: string;
  punchline: string;
  reaction?: string;
}

export interface GardenPlace {
  id: string;
  name: string;
  subtext: string;
  memory: string;
  photo?: string;
  flowerType: 'amethyst' | 'orchid' | 'lavender' | 'moonflower';
}

export interface FireflySecret {
  id: string;
  hint: string;
  secret: string;
}

export interface ReasonStar {
  id: string;
  number: number;
  short: string;
  full: string;
  x: number; // coordinates relative to 100x100 heart viewBox
  y: number;
}

export interface WishStar {
  id: string;
  text: string;
  author: 'you' | 'her';
  timestamp: number;
  x?: number;
  y?: number;
}

export interface JourneyState {
  entryUnlocked: boolean;
  currentSection: number;
  discovered: {
    beginningSpell: string[];
    laughingPotion: string[];
    secretGarden: string[];
    fireflies: string[];
  };
  discoveredCount: number;
  hiddenRealmUnlocked: boolean;
  wishesAdded: WishStar[];
  finalMessageSeen: boolean;
  herSpell: string | null;
  audioEnabled: boolean;
}

export interface ContentConfig {
  herName: string;
  yourName: string;
  heroSubtitle: string;
  beginningSpells: MemoryCard[];
  insideJokes: InsideJoke[];
  gardenPlaces: GardenPlace[];
  fireflySecrets: FireflySecret[];
  reasons: ReasonStar[];
  hiddenRealmMotif: {
    clue: string;
    title: string;
    message: string;
  };
  preSeededWishes: WishStar[];
  finalClimax: {
    lines: string[];
    peakLine: string;
    closingVow: string;
  };
}
