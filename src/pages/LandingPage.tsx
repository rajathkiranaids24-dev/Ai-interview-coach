import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Bot,
  Video,
  FileCheck,
  Award,
  Zap,
  ShieldCheck,
  TrendingUp,
  GraduationCap,
  Users,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { user, demoLogin } = useAuth();

  return (
    <div className="relative overflow-hidden">
      {/* Background Glow Elements */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-violet-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-96 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[800px] -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs font-medium text-cyan-300 mb-8 backdrop-blur-md shadow-lg shadow-cyan-500/10">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next-Generation AI Smart Interview Simulation</span>
          <span className="w-1 h-1 rounded-full bg-cyan-400" />
          <span className="text-slate-400">Gemini 3.8 Flash Powered</span>
        </div>

        {/* Hero Headings */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1] mb-6">
          Your Next Interview.{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 bg-clip-text text-transparent">
            Powered by Intelligence.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
          Practice smarter. Speak confidently. Get interview-ready with your personal AI interviewer.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          {user ? (
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Go to Candidate Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={() => onNavigate('register')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={async () => {
                  await demoLogin();
                  onNavigate('dashboard');
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Instant Demo Login</span>
              </button>
            </>
          )}
        </div>

        {/* Interactive Live Interview Room Preview Mockup */}
        <div className="relative max-w-5xl mx-auto rounded-3xl border border-slate-800 bg-slate-950/70 p-3 sm:p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 text-xs px-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-slate-400">interviewiq.ai/session/live-simulation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-medium">Simulation Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-left">
            {/* AI Interviewer Preview */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-5 flex flex-col justify-between min-h-[260px] relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Dr. Sarah Vance</h4>
                    <p className="text-[11px] text-cyan-400 font-medium">Principal Interviewer • Cloud & Systems</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Question 2 of 5
                </span>
              </div>

              <div className="my-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <p className="text-xs text-slate-300 leading-relaxed italic font-sans">
                  "Walk me through your distributed task queue project. How did you handle dead-letter queue retries and ensure message idempotency when processing high concurrency?"
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
                <div className="flex items-center gap-2 text-cyan-400 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>AI Voice Active</span>
                </div>
                <div className="flex gap-1">
                  {[4, 12, 18, 10, 24, 14, 8, 20, 6].map((h, i) => (
                    <div key={i} className="w-1 bg-cyan-400 rounded-full" style={{ height: `${h}px` }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Candidate Webcam HUD Preview */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-5 flex flex-col justify-between min-h-[260px] relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-white">Candidate Preview & Posture HUD</span>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Good Posture (94%)</span>
                </div>
              </div>

              <div className="my-4 rounded-xl border border-dashed border-emerald-500/30 bg-slate-950/40 p-4 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-28 rounded-full border border-cyan-500/40 flex items-center justify-center mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-300 font-medium">Head Centered • Shoulders Aligned • Steady Eye Contact</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                <span>Mic: Listening</span>
                <span className="text-cyan-400 font-mono">01:42 / 15:00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-2">Full-Spectrum Interview Preparation</h2>
          <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Everything you need to crack dream placements.</p>
          <p className="text-slate-400 text-sm mt-3">From ATS resume optimization to dynamic real-time speech and posture tracking.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Bot,
              title: 'Adaptive AI Interviewer',
              desc: 'Speaks with natural voice synthesis, asks contextual follow-ups, and dynamically adjusts difficulty based on your depth.',
              color: 'text-cyan-400',
              border: 'border-cyan-500/30',
            },
            {
              icon: Video,
              title: 'Webcam Posture & Presentation',
              desc: 'Local browser frame analytics detect head tilt, shoulder alignment, eye contact, and nervous fidgeting with zero video storage.',
              color: 'text-emerald-400',
              border: 'border-emerald-500/30',
            },
            {
              icon: FileCheck,
              title: 'Deep Gemini ATS Resume Scorer',
              desc: 'Extracts skills, flags missing project metrics, scores ATS compatibility out of 100, and tailor-makes mock questions.',
              color: 'text-blue-400',
              border: 'border-blue-500/30',
            },
            {
              icon: Award,
              title: 'STAR Answer Evaluation Engine',
              desc: 'Instantly breaks down answers into Situation, Task, Action, and Result with constructive flaws, omissions, and 10/10 model answers.',
              color: 'text-violet-400',
              border: 'border-violet-500/30',
            },
            {
              icon: Zap,
              title: 'Curated Practice Arena',
              desc: 'Test your knowledge across Technical, HR, Aptitude, Coding Concepts, and Domain questions with instant AI descriptive grading.',
              color: 'text-amber-400',
              border: 'border-amber-500/30',
            },
            {
              icon: GraduationCap,
              title: 'Targeted YouTube Learning Hub',
              desc: 'Direct YouTube recommendations from freeCodeCamp, MIT, and NeetCode mapped directly to the flaws identified in your interview.',
              color: 'text-rose-400',
              border: 'border-rose-500/30',
            },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:bg-slate-900/70 group"
              >
                <div className={`w-10 h-10 rounded-xl bg-slate-800/80 border ${f.border} flex items-center justify-center mb-4 ${f.color}`}>
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Structured Path to Placement</span>
          <h2 className="text-3xl font-bold text-white tracking-tight mt-1">How InterviewIQ Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Upload Resume',
              desc: 'Upload PDF or DOCX to unlock ATS scoring, technical skill tags, and personalized probe questions.',
            },
            {
              step: '02',
              title: 'Configure Target',
              desc: 'Pick your role (e.g. SDE, Frontend, Data Science), company (Google, Microsoft, Stripe), and difficulty.',
            },
            {
              step: '03',
              title: 'Live Simulated Interview',
              desc: 'Engage with voice and webcam. Answer questions aloud or typed with real-time posture guidance.',
            },
            {
              step: '04',
              title: 'Executive Report',
              desc: 'Receive deep scorecards (/100), STAR critiques, strengths, weaknesses, and YouTube learning paths.',
            },
          ].map((s, idx) => (
            <div key={idx} className="relative p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-3xl font-extrabold font-mono text-cyan-500/20 block mb-3">{s.step}</span>
              <h3 className="text-base font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics Section (Clearly labeled illustrative figures) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center mb-8">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
            * Benchmark Metrics (Illustrative Simulation Data)
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { stat: '94.2%', label: 'Average Confidence Gain', sub: 'Across mock simulation cohorts' },
            { stat: '100+', label: 'Engineering Domains', sub: 'From Systems to AI and HR' },
            { stat: '< 300ms', label: 'Local Posture Frame Latency', sub: 'In-browser zero-lag tracking' },
            { stat: 'STAR', label: 'Evaluation Methodology', sub: 'Situation, Task, Action, Result' },
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/60 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono mb-1">{item.stat}</div>
              <div className="text-xs font-semibold text-white mb-1">{item.label}</div>
              <div className="text-[11px] text-slate-400">{item.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials (Sample illustrative content) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
            Student & Graduate Feedback (Sample Content)
          </span>
          <h3 className="text-2xl font-bold text-white">What Candidates Say</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: 'The posture tracker alerted me whenever I slouched or looked away from the camera. The STAR critique on my system design answers was spot-on.',
              author: 'Priya Sharma',
              role: 'B.Tech CS Student',
              campus: 'NIT Surathkal',
            },
            {
              quote: 'Getting dynamic follow-up questions instead of static repetitive quizzes felt exactly like my actual Amazon round. My interview readiness score shot up from 62 to 88.',
              author: 'Marcus Vance',
              role: 'Recent Graduate',
              campus: 'San Jose State University',
            },
            {
              quote: 'The resume ATS analyzer pinpointed that my projects lacked metrics. Once I added quantified impact and practiced with InterviewIQ, I aced my placements.',
              author: 'Ananya Roy',
              role: 'Software Engineer Associate',
              campus: 'BITS Pilani',
            },
          ].map((t, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
              <p className="text-xs text-slate-300 leading-relaxed italic mb-4">"{t.quote}"</p>
              <div>
                <p className="text-xs font-semibold text-white">{t.author}</p>
                <p className="text-[11px] text-cyan-400">{t.role} • {t.campus}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800/80 text-xs text-slate-400 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">INTERVIEW<span className="text-cyan-400">IQ</span></span>
            <span>– AI-Powered Smart Interview System</span>
          </div>
          <p className="text-[11px] text-slate-400">Academic Mini-Project • Full-Stack Web Application • Built with React, Node.js & Gemini</p>
        </div>
      </footer>
    </div>
  );
};
