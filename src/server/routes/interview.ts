import express from 'express';
import { db } from '../db.ts';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth.ts';
import {
  generateInterviewQuestion,
  evaluateCandidateAnswer,
  generateFinalInterviewReport,
} from '../gemini.ts';

const router = express.Router();

// Create new interview session
router.post('/create', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      jobRole = 'Full Stack Software Engineer',
      company = 'Google',
      interviewType = 'Mixed Interview',
      difficulty = 'Intermediate',
      totalQuestions = 5,
    } = req.body;

    // Check user's latest resume for deep personalization
    const resumes = db.resumes.find((r) => r.userId === req.userId);
    resumes.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    const latestResume = resumes[0] || null;

    console.log(`Starting interview for ${jobRole} at ${company} (User ${req.userId})...`);

    // Generate Question #1
    const firstQ = await generateInterviewQuestion({
      role: jobRole,
      company,
      interviewType,
      difficulty,
      questionNumber: 1,
      totalQuestions,
      conversationHistory: [],
      resumeText: latestResume?.extractedText,
    });

    const initialQuestionItem = {
      id: 'q-1',
      order: 1,
      questionText: firstQ.questionText,
      category: firstQ.category || 'introduction',
      contextSnippet: firstQ.contextSnippet || '',
      groundingSources: firstQ.groundingSources || [],
    };

    const newInterview = db.interviews.create({
      userId: req.userId,
      jobRole,
      company,
      interviewType,
      difficulty,
      status: 'in_progress',
      currentQuestionIndex: 0,
      totalQuestionsCount: totalQuestions,
      questions: [initialQuestionItem],
      durationSeconds: 0,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({
      interview: newInterview,
      currentQuestion: initialQuestionItem,
    });
  } catch (err: any) {
    console.error('Error creating interview session:', err);
    return res.status(500).json({ error: err.message || 'Failed to initialize AI interview' });
  }
});

// Get session details
router.get('/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const session = db.interviews.findById(req.params.id);
    if (!session || session.userId !== req.userId) {
      return res.status(404).json({ error: 'Interview session not found' });
    }
    return res.json({ interview: session });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Update posture metrics from live camera canvas
router.post('/:id/posture', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const session = db.interviews.findById(req.params.id);
    if (!session || session.userId !== req.userId) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    const { postureMetrics } = req.body;
    db.interviews.updateOne(req.params.id, { postureMetrics });
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Submit candidate answer & evaluate & get next question
router.post('/:id/answer', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const session = db.interviews.findById(req.params.id);
    if (!session || session.userId !== req.userId) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    const { candidateAnswer, answerTimeSeconds = 30 } = req.body;
    if (!candidateAnswer || candidateAnswer.trim().length === 0) {
      return res.status(400).json({ error: 'Answer content cannot be empty' });
    }

    const currentIndex = session.currentQuestionIndex || 0;
    const currentQ = session.questions[currentIndex];
    if (!currentQ) {
      return res.status(400).json({ error: 'No active question found to answer' });
    }

    console.log(`Evaluating answer for Q#${currentIndex + 1}...`);

    // 1. Evaluate this answer with Gemini
    const evaluation = await evaluateCandidateAnswer({
      question: currentQ.questionText,
      answer: candidateAnswer,
      role: session.jobRole,
      interviewType: session.interviewType,
      category: currentQ.category || 'technical',
    });

    currentQ.candidateAnswer = candidateAnswer;
    currentQ.answerTimeSeconds = answerTimeSeconds;
    currentQ.evaluation = evaluation;

    const totalQuestions = session.totalQuestionsCount || 5;
    const nextQuestionNumber = currentIndex + 2;

    // Check if this was the last question
    if (nextQuestionNumber > totalQuestions) {
      // Interview complete! Generate final comprehensive report
      console.log('Final question completed. Synthesizing executive report with Gemini...');
      const postureScore = session.postureMetrics?.overallPostureScore || 85;
      const report = await generateFinalInterviewReport({
        role: session.jobRole,
        company: session.company,
        evaluations: session.questions,
        postureScore,
      });

      const updated = db.interviews.updateOne(session._id, {
        questions: session.questions,
        status: 'completed',
        completedAt: new Date().toISOString(),
        overallScore: report.overallScore,
        categoryScores: report.categoryScores,
        strengths: report.strengths,
        areasOfImprovement: report.areasOfImprovement,
        recommendedSkills: report.recommendedSkills,
        readinessLevel: report.readinessLevel,
        summary: report.summary,
      });

      return res.json({
        isFinished: true,
        evaluation,
        interview: updated,
      });
    }

    // 2. Prepare conversation history for contextual follow-up
    const conversationHistory: Array<{ role: 'interviewer' | 'candidate'; text: string; score?: number }> = [];
    for (const q of session.questions) {
      conversationHistory.push({ role: 'interviewer', text: q.questionText });
      if (q.candidateAnswer) {
        conversationHistory.push({ role: 'candidate', text: q.candidateAnswer, score: q.evaluation?.score });
      }
    }

    // Lookup resume for background references
    const resumes = db.resumes.find((r) => r.userId === req.userId);
    resumes.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    const latestResume = resumes[0] || null;

    // 3. Generate Next Question
    const nextQData = await generateInterviewQuestion({
      role: session.jobRole,
      company: session.company,
      interviewType: session.interviewType,
      difficulty: session.difficulty,
      questionNumber: nextQuestionNumber,
      totalQuestions,
      conversationHistory,
      resumeText: latestResume?.extractedText,
    });

    const nextQuestionItem = {
      id: `q-${nextQuestionNumber}`,
      order: nextQuestionNumber,
      questionText: nextQData.questionText,
      category: nextQData.category || 'technical',
      contextSnippet: nextQData.contextSnippet || '',
      groundingSources: nextQData.groundingSources || [],
    };

    session.questions.push(nextQuestionItem);
    const updated = db.interviews.updateOne(session._id, {
      questions: session.questions,
      currentQuestionIndex: currentIndex + 1,
    });

    return res.json({
      isFinished: false,
      evaluation,
      interview: updated,
      nextQuestion: nextQuestionItem,
    });
  } catch (err: any) {
    console.error('Error submitting answer:', err);
    return res.status(500).json({ error: err.message || 'Failed to evaluate answer' });
  }
});

// Explicitly End interview early and generate report
router.post('/:id/finish', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const session = db.interviews.findById(req.params.id);
    if (!session || session.userId !== req.userId) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    const answeredQuestions = session.questions.filter((q: any) => q.candidateAnswer);
    const postureScore = session.postureMetrics?.overallPostureScore || 85;

    const report = await generateFinalInterviewReport({
      role: session.jobRole,
      company: session.company,
      evaluations: answeredQuestions.length > 0 ? answeredQuestions : session.questions,
      postureScore,
    });

    const updated = db.interviews.updateOne(session._id, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      overallScore: report.overallScore,
      categoryScores: report.categoryScores,
      strengths: report.strengths,
      areasOfImprovement: report.areasOfImprovement,
      recommendedSkills: report.recommendedSkills,
      readinessLevel: report.readinessLevel,
      summary: report.summary,
    });

    return res.json({ interview: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Get user's interview history
router.get('/history/user', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const sessions = db.interviews.find((i) => i.userId === req.userId);
    sessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json({ interviews: sessions });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
