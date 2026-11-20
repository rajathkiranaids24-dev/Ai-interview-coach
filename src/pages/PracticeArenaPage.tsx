import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Sparkles,
  Zap,
  Clock,
  Gauge,
  Play,
  RotateCcw,
  Award,
  CheckCircle2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { PracticeTest } from '../types/index.ts';

interface PracticeArenaPageProps {
  onStartTest: (testConfig: { category: string; difficulty: string; questionCount: number; timeLimitMinutes: number }) => void;
  onViewResult: (test: PracticeTest) => void;
}

export const PracticeArenaPage: React.FC<PracticeArenaPageProps> = ({
  onStartTest,
  onViewResult,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Technical Interview');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Intermediate');
  const [questionCount, setQuestionCount] = useState(5);
  const [timeLimit, setTimeLimit] = useState(10);
  const [testHistory, setTestHistory] = useState<PracticeTest[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'Technical Interview', label: 'Technical Interview', desc: 'Data structures, REST APIs, database scaling, concurrency', icon: '💻' },
    { id: 'Coding Concepts', label: 'Coding Concepts', desc: 'Time complexity, memory management, OOP & functional paradigms', icon: '⚡' },
    { id: 'HR Questions', label: 'HR Questions', desc: 'Self introduction, motivation, conflict handling, team dynamics', icon: '🤝' },
    { id: 'Aptitude', label: 'Quantitative Aptitude', desc: 'Percentages, probability, permutations, speed and distance', icon: '📊' },
    { id: 'Logical Reasoning', label: 'Logical Reasoning', desc: 'Pattern matching, syllogisms, blood relations, deductive logic', icon: '🧩' },
    { id: 'Domain-Specific Questions', label: 'Domain-Specific', desc: 'Cloud infrastructure, frontend frameworks, security protocols', icon: '🌐' },
    { id: 'Company-Specific Questions', label: 'Company-Specific', desc: 'FAANG, Tier-1 tech and MNC specific question patterns', icon: '🏢' },
  ];

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await api.tests.getHistory();
        setTestHistory(res.tests);
      } catch (err) {
        console.warn('Failed to load practice history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const handleLaunch = () => {
    onStartTest({
      category: selectedCategory,
      difficulty: selectedDifficulty,
      questionCount,
      timeLimitMinutes: timeLimit,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-2">
          <Zap className="w-3.5 h-3.5" />
          <span>Interactive Self-Paced Testing</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Practice Arena</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Hone your core competencies without entering the live camera room. Solve MCQs and get instant Gemini grading on descriptive answers.
        </p>
      </div>

      {/* Category Selection Grid */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-300">1. Select Assessment Category</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{cat.icon}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                  </div>
                  <h4 className={`text-xs font-semibold ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                    {cat.label}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{cat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Configuration Grid: Difficulty, Count, Time Limit */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
        <label className="block text-xs font-semibold text-slate-300">2. Configure Assessment Parameters</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>Difficulty Level</span>
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white text-xs"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced / Hard">Advanced / Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Number of Questions</span>
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white text-xs"
            >
              <option value={5}>5 Questions (Express Practice)</option>
              <option value={10}>10 Questions (Standard Test)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Time Limit</span>
            </label>
            <select
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white text-xs"
            >
              <option value={5}>5 Minutes</option>
              <option value={10}>10 Minutes</option>
              <option value={15}>15 Minutes</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            * Includes both multiple-choice and AI-evaluated conceptual questions.
          </p>

          <button
            onClick={handleLaunch}
            className="px-6 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Practice Test</span>
          </button>
        </div>
      </div>

      {/* Completed Tests History */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Your Completed Test History</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">{testHistory.length} tests taken</span>
        </div>

        {testHistory.length === 0 ? (
          <div className="text-center py-8 rounded-xl bg-slate-950/40 border border-dashed border-slate-800">
            <CheckSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No practice tests completed yet. Start your first session above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {testHistory.map((test) => (
              <div
                key={test._id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-white">{test.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono">
                      {test.difficulty}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span>{new Date(test.completedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{test.correctCount || 0} / {test.totalQuestions} Questions Passed</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-bold font-mono text-cyan-400">{test.score}%</div>
                    <div className="text-[10px] text-slate-400">Score</div>
                  </div>
                  <button
                    onClick={() => onViewResult(test)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
