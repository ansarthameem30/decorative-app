import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useJourney } from '../../context/JourneyContext';
import { contentConfig } from '../../config/content';

export const Section10HerSpellbook: React.FC = () => {
  const { journeyState, setHerSpell } = useJourney();
  const { herSpell } = journeyState;

  const [spellInput, setSpellInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.warn("Microphone access not available or denied", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spellInput.trim() && !recordedAudioUrl) return;
    setHerSpell(spellInput.trim() || "A whispered voice note etched in the stars");
  };

  return (
    <section className="relative w-full min-h-screen py-20 sm:py-28 px-4 sm:px-14 flex flex-col items-center justify-center select-none text-center overflow-hidden">
      {/* Serene Starry Ambiance */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[360px] sm:w-[600px] h-[360px] sm:h-[600px] rounded-full bg-purple-950/15 blur-[120px]" />
      </div>

      {/* Header */}
      <div className="z-10 max-w-xl mb-8 sm:mb-12 px-2">
        <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.3em] text-purple-400/80 uppercase block mb-2 sm:mb-3">
          Epilogue · The Perpetual Archive
        </span>
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-normal text-purple-100 text-glow">
          The Final Inscription
        </h2>
        <p className="font-sans text-xs sm:text-sm text-purple-200/60 mt-2 sm:mt-3 font-light">
          This universe belongs to both of us. Inscribe your own words or whispered reflection to seal our starlit book.
        </p>
      </div>

      {/* Main Spellbook Interaction / Or Submitted Sky Portrait */}
      {!herSpell ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative z-20 w-full max-w-xl bg-gradient-to-b from-[#180a30] via-[#100520] to-[#0a0314] rounded-3xl p-6 sm:p-10 border border-purple-400/35 shadow-2xl text-left"
        >
          <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-purple-500/15">
            <span className="font-cinzel text-[11px] sm:text-xs tracking-[0.3em] uppercase text-purple-200">
              Page C · Your Starlit Vow
            </span>
            <span className="font-cinzel text-[9px] sm:text-[10px] tracking-widest text-purple-400/60 uppercase">
              Celestial Ink
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
            <textarea
              value={spellInput}
              onChange={(e) => setSpellInput(e.target.value)}
              placeholder="Inscribe your words, a memory, or a vow for us..."
              rows={4}
              maxLength={250}
              className="w-full p-3.5 sm:p-4 rounded-2xl bg-[#0e0419]/70 border border-purple-500/25 text-purple-100 placeholder:text-purple-400/35 font-display text-base sm:text-lg focus:outline-none focus:border-purple-400 resize-none leading-relaxed"
            />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-4 py-2.5 rounded-full border text-[10px] font-cinzel tracking-wider uppercase transition-all flex items-center justify-center ${
                  isRecording
                    ? 'bg-rose-500/20 border-rose-400 text-rose-200 animate-pulse'
                    : 'bg-[#140726] border-purple-500/25 text-purple-300 hover:text-white'
                }`}
              >
                {isRecording
                  ? "Recording... (Tap to finish)"
                  : recordedAudioUrl
                  ? "Voice Whisper Saved ✦"
                  : "Record Voice Whisper ✦"}
              </button>

              <button
                type="submit"
                disabled={!spellInput.trim() && !recordedAudioUrl}
                className="font-cinzel text-[10px] sm:text-xs tracking-[0.2em] uppercase px-6 sm:px-7 py-3 rounded-full border border-purple-400/40 text-white bg-gradient-to-r from-purple-800/80 to-purple-600/80 hover:from-purple-700 hover:to-purple-500 shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Seal into the Stars ✦
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        /* Closing Co-Created Celestial Portrait */
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 w-full max-w-xl bg-gradient-to-b from-[#180a30] via-[#100520] to-[#0a0314] rounded-3xl p-6 sm:p-11 border border-purple-400/40 shadow-2xl flex flex-col items-center text-center"
        >
          {/* Architectural Twin Star Chart */}
          <div className="relative w-48 sm:w-56 h-28 sm:h-32 flex items-center justify-center my-2">
            <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
              <line x1="40" y1="50" x2="160" y2="50" stroke="#f0abfc" strokeWidth="0.8" strokeDasharray="3 2" />
              <circle cx="40" cy="50" r="4" fill="#c084fc" className="filter drop-shadow-[0_0_8px_#c084fc]" />
              <circle cx="160" cy="50" r="4" fill="#f0abfc" className="filter drop-shadow-[0_0_8px_#f0abfc]" />
              <circle cx="100" cy="50" r="2.5" fill="#ffffff" className="animate-ping" />
            </svg>
            <span className="absolute left-2 sm:left-4 bottom-0 font-cinzel text-[10px] sm:text-xs text-purple-200 tracking-widest uppercase">
              {contentConfig.yourName}
            </span>
            <span className="absolute right-2 sm:right-4 bottom-0 font-cinzel text-[10px] sm:text-xs text-pink-200 tracking-widest uppercase">
              {contentConfig.herName}
            </span>
          </div>

          <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.3em] uppercase text-purple-400/80 mt-4 sm:mt-6 block">
            Our Forever Constellation
          </span>

          <div className="p-4 sm:p-6 rounded-2xl bg-purple-950/40 border border-purple-500/25 my-4 text-center max-w-md w-full">
            <p className="font-display text-lg sm:text-xl text-purple-100 italic leading-relaxed">
              "{herSpell}"
            </p>
          </div>

          <span className="font-cinzel text-[8px] sm:text-[10px] tracking-[0.25em] text-purple-300/70 uppercase">
            Inscribed Permanently in the Astral Canopy
          </span>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-purple-500/20 w-full flex items-center justify-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="font-cinzel text-[10px] sm:text-xs tracking-[0.2em] uppercase px-5 sm:px-6 py-2.5 rounded-full border border-purple-400/30 text-purple-200 hover:text-white bg-purple-900/40 transition-colors"
            >
              Return to the Beginning ✦
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
};
