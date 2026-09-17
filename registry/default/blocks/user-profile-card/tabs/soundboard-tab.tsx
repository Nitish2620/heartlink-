// @ts-nocheck
import React, { useMemo } from'react';
import { m as motion, AnimatePresence } from'framer-motion';
import { MoreHorizontal, Heart, MessageSquare, Share2, Crown, Zap, Award, Sparkles, Lock, Volume2, Eye, CheckCircle } from'lucide-react';
import * as Tabs from'@radix-ui/react-tabs';
import type { UserProfileData, PostItem, NitroSound, NitroSticker } from'../types';
import { SUBSCRIPTION_PLANS } from'../user-profile-card';


export default function SoundboardTab({
 profile,
 profileContext,
 isNitroPro,
 subscriptionTier,
 playingSoundId,
 playSoundboardClip,
 handleSelectSubscription
}: any) {
 const mockSoundboard: NitroSound[] = useMemo(() => [
 { id:'sb1', name:'Airhorn Blast', emoji:'📢', freq: 750, category:'Meme'},
 { id:'sb2', name:'Quack Quack', emoji:'🦆', freq: 440, category:'Meme'},
 { id:'sb3', name:'Victory Horn', emoji:'🎺', freq: 880, category:'Gaming'},
 { id:'sb4', name:'GG WP Chime', emoji:'🎮', freq: 620, category:'Gaming'},
 { id:'sb5', name:'Super Laser Blast', emoji:'⚡', freq: 950, category:'Nitro Special', lockedForFree: !isNitroPro }
 ], [isNitroPro]);

 
 return (
 <>
{/* SOUNDBOARD TAB CONTENT WITH AUDIO WAVEFORM EQUALIZER */}
 <Tabs.Content value="soundboard"className="outline-none">
 <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"aria-label="Soundboard">
 {mockSoundboard.map(sound => {
 const isPlaying = playingSoundId === sound.id;
 return (
 <li key={sound.id}>
 <button
 type="button"
 aria-label={`Play ${sound.name} sound`}
 onClick={() => playSoundboardClip(sound)}
 className={`w-full p-4 rounded-2xl border flex items-center justify-between text-left transition cursor-pointer group focus-visible:ring-2 focus-visible:ring-purple-500 outline-none ${
 isPlaying
 ?'bg-purple-900/40 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-102'
 : sound.lockedForFree 
 ?'bg-[var(--color-bg-alt)]/60 /20 border-[var(--color-border)] opacity-60'
 :'bg-slate-50/80 /40 border-[var(--color-border)]/80 hover:border-purple-500/50'
 }`}
 >
 <div className="flex items-center gap-3">
 <span className="text-2xl group-hover:scale-125 transition transform"aria-hidden="true">{sound.emoji}</span>
 <div>
 <div className="font-bold text-xs text-[var(--color-text-primary)] flex items-center gap-1">
 {sound.name}
 {sound.lockedForFree && <Lock className="w-3 h-3 text-amber-500"aria-label="Locked for free users"/>}
 </div>
 <span className="text-[10px] font-semibold text-purple-500">{sound.category}</span>
 </div>
 </div>

 {/* Animated Equalizer Waveform Bars when Active */}
 {isPlaying ? (
 <div className="flex items-end gap-1 h-5"aria-hidden="true">
 <motion.span animate={{ height: [4, 18, 6, 20, 4] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-1 bg-purple-400 rounded-full"/>
 <motion.span animate={{ height: [16, 6, 20, 8, 16] }} transition={{ repeat: Infinity, duration: 0.35 }} className="w-1 bg-pink-400 rounded-full"/>
 <motion.span animate={{ height: [8, 20, 4, 16, 8] }} transition={{ repeat: Infinity, duration: 0.45 }} className="w-1 bg-amber-400 rounded-full"/>
 <motion.span animate={{ height: [18, 4, 14, 6, 18] }} transition={{ repeat: Infinity, duration: 0.38 }} className="w-1 bg-cyan-400 rounded-full"/>
 </div>
 ) : (
 <Volume2 className="w-4 h-4 text-purple-400 group-hover:animate-bounce"aria-hidden="true"/>
 )}
 </button>
 </li>
 );
 })}
 </ul>
 </Tabs.Content>
 </>
 );
}
