export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: number;
  q: string;
  options: QuizOption[];
  explanation: string;
}

export interface ClassroomModuleMeta {
  id: string;
  title: string;
  category: string;
  badgeLabel?: string;
  badgeColor?: string;
  description: string;
  warningNote?: string;
  xpReward: number;
  durationMinutes: number;
  iconName: string;
}

export interface LearningProgress {
  userId: string;
  completedModuleIds: string[];
  totalXP: number;
  unlockedBadges: string[];
  quizScores: Record<string, number>;
  lastActiveAt: string;
}
