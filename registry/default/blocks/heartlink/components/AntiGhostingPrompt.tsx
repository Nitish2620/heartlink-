import React, { useState } from 'react';
import { Sparkles, MessageCircle, X, Flame, Zap } from 'lucide-react';

export interface AntiGhostingPromptProps {
  partnerName: string;
  onSelectPrompt: (promptText: string) => void;
  onDismiss?: () => void;
}

const AI_ICEBREAKER_STARTERS = [
  "Quick question: what's your ultimate weekend espresso & pastry spot?",
  "If we could teleport to any music festival right now, where are we heading?",
  "Spotted a secret rooftop vinyl listening session this Friday - up for it?",
  "Be honest: pineapple on pizza or absolute culinary crime?",
  "What's one song that never fails to put you in a great mood?"
];

export const AntiGhostingPrompt: React.FC<AntiGhostingPromptProps> = React.memo(({
  partnerName,
  onSelectPrompt,
  onDismiss,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const samplePrompts = AI_ICEBREAKER_STARTERS.slice(0, 3);

  return (
    <div className="mx-4 mb-2 p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-rose-500/10 to-amber-500/10 border border-purple-500/20 backdrop-blur-md shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-300 relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 flex items-center justify-center shadow-xs">
            <Flame className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              Re-ignite the Spark with {partnerName}
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                Anti-Ghosting AI
              </span>
            </h4>
          </div>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={() => {
              setDismissed(true);
              onDismiss();
            }}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            title="Dismiss prompt"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 font-medium">
        It's been a while! Tap a high-impact opener below to get the conversation flowing again:
      </p>

      <div className="flex flex-col sm:flex-row gap-2">
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            className="flex-1 text-left p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200/60 dark:border-slate-700/60 hover:border-purple-300 dark:hover:border-purple-600 text-xs font-medium text-slate-800 dark:text-slate-200 transition cursor-pointer flex items-center justify-between group active:scale-[0.99]"
          >
            <span className="line-clamp-2 pr-2">{prompt}</span>
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition" />
          </button>
        ))}
      </div>
    </div>
  );
});

AntiGhostingPrompt.displayName = 'AntiGhostingPrompt';
