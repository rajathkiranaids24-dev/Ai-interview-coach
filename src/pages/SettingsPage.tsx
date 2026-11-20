import React, { useState } from 'react';
import {
  Settings,
  Volume2,
  Video,
  ShieldCheck,
  Globe,
  Lock,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [postureSensitivity, setPostureSensitivity] = useState<'high' | 'medium' | 'standard'>('medium');
  const [searchGrounding, setSearchGrounding] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>System & Simulation Preferences</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Settings</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure speech synthesis, camera posture tracking sensitivities, and Gemini model search behaviors.
        </p>
      </div>

      <div className="space-y-6">
        {/* Audio & Speech */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <Volume2 className="w-5 h-5" />
            <h3 className="text-sm font-semibold text-white">Voice & Speech Synthesis</h3>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
            <div>
              <p className="text-xs font-medium text-white">Spoken Question Output</p>
              <p className="text-[11px] text-slate-400">AI interviewer speaks questions out loud using Web Speech Synthesis</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={speechEnabled}
                onChange={(e) => setSpeechEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-medium text-white">Voice Speaking Rate</p>
              <p className="text-[11px] text-slate-400">Adjust the cadence of speech</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.1"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="w-24 accent-cyan-400 cursor-pointer"
              />
              <span className="text-xs font-mono text-cyan-400 w-8">{speechRate}x</span>
            </div>
          </div>
        </div>

        {/* Posture Analysis Sensitivity */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Video className="w-5 h-5" />
            <h3 className="text-sm font-semibold text-white">Posture & Webcam Presentation Engine</h3>
          </div>

          <div className="py-2 border-b border-slate-800/80">
            <p className="text-xs font-medium text-white mb-1">Tracking Sensitivity</p>
            <p className="text-[11px] text-slate-400 mb-3">Controls how strictly shoulder tilt and fidgeting warnings are triggered</p>
            <div className="grid grid-cols-3 gap-3">
              {(['standard', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setPostureSensitivity(level)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium capitalize border transition-all ${
                    postureSensitivity === level
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-white">Zero Cloud Video Storage:</span> Webcam frames are sampled strictly in local browser memory via HTML5 Canvas. Recordings are never streamed to or stored on backend servers.
            </div>
          </div>
        </div>

        {/* AI Model & Search Grounding */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-violet-400 mb-2">
            <Globe className="w-5 h-5" />
            <h3 className="text-sm font-semibold text-white">Current Market Grounding (Google Search)</h3>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-medium text-white">Search Grounding Enabled</p>
              <p className="text-[11px] text-slate-400">Grounds company-specific questions in real web search results and active tech trends</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={searchGrounding}
                onChange={(e) => setSearchGrounding(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-4">
          {savedNotice && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Preferences saved!</span>
            </div>
          )}
          <div className="ml-auto">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-md shadow-cyan-500/20"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
