import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProposalConfig } from '../../types/proposal';
import { defaultProposalConfig, saveStoredProposalConfig } from '../../config/proposalContent';
import { generateSurpriseLink, compressImageFile } from '../../utils/proposalShare';

interface ProposalStudioModalProps {
  config: ProposalConfig;
  onSave: (updated: ProposalConfig) => void;
  onClose: () => void;
}

type TabType = 'couple' | 'milestones' | 'stars' | 'share';

const PRESET_PHOTOS = [
  { label: 'Starry Night', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000&auto=format&fit=crop' },
  { label: 'Golden Sunset', url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000&auto=format&fit=crop' },
  { label: 'Cherry Blossoms', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop' },
  { label: 'Dusk Amethyst', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop' },
  { label: 'Cosmic Mikrokosmos', url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1000&auto=format&fit=crop' },
];

export const ProposalStudioModal: React.FC<ProposalStudioModalProps> = ({
  config,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<ProposalConfig>(config);
  const [activeTab, setActiveTab] = useState<TabType>('couple');
  const [copiedLink, setCopiedLink] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handlePhotoUpload = async (index: number, file: File) => {
    try {
      setUploadingIndex(index);
      const base64 = await compressImageFile(file);
      const updatedSlides = [...formData.storySlides];
      updatedSlides[index] = { ...updatedSlides[index], imageUrl: base64 };
      setFormData(prev => ({ ...prev, storySlides: updatedSlides }));
    } catch (err) {
      console.error('Failed to compress uploaded photo', err);
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSaveAndApply = () => {
    saveStoredProposalConfig(formData);
    onSave(formData);
    onClose();
  };

  const handleCopyLink = () => {
    const link = generateSurpriseLink(formData);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleDownloadConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "proposal-config.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleReset = () => {
    if (window.confirm("Reset all customizations back to default BTS Borahae template?")) {
      setFormData(defaultProposalConfig);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#18082e] via-[#0f041d] to-[#080210] rounded-3xl border border-purple-500/30 shadow-[0_20px_80px_rgba(139,92,246,0.3)] my-auto max-h-[92dvh] flex flex-col overflow-hidden text-left"
      >
        {/* Studio Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-[#120524]/60 backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              <h3 className="font-heading text-base sm:text-lg text-white font-semibold tracking-wide">
                Proposal Studio
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-purple-300/70 font-sans mt-0.5">
              Personalize names, vows, and photos, then copy her surprise link.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-purple-300 hover:text-white hover:bg-purple-900/40 transition-colors"
            aria-label="Close Studio"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-1.5 px-6 py-3 border-b border-purple-500/15 overflow-x-auto scrollbar-none bg-[#0a0214]/50">
          {[
            { id: 'couple', label: 'The Couple & Vows' },
            { id: 'milestones', label: 'Our Milestones' },
            { id: 'stars', label: '7 Stars of Us' },
            { id: 'share', label: 'Share Surprise Link' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-medium tracking-wide whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-700 to-pink-600 text-white shadow-md'
                  : 'text-purple-300/70 hover:text-white hover:bg-purple-900/25'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 font-sans text-xs">
          {/* TAB 1: The Couple & Vows */}
          {activeTab === 'couple' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-200 font-heading text-xs tracking-wider uppercase mb-1.5 font-medium">
                    Her Name
                  </label>
                  <input
                    type="text"
                    value={formData.herName}
                    onChange={(e) => setFormData({ ...formData, herName: e.target.value })}
                    placeholder="e.g. Sarah, Jasmine"
                    className="w-full p-3 rounded-xl bg-[#130526] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-pink-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-purple-200 font-heading text-xs tracking-wider uppercase mb-1.5 font-medium">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.yourName}
                    onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
                    placeholder="e.g. Alex"
                    className="w-full p-3 rounded-xl bg-[#130526] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-pink-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-purple-200 font-heading text-xs tracking-wider uppercase mb-1.5 font-medium">
                  The Proposal Question
                </label>
                <input
                  type="text"
                  value={formData.proposalQuestion}
                  onChange={(e) => setFormData({ ...formData, proposalQuestion: e.target.value })}
                  placeholder="Will You Spend Forever With Me?"
                  className="w-full p-3 rounded-xl bg-[#130526] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-pink-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-purple-200 font-heading text-xs tracking-wider uppercase mb-1.5 font-medium">
                  Opening Subtitle / Quote
                </label>
                <textarea
                  rows={2}
                  value={formData.invitationSubtitle}
                  onChange={(e) => setFormData({ ...formData, invitationSubtitle: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#130526] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-pink-400 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-purple-200 font-heading text-xs tracking-wider uppercase mb-1.5 font-medium">
                  WhatsApp Phone Number for Instant "YES" Confirmation
                </label>
                <input
                  type="tel"
                  value={formData.whatsappPhone || ''}
                  onChange={(e) => setFormData({ ...formData, whatsappPhone: e.target.value })}
                  placeholder="e.g. 15551234567 (include country code, numbers only)"
                  className="w-full p-3 rounded-xl bg-[#130526] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-pink-400 transition-colors"
                />
                <p className="text-[11px] text-purple-400/70 mt-1">
                  When she presses "Yes, I Purple You", it will prompt her to send a pre-filled celebratory text to this number.
                </p>
              </div>
            </motion.div>
          )}

          {/* TAB 2: Our Milestones & Photos */}
          {activeTab === 'milestones' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-5"
            >
              <p className="text-purple-300/80 text-xs">
                Upload your couple photos directly from your device or pick a romantic starlight preset.
              </p>

              {formData.storySlides
                .filter((s) => !s.isGameSlide)
                .map((slide, idx) => (
                  <div
                    key={slide.id}
                    className="p-4 rounded-2xl bg-[#120524] border border-purple-500/20 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-xs font-semibold uppercase text-pink-300">
                        Milestone 0{idx + 1} · {slide.title}
                      </span>
                      <span className="text-[11px] text-purple-400 font-medium">{slide.date}</span>
                    </div>

                    {/* Photo Row: Preview + Upload Button */}
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-purple-950 border border-purple-500/30 flex-shrink-0 relative">
                        {slide.imageUrl ? (
                          <img
                            src={slide.imageUrl}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-purple-500 text-[10px] text-center p-1">
                            No Photo
                          </div>
                        )}
                        {uploadingIndex === idx && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-[10px] text-pink-300 font-medium">
                            Compressing...
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/40 hover:bg-purple-800/60 border border-purple-400/40 text-purple-200 text-xs font-heading font-medium cursor-pointer transition-colors active:scale-95">
                          <span>Upload Device Photo</span>
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

                        {/* Presets Quick Picker */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] text-purple-400">Or preset:</span>
                          {PRESET_PHOTOS.slice(0, 3).map((p) => (
                            <button
                              key={p.label}
                              type="button"
                              onClick={() => {
                                const updated = [...formData.storySlides];
                                updated[idx] = { ...updated[idx], imageUrl: p.url };
                                setFormData({ ...formData, storySlides: updated });
                              }}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950 border border-purple-500/20 text-purple-300 hover:text-white"
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Milestone Title & Description */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => {
                          const updated = [...formData.storySlides];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setFormData({ ...formData, storySlides: updated });
                        }}
                        placeholder="Milestone Title"
                        className="p-2.5 rounded-xl bg-[#16062a] border border-purple-500/30 text-white text-xs"
                      />
                      <input
                        type="text"
                        value={slide.date}
                        onChange={(e) => {
                          const updated = [...formData.storySlides];
                          updated[idx] = { ...updated[idx], date: e.target.value };
                          setFormData({ ...formData, storySlides: updated });
                        }}
                        placeholder="Date or Season"
                        className="p-2.5 rounded-xl bg-[#16062a] border border-purple-500/30 text-white text-xs"
                      />
                    </div>

                    <textarea
                      rows={2}
                      value={slide.description}
                      onChange={(e) => {
                        const updated = [...formData.storySlides];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setFormData({ ...formData, storySlides: updated });
                      }}
                      placeholder="The memory narrative..."
                      className="w-full p-2.5 rounded-xl bg-[#16062a] border border-purple-500/30 text-white text-xs resize-none"
                    />
                  </div>
                ))}
            </motion.div>
          )}

          {/* TAB 3: 7 Stars of Us */}
          {activeTab === 'stars' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <p className="text-purple-300/80 text-xs">
                Inscribe the 7 little things you love about her that she collects in the celestial mini-game.
              </p>

              {formData.gameStars.map((star, idx) => (
                <div
                  key={star.id}
                  className="p-3 rounded-xl bg-[#120524] border border-purple-500/20 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
                >
                  <span className="w-7 h-7 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 font-heading text-xs font-semibold flex items-center justify-center flex-shrink-0">
                    {star.id}
                  </span>

                  <input
                    type="text"
                    value={star.title}
                    onChange={(e) => {
                      const updated = [...formData.gameStars];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setFormData({ ...formData, gameStars: updated });
                    }}
                    placeholder="Star Title (e.g. Your Smile)"
                    className="w-full sm:w-1/3 p-2 rounded-lg bg-[#16062a] border border-purple-500/30 text-white text-xs"
                  />

                  <input
                    type="text"
                    value={star.note}
                    onChange={(e) => {
                      const updated = [...formData.gameStars];
                      updated[idx] = { ...updated[idx], note: e.target.value };
                      setFormData({ ...formData, gameStars: updated });
                    }}
                    placeholder="Short personal love note"
                    className="w-full sm:flex-1 p-2 rounded-lg bg-[#16062a] border border-purple-500/30 text-white text-xs"
                  />
                </div>
              ))}
            </motion.div>
          )}

          {/* TAB 4: Share & Surprise Link */}
          {activeTab === 'share' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 text-center py-4"
            >
              <div className="max-w-md mx-auto space-y-2">
                <span className="font-heading text-xs tracking-wider uppercase text-pink-300 font-semibold">
                  Surprise Ready
                </span>
                <h4 className="font-display text-2xl text-white font-normal">
                  Send This Universe Directly to Her
                </h4>
                <p className="text-purple-300/80 text-xs leading-relaxed">
                  Click below to copy your custom proposal link. When she opens it, the website opens automatically customized with her name, your photos, and your words—with the studio controls hidden so it feels like a bespoke luxury gift.
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-3">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-700 via-pink-600 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white font-heading text-sm font-semibold tracking-wide shadow-[0_0_35px_rgba(240,171,252,0.4)] border border-pink-300/40 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {copiedLink ? (
                    <>
                      <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Surprise Link Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      <span>Copy Her Surprise Link</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadConfig}
                  className="w-full py-2.5 px-4 rounded-xl border border-purple-500/30 bg-[#120524] text-purple-200 hover:text-white text-xs font-heading font-medium tracking-wide transition-colors"
                >
                  Download Configuration JSON
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Studio Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-purple-500/20 bg-[#0a0214]/80 backdrop-blur-xl">
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] font-heading uppercase text-purple-400 hover:text-purple-200 transition-colors"
          >
            Reset Template
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-purple-500/30 text-purple-300 hover:text-white text-xs font-heading"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveAndApply}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-600 hover:to-pink-500 text-white text-xs font-heading font-semibold shadow-lg transition-all active:scale-95"
            >
              Apply & Live Preview
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
