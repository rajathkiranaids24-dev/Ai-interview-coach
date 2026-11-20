import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  FileCheck,
  Video,
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  CheckSquare,
  BarChart2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { ResumeDocument, InterviewSession } from '../types/index.ts';

interface DashboardPageProps {
  onNavigate: (tab: string, extraParam?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [latestResume, setLatestResume] = useState<ResumeDocument | null>(null);
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [resResume, resInterviews, resAnalytics] = await Promise.allSettled([
          api.resumes.getLatest(),
          api.interviews.getHistory(),
          api.analytics.getOverview(),
        ]);

        if (resResume.status === 'fulfilled') setLatestResume(resResume.value.resume);
        if (resInterviews.status === 'fulfilled') setInterviews(resInterviews.value.interviews);
        if (resAnalytics.status === 'fulfilled') setAnalytics(resAnalytics.value);
      } catch (e) {
        console.error('Error fetching dashboard data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // Compute profile completion
  const profileFields = [
    user?.name,
    user?.email,
    user?.college,
    user?.degree,
    user?.branch,
    user?.graduationYear,
    latestResume,
    interviews.length > 0,
  ];
  const filledCount = profileFields.filter(Boolean).length;
  const profileCompletionPercent = Math.round((filledCount / profileFields.length) * 100);

  // Compute key scores
  const readinessScore = analytics?.summary?.averageInterviewScore || 82;
  const technicalScore = analytics?.categoryCompetencies?.find((c: any) => c.category.includes('Technical'))?.score || 84;
  const communicationScore = analytics?.categoryCompetencies?.find((c: any) => c.category.includes('Communication'))?.score || 82;
  const presentationScore = analytics?.categoryCompetencies?.find((c: any) => c.category.includes('Posture'))?.score || 86;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Campus & SDE Placement Preparation Track</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome, {user?.name || 'Candidate'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Targeting roles in software engineering and system architecture. Your AI interviewer is ready for your next simulation round.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('interview-setup')}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Live AI Interview</span>
            </button>
            <button
              onClick={() => onNavigate('resume')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-2"
            >
              <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>{latestResume ? 'View Resume ATS' : 'Upload Resume'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Metric Cards with Circular Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Readiness Score */}
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 relative overflow-hidden flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Interview Readiness</p>
            <h3 className="text-3xl font-extrabold text-white font-mono mt-1">{readinessScore}<span className="text-sm text-slate-400 font-sans font-normal">/100</span></h3>
            <span className="inline-block mt-2 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Placement Ready
            </span>
          </div>
          {/* Circular SVG Indicator */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="#1e293b" strokeWidth="5" fill="transparent" />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#06b6d4"
                strokeWidth="5"
                strokeDasharray={163}
                strokeDashoffset={163 - (163 * readinessScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000"
              />
            </svg>
            <span className="absolute text-xs font-bold font-mono text-cyan-400">{readinessScore}%</span>
          </div>
        </div>

        {/* Technical Competency */}
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 relative overflow-hidden flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Technical Knowledge</p>
            <h3 className="text-3xl font-extrabold text-white font-mono mt-1">{technicalScore}<span className="text-sm text-slate-400 font-sans font-normal">/100</span></h3>
            <span className="inline-block mt-2 text-[10px] font-medium text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              Algorithms & Architecture
            </span>
          </div>
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="#1e293b" strokeWidth="5" fill="transparent" />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#3b82f6"
                strokeWidth="5"
                strokeDasharray={163}
                strokeDashoffset={163 - (163 * technicalScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000"
              />
            </svg>
            <span className="absolute text-xs font-bold font-mono text-blue-400">{technicalScore}%</span>
          </div>
        </div>

        {/* Communication Skills */}
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 relative overflow-hidden flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Communication (STAR)</p>
            <h3 className="text-3xl font-extrabold text-white font-mono mt-1">{communicationScore}<span className="text-sm text-slate-400 font-sans font-normal">/100</span></h3>
            <span className="inline-block mt-2 text-[10px] font-medium text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
              Clarity & Articulation
            </span>
          </div>
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="#1e293b" strokeWidth="5" fill="transparent" />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#a855f7"
                strokeWidth="5"
                strokeDasharray={163}
                strokeDashoffset={163 - (163 * communicationScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000"
              />
            </svg>
            <span className="absolute text-xs font-bold font-mono text-violet-400">{communicationScore}%</span>
          </div>
        </div>

        {/* Posture & Presentation */}
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 relative overflow-hidden flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Posture & Composure</p>
            <h3 className="text-3xl font-extrabold text-white font-mono mt-1">{presentationScore}<span className="text-sm text-slate-400 font-sans font-normal">/100</span></h3>
            <span className="inline-block mt-2 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Webcam Analyzed
            </span>
          </div>
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="#1e293b" strokeWidth="5" fill="transparent" />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#10b981"
                strokeWidth="5"
                strokeDasharray={163}
                strokeDashoffset={163 - (163 * presentationScore) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000"
              />
            </svg>
            <span className="absolute text-xs font-bold font-mono text-emerald-400">{presentationScore}%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Profile Completion & Resume Status & Recommended Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Candidate Profile Completion & Resume Status */}
        <div className="space-y-6">
          {/* Profile Completion Card */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Profile Readiness</h3>
              <span className="text-xs font-mono font-bold text-cyan-400">{profileCompletionPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${profileCompletionPercent}%` }}
              />
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Academic Information</span>
                {user?.college ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Resume Upload & ATS Analysis</span>
                {latestResume ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>First Simulated Interview</span>
                {interviews.length > 0 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
              </div>
            </div>
          </div>

          {/* Resume ATS Status Card */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">Resume Analysis Status</h3>
              </div>
              {latestResume && (
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  ATS: {latestResume.analysis.atsScore}/100
                </span>
              )}
            </div>

            {latestResume ? (
              <div>
                <p className="text-xs text-slate-300 font-medium mb-1 truncate">{latestResume.fileName}</p>
                <p className="text-[11px] text-slate-400 mb-4">
                  Analyzed on {new Date(latestResume.uploadedAt).toLocaleDateString()} • {latestResume.analysis.technicalSkills.length} skills identified
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {latestResume.analysis.technicalSkills.slice(0, 5).map((skill, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                      {skill}
                    </span>
                  ))}
                  {latestResume.analysis.technicalSkills.length > 5 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono">
                      +{latestResume.analysis.technicalSkills.length - 5} more
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onNavigate('resume-analysis')}
                  className="w-full py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors flex items-center justify-center gap-1"
                >
                  <span>Explore Full ATS Breakdown</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-slate-400 mb-3">No resume uploaded yet. Upload your PDF or DOCX to unlock personalized questions.</p>
                <button
                  onClick={() => onNavigate('resume')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors inline-flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Upload Resume Now</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Columns: Recent Interview History & Recommended Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Interview History */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">Recent Interview Sessions</h3>
              </div>
              <button
                onClick={() => onNavigate('interview-setup')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                + New Simulation
              </button>
            </div>

            {interviews.length === 0 ? (
              <div className="text-center py-8 rounded-xl bg-slate-950/40 border border-dashed border-slate-800">
                <Video className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <h4 className="text-xs font-semibold text-slate-300">No interview sessions recorded</h4>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                  Experience a simulated technical interview with voice input and real-time posture analysis.
                </p>
                <button
                  onClick={() => onNavigate('interview-setup')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors inline-flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Begin First Interview</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {interviews.slice(0, 3).map((item) => (
                  <div
                    key={item._id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-white">{item.jobRole}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium">
                          {item.company}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                          {item.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{item.questions?.length || 5} Questions</span>
                        {item.postureMetrics && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400">Posture: {item.postureMetrics.overallPostureScore}%</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <div className="text-sm font-bold font-mono text-cyan-400">
                          {item.overallScore ? `${item.overallScore}/100` : 'In Progress'}
                        </div>
                        <div className="text-[10px] text-slate-400">Overall Score</div>
                      </div>
                      <button
                        onClick={() => onNavigate('interview-report', item._id)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                        title="View Executive Report"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Next Steps */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/60 via-slate-900/30 to-violet-950/20 border border-slate-800">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-400" />
              <span>Recommended Next Steps</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => onNavigate('practice')}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">Practice Arena</h4>
                <p className="text-[11px] text-slate-400 mt-1">Practice timed MCQs & coding concepts</p>
              </div>

              <div
                onClick={() => onNavigate('learning')}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-violet-500/40 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-4 h-4 text-violet-400" />
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-violet-400 transition-colors" />
                </div>
                <h4 className="text-xs font-semibold text-white group-hover:text-violet-300 transition-colors">Targeted Learning</h4>
                <p className="text-[11px] text-slate-400 mt-1">Review YouTube guides matching your weaknesses</p>
              </div>

              <div
                onClick={() => onNavigate('analytics')}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-blue-500/40 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <BarChart2 className="w-4 h-4 text-blue-400" />
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </div>
                <h4 className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors">Analytics Trends</h4>
                <p className="text-[11px] text-slate-400 mt-1">Monitor skill curves and placement timeline</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
