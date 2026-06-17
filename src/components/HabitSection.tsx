import React, { useState } from "react";
import { Habit } from "../types";
import { Plus, Check, Star, Trash2, HelpCircle, Activity, Sparkles, Flame } from "lucide-react";
import { getLocalDateString } from "../utils";
import { motion } from "motion/react";

interface HabitSectionProps {
  habits: Habit[];
  onToggleHabit: (habitId: string, dateStr: string) => void;
  onAddHabit: (name: string, category: Habit['category'], notes?: string) => void;
  onDeleteHabit: (habitId: string) => void;
}

export default function HabitSection({
  habits,
  onToggleHabit,
  onAddHabit,
  onDeleteHabit,
}: HabitSectionProps) {
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitCategory, setNewHabitCategory] = useState<Habit['category']>("Focus");
  const [newHabitNotes, setNewHabitNotes] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | Habit['category']>("All");
  const [showAddForm, setShowAddForm] = useState(false);

  const todayStr = getLocalDateString();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    onAddHabit(newHabitName.trim(), newHabitCategory, newHabitNotes.trim() || undefined);
    setNewHabitName("");
    setNewHabitNotes("");
    setShowAddForm(false);
  };

  const filteredHabits = habits.filter(
    (h) => h.isActive && (activeFilter === "All" || h.category === activeFilter)
  );

  const categoryColors = {
    Focus: "border-blue-200 bg-blue-100/70 text-blue-800",
    Mindfulness: "border-purple-200 bg-purple-100/70 text-purple-800",
    Body: "border-pink-200 bg-pink-100/70 text-pink-800",
    Connection: "border-rose-200 bg-rose-100/70 text-rose-800",
    Custom: "border-cyan-200 bg-cyan-100/70 text-cyan-800",
  };

  return (
    <div className="space-y-6" id="habit-section-container">
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-pink-100/60 via-purple-100/60 to-blue-100/60 p-5 rounded-2xl border border-pink-200">
        <div>
          <h2 className="text-xl font-bold text-pink-900 tracking-tight flex items-center gap-1.5" id="habit-heading">
            🦄 Magical Micro-Habit Loops
          </h2>
          <p className="text-xs text-purple-700/85">
            Micro-habits with very low magic friction. Each tiny checkmark feeds your inner unicorn! 🦄💖
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-full text-xs font-bold hover:opacity-90 transition-all shadow-md hover:shadow-pink-200 hover:scale-105 transform active:scale-95 self-start sm:self-center"
          id="btn-toggle-add-habit"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? "Hide Wizard" : "Create Custom Habit ✨"}
        </button>
      </div>

      {/* Creation form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 border-2 border-dashed border-pink-200 rounded-2xl bg-gradient-to-tr from-pink-50/50 via-purple-50/50 to-blue-50/50 shadow-inner space-y-4"
          id="add-habit-form-container"
        >
          <h3 className="text-xs font-bold text-purple-800 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-pink-500 animate-spin" /> Summon a micro-habit spell
          </h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-purple-700">Habit Name (Simple & Sweet)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Breathe with starry eyes..."
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-pink-100 rounded-xl outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition shadow-inner placeholder:text-stone-300"
                  id="input-habit-name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-purple-700">Care Category</label>
                <div className="grid grid-cols-5 gap-1">
                  {(["Focus", "Mindfulness", "Body", "Connection", "Custom"] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewHabitCategory(cat)}
                      className={`py-2 text-[10px] font-bold border rounded-lg transition-all ${
                        newHabitCategory === cat
                          ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white border-none shadow"
                          : "bg-white border-pink-100 text-purple-600 hover:bg-pink-50/50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-purple-700">Gentle Charm Notes (To remove mental blocks)</label>
              <textarea
                rows={2}
                placeholder="e.g. Keep a pretty pink ribbon or glass of water near the pillow. High vibe, zero stress!"
                value={newHabitNotes}
                onChange={(e) => setNewHabitNotes(e.target.value)}
                className="w-full text-xs p-3 bg-white border border-pink-100 rounded-xl outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition resize-none shadow-inner"
                id="input-habit-notes"
              ></textarea>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full text-xs font-bold shadow-md cursor-pointer transition active:scale-95"
                id="btn-submit-habit"
              >
                Summon habit 💖
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Categories Filter Tabs with Pink/Purple/Blue pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none" id="categories-filter-bar">
        {(["All", "Focus", "Mindfulness", "Body", "Connection", "Custom"] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 text-xs font-bold border rounded-full transition-all whitespace-nowrap ${
              activeFilter === filter
                ? "bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white border-transparent shadow"
                : "bg-white border-pink-100 text-purple-600 hover:bg-pink-50/50"
            }`}
          >
            {filter === "All" ? "🌈 All Habits" : filter}
          </button>
        ))}
      </div>

      {/* Habit items list */}
      {filteredHabits.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-pink-200 rounded-2xl bg-pink-50/20" id="empty-habits">
          <Sparkles className="w-8 h-8 text-pink-300 mx-auto mb-2 animate-bounce" />
          <p className="text-sm font-bold text-pink-700">No active micro-habits on this star track!</p>
          <p className="text-xs text-purple-500 mt-1">Create an adorable habit or choose another category magical tab.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5" id="habit-items-grid">
          {filteredHabits.map((habit) => {
            const isCompletedToday = habit.completedDays.includes(todayStr);

            return (
              <motion.div
                key={habit.id}
                layout
                className={`p-4 border-2 rounded-2xl flex items-center justify-between gap-4 transition-all duration-300 shadow-xs ${
                  isCompletedToday
                    ? "bg-gradient-to-r from-pink-50/80 via-purple-50/80 to-blue-50/80 border-pink-200"
                    : "bg-white border-pink-100/80 hover:border-pink-200 hover:shadow-md"
                }`}
                id={`habit-${habit.id}`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Whimsical Checkbox button */}
                  <button
                    onClick={() => onToggleHabit(habit.id, todayStr)}
                    className={`mt-1 flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                      isCompletedToday
                        ? "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 border-transparent text-white"
                        : "border-pink-300 hover:border-pink-500 bg-white"
                    }`}
                    aria-label={`Mark '${habit.name}' completed`}
                    id={`checkbox-${habit.id}`}
                  >
                    {isCompletedToday ? (
                      <Check className="w-4 h-4 stroke-[3px]" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-pink-200 hover:bg-pink-400 transition-colors"></span>
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2.5 py-0.5 text-[9px] font-bold border rounded-full uppercase tracking-wider ${categoryColors[habit.category]}`}>
                        {habit.category}
                      </span>

                      {habit.currentStreak > 0 && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200 text-pink-700 text-[9px] font-bold rounded-full">
                          <Flame className="w-3 h-3 text-pink-500" />
                          {habit.currentStreak} magic run!
                        </span>
                      )}
                    </div>

                    <h4 className={`mt-1.5 text-xs sm:text-xs md:text-sm font-bold text-purple-900 tracking-tight leading-relaxed ${
                      isCompletedToday ? "line-through text-purple-400" : ""
                    }`}>
                      {habit.name}
                    </h4>

                    {habit.notes && (
                      <p className={`text-xs text-stone-400 mt-1 font-normal line-clamp-2 ${
                        isCompletedToday ? "text-stone-300" : ""
                      }`}>
                        🦄 {habit.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Info & Delete */}
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-[9px] uppercase font-bold tracking-widest text-purple-300">Sparkle Run</p>
                    <p className="text-xs font-bold text-pink-600">{habit.bestStreak || 0}d ⭐</p>
                  </div>

                  <button
                    onClick={() => onDeleteHabit(habit.id)}
                    className="p-1.5 text-pink-400 hover:text-pink-600 hover:bg-pink-100/50 rounded-lg transition"
                    title="Delete habit"
                    id={`btn-delete-${habit.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
