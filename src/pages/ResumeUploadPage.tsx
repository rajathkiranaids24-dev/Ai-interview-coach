import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  FileUp,
  Clipboard,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { ResumeDocument } from '../types/index.ts';

interface ResumeUploadPageProps {
  onNavigate: (tab: string) => void;
  onAnalysisSuccess: (resume: ResumeDocument) => void;
}

export const ResumeUploadPage: React.FC<ResumeUploadPageProps> = ({
  onNavigate,
  onAnalysisSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [pasteText, setPasteText] = useState('');
  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 10 * 1024 * 1024) {
        setError('File size must be under 10MB');
        return;
      }
      setFile(selected);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      if (dropped.size > 10 * 1024 * 1024) {
        setError('File size must be under 10MB');
        return;
      }
      setFile(dropped);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsUploading(true);

    try {
      if (mode === 'upload') {
        if (!file) {
          setError('Please select a PDF or DOCX resume file.');
          setIsUploading(false);
          return;
        }
        const formData = new FormData();
        formData.append('resume', file);
        const res = await api.resumes.upload(formData);
        onAnalysisSuccess(res.resume);
        onNavigate('resume-analysis');
      } else {
        if (!pasteText.trim() || pasteText.trim().length < 50) {
          setError('Please enter at least 50 characters of resume content.');
          setIsUploading(false);
          return;
        }
        const res = await api.resumes.analyzeText(pasteText, 'Pasted-Resume.txt');
        onAnalysisSuccess(res.resume);
        onNavigate('resume-analysis');
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.message || 'Failed to analyze resume with Gemini');
    } finally {
      setIsUploading(false);
    }
  };

  // Sample resume quick filler for instantaneous testing
  const handleLoadSample = () => {
    setMode('paste');
    setPasteText(`Alex Chen
Email: alex.chen@stanford.edu | GitHub: github.com/alexchen | LinkedIn: linkedin.com/in/alexchen
Education:
Stanford University, B.S. in Computer Science (Expected June 2025) - GPA: 3.86/4.0
Coursework: Distributed Systems, Operating Systems, Computer Networks, Database Architectures, Compilers.

Technical Skills:
- Languages: TypeScript, JavaScript, Python, Go, SQL, C++, HTML5, CSS3
- Technologies: React, Node.js, Express, Next.js, Redis, PostgreSQL, Docker, AWS (S3, ECS), Git
- Core Domains: REST APIs, System Design, Concurrency, Microservices, CI/CD

Experience:
CloudScale Technologies - Software Engineer Intern (Summer 2024)
- Architected an in-memory caching pipeline in Go & Redis, reducing p99 API endpoint response times by 42%.
- Engineered distributed worker pools processing 150,000 asynchronous background jobs daily with 99.99% reliability.
- Wrote end-to-end integration tests using Jest and established automated GitHub Actions CI/CD workflows.

Key Projects:
HyperQueue - Distributed Task Scheduler (Go, Redis, Docker)
- Implemented high-throughput distributed message broker with exponential backoff and dead-letter queues.
- Handled 10,000 events/sec with sub-5ms scheduling overhead.

DevMetrics - Engineering Analytics Platform (React, TypeScript, Express, PostgreSQL)
- Developed interactive web app tracking GitHub pull-request review velocity and team code churn.
- Implemented responsive dark-mode UI with customizable Recharts dashboards.`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini 3.8 Flash ATS Analyzer</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Upload Your Resume</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Our AI scans your resume for ATS formatting, extracts technical competencies, benchmarks your market readiness, and prepares custom interview questions.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-2 ${
              mode === 'upload'
                ? 'bg-cyan-500 text-slate-950 font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Upload Document (PDF / DOCX)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('paste')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-2 ${
              mode === 'paste'
                ? 'bg-cyan-500 text-slate-950 font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span>Paste Resume Text</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load Sample SDE Resume</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload or Text Area Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === 'upload' ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all bg-slate-950/40 relative group ${
              file ? 'border-cyan-500/60 bg-cyan-950/10' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <input
              type="file"
              id="resume-file"
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 group-hover:border-cyan-500/40 flex items-center justify-center mx-auto mb-4 text-cyan-400 shadow-xl transition-all">
              <UploadCloud className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </div>

            {file ? (
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                <p className="text-xs text-slate-400">Click or drop another file to replace</p>
              </div>
            ) : (
              <div>
                <h3 className="text-base font-semibold text-white mb-1">Drag and drop your resume here</h3>
                <p className="text-xs text-slate-400 mb-4">Supports PDF, DOCX, DOC and plain text (up to 10MB)</p>
                <span className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 pointer-events-none">
                  Browse Local Files
                </span>
              </div>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Resume Text Content</label>
            <textarea
              rows={14}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste your complete resume markdown, text, or bullet points here..."
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white text-xs font-mono placeholder:text-slate-600 focus:ring-1 focus:ring-cyan-500 leading-relaxed"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-slate-400">
            * All resume data is parsed securely for your personal preparation session.
          </p>

          <button
            type="submit"
            disabled={isUploading}
            className="px-6 py-3 rounded-xl font-semibold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <span>{isUploading ? 'Extracting & Analyzing with Gemini...' : 'Analyze Resume'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
