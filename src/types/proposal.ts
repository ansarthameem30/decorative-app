export interface StorySlide {
  id: string;
  tag: string;
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
  isGameSlide?: boolean;
}

export interface ProposalReason {
  id: string;
  number: number;
  short: string;
  detail: string;
}

export interface GameStar {
  id: number;
  title: string;
  note: string;
}

export interface ProposalConfig {
  herName: string;
  yourName: string;
  invitationSubtitle: string;
  storySlides: StorySlide[];
  reasons: ProposalReason[];
  gameStars: GameStar[];
  letterLines: string[];
  proposalQuestion: string;
  celebrationTitle: string;
  celebrationMessage: string;
  whatsappPhone?: string;
}
