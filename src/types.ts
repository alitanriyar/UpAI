export type TaskType = 'coffee' | 'math' | 'movement' | 'brush' | 'affirmation' | 'mindfulness';

export interface Alarm {
  id: string;
  time: string; // HH:mm
  days: number[]; // 0-6 (Sun-Sat)
  label: string;
  enabled: boolean;
  tasks: TaskType[]; // Array of tasks for multi-step
  snooze: boolean;
  vibration: boolean;
  sound: string;
  gradualVolume: boolean;
  pitchShift: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  photoURL?: string;
  providerId?: string;
  preferredTask: TaskType;
  wakeGoal: string; // HH:mm
  difficulty: 'easy' | 'medium' | 'hard';
  aiSensitivity: number;
  subscriptionStatus: 'free' | 'pro';
  dailyUsage?: {
    date: string;
    coffee: number;
    affirmation: number;
  };
  onboardingComplete: boolean;
  createdAt: string;
}

export interface UserStats {
  streak: number;
  bestStreak: number;
  totalWakes: number;
  history: {
    date: string;
    taskType: TaskType;
    time: string;
  }[];
}

export interface AIResponse {
  approved: boolean;
  confidence: number;
  reason: string;
  retry_instruction: string;
  detected_text?: string;
  rep_count?: number;
}
