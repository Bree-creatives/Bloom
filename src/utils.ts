import { Habit, MentalHealthResource, JournalEntry, UserProfile } from "./types";

// Key definitions for LocalStorage
export const STORAGE_KEYS = {
  HABITS: "bloom_habits_v1",
  JOURNAL: "bloom_journal_v1",
  PROFILE: "bloom_profile_v1",
  AFFIRMATION: "bloom_affirmation_v1",
};

// Seed resources for therapy help and guidance
export const CURATED_RESOURCES: MentalHealthResource[] = [
  {
    id: "988lifeline",
    title: "988 Suicide & Crisis Lifeline",
    category: "Crisis Support",
    description: "Free, confidential 24/7 support for anyone in crisis or distress. Call or text 988 or chat online in the US/Canada.",
    linkUrl: "https://988lifeline.org/",
    tag: "Emergency Help Line"
  },
  {
    id: "psychologytoday",
    title: "Psychology Today Therapist Finder",
    category: "Therapy Directory",
    description: "An extensive, trusted directory to find licensed local psychologists, therapists, psychiatrists, and warm-caring counselors internationally.",
    linkUrl: "https://www.psychologytoday.com/us/therapists",
    tag: "Find a Therapist"
  },
  {
    id: "befrienders",
    title: "Befrienders Worldwide",
    category: "Crisis Support",
    description: "A comprehensive international index of crisis support, emotional assistance, and suicide prevention helplines across 40 countries.",
    linkUrl: "https://www.befrienders.org/",
    tag: "International Crisis Support"
  },
  {
    id: "getselfhelp",
    title: "Get.gg Cognitive Behavioral Therapy Worksheets",
    category: "CBT Tools",
    description: "A golden treasury of free, highly effective downloadable CBT formulation guides, thought logs, and problem-solving worksheets.",
    linkUrl: "https://www.getselfhelp.co.uk/",
    tag: "CBT Self Help"
  },
  {
    id: "mindfulorg",
    title: "Mindful.org Guided Meditation Library",
    category: "Mindfulness",
    description: "Gentle introductory guides to secular mindfulness practice, breathing workouts, somatic healing, and deep emotional rest.",
    linkUrl: "https://www.mindful.org/",
    tag: "Audio Meditations"
  },
  {
    id: "cci_workbooks",
    title: "CCI Self-Help Modules for Depression & Worry",
    category: "Self Guided Reading",
    description: "Excellent, evidence-based self-guided workbook courses on mastering behavioral activation, anxiety, self-compassion, and low self-esteem.",
    linkUrl: "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself",
    tag: "Free Workbooks"
  },
  {
    id: "healthline_mental",
    title: "Healthline Therapy App Compilations",
    category: "Therapy Directory",
    description: "Independent reviews and comparisons of mental health support platforms (Talkspace, BetterHelp, Cerebral) to suit different budgets.",
    linkUrl: "https://www.healthline.com/health/mental-health/online-therapy",
    tag: "Online Therapy Guides"
  }
];

// Initial default habits for demotivated individuals (micro-steps focused on low mental overhead)
export const SEED_HABITS: Habit[] = [
  {
    id: "habit-water",
    name: "Sip a warm or cool cup of water",
    category: "Body",
    completedDays: [],
    currentStreak: 0,
    bestStreak: 0,
    createdAt: new Date().toISOString(),
    isActive: true,
    notes: "A simple somatic reset upon waking up to hydrate the body and mind."
  },
  {
    id: "habit-breathe",
    name: "Take 3 slow mindfully deep breaths",
    category: "Mindfulness",
    completedDays: [],
    currentStreak: 0,
    bestStreak: 0,
    createdAt: new Date().toISOString(),
    isActive: true,
    notes: "Inhale calm for 4 seconds, hold for 4, exhale pressure for 4."
  },
  {
    id: "habit-stretch",
    name: "Gently stretch your neck and shoulders",
    category: "Body",
    completedDays: [],
    currentStreak: 0,
    bestStreak: 0,
    createdAt: new Date().toISOString(),
    isActive: true,
    notes: "Releases the physical tension that builds up from stress and freeze states."
  },
  {
    id: "habit-one-item",
    name: "Pick exactly ONE small task for today",
    category: "Focus",
    completedDays: [],
    currentStreak: 0,
    bestStreak: 0,
    createdAt: new Date().toISOString(),
    isActive: true,
    notes: "No pressure for a massive list. Just one single action that matters."
  },
  {
    id: "habit-greet",
    name: "Notice 3 physical objects around you",
    category: "Mindfulness",
    completedDays: [],
    currentStreak: 0,
    bestStreak: 0,
    createdAt: new Date().toISOString(),
    isActive: true,
    notes: "A rapid 5-4-3-2-1 derived micro-grounding to pause intrusive anxiety loops."
  }
];

// Seed profile
export const SEED_PROFILE: UserProfile = {
  name: "",
  focusGoal: "",
  struggles: "",
  initialized: false,
};

// Date helper to get date in YYYY-MM-DD
export function getLocalDateString(date = new Date()): string {
  const offset = date.getTimezoneOffset();
  const adjusted = new Date(date.getTime() - offset * 60 * 1000);
  return adjusted.toISOString().split("T")[0];
}

// Check if a specific date string is in a completed list
export function isDateCompleted(completedDays: string[], dateStr: string): boolean {
  return completedDays.includes(dateStr);
}

// Calculate streaks for a given list of completed days
export function calculateStreakStats(completedDays: string[]): { currentStreak: number; bestStreak: number } {
  if (!completedDays || completedDays.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Deduplicate and sort chronologically Ascending
  const sortedDates = Array.from(new Set(completedDays))
    .map(d => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime());

  let bestStreak = 0;
  let currentStreak = 0;
  let tempStreak = 0;
  let previousDate: Date | null = null;

  // Calculate best streak
  for (const date of sortedDates) {
    if (previousDate === null) {
      tempStreak = 1;
    } else {
      const diffTime = date.getTime() - previousDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak += 1;
      } else if (diffDays > 1) {
        if (tempStreak > bestStreak) {
          bestStreak = tempStreak;
        }
        tempStreak = 1;
      }
    }
    previousDate = date;
  }
  if (tempStreak > bestStreak) {
    bestStreak = tempStreak;
  }

  // Calculate current streak relative to local today and yesterday
  const todayStr = getLocalDateString();
  const yesterdayObj = new Date();
  yesterdayObj.setDate(yesterdayObj.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterdayObj);

  const hasCompletedToday = completedDays.includes(todayStr);
  const hasCompletedYesterday = completedDays.includes(yesterdayStr);

  if (!hasCompletedToday && !hasCompletedYesterday) {
    currentStreak = 0;
  } else {
    // Traverse backwards from today to find contiguous completes
    let currentWalkStr = hasCompletedToday ? todayStr : yesterdayStr;
    let walkStreak = 1;
    let walkDate = new Date(currentWalkStr);

    while (true) {
      walkDate.setDate(walkDate.getDate() - 1);
      const prevWalkStr = getLocalDateString(walkDate);
      if (completedDays.includes(prevWalkStr)) {
        walkStreak += 1;
      } else {
        break;
      }
    }
    currentStreak = walkStreak;
  }

  return { currentStreak, bestStreak: Math.max(bestStreak, currentStreak) };
}

// Retrieve from LocalStorage with custom types
export function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

// Write to LocalStorage
export function writeStoredData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing localStorage key "${key}":`, error);
  }
}
