import React from 'react';
import { StudyMode } from '../types/index.ts';

interface NavbarProps {
  currentTab: StudyMode;
  onSelectTab: (tab: StudyMode) => void;
  onStartExam: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onStartExam,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2 shrink-0">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('tutor');
          }}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-rose-600 transition-colors"
        >
          HemaReview
        </a>
      </div>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <button
          onClick={() => onSelectTab('tutor')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'tutor' ? 'text-rose-600 font-semibold' : ''
          }`}
        >
          Practice Tutor
        </button>
        <button
          onClick={() => onSelectTab('exam')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'exam' ? 'text-rose-600 font-semibold' : ''
          }`}
        >
          Timed Exam
        </button>
        <button
          onClick={() => onSelectTab('flashcard')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'flashcard' ? 'text-rose-600 font-semibold' : ''
          }`}
        >
          Flashcards
        </button>
        <button
          onClick={() => onSelectTab('interactive')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'interactive' ? 'text-rose-600 font-semibold' : ''
          }`}
        >
          Clinical Visualizers
        </button>
        <button
          onClick={() => onSelectTab('cheatsheet')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'cheatsheet' ? 'text-rose-600 font-semibold' : ''
          }`}
        >
          High-Yield Sheet
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onStartExam}
          className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
        >
          Start Full Exam
        </button>
      </div>
    </header>
  );
};
