/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { ResumeUploadPage } from './pages/ResumeUploadPage.tsx';
import { ResumeAnalysisPage } from './pages/ResumeAnalysisPage.tsx';
import { InterviewSetupPage } from './pages/InterviewSetupPage.tsx';
import { LiveInterviewPage } from './pages/LiveInterviewPage.tsx';
import { InterviewReportPage } from './pages/InterviewReportPage.tsx';
import { PracticeArenaPage } from './pages/PracticeArenaPage.tsx';
import { TestInterfacePage } from './pages/TestInterfacePage.tsx';
import { TestResultsPage } from './pages/TestResultsPage.tsx';
import { LearningHubPage } from './pages/LearningHubPage.tsx';
import { AnalyticsPage } from './pages/AnalyticsPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';
import { ResumeDocument, InterviewSession, PracticeTest } from './types/index.ts';
import { api } from './services/api.ts';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [activeResume, setActiveResume] = useState<ResumeDocument | null>(null);
  const [activeInterviewSession, setActiveInterviewSession] = useState<InterviewSession | null>(null);
  const [selectedReportSession, setSelectedReportSession] = useState<InterviewSession | null>(null);
  const [activeTestConfig, setActiveTestConfig] = useState<any>(null);
  const [activeTestResult, setActiveTestResult] = useState<PracticeTest | null>(null);

  // Auto-switch to dashboard on login, or landing on logout
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Load user's latest resume into memory
        api.resumes.getLatest().then((res) => {
          if (res.resume) setActiveResume(res.resume);
        }).catch(() => {});

        if (currentTab === 'landing' || currentTab === 'login' || currentTab === 'register') {
          setCurrentTab('dashboard');
        }
      } else {
        if (currentTab !== 'login' && currentTab !== 'register' && currentTab !== 'forgot-password') {
          setCurrentTab('landing');
        }
      }
    }
  }, [user, isLoading]);

  const handleNavigate = async (tab: string, extraParam?: string) => {
    if (tab === 'interview-report' && extraParam) {
      try {
        const res = await api.interviews.get(extraParam);
        setSelectedReportSession(res.interview);
        setCurrentTab('interview-report');
        return;
      } catch (e) {
        console.error('Failed to load interview report:', e);
      }
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResumeAnalysisSuccess = (resumeDoc: ResumeDocument) => {
    setActiveResume(resumeDoc);
  };

  const handleStartInterview = (session: InterviewSession) => {
    setActiveInterviewSession(session);
    setCurrentTab('live-interview');
  };

  const handleInterviewComplete = (completedSession: InterviewSession) => {
    setSelectedReportSession(completedSession);
    setCurrentTab('interview-report');
  };

  const handleStartPracticeTest = (config: any) => {
    setActiveTestConfig(config);
    setCurrentTab('practice-test');
  };

  const handleTestComplete = (result: PracticeTest) => {
    setActiveTestResult(result);
    setCurrentTab('practice-results');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-cyan-400">Initializing InterviewIQ Engine...</p>
        </div>
      </div>
    );
  }

  const showSidebar =
    Boolean(user) &&
    currentTab !== 'landing' &&
    currentTab !== 'live-interview';

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans">
      <Navbar currentTab={currentTab} onNavigate={handleNavigate} />

      <div className="flex-1 flex w-full">
        {showSidebar && <Sidebar currentTab={currentTab} onNavigate={handleNavigate} />}

        <main className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full ${!showSidebar ? 'max-w-7xl mx-auto w-full' : ''}`}>
          {/* Landing & Auth Pages */}
          {currentTab === 'landing' && <LandingPage onNavigate={handleNavigate} />}
          {currentTab === 'login' && <LoginPage onNavigate={handleNavigate} />}
          {currentTab === 'register' && <RegisterPage onNavigate={handleNavigate} />}
          {currentTab === 'forgot-password' && <ForgotPasswordPage onNavigate={handleNavigate} />}

          {/* Authenticated Dashboard & Features */}
          {currentTab === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
          {currentTab === 'resume' && (
            <ResumeUploadPage
              onNavigate={handleNavigate}
              onAnalysisSuccess={handleResumeAnalysisSuccess}
            />
          )}
          {currentTab === 'resume-analysis' && (
            <ResumeAnalysisPage
              resume={activeResume}
              onNavigate={handleNavigate}
            />
          )}
          {currentTab === 'interview-setup' && (
            <InterviewSetupPage
              resume={activeResume}
              onStartInterview={handleStartInterview}
              onNavigate={handleNavigate}
            />
          )}
          {currentTab === 'live-interview' && activeInterviewSession && (
            <LiveInterviewPage
              session={activeInterviewSession}
              onInterviewComplete={handleInterviewComplete}
              onExit={() => setCurrentTab('dashboard')}
            />
          )}
          {currentTab === 'interview-report' && selectedReportSession && (
            <InterviewReportPage
              session={selectedReportSession}
              onRetake={() => setCurrentTab('interview-setup')}
              onNavigate={handleNavigate}
            />
          )}
          {currentTab === 'practice' && (
            <PracticeArenaPage
              onStartTest={handleStartPracticeTest}
              onViewResult={(test) => {
                setActiveTestResult(test);
                setCurrentTab('practice-results');
              }}
            />
          )}
          {currentTab === 'practice-test' && activeTestConfig && (
            <TestInterfacePage
              testConfig={activeTestConfig}
              onComplete={handleTestComplete}
              onExit={() => setCurrentTab('practice')}
            />
          )}
          {currentTab === 'practice-results' && activeTestResult && (
            <TestResultsPage
              test={activeTestResult}
              onRetake={() => setCurrentTab('practice')}
              onNavigate={handleNavigate}
            />
          )}
          {currentTab === 'learning' && <LearningHubPage />}
          {currentTab === 'analytics' && <AnalyticsPage />}
          {currentTab === 'profile' && <ProfilePage resume={activeResume} onNavigate={handleNavigate} />}
          {currentTab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
