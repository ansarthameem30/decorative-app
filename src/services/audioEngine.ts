import * as Tone from 'tone';

class AudioEngine {
  private initialized = false;
  private isPlaying = false;
  private pianoSynth: Tone.PolySynth | null = null;
  private padSynth: Tone.PolySynth | null = null;
  private filter: Tone.Filter | null = null;
  private reverb: Tone.Reverb | null = null;
  private chimeSynth: Tone.Synth | null = null;
  private arpeggioLoop: Tone.Pattern<string> | null = null;

  // Emotional Mikrokosmos-inspired pentatonic piano arpeggio notes
  // Eb Major - Bb/D - Cm7 - AbMaj7 (classic emotional purple ballad harmony)
  private balladNotes = [
    "Eb4", "G4", "Bb4", "Eb5",
    "D4", "F4", "Bb4", "D5",
    "C4", "Eb4", "G4", "C5",
    "Ab3", "C4", "Eb4", "Ab4"
  ];

  public async init() {
    if (this.initialized) return;

    try {
      await Tone.start();

      this.reverb = new Tone.Reverb({
        decay: 5,
        preDelay: 0.04,
        wet: 0.55
      }).toDestination();
      await this.reverb.generate();

      this.filter = new Tone.Filter({
        frequency: 1200,
        type: "lowpass",
        rolloff: -12
      }).connect(this.reverb);

      // Warm acoustic-style ballad piano synth
      this.pianoSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: {
          attack: 0.02,
          decay: 1.5,
          sustain: 0.2,
          release: 2.2
        }
      }).connect(this.filter);
      this.pianoSynth.volume.value = -12;

      // Soft purple strings pad
      this.padSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sine" },
        envelope: {
          attack: 1.5,
          decay: 2.0,
          sustain: 0.6,
          release: 3.0
        }
      }).connect(this.filter);
      this.padSynth.volume.value = -18;

      // Twinkling starlight chime
      this.chimeSynth = new Tone.Synth({
        oscillator: { type: "sine" },
        envelope: {
          attack: 0.01,
          decay: 0.6,
          sustain: 0.1,
          release: 1.2
        }
      }).connect(this.reverb);
      this.chimeSynth.volume.value = -10;

      // Tender piano pattern loop
      this.arpeggioLoop = new Tone.Pattern((time, note) => {
        if (!this.isPlaying || !this.pianoSynth) return;
        this.pianoSynth.triggerAttackRelease(note, "0.8s", time);
      }, this.balladNotes, "up");
      this.arpeggioLoop.interval = "4n";

      this.initialized = true;
    } catch (err) {
      console.warn("Audio waiting for user gesture", err);
    }
  }

  public async startAudio() {
    if (!this.initialized) {
      await this.init();
    }
    if (Tone.context.state !== 'running') {
      await Tone.context.resume();
    }
    if (this.arpeggioLoop && !this.isPlaying) {
      Tone.Transport.bpm.value = 72; // Gentle, tender ballad tempo
      Tone.Transport.start();
      this.arpeggioLoop.start(0);
      this.isPlaying = true;

      // Play soft initial chord
      if (this.padSynth) {
        this.padSynth.triggerAttackRelease(["Eb3", "Bb3", "G4"], "4s");
      }
    }
  }

  public stopAudio() {
    if (this.isPlaying) {
      Tone.Transport.stop();
      if (this.pianoSynth) this.pianoSynth.releaseAll();
      if (this.padSynth) this.padSynth.releaseAll();
      this.isPlaying = false;
    }
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

  public playStarGlimmer() {
    if (!this.initialized || !this.chimeSynth) return;
    try {
      const notes = ["G5", "Bb5", "C6", "Eb6", "G6"];
      const note = notes[Math.floor(Math.random() * notes.length)];
      this.chimeSynth.triggerAttackRelease(note, "0.4s");
    } catch (e) {
      // Ignored
    }
  }

  public playChime(note: string = "G5") {
    if (!this.initialized || !this.chimeSynth) return;
    try {
      this.chimeSynth.triggerAttackRelease(note, "0.5s");
    } catch (e) {
      // Ignored
    }
  }

  public playBubblePop() {
    this.playStarGlimmer();
  }

  public playFireflyCatch() {
    this.playStarGlimmer();
  }

  public playHeartbeat() {
    // Soft gentle pulse
  }

  public swellClimax() {
    if (!this.initialized) return;
    try {
      if (this.filter) {
        this.filter.frequency.rampTo(3000, 2.5);
      }
      if (this.pianoSynth) {
        this.pianoSynth.volume.rampTo(-8, 2);
      }
      if (this.padSynth) {
        this.padSynth.volume.rampTo(-12, 2);
        this.padSynth.triggerAttackRelease(["Eb3", "G3", "Bb3", "Eb4"], "6s");
      }
    } catch (e) {
      // Ignored
    }
  }

  public settlePeaceful() {
    if (!this.initialized) return;
    try {
      if (this.filter) {
        this.filter.frequency.rampTo(1000, 3);
      }
    } catch (e) {
      // Ignored
    }
  }
}

export const audioEngine = new AudioEngine();
