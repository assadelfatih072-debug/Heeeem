import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { QUESTIONS_DATA } from './data/questionsData.ts';
import { StudyMode } from './types/index.ts';
import { getStoredProgress, saveProgress, resetAllProgress, UserProgress } from './utils/storage.ts';
import { Navbar } from './components/Navbar.tsx';
import { TutorMode } from './components/TutorMode.tsx';
import { ExamMode } from './components/ExamMode.tsx';
import { FlashcardMode } from './components/FlashcardMode.tsx';
import { CascadeVisualizer } from './components/CascadeVisualizer.tsx';
import { BohrCurveVisualizer } from './components/BohrCurveVisualizer.tsx';
import { BloodGroupMatrix } from './components/BloodGroupMatrix.tsx';
import { CheatSheet } from './components/CheatSheet.tsx';

export default function App() {
  const [currentTab, setCurrentTab] = useState<StudyMode>('tutor');
  const [interactiveTool, setInteractiveTool] = useState<'cascade' | 'bohr' | 'blood'>('cascade');
  const [progress, setProgress] = useState<UserProgress>(getStoredProgress);

  // Sync to localStorage
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const handleAnswerQuestion = (
    questionId: number,
    selectedAnswer: 'A' | 'B' | 'C' | 'D',
    isCorrect: boolean
  ) => {
    setProgress((prev) => ({
      ...prev,
      answeredQuestions: {
        ...prev.answeredQuestions,
        [questionId]: { selectedAnswer, isCorrect },
      },
    }));
  };

  const handleClearAnswer = (questionId: number) => {
    setProgress((prev) => {
      const next = { ...prev.answeredQuestions };
      delete next[questionId];
      return {
        ...prev,
        answeredQuestions: next,
      };
    });
  };

  const handleToggleBookmark = (questionId: number) => {
    setProgress((prev) => {
      const exists = prev.bookmarkedQuestionIds.includes(questionId);
      return {
        ...prev,
        bookmarkedQuestionIds: exists
          ? prev.bookmarkedQuestionIds.filter((id) => id !== questionId)
          : [...prev.bookmarkedQuestionIds, questionId],
      };
    });
  };

  const handleUpdateMastery = (questionId: number, status: 'mastered' | 'review') => {
    setProgress((prev) => ({
      ...prev,
      flashcardMastery: {
        ...prev.flashcardMastery,
        [questionId]: status,
      },
    }));
  };

  const handleFinishExam = (score: number, total: number) => {
    setProgress((prev) => ({
      ...prev,
      examHistory: [
        {
          date: new Date().toLocaleDateString(),
          score,
          total,
          percentage: Math.round((score / total) * 100),
          durationSeconds: 0,
        },
        ...prev.examHistory,
      ],
    }));
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all answers and saved history?')) {
      const fresh = resetAllProgress();
      setProgress(fresh);
    }
  };

  const answeredCount = Object.keys(progress.answeredQuestions).length;
  const correctCount = Object.values(progress.answeredQuestions).filter((a) => a.isCorrect).length;
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const masteredCount = Object.values(progress.flashcardMastery).filter((s) => s === 'mastered').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* 3-Zone Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onStartExam={() => setCurrentTab('exam')}
      />

      {/* Secondary Mobile Tab Switcher */}
      <div className="md:hidden flex items-center justify-around border-b border-slate-200 bg-white px-2 py-2 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setCurrentTab('tutor')}
          className={`px-3 py-1 rounded whitespace-nowrap ${currentTab === 'tutor' ? 'text-rose-600 font-bold bg-rose-50' : 'text-slate-600'}`}
        >
          Practice Tutor
        </button>
        <button
          onClick={() => setCurrentTab('exam')}
          className={`px-3 py-1 rounded whitespace-nowrap ${currentTab === 'exam' ? 'text-rose-600 font-bold bg-rose-50' : 'text-slate-600'}`}
        >
          Timed Exam
        </button>
        <button
          onClick={() => setCurrentTab('flashcard')}
          className={`px-3 py-1 rounded whitespace-nowrap ${currentTab === 'flashcard' ? 'text-rose-600 font-bold bg-rose-50' : 'text-slate-600'}`}
        >
          Flashcards
        </button>
        <button
          onClick={() => setCurrentTab('interactive')}
          className={`px-3 py-1 rounded whitespace-nowrap ${currentTab === 'interactive' ? 'text-rose-600 font-bold bg-rose-50' : 'text-slate-600'}`}
        >
          Visualizers
        </button>
        <button
          onClick={() => setCurrentTab('cheatsheet')}
          className={`px-3 py-1 rounded whitespace-nowrap ${currentTab === 'cheatsheet' ? 'text-rose-600 font-bold bg-rose-50' : 'text-slate-600'}`}
        >
          Cheat Sheet
        </button>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI / Progress strip */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600">
            <div>
              <span className="text-slate-400 block text-[11px]">Total Bank Progress</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {answeredCount} <span className="text-slate-400 font-normal">/ 65 questions</span>
              </span>
            </div>

            <div className="border-l border-slate-200 pl-6">
              <span className="text-slate-400 block text-[11px]">Tutor Accuracy</span>
              <span className="font-mono font-bold text-emerald-600 text-sm">
                {accuracy}% <span className="text-slate-400 font-normal font-sans">({correctCount} correct)</span>
              </span>
            </div>

            <div className="border-l border-slate-200 pl-6">
              <span className="text-slate-400 block text-[11px]">Flashcards Mastered</span>
              <span className="font-mono font-bold text-indigo-600 text-sm">
                {masteredCount} <span className="text-slate-400 font-normal">/ 65</span>
              </span>
            </div>

            <div className="border-l border-slate-200 pl-6 hidden sm:block">
              <span className="text-slate-400 block text-[11px]">Bookmarked Questions</span>
              <span className="font-mono font-bold text-amber-600 text-sm">
                {progress.bookmarkedQuestionIds.length} <span className="text-slate-400 font-normal">saved</span>
              </span>
            </div>
          </div>

          <button
            onClick={handleResetProgress}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
            title="Reset answers and progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
        </div>

        {/* Dynamic Study Mode Content */}
        {currentTab === 'tutor' && (
          <TutorMode
            questions={QUESTIONS_DATA}
            userAnswers={progress.answeredQuestions}
            onAnswerQuestion={handleAnswerQuestion}
            onClearAnswer={handleClearAnswer}
            bookmarkedIds={progress.bookmarkedQuestionIds}
            onBookmark={handleToggleBookmark}
          />
        )}

        {currentTab === 'exam' && (
          <ExamMode
            questions={QUESTIONS_DATA}
            onFinishExam={handleFinishExam}
            onBookmark={handleToggleBookmark}
            bookmarkedIds={progress.bookmarkedQuestionIds}
          />
        )}

        {currentTab === 'flashcard' && (
          <FlashcardMode
            questions={QUESTIONS_DATA}
            masteryMap={progress.flashcardMastery}
            onUpdateMastery={handleUpdateMastery}
            onBookmark={handleToggleBookmark}
            bookmarkedIds={progress.bookmarkedQuestionIds}
          />
        )}

        {currentTab === 'interactive' && (
          <div className="space-y-6">
            {/* Visualizer selector */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl text-xs font-medium w-fit">
              <button
                onClick={() => setInteractiveTool('cascade')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  interactiveTool === 'cascade'
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Coagulation Cascade & Tests
              </button>
              <button
                onClick={() => setInteractiveTool('bohr')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  interactiveTool === 'bohr'
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Oxygen-Hb Bohr Dissociation Curve
              </button>
              <button
                onClick={() => setInteractiveTool('blood')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  interactiveTool === 'blood'
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3. ABO, Rh & Erythroblastosis Fetalis
              </button>
            </div>

            {interactiveTool === 'cascade' && <CascadeVisualizer />}
            {interactiveTool === 'bohr' && <BohrCurveVisualizer />}
            {interactiveTool === 'blood' && <BloodGroupMatrix />}
          </div>
        )}

        {currentTab === 'cheatsheet' && <CheatSheet />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">HemaReview</span>
            <span aria-hidden="true">·</span>
            <span>Comprehensive 65-MCQ Hematology & Cardiovascular Review Bank</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>6 Core Domains</span>
            <span aria-hidden="true">·</span>
            <span>High-Yield Clinical Pearls</span>
            <span aria-hidden="true">·</span>
            <span>Local Progress Auto-Saved</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
