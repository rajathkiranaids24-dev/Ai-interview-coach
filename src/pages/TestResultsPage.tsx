import React from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  Lightbulb,
} from 'lucide-react';
import { PracticeTest } from '../types/index.ts';

interface TestResultsPageProps {
  test: PracticeTest;
  onRetake: () => void;
  onNavigate: (tab: string) => void;
}

export const TestResultsPage: React.FC<TestResultsPageProps> = ({
  test,
  onRetake,
  onNavigate,
}) => {
  const isPassed = test.score >= 70;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Practice Arena Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{test.title}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Category: <span className="text-slate-200">{test.category}</span> • Level: <span className="text-cyan-400">{test.difficulty}</span>
          </p>
        </div>

        <div className="flex flex-col items-center sm:items-end">
          <div className="text-5xl font-extrabold font-mono text-cyan-400">
            {test.score}%
          </div>
          <span
            className={`mt-1 text-xs font-semibold px-3 py-1 rounded-full border ${
              isPassed
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}
          >
            {isPassed ? 'Strong Performance (Passed)' : 'Needs Revision'}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <span className="text-slate-400 text-[11px] block">Correct Answers</span>
          <span className="text-xl font-bold font-mono text-emerald-400">{test.correctCount}</span>
          <span className="text-slate-500 text-[11px]"> / {test.totalQuestions}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <span className="text-slate-400 text-[11px] block">Time Spent</span>
          <span className="text-xl font-bold font-mono text-cyan-400">
            {Math.round(test.timeSpentSeconds / 60)}m {test.timeSpentSeconds % 60}s
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <span className="text-slate-400 text-[11px] block">Accuracy Rate</span>
          <span className="text-xl font-bold font-mono text-violet-400">{test.score}%</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <span className="text-slate-400 text-[11px] block">Saved Status</span>
          <span className="text-xs font-semibold text-emerald-400 block mt-1">Stored in Profile</span>
        </div>
      </div>

      {/* Detailed Question Review */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white">Question Review & Explanations</h3>

        <div className="space-y-3">
          {test.questions.map((q, idx) => {
            const isCorrect = q.score && q.score >= 70;

            return (
              <div
                key={q.id || idx}
                className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <span className="text-xs font-semibold text-white">
                      Q{idx + 1}: {q.question}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      isCorrect
                        ? 'bg-emerald-500/10 text-emerald-300'
                        : 'bg-rose-500/10 text-rose-300'
                    }`}
                  >
                    {q.score}%
                  </span>
                </div>

                {/* Candidate Answer */}
                <div className="text-xs text-slate-300 pl-7">
                  <span className="text-slate-500 font-medium">Your answer: </span>
                  <span className="font-mono">{q.userAnswer || 'No answer submitted'}</span>
                  {q.type === 'mcq' && q.correctAnswer && !isCorrect && (
                    <span className="text-emerald-400 ml-3">
                      • Correct option: <span className="font-bold">{q.correctAnswer}</span>
                    </span>
                  )}
                </div>

                {/* Explanation */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 pl-4 border-l-2 border-l-cyan-500">
                  <span className="font-semibold text-cyan-400 block mb-1">Explanation & Model Nuances:</span>
                  <p className="leading-relaxed">{q.explanation || q.feedback}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={onRetake}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retake Assessment</span>
        </button>

        <button
          onClick={() => onNavigate('learning')}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 flex items-center gap-2"
        >
          <span>Explore Recommended Learning</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
