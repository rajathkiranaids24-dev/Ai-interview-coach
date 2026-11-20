import React, { useState } from 'react';
import { Bot, Mail, Lock, ArrowRight, Zap, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface LoginPageProps {
  onNavigate: (tab: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, demoLogin, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    }
  };

  const handleDemo = async () => {
    setError(null);
    try {
      await demoLogin();
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1.5px] mx-auto mb-4 shadow-lg shadow-cyan-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Bot className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="text-xs text-slate-400 mt-1">Sign in to continue your interview preparation</p>
          </div>

          {/* Quick Demo Access banner */}
          <div className="mb-6 p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-cyan-300">Quick Testing?</p>
              <p className="text-[11px] text-slate-400">Use pre-configured student profile</p>
            </div>
            <button
              type="button"
              onClick={handleDemo}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1 shadow-md shadow-cyan-500/20"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Demo Login</span>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.chen@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white text-xs placeholder:text-slate-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white text-xs placeholder:text-slate-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-6"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <button
                onClick={() => onNavigate('register')}
                className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Register now
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
