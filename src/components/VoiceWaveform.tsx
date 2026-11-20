import React from 'react';

interface VoiceWaveformProps {
  isActive: boolean;
  color?: 'cyan' | 'violet' | 'emerald';
  barCount?: number;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  isActive,
  color = 'cyan',
  barCount = 18,
}) => {
  const bars = Array.from({ length: barCount });

  const colorStyles = {
    cyan: 'from-cyan-400 to-blue-500',
    violet: 'from-violet-400 to-purple-500',
    emerald: 'from-emerald-400 to-teal-500',
  }[color];

  return (
    <div className="flex items-center justify-center gap-1 h-10 px-3 py-1 bg-slate-900/60 rounded-xl border border-slate-800/80 backdrop-blur-sm">
      {bars.map((_, index) => {
        // Pseudo-random varying heights with smooth oscillation
        const delay = (index % 5) * 0.12;
        const duration = 0.5 + ((index * 7) % 5) * 0.1;

        return (
          <div
            key={index}
            className={`w-1 rounded-full bg-gradient-to-t ${colorStyles} transition-all duration-200`}
            style={{
              height: isActive ? `${Math.max(6, (Math.sin(index + Date.now() / 300) * 0.5 + 0.5) * 28 + 6)}px` : '4px',
              animation: isActive ? `pulseWave ${duration}s infinite ease-in-out alternate` : 'none',
              animationDelay: `${delay}s`,
              opacity: isActive ? 0.9 : 0.25,
            }}
          />
        );
      })}
    </div>
  );
};
