// @ts-nocheck
import React, { useMemo } from'react';
import { m as motion, AnimatePresence } from'framer-motion';
import { MoreHorizontal, Heart, MessageSquare, Share2, Crown, Zap, Award, Sparkles, Lock, Volume2, Eye, CheckCircle } from'lucide-react';
import * as Tabs from'@radix-ui/react-tabs';
import type { UserProfileData, PostItem, NitroSound, NitroSticker } from'../types';
import { SUBSCRIPTION_PLANS } from'../user-profile-card';


export default function ServerPreviewTab({
 profile,
 profileContext,
 isNitroPro,
 subscriptionTier,
 playingSoundId,
 playSoundboardClip,
 handleSelectSubscription
}: any) {
 
 return (
 <>
{/* SERVER BOOST LEVEL 1-3 PREVIEW TAB */}
 <Tabs.Content value="server_preview"className="outline-none space-y-4">
 <div className="bg-slate-50/80 /40 p-6 rounded-3xl border border-[var(--color-border)]/80 space-y-6">
 
 <div>
 <h3 className="text-base font-extrabold text-[var(--color-text-primary)] flex items-center gap-2">
 <Zap className="w-5 h-5 text-pink-500 fill-pink-500"/>
 Server Boost Level 1-3 Community Container Animations
 </h3>
 <p className="text-xs text-[var(--color-text-secondary)] mt-1">
 Applying Nitro Server Boosts unlocks physical animations for the entire community server sidebar & header:
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 
 {/* Level 1: Animated Server Sidebar Icon */}
 <div className="p-4 rounded-2xl border border-[var(--color-border)] /80 bg-[var(--color-surface)] space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent-sage)] bg-blue-50 px-2 py-0.5 rounded-full">Level 1 Boost</span>
 <Crown className="w-4 h-4 text-amber-400"/>
 </div>
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-purple-500 animate-spin"style={{ animationDuration:'10s'}}>
 <img src={profile.animatedServerIcon || profile.serverIcon} alt="Animated Server Icon"loading="lazy"className="w-full h-full object-cover"/>
 </div>
 <div>
 <div className="font-bold text-xs text-[var(--color-text-primary)]">Animated Server Bubble</div>
 <div className="text-[10px] text-[var(--color-text-secondary)]">Looping GIF on sidebar hover</div>
 </div>
 </div>
 </div>

 {/* Level 1: Holographic Gradient Roles */}
 <div className="p-4 rounded-2xl border border-[var(--color-border)] /80 bg-[var(--color-surface)] space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full">Level 1 Revamp</span>
 <Award className="w-4 h-4 text-purple-400"/>
 </div>
 <div>
 <div className="font-bold text-xs text-[var(--color-text-primary)] mb-1">Animated Gradient Roles</div>
 <div className="flex flex-wrap gap-1">
 <span className="text-xs font-extrabold bg-gradient-to-r from-amber-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
 @Core Lead
 </span>
 <span className="text-xs font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent animate-pulse">
 @MNC Architect
 </span>
 </div>
 </div>
 </div>

 {/* Level 3: Animated Server Sidebar Banner */}
 <div className="p-4 rounded-2xl border border-[var(--color-border)] /80 bg-[var(--color-surface)] space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-bold uppercase tracking-wider text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full">Level 3 Boost</span>
 <Zap className="w-4 h-4 text-pink-500 fill-pink-500"/>
 </div>
 <div className="h-16 rounded-xl overflow-hidden relative bg-[#F9F9F7]">
 <img src={profile.animatedServerBanner || profile.serverBanner} alt="Animated Server Banner"loading="lazy"className="w-full h-full object-cover animate-pulse"/>
 <div className="absolute inset-0 bg-[var(--color-surface)]/40 flex items-center justify-center text-[11px] font-bold text-slate-800">
 Animated Server Header Banner
 </div>
 </div>
 </div>

 </div>

 </div>
 </Tabs.Content>
 </>
 );
}
