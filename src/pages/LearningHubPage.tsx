import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  ExternalLink,
  Clock,
  Play,
  Search,
  Filter,
  CheckCircle2,
  Video,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { YouTubeRecommendation } from '../types/index.ts';

export const LearningHubPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<YouTubeRecommendation[]>([]);
  const [detectedWeaknesses, setDetectedWeaknesses] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Technical skills',
    'Communication',
    'HR interview preparation',
    'Resume improvement',
    'Problem-solving',
    'Industry knowledge',
  ];

  useEffect(() => {
    async function loadLearning() {
      try {
        const res = await api.learning.getRecommendations();
        setRecommendations(res.recommendations);
        setDetectedWeaknesses(res.detectedWeaknesses || []);
      } catch (err) {
        console.warn('Failed to load learning hub data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLearning();
  }, []);

  const filtered = recommendations.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.channelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Banner */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-2">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Personalized YouTube Learning Hub</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Curated Learning Recommendations</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          High-yield video lectures and mock interview teardowns mapped directly to the skills and weaknesses flagged during your simulations.
        </p>
      </div>

      {/* Detected Weaknesses Callout */}
      {detectedWeaknesses.length > 0 && (
        <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-xs font-semibold text-white">Targeted Session Weaknesses: </span>
              <span className="text-xs text-cyan-300">{detectedWeaknesses.join(' • ')}</span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-cyan-400/80 shrink-0">Priority Matched</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search channels or topics..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((video) => (
          <div
            key={video.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden hover:border-slate-700 hover:bg-slate-900/70 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Thumbnail with duration badge and play hover */}
              <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/90 text-white font-mono text-[10px] border border-slate-800">
                  <span className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {video.duration}
                  </span>
                </div>

                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded-full bg-slate-900/90 backdrop-blur-md text-cyan-300 font-mono text-[10px] border border-cyan-500/30">
                    {video.category}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <div className="text-[11px] font-semibold text-cyan-400">{video.channelName}</div>
                <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-cyan-300 transition-colors">
                  {video.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{video.reason}</p>
              </div>
            </div>

            {/* Footer with External Link */}
            <div className="p-4 pt-0">
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700/80"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
