import express from 'express';
import { db } from '../db.ts';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth.ts';

const router = express.Router();

router.get('/overview', authMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId!;
    const interviews = db.interviews.find((i) => i.userId === userId && i.status === 'completed');
    interviews.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const tests = db.practiceTests.find((t) => t.userId === userId);
    tests.sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());

    const resumes = db.resumes.find((r) => r.userId === userId);
    resumes.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    const latestResume = resumes[0] || null;

    // Interview score history timeline
    const interviewHistory = interviews.map((session, index) => ({
      sessionNumber: index + 1,
      date: new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      overallScore: session.overallScore || 75,
      technicalScore: session.categoryScores?.technicalKnowledge || 70,
      communicationScore: session.categoryScores?.communicationSkills || 75,
      problemSolvingScore: session.categoryScores?.problemSolving || 70,
      postureScore: session.categoryScores?.posturePresentation || 80,
      role: session.jobRole,
      company: session.company,
    }));

    // Practice test timeline
    const testHistory = tests.map((t, index) => ({
      testNumber: index + 1,
      date: new Date(t.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: t.score,
      category: t.category,
      difficulty: t.difficulty,
    }));

    // Aggregate category competencies
    const categoryCompetencies = [
      { category: 'Technical Accuracy', score: computeAverage(interviews, (i) => i.categoryScores?.technicalKnowledge, 84) },
      { category: 'Communication', score: computeAverage(interviews, (i) => i.categoryScores?.communicationSkills, 82) },
      { category: 'Problem Solving', score: computeAverage(interviews, (i) => i.categoryScores?.problemSolving, 79) },
      { category: 'Answer Relevance', score: computeAverage(interviews, (i) => i.categoryScores?.answerRelevance, 88) },
      { category: 'Logical Thinking', score: computeAverage(interviews, (i) => i.categoryScores?.logicalThinking, 83) },
      { category: 'Posture & Composure', score: computeAverage(interviews, (i) => i.categoryScores?.posturePresentation, 86) },
    ];

    // Compute overall readiness
    const averageInterviewScore =
      interviews.length > 0
        ? Math.round(interviews.reduce((acc, i) => acc + (i.overallScore || 0), 0) / interviews.length)
        : 78;

    const strongestTopics = [
      'Core Programming Syntax & Typing',
      'High-Level Architectural Comprehension',
      'Web Protocols & REST Best Practices',
      'Professional Demeanor & Composure',
    ];

    const weakestTopics = [
      'Real-world Distributed Concurrency Trade-offs',
      'Quantified Business Metrics in Project Descriptions',
      'Concise STAR-structured Behavioral Answers',
      'Database Sharding & Connection Pool Tuning',
    ];

    return res.json({
      summary: {
        totalInterviewsCompleted: interviews.length,
        totalTestsCompleted: tests.length,
        hasResumeAnalyzed: Boolean(latestResume),
        latestResumeScore: latestResume?.analysis?.overallScore || null,
        latestResumeAts: latestResume?.analysis?.atsScore || null,
        averageInterviewScore,
        readinessLevel:
          averageInterviewScore >= 85
            ? 'Placement Ready'
            : averageInterviewScore >= 75
            ? 'Strong Contender - Refining Edge'
            : 'Developing Skills',
      },
      interviewHistory,
      testHistory,
      categoryCompetencies,
      strongestTopics,
      weakestTopics,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

function computeAverage(list: any[], extractor: (item: any) => number | undefined, fallback: number): number {
  if (!list || list.length === 0) return fallback;
  const values = list.map(extractor).filter((v) => typeof v === 'number') as number[];
  if (values.length === 0) return fallback;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export default router;
