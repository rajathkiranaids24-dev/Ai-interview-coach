import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api.ts';

interface ForgotPasswordPageProps {
  onNavigate: (tab: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await api.auth.forgotPassword(email);
      setMessage(res.message);
      setStatus('success');
    } catch (err: any) {
      setMessage(err.message || 'Failed to dispatch reset link');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Reset Password</h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter your registered email address and we'll send you recovery instructions.
            </p>
          </div>

          {status === 'success' ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">{message}</p>
              <button
                onClick={() => onNavigate('login')}
                className="w-full py-2.5 rounded-xl font-semibold text-xs bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === 'error' && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{message}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 text-white text-xs placeholder:text-slate-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 rounded-xl font-semibold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-all disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending Instructions...' : 'Send Recovery Instructions'}
              </button>

              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="w-full py-2 text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
