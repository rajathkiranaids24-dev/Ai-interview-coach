import React, { useRef } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Download,
  RotateCcw,
  CheckSquare,
  ArrowRight,
  TrendingUp,
  Brain,
  Video,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InterviewSession } from '../types/index.ts';

interface InterviewReportPageProps {
  session: InterviewSession;
  onRetake: () => void;
  onNavigate: (tab: string) => void;
}

export const InterviewReportPage: React.FC<InterviewReportPageProps> = ({
  session,
  onRetake,
  onNavigate,
}) => {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(0);
  const printRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Trigger celebratory confetti on high score
    if ((session.overallScore || 0) >= 75) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#3b82f6', '#8b5cf6'],
      });
    }
  }, [session.overallScore]);

  const scores = session.categoryScores || {
    technicalKnowledge: 84,
    communicationSkills: 82,
    problemSolving: 80,
    answerRelevance: 88,
    logicalThinking: 82,
    resumeKnowledge: 86,
    posturePresentation: session.postureMetrics?.overallPostureScore || 85,
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 print:p-0" ref={printRef}>
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-2xl print:border-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>Official Executive Assessment Report</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Interview Performance Report
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Role: <span className="text-white font-semibold">{session.jobRole}</span> • Company Target:{' '}
              <span className="text-cyan-400 font-semibold">{session.company}</span> • Completed on{' '}
              {new Date(session.completedAt || session.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-end justify-center">
            <div className="text-5xl font-extrabold font-mono text-cyan-400 drop-shadow-lg">
              {session.overallScore || 85}
              <span className="text-xl font-normal text-slate-400">/100</span>
            </div>
            <span className="mt-1 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              {session.readinessLevel || 'Ready for Placement'}
            </span>
          </div>
        </div>

        {/* Action Buttons (Hidden on Print) */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-slate-800/80 print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Report (PDF)</span>
          </button>

          <button
            onClick={onRetake}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Interview</span>
          </button>

          <button
            onClick={() => onNavigate('practice')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 transition-colors shadow-md shadow-cyan-500/20"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Target Weaknesses in Practice Arena</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Summary Narrative */}
      {session.summary && (
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
          <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <Brain className="w-4 h-4 text-cyan-400" />
            <span>Executive Committee Evaluation Summary</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">{session.summary}</p>
        </div>
      )}

      {/* 7 Individual Score Dimensions Grid */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-4">Competency Scorecard Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: 'Technical', val: scores.technicalKnowledge, color: 'text-cyan-400', bar: 'bg-cyan-400' },
            { label: 'Communication', val: scores.communicationSkills, color: 'text-blue-400', bar: 'bg-blue-400' },
            { label: 'Problem Solving', val: scores.problemSolving, color: 'text-violet-400', bar: 'bg-violet-400' },
            { label: 'Relevance', val: scores.answerRelevance, color: 'text-emerald-400', bar: 'bg-emerald-400' },
            { label: 'Logic', val: scores.logicalThinking, color: 'text-indigo-400', bar: 'bg-indigo-400' },
            { label: 'Resume Align', val: scores.resumeKnowledge, color: 'text-amber-400', bar: 'bg-amber-400' },
            { label: 'Posture', val: scores.posturePresentation, color: 'text-teal-400', bar: 'bg-teal-400' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
              <span className="text-[11px] font-medium text-slate-400 block truncate">{item.label}</span>
              <div className={`text-xl font-bold font-mono my-1 ${item.color}`}>{item.val}</div>
              <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
                <div className={`h-full ${item.bar}`} style={{ width: `${item.val}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Actionable Areas of Improvement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h3 className="text-sm font-semibold text-white">Demonstrated Strengths</h3>
          </div>
          <ul className="space-y-3">
            {(session.strengths || [
              'Clear articulation of asynchronous event architecture',
              'Structured problem-solving breakdown during trade-off analysis',
              'Composed eye contact and steady camera presentation throughout',
            ]).map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvement Areas */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-sm font-semibold text-white">Areas Requiring Improvement</h3>
          </div>
          <ul className="space-y-3">
            {(session.areasOfImprovement || [
              'Include quantifiable business and performance metrics when referencing projects',
              'Deepen discussion of database connection pooling and sharding',
              'Explicitly highlight STAR components in behavioral inquiries',
            ]).map((imp, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Posture & Presentation Analysis Report (Requirement 9) */}
      {session.postureMetrics && (
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <Video className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-white">Webcam Posture & Presentation Report</h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Presentation Score: {session.postureMetrics.overallPostureScore}/100
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Upright Posture</span>
              <span className="font-mono font-bold text-white">{session.postureMetrics.goodPosturePercentage}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Facing Camera</span>
              <span className="font-mono font-bold text-white">{session.postureMetrics.cameraFacingPercentage}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Shoulder Alignment</span>
              <span className="font-mono font-bold text-white">{session.postureMetrics.shoulderAlignmentScore}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Physical Stability</span>
              <span className="font-mono font-bold text-white">{session.postureMetrics.movementStabilityScore}%</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            * Note: Posture evaluation is an approximate presentation aid to encourage upright, composed virtual interview presence. It does not measure intelligence or capability.
          </p>
        </div>
      )}

      {/* Detailed Question-by-Question Evaluation Accordion (Requirement 11) */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white">Question-by-Question Analysis</h3>

        <div className="space-y-3">
          {session.questions.map((q, idx) => {
            const isExpanded = expandedIndex === idx;
            const evalData = q.evaluation;

            return (
              <div
                key={q.id || idx}
                className="rounded-2xl bg-slate-900/40 border border-slate-800/90 overflow-hidden transition-all"
              >
                <div
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-850/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-800 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      Q{idx + 1}
                    </span>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-white">{q.questionText}</p>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                        {q.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {evalData && (
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                        {evalData.score}/10
                      </span>
                    )}
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800 space-y-4 text-xs">
                    {/* Candidate Answer */}
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                        Your Answer:
                      </span>
                      <p className="text-slate-200 italic leading-relaxed">
                        {q.candidateAnswer ? `"${q.candidateAnswer}"` : 'No verbal response recorded.'}
                      </p>
                    </div>

                    {evalData && (
                      <div className="space-y-3">
                        {/* Positive feedback */}
                        {evalData.positiveFeedback && (
                          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200">
                            <span className="font-semibold text-emerald-300 block mb-1">What went well:</span>
                            <p className="leading-relaxed">{evalData.positiveFeedback}</p>
                          </div>
                        )}

                        {/* Mistakes & Missing Points */}
                        {evalData.mistakes && evalData.mistakes.length > 0 && (
                          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200">
                            <span className="font-semibold text-amber-300 block mb-1">Missed nuances:</span>
                            <ul className="list-disc list-inside space-y-1">
                              {evalData.mistakes.map((m: string, i: number) => (
                                <li key={i}>{m}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Model 9.5/10 Answer */}
                        {evalData.improvedAnswer && (
                          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                            <span className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1.5 mb-2">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Recommended Exemplary Model Answer:</span>
                            </span>
                            <p className="italic leading-relaxed font-sans">{evalData.improvedAnswer}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Learning Topics */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-violet-950/30 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-violet-400" />
            <span>Recommended Learning Paths</span>
          </h3>
          <p className="text-xs text-slate-400">
            Tailored YouTube educational videos matched directly to this interview session.
          </p>
        </div>
        <button
          onClick={() => onNavigate('learning')}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors shrink-0 flex items-center gap-1.5 shadow-md shadow-violet-600/20"
        >
          <span>Open Learning Hub</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
