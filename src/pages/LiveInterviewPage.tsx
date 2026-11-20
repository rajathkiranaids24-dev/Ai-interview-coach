import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bot,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  PhoneOff,
  Sparkles,
  Award,
  AlertCircle,
  CheckCircle2,
  Clock,
  Compass,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { PostureTracker } from '../components/PostureTracker.tsx';
import { VoiceWaveform } from '../components/VoiceWaveform.tsx';
import { InterviewSession, PostureMetricsSummary } from '../types/index.ts';
import { api } from '../services/api.ts';

interface LiveInterviewPageProps {
  session: InterviewSession;
  onInterviewComplete: (completedSession: InterviewSession) => void;
  onExit: () => void;
}

export const LiveInterviewPage: React.FC<LiveInterviewPageProps> = ({
  session,
  onInterviewComplete,
  onExit,
}) => {
  const [currentSession, setCurrentSession] = useState<InterviewSession>(session);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListeningToCandidate, setIsListeningToCandidate] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [speechSynthesisEnabled, setSpeechSynthesisEnabled] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [latestEvaluation, setLatestEvaluation] = useState<any>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [postureMetrics, setPostureMetrics] = useState<PostureMetricsSummary | null>(null);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentIndex = currentSession.currentQuestionIndex || 0;
  const currentQuestion = currentSession.questions[currentIndex] || currentSession.questions[0];

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Web Speech Synthesis (AI Speaking)
  const speakQuestion = useCallback(
    (text: string) => {
      if (!speechSynthesisEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Select natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))
      );
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = () => setIsAiSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [speechSynthesisEnabled]
  );

  // Speak when question changes
  useEffect(() => {
    if (currentQuestion && currentQuestion.questionText) {
      speakQuestion(currentQuestion.questionText);
    }
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentQuestion?.id, speakQuestion]);

  // Web Speech Recognition for candidate voice input
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentAnswer((prev) => {
          const trimmedPrev = prev.trim();
          if (!trimmedPrev) return transcript;
          // Avoid duplicate continuous appends
          return `${trimmedPrev} ${transcript}`;
        });
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition status:', e?.error);
        setIsListeningToCandidate(false);
      };

      recognition.onend = () => {
        setIsListeningToCandidate(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleMicListening = () => {
    if (!recognitionRef.current) {
      alert('Speech-to-text is not supported in this browser. Please type your response in the box below.');
      return;
    }

    if (isListeningToCandidate) {
      recognitionRef.current.stop();
      setIsListeningToCandidate(false);
    } else {
      // Pause AI speech if candidate starts talking
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsAiSpeaking(false);
      try {
        recognitionRef.current.start();
        setIsListeningToCandidate(true);
      } catch (err) {
        console.warn('Recognition start caught:', err);
      }
    }
  };

  // Submit Answer
  const handleAnswerSubmit = async () => {
    if (!currentAnswer.trim()) return;

    if (isListeningToCandidate && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListeningToCandidate(false);
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsAiSpeaking(false);

    setIsEvaluating(true);
    try {
      const res = await api.interviews.submitAnswer(currentSession._id, {
        candidateAnswer: currentAnswer,
        answerTimeSeconds: elapsedSeconds,
      });

      setLatestEvaluation(res.evaluation);
      setShowFeedbackModal(true);
      setCurrentAnswer('');

      if (res.isFinished) {
        setCurrentSession(res.interview);
      } else {
        setCurrentSession(res.interview);
      }
    } catch (err: any) {
      console.error('Failed to submit answer:', err);
      alert(err.message || 'Error evaluating answer. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // End Interview manually
  const handleEndInterview = async () => {
    if (window.confirm('Are you sure you want to end this interview session? Your progress will be saved in your report.')) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();

      try {
        const res = await api.interviews.finish(currentSession._id);
        onInterviewComplete(res.interview);
      } catch (e) {
        onExit();
      }
    }
  };

  const handleContinueNextQuestion = () => {
    setShowFeedbackModal(false);
    if (currentSession.status === 'completed') {
      onInterviewComplete(currentSession);
    }
  };

  const handlePostureUpdate = (metrics: PostureMetricsSummary) => {
    setPostureMetrics(metrics);
    api.interviews.savePosture(currentSession._id, metrics).catch(() => {});
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">{currentSession.jobRole}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium">
                {currentSession.company}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {currentSession.interviewType} • {currentSession.difficulty}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Question Counter */}
          <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            Question <span className="text-cyan-400 font-bold">{currentIndex + 1}</span> of{' '}
            <span>{currentSession.totalQuestionsCount || currentSession.questions.length}</span>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          {/* Voice Speech Toggle */}
          <button
            onClick={() => {
              if (speechSynthesisEnabled && window.speechSynthesis) window.speechSynthesis.cancel();
              setSpeechSynthesisEnabled(!speechSynthesisEnabled);
            }}
            className={`p-2 rounded-xl transition-colors ${
              speechSynthesisEnabled
                ? 'bg-slate-800 hover:bg-slate-700 text-cyan-400'
                : 'bg-slate-900 text-slate-500'
            }`}
            title={speechSynthesisEnabled ? 'Mute AI voice' : 'Enable AI voice'}
          >
            {speechSynthesisEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* End Interview */}
          <button
            onClick={handleEndInterview}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">End Interview</span>
          </button>
        </div>
      </div>

      {/* Main Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEFT SECTION: AI Interviewer */}
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 flex flex-col justify-between min-h-[440px] shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 p-[1.5px] shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Bot className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Dr. Sarah Vance</h3>
                <p className="text-[11px] text-cyan-400 font-medium">Principal Interviewer • Engineering Hiring Board</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isAiSpeaking ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'
                }`}
              />
              <span className="text-[11px] font-medium text-slate-300">
                {isAiSpeaking ? 'Speaking Question...' : isEvaluating ? 'Evaluating Answer...' : 'Listening'}
              </span>
            </div>
          </div>

          {/* Question Display Card */}
          <div className="my-6 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-inner">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block mb-2">
                Active Question • {currentQuestion?.category || 'Technical Assessment'}
              </span>
              <p className="text-base sm:text-lg text-white font-medium leading-relaxed">
                "{currentQuestion?.questionText}"
              </p>
              {currentQuestion?.contextSnippet && (
                <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic">
                  Note: {currentQuestion.contextSnippet}
                </div>
              )}
            </div>

            {/* Google Search Grounding Sources (Requirement 8) */}
            {currentQuestion?.groundingSources && currentQuestion.groundingSources.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs">
                <div className="flex items-center gap-1.5 text-cyan-400 mb-1 text-[11px] font-medium">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Real-Time Industry Context Grounding</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentQuestion.groundingSources.map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-800"
                    >
                      <span className="truncate max-w-[200px]">{src.title}</span>
                      <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Voice Waveform */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => speakQuestion(currentQuestion?.questionText || '')}
                className="text-xs text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Repeat Question</span>
              </button>
            </div>
            <VoiceWaveform isActive={isAiSpeaking} color="cyan" barCount={20} />
          </div>
        </div>

        {/* RIGHT SECTION: Candidate Webcam + Posture HUD */}
        <div className="flex flex-col justify-between">
          <PostureTracker
            onMetricsUpdate={handlePostureUpdate}
            isInterviewActive={currentSession.status === 'in_progress'}
          />

          {/* Posture HUD Summary pill */}
          {postureMetrics && (
            <div className="mt-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Posture Index:</span>
                <span className="font-mono font-bold text-emerald-400">{postureMetrics.overallPostureScore}/100</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Facing Camera: <span className="text-cyan-400 font-mono">{postureMetrics.cameraFacingPercentage}%</span> • Stability: <span className="text-emerald-400 font-mono">{postureMetrics.movementStabilityScore}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM SECTION: Candidate Live Response Input & Voice Controls */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Your Response</span>
            {isListeningToCandidate && (
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Listening to your microphone...
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400">
            Speak clearly or type your structured response below
          </span>
        </div>

        <div className="relative">
          <textarea
            rows={3}
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer here, or click 'Answer with Microphone' to speak naturally..."
            className="w-full p-4 pr-12 rounded-2xl bg-slate-900 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white text-xs placeholder:text-slate-500 font-sans leading-relaxed"
          />

          {/* Mic floating button */}
          <button
            type="button"
            onClick={toggleMicListening}
            className={`absolute right-3.5 bottom-3.5 p-2 rounded-xl transition-all shadow-md ${
              isListeningToCandidate
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400'
            }`}
            title={isListeningToCandidate ? 'Stop voice recording' : 'Start speaking'}
          >
            {isListeningToCandidate ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleMicListening}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                isListeningToCandidate
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isListeningToCandidate ? 'Pause Mic Recording' : 'Voice Input (Speech-to-Text)'}</span>
            </button>

            {currentAnswer.trim().length > 0 && (
              <span className="text-[11px] font-mono text-slate-400">
                {currentAnswer.trim().split(/\s+/).length} words
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAnswerSubmit}
            disabled={isEvaluating || !currentAnswer.trim()}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isEvaluating ? 'Evaluating with Gemini...' : 'Submit Answer'}</span>
          </button>
        </div>
      </div>

      {/* Immediate Real-Time Evaluation Feedback Modal (Requirement 10) */}
      {showFeedbackModal && latestEvaluation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Answer Evaluation</h3>
                  <p className="text-[11px] text-slate-400">Gemini Scoring Engine Feedback</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-extrabold font-mono text-cyan-400">
                  {latestEvaluation.score}<span className="text-sm text-slate-400">/10</span>
                </div>
                <div className="text-[10px] text-slate-400">Overall Question Score</div>
              </div>
            </div>

            {/* Score Grid Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Technical Accuracy</span>
                <span className="font-mono font-bold text-cyan-400">{latestEvaluation.technicalAccuracy || 8}/10</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Communication</span>
                <span className="font-mono font-bold text-cyan-400">{latestEvaluation.communication || 8}/10</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Problem Solving</span>
                <span className="font-mono font-bold text-cyan-400">{latestEvaluation.problemSolving || 8}/10</span>
              </div>
            </div>

            {/* Positive Critique */}
            {latestEvaluation.positiveFeedback && (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-300 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Strong Points</span>
                </div>
                <p className="leading-relaxed">{latestEvaluation.positiveFeedback}</p>
              </div>
            )}

            {/* Mistakes & Missing Points */}
            {latestEvaluation.mistakes && latestEvaluation.mistakes.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200">
                <div className="flex items-center gap-1.5 font-semibold text-amber-300 mb-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Areas to Refine</span>
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {latestEvaluation.mistakes.map((m: string, i: number) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Model Answer (Requirement 10) */}
            {latestEvaluation.improvedAnswer && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-cyan-400 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Exemplary 9.5/10 Model Answer</span>
                </div>
                <p className="text-slate-300 italic leading-relaxed font-sans">{latestEvaluation.improvedAnswer}</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleContinueNextQuestion}
              className="w-full py-3 rounded-xl font-semibold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
            >
              <span>{currentSession.status === 'completed' ? 'View Executive Interview Report' : 'Proceed to Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
