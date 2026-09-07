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

  private synthInterval: any = null;
  private isSynthPlaying = false;

  private initBgm() {
    if (typeof window === 'undefined') return;
    if (!this.bgmAudio) {
      this.bgmAudio = new Audio();
      this.bgmAudio.crossOrigin = 'anonymous';
      this.bgmAudio.src = this.customBgmUrl;
      this.bgmAudio.loop = true;
      this.bgmAudio.preload = 'auto';
      this.bgmAudio.volume = 0;

      // When external URL fails (e.g. 403 Forbidden or CORS), smoothly fallback to synthesized piano
      this.bgmAudio.onerror = () => {
        console.warn('Custom audio URL unavailable. Seamlessly activating pure acoustic piano generator...');
        if (this.isPlaying) {
          this.startRomanticPianoSynth();
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
        this.stopRomanticPianoSynth();
        this.bgmAudio.play().catch(() => {
          this.startRomanticPianoSynth();
        });
      }
    }
  }

  /**
   * Soothing procedural romantic piano & celestial pad generator
   * 100% reliable, zero network requests, zero 403 errors, crystal-clear acoustic tone.
   */
  private startRomanticPianoSynth() {
    if (this.isSynthPlaying) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.isSynthPlaying = true;

    // Romantic D Major / A Major / Bm / G chords progression (warm Ludovico Einaudi style)
    const chords = [
      // Dmaj7 (Warm & hopeful)
      [146.83, 220.00, 277.18, 369.99, 440.00], // D3, A3, C#4, F#4, A4
      // A (Tender & comforting)
      [110.00, 220.00, 277.18, 329.63, 440.00], // A2, A3, C#4, E4, A4
      // Bm7 (Deep emotional intimacy)
      [123.47, 220.00, 293.66, 369.99, 440.00], // B2, A3, D4, F#4, A4
      // Gmaj7 (Lifelong devotion)
      [98.00, 196.00, 293.66, 369.99, 493.88],  // G2, G3, D4, F#4, B4
    ];

    let chordIdx = 0;
    let step = 0;

    const playStep = () => {
      if (!this.isSynthPlaying || !this.isPlaying) return;
      const currentCtx = this.getAudioContext();
      if (!currentCtx || currentCtx.state === 'suspended') return;

      const chord = chords[chordIdx];
      const noteFreq = chord[step % chord.length];

      // Play soft acoustic piano note
      this.playAcousticPianoTone(noteFreq, step === 0 ? 0.12 : 0.08, 3.2);

      step++;
      if (step >= chord.length * 2) {
        step = 0;
        chordIdx = (chordIdx + 1) % chords.length;
      }
    };

    // Play first chord immediately
    playStep();
    this.synthInterval = setInterval(playStep, 680);
  }

  private stopRomanticPianoSynth() {
    this.isSynthPlaying = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  /**
   * Acoustic piano simulation using dual pure sines + warm lowpass filter + natural exponential decay
   */
  private playAcousticPianoTone(freq: number, velocity: number = 0.1, duration: number = 3.0) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Fundamental oscillator
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      // Warm harmonic overtone (octave higher, gentle presence)
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);

      // Lowpass acoustic body filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(320, now + duration);

      // Gain envelopes
      const gain1 = ctx.createGain();
      gain1.gain.setValueAtTime(0.0001, now);
      gain1.gain.linearRampToValueAtTime(velocity, now + 0.025); // Gentle soft attack
      gain1.gain.exponentialRampToValueAtTime(velocity * 0.4, now + 0.35); // Initial strike decay
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration); // Long singing sustain

      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0.0001, now);
      gain2.gain.linearRampToValueAtTime(velocity * 0.28, now + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.6));

      // Master output gain
      const masterNoteGain = ctx.createGain();
      masterNoteGain.gain.setValueAtTime(0.75, now);

      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(filter);
      gain2.connect(filter);
      filter.connect(masterNoteGain);
      masterNoteGain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.1);
      osc2.stop(now + duration + 0.1);
    } catch (e) {
      // AudioContext state safety
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
    this.stopRomanticPianoSynth();

    if (!this.bgmAudio) {
      if (onComplete) onComplete();
      return;
    }
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
    this.isPlaying = true;
    const ctx = this.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      await ctx.resume().catch(() => {});
    }

    this.initBgm();

    // If custom URL is set, try playing it; if it fails, activate pristine piano synth
    if (this.bgmAudio && this.customBgmUrl && !this.customBgmUrl.includes('assets.mixkit.co')) {
      try {
        await this.bgmAudio.play();
        this.fadeIn(0.7, 1800);
        return true;
      } catch (err) {
        console.log('Stream playback failed, starting internal piano synth...', err);
        this.startRomanticPianoSynth();
        return true;
      }
    } else {
      // By default or on blocked 403 URLs, start the smooth acoustic piano immediately
      this.startRomanticPianoSynth();
      return true;
    }
  }

  public stopAudio() {
    this.isPlaying = false;
    this.stopRomanticPianoSynth();
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
