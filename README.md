# INTERVIEWIQ – AI-Powered Smart Interview System

INTERVIEWIQ is a production-grade, full-stack AI interview preparation platform designed for students, fresh graduates, and tech job seekers. It features simulated live video interviews with an adaptive AI interviewer, real-time in-browser webcam posture analysis, Gemini ATS resume scoring, STAR answer evaluation, an interactive Practice Arena, and targeted YouTube educational recommendations.

---

## 🌟 Key Capabilities

1. **Simulated Live AI Interview Room**
   - Natural speech synthesis and voice recognition (Speech-to-Text & Text-to-Speech).
   - Real-time animated audio waveforms for both the AI interviewer and candidate.
   - Contextual questions synthesized dynamically with Gemini 3.8 Flash based on your uploaded resume, target role, and chosen company.
   - Grounded in real-world current tech trends using Google Search Grounding.
   - Non-interruptive turn-taking architecture.

2. **Webcam Posture & Presentation Analyzer**
   - In-browser local frame canvas analysis.
   - Tracks sitting posture, head tilt angle, shoulder alignment, eye contact / facing camera, and fidgeting/stability.
   - Real-time on-screen HUD alerts (e.g., *"Good Posture"*, *"Keep shoulders level"*, *"Try to face camera"*).
   - **Privacy First**: Processed 100% locally in the browser with zero cloud video storage.

3. **Gemini ATS Resume Intelligence**
   - Supports PDF, DOCX, and text input.
   - Computes ATS match compatibility score (/100) and overall competitiveness score.
   - Extracts technical skills, soft skills, projects, and work experience.
   - Highlights gaps, missing metrics, and provides tailored potential interview questions.

4. **STAR Answer Evaluation Engine**
   - Real-time grading out of 10 for every spoken or typed response.
   - Breaks down technical correctness, communication clarity, and problem solving.
   - Identifies strengths, missed nuances, and crafts a 9.5/10 exemplary model answer.

5. **Executive Performance Report**
   - Radar charts and 7-dimension scorecard: Technical, Communication, Problem Solving, Relevance, Logic, Resume Knowledge, Posture.
   - Question-by-question accordion with candidate transcripts and model answers.
   - One-click PDF download & print.

6. **Practice Arena**
   - 7 domains: Technical, Coding Concepts, HR, Quantitative Aptitude, Logical Reasoning, Domain-Specific, and Company-Specific.
   - Timed multiple-choice quizzes and free-form descriptive questions graded by Gemini.

7. **Weakness-Targeted Learning Hub**
   - Curated high-yield video lectures from verified educational channels (freeCodeCamp, MIT, NeetCode, CS Dojo).
   - Dynamically mapped to the weaknesses and missed topics detected during your interview.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Recharts, Canvas-Confetti, Web Speech API.
- **Backend**: Node.js, Express.js (Modular routes, controllers, middleware).
- **AI Engine**: `@google/genai` (SDK >= 2.25.0) utilizing `gemini-3.8-flash` with structured JSON schemas and search grounding.
- **Database & Persistence**: Resilient dual-layer data tier:
  - MongoDB connection via `MONGODB_URI` when configured.
  - Embedded local persistent JSON document store (`./data/db.json`) ensuring continuous operation without external dependencies.
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing and protected API middleware.

---

## 📁 Project Structure

```
├── .env.example              # Environment variables template
├── index.html                # Application entry HTML with SEO meta tags
├── metadata.json             # AI Studio applet capabilities and permissions
├── package.json              # Full-stack dependencies and scripts
├── server.ts                 # Express server with Vite middleware integration
├── src/
│   ├── main.tsx              # React mounting root
│   ├── App.tsx               # Primary app controller and router
│   ├── index.css             # Tailwind CSS v4 and animation styles
│   ├── types/
│   │   └── index.ts          # Shared TypeScript interfaces
│   ├── context/
│   │   └── AuthContext.tsx   # Authentication context & hooks
│   ├── services/
│   │   └── api.ts            # Typed HTTP API client
│   ├── components/
│   │   ├── Navbar.tsx        # Top navigation & user profile
│   │   ├── Sidebar.tsx       # SaaS navigation sidebar (8 views)
│   │   ├── PostureTracker.tsx# Local webcam canvas posture HUD
│   │   └── VoiceWaveform.tsx # Animated audio visualizer
│   ├── pages/
│   │   ├── LandingPage.tsx   # Futuristic SaaS hero & product showcase
│   │   ├── LoginPage.tsx     # Sign-in & 1-click Demo account
│   │   ├── RegisterPage.tsx  # Academic registration
│   │   ├── ForgotPasswordPage.tsx # Password reset simulation
│   │   ├── DashboardPage.tsx # Readiness meters & recent simulations
│   │   ├── ResumeUploadPage.tsx # PDF/DOCX dropzone & parser
│   │   ├── ResumeAnalysisPage.tsx # ATS analysis & skill tags
│   │   ├── InterviewSetupPage.tsx # Role, company, and difficulty setup
│   │   ├── LiveInterviewPage.tsx # Virtual AI interview room
│   │   ├── InterviewReportPage.tsx # Performance report & PDF download
│   │   ├── PracticeArenaPage.tsx # Assessment setup & history
│   │   ├── TestInterfacePage.tsx # MCQ & descriptive test room
│   │   ├── TestResultsPage.tsx # Detailed score breakdown
│   │   ├── LearningHubPage.tsx # Targeted YouTube videos
│   │   ├── AnalyticsPage.tsx # Recharts progress curves
│   │   ├── ProfilePage.tsx   # Candidate academic profile
│   │   └── SettingsPage.tsx  # Voice, posture, & AI preferences
│   └── server/
│       ├── db.ts             # Persistent document store & MongoDB schemas
│       ├── gemini.ts         # Server-side Gemini AI functions
│       ├── middleware/
│       │   └── auth.ts       # JWT verification middleware
│       └── routes/
│           ├── auth.ts       # Register, login, me, profile
│           ├── resume.ts     # Multer upload & ATS analysis
│           ├── interview.ts  # Session creation, answer grading, reports
│           ├── tests.ts      # Practice question generation & grading
│           ├── learning.ts   # Curated YouTube recommendations
│           └── analytics.ts  # Timeline & competency metrics
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js >= 18
- npm >= 9

### 2. Environment Configuration
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Fill in your `GEMINI_API_KEY`:
```env
GEMINI_API_KEY="your-google-gemini-api-key"
JWT_SECRET="interviewiq-secure-random-secret"
PORT=3000
```

### 3. Installation
```bash
npm install
```

### 4. Running the Application
Run the full-stack server (starts Express backend and mounts Vite on port 3000):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing the Complete User Journey

1. **Authentication**:
   - Register a new account or click **Instant Demo Login** (`alex.chen@university.edu` / `DemoPass123!`).
2. **Resume Upload**:
   - Navigate to **My Resume**. Drop a PDF/DOCX or click **Load Sample SDE Resume** to run Gemini ATS analysis.
   - Observe extracted ATS score, competencies, weaknesses, and potential interview questions.
3. **AI Interview Simulation**:
   - Go to **AI Interview** -> choose role (e.g. *Full Stack Engineer*) and target company (e.g. *Google*).
   - Enter the **Live Interview Room**.
   - Enable Camera & Mic to view the local **Posture HUD**.
   - Listen to the AI speak the question aloud.
   - Click the microphone button or type your answer and submit.
   - Review the immediate STAR critique and model answer.
   - Finish the interview to generate the **Executive Performance Report**.
4. **Practice Arena**:
   - Navigate to **Practice Arena** -> select *Technical Interview* or *Coding Concepts*.
   - Answer the MCQs and descriptive questions.
   - View graded accuracy, explanations, and model solutions.
5. **Learning Hub & Analytics**:
   - Explore YouTube recommendations mapped to your session weaknesses.
   - Review longitudinal score progression and radar competencies under **Performance Analytics**.

---

## 🔒 Security & Privacy Measures

- **Zero Camera Transmission**: Frames are processed solely in the browser's GPU/canvas memory.
- **Server-Side AI**: Gemini API keys never leak to client bundles.
- **Password Protection**: Passwords salted and hashed with `bcryptjs`.
- **JWT Authorization**: All private sessions, resumes, and test scores are strictly scoped to the authenticated user ID.
