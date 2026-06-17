import React, { useState } from "react";
import { JournalEntry } from "../types";
import { Calendar, Smile, ShieldAlert, Sparkles, BookOpen, RefreshCw, Send, Trash2, Heart, Award } from "lucide-react";
import { motion } from "motion/react";

interface JournalSectionProps {
  entries: JournalEntry[];
  onAddJournalEntry: (entryText: string, mood: string, moodScore: number) => Promise<void>;
  onDeleteJournalEntry: (id: string) => void;
  entriesLoading: boolean;
}

export default function JournalSection({
  entries,
  onAddJournalEntry,
  onDeleteJournalEntry,
  entriesLoading,
}: JournalSectionProps) {
  const [entryText, setEntryText] = useState("");
  const [selectedMood, setSelectedMood] = useState("Paralyzed/Frozen");
  const [moodScore, setMoodScore] = useState(3);
  const [activeTab, setActiveTab] = useState<"write" | "history">("write");

  const moodDescriptors: { [key: number]: string } = {
    1: "My magic wand feels heavy & depleted 🌧️",
    2: "Deep unicorn freeze state 🧊",
    3: "Paralyzed / locked in a tower 💭",
    4: "Apathetic/Flat forest dust 🌫️",
    5: "Treading misty water peacefully ⚖️",
    6: "A tiny cute seed of focus starting 🌱",
    7: "Slightly hopeful / Doing micro-steps ✨",
    8: "Steady, grounded unicorn focus 🦄",
    9: "Engaged & soaring higher 🔮",
    10: "Full of colorful starlight & energy! 🌈💎",
  };

  const moodEmojis: { [key: string]: string } = {
    "Heavy/Down": "🌧️ Downcast Rain",
    "Anxious/Worry": "💭 Fluttery Brain",
    "Paralyzed/Frozen": "🧊 Unicorn Freeze",
    "Apathetic/Flat": "🌫️ Misty forest",
    "Neutral/Steady": "⚖️ Calm balance",
    "Flicker of Hope": "🌱 Sweet Dreamer",
    "Calm/Grounded": "🧘 Mystic Grounding",
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryText.trim()) return;
    await onAddJournalEntry(entryText.trim(), selectedMood, moodScore);
    setEntryText("");
    setSelectedMood("Neutral/Steady");
    setMoodScore(5);
    setActiveTab("history"); // Transition to history tab to watch real-time analysis
  };

  return (
    <div className="space-y-6" id="journal-section-container">
      {/* Tab bar header */}
      <div className="flex border-b-2 border-pink-100" id="journal-view-tabs">
        <button
          onClick={() => setActiveTab("write")}
          className={`px-5 py-3 font-bold text-xs uppercase tracking-wider border-b-4 transition-all -mb-[2px] flex items-center gap-2 ${
            activeTab === "write"
              ? "border-pink-500 text-pink-600"
              : "border-transparent text-purple-400 hover:text-purple-600"
          }`}
          id="journal-tab-write"
        >
          <BookOpen className="w-4 h-4 text-pink-500" />
          Reflect & Diagnose 🔮
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`px-5 py-3 font-bold text-xs uppercase tracking-wider border-b-4 transition-all -mb-[2px] flex items-center gap-2 ${
            activeTab === "history"
              ? "border-pink-500 text-pink-600"
              : "border-transparent text-purple-400 hover:text-purple-600"
          }`}
          id="journal-tab-history"
        >
          <Smile className="w-4 h-4 text-purple-500" />
          Magical Memory Spells ({entries.length})
        </button>
      </div>

      {activeTab === "write" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="journal-writer-view">
          {/* Note inputs */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-gradient-to-br from-pink-50/70 via-purple-50/70 to-blue-50/70 p-5 border border-pink-200 rounded-3xl shadow-xs">
              <h3 className="text-sm font-bold text-purple-900 mb-1 flex items-center gap-1.5">
                🌸 Wish & Worry Journal Log
              </h3>
              <p className="text-xs text-purple-600 mb-4">
                Let your worried thoughts fall onto this page. Your Unicorn Companion maps them safely using Cognitive Behavioral Therapy principles.
              </p>

              <form onSubmit={handlePublish} className="space-y-4">
                {/* Mood Tag & Score Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-purple-700">Heart State Today</label>
                    <select
                      value={selectedMood}
                      onChange={(e) => setSelectedMood(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-pink-200 rounded-xl outline-none cursor-pointer focus:border-pink-500 transition shadow-inner"
                      id="select-journal-mood"
                    >
                      {Object.keys(moodEmojis).map((mood) => (
                        <option key={mood} value={mood}>
                          {moodEmojis[mood]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-purple-700">Magic Energy Rating</label>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={moodScore}
                        onChange={(e) => setMoodScore(Number(e.target.value))}
                        className="w-full h-2 bg-pink-100 rounded-full appearance-none cursor-pointer accent-pink-500"
                        id="input-journal-score-slider"
                      />
                      <span className="text-xs font-bold px-2 py-1 bg-pink-500 text-white rounded-lg min-w-[2.2rem] text-center shadow-xs">
                        {moodScore}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Slider descriptor badge */}
                <div className="text-purple-700 text-xs font-bold border-l-4 border-pink-300 pl-3 py-1 bg-white/70 rounded-r-lg">
                  State: <span className="text-pink-600">{moodDescriptors[moodScore]}</span>
                </div>

                {/* Journal Textarea */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-purple-700">Pour your thoughts freely</label>
                    <span className="text-[10px] text-pink-500 font-mono italic">Starlight Ink Active</span>
                  </div>
                  <textarea
                    required
                    rows={8}
                    className="w-full text-xs sm:text-xs md:text-sm p-4 bg-white border border-pink-200 rounded-2xl outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition leading-relaxed placeholder:text-purple-300 shadow-inner"
                    placeholder="e.g. I got so overwhelmed today. I feel like because I skipped study, I am completely failing my life and will never catch up. Write exactly what your shadow voice is telling you; we will turn it into sweet stars..."
                    value={entryText}
                    onChange={(e) => setEntryText(e.target.value)}
                    id="input-journal-entry-text"
                  ></textarea>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-purple-400">
                    <Calendar className="w-3.5 h-3.5 text-pink-400" />
                    <span>Sealed with safety</span>
                  </div>

                  <button
                    type="submit"
                    disabled={entriesLoading || !entryText.trim()}
                    className="inline-flex items-center gap-1.5 px-5 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:opacity-95 text-white font-bold text-xs rounded-full shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    id="btn-submit-journal"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Perform Star Analysis ✨
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Whimsical therapeutic guidelines */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 border-2 border-pink-100 bg-gradient-to-b from-pink-50/50 to-purple-50/50 rounded-3xl shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-purple-800 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-pink-500" /> Grounding Spellwork
              </h4>
              <p className="text-xs text-purple-700 leading-relaxed">
                Struggles happen when your shadow mind wraps beautiful feelings inside three standard **intrusive spells**:
              </p>

              <div className="space-y-3 pt-1">
                <div className="p-3 bg-white border border-pink-100 rounded-xl space-y-0.5">
                  <p className="text-[11px] font-bold text-pink-600 uppercase">1. All-or-Nothing Filter 🧊</p>
                  <p className="text-xs text-purple-800">"If I can't study for 4 hours, doing 10 minutes is a waste of a day." (Truth: 10 minutes is an admirable loop. Every action count!)</p>
                </div>

                <div className="p-3 bg-white border border-purple-100 rounded-xl space-y-0.5">
                  <p className="text-[11px] font-bold text-purple-600 uppercase">2. Emotional Reasoning 🌧️</p>
                  <p className="text-xs text-purple-800">"I feel heavy, so I must indeed be lazy." (Truth: Feelings are physical clouds, they are not your identity.)</p>
                </div>

                <div className="p-3 bg-white border border-blue-100 rounded-xl space-y-0.5">
                  <p className="text-[11px] font-bold text-blue-600 uppercase">3. Catastrophizing ⛈️</p>
                  <p className="text-xs text-purple-800">"I missed today, so I'm doomed to fail my career." (Truth: Missing one loop is just normal data, not an end report of failure.)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* History Archive layout */
        <div className="space-y-4" id="journal-history-panel">
          {entries.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-pink-200 bg-pink-50/10 rounded-2xl animate-pulse" id="empty-journal-history">
              <BookOpen className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-pink-700">No memories written down yet.</p>
              <p className="text-xs text-purple-500 mt-1">Tap the 'Reflect & Diagnose' tab above to launch your first star spell!</p>
            </div>
          ) : (
            <div className="space-y-6" id="journal-history-list">
              {entries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-5 border-2 border-pink-100 bg-white rounded-3xl shadow-sm space-y-4"
                  id={`history-${entry.id}`}
                >
                  {/* Entry Header */}
                  <div className="flex justify-between items-start gap-4 flex-wrap border-b border-pink-50 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-purple-800 text-xs font-bold rounded-full border border-pink-200 flex items-center gap-1">
                          {entry.mood}
                        </span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-100 text-[10px] font-bold rounded-full">
                          Energy: {entry.moodScore}/10 ⚡
                        </span>
                      </div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-purple-400">
                        {new Date(entry.date).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>

                    <button
                      onClick={() => onDeleteJournalEntry(entry.id)}
                      className="p-1.5 text-pink-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition"
                      title="Remove entry from memory"
                      id={`btn-delete-entry-${entry.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Entry text body */}
                  <div className="space-y-1.5">
                    <p className="text-[9px] uppercase font-bold tracking-widest text-purple-300">Your Reflection Text</p>
                    <p className="text-xs text-purple-900 font-semibold leading-relaxed whitespace-pre-wrap italic pl-2 border-l-2 border-pink-300">
                      "{entry.entryText}"
                    </p>
                  </div>

                  {/* Counselor Analysis feedback block */}
                  <div className="mt-4 p-4.5 bg-gradient-to-br from-pink-50/50 via-purple-50/50 to-blue-50/30 border border-pink-200 rounded-2xl space-y-4" id={`analysis-block-${entry.id}`}>
                    <div className="flex items-center gap-1.5 border-b border-pink-100/60 pb-2">
                      <Sparkles className="w-4 h-4 text-pink-500" />
                      <h4 className="text-xs font-bold text-purple-900 uppercase tracking-widest flex items-center gap-1">
                        Unicorn Counsel Insights Sparkle
                      </h4>
                    </div>

                    {entry.analyzing ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-purple-700 animate-pulse">
                        <RefreshCw className="w-4 h-4 animate-spin text-pink-500" />
                        <span>Applying CBT starlight to your text...</span>
                      </div>
                    ) : entry.analyzedFeedback ? (
                      <div className="space-y-3 px-1 text-xs text-purple-950 leading-relaxed">
                        <div className="space-y-1">
                          <p className="font-bold text-purple-900 flex items-center gap-1">🌸 Validation:</p>
                          <p className="text-[11px] text-purple-850 bg-white/40 p-2.5 rounded-xl border border-pink-100/40">{entry.analyzedFeedback.analysisText}</p>
                        </div>

                        {entry.analyzedFeedback.identifiedDistortions && entry.analyzedFeedback.identifiedDistortions.length > 0 && (
                          <div className="space-y-1">
                            <p className="font-bold text-purple-900 flex items-center gap-1">🔮 Distortions detected:</p>
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {entry.analyzedFeedback.identifiedDistortions.map((dist, idx) => (
                                <span
                                  key={idx}
                                  className="px-2.5 py-0.5 bg-pink-100 text-pink-850 hover:bg-pink-200 border border-pink-200/50 rounded-full text-[9px] font-bold"
                                >
                                  {dist}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-1">
                          <p className="font-bold text-purple-900 flex items-center gap-1">✨ Elegant Reframe perspective:</p>
                          <p className="text-[11px] text-purple-850 bg-white/70 p-3 rounded-xl border border-pink-100 italic leading-relaxed">
                            {entry.analyzedFeedback.cognitiveReframing}
                          </p>
                        </div>

                        {entry.analyzedFeedback.copingExercises && entry.analyzedFeedback.copingExercises.length > 0 && (
                          <div className="space-y-1">
                            <p className="font-bold text-purple-900 flex items-center gap-1">🦄 Healing Grounding rituals:</p>
                            <ul className="list-disc list-inside space-y-1 text-purple-900/90 pl-1">
                              {entry.analyzedFeedback.copingExercises.map((ex, idx) => (
                                <li key={idx} className="marker:text-pink-500 text-justify">
                                  {ex}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-purple-400 italic">No feedback cached.</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
