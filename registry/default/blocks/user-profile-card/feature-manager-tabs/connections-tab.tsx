import React from'react';
import { Globe } from'lucide-react';

export const ConnectionsTab = React.memo(() => {
 return (
 <div className="space-y-6 max-w-2xl">
 <div className="border-b border-[var(--color-border)]/80 pb-4">
 <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
 <Globe className="w-5 h-5 text-cyan-400"/>
 Connected Accounts &amp; Badges
 </h2>
 <p className="text-xs text-[var(--color-text-secondary)] mt-1">Display verified social presences and rare badges on your card.</p>
 </div>

 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3"aria-label="Connected accounts">
 {[
 { name:'Spotify Premium', icon:'🎵', status:'Connected as @RamVerma', color:'border-emerald-500/40 bg-emerald-950/20'},
 { name:'GitHub Pro', icon:'💻', status:'Connected as @ram-architect', color:'border-[var(--color-border)] bg-[#F9F9F7]'},
 { name:'Steam Gaming', icon:'🎮', status:'Connected as RamV_MNC', color:'border-blue-500/40 bg-blue-950/20'},
 { name:'YouTube Premium', icon:'🔴', status:'Connected as Ram Devs', color:'border-rose-500/40 bg-rose-950/20'}
 ].map((acc, idx) => (
 <li key={`conn-${idx}`} className={`p-4 rounded-2xl border ${acc.color} flex items-center gap-3`}>
 <span className="text-2xl"aria-hidden="true">{acc.icon}</span>
 <div>
 <div className="font-bold text-xs text-slate-800">{acc.name}</div>
 <div className="text-[10px] text-[var(--color-text-secondary)]">{acc.status}</div>
 </div>
 </li>
 ))}
 </ul>
 </div>
 );
});

ConnectionsTab.displayName ='ConnectionsTab';
export default ConnectionsTab;
