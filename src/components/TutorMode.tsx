import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { Question, QuestionCategory } from '../types/index.ts';
import { CATEGORIES } from '../data/questionsData.ts';
import { QuestionPalette } from './QuestionPalette.tsx';

interface TutorModeProps {
  questions: Question[];
  userAnswers: Record<number, { selectedAnswer: 'A' | 'B' | 'C' | 'D'; isCorrect: boolean }>;
  onAnswerQuestion: (questionId: number, answer: 'A' | 'B' | 'C' | 'D', isCorrect: boolean) => void;
  onClearAnswer: (questionId: number) => void;
  bookmarkedIds: number[];
  onBookmark: (questionId: number) => void;
}

export const TutorMode: React.FC<TutorModeProps> = ({
  questions,
  userAnswers,
  onAnswerQuestion,
  onClearAnswer,
  bookmarkedIds,
  onBookmark,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'missed' | 'bookmarked'>('all');
  const [currentIdx, setCurrentIdx] = useState(0);

  // Filter questions based on category and status
  const filteredQuestions = questions.filter((q) => {
    if (selectedCategory !== 'All' && q.category !== selectedCategory) return false;
    if (statusFilter === 'missed') {
      const ans = userAnswers[q.id];
      return ans && !ans.isCorrect;
    }
    if (statusFilter === 'bookmarked') {
      return bookmarkedIds.includes(q.id);
    }
    return true;
  });

  const activeQuestions = filteredQuestions.length > 0 ? filteredQuestions : questions;
  const currentQ = activeQuestions[currentIdx % activeQuestions.length];

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    if (!currentQ) return;
    const isCorrect = key === currentQ.correctAnswer;
    onAnswerQuestion(currentQ.id, key, isCorrect);
  };

  const currentAnswer = currentQ ? userAnswers[currentQ.id] : undefined;
  const isBookmarked = currentQ ? bookmarkedIds.includes(currentQ.id) : false;

  // Stats
  const answeredTotal = Object.keys(userAnswers).length;
  const correctTotal = Object.values(userAnswers).filter((a) => a.isCorrect).length;
  const accuracy = answeredTotal > 0 ? Math.round((correctTotal / answeredTotal) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Category Segmented Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">Tutor Practice</span>
            <span aria-hidden="true">·</span>
            <span>Immediate Rationale Mode</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-700 font-semibold">
              {answeredTotal}/65 Done ({accuracy}% Accuracy)
            </span>
          </div>

          {/* Subfilter */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => { setStatusFilter('all'); setCurrentIdx(0); }}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => { setStatusFilter('missed'); setCurrentIdx(0); }}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'missed' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Missed ({Object.values(userAnswers).filter((a) => !a.isCorrect).length})
            </button>
            <button
              onClick={() => { setStatusFilter('bookmarked'); setCurrentIdx(0); }}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'bookmarked' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bookmarked ({bookmarkedIds.length})
            </button>
          </div>
        </div>

        {/* Categories scrollable */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-medium">
          <button
            onClick={() => { setSelectedCategory('All'); setCurrentIdx(0); }}
            className={`px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white border-slate-900 font-semibold shadow-sm'
                : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            All Modules (65Q)
          </button>
          {CATEGORIES.map((cat) => {
            const count = questions.filter((q) => q.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setCurrentIdx(0); }}
                className={`px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Question Stage (8 cols) & Navigator (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Question View */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          {currentQ ? (
            <>
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono font-bold text-slate-900">
                    Question {currentQ.id}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{currentQ.category}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onBookmark(currentQ.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      isBookmarked
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                  </button>

                  {currentAnswer && (
                    <button
                      onClick={() => onClearAnswer(currentQ.id)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-xs flex items-center gap-1"
                      title="Clear and retry this question"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-3 pt-1">
                {currentQ.options.map((opt) => {
                  const isSelected = currentAnswer?.selectedAnswer === opt.key;
                  const isCorrect = opt.key === currentQ.correctAnswer;
                  const hasAnswered = !!currentAnswer;

                  let borderClass = 'border-slate-200 hover:border-slate-300 bg-white text-slate-800';
                  let badgeClass = 'bg-slate-100 text-slate-700 border-slate-200';

                  if (hasAnswered) {
                    if (isCorrect) {
                      borderClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium';
                      badgeClass = 'bg-emerald-600 text-white border-emerald-600';
                    } else if (isSelected && !isCorrect) {
                      borderClass = 'border-rose-400 bg-rose-50 text-rose-950 line-through';
                      badgeClass = 'bg-rose-600 text-white border-rose-600';
                    } else {
                      borderClass = 'border-slate-100 bg-slate-50/50 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption(opt.key)}
                      disabled={hasAnswered}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-center justify-between gap-3 ${borderClass} ${
                        !hasAnswered ? 'cursor-pointer hover:shadow-xs' : 'cursor-default'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-md font-mono font-bold flex items-center justify-center shrink-0 text-xs border ${badgeClass}`}
                        >
                          {opt.key}
                        </span>
                        <span className="text-sm">{opt.text}</span>
                      </div>

                      {hasAnswered && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {hasAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instant Rationale & Pearl (Shown immediately upon answering) */}
              {currentAnswer && (
                <div className="space-y-4 pt-2">
                  <div
                    className={`p-4 rounded-xl border space-y-2 text-xs leading-relaxed ${
                      currentAnswer.isCorrect
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50/40 border-rose-200 text-rose-950'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      {currentAnswer.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-800">Correct Choice!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span className="text-rose-800">Incorrect Choice</span>
                        </>
                      )}
                      <span className="text-slate-500 font-normal">
                        · Correct answer is <strong className="font-mono text-slate-800">{currentQ.correctAnswer}</strong>
                      </span>
                    </div>

                    <p className="text-slate-700 text-xs">{currentQ.explanation}</p>
                  </div>

                  {/* High Yield Pearl Card */}
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
                    <strong className="text-amber-900 block font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" /> Clinical Board Pearl:
                    </strong>
                    <p className="leading-relaxed font-sans">{currentQ.highYieldPearl}</p>
                  </div>

                  {/* Related Concepts */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                    <span className="font-medium text-slate-700">Related:</span>
                    {currentQ.relatedConcepts.map((concept, i) => (
                      <span key={i} className="text-slate-600">
                        {concept}
                        {i < currentQ.relatedConcepts.length - 1 && <span className="text-slate-400 mx-1">·</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Navigation */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <button
                  onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                  disabled={currentIdx === 0}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous Question
                </button>

                <span className="text-xs font-mono text-slate-400">
                  {currentIdx + 1} / {activeQuestions.length}
                </span>

                <button
                  onClick={() => setCurrentIdx((prev) => Math.min(activeQuestions.length - 1, prev + 1))}
                  disabled={currentIdx === activeQuestions.length - 1}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  Next Question <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs space-y-2">
              <p>No questions match the current filter.</p>
              <button
                onClick={() => { setSelectedCategory('All'); setStatusFilter('all'); }}
                className="text-rose-600 font-semibold underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Question Palette */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <QuestionPalette
            questions={questions}
            currentQuestionIndex={currentQ ? questions.findIndex((q) => q.id === currentQ.id) : 0}
            onSelectQuestion={(globalIdx) => {
              const targetQuestion = questions[globalIdx];
              // check if target is in active questions
              const matchIdx = activeQuestions.findIndex((q) => q.id === targetQuestion.id);
              if (matchIdx !== -1) {
                setCurrentIdx(matchIdx);
              } else {
                // switch to All category to show it
                setSelectedCategory('All');
                setStatusFilter('all');
                setCurrentIdx(globalIdx);
              }
            }}
            mode="tutor"
            answers={userAnswers}
            bookmarkedIds={bookmarkedIds}
          />
        </div>
      </div>
    </div>
  );
};
