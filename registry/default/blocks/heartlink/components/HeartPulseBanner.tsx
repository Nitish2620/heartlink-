import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export interface HeartPulseBannerProps {
  isMatch?: boolean;
  expiresAt?: number;
  pulseExtended?: boolean;
  chatId: string;
  onExtendMatchPulse: (chatId: string) => void;
}

export const HeartPulseBanner: React.FC<HeartPulseBannerProps> = React.memo(({
  isMatch,
  expiresAt,
  pulseExtended,
  chatId,
  onExtendMatchPulse,
}) => {
  if (!isMatch || !expiresAt) return null;

  const hoursLeft = Math.max(0, Math.ceil((expiresAt - Date.now()) / (1000 * 3600)));

  return (
    <div className="px-4 py-2 bg-gradient-to-r from-rose-500/15 via-purple-500/15 to-pink-500/15 border-b border-rose-300/60 flex items-center justify-between text-xs animate-in fade-in shrink-0 shadow-2xs backdrop-blur-xs relative z-20">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="w-7 h-7 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0 border border-rose-400/40 animate-pulse">
          <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-500" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-rose-950 dark:text-rose-200">
            <span>72-Hour HeartPulse</span>
            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-rose-200 text-rose-900 border border-rose-300">
              ⏳ {hoursLeft} Hours Remaining
            </span>
          </div>
          <span className="text-rose-900/90 dark:text-rose-300/90 truncate text-[11px] font-medium">
            {pulseExtended 
              ? '✨ Extended 24h bonus active!' 
              : 'Keep the momentum going before this match pulse expires!'}
          </span>
        </div>
      </div>

      {!pulseExtended && (
        <button
          type="button"
          onClick={() => onExtendMatchPulse(chatId)}
          className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1 shrink-0 ml-2"
        >
          <Sparkles className="w-3.5 h-3.5 fill-white" />
          <span>Extend 24h</span>
        </button>
      )}
    </div>
  );
});

HeartPulseBanner.displayName = 'HeartPulseBanner';
