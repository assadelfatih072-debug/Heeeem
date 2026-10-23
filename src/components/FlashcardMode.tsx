import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, CheckCircle2, Sparkles } from 'lucide-react';
import { Question } from '../types/index.ts';

interface FlashcardModeProps {
  questions: Question[];
  masteryMap: Record<number, 'mastered' | 'review'>;
  onUpdateMastery: (questionId: number, status: 'mastered' | 'review') => void;
  onBookmark: (questionId: number) => void;
  bookmarkedIds: number[];
}

export const FlashcardMode: React.FC<FlashcardModeProps> = ({
  questions,
  masteryMap,
  onUpdateMastery,
  onBookmark,
  bookmarkedIds,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'unmastered' | 'bookmarked'>('all');

  const filteredQuestions = questions.filter((q) => {
    if (filterMode === 'unmastered') return masteryMap[q.id] !== 'mastered';
    if (filterMode === 'bookmarked') return bookmarkedIds.includes(q.id);
    return true;
  });

  const activeQuestions = filteredQuestions.length > 0 ? filteredQuestions : questions;
  const currentQ = activeQuestions[currentIndex % activeQuestions.length];

  const masteredCount = Object.values(masteryMap).filter((s) => s === 'mastered').length;

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % activeQuestions.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + activeQuestions.length) % activeQuestions.length);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeQuestions.length]);

  if (!currentQ) return null;

  const correctOption = currentQ.options.find((o) => o.key === currentQ.correctAnswer);
  const isMastered = masteryMap[currentQ.id] === 'mastered';
  const isBookmarked = bookmarkedIds.includes(currentQ.id);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Controls & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-800">Flashcard Drill</span>
          <span aria-hidden="true">·</span>
          <span>Card {currentIndex + 1} of {activeQuestions.length}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-emerald-700 font-semibold">{masteredCount}/65 Mastered</span>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => { setFilterMode('all'); setCurrentIndex(0); setIsFlipped(false); }}
            className={`px-3 py-1 rounded-md transition-colors ${filterMode === 'all' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            All (65)
          </button>
          <button
            onClick={() => { setFilterMode('unmastered'); setCurrentIndex(0); setIsFlipped(false); }}
            className={`px-3 py-1 rounded-md transition-colors ${filterMode === 'unmastered' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Needs Mastery ({65 - masteredCount})
          </button>
          <button
            onClick={() => { setFilterMode('bookmarked'); setCurrentIndex(0); setIsFlipped(false); }}
            className={`px-3 py-1 rounded-md transition-colors ${filterMode === 'bookmarked' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Bookmarked ({bookmarkedIds.length})
          </button>
        </div>
      </div>

      {/* Main Flip Card */}
      <div
        onClick={handleFlip}
        className="cursor-pointer min-h-[380px] bg-white rounded-2xl border-2 border-slate-200 hover:border-slate-300 shadow-sm transition-all p-8 flex flex-col justify-between relative group"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-mono font-bold text-slate-900">Q{currentQ.id}</span>
            <span aria-hidden="true">·</span>
            <span>{currentQ.category}</span>
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onBookmark(currentQ.id)}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                isBookmarked
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700 font-semibold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
            <span className="text-[11px] font-mono text-slate-400 group-hover:text-slate-600 flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5" /> Space or Click to Flip
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="py-6 flex-1 flex flex-col justify-center">
          {!isFlipped ? (
            /* Front of Card: Question & Options Preview */
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 leading-snug">
                {currentQ.question}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {currentQ.options.map((opt) => (
                  <div
                    key={opt.key}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 text-xs flex items-center gap-2 text-slate-700"
                  >
                    <span className="w-5 h-5 rounded-md bg-white border border-slate-300 flex items-center justify-center font-mono font-bold text-slate-800 shrink-0">
                      {opt.key}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                ))}
              </div>

              <div className="text-center pt-4">
                <span className="text-xs font-semibold text-rose-600 inline-flex items-center gap-1 hover:underline">
                  Reveal Correct Answer & Rationale →
                </span>
              </div>
            </div>
          ) : (
            /* Back of Card: Answer, Mechanism & Pearl */
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Correct Answer:</span>
                <span className="font-mono text-base font-bold bg-emerald-100 text-emerald-900 px-3 py-0.5 rounded border border-emerald-300">
                  {currentQ.correctAnswer} — {correctOption?.text}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
                <strong className="text-slate-900 block font-semibold">Physiological Rationale:</strong>
                <p className="leading-relaxed">{currentQ.explanation}</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
                <strong className="text-amber-900 block font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" /> High-Yield Board Pearl:
                </strong>
                <p className="leading-relaxed font-sans">{currentQ.highYieldPearl}</p>
              </div>
            </div>
          )}
        </div>

        {/* Card Footer: Mastery status & Navigation */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onUpdateMastery(currentQ.id, 'review');
                handleNext();
              }}
              className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
            >
              Needs Review
            </button>
            <button
              onClick={() => {
                onUpdateMastery(currentQ.id, 'mastered');
                handleNext();
              }}
              className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mark Mastered</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
              title="Previous card (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
              title="Next card (Right Arrow)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
