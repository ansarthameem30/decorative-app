'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProposalConfig } from '@/types/proposal';
import { defaultProposalConfig } from '@/config/proposalContent';
import { compressImageFile } from '@/utils/proposalShare';
import { audioEngine, DEFAULT_ROMANTIC_BALLAD, FALLBACK_ROMANTIC_BALLAD } from '@/services/audioEngine';

const PRESET_PHOTOS = [
  { label: 'Starry Night', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000&auto=format&fit=crop' },
  { label: 'Golden Sunset', url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000&auto=format&fit=crop' },
  { label: 'Cherry Blossoms', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop' },
  { label: 'Dusk Amethyst', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop' },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [config, setConfig] = useState<ProposalConfig>(defaultProposalConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'couple' | 'milestones' | 'letters' | 'stars' | 'reasons' | 'sql'>('couple');
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Check saved session auth
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPass = sessionStorage.getItem('admin_pass');
      if (savedPass) {
        setPasswordInput(savedPass);
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Fetch live config from Supabase via API
  useEffect(() => {
    async function loadConfig() {
      try {
        setLoading(true);
        const res = await fetch('/api/config');
        const data = await res.json();
        if (data.config) {
          setConfig(data.config);
        }
      } catch (err) {
        console.error('Failed to load config from API', err);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setAuthError('Please enter the password');
      return;
    }
    const clean = passwordInput.trim();
    sessionStorage.setItem('admin_pass', clean);
    setIsAuthenticated(true);
    setAuthError('');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_pass');
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const handlePhotoUpload = async (index: number, file: File) => {
    try {
      setUploadingIdx(index);
      const base64 = await compressImageFile(file, 900, 900, 0.78);
      const updated = [...config.storySlides];
      updated[index] = { ...updated[index], imageUrl: base64 };
      setConfig({ ...config, storySlides: updated });
    } catch (err) {
      console.error('Photo upload error', err);
      alert('Could not process this image. Please try another photo.');
    } finally {
      setUploadingIdx(null);
    }
  };

  const handleSaveToDatabase = async () => {
    try {
      setSaving(true);
      setSaveStatus(null);

      const passToSend = (passwordInput || sessionStorage.getItem('admin_pass') || 'Ansar@123').trim();

      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config,
          password: passToSend,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setSaveStatus({
          type: 'success',
          message: 'Saved to Supabase! Your changes are instantly live on the proposal page.',
        });
      } else {
        if (result.tableMissing || result.error?.includes('schema cache') || result.error?.includes('does not exist')) {
          setSaveStatus({
            type: 'error',
            message: 'Database table missing! Please click the "Supabase SQL" tab to run the 1-time script in Supabase.',
          });
          setActiveTab('sql');
        } else {
          setSaveStatus({
            type: 'error',
            message: result.error || 'Failed to save to database. Please check password or connection.',
          });
        }
      }
    } catch (err: any) {
      setSaveStatus({
        type: 'error',
        message: err?.message || 'Network error contacting database.',
      });
    } finally {
      setSaving(false);
    }
  };

  const sqlSetupScript = `-- 1-CLICK SUPABASE TABLE SETUP & COMPLETE DATA BACKFILL SCRIPT
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/aohrpdpswmrlizlqcrdy/sql/new

CREATE TABLE IF NOT EXISTS public.proposal_config (
  id TEXT PRIMARY KEY,
  config JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.proposal_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read" ON public.proposal_config;
DROP POLICY IF EXISTS "Allow public upsert" ON public.proposal_config;

CREATE POLICY "Allow public read" 
  ON public.proposal_config FOR SELECT 
  USING (true);

CREATE POLICY "Allow public upsert" 
  ON public.proposal_config FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Backfill / Seed Proposal Content
INSERT INTO public.proposal_config (id, config, updated_at)
VALUES (
  'default',
  '${JSON.stringify(config).replace(/'/g, "''")}'::jsonb,
  NOW()
)
ON CONFLICT (id) DO UPDATE 
SET config = EXCLUDED.config, 
    updated_at = NOW();

SELECT id, updated_at, (config->>'herName') AS her_name, (config->>'proposalQuestion') AS question 
FROM public.proposal_config;`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlSetupScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // 1. Password Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-[#06020e] flex items-center justify-center p-4 text-white font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#18072c] to-[#0c0217] border border-purple-500/30 shadow-2xl text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 mx-auto flex items-center justify-center shadow-[0_0_25px_#f472b6]">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <div className="space-y-1">
            <h2 className="font-display text-2xl sm:text-3xl text-purple-50 font-normal">
              Mikrokosmos Studio
            </h2>
            <p className="text-xs text-purple-300/70 font-sans">
              Admin Access Only · Enter password to manage proposal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin password"
                className="w-full p-4 rounded-2xl bg-[#120422] border border-purple-500/40 text-white text-base sm:text-sm focus:outline-none focus:border-pink-400 text-center tracking-wider transition-colors"
                autoFocus
              />
              {authError && (
                <p className="text-xs text-pink-400 mt-2">{authError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] py-3.5 rounded-full bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-600 hover:to-pink-500 text-white font-heading text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-xl transition-all active:scale-95"
            >
              Unlock Admin Studio
            </button>
          </form>

          <p className="text-[11px] text-purple-400/60">
            Protected endpoint for the proposal creator only.
          </p>
        </motion.div>
      </div>
    );
  }

  // 2. Full Admin Dashboard (Mobile-first responsive overhaul)
  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#05010a] text-purple-100 font-sans p-3 sm:p-6 lg:p-8 pb-36 overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-5">
        
        {/* Admin Top Bar */}
        <header className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#130526]/85 border border-purple-500/25 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]" />
              <h1 className="font-heading text-base sm:text-lg font-semibold text-white tracking-wide">
                Mikrokosmos Admin Studio
              </h1>
            </div>
            <p className="text-[11px] sm:text-xs text-purple-300/70 font-sans mt-0.5">
              Supabase Project: <span className="text-pink-300 font-mono">aohrpdpswmrlizlqcrdy</span>
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end pt-1 sm:pt-0 border-t sm:border-t-0 border-purple-500/20">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-full border border-purple-500/30 text-xs font-heading font-medium text-purple-200 hover:text-white hover:bg-purple-900/30 transition-all flex items-center gap-1.5"
            >
              <span>Preview Proposal (/)</span>
              <span>↗</span>
            </a>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-full text-xs font-heading text-purple-400 hover:text-pink-300 transition-colors"
            >
              Lock
            </button>
          </div>
        </header>

        {/* Save Status Toast Notification */}
        <AnimatePresence>
          {saveStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm font-heading font-medium flex items-center justify-between ${
                saveStatus.type === 'success'
                  ? 'bg-green-950/80 border-green-500/50 text-green-200 shadow-[0_0_20px_rgba(74,222,128,0.2)]'
                  : 'bg-pink-950/80 border-pink-500/50 text-pink-200 shadow-[0_0_20px_rgba(244,114,182,0.2)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{saveStatus.type === 'success' ? '✓' : '⚠️'}</span>
                <span>{saveStatus.message}</span>
              </div>
              <button onClick={() => setSaveStatus(null)} className="ml-3 font-bold text-base opacity-70 hover:opacity-100">
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Smooth Mobile Tabs Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          {[
            { id: 'couple', label: 'Couple & Vows', icon: '💜' },
            { id: 'milestones', label: 'Chapters & Photos', icon: '📷' },
            { id: 'letters', label: 'Time Capsule', icon: '⏳' },
            { id: 'stars', label: '7 Stars', icon: '⭐' },
            { id: 'reasons', label: 'Love Reasons', icon: '💌' },
            { id: 'sql', label: 'Supabase SQL', icon: '⚡' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`min-h-[42px] px-3.5 sm:px-4 py-2 rounded-full text-xs font-heading font-medium tracking-wide whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-700 to-pink-600 text-white shadow-lg border border-pink-300/30'
                  : 'bg-[#120422] border border-purple-500/20 text-purple-300 hover:text-white hover:bg-purple-950/50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Box */}
        <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#0f041d]/90 border border-purple-500/25 shadow-2xl space-y-5">
          
          {/* TAB 1: The Couple & Vows */}
          {activeTab === 'couple' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-purple-200 text-xs font-heading uppercase mb-1.5 font-medium">
                    Her Name
                  </label>
                  <input
                    type="text"
                    value={config.herName}
                    onChange={(e) => setConfig({ ...config, herName: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-[#16062a] border border-purple-500/30 text-white text-base sm:text-sm focus:border-pink-400 focus:outline-none"
                    placeholder="Her Name"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 text-xs font-heading uppercase mb-1.5 font-medium">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={config.yourName}
                    onChange={(e) => setConfig({ ...config, yourName: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-[#16062a] border border-purple-500/30 text-white text-base sm:text-sm focus:border-pink-400 focus:outline-none"
                    placeholder="Your Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-purple-200 text-xs font-heading uppercase mb-1.5 font-medium">
                  Proposal Question (Chapter 08)
                </label>
                <input
                  type="text"
                  value={config.proposalQuestion}
                  onChange={(e) => setConfig({ ...config, proposalQuestion: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-[#16062a] border border-purple-500/30 text-white text-base sm:text-sm focus:border-pink-400 focus:outline-none"
                  placeholder="Will you spend this lifetime, and every universe after, with me?"
                />
              </div>

              <div>
                <label className="block text-purple-200 text-xs font-heading uppercase mb-1.5 font-medium">
                  Opening Whisper Subtitle
                </label>
                <textarea
                  rows={2}
                  value={config.invitationSubtitle}
                  onChange={(e) => setConfig({ ...config, invitationSubtitle: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-[#16062a] border border-purple-500/30 text-white text-base sm:text-sm resize-none focus:border-pink-400 focus:outline-none"
                  placeholder="Opening poetic quote on chapter 01"
                />
              </div>

              <div>
                <label className="block text-purple-200 text-xs font-heading uppercase mb-1.5 font-medium">
                  WhatsApp Phone for "YES" Confirmation
                </label>
                <input
                  type="tel"
                  value={config.whatsappPhone || ''}
                  onChange={(e) => setConfig({ ...config, whatsappPhone: e.target.value })}
                  placeholder="e.g. 15551234567 (with country code, no + or spaces)"
                  className="w-full p-3.5 rounded-xl bg-[#16062a] border border-purple-500/30 text-white text-base sm:text-sm focus:border-pink-400 focus:outline-none"
                />
                <p className="text-[11px] text-purple-400/70 mt-1">
                  When she clicks "Tell Him: I Said YES", it will open a WhatsApp message directly to this number.
                </p>
              </div>

              <div>
                <label className="block text-purple-200 text-xs font-heading uppercase mb-1.5 font-medium">
                  Celebration Vow Message (Inside Ring Keepsake)
                </label>
                <textarea
                  rows={3}
                  value={config.celebrationMessage}
                  onChange={(e) => setConfig({ ...config, celebrationMessage: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-[#16062a] border border-purple-500/30 text-white text-base sm:text-sm resize-none focus:border-pink-400 focus:outline-none"
                  placeholder="Personal vow inside the keepsake modal..."
                />
              </div>

              {/* Background Music Audio Stream */}
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-400/30 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-purple-200 text-xs font-heading uppercase font-semibold">
                    🎵 Background Music (Acoustic Piano Ballad)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (config.bgmUrl) {
                        audioEngine.setCustomAudioUrl(config.bgmUrl);
                      }
                      const active = audioEngine.toggleAudio();
                      setIsPlayingAudio(active);
                    }}
                    className="text-xs px-3 py-1 rounded-full bg-pink-600/30 hover:bg-pink-600/50 border border-pink-400/50 text-pink-200 flex items-center gap-1.5 transition-all"
                  >
                    <span>{isPlayingAudio ? '⏸ Pause' : '▶ Preview Music'}</span>
                  </button>
                </div>
                <input
                  type="url"
                  value={config.bgmUrl || ''}
                  onChange={(e) => {
                    const url = e.target.value;
                    setConfig({ ...config, bgmUrl: url });
                    audioEngine.setCustomAudioUrl(url);
                  }}
                  placeholder="Direct MP3 Audio Stream URL"
                  className="w-full p-3.5 rounded-xl bg-[#16062a] border border-purple-500/30 text-white text-base sm:text-sm focus:border-pink-400 focus:outline-none"
                />
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="text-purple-400/80">Presets:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setConfig({ ...config, bgmUrl: DEFAULT_ROMANTIC_BALLAD });
                      audioEngine.setCustomAudioUrl(DEFAULT_ROMANTIC_BALLAD);
                    }}
                    className="text-pink-300 hover:underline"
                  >
                    Default Romantic Piano
                  </button>
                  <span className="text-purple-600">·</span>
                  <button
                    type="button"
                    onClick={() => {
                      setConfig({ ...config, bgmUrl: FALLBACK_ROMANTIC_BALLAD });
                      audioEngine.setCustomAudioUrl(FALLBACK_ROMANTIC_BALLAD);
                    }}
                    className="text-pink-300 hover:underline"
                  >
                    Tender Acoustic Piano
                  </button>
                </div>
              </div>

              {/* Entrance Gate Testing Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('mikrokosmos_unlocked');
                      window.open('/?entrance=1', '_blank');
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-purple-400/40 bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 text-xs font-heading font-medium tracking-wide flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <span>✨</span>
                  <span>Test Entrance Seal Ceremony (Opens Ribbon Page in New Tab)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Chapters & Local Phone Photos */}
          {activeTab === 'milestones' && (
            <div className="space-y-5">
              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-400/30">
                <p className="text-xs text-purple-200 leading-relaxed">
                  📸 <strong>Local Phone Photo Upload:</strong> You can take a photo with your phone camera or select from your camera roll. Photos are automatically compressed client-side and saved to Supabase!
                </p>
              </div>

              {config.storySlides.filter((s) => !s.isGameSlide).map((slide, idx) => (
                <div key={slide.id} className="p-4 sm:p-5 rounded-2xl bg-[#140528] border border-purple-500/25 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-xs font-semibold uppercase text-pink-300">
                      Milestone 0{idx + 1} · {slide.title}
                    </span>
                    <span className="text-xs text-purple-400 font-medium">{slide.date}</span>
                  </div>

                  {/* Photo Preview & Mobile Upload Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                    {/* Thumbnail Image Box */}
                    <div className="w-full sm:w-36 h-48 sm:h-36 rounded-2xl overflow-hidden bg-purple-950 border-2 border-purple-500/40 relative flex-shrink-0 flex items-center justify-center">
                      {slide.imageUrl ? (
                        <img
                          src={slide.imageUrl}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-2 text-center text-purple-400">
                          <span className="text-2xl mb-1">🖼️</span>
                          <span className="text-xs">No Photo Set</span>
                        </div>
                      )}

                      {uploadingIdx === idx && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-xs text-pink-300 gap-1.5">
                          <span className="animate-spin text-lg">✦</span>
                          <span>Compressing...</span>
                        </div>
                      )}
                    </div>

                    {/* Upload Buttons & Options */}
                    <div className="w-full flex-1 space-y-3">
                      {/* Big Prominent Phone Camera & Library Button */}
                      <label className="w-full min-h-[46px] flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-800 to-pink-600 hover:from-purple-700 hover:to-pink-500 border border-pink-300/40 text-white text-xs sm:text-sm font-heading font-semibold uppercase tracking-wider cursor-pointer shadow-lg active:scale-98 transition-all">
                        <span>📷</span>
                        <span>Choose from Camera Roll / Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handlePhotoUpload(idx, e.target.files[0]);
                            }
                          }}
                        />
                      </label>

                      {/* Direct Image URL Input (Optional) */}
                      <div>
                        <input
                          type="text"
                          value={slide.imageUrl.startsWith('data:') ? '' : slide.imageUrl}
                          onChange={(e) => {
                            const updated = [...config.storySlides];
                            updated[idx] = { ...updated[idx], imageUrl: e.target.value };
                            setConfig({ ...config, storySlides: updated });
                          }}
                          placeholder={slide.imageUrl.startsWith('data:') ? 'Custom phone photo uploaded ✓' : 'Or paste image URL here...'}
                          className="w-full p-2.5 rounded-xl bg-[#190730] border border-purple-500/30 text-white text-xs"
                        />
                      </div>

                      {/* Presets & Remove Actions */}
                      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] text-purple-400">Romantic Presets:</span>
                          {PRESET_PHOTOS.map((p) => (
                            <button
                              key={p.label}
                              type="button"
                              onClick={() => {
                                const updated = [...config.storySlides];
                                updated[idx] = { ...updated[idx], imageUrl: p.url };
                                setConfig({ ...config, storySlides: updated });
                              }}
                              className="text-[10px] px-2 py-1 rounded-lg bg-purple-950 border border-purple-500/30 text-purple-300 hover:text-white transition-colors"
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>

                        {slide.imageUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...config.storySlides];
                              updated[idx] = { ...updated[idx], imageUrl: '' };
                              setConfig({ ...config, storySlides: updated });
                            }}
                            className="text-[11px] text-pink-400/80 hover:text-pink-300 underline"
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Milestone Title & Date Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-purple-300 uppercase mb-1 font-medium">
                        Milestone Title
                      </label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => {
                          const updated = [...config.storySlides];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setConfig({ ...config, storySlides: updated });
                        }}
                        placeholder="Title (e.g. Day We Met)"
                        className="w-full p-3 rounded-xl bg-[#190730] border border-purple-500/30 text-white text-base sm:text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-purple-300 uppercase mb-1 font-medium">
                        Season / Date
                      </label>
                      <input
                        type="text"
                        value={slide.date}
                        onChange={(e) => {
                          const updated = [...config.storySlides];
                          updated[idx] = { ...updated[idx], date: e.target.value };
                          setConfig({ ...config, storySlides: updated });
                        }}
                        placeholder="Date (e.g. Spring 2023)"
                        className="w-full p-3 rounded-xl bg-[#190730] border border-purple-500/30 text-white text-base sm:text-xs"
                      />
                    </div>
                  </div>

                  {/* Milestone Description */}
                  <div>
                    <label className="block text-[11px] text-purple-300 uppercase mb-1 font-medium">
                      Description / Memory
                    </label>
                    <textarea
                      rows={2}
                      value={slide.description}
                      onChange={(e) => {
                        const updated = [...config.storySlides];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setConfig({ ...config, storySlides: updated });
                      }}
                      className="w-full p-3 rounded-xl bg-[#190730] border border-purple-500/30 text-white text-base sm:text-xs resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Time Capsule Letters (Chapter 06) */}
          {activeTab === 'letters' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-400/30">
                <p className="text-xs text-purple-200 leading-relaxed">
                  ⏳ <strong>Chapter 06 Time Capsule:</strong> Inscribe the 4 royal wax-sealed letters addressed to your future milestones. She will unseal each letter one-by-one with golden starlight!
                </p>
              </div>

              {(config.futureLetters || defaultProposalConfig.futureLetters || []).map((letter, idx) => (
                <div key={letter.id} className="p-4 sm:p-5 rounded-2xl bg-[#140528] border border-purple-500/25 space-y-3">
                  <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                    <span className="font-heading text-xs font-semibold uppercase text-pink-300">
                      Letter {letter.roman} · {letter.year}
                    </span>
                    <span className="text-xs text-purple-300/80 font-medium">{letter.tag}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-purple-300 uppercase mb-1 font-medium">
                        Milestone Title
                      </label>
                      <input
                        type="text"
                        value={letter.milestone}
                        onChange={(e) => {
                          const currentLetters = config.futureLetters || defaultProposalConfig.futureLetters || [];
                          const updated = [...currentLetters];
                          updated[idx] = { ...updated[idx], milestone: e.target.value };
                          setConfig({ ...config, futureLetters: updated });
                        }}
                        className="w-full p-3 rounded-xl bg-[#190730] border border-purple-500/30 text-white text-base sm:text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-purple-300 uppercase mb-1 font-medium">
                        Year / Phase Label
                      </label>
                      <input
                        type="text"
                        value={letter.year}
                        onChange={(e) => {
                          const currentLetters = config.futureLetters || defaultProposalConfig.futureLetters || [];
                          const updated = [...currentLetters];
                          updated[idx] = { ...updated[idx], year: e.target.value };
                          setConfig({ ...config, futureLetters: updated });
                        }}
                        className="w-full p-3 rounded-xl bg-[#190730] border border-purple-500/30 text-white text-base sm:text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-purple-300 uppercase mb-1 font-medium">
                      Full Future Vow / Letter Body
                    </label>
                    <textarea
                      rows={3}
                      value={letter.fullLetter}
                      onChange={(e) => {
                        const currentLetters = config.futureLetters || defaultProposalConfig.futureLetters || [];
                        const updated = [...currentLetters];
                        updated[idx] = { ...updated[idx], fullLetter: e.target.value };
                        setConfig({ ...config, futureLetters: updated });
                      }}
                      className="w-full p-3 rounded-xl bg-[#190730] border border-purple-500/30 text-white text-base sm:text-xs resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: 7 Stars of Us (Chapter 03) */}
          {activeTab === 'stars' && (
            <div className="space-y-4">
              <p className="text-xs text-purple-300/80">
                Inscribe the 7 personal starlight notes she discovers when collecting all 7 stars in Chapter 03.
              </p>
              {config.gameStars.map((star, idx) => (
                <div
                  key={star.id}
                  className="p-3.5 sm:p-4 rounded-xl bg-[#140528] border border-purple-500/25 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
                >
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 font-heading text-xs font-semibold flex items-center justify-center">
                      ★ {star.id}
                    </span>
                    <span className="text-xs font-heading uppercase text-purple-300 sm:hidden">
                      Star #{star.id}
                    </span>
                  </div>

                  <input
                    type="text"
                    value={star.title}
                    onChange={(e) => {
                      const updated = [...config.gameStars];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setConfig({ ...config, gameStars: updated });
                    }}
                    placeholder="Star Title"
                    className="w-full sm:w-1/3 p-3 sm:p-2.5 rounded-xl bg-[#190730] border border-purple-500/30 text-white text-base sm:text-xs"
                  />

                  <input
                    type="text"
                    value={star.note}
                    onChange={(e) => {
                      const updated = [...config.gameStars];
                      updated[idx] = { ...updated[idx], note: e.target.value };
                      setConfig({ ...config, gameStars: updated });
                    }}
                    placeholder="Personal Note / Vow revealed upon tap"
                    className="w-full sm:flex-1 p-3 sm:p-2.5 rounded-xl bg-[#190730] border border-purple-500/30 text-white text-base sm:text-xs"
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Love Reasons (Chapter 05) */}
          {activeTab === 'reasons' && (
            <div className="space-y-4">
              <p className="text-xs text-purple-300/80">
                Edit the romantic reasons presented one-by-one with swipe cards in Chapter 05.
              </p>
              {config.reasons.map((r, idx) => (
                <div key={r.id} className="p-4 rounded-xl bg-[#140528] border border-purple-500/25 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-pink-300 font-heading font-semibold uppercase">
                      Reason 0{r.number}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={r.short}
                    onChange={(e) => {
                      const updated = [...config.reasons];
                      updated[idx] = { ...updated[idx], short: e.target.value };
                      setConfig({ ...config, reasons: updated });
                    }}
                    placeholder="Short Headline"
                    className="w-full p-3 sm:p-2.5 rounded-xl bg-[#190730] border border-purple-500/30 text-white text-base sm:text-xs"
                  />
                  <textarea
                    rows={2}
                    value={r.detail}
                    onChange={(e) => {
                      const updated = [...config.reasons];
                      updated[idx] = { ...updated[idx], detail: e.target.value };
                      setConfig({ ...config, reasons: updated });
                    }}
                    placeholder="Deep vow detail"
                    className="w-full p-3 sm:p-2.5 rounded-xl bg-[#190730] border border-purple-500/30 text-white text-base sm:text-xs resize-none"
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: Supabase SQL Setup */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/60 border border-purple-400/40 space-y-3 text-xs sm:text-sm">
                <span className="font-heading text-pink-300 font-semibold uppercase tracking-wider block text-sm">
                  ⚡ 1-Time Supabase Database Setup
                </span>
                <p className="text-purple-200/90 leading-relaxed">
                  To allow this admin studio to store your custom photos, names, and vows into your personal Supabase project, follow these 2 quick steps:
                </p>

                <ol className="list-decimal pl-5 space-y-2 text-purple-200 text-xs">
                  <li>
                    Open your{' '}
                    <a
                      href="https://supabase.com/dashboard/project/aohrpdpswmrlizlqcrdy/sql/new"
                      target="_blank"
                      rel="noreferrer"
                      className="text-pink-300 underline font-semibold inline-flex items-center gap-1"
                    >
                      Supabase SQL Editor ↗
                    </a>
                  </li>
                  <li>
                    Click the <strong>Copy SQL Code</strong> button below, paste it into the editor, and click <strong>"Run"</strong>.
                  </li>
                </ol>

                <div className="relative pt-2">
                  <pre className="p-4 rounded-xl bg-[#0a0214] border border-purple-500/30 text-[11px] sm:text-xs font-mono text-purple-200 overflow-x-auto select-all leading-relaxed">
{sqlSetupScript}
                  </pre>

                  <button
                    type="button"
                    onClick={copySqlToClipboard}
                    className="mt-3 w-full sm:w-auto px-5 py-2.5 rounded-full bg-purple-800 hover:bg-purple-700 text-white font-heading text-xs font-semibold uppercase tracking-wide border border-purple-400/40 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <span>{copiedSql ? '✓ Copied to Clipboard!' : '📋 Copy SQL Code'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Mobile-Friendly Save Action Bar */}
        <div className="fixed bottom-0 inset-x-0 z-40 bg-[#120422]/95 backdrop-blur-xl border-t border-purple-500/30 p-3.5 sm:p-4 shadow-[0_-10px_35px_rgba(0,0,0,0.8)]">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Reset all form fields to default BTS Borahae template?")) {
                  setConfig(defaultProposalConfig);
                }
              }}
              className="text-xs font-heading text-purple-400 hover:text-purple-200 transition-colors uppercase whitespace-nowrap px-2 py-1"
            >
              Reset
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={handleSaveToDatabase}
              className="flex-1 sm:flex-none px-6 sm:px-9 py-3.5 min-h-[48px] rounded-full bg-gradient-to-r from-purple-700 via-pink-600 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white font-heading text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-[0_0_30px_rgba(240,171,252,0.4)] border border-pink-300/40 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <span className="animate-spin text-base">✦</span>
                  <span>Saving to Supabase...</span>
                </>
              ) : (
                <span>Save to Supabase Database</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
