export type QuestionCategory =
  | 'Blood composition & hematopoiesis'
  | 'Red blood cells & erythropoiesis'
  | 'Iron, vitamins & hemoglobin'
  | 'Bilirubin metabolism & anemia'
  | 'Immunity & lymphocytes'
  | 'Hemostasis & coagulation'
  | 'Blood groups & Rh system';

export interface Option {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: number;
  category: QuestionCategory;
  question: string;
  options: Option[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  distractorNotes?: Partial<Record<'A' | 'B' | 'C' | 'D', string>>;
  highYieldPearl: string;
  relatedConcepts: string[];
}

export type StudyMode = 'tutor' | 'exam' | 'flashcard' | 'interactive' | 'cheatsheet';

export interface UserAnswerRecord {
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null;
  isCorrect: boolean;
  timestamp: number;
}

export interface ExamSession {
  id: string;
  startedAt: number;
  completedAt?: number;
  durationSeconds: number;
  timeRemainingSeconds: number;
  answers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  flags: number[];
  isSubmitted: boolean;
  score?: number;
  totalQuestions: number;
}
