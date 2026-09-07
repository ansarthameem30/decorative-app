import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProposalConfig } from '../../types/proposal';
import { saveStoredProposalConfig, defaultProposalConfig } from '../../config/proposalContent';

interface CustomizerModalProps {
  config: ProposalConfig;
  onSave: (updated: ProposalConfig) => void;
  onClose: () => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({ config, onSave, onClose }) => {
  const [formData, setFormData] = useState<ProposalConfig>(config);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredProposalConfig(formData);
    onSave(formData);
    onClose();
  };

  const handleReset = () => {
    setFormData(defaultProposalConfig);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-xl bg-gradient-to-b from-[#18082c] to-[#0d0317] rounded-3xl p-6 sm:p-9 border border-purple-400/40 shadow-2xl text-left my-8 max-h-[90dvh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-3 mb-5">
          <div>
            <h3 className="font-heading text-lg sm:text-xl text-white font-semibold tracking-wide">
              Proposal Customization
            </h3>
            <p className="text-xs text-purple-300/70 font-sans mt-0.5 font-normal">
              Personalize names, question, and WhatsApp before sharing your link.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-white p-2 rounded-full hover:bg-purple-900/40 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4 font-sans text-xs">
          {/* Her Name & Your Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-purple-300 font-heading tracking-wider uppercase mb-1">
                Her Name
              </label>
              <input
                type="text"
                value={formData.herName}
                onChange={(e) => setFormData({ ...formData, herName: e.target.value })}
                className="w-full p-3 rounded-xl bg-[#120520] border border-purple-500/30 text-white focus:outline-none focus:border-pink-400 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-purple-300 font-heading tracking-wider uppercase mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={formData.yourName}
                onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
                className="w-full p-3 rounded-xl bg-[#120520] border border-purple-500/30 text-white focus:outline-none focus:border-pink-400 text-sm"
                required
              />
            </div>
          </div>

          {/* Proposal Question */}
          <div>
            <label className="block text-purple-300 font-heading tracking-wider uppercase mb-1">
              Proposal Question
            </label>
            <input
              type="text"
              value={formData.proposalQuestion}
              onChange={(e) => setFormData({ ...formData, proposalQuestion: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#120520] border border-purple-500/30 text-white focus:outline-none focus:border-pink-400 text-sm"
              required
            />
          </div>

          {/* WhatsApp Phone for instant YES text */}
          <div>
            <label className="block text-purple-300 font-heading tracking-wider uppercase mb-1">
              Your WhatsApp Phone Number (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 15551234567 (with country code, no + or spaces)"
              value={formData.whatsappPhone || ''}
              onChange={(e) => setFormData({ ...formData, whatsappPhone: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#120520] border border-purple-500/30 text-white focus:outline-none focus:border-pink-400 text-sm"
            />
            <p className="text-[10px] text-purple-400/60 mt-1">
              When she taps YES, it will prompt her to send you a pre-filled WhatsApp confirmation.
            </p>
          </div>

          {/* Invitation Subtitle */}
          <div>
            <label className="block text-purple-300 font-heading tracking-wider uppercase mb-1">
              Opening Subtitle
            </label>
            <input
              type="text"
              value={formData.invitationSubtitle}
              onChange={(e) => setFormData({ ...formData, invitationSubtitle: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#120520] border border-purple-500/30 text-white focus:outline-none focus:border-pink-400 text-sm"
            />
          </div>

          {/* Story Slides Photos */}
          <div className="pt-2 border-t border-purple-500/20">
            <h4 className="font-heading text-xs tracking-wider uppercase text-pink-300 mb-2">
              Story Memory Photos (Image URLs)
            </h4>
            <div className="flex flex-col gap-3">
              {formData.storySlides.map((slide, i) => (
                <div key={slide.id} className="p-3 rounded-xl bg-[#10031c] border border-purple-500/20">
                  <div className="font-heading text-[11px] text-purple-200 mb-1">
                    Slide {i + 1}: {slide.title}
                  </div>
                  <input
                    type="url"
                    placeholder="Paste image URL here"
                    value={slide.imageUrl || ''}
                    onChange={(e) => {
                      const updatedSlides = [...formData.storySlides];
                      updatedSlides[i] = { ...updatedSlides[i], imageUrl: e.target.value };
                      setFormData({ ...formData, storySlides: updatedSlides });
                    }}
                    className="w-full p-2 rounded-lg bg-[#180729] border border-purple-500/30 text-xs text-white focus:outline-none focus:border-pink-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] font-heading tracking-wider uppercase text-purple-400 hover:text-purple-200"
            >
              Reset to Default
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-purple-500/30 text-purple-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="font-heading text-xs font-semibold tracking-wide uppercase px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-800 to-pink-600 hover:from-purple-700 hover:to-pink-500 text-white shadow-lg transition-all active:scale-95"
              >
                Save & Update Live
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
