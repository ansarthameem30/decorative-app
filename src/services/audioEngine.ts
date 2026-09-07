'use client';

// Curated high-fidelity romantic piano ballad audio streams (royalty-free, CDN-hosted)
export const DEFAULT_ROMANTIC_BALLAD = 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3';
export const FALLBACK_ROMANTIC_BALLAD = 'https://assets.mixkit.co/music/preview/mixkit-tender-love-134.mp3';

class AudioEngine {
  private bgmAudio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private audioCtx: AudioContext | null = null;
  private customBgmUrl: string = DEFAULT_ROMANTIC_BALLAD;
  private fadeInterval: any = null;

  constructor() {
    // Lazy initialize on client
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  private initBgm() {
    if (typeof window === 'undefined') return;
    if (!this.bgmAudio) {
      this.bgmAudio = new Audio();
      this.bgmAudio.src = this.customBgmUrl;
      this.bgmAudio.loop = true;
      this.bgmAudio.preload = 'auto';
      this.bgmAudio.volume = 0;

      // Handle loading error with fallback
      this.bgmAudio.onerror = () => {
        if (this.bgmAudio && this.bgmAudio.src !== FALLBACK_ROMANTIC_BALLAD) {
          console.warn('Primary ballad stream unavailable, switching to fallback acoustic piano...');
          this.bgmAudio.src = FALLBACK_ROMANTIC_BALLAD;
          if (this.isPlaying) {
            this.bgmAudio.play().catch(() => {});
          }
        }
      };
    }
  }

  public setCustomAudioUrl(url: string) {
    if (!url || !url.trim()) return;
    const cleanUrl = url.trim();
    if (cleanUrl === this.customBgmUrl) return;

    this.customBgmUrl = cleanUrl;
    if (this.bgmAudio) {
      const wasPlaying = this.isPlaying;
      this.bgmAudio.src = cleanUrl;
      if (wasPlaying) {
        this.bgmAudio.play().catch(() => {});
      }
    }
  }

  /**
   * Smooth volume fade-in for romantic cinematic immersion
   */
  private fadeIn(targetVolume: number = 0.65, durationMs: number = 1500) {
    if (!this.bgmAudio) return;
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    const stepMs = 50;
    const steps = durationMs / stepMs;
    const volumeStep = targetVolume / steps;

    this.fadeInterval = setInterval(() => {
      if (!this.bgmAudio) {
        clearInterval(this.fadeInterval);
        return;
      }
      if (this.bgmAudio.volume + volumeStep < targetVolume) {
        this.bgmAudio.volume += volumeStep;
      } else {
        this.bgmAudio.volume = targetVolume;
        clearInterval(this.fadeInterval);
      }
    }, stepMs);
  }

  /**
   * Smooth volume fade-out
   */
  private fadeOut(durationMs: number = 800, onComplete?: () => void) {
    if (!this.bgmAudio) return;
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    const stepMs = 40;
    const steps = durationMs / stepMs;
    const currentVol = this.bgmAudio.volume;
    const volumeStep = currentVol / steps;

    this.fadeInterval = setInterval(() => {
      if (!this.bgmAudio) {
        clearInterval(this.fadeInterval);
        return;
      }
      if (this.bgmAudio.volume - volumeStep > 0.02) {
        this.bgmAudio.volume -= volumeStep;
      } else {
        this.bgmAudio.volume = 0;
        this.bgmAudio.pause();
        clearInterval(this.fadeInterval);
        if (onComplete) onComplete();
      }
    }, stepMs);
  }

  public async startAudio(): Promise<boolean> {
    this.initBgm();
    this.getAudioContext();

    if (!this.bgmAudio) return false;

    try {
      await this.bgmAudio.play();
      this.isPlaying = true;
      this.fadeIn(0.7, 1800);
      return true;
    } catch (err) {
      console.log('Audio autoplay awaiting user touch gesture', err);
      this.isPlaying = false;
      return false;
    }
  }

  public stopAudio() {
    this.isPlaying = false;
    this.fadeOut(700);
  }

  public toggleAudio(): boolean {
    if (this.isPlaying) {
      this.stopAudio();
      return false;
    } else {
      this.startAudio();
      return true;
    }
  }

  public isAudioPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Silky, crystal-clear starlight chime using pure sine harmonics and warm acoustic filter
   */
  public playStarGlimmer() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const frequencies = [659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51]; // E5, G5, A5, C6, D6, E6
      const freq = frequencies[Math.floor(Math.random() * frequencies.length)];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.Q.setValueAtTime(1.5, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.9);
    } catch (e) {
      // AudioContext policy
    }
  }

  public playChime(freqOrNote: number | string = 880) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      let freq = 880;
      if (typeof freqOrNote === 'number') {
        freq = freqOrNote;
      } else {
        const noteMap: Record<string, number> = {
          C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
          C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
          C6: 1046.5, D6: 1174.66, E6: 1318.51, G6: 1567.98,
        };
        freq = noteMap[freqOrNote] || 880;
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.15, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.75);
    } catch (e) {}
  }

  /**
   * Multi-bell celebratory chime for wax seal break & achievements
   */
  public playSealBreak() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const chords = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6
    chords.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChime(freq);
      }, idx * 75);
    });
  }

  public playBubblePop() {
    this.playStarGlimmer();
  }

  public playFireflyCatch() {
    this.playStarGlimmer();
  }

  public playHeartbeat() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(60, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {}
  }

  public swellClimax() {
    if (this.bgmAudio && this.isPlaying) {
      this.fadeIn(0.9, 2000);
    }
    this.playSealBreak();
  }

  public settlePeaceful() {
    if (this.bgmAudio && this.isPlaying) {
      this.fadeIn(0.65, 2000);
    }
  }
}

export const audioEngine = new AudioEngine();
