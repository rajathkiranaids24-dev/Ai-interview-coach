export interface User {
  _id: string;
  name: string;
  email: string;
  college?: string;
  degree?: string;
  branch?: string;
  graduationYear?: string;
  roleInterest?: string;
  targetCompanies?: string[];
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ResumeAnalysis {
  candidateName: string;
  contactInfo: {
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
  };
  overallScore: number;
  atsScore: number;
  education: Array<{
    institution: string;
    degree: string;
    year?: string;
    grade?: string;
  }>;
  technicalSkills: string[];
  softSkills: string[];
  projects: Array<{
    title: string;
    techStack: string[];
    description: string;
  }>;
  experience: Array<{
    role: string;
    company: string;
    duration: string;
    highlights: string[];
  }>;
  certifications: string[];
  strengths: string[];
  weaknesses: string[];
  missingSections: string[];
  suggestions: string[];
  recommendedRoles: string[];
  potentialInterviewQuestions: string[];
}

export interface ResumeDocument {
  _id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  extractedText: string;
  analysis: ResumeAnalysis;
  uploadedAt: string;
}

export interface CareerPreferences {
  jobRole: string;
  industry: string;
  technicalDomains: string[];
  programmingLanguages: string[];
  experienceLevel: 'Entry-Level / Student' | 'Junior (1-2 yrs)' | 'Mid-Level (3-5 yrs)' | 'Senior (5+ yrs)';
  targetCompanies: string[];
  interviewType: 'HR Interview' | 'Technical Interview' | 'Managerial Interview' | 'Behavioral Interview' | 'Company-Specific Interview' | 'Mixed Interview';
  difficulty: 'Beginner' | 'Intermediate' | 'Hard' | 'Faang / Expert';
  durationMinutes: number;
}

export interface AnswerEvaluation {
  score: number; // 0 - 10
  relevance: number;
  technicalAccuracy: number;
  clarity: number;
  communication: number;
  logicalThinking: number;
  problemSolving: number;
  positiveFeedback: string;
  mistakes: string[];
  missingPoints: string[];
  betterApproach: string;
  improvedAnswer: string;
  starAssessment?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
}

export interface InterviewQuestionItem {
  id: string;
  order: number;
  questionText: string;
  category: 'introduction' | 'technical' | 'project' | 'behavioral' | 'scenario' | 'company_specific' | 'follow_up' | 'conclusion';
  contextSnippet?: string;
  groundingSources?: Array<{ title: string; url: string }>;
  candidateAnswer?: string;
  answerTimeSeconds?: number;
  evaluation?: AnswerEvaluation;
}

export interface PostureMetricsSummary {
  overallPostureScore: number;
  goodPosturePercentage: number;
  averageHeadTilt: number;
  shoulderAlignmentScore: number;
  cameraFacingPercentage: number;
  movementStabilityScore: number;
  observations: string[];
  tips: string[];
}

export interface InterviewSession {
  _id: string;
  userId: string;
  jobRole: string;
  company: string;
  interviewType: string;
  difficulty: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  currentQuestionIndex: number;
  totalQuestionsCount?: number;
  questions: InterviewQuestionItem[];
  postureMetrics?: PostureMetricsSummary;
  overallScore?: number;
  categoryScores?: {
    technicalKnowledge: number;
    communicationSkills: number;
    problemSolving: number;
    answerRelevance: number;
    logicalThinking: number;
    resumeKnowledge: number;
    posturePresentation: number;
  };
  strengths?: string[];
  areasOfImprovement?: string[];
  recommendedSkills?: string[];
  readinessLevel?: 'Ready for Placement' | 'Good Progress - Fine Tuning Needed' | 'Requires More Preparation';
  summary?: string;
  durationSeconds: number;
  createdAt: string;
  completedAt?: string;
}

export interface PracticeQuestion {
  id: string;
  type: 'mcq' | 'descriptive';
  question: string;
  options?: string[];
  correctAnswer?: string; // option letter or full string
  explanation: string;
  topic: string;
  difficulty: string;
  userAnswer?: string;
  score?: number;
  feedback?: string;
}

export interface PracticeTest {
  _id: string;
  userId: string;
  title: string;
  category: string;
  difficulty: string;
  questions: PracticeQuestion[];
  score: number;
  totalQuestions: number;
  correctCount: number;
  timeSpentSeconds: number;
  completedAt: string;
}

export interface YouTubeRecommendation {
  id: string;
  title: string;
  channelName: string;
  category: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  reason: string;
  targetedWeakness: string;
}
