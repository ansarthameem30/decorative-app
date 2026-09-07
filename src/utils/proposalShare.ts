import { ProposalConfig } from '../types/proposal';

const PARAM_KEY = 'p';
const GIFT_KEY = 'gift';

/**
 * Compresses an uploaded image file into a lightweight base64 Data URL
 * to allow instant preview and storage without needing a third-party image host.
 */
export const compressImageFile = (
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.72
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Extracts essential personalized fields to keep URL compact
 */
export const serializeProposalConfig = (config: ProposalConfig): string => {
  try {
    const delta: Partial<ProposalConfig> = {
      herName: config.herName,
      yourName: config.yourName,
      proposalQuestion: config.proposalQuestion,
      invitationSubtitle: config.invitationSubtitle,
      whatsappPhone: config.whatsappPhone,
      celebrationTitle: config.celebrationTitle,
      celebrationMessage: config.celebrationMessage,
      storySlides: config.storySlides.map(s => ({
        id: s.id,
        tag: s.tag,
        title: s.title,
        date: s.date,
        description: s.description,
        // Only include imageUrl if not a massive data URL to keep URL shareable
        imageUrl: s.imageUrl?.startsWith('data:') ? undefined : s.imageUrl,
      })),
      reasons: config.reasons,
      gameStars: config.gameStars,
    };

    const json = JSON.stringify(delta);
    return btoa(encodeURIComponent(json));
  } catch (e) {
    console.error('Failed to serialize config for URL', e);
    return '';
  }
};

/**
 * Parses proposal config from URL parameter
 */
export const deserializeProposalConfig = (encoded: string): Partial<ProposalConfig> | null => {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json);
  } catch (e) {
    console.error('Failed to deserialize config from URL', e);
    return null;
  }
};

/**
 * Checks if current page was opened via a shared gift link (?gift=1)
 */
export const isGiftModeActive = (): boolean => {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get(GIFT_KEY) === '1';
};

/**
 * Generates the full shareable surprise link for the girlfriend
 */
export const generateSurpriseLink = (config: ProposalConfig): string => {
  if (typeof window === 'undefined') return '';
  const serialized = serializeProposalConfig(config);
  const baseUrl = window.location.origin + window.location.pathname;
  if (!serialized) return baseUrl;
  return `${baseUrl}?${PARAM_KEY}=${serialized}&${GIFT_KEY}=1`;
};
