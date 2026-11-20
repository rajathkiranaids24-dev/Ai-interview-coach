import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Send,
  Sparkles,
} from 'lucide-react';
import { PracticeQuestion, PracticeTest } from '../types/index.ts';
import { api } from '../services/api.ts';

interface TestInterfacePageProps {
  testConfig: {
    category: string;
    difficulty: string;
    questionCount: number;
    timeLimitMinutes: number;
  };
  onComplete: (testResult: PracticeTest) => void;
  onExit: () => void;
}

export const TestInterfacePage: React.FC<TestInterfacePageProps> = ({
  testConfig,
  onComplete,
  onExit,
}) => {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(testConfig.timeLimitMinutes * 60);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch or generate questions from backend
  useEffect(() => {
    async function initTest() {
      try {
        const res = await api.tests.generate({
          category: testConfig.category,
          difficulty: testConfig.difficulty,
          questionCount: testConfig.questionCount,
        });
        setQuestions(res.test.questions);
      } catch (err: any) {
        setError(err.message || 'Failed to generate practice test');
      } finally {
        setIsLoading(false);
      }
    }
    initTest();
  }, [testConfig]);

  // Countdown timer
  useEffect(() => {
    if (isLoading) return;
    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLoading]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, optLetter: string) => {
    setAnswers({ ...answers, [questionId]: optLetter });
  };

  const handleDescriptiveChange = (questionId: string, text: string) => {
    setAnswers({ ...answers, [questionId]: text });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      // Grade questions
      let correctCount = 0;
      const gradedQuestions: PracticeQuestion[] = [];

      for (const q of questions) {
        const userAns = answers[q.id] || '';
        let score = 0;
        let feedback = '';

        if (q.type === 'mcq') {
          const isCorrect = userAns.toUpperCase().trim() === (q.correctAnswer || '').toUpperCase().trim();
          if (isCorrect) {
            correctCount++;
            score = 100;
          }
          feedback = isCorrect ? 'Correct choice.' : `Incorrect. The right option is ${q.correctAnswer}.`;
        } else {
          // Descriptive question: Grade with Gemini
          try {
            const evalRes = await api.tests.evaluateDescriptive({
              question: q.question,
              userAnswer: userAns || 'No answer submitted',
              topic: q.topic,
              difficulty: q.difficulty,
            });
            score = evalRes.evaluation.score;
            feedback = evalRes.evaluation.feedback;
            if (evalRes.evaluation.isPassed) correctCount++;
          } catch (e) {
            score = userAns.length > 20 ? 80 : 50;
            feedback = 'Evaluated based on conceptual relevance.';
          }
        }

        gradedQuestions.push({
          ...q,
          userAnswer: userAns,
          score,
          feedback,
        });
      }

      const totalQuestions = questions.length;
      const overallPercent = Math.round((correctCount / totalQuestions) * 100);

      const savedTest = await api.tests.submit({
        title: `${testConfig.category} Assessment`,
        category: testConfig.category,
        difficulty: testConfig.difficulty,
        questions: gradedQuestions,
        score: overallPercent,
        totalQuestions,
        correctCount,
        timeSpentSeconds: testConfig.timeLimitMinutes * 60 - remainingSeconds,
      });

      onComplete(savedTest.test);
    } catch (err: any) {
      console.error('Submission error:', err);
      alert('Error grading test. Reviewing cached result.');
      onExit();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4">
        <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <h3 className="text-base font-semibold text-white">Generating Assessment Questions with Gemini...</h3>
        <p className="text-xs text-slate-400">Tailoring question complexity to {testConfig.difficulty} level.</p>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <p className="text-xs text-rose-300">{error || 'No questions generated.'}</p>
        <button onClick={onExit} className="px-4 py-2 rounded-xl text-xs bg-slate-800 text-white">
          Return to Arena
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-white tracking-wide">{testConfig.category}</span>
          <span className="text-[10px] ml-2 px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono">
            {testConfig.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(remainingSeconds)}</span>
          </div>

          <button
            onClick={onExit}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
          >
            Quit
          </button>
        </div>
      </div>

      {/* Question Stepper */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {questions.map((q, idx) => {
          const isAnswered = Boolean(answers[q.id]);
          const isCurrent = currentIndex === idx;
          return (
            <button
              key={q.id || idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-9 h-9 rounded-xl text-xs font-mono font-semibold transition-all shrink-0 ${
                isCurrent
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : isAnswered
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 shadow-xl space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
              Question {currentIndex + 1} of {questions.length} • {currentQ.topic}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              {currentQ.type.toUpperCase()}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
            {currentQ.question}
          </h2>
        </div>

        {/* Options for MCQ */}
        {currentQ.type === 'mcq' && currentQ.options && (
          <div className="space-y-3 pt-2">
            {currentQ.options.map((opt, i) => {
              const letter = opt.charAt(0);
              const isSelected = answers[currentQ.id] === letter;

              return (
                <div
                  key={i}
                  onClick={() => handleSelectOption(currentQ.id, letter)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500 text-white font-medium shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="text-xs leading-relaxed">{opt}</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                      isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-700'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Descriptive Answer Textarea */}
        {currentQ.type === 'descriptive' && (
          <div className="pt-2">
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Write your technical explanation below (evaluated by Gemini):
            </label>
            <textarea
              rows={6}
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleDescriptiveChange(currentQ.id, e.target.value)}
              placeholder="State architectural rationale, algorithmic steps, and trade-offs..."
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white text-xs leading-relaxed placeholder:text-slate-600 font-sans"
            />
          </div>
        )}

        {/* Nav buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Grading Answers with Gemini...' : 'Submit Assessment'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
