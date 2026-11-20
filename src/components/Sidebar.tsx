import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Video,
  CheckSquare,
  BarChart3,
  GraduationCap,
  User,
  Settings,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resume', label: 'My Resume', icon: FileText, badge: 'AI ATS' },
    { id: 'interview-setup', label: 'AI Interview', icon: Video, badge: 'Live' },
    { id: 'practice', label: 'Practice Tests', icon: CheckSquare },
    { id: 'analytics', label: 'Performance Analytics', icon: BarChart3 },
    { id: 'learning', label: 'Learning Hub', icon: GraduationCap },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col border-r border-slate-800/80 bg-[#07090e]/60 min-h-[calc(100vh-4rem)] p-4 select-none">
      {/* Quick Launch Card */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900/60 to-violet-950/40 border border-cyan-500/20 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-white tracking-wide">Next Interview Ready?</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
          Simulate a real FAANG or MNC interview with posture tracking and real-time evaluation.
        </p>
        <button
          onClick={() => onNavigate('interview-setup')}
          className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20"
        >
          <span>Launch AI Interview</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Navigation menu */}
      <div className="space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
          Navigation
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentTab === item.id ||
            (item.id === 'resume' && currentTab === 'resume-analysis') ||
            (item.id === 'interview-setup' && (currentTab === 'live-interview' || currentTab === 'interview-report')) ||
            (item.id === 'practice' && (currentTab === 'practice-test' || currentTab === 'practice-results'));

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/80 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                    isActive
                      ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* System Status info footer */}
      <div className="mt-auto pt-6 border-t border-slate-800/80 px-2 text-xs text-slate-400">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          <span className="text-[11px] font-medium text-slate-400">Gemini 3.8 Flash Engine</span>
        </div>
        <p className="text-[10px] text-slate-400 font-mono">Academic Mini-Project Edition</p>
      </div>
    </aside>
  );
};
