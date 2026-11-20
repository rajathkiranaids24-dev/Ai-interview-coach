import express from 'express';
import { db } from '../db.ts';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth.ts';
import { generatePracticeTestQuestions, evaluateDescriptiveAnswer } from '../gemini.ts';

const router = express.Router();

// Generate a practice test
router.post('/generate', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      category = 'Technical Interview',
      difficulty = 'Intermediate',
      questionCount = 5,
    } = req.body;

    const questions = await generatePracticeTestQuestions({
      category,
      difficulty,
      count: Number(questionCount) || 5,
    });

    return res.json({
      test: {
        category,
        difficulty,
        questions,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to generate practice test' });
  }
});

// Evaluate a single descriptive answer in a test
router.post('/evaluate-descriptive', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { question, userAnswer, topic = 'Computer Science', difficulty = 'Intermediate' } = req.body;
    if (!userAnswer || userAnswer.trim().length === 0) {
      return res.status(400).json({ error: 'Answer cannot be empty' });
    }

    const evaluation = await evaluateDescriptiveAnswer({
      question,
      userAnswer,
      topic,
      difficulty,
    });

    return res.json({ evaluation });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Submit completed practice test
router.post('/submit', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      title,
      category,
      difficulty,
      questions,
      score,
      totalQuestions,
      correctCount,
      timeSpentSeconds,
    } = req.body;

    const savedTest = db.practiceTests.create({
      userId: req.userId,
      title: title || `${category} Assessment`,
      category,
      difficulty,
      questions,
      score: Number(score) || 0,
      totalQuestions: Number(totalQuestions) || questions.length,
      correctCount: Number(correctCount) || 0,
      timeSpentSeconds: Number(timeSpentSeconds) || 60,
    });

    return res.status(201).json({ test: savedTest });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Get practice tests history
router.get('/history', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const tests = db.practiceTests.find((t) => t.userId === req.userId);
    tests.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    return res.json({ tests });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
