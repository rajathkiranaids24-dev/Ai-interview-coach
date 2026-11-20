import React from 'react';
import { Bot, Sparkles, LogOut, User as UserIcon, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'resume', label: 'My Resume' },
    { id: 'interview-setup', label: 'AI Interview' },
    { id: 'practice', label: 'Practice Arena' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'learning', label: 'Learning Hub' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#07090e]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onNavigate(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-200" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-white text-base">INTERVIEW<span className="text-cyan-400">IQ</span></span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">AI</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">Smart Interview System</p>
          </div>
        </div>

        {/* Desktop Links (if logged in) */}
        {user ? (
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id || (item.id === 'resume' && currentTab === 'resume-analysis');
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800/80 text-cyan-300 shadow-sm border border-slate-700/60'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-xs text-slate-400 font-medium">
            <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">Overview</button>
            <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">How It Works</button>
          </nav>
        )}

        {/* Action button & User profile */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={() => onNavigate('interview-setup')}
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Interview</span>
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800/60 text-slate-300 hover:text-white transition-colors"
                  title="My Profile"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 border border-cyan-500/40 flex items-center justify-center text-xs font-bold text-cyan-300">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium max-w-[100px] truncate hidden lg:inline">{user.name.split(' ')[0]}</span>
                </button>

                <button
                  onClick={() => onNavigate('settings')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    logout();
                    onNavigate('landing');
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('login')}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20 transition-all"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-4 space-y-1 backdrop-blur-xl">
          {user ? (
            <>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-slate-300 flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4 text-cyan-400" />
                  Profile & Account
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    onNavigate('landing');
                  }}
                  className="text-xs text-rose-400"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  onNavigate('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 text-sm text-slate-300 rounded-lg hover:bg-slate-800"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  onNavigate('register');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 text-sm font-semibold rounded-lg bg-cyan-500 text-slate-950"
              >
                Register Free
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
