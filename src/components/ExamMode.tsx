import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Check,
  Bookmark,
  BarChart3,
} from 'lucide-react';
import { Question } from '../types/index.ts';
import { CATEGORIES } from '../data/questionsData.ts';

interface ExamModeProps {
  questions: Question[];
  onFinishExam: (score: number, total: number) => void;
  onBookmark: (questionId: number) => void;
  bookmarkedIds: number[];
}

export const ExamMode: React.FC<ExamModeProps> = ({
  questions,
  onFinishExam,
  onBookmark,
  bookmarkedIds,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [flaggedIds, setFlaggedIds] = useState<number[]>([]);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(65 * 60); // 65 minutes
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'flagged'>('all');

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || isTimerPaused) return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, isTimerPaused]);

  const currentQ = questions[currentIdx];

  const handleSelectAnswer = (optionKey: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionKey,
    }));
  };

  const toggleFlag = (id: number) => {
    setFlaggedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  const handleSubmitExam = () => {
    setShowSubmitModal(false);
    setIsSubmitted(true);

    // Calculate score
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    onFinishExam(correct, questions.length);

    if (correct / questions.length >= 0.7) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Confetti fallback
      }
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setFlaggedIds([]);
    setTimeRemainingSeconds(65 * 60);
    setIsSubmitted(false);
    setCurrentIdx(0);
    setReviewFilter('all');
  };

  // Format timer MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  // Calculation for results
  const scoreCount = questions.reduce(
    (acc, q) => (answers[q.id] === q.correctAnswer ? acc + 1 : acc),
    0
  );
  const scorePercent = Math.round((scoreCount / questions.length) * 100);

  // Category performance
  const categoryStats = CATEGORIES.map((cat) => {
    const catQuestions = questions.filter((q) => q.category === cat);
    const catCorrect = catQuestions.filter((q) => answers[q.id] === q.correctAnswer).length;
    return {
      category: cat,
      total: catQuestions.length,
      correct: catCorrect,
      percent: Math.round((catCorrect / catQuestions.length) * 100),
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Status & Controls */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-50 text-rose-700 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Standard 65-Question Mock Board Examination</span>
              <span aria-hidden="true">·</span>
              <span>1 min/question</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-bold text-slate-900">
                {formatTime(timeRemainingSeconds)}
              </span>
              {!isSubmitted && (
                <button
                  onClick={() => setIsTimerPaused(!isTimerPaused)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  {isTimerPaused ? 'Resume' : 'Pause'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs text-slate-600 hidden sm:block">
            <div>
              <span className="font-bold text-slate-900">{answeredCount}</span> of{' '}
              {questions.length} answered
            </div>
            <div className="text-slate-400">
              {flaggedIds.length} flagged for review
            </div>
          </div>

          {!isSubmitted ? (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              Finish & Grade Exam
            </button>
          ) : (
            <button
              onClick={handleRetake}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake Examination</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      {!isSubmitted ? (
        /* ACTIVE EXAM INTERFACE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Question Stage */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-mono font-bold text-slate-900">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span aria-hidden="true">·</span>
                <span>{currentQ.category}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFlag(currentQ.id)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    flaggedIds.includes(currentQ.id)
                      ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{flaggedIds.includes(currentQ.id) ? 'Flagged' : 'Flag Question'}</span>
                </button>
              </div>
            </div>

            {/* Question Text */}
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt) => {
                const isSelected = answers[currentQ.id] === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => handleSelectAnswer(opt.key)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-center gap-3.5 ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white font-medium shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-md font-mono font-bold flex items-center justify-center shrink-0 text-xs border ${
                        isSelected
                          ? 'bg-slate-800 text-white border-slate-700'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {opt.key}
                    </span>
                    <span className="flex-1 text-sm">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <span className="text-xs font-mono text-slate-400">
                {currentIdx + 1} / {questions.length}
              </span>

              <button
                onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                disabled={currentIdx === questions.length - 1}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Exam Navigator Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900">Exam Question Palette</h4>
              <span className="text-[11px] font-mono text-slate-500">
                {answeredCount}/{questions.length} Answered
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-500 border-b border-slate-100 pb-2">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-slate-900 inline-block" /> Answered
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block" /> Flagged
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-300 inline-block" /> Blank
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-5 gap-1.5 max-h-[360px] overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIdx;
                const isAnswered = answers[q.id] !== undefined;
                const isFlagged = flaggedIds.includes(q.id);

                let bgClass = 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
                if (isAnswered) {
                  bgClass = 'bg-slate-800 text-white border-slate-800';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`relative h-8 rounded text-xs font-mono font-medium border flex items-center justify-center transition-all ${bgClass} ${
                      isCurrent ? 'ring-2 ring-rose-500 ring-offset-1 font-bold z-10' : ''
                    }`}
                  >
                    <span>{q.id}</span>
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-1 ring-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* POST-EXAM RESULTS & SCORECARD */
        <div className="space-y-6">
          {/* Score Header */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold font-mono text-white ${
                    scorePercent >= 75 ? 'bg-emerald-600' : scorePercent >= 60 ? 'bg-amber-600' : 'bg-rose-600'
                  }`}
                >
                  {scorePercent}%
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">Examination Completed</div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {scoreCount} of {questions.length} Correct
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {scorePercent >= 75
                      ? 'Distinction: Outstanding mastery of hematology and cardiovascular physiology.'
                      : scorePercent >= 60
                      ? 'Pass: Solid clinical foundation. Review missed questions below.'
                      : 'Needs Remediation: Review the high-yield rationales and cheat sheet.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRetake}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Retake Exam
                </button>
              </div>
            </div>

            {/* Category Performance Breakdown */}
            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-slate-600" />
                <span>Performance Breakdown by Medical Domain:</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {categoryStats.map((cat, i) => (
                  <div key={i} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800 truncate pr-2">{cat.category}</span>
                      <span className="font-mono text-slate-600 shrink-0">
                        {cat.correct}/{cat.total} ({cat.percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          cat.percent >= 75 ? 'bg-emerald-500' : cat.percent >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${cat.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Question Review Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">
                Detailed Question-by-Question Review
              </h3>

              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setReviewFilter('all')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    reviewFilter === 'all' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All (65)
                </button>
                <button
                  onClick={() => setReviewFilter('incorrect')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    reviewFilter === 'incorrect' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Incorrect ({questions.length - scoreCount})
                </button>
                <button
                  onClick={() => setReviewFilter('flagged')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    reviewFilter === 'flagged' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Flagged ({flaggedIds.length})
                </button>
              </div>
            </div>

            {/* List of Questions */}
            <div className="space-y-6">
              {questions
                .filter((q) => {
                  if (reviewFilter === 'incorrect') return answers[q.id] !== q.correctAnswer;
                  if (reviewFilter === 'flagged') return flaggedIds.includes(q.id);
                  return true;
                })
                .map((q) => {
                  const userAns = answers[q.id];
                  const isCorrect = userAns === q.correctAnswer;
                  const isFlagged = flaggedIds.includes(q.id);
                  const isBookmarked = bookmarkedIds.includes(q.id);

                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-xl border transition-all space-y-4 ${
                        isCorrect
                          ? 'border-emerald-200 bg-emerald-50/20'
                          : 'border-rose-200 bg-rose-50/20'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">Question {q.id}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-500">{q.category}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isCorrect ? (
                            <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded text-[11px]">
                              <XCircle className="w-3.5 h-3.5" /> Incorrect
                            </span>
                          )}
                          <button
                            onClick={() => onBookmark(q.id)}
                            className={`p-1 rounded text-xs border ${
                              isBookmarked
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                : 'border-slate-200 text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-slate-900">{q.question}</h4>

                      {/* Options breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt) => {
                          const isOptionCorrect = opt.key === q.correctAnswer;
                          const isUserChoice = opt.key === userAns;

                          let style = 'bg-white border-slate-200 text-slate-700';
                          if (isOptionCorrect) {
                            style = 'bg-emerald-100 border-emerald-300 font-semibold text-emerald-900';
                          } else if (isUserChoice && !isOptionCorrect) {
                            style = 'bg-rose-100 border-rose-300 font-semibold text-rose-900 line-through';
                          }

                          return (
                            <div
                              key={opt.key}
                              className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${style}`}
                            >
                              <span className="w-5 h-5 rounded font-mono flex items-center justify-center font-bold text-[11px] shrink-0 border border-slate-300">
                                {opt.key}
                              </span>
                              <span>{opt.text}</span>
                              {isOptionCorrect && (
                                <Check className="w-4 h-4 text-emerald-700 ml-auto" />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Detailed Rationale */}
                      <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
                        <strong className="text-slate-900 block font-semibold">Clinical Rationale:</strong>
                        <p className="leading-relaxed">{q.explanation}</p>
                        <div className="pt-2 text-[11px] text-amber-900 border-t border-slate-200 font-medium">
                          <strong>High-Yield Pearl:</strong> {q.highYieldPearl}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">Submit Exam for Grading?</h3>
            <div className="text-xs text-slate-600 space-y-2">
              <p>
                You have answered <strong>{answeredCount}</strong> of <strong>{questions.length}</strong> questions.
              </p>
              {unansweredCount > 0 && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>
                    Warning: You still have <strong>{unansweredCount}</strong> unanswered questions!
                  </span>
                </div>
              )}
              {flaggedIds.length > 0 && (
                <p className="text-slate-500">
                  You have <strong>{flaggedIds.length}</strong> questions flagged for review.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Return to Exam
              </button>
              <button
                onClick={handleSubmitExam}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
