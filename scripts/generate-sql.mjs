import fs from 'fs';

const defaultProposalConfig = {
  herName: "My Universe",
  yourName: "Forever Yours",
  invitationSubtitle: "Purple is the last color of the rainbow—a promise that from this very beginning, I will choose you, cherish you, and dream with you for all our tomorrows.",
  
  storySlides: [
    {
      id: "story-1",
      tag: "CHAPTER I · THE FIRST STEP",
      title: "Can We Promise To Always Choose Each Other?",
      date: "Our Beginning",
      description: "We are just beginning this beautiful chapter together, yet in my heart, I already know: I want to spend all my tomorrows learning who you are, making you smile, and choosing you every single day.",
      imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "story-2",
      tag: "CHAPTER II · 03:00 AM CONFESSIONS",
      title: "Can We Stay Up Talking Until The Stars Fade?",
      date: "Unending Conversations",
      description: "Can we promise that no matter how busy the world gets, we will always have nights where we lose track of time—sharing our deepest dreams, silly secrets, and quiet whispers under the dark purple sky?",
      imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "story-3",
      tag: "CHAPTER III · OUR PLAYFUL CHAOS",
      title: "Can We Steal Bites & Sing Off-Key on Midnight Drives?",
      date: "A Lifetime of Laughter",
      description: "I want a life filled with our beautiful, unfiltered chaos. Can we steal each other's food, laugh until our cheeks hurt, and turn even the simplest Tuesday evening into the sweetest adventure of our lives?",
      imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "story-4",
      tag: "CHAPTER IV · THE LITTLE DETAILS",
      title: "Will You Let Me Learn Every Detail About You?",
      date: "Between the Seconds",
      description: "I want to memorize how you take your coffee, the songs that make you dance when no one is watching, and what makes your eyes light up with joy. I want a lifetime to uncover every hidden wonder of your soul.",
      imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "story-5",
      tag: "CHAPTER V · THROUGH EVERY SEASON",
      title: "Can We Hold Hands Through Every Weather Life Brings?",
      date: "Spring, Autumn & Winter",
      description: "Like flowers waiting for spring, life will bring gentle rains and winter chills. But I promise: whenever the world feels overwhelming, my hand will always be reaching for yours. Can we be each other's calm in every storm?",
      imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "story-6",
      tag: "CHAPTER VI · THE CELESTIAL GAME",
      title: "The Seven Promises I Dedicate To Our Future",
      date: "Interactive Constellation",
      description: "Before we step into all the adventures ahead, gather the seven promises I want to dedicate to our lifetime together.",
      isGameSlide: true
    },
    {
      id: "story-7",
      tag: "CHAPTER VII · MIDNIGHT HORIZONS",
      title: "Can We Travel The World & Chase Every Sunset Together?",
      date: "All Our Destinations",
      description: "I want to walk through unfamiliar streets with you, watch purple sunsets over quiet oceans, and collect passport stamps and memories side-by-side. I want every horizon to have your hand in mine.",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "story-8",
      tag: "CHAPTER VIII · OUR QUIET HOME",
      title: "Can We Build A Safe Haven Full of Peace & Warmth?",
      date: "Our Sacred Space",
      description: "More than any distant place, I want to build a home with you—a sanctuary where you can always kick off your shoes, exhale after a long day, and know that you are deeply, unconditionally loved.",
      imageUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "story-9",
      tag: "CHAPTER IX · GROWING OLD TOGETHER",
      title: "Can We Grow Gray & Laugh At The Years We Create?",
      date: "Decades From Now",
      description: "I don't just want the easy beginnings; I want all the decades that follow. Can we grow old together, look back at our wildest memories with a smile, and know that our love only deepened with every passing year?",
      imageUrl: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "story-10",
      tag: "CHAPTER X · OUR MIKROKOSMOS",
      title: "Will You Take This Leap Into Forever With Me?",
      date: "Today and Always",
      description: "In a universe of seven billion lights, you are the only one I want to walk this life with. As new as we are, my heart has never been more certain. Will you build this entire future with me?",
      imageUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1000&auto=format&fit=crop"
    }
  ],

  gameStars: [
    { id: 1, title: "Your Smile", note: "I promise to spend my days looking for new reasons to make your eyes crinkle with happiness." },
    { id: 2, title: "Midnight Talks", note: "I promise to always listen—to your dreams, your fears, and your quietest 3 AM thoughts." },
    { id: 3, title: "Safe Sanctuary", note: "Whenever the world outside feels heavy, I promise to be your calm and steady shelter." },
    { id: 4, title: "Wild Adventures", note: "I promise to explore every new road with you, never letting our spark or curiosity fade." },
    { id: 5, title: "Gentle Patience", note: "As we learn each other through all the days ahead, I promise to love you with endless patience." },
    { id: 6, title: "Unfiltered Joy", note: "I promise to dance with you in the kitchen, sing off-key, and cherish all our silly moments." },
    { id: 7, title: "Borahae Forever", note: "Seven billion lights across the universe, but I will choose you in this lifetime and every one after." }
  ],

  reasons: [
    {
      id: "reason-1",
      number: 1,
      short: "I want to turn every ordinary tomorrow into magic with you",
      detail: "Whether it's a quiet morning coffee, grocery shopping on a Tuesday, or waiting out the rain—every single second will be sacred because I get to share it with you."
    },
    {
      id: "reason-2",
      number: 2,
      short: "I want to be the steady anchor you can always lean on",
      detail: "Whenever life brings uncertainty or doubt, I want to be the person who holds your hand, looks into your eyes, and reminds you that you are never walking alone."
    },
    {
      id: "reason-3",
      number: 3,
      short: "I want to learn every chapter of your soul as we grow",
      detail: "I don't just want to know who you are today—I want to be there as you discover new dreams, conquer new heights, and grow into everything you are meant to be."
    },
    {
      id: "reason-4",
      number: 4,
      short: "I want a life filled with our private unspoken language",
      detail: "I want us to share secret glances across crowded rooms, inside jokes that nobody else understands, and a bond so deep that silence feels like pure comfort."
    },
    {
      id: "reason-5",
      number: 5,
      short: "Every future dream I picture only makes sense with you",
      detail: "When I imagine my future home, my greatest accomplishments, and the journeys I want to take—there is only one face smiling beside me: yours."
    },
    {
      id: "reason-6",
      number: 6,
      short: "You are the Mikrokosmos I want to cherish for eternity",
      detail: "In an endless cosmos of billions of people, you are the starlight I will spend this lifetime, and every universe after, choosing and loving unconditionally."
    }
  ],

  bgmUrl: "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3",

  futureLetters: [
    {
      id: "letter-1",
      roman: "I",
      tag: "THE FIRST YEAR · 2027",
      year: "Year One",
      milestone: "When The Newness Turns Into Deep Comfort",
      excerpt: "Looking back at the moment you said yes, knowing this was only the sweet beginning.",
      fullLetter: "Can we promise that one year from today, we will look back at this exact proposal and smile, realizing that choosing each other was the easiest and sweetest decision of our lives? I want to spend these next 365 days memorizing every expression you make, discovering your favorite foods, and learning how to love you better with every passing sunrise."
    },
    {
      id: "letter-2",
      roman: "II",
      tag: "OUR SACRED HAVEN · 2030",
      year: "Our First Home",
      milestone: "When We Unlock Our Own Front Door",
      excerpt: "Sunday morning coffee in our own kitchen, sunlight spilling across the floor.",
      fullLetter: "Can we picture it? Sunday mornings with sunlight spilling across our wooden floor, the kettle whistling on the stove, and soft music playing while you laugh as I try to cook. More than any grand mansion, I want to build a haven with you where your heart can kick off its shoes, exhale, and know it is completely, unconditionally safe."
    },
    {
      id: "letter-3",
      roman: "III",
      tag: "OUR ANCHOR IN THE STORM",
      year: "When Seasons Change",
      milestone: "To Read Whenever The World Feels Heavy",
      excerpt: "You will never have to face an exhausting day or cold winter alone again.",
      fullLetter: "If life ever brings a season of heavy clouds, quiet doubts, or exhausting work, open this letter to remember: you will never face anything alone again. I promise to be your calm harbor, to hold your hand under the blankets, and to remind you how deeply you are cherished until the storm passes."
    },
    {
      id: "letter-4",
      roman: "IV",
      tag: "OUR SILVER DECADES · FOREVER",
      year: "Decades Ahead",
      milestone: "When Our Hair Has Streaks of Gray",
      excerpt: "Sitting together on a quiet porch, smiling at a lifetime of laughter.",
      fullLetter: "When decades have passed and we sit side-by-side watching the purple twilight, I know my heart will still race every time you smile. Borahae isn't just a promise for our youth—it is my lifelong vow that across every year, every laugh line, and every sunset, I will choose you and love you more than the day before."
    }
  ],

  resonanceFrequencies: [
    {
      frequency: 432,
      tag: "THE FIRST STEP",
      title: "The Beginning of Us",
      date: "Our First Rhythm",
      reflection: "The sweet, tender vibration of stepping onto this road hand-in-hand."
    },
    {
      frequency: 528,
      tag: "ALL OUR TOMORROWS",
      title: "Adventures Ahead",
      date: "The Unfolding Horizon",
      reflection: "Every road trip, shared sunset, and dream we have yet to discover together."
    },
    {
      frequency: 639,
      tag: "BORAHAE LIFETIME",
      title: "Harmonic Forever",
      date: "Our Lifetime Vow",
      reflection: "Two distinct melodies uniting into one everlasting purple symphony."
    }
  ],

  pillars: [
    {
      id: "pillar-1",
      title: "A Sanctuary We Will Build",
      koreanTag: "안식처",
      description: "A home where your heart will always be safe, protected, and cherished without measure."
    },
    {
      id: "pillar-2",
      title: "Adventures Waiting For Us",
      koreanTag: "모험",
      description: "Hands intertwined through every city, sunrise, continent, and dream we chase together."
    },
    {
      id: "pillar-3",
      title: "Patience Through Every Season",
      koreanTag: "인내",
      description: "Through warm summers, winter rains, and quiet seasons, holding you close through all of time."
    },
    {
      id: "pillar-4",
      title: "A Lifetime of Laughter",
      koreanTag: "미소",
      description: "Filling all our tomorrows with silly dances, midnight snacks, and boundless joy that never fades."
    }
  ],

  proposalQuestion: "Will you walk into this lifetime, and every universe ahead, with me?",
  celebrationTitle: "Our Lifelong Journey Begins Today",
  celebrationMessage: "You are my beginning, my present, and all my tomorrows. I purple you, today, tomorrow, and for all of eternity.",
  whatsappPhone: "15551234567",
  letterLines: [
    "We are just beginning this road together...",
    "Yet under this sky of countless burning stars...",
    "I know with all my heart that I want every tomorrow with you.",
    "Borahae isn't just a word—it is my promise to choose you, learn you, and love you for all of eternity."
  ]
};

const jsonEscaped = JSON.stringify(defaultProposalConfig).replace(/'/g, "''");

const sql = `-- ==========================================================
-- 1-CLICK SUPABASE TABLE SETUP & COMPLETE DATA BACKFILL SCRIPT
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/aohrpdpswmrlizlqcrdy/sql/new
-- ==========================================================

-- 1. Create table for proposal configuration
CREATE TABLE IF NOT EXISTS public.proposal_config (
  id TEXT PRIMARY KEY,
  config JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.proposal_config ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to allow clean recreation
DROP POLICY IF EXISTS "Allow public read" ON public.proposal_config;
DROP POLICY IF EXISTS "Allow public upsert" ON public.proposal_config;

-- 4. Create public read policy (so proposal visitors can view)
CREATE POLICY "Allow public read" 
  ON public.proposal_config FOR SELECT 
  USING (true);

-- 5. Create public upsert policy (so admin studio can save)
CREATE POLICY "Allow public upsert" 
  ON public.proposal_config FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- 6. Backfill / Seed Default Proposal Content (Instant Backfill)
INSERT INTO public.proposal_config (id, config, updated_at)
VALUES (
  'default',
  '${jsonEscaped}'::jsonb,
  NOW()
)
ON CONFLICT (id) DO UPDATE 
SET config = EXCLUDED.config, 
    updated_at = NOW();

-- 7. Verify backfill
SELECT id, updated_at, (config->>'herName') AS her_name, (config->>'proposalQuestion') AS question 
FROM public.proposal_config;
`;

fs.writeFileSync('scripts/supabase-schema-and-seed.sql', sql, 'utf8');
console.log('Successfully updated scripts/supabase-schema-and-seed.sql with future-tense content.');
