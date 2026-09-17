import React from'react';
import { Layers } from'lucide-react';

export const AppearanceTab = React.memo(() => {
 return (
 <div className="space-y-6 max-w-2xl">
 <div className="border-b border-[var(--color-border)]/80 pb-4">
 <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
 <Layers className="w-5 h-5 text-amber-400"/>
 Appearance &amp; Motion FX
 </h2>
 <p className="text-xs text-[var(--color-text-secondary)] mt-1">Customize visual theme modes and animation performance intensity.</p>
 </div>

 <div className="p-4 rounded-2xl bg-[#F9F9F7] border border-[var(--color-border)] space-y-3">
 <div className="block text-xs font-bold text-slate-800"id="theme-mode-label">App Color Theme Mode</div>
 <div className="grid grid-cols-3 gap-3"role="radiogroup"aria-labelledby="theme-mode-label">
 <button type="button"role="radio"aria-checked="true"className="p-3 rounded-xl border border-purple-500 bg-purple-950/60 text-slate-800 font-bold text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition">Dark Mode 🌙</button>
 <button type="button"role="radio"aria-checked="false"className="p-3 rounded-xl border border-[var(--color-border)] bg-[#F9F9F7] text-[var(--color-text-secondary)] font-bold text-xs cursor-pointer hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition">Light Mode ☀️</button>
 <button type="button"role="radio"aria-checked="false"className="p-3 rounded-xl border border-[var(--color-border)] bg-[#F9F9F7] text-[var(--color-text-secondary)] font-bold text-xs cursor-pointer hover:bg-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition">Obsidian Sync 🌌</button>
 </div>
 </div>
 </div>
 );
});

AppearanceTab.displayName ='AppearanceTab';
export default AppearanceTab;
