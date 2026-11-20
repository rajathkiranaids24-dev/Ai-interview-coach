import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Building2,
  Calendar,
  Briefcase,
  Mail,
  Save,
  CheckCircle2,
  FileCheck,
  Video,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { ResumeDocument } from '../types/index.ts';

interface ProfilePageProps {
  resume: ResumeDocument | null;
  onNavigate: (tab: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ resume, onNavigate }) => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    degree: user?.degree || 'B.Tech / B.E.',
    branch: user?.branch || '',
    graduationYear: user?.graduationYear || '2025',
    roleInterest: user?.roleInterest || 'Full Stack Software Engineer',
    bio: user?.bio || '',
  });
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (e) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Profile Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 p-[2px] shadow-xl shadow-cyan-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl font-extrabold text-cyan-300">
              {user?.name.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{user?.name}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                {user?.roleInterest || 'Software Engineer Candidate'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('interview-setup')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-md shadow-cyan-500/20"
          >
            Launch Interview
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Academic & Professional Profile</h2>
          {isSaved && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved Successfully</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Primary Target Role</label>
              <input
                type="text"
                value={formData.roleInterest}
                onChange={(e) => setFormData({ ...formData, roleInterest: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">College / University</label>
            <input
              type="text"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              placeholder="e.g. Stanford University / IIT"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Degree</label>
              <select
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white text-xs"
              >
                <option value="B.Tech / B.E.">B.Tech / B.E.</option>
                <option value="B.S. / B.Sc.">B.S. / B.Sc.</option>
                <option value="M.Tech / M.E.">M.Tech / M.E.</option>
                <option value="M.S.">M.S.</option>
                <option value="MCA / BCA">MCA / BCA</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Branch / Specialization</label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Graduation Year</label>
              <select
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white text-xs"
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Professional Bio / Elevator Summary</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white text-xs leading-relaxed"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
