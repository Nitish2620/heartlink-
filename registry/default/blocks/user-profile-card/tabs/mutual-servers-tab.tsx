// @ts-nocheck
import React, { useMemo } from'react';
import { m as motion, AnimatePresence } from'framer-motion';
import { MoreHorizontal, Heart, MessageSquare, Share2, Crown, Zap, Award, Sparkles, Lock, Volume2, Eye, CheckCircle } from'lucide-react';
import * as Tabs from'@radix-ui/react-tabs';
import type { UserProfileData, PostItem, NitroSound, NitroSticker } from'../types';
import { SUBSCRIPTION_PLANS } from'../user-profile-card';


export default function MutualServersTab({
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
{/* DISCORD MUTUAL SERVERS TAB CONTENT */}
 <Tabs.Content value="mutual_servers"className="outline-none space-y-3">
 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3"aria-label="Mutual Servers">
 {profile.mutualServers?.map(server => (
 <li key={server.id} className="bg-slate-50/80 /40 p-4 rounded-2xl border border-[var(--color-border)]/80 flex items-center justify-between transition hover:border-cyan-500/50">
 <div className="flex items-center gap-3">
 <img src={server.icon} alt={server.name} loading="lazy"className="w-11 h-11 rounded-2xl object-cover ring-2 ring-cyan-500/40 shrink-0"/>
 <div>
 <div className="font-bold text-xs text-[var(--color-text-primary)]">{server.name}</div>
 <div className="text-[10px] text-[var(--color-text-secondary)] font-mono mt-0.5">
 {server.memberCount.toLocaleString()} Members • Joined {server.joinedDate}
 </div>
 </div>
 </div>
 <span className="text-[10px] font-bold text-cyan-500 bg-cyan-950/60 border border-cyan-500/30 px-2 py-1 rounded-full shrink-0"aria-label={`${server.mutualFriendsCount} mutual friends`}>
 {server.mutualFriendsCount} Mutual
 </span>
 </li>
 ))}
 </ul>
 </Tabs.Content>
 </>
 );
}
