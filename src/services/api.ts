import {
  AuthResponse,
  User,
  ResumeDocument,
  InterviewSession,
  PracticeTest,
  YouTubeRecommendation,
} from '../types/index.ts';

const TOKEN_KEY = 'interviewiq_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP error ${response.status}: ${response.statusText}`);
  }

  return data as T;
}

export const api = {
  auth: {
    register: (payload: {
      name: string;
      email: string;
      password: string;
      college?: string;
      degree?: string;
      branch?: string;
      graduationYear?: string;
    }) => request<AuthResponse>('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),

    login: (credentials: { email: string; password: string }) =>
      request<AuthResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),

    forgotPassword: (email: string) =>
      request<{ message: string; success: boolean }>('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),

    me: () => request<{ user: User }>('/api/auth/me'),

    updateProfile: (updates: Partial<User>) =>
      request<{ user: User; message: string }>('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),
  },

  resumes: {
    upload: (formData: FormData) =>
      request<{ message: string; resume: ResumeDocument }>('/api/resumes/upload', {
        method: 'POST',
        body: formData,
      }),

    analyzeText: (resumeText: string, fileName?: string) =>
      request<{ message: string; resume: ResumeDocument }>('/api/resumes/upload', {
        method: 'POST',
        body: JSON.stringify({ resumeText, fileName }),
      }),

    getLatest: () => request<{ resume: ResumeDocument | null }>('/api/resumes/latest'),

    getHistory: () => request<{ resumes: ResumeDocument[] }>('/api/resumes/history'),

    delete: (id: string) => request<{ success: boolean; message: string }>(`/api/resumes/${id}`, { method: 'DELETE' }),
  },

  interviews: {
    create: (payload: {
      jobRole: string;
      company: string;
      interviewType: string;
      difficulty: string;
      totalQuestions?: number;
    }) =>
      request<{ interview: InterviewSession; currentQuestion: any }>('/api/interviews/create', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    get: (id: string) => request<{ interview: InterviewSession }>(`/api/interviews/${id}`),

    submitAnswer: (id: string, payload: { candidateAnswer: string; answerTimeSeconds: number }) =>
      request<{
        isFinished: boolean;
        evaluation: any;
        interview: InterviewSession;
        nextQuestion?: any;
      }>(`/api/interviews/${id}/answer`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    savePosture: (id: string, postureMetrics: any) =>
      request<{ success: boolean }>(`/api/interviews/${id}/posture`, {
        method: 'POST',
        body: JSON.stringify({ postureMetrics }),
      }),

    finish: (id: string) =>
      request<{ interview: InterviewSession }>(`/api/interviews/${id}/finish`, {
        method: 'POST',
      }),

    getHistory: () => request<{ interviews: InterviewSession[] }>('/api/interviews/history/user'),
  },

  tests: {
    generate: (payload: { category: string; difficulty: string; questionCount: number }) =>
      request<{ test: { category: string; difficulty: string; questions: any[] } }>('/api/tests/generate', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    evaluateDescriptive: (payload: { question: string; userAnswer: string; topic: string; difficulty: string }) =>
      request<{ evaluation: any }>('/api/tests/evaluate-descriptive', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    submit: (payload: any) =>
      request<{ test: PracticeTest }>('/api/tests/submit', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    getHistory: () => request<{ tests: PracticeTest[] }>('/api/tests/history'),
  },

  learning: {
    getRecommendations: () =>
      request<{ recommendations: YouTubeRecommendation[]; detectedWeaknesses: string[] }>('/api/learning/recommendations'),
  },

  analytics: {
    getOverview: () => request<any>('/api/analytics/overview'),
  },
};
