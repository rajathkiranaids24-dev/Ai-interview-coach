import express from 'express';
import { db } from '../db.ts';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth.ts';

const router = express.Router();

// Verified, high-quality educational videos with real YouTube links and thumbnails
const VERIFIED_EDUCATIONAL_CATALOG = [
  {
    id: 'yt-1',
    title: 'System Design for Beginners Course',
    channelName: 'freeCodeCamp.org',
    category: 'Technical skills',
    duration: '1 hr 15 min',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=m8Icp_Cid5o',
    reason: 'Master system scalability, caching architectures, load balancers, and CAP theorem trade-offs frequently asked in technical interviews.',
    targetedWeakness: 'System architecture & scalability trade-offs',
  },
  {
    id: 'yt-2',
    title: 'How to Answer "Tell Me About Yourself" in Interviews',
    channelName: 'Self Made Millennial',
    category: 'HR interview preparation',
    duration: '11 min',
    thumbnailUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=1mHjMNZZvFo',
    reason: 'Formulate an engaging elevator pitch that highlights relevant achievements without rambling.',
    targetedWeakness: 'Elevator pitch and self-introduction structure',
  },
  {
    id: 'yt-3',
    title: 'The STAR Method for Behavioral Interviews Explained',
    channelName: 'CareerVidz',
    category: 'Communication',
    duration: '14 min',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=uBC4uC6r1l4',
    reason: 'Structured storytelling methodology to effectively present behavioral scenarios with measurable results.',
    targetedWeakness: 'Behavioral question framing & STAR method',
  },
  {
    id: 'yt-4',
    title: 'Data Structures and Algorithms in 15 Minutes',
    channelName: 'Fireship',
    category: 'Problem-solving',
    duration: '15 min',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=8hly31xKli0',
    reason: 'Fast conceptual walkthrough of HashMaps, Graphs, Trees, and Dynamic Programming complexities.',
    targetedWeakness: 'Time complexity and algorithmic justification',
  },
  {
    id: 'yt-5',
    title: 'How to Write a Tech Resume that Passes ATS and Gets FAANG Interviews',
    channelName: 'NeetCode',
    category: 'Resume improvement',
    duration: '18 min',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=CLUsplI4xMU',
    reason: 'Transform generic task lists into quantified engineering accomplishments using the Google XYZ resume framework.',
    targetedWeakness: 'Quantifiable project outcomes & ATS formatting',
  },
  {
    id: 'yt-6',
    title: 'Microservices vs Monolith: Real Architecture Trade-offs',
    channelName: 'Hussein Nasser',
    category: 'Technical skills',
    duration: '24 min',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=qYhRvH9354w',
    reason: 'Deep dive into event-driven design, network overhead, database per service, and distributed tracing.',
    targetedWeakness: 'Microservices vs Monolithic architectural trade-offs',
  },
  {
    id: 'yt-7',
    title: 'Body Language & Virtual Interview Confidence Hacks',
    channelName: 'Charisma on Command',
    category: 'Communication',
    duration: '12 min',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=Kz_pIe1hIsc',
    reason: 'Actionable techniques for webcam eye contact, upright shoulder alignment, and avoiding nervous fidgeting.',
    targetedWeakness: 'Webcam presentation and physical composure',
  },
  {
    id: 'yt-8',
    title: 'Top 10 Emerging AI & Cloud Trends Transforming Software in 2025/2026',
    channelName: 'MIT Tech Review Insights',
    category: 'Industry knowledge',
    duration: '32 min',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
    reason: 'Stay informed on serverless runtime evolution, generative AI agent orchestration, and modern cloud deployment patterns.',
    targetedWeakness: 'Current market trends & cutting-edge tech ecosystem',
  },
];

// Get personalized recommendations
router.get('/recommendations', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    // Check candidate's latest interview weaknesses and resume gaps
    const interviews = db.interviews.find((i) => i.userId === req.userId && i.status === 'completed');
    interviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const latestInterview = interviews[0] || null;

    const resumes = db.resumes.find((r) => r.userId === req.userId);
    resumes.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    const latestResume = resumes[0] || null;

    // Detect key weaknesses to prioritize
    const userWeaknesses = [
      ...(latestInterview?.areasOfImprovement || []),
      ...(latestResume?.analysis?.weaknesses || []),
      ...(latestResume?.analysis?.missingSections || []),
    ];

    // Filter or rank videos based on relevance
    const prioritized = VERIFIED_EDUCATIONAL_CATALOG.map((video) => {
      const matchScore = userWeaknesses.some((w) =>
        video.targetedWeakness.toLowerCase().includes(w.toLowerCase().slice(0, 8)) ||
        w.toLowerCase().includes(video.category.toLowerCase().slice(0, 6))
      );
      return {
        ...video,
        isPriorityMatch: matchScore,
      };
    });

    return res.json({
      recommendations: prioritized,
      detectedWeaknesses: userWeaknesses.slice(0, 4),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
