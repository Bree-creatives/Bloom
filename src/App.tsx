import React, { useState, useEffect } from "react";
import { Habit, JournalEntry, UserProfile, AffirmationState } from "./types";
import {
  SEED_HABITS,
  SEED_PROFILE,
  STORAGE_KEYS,
  getStoredData,
  writeStoredData,
  getLocalDateString,
  calculateStreakStats,
} from "./utils";
import HabitSection from "./components/HabitSection";
import AffirmationSection from "./components/AffirmationSection";
import JournalSection from "./components/JournalSection";
import DashboardSection from "./components/DashboardSection";
import ResourcesSection from "./components/ResourcesSection";
import {
  Sparkles,
  Heart,
  Compass,
  BookOpen,
  Smile,
  Flame,
  Star,
  Activity,
  ArrowRight,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() =>
    getStoredData(STORAGE_KEYS.PROFILE, SEED_PROFILE)
  );

  const [habits, setHabits] = useState<Habit[]>(() =>
    getStoredData(STORAGE_KEYS.HABITS, SEED_HABITS)
  );

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() =>
    getStoredData(STORAGE_KEYS.JOURNAL, [])
  );

  const [affirmation, setAffirmation] = useState<AffirmationState>(() =>
    getStoredData(STORAGE_KEYS.AFFIRMATION, {
      affirmation: "Today, I allow myself to move softly. Micro steps are my magic spells.",
      focusTip: "Place both feet flat on the ground and trace the pattern of a cute star.",
      supportiveMessage: "Welcome to your supportive space, dream companion! You are entirely valuable.",
      loading: false,
    })
  );

  // Switchable Tab controller
  const [activeTab, setActiveTab] = useState<"affirmations" | "habits" | "journal" | "dashboard" | "resources">("affirmations");

  // Load first affirmation dynamically when profile changes or launches
  useEffect(() => {
    if (profile.initialized && !affirmation.affirmation.includes("Today, I allow myself")) {
      // Don't auto-fetch if we already have custom data to prevent excessive API hits on mount
      return;
    }
    if (profile.initialized) {
      handleGetLiveAffirmation();
    }
  }, [profile.initialized]);

  // Save states to LocalStorage
  useEffect(() => {
    writeStoredData(STORAGE_KEYS.PROFILE, profile);
  }, [profile]);

  useEffect(() => {
    writeStoredData(STORAGE_KEYS.HABITS, habits);
  }, [habits]);

  useEffect(() => {
    writeStoredData(STORAGE_KEYS.JOURNAL, journalEntries);
  }, [journalEntries]);

  useEffect(() => {
    writeStoredData(STORAGE_KEYS.AFFIRMATION, affirmation);
  }, [affirmation]);

  // Fetch customizable counselor message
  const handleGetLiveAffirmation = async () => {
    setAffirmation((prev) => ({ ...prev, loading: true }));
    try {
      const response = await fetch("/api/affirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: journalEntries[0]?.mood || "Tired / Unfocused",
          moodScore: journalEntries[0]?.moodScore || 4,
          focusGoal: profile.focusGoal || "starting small manageable habits",
          name: profile.name || "friend",
          struggles: profile.struggles || "rebuilding focus and routine",
        }),
      });

      if (!response.ok) throw new Error("Server response not ok");
      const data = await response.json();
      setAffirmation({
        affirmation: data.affirmation,
        focusTip: data.focusTip,
        supportiveMessage: data.supportiveMessage,
        loading: false,
      });
    } catch (err) {
      console.error("Affirmation fetch failed:", err);
      // Fallback
      setAffirmation((prev) => ({
        ...prev,
        loading: false,
        affirmation: "My value is not tethered to how much I finish today. Doing one small thing is already beautiful.",
        focusTip: "Stand up, drink a pretty glass of water, and wave hello to the sky.",
        supportiveMessage: "Even though communication lines are offline, the spirit of restoration is actively within you. Take dynamic care!",
      }));
    }
  };

  // Habit management commands
  const handleToggleHabit = (habitId: string, dateStr: string) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id !== habitId) return habit;

        const isCompleted = habit.completedDays.includes(dateStr);
        let updatedCompletedDays = [...habit.completedDays];

        if (isCompleted) {
          // Uncheck
          updatedCompletedDays = updatedCompletedDays.filter((d) => d !== dateStr);
        } else {
          // Check
          updatedCompletedDays.push(dateStr);
        }

        // Re-calculate stats
        const { currentStreak, bestStreak } = calculateStreakStats(updatedCompletedDays);

        return {
          ...habit,
          completedDays: updatedCompletedDays,
          currentStreak,
          bestStreak,
        };
      })
    );
  };

  const handleAddHabit = (name: string, category: Habit['category'], notes?: string) => {
    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      name,
      category,
      completedDays: [],
      currentStreak: 0,
      bestStreak: 0,
      createdAt: new Date().toISOString(),
      isActive: true,
      notes,
    };
    setHabits((prev) => [newHabit, ...prev]);
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  // Journal management commands
  const [entriesLoading, setEntriesLoading] = useState(false);

  const handleAddJournalEntry = async (entryText: string, mood: string, moodScore: number) => {
    // 1. Setup localized transient entry
    const entryId = `journal-${Date.now()}`;
    const newEntry: JournalEntry = {
      id: entryId,
      entryText,
      date: new Date().toISOString(),
      mood,
      moodScore,
      analyzing: true,
    };

    setJournalEntries((prev) => [newEntry, ...prev]);
    setEntriesLoading(true);

    try {
      const response = await fetch("/api/journal/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood,
          moodScore,
          entryText,
        }),
      });

      if (!response.ok) throw new Error("Analysis request failed");
      const analyzedResult = await response.json();

      setJournalEntries((prevEntries) =>
        prevEntries.map((entry) => {
          if (entry.id === entryId) {
            return {
              ...entry,
              analyzing: false,
              analyzedFeedback: {
                analysisText: analyzedResult.analysisText,
                identifiedDistortions: analyzedResult.identifiedDistortions,
                cognitiveReframing: analyzedResult.cognitiveReframing,
                copingExercises: analyzedResult.copingExercises,
                isFallback: analyzedResult.isFallback,
              },
            };
          }
          return entry;
        })
      );
    } catch (err) {
      console.error("Journal CBT study error:", err);
      // Fail safely with generic supportive CBT modules
      setJournalEntries((prevEntries) =>
        prevEntries.map((entry) => {
          if (entry.id === entryId) {
            return {
              ...entry,
              analyzing: false,
              analyzedFeedback: {
                analysisText: "Thank you for sharing your thoughts with courage. Writing them down is a vital step in processing complex emotions.",
                identifiedDistortions: ["Temporary low-energy cloud", "Focus perfectionism"],
                cognitiveReframing: "Instead of focusing on what didn't go perfectly today, notice that you gave yourself safe space to type things out. You are not trapped.",
                copingExercises: [
                  "Write down 3 tiny things that did not fail today (e.g. drinking water, waking up).",
                  "Close your eyes and breathe deep for 10 slow, starry pulses."
                ],
                isFallback: true,
              },
            };
          }
          return entry;
        })
      );
    } finally {
      setEntriesLoading(false);
    }
  };

  const handleDeleteJournalEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  // Helper values
  const totalCompletedToday = habits.filter(
    (h) => h.isActive && h.completedDays.includes(getLocalDateString())
  ).length;

  return (
    <div className="min-h-screen bg-linear-to-b from-pink-50 via-purple-50 to-blue-50 font-sans text-stone-800" id="bloom-app-root">
      
      {/* Sparkly Floating Star Details on Corner (Girly outlook indicator) */}
      <div className="hidden lg:block absolute top-8 left-10 text-3xl animate-bounce">🦄</div>
      <div className="hidden lg:block absolute top-12 right-12 text-3xl animate-pulse">✨</div>
      <div className="hidden lg:block absolute bottom-12 left-12 text-3xl animate-bounce duration-1000">💖</div>
      <div className="hidden lg:block absolute bottom-8 right-16 text-3xl animate-pulse">🌈</div>

      {/* Welcome Setup Wizard if not initialized */}
      <AnimatePresence>
        {!profile.initialized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-purple-950/40 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
            id="wizard-container"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-white rounded-3xl border-4 border-pink-200 p-6 sm:p-8 max-w-xl w-full shadow-2xl relative space-y-6"
            >
              {/* Cute unicorn illustrations on model */}
              <div className="text-center space-y-2">
                <span className="text-5xl inline-block animate-bounce">🦄💖✨</span>
                <h1 className="text-2xl font-black text-purple-900 tracking-tight">
                  Welcome to Bloom!
                </h1>
                <p className="text-xs text-purple-600 font-semibold max-w-sm mx-auto">
                  A colorful, magical self-care kingdom designed to gently lift you out of frozen, demotivated moments. Let's calibrate your magical companion!
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateProfile({ initialized: true });
                }}
                className="space-y-4 text-left"
              >
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-purple-800 uppercase tracking-widest">
                    💝 Your Magical Nickname
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Princess Emily"
                    value={profile.name}
                    onChange={(e) => handleUpdateProfile({ name: e.target.value })}
                    className="w-full text-xs px-3.5 py-3 bg-pink-50/20 border-2 border-pink-100 rounded-2xl outline-none focus:border-pink-400 transition font-bold"
                    id="setup-name"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-purple-800 uppercase tracking-widest">
                    🦄 Focus Target or Dream Habit
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hydrating before coffee, writing 1 small paragraph of textbook"
                    value={profile.focusGoal}
                    onChange={(e) => handleUpdateProfile({ focusGoal: e.target.value })}
                    className="w-full text-xs px-3.5 py-3 bg-purple-50/20 border-2 border-purple-100 rounded-2xl outline-none focus:border-purple-400 transition"
                    id="setup-goal"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-purple-800 uppercase tracking-widest">
                    🌧️ What shadow/struggle is locking you right now?
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Severe brain fog, heavy negative thinking like 'I am completely behind', paralyzing screen-time fatigue..."
                    value={profile.struggles}
                    onChange={(e) => handleUpdateProfile({ struggles: e.target.value })}
                    className="w-full text-xs p-3.5 bg-blue-50/20 border-2 border-blue-100 rounded-2xl outline-none focus:border-blue-400 transition resize-none leading-relaxed"
                    id="setup-struggles"
                  ></textarea>
                </div>

                <div className="bg-pink-150/30 p-4 border border-pink-100 rounded-2xl flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-purple-850 leading-normal font-semibold">
                    We keep your journal local, secure, and private. Gemini uses these insights exclusively to brew dynamic, compassionate daily affirmations to lift you up.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-full shadow-lg hover:opacity-95 hover:scale-103 active:scale-97 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  id="btn-initialize-setup"
                >
                  Enter the Kingdom of Growth <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6" id="app-main-layout-container">
        
        {/* Colorful Header with Unicorn elements */}
        <header className="bg-white/80 backdrop-blur-md rounded-3xl border-2 border-pink-200 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center text-3xl shadow-sm">
              🦄
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-extrabold text-purple-900 tracking-tight">
                  Bloom Companion
                </h1>
                <span className="text-[10px] bg-pink-100 text-pink-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Unicorn Mode 🌈
                </span>
              </div>
              <p className="text-xs text-purple-600 font-bold">
                Caring companion to lift you out of frozen states, {profile.name || "magical friend"}!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-1.5 bg-pink-50 border border-pink-100 rounded-full flex items-center gap-1.5 text-xs text-pink-700 font-extrabold">
              <Star className="w-3.5 h-3.5 fill-pink-400 text-pink-500 animate-pulse" />
              <span>{totalCompletedToday} Habits Done Today</span>
            </div>

            <button
              onClick={() => {
                const clearPrompt = window.confirm("Would you like to reset your magical journey? It will clear local memories.");
                if (clearPrompt) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="text-[10px] text-purple-400 hover:text-pink-500 font-bold hover:underline"
            >
              Reset spells
            </button>
          </div>
        </header>

        {/* Tab Selection controller */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" id="app-navigation-tabs">
          {[
            { id: "affirmations", label: "✨ Star Guidance", icon: Compass, colorClass: "text-pink-500" },
            { id: "habits", label: "🦄 Magic Loops", icon: Activity, colorClass: "text-purple-500" },
            { id: "journal", label: "🔮 CBT Journal", icon: BookOpen, colorClass: "text-blue-500" },
            { id: "dashboard", label: "📊 Progress Chart", icon: Smile, colorClass: "text-pink-500" },
            { id: "resources", label: "💖 Cozy Support", icon: Heart, colorClass: "text-purple-500" },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4.5 py-3 text-xs font-black tracking-wider uppercase border-b-4 transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  active
                    ? "border-pink-500 text-pink-600 bg-white/50 rounded-t-xl"
                    : "border-transparent text-purple-400 hover:text-purple-600 hover:border-pink-200"
                }`}
              >
                <Icon className={`w-4 h-4 ${tab.colorClass}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Main Content Areas inside nested container */}
        <main className="bg-white/95 rounded-3xl border-2 border-pink-100 p-6 md:p-8 shadow-sm text-left">
          {activeTab === "affirmations" && (
            <AffirmationSection
              profile={profile}
              affirmation={affirmation}
              onRefreshAffirmation={handleGetLiveAffirmation}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {activeTab === "habits" && (
            <HabitSection
              habits={habits}
              onToggleHabit={handleToggleHabit}
              onAddHabit={handleAddHabit}
              onDeleteHabit={handleDeleteHabit}
            />
          )}

          {activeTab === "journal" && (
            <JournalSection
              entries={journalEntries}
              onAddJournalEntry={handleAddJournalEntry}
              onDeleteJournalEntry={handleDeleteJournalEntry}
              entriesLoading={entriesLoading}
            />
          )}

          {activeTab === "dashboard" && (
            <DashboardSection habits={habits} entries={journalEntries} />
          )}

          {activeTab === "resources" && <ResourcesSection />}
        </main>

        {/* Footer info design */}
        <footer className="text-center text-[10px] font-bold text-purple-400 max-w-sm mx-auto space-y-1 py-4" id="bloom-app-foot">
          <p>🦄 Bloom Companion: Formulated with gentle therapy guidelines & deep self-care focus loops.</p>
          <p className="text-[9px] text-pink-400 font-normal">Remember: Every step you take, no matter how small, counts towards your healing.</p>
        </footer>
      </div>
    </div>
  );
}
