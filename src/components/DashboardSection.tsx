import React from "react";
import { Habit, JournalEntry } from "../types";
import { getLocalDateString } from "../utils";
import { Award, Flame, Smile, CheckCircle, TrendingUp, Calendar, Zap, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface DashboardSectionProps {
  habits: Habit[];
  entries: JournalEntry[];
}

export default function DashboardSection({ habits, entries }: DashboardSectionProps) {
  const todayStr = getLocalDateString();

  // 1. Habit completion details
  const activeHabits = habits.filter((h) => h.isActive);
  const totalActiveCount = activeHabits.length;
  const completedTodayCount = activeHabits.filter((h) =>
    h.completedDays.includes(todayStr)
  ).length;

  const todayCompletionRate =
    totalActiveCount > 0 ? Math.round((completedTodayCount / totalActiveCount) * 100) : 0;

  // 2. Continuous Streak Calculation
  const highestCurrentStreak = activeHabits.reduce(
    (max, h) => (h.currentStreak > max ? h.currentStreak : max),
    0
  );
  const highestBestStreak = activeHabits.reduce(
    (max, h) => (h.bestStreak > max ? h.bestStreak : max),
    0
  );

  // 3. Last 7 Days Tracking Grid Helper
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d;
  }).reverse();

  // 4. Mood fluctuations details
  const recentEntries = [...entries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7); // Last 7 journal entries

  const averageMoodScore =
    entries.length > 0
      ? (entries.reduce((sum, e) => sum + e.moodScore, 0) / entries.length).toFixed(1)
      : "N/A";

  // Build responsive SVG line chart coordinate strings for mood scores
  const chartHeight = 120;
  const chartWidth = 460;
  const paddingX = 40;
  const paddingY = 20;

  const getPointsStr = () => {
    if (recentEntries.length < 2) return "";
    return recentEntries
      .map((entry, index) => {
        const x =
          paddingX +
          (index / (recentEntries.length - 1)) * (chartWidth - paddingX * 2);
        // Map moodScore (1-10) to SVG view height (chartHeight to 0 with padding)
        const y =
          chartHeight -
          paddingY -
          ((entry.moodScore - 1) / 9) * (chartHeight - paddingY * 2);
        return `${x},${y}`;
      })
      .join(" ");
  };

  const points = getPointsStr();

  // Color helper based on percentage
  const getGradientPercentClass = (pct: number) => {
    if (pct >= 85) return "from-pink-500 via-purple-500 to-blue-500";
    if (pct >= 50) return "from-pink-400 to-purple-400";
    return "from-pink-300 to-pink-400";
  };

  return (
    <div className="space-y-6" id="dashboard-container">
      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-dashboard-grid">
        <div className="p-4 bg-gradient-to-tr from-pink-50 to-pink-100/30 border-2 border-pink-100 shadow-sm rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-pink-100 text-pink-600 rounded-2xl">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[9px] uppercase font-bold tracking-widest text-pink-400">Sweet Habits Done</p>
            <p className="text-xl font-black text-purple-900 leading-snug">
              {completedTodayCount} <span className="text-purple-300 text-xs">/ {totalActiveCount}</span>
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-16 h-1.5 bg-pink-100/50 rounded-full overflow-hidden shadow-inner">
                <div className={`h-full bg-gradient-to-r ${getGradientPercentClass(todayCompletionRate)}`} style={{ width: `${todayCompletionRate}%` }}></div>
              </div>
              <p className="text-[10px] font-bold text-pink-600">{todayCompletionRate}%</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-tr from-purple-50 to-purple-100/30 border-2 border-purple-100 shadow-sm rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[9px] uppercase font-bold tracking-widest text-purple-400">Magic Streak Now</p>
            <p className="text-xl font-black text-purple-950 leading-snug">
              {highestCurrentStreak} <span className="text-purple-400 text-xs">days 🦄</span>
            </p>
            <p className="text-[9px] text-purple-500 font-semibold flex items-center gap-0.5">
              Keep the magic alive!
            </p>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-tr from-blue-50 to-blue-100/30 border-2 border-blue-100 shadow-sm rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[9px] uppercase font-bold tracking-widest text-blue-400">All-Time High run</p>
            <p className="text-xl font-black text-purple-950 leading-snug">
              {highestBestStreak} <span className="text-purple-400 text-xs">days ⭐</span>
            </p>
            <p className="text-[9px] text-blue-500 font-semibold">Celebrate small achievements</p>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-tr from-pink-50/50 via-purple-50/50 to-blue-50/50 border-2 border-pink-100/80 shadow-sm rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-white text-pink-500 rounded-2xl border border-pink-100">
            <Smile className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[9px] uppercase font-bold tracking-widest text-pink-500 animate-bounce">Joy Score Avg</p>
            <p className="text-xl font-black text-purple-950 leading-snug">
              {averageMoodScore} <span className="text-pink-400 text-xs">/ 10</span>
            </p>
            <p className="text-[9px] text-purple-500 font-semibold">{entries.length} reflections</p>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-charts-layout">
        {/* Left Side: Weekly Habit Grid Tracker */}
        <div className="lg:col-span-6 bg-white border-2 border-pink-100 shadow-sm rounded-3xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-purple-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-pink-500" /> Rainbow Habit Matrix Tracker
            </h3>
            <p className="text-xs text-purple-600">
              Your weekly visual history. Every star emoji represents a sparkling self-care accomplishment.
            </p>
          </div>

          <div className="overflow-x-auto">
            {activeHabits.length === 0 ? (
              <p className="text-xs text-purple-400 italic py-6 text-center">No active habits logged yet.</p>
            ) : (
              <table className="w-full text-left text-xs text-purple-950 min-w-[320px]">
                <thead>
                  <tr className="border-b border-pink-100 text-[9px] uppercase font-bold tracking-widest text-purple-400">
                    <th className="py-2.5 font-bold">Self-care habit name</th>
                    {last7Days.map((day, idx) => (
                      <th key={idx} className="py-2.5 font-bold text-center w-12">
                        {day.toLocaleDateString([], { weekday: "narrow" })}
                        <span className="block text-[8px] text-pink-400 font-normal">
                          {day.getDate()}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50 font-semibold">
                  {activeHabits.map((habit) => (
                    <tr key={habit.id} className="hover:bg-pink-50/20">
                      <td className="py-3 font-bold text-purple-900 pr-2">
                        <p className="line-clamp-1">🦄 {habit.name}</p>
                      </td>
                      {last7Days.map((day, idx) => {
                        const dateStr = day.toISOString().split("T")[0];
                        const completed = habit.completedDays.includes(dateStr);
                        return (
                          <td key={idx} className="py-3 text-center">
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-full transition-all ${
                                completed
                                  ? "bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white animate-pulse"
                                  : "bg-pink-50/50 text-transparent border border-pink-100/50 text-wrap font-bold"
                              }`}
                            >
                              ⭐
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Side: Mood Reflection Trend Map */}
        <div className="lg:col-span-6 bg-white border-2 border-pink-100 shadow-sm rounded-3xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-purple-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-purple-500" /> Glittery Mood Wave Theory
            </h3>
            <p className="text-xs text-purple-600">
              Visualizing how CBT reframes soothe your weekly emotional starlight.
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center py-2 relative" id="trend-map-viewport">
            {recentEntries.length < 2 ? (
              <div className="text-center p-6 text-purple-600 max-w-xs space-y-2">
                <Sparkles className="w-10 h-10 text-pink-400 mx-auto animate-spin" />
                <p className="text-xs font-bold text-purple-800">Need more fairy dust!</p>
                <p className="text-[11px] text-purple-600 leading-normal font-medium">
                  Log cute reflections on at least 2 separate days in your magical journal to map your starlight emotional wavelengths.
                </p>
              </div>
            ) : (
              <div className="w-full">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible select-none">
                  {/* Grid Lines */}
                  <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="#fdf2f8" strokeWidth="2" />
                  <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="#f3e8ff" strokeWidth="2" />
                  <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="#e0f2fe" strokeWidth="2" />

                  {/* SVG Gradient definition with purple pink and blue */}
                  <defs>
                    <linearGradient id="unicornGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>

                  {/* Connecting Line */}
                  <polyline
                    fill="none"
                    stroke="url(#unicornGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />

                  {/* Data Point Circles */}
                  {recentEntries.map((entry, index) => {
                    const x =
                      paddingX +
                      (index / (recentEntries.length - 1)) * (chartWidth - paddingX * 2);
                    const y =
                      chartHeight -
                      paddingY -
                      ((entry.moodScore - 1) / 9) * (chartHeight - paddingY * 2);

                    return (
                      <g key={entry.id} className="cursor-help group">
                        <circle
                          cx={x}
                          cy={y}
                          r="7"
                          className="fill-pink-500 stroke-white stroke-2 group-hover:fill-purple-500 transition duration-150"
                        />
                        <title>
                          {entry.mood} (Score: {entry.moodScore}/10)
                        </title>
                      </g>
                    );
                  })}
                </svg>

                {/* X-Axis labels */}
                <div className="flex justify-between px-3 text-[10px] font-bold font-mono text-purple-400 uppercase tracking-widest pt-1">
                  <span>{new Date(recentEntries[0].date).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
                  <span>{new Date(recentEntries[recentEntries.length - 1].date).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-pink-50 pt-3 flex items-center justify-between gap-4 flex-wrap text-xs text-purple-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 inline-block"></span>
              <span className="font-bold">Glitter Scale (1-10)</span>
            </div>

            <div className="text-right">
              <span>Goal: </span>
              <span className="font-bold text-pink-600">Sustained fairy glow 💖</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
