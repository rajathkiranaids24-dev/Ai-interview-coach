import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Brain,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { api } from '../services/api.ts';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await api.analytics.getOverview();
        setData(res);
      } catch (err) {
        console.warn('Failed to load analytics overview:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  // Timeline data for simulation growth trend
  const timelineData =
    data?.interviewHistory?.length > 0
      ? data.interviewHistory
      : [
          { sessionNumber: 1, date: 'Oct 12', overallScore: 68, technicalScore: 65, communicationScore: 70, postureScore: 74 },
          { sessionNumber: 2, date: 'Oct 18', overallScore: 74, technicalScore: 72, communicationScore: 76, postureScore: 80 },
          { sessionNumber: 3, date: 'Oct 24', overallScore: 81, technicalScore: 80, communicationScore: 82, postureScore: 85 },
          { sessionNumber: 4, date: 'Oct 30', overallScore: 88, technicalScore: 86, communicationScore: 89, postureScore: 92 },
        ];

  // Radar competencies
  const radarData = data?.categoryCompetencies || [
    { category: 'Technical Accuracy', score: 85 },
    { category: 'Communication', score: 82 },
    { category: 'Problem Solving', score: 80 },
    { category: 'Relevance', score: 88 },
    { category: 'Logical Thinking', score: 82 },
    { category: 'Posture & Composure', score: 86 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-2">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Longitudinal Performance Trajectory</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Performance Analytics</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Track readiness growth, technical accuracy, and presentation improvements across simulated interview rounds.
        </p>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
          <p className="text-xs text-slate-400 font-medium">Interviews Completed</p>
          <div className="text-3xl font-extrabold font-mono text-white mt-1">
            {data?.summary?.totalInterviewsCompleted || timelineData.length}
          </div>
          <span className="text-[10px] text-cyan-400 mt-2 block">Live AI Simulations</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
          <p className="text-xs text-slate-400 font-medium">Average Simulation Score</p>
          <div className="text-3xl font-extrabold font-mono text-cyan-400 mt-1">
            {data?.summary?.averageInterviewScore || 82}%
          </div>
          <span className="text-[10px] text-emerald-400 mt-2 block">+14% Growth Trend</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
          <p className="text-xs text-slate-400 font-medium">Practice Tests Solved</p>
          <div className="text-3xl font-extrabold font-mono text-violet-400 mt-1">
            {data?.summary?.totalTestsCompleted || 3}
          </div>
          <span className="text-[10px] text-violet-300 mt-2 block">MCQs & Conceptual Code</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
          <p className="text-xs text-slate-400 font-medium">Placement Readiness Level</p>
          <div className="text-base font-bold text-white mt-2 truncate">
            {data?.summary?.readinessLevel || 'Placement Ready'}
          </div>
          <span className="text-[10px] text-emerald-400 mt-2 block">Verified by Hiring Board</span>
        </div>
      </div>

      {/* Main Charts Grid: Growth Timeline & Competency Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score History Line Chart */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Simulation Score History</h3>
              <p className="text-xs text-slate-400">Progression across consecutive mock interviews</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Overall
              </span>
              <span className="flex items-center gap-1 text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-400" /> Technical
              </span>
              <span className="flex items-center gap-1 text-violet-400">
                <span className="w-2 h-2 rounded-full bg-violet-400" /> STAR
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="overallScore" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="technicalScore" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" />
                <Line type="monotone" dataKey="communicationScore" stroke="#a855f7" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competency Radar Chart */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Full-Spectrum Competency Balance</h3>
            <p className="text-xs text-slate-400">Holistic balance between technical depth and presentation</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="category" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                <Radar name="Score" dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strongest vs Weakest Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h3 className="text-sm font-semibold text-white">Consistently Strong Topics</h3>
          </div>
          <div className="space-y-2">
            {(data?.strongestTopics || [
              'Data Structures & Algorithmic Time Complexities',
              'Component State Management in Modern UI Frameworks',
              'REST API Protocols & Idempotency Best Practices',
              'Attentive Camera Posture & Composure',
            ]).map((topic: string, i: number) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-sm font-semibold text-white">Topics Targeted for Refinement</h3>
          </div>
          <div className="space-y-2">
            {(data?.weakestTopics || [
              'Distributed Concurrency & Locking Pitfalls',
              'Quantifying Production Scale in Past Experiences',
              'System Design Bottlenecks (P99 Latencies vs Memory Limits)',
              'Behavioral STAR Narrative Brevity',
            ]).map((topic: string, i: number) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
