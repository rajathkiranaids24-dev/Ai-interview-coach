import React, { useState } from 'react';
import {
  Sparkles,
  Video,
  Building2,
  Briefcase,
  Layers,
  Clock,
  Gauge,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Bot,
  Sliders,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { InterviewSession, ResumeDocument } from '../types/index.ts';

interface InterviewSetupPageProps {
  resume: ResumeDocument | null;
  onStartInterview: (session: InterviewSession) => void;
  onNavigate: (tab: string) => void;
}

export const InterviewSetupPage: React.FC<InterviewSetupPageProps> = ({
  resume,
  onStartInterview,
  onNavigate,
}) => {
  const [jobRole, setJobRole] = useState(resume?.analysis?.recommendedRoles?.[0] || 'Full Stack Software Engineer');
  const [company, setCompany] = useState('Google');
  const [interviewType, setInterviewType] = useState<string>('Technical Interview');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [questionCount, setQuestionCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roles = [
    'Full Stack Software Engineer',
    'Frontend Developer (React / Next.js)',
    'Backend Engineer (Node.js / Go)',
    'Distributed Systems Engineer',
    'DevOps & Cloud Engineer',
    'Data Scientist & ML Engineer',
    'Mobile Application Engineer',
  ];

  const companies = [
    'Google',
    'Microsoft',
    'Amazon',
    'Meta',
    'Stripe',
    'Uber',
    'Apple',
    'Netflix',
    'TCS / Infosys',
    'High-Growth Tech Startup',
  ];

  const interviewTypes = [
    { id: 'Technical Interview', label: 'Technical Interview', desc: 'Algorithms, data structures, and code architecture' },
    { id: 'HR Interview', label: 'HR & Culture Fit', desc: 'Background, motivation, career aspirations, and team dynamics' },
    { id: 'Behavioral Interview', label: 'Behavioral (STAR)', desc: 'Situational judgment, conflict resolution, leadership' },
    { id: 'Company-Specific Interview', label: 'Company-Specific', desc: 'Target company culture, products, and tech stack trends' },
    { id: 'Managerial Interview', label: 'Managerial & Design', desc: 'High-level system design and delivery ownership' },
    { id: 'Mixed Interview', label: 'Comprehensive Mixed', desc: 'Full-spectrum simulation mimicking a complete hiring round' },
  ];

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.interviews.create({
        jobRole,
        company,
        interviewType,
        difficulty,
        totalQuestions: questionCount,
      });

      onStartInterview(res.interview);
      onNavigate('live-interview');
    } catch (err: any) {
      console.error('Failed to create interview:', err);
      setError(err.message || 'Failed to start interview session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Personalized AI Simulation Room</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Configure Your Interview</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize your target role, dream company, and difficulty level. The AI interviewer personalizes questions using your uploaded resume.
        </p>
      </div>

      {/* Resume context indicator */}
      {resume ? (
        <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Active Resume Attached</p>
              <p className="text-[11px] text-slate-400">
                {resume.fileName} • ATS Score: {resume.analysis.atsScore}/100 • {resume.analysis.technicalSkills.length} skills will be probed
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('resume')}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Change Resume
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-xs text-amber-200">
              No resume uploaded. The AI will ask general baseline questions. Upload your resume for deep personalization.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('resume')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 shrink-0"
          >
            Upload Resume
          </button>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleLaunch} className="space-y-6">
        {/* Role & Company Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
            <label className="block text-xs font-semibold text-white mb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span>Target Job Role</span>
            </label>
            <select
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white text-xs"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-2">Questions will evaluate technical architecture suited for this title.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
            <label className="block text-xs font-semibold text-white mb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Target Company</span>
            </label>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white text-xs"
            >
              {companies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-2">Questions adapt to company engineering culture and recent tech trends.</p>
          </div>
        </div>

        {/* Interview Type Selector */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
          <label className="block text-xs font-semibold text-white mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Select Interview Type</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {interviewTypes.map((t) => (
              <div
                key={t.id}
                onClick={() => setInterviewType(t.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  interviewType === t.id
                    ? 'bg-cyan-500/10 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-semibold ${interviewType === t.id ? 'text-cyan-300' : 'text-white'}`}>
                    {t.label}
                  </span>
                  {interviewType === t.id && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty & Length Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
            <label className="block text-xs font-semibold text-white mb-2 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span>Difficulty Level</span>
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white text-xs"
            >
              <option value="Beginner">Beginner (College Campus / Intern)</option>
              <option value="Intermediate">Intermediate (1-3 YOE)</option>
              <option value="Hard">Hard (Senior SDE / Complex Systems)</option>
              <option value="Faang / Expert">FAANG / Staff Engineer Standard</option>
            </select>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
            <label className="block text-xs font-semibold text-white mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Target Duration</span>
            </label>
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white text-xs"
            >
              <option value={10}>10 Minutes (Quick Check)</option>
              <option value={15}>15 Minutes (Standard Round)</option>
              <option value={20}>20 Minutes (Deep Dive)</option>
              <option value={30}>30 Minutes (Full Simulation)</option>
            </select>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
            <label className="block text-xs font-semibold text-white mb-2 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Questions Count</span>
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white text-xs"
            >
              <option value={3}>3 Questions (Express)</option>
              <option value={5}>5 Questions (Recommended)</option>
              <option value={7}>7 Questions (Comprehensive)</option>
            </select>
          </div>
        </div>

        {/* Start button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Webcam Posture Analysis + Voice Synthesis Activated</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:opacity-95 text-slate-950 shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <Video className="w-4 h-4" />
            <span>{isLoading ? 'Synthesizing Session...' : 'Enter Live Interview Room'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
