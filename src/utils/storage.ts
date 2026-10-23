export interface UserProgress {
  answeredQuestions: Record<number, { selectedAnswer: 'A' | 'B' | 'C' | 'D'; isCorrect: boolean }>;
  bookmarkedQuestionIds: number[];
  flashcardMastery: Record<number, 'mastered' | 'review'>;
  examHistory: Array<{
    date: string;
    score: number;
    total: number;
    percentage: number;
    durationSeconds: number;
  }>;
}

const STORAGE_KEY = 'hemareview_user_progress_v1';

export function getStoredProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        answeredQuestions: {},
        bookmarkedQuestionIds: [],
        flashcardMastery: {},
        examHistory: [],
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      answeredQuestions: {},
      bookmarkedQuestionIds: [],
      flashcardMastery: {},
      examHistory: [],
    };
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save progress to localStorage', err);
  }
}

export function resetAllProgress(): UserProgress {
  const fresh: UserProgress = {
    answeredQuestions: {},
    bookmarkedQuestionIds: [],
    flashcardMastery: {},
    examHistory: [],
  };
  saveProgress(fresh);
  return fresh;
}
