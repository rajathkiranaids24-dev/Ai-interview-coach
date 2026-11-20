import React, { useState } from 'react';
import {
  FileCheck,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Briefcase,
  GraduationCap,
  Sparkles,
  HelpCircle,
  FolderGit2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ResumeDocument } from '../types/index.ts';

interface ResumeAnalysisPageProps {
  resume: ResumeDocument | null;
  onNavigate: (tab: string) => void;
}

export const ResumeAnalysisPage: React.FC<ResumeAnalysisPageProps> = ({
  resume,
  onNavigate,
}) => {
  const [expandedSection, setExpandedSection] = useState<'all' | 'skills' | 'projects' | 'questions'>('all');

  if (!resume) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <FileCheck className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Resume Found</h2>
        <p className="text-xs text-slate-400">
          Upload your resume to receive an ATS compatibility assessment and personalized interview questions.
        </p>
        <button
          onClick={() => onNavigate('resume')}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors inline-flex items-center gap-2"
        >
          <span>Upload Resume Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const { analysis } = resume;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Banner with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Resume Intelligence</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{analysis.candidateName || 'Candidate Profile'}</h1>
          <p className="text-xs text-slate-400 mt-1">
            File: <span className="text-slate-200 font-mono">{resume.fileName}</span> • Analyzed on {new Date(resume.uploadedAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('resume')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Upload New Version</span>
          </button>
          <button
            onClick={() => onNavigate('interview-setup')}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 flex items-center gap-2"
          >
            <span>Start Tailored Interview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary Score Cards: Overall Score & ATS Compatibility */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Resume Score */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Overall Resume Score</p>
            <h3 className="text-3xl font-extrabold text-white font-mono mt-1">
              {analysis.overallScore}<span className="text-sm text-slate-400 font-sans font-normal">/100</span>
            </h3>
            <span className="inline-block mt-2 text-[10px] font-medium text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              High Competitiveness
            </span>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Award className="w-8 h-8" />
          </div>
        </div>

        {/* ATS Compatibility */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">ATS Match Readiness</p>
            <h3 className="text-3xl font-extrabold text-white font-mono mt-1">
              {analysis.atsScore}<span className="text-sm text-slate-400 font-sans font-normal">/100</span>
            </h3>
            <span className="inline-block mt-2 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Parses Cleanly
            </span>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
        </div>

        {/* Skills Identified */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Technical Competencies</p>
            <h3 className="text-3xl font-extrabold text-white font-mono mt-1">
              {analysis.technicalSkills.length}
            </h3>
            <span className="inline-block mt-2 text-[10px] font-medium text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
              Extracted & Tagged
            </span>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Sparkles className="w-8 h-8" />
          </div>
        </div>

        {/* Recommended Roles */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Target Matches</p>
            <h3 className="text-xl font-bold text-white mt-1 truncate max-w-[130px]">
              {analysis.recommendedRoles[0] || 'Software Engineer'}
            </h3>
            <span className="inline-block mt-2 text-[10px] font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              Primary Role Match
            </span>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Briefcase className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h3 className="text-sm font-semibold text-white">Identified Resume Strengths</h3>
          </div>
          <ul className="space-y-2.5">
            {analysis.strengths.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses & Missing Sections */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-sm font-semibold text-white">Areas for Improvement & Missing Gaps</h3>
          </div>
          <ul className="space-y-2.5">
            {[...analysis.weaknesses, ...(analysis.missingSections || [])].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actionable Suggestions */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/80 to-cyan-950/20 border border-slate-800">
        <div className="flex items-center gap-2 mb-4 text-cyan-400">
          <Lightbulb className="w-4 h-4" />
          <h3 className="text-sm font-semibold text-white">Actionable Suggestions to Boost ATS Pass Rate</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {analysis.suggestions.map((sug, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
              <span className="font-mono text-cyan-400 font-bold shrink-0">{i + 1}.</span>
              <span>{sug}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Showcase */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
        <h3 className="text-sm font-semibold text-white mb-4">Extracted Technical & Soft Skills</h3>
        <div className="space-y-4">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">Technical Skills</span>
            <div className="flex flex-wrap gap-2">
              {analysis.technicalSkills.map((skill, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">Soft & Leadership Skills</span>
            <div className="flex flex-wrap gap-2">
              {analysis.softSkills.map((skill, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Potential Interview Questions (Synthesized by Gemini) */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Expected Interview Questions Based On Your Resume</h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            Custom Tailored
          </span>
        </div>

        <div className="space-y-3">
          {analysis.potentialInterviewQuestions.map((q, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-mono text-cyan-400 shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">{q}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
