import React from 'react';
import { Question } from '../types/index.ts';

interface QuestionPaletteProps {
  questions: Question[];
  currentQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
  mode: 'tutor' | 'exam' | 'flashcard';
  answers: Record<number, { selectedAnswer: 'A' | 'B' | 'C' | 'D' | null; isCorrect?: boolean }>;
  bookmarkedIds?: number[];
  flaggedIds?: number[];
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  questions,
  currentQuestionIndex,
  onSelectQuestion,
  mode,
  answers,
  bookmarkedIds = [],
  flaggedIds = [],
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-semibold text-slate-700">Question Navigator</span>
        <span className="font-mono">
          {Object.keys(answers).length} / {questions.length} completed
        </span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 border-b border-slate-100 pb-2">
        {mode === 'tutor' ? (
          <>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> Correct
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" /> Incorrect
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block" /> Bookmarked
            </span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-slate-800 inline-block" /> Answered
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block" /> Flagged
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-slate-200 inline-block" /> Unanswered
            </span>
          </>
        )}
      </div>

      {/* Grid of 65 questions */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5 max-h-[280px] overflow-y-auto p-1">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentQuestionIndex;
          const ans = answers[q.id];
          const isFlagged = flaggedIds.includes(q.id);
          const isBookmarked = bookmarkedIds.includes(q.id);

          let bgClass = 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';

          if (mode === 'tutor') {
            if (ans?.selectedAnswer) {
              if (ans.isCorrect) {
                bgClass = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold';
              } else {
                bgClass = 'bg-rose-100 text-rose-900 border-rose-300 font-semibold';
              }
            }
          } else {
            // Exam mode
            if (ans?.selectedAnswer) {
              bgClass = 'bg-slate-800 text-white border-slate-800 font-semibold';
            }
          }

          return (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(idx)}
              className={`relative h-8 rounded text-xs font-mono font-medium border flex items-center justify-center transition-all ${bgClass} ${
                isCurrent ? 'ring-2 ring-rose-500 ring-offset-1 font-bold z-10' : ''
              }`}
              title={`Question ${q.id}: ${q.category}`}
            >
              <span>{q.id}</span>

              {/* Indicator dots */}
              {isFlagged && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-1 ring-white" />
              )}
              {isBookmarked && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-500 ring-1 ring-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
