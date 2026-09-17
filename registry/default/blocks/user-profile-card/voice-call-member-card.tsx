import React, { useState } from'react';
import { Mic, MicOff, Volume2, VolumeX, MessageSquare, Video, ExternalLink } from'lucide-react';
import type { UserProfileData } from'./types';

export interface VoiceCallMemberCardProps {
 profile: UserProfileData;
 isSpeaking?: boolean;
 isStreaming?: boolean;
 streamThumbnail?: string;
 onViewProfile?: () => void;
 onMessage?: () => void;
 className?: string;
}

export const VoiceCallMemberCard = React.memo(({
 profile,
 isSpeaking = true,
 isStreaming = true,
 streamThumbnail ='https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
 onViewProfile,
 onMessage,
 className =''
}: VoiceCallMemberCardProps) => {
 const [volume, setVolume] = useState<number>(100);
 const [isMuted, setIsMuted] = useState<boolean>(false);
 const [isDeafened, setIsDeafened] = useState<boolean>(false);

 return (
 <div className={`w-[320px] bg-[#F9F9F7]/95 backdrop-blur-xl border border-[var(--color-border)]/90 rounded-2xl p-4 flex flex-col gap-4 text-slate-800 shadow-2xl ${className}`} style={{ contain:'content'}}>
 
 {/* Header with Avatar & Animated Speaking Halo */}
 <div className="flex items-center gap-3">
 <div className="relative shrink-0">
 <div className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-300 ${
 isSpeaking ?'border-emerald-500 ring-4 ring-emerald-500/30 animate-pulse':'border-[var(--color-border)]'
 }`}>
 <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover"/>
 </div>
 {isSpeaking && (
 <div className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full shadow-md animate-bounce">
 LIVE
 </div>
 )}
 </div>

 <div className="flex-1 min-w-0">
 <h3 className="font-extrabold text-sm text-slate-800 truncate">{profile.serverNickname || profile.name}</h3>
 <p className="text-xs text-[var(--color-text-secondary)] truncate">@{profile.handle}</p>
 <div className="flex items-center gap-1.5 mt-1"role="status"aria-label={isSpeaking ?'Speaking Now':'Connected to Voice'}>
 <span className={`w-2 h-2 rounded-full ${isSpeaking ?'bg-emerald-400 animate-ping':'bg-slate-500'}`} aria-hidden="true"/>
 <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
 {isSpeaking ?'Speaking Now':'Connected to Voice'}
 </span>
 </div>
 </div>
 </div>

 {/* Screen Share / Stream Preview if Active */}
 {isStreaming && (
 <div className="relative rounded-xl overflow-hidden border border-indigo-500/30 group">
 <img src={streamThumbnail} alt="Live Stream"className="w-full h-32 object-cover"/>
 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"/>
 <div className="absolute top-2 left-2 bg-red-600/90 text-slate-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
 <Video className="w-3 h-3"/>
 LIVE STREAM
 </div>
 <button 
 type="button"
 className="absolute bottom-2 right-2 bg-[var(--color-accent-sage)] hover:bg-[var(--color-accent-sage)] text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
 aria-label="Watch Live Stream"
 >
 <span>Watch</span>
 <ExternalLink className="w-3 h-3"aria-hidden="true"/>
 </button>
 </div>
 )}

 {/* User Volume Slider (0% to 200%) */}
 <div className="space-y-1.5 bg-[#F9F9F7]/60 p-3 rounded-xl border border-[var(--color-border)]/80">
 <div className="flex items-center justify-between text-xs font-bold text-slate-300">
 <span className="flex items-center gap-1.5">
 {volume === 0 || isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400"/> : <Volume2 className="w-3.5 h-3.5 text-emerald-400"/>}
 User Volume
 </span>
 <span className="font-mono text-purple-400">{isMuted ?'Muted':`${volume}%`}</span>
 </div>
 <input 
 type="range"
 min={0} 
 max={200} 
 value={isMuted ? 0 : volume}
 onChange={(e) => {
 setIsMuted(false);
 setVolume(Number(e.target.value));
 }}
 className="w-full h-1.5 bg-[var(--color-surface)] rounded-lg appearance-none cursor-pointer accent-purple-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
 aria-label="User Volume"
 />
 </div>

 {/* Audio Toggles */}
 <div className="grid grid-cols-2 gap-2">
 <button
 type="button"
 onClick={() => setIsMuted(!isMuted)}
 className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 ${
 isMuted 
 ?'bg-red-500/20 text-red-400 border border-red-500/40 focus-visible:ring-red-400'
 :'bg-[#F9F9F7] hover:bg-[var(--color-surface)] text-slate-300 border border-[var(--color-border)] focus-visible:ring-slate-400'
 }`}
 aria-pressed={isMuted}
 >
 {isMuted ? <MicOff className="w-4 h-4 text-red-400"aria-hidden="true"/> : <Mic className="w-4 h-4 text-emerald-400"aria-hidden="true"/>}
 <span>{isMuted ?'Muted':'Mute User'}</span>
 </button>

 <button
 type="button"
 onClick={() => setIsDeafened(!isDeafened)}
 className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 ${
 isDeafened 
 ?'bg-red-500/20 text-red-400 border border-red-500/40 focus-visible:ring-red-400'
 :'bg-[#F9F9F7] hover:bg-[var(--color-surface)] text-slate-300 border border-[var(--color-border)] focus-visible:ring-slate-400'
 }`}
 aria-pressed={isDeafened}
 >
 {isDeafened ? <VolumeX className="w-4 h-4 text-red-400"aria-hidden="true"/> : <Volume2 className="w-4 h-4 text-purple-400"aria-hidden="true"/>}
 <span>{isDeafened ?'Deafened':'Deafen'}</span>
 </button>
 </div>

 {/* Actions */}
 <div className="flex gap-2 pt-1 border-t border-[var(--color-border)]/80">
 <button
 type="button"
 onClick={onMessage}
 className="flex-1 py-2 px-3 rounded-xl bg-[#F9F9F7] hover:bg-[var(--color-surface)] text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-[var(--color-border)] transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
 >
 <MessageSquare className="w-3.5 h-3.5 text-[var(--color-accent-sage)]"aria-hidden="true"/>
 <span>Message</span>
 </button>

 <button
 type="button"
 onClick={onViewProfile}
 className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-md shadow-purple-600/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
 >
 <span>View Profile</span>
 </button>
 </div>
 </div>
 );
});

VoiceCallMemberCard.displayName ='VoiceCallMemberCard';
export default VoiceCallMemberCard;
