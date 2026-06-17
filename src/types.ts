export interface Habit {
  id: string;
  name: string;
  category: 'Focus' | 'Mindfulness' | 'Body' | 'Connection' | 'Custom';
  completedDays: string[]; // List of 'YYYY-MM-DD' strings when this habit was successfully completed
  currentStreak: number;
  bestStreak: number;
  createdAt: string;
  isActive: boolean;
  notes?: string;
}

export interface CBTAnalysis {
  analysisText: string;
  identifiedDistortions: string[];
  cognitiveReframing: string;
  copingExercises: string[];
  isFallback?: boolean;
}

export interface JournalEntry {
  id: string;
  entryText: string;
  date: string; // ISO String
  mood: string; // e.g. 'Anxious', 'Heavy', 'Fatigued', 'Calm', 'Hopeful'
  moodScore: number; // 1 to 10 scale
  analyzedFeedback?: CBTAnalysis;
  analyzing?: boolean;
}

export interface UserProfile {
  name: string;
  focusGoal: string;
  struggles: string;
  customAffirmationText?: string;
  initialized: boolean;
}

export interface MentalHealthResource {
  id: string;
  title: string;
  category: 'Crisis Support' | 'Therapy Directory' | 'CBT Tools' | 'Mindfulness' | 'Self Guided Reading';
  description: string;
  linkUrl: string;
  tag: string;
}

export interface AffirmationState {
  affirmation: string;
  focusTip: string;
  supportiveMessage: string;
  loading?: boolean;
}
