import React, { useState } from "react";
import { AffirmationState, UserProfile } from "../types";
import { Sparkles, RefreshCw, Compass, Heart, User, Target, Gift, Star } from "lucide-react";
import { motion } from "motion/react";

interface AffirmationSectionProps {
  profile: UserProfile;
  affirmation: AffirmationState;
  onRefreshAffirmation: () => Promise<void>;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export default function AffirmationSection({
  profile,
  affirmation,
  onRefreshAffirmation,
  onUpdateProfile,
}: AffirmationSectionProps) {
  const [editingConfig, setEditingConfig] = useState(false);
  const [tempName, setTempName] = useState(profile.name || "");
  const [tempGoal, setTempGoal] = useState(profile.focusGoal || "");
  const [tempStruggles, setTempStruggles] = useState(profile.struggles || "");

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: tempName.trim(),
      focusGoal: tempGoal.trim(),
      struggles: tempStruggles.trim(),
      initialized: true,
    });
    setEditingConfig(false);
  };

  return (
    <div className="space-y-6" id="affirmation-section-container">
      {/* Whimsical guide cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="affirmation-guide-cards">
        <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100/50 border border-pink-200/60 rounded-2xl flex items-start gap-3">
          <Heart className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0 animate-pulse" />
          <div>
            <h4 className="text-xs font-bold text-pink-900">Sweet Compassion</h4>
            <p className="text-[11px] text-pink-700/80 mt-0.5">Focus blossoms when surrounded by comfort, not criticism. Treat yourself with pink starry stardust! ✨</p>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/60 rounded-2xl flex items-start gap-3">
          <Target className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-purple-900">Unicorn FocusTips</h4>
            <p className="text-[11px] text-purple-700/80 mt-0.5">When feeling frozen, look for actions that require under 2 minutes of energy. Tiny ripples create magic waves.</p>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/60 rounded-2xl flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-blue-900">Magic Alignment</h4>
            <p className="text-[11px] text-blue-700/80 mt-0.5">Your coach uses the Gemini guide to translate struggles into custom therapeutic protection. 🦄</p>
          </div>
        </div>
      </div>

      {/* Primary Affirmation Card */}
      <motion.div
        layout
        className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-pink-100/40 via-purple-100/40 to-blue-100/40 border-2 border-pink-200/80 rounded-3xl shadow-sm text-center space-y-6"
        id="live-affirmation-card"
      >
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <span className="inline-flex items-center gap-1 text-[10px] bg-white text-purple-700 font-bold px-2.5 py-1 rounded-full border border-pink-200 shadow-xs">
            <Sparkles className="w-3 h-3 text-pink-500 animate-pulse" />
            Unicorn Counselor
          </span>
        </div>

        <div className="space-y-4 max-w-2xl mx-auto pt-4">
          <span className="text-3xl inline-block animate-bounce">🦄✨</span>
          
          {affirmation.loading ? (
            <div className="py-8 space-y-3" id="affirmation-skeleton">
              <RefreshCw className="w-8 h-8 text-pink-500 animate-spin mx-auto" />
              <p className="text-xs font-bold text-purple-800 animate-pulse font-serif italic">
                Brewing your magical stars & daily confidence...
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
              id="affirmation-real-content"
            >
              <blockquote className="text-base sm:text-lg font-bold font-serif text-pink-950 italic leading-relaxed tracking-tight" id="text-affirmation">
                "{affirmation.affirmation || "Today, I give myself permission to move at my own beautiful speed. I am a sparkling, resilient soul."}"
              </blockquote>

              <div className="w-16 h-1 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 mx-auto rounded-full"></div>

              <div className="space-y-2 text-left bg-white/80 p-4 border border-pink-200 rounded-2xl max-w-lg mx-auto shadow-sm">
                <p className="text-[10px] font-bold text-pink-700 tracking-widest uppercase flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> Star-dust Task of Focus
                </p>
                <p className="text-xs text-purple-950 leading-relaxed font-bold">
                  {affirmation.focusTip || "Rest your hands, tap your favorite finger three times to steady your heartbeat, and look at something cute."}
                </p>
              </div>

              <div className="text-purple-700 text-xs font-medium text-center max-w-sm mx-auto leading-relaxed pt-1">
                🧁 {affirmation.supportiveMessage || "Your absolute value isn't attached to standard routines. You are loved, cared for, and completely capable."}
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-3">
          <button
            onClick={onRefreshAffirmation}
            disabled={affirmation.loading}
            className="inline-flex items-center gap-1.5 px-5 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-bold text-xs rounded-full shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            id="btn-refresh-affirmation"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${affirmation.loading ? "animate-spin" : ""}`} />
            Refresh magical affirmation
          </button>

          <button
            onClick={() => {
              setTempName(profile.name);
              setTempGoal(profile.focusGoal);
              setTempStruggles(profile.struggles);
              setEditingConfig(!editingConfig);
            }}
            className="inline-flex items-center gap-1.5 px-5 py-3 bg-white border border-pink-200 hover:bg-pink-50 text-purple-700 font-bold text-xs rounded-full shadow-xs transition-all cursor-pointer"
            id="btn-configure-coaching"
          >
            <User className="w-3.5 h-3.5 text-pink-450" />
            {editingConfig ? "Close Wishbook" : "Calibrate Wishbook 🔮"}
          </button>
        </div>
      </motion.div>

      {/* Calibration details */}
      {editingConfig && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 border-2 border-pink-200 bg-white rounded-2xl shadow-md space-y-4"
          id="coaching-calibration-panel"
        >
          <div className="border-b border-pink-100 pb-3">
            <h3 className="text-sm font-bold text-purple-900 flex items-center gap-1.5">
              <Gift className="w-4.5 h-4.5 text-pink-500" /> Share your struggles with the Unicorn Spirit
            </h3>
            <p className="text-xs text-purple-600 mt-0.5">
              By pouring your heart's blockages into this wishbook, Gemini can formulate highly safe, caring, and soothing instructions for you.
            </p>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                  Magical Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Princess Emily"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-pink-50/20 border border-pink-100 rounded-xl outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-200 transition"
                  id="calibrate-name"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="block text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                  Dream Habit or Sparkle Goal
                </label>
                <input
                  type="text"
                  placeholder="e.g. Drinking fresh strawberry tea, sketching for 10 minutes"
                  value={tempGoal}
                  onChange={(e) => setTempGoal(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-pink-50/20 border border-pink-100 rounded-xl outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-200 transition"
                  id="calibrate-goal"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                Current heart blockages & shadows (What drains your energy?)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Brain fog from missing sleep, giant scary lists of tasks, low self-esteem make me feel locked in bed..."
                value={tempStruggles}
                onChange={(e) => setTempStruggles(e.target.value)}
                className="w-full text-xs p-3.5 bg-pink-50/20 border border-pink-100 rounded-xl outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-200 transition resize-none leading-relaxed"
                id="calibrate-struggles"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => setEditingConfig(false)}
                className="px-3.5 py-2 text-purple-500 hover:text-purple-700 text-xs font-bold"
                id="btn-cancel-config"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
                id="btn-save-config"
              >
                Bind magic details ✨
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}
