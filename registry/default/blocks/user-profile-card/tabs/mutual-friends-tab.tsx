// @ts-nocheck
import React, { useMemo } from'react';
import { m as motion, AnimatePresence } from'framer-motion';
import { MoreHorizontal, Heart, MessageSquare, Share2, Crown, Zap, Award, Sparkles, Lock, Volume2, Eye, CheckCircle } from'lucide-react';
import * as Tabs from'@radix-ui/react-tabs';
import type { UserProfileData, PostItem, NitroSound, NitroSticker } from'../types';
import { SUBSCRIPTION_PLANS } from'../user-profile-card';


export default function MutualFriendsTab({
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
{/* DISCORD MUTUAL FRIENDS TAB CONTENT */}
 <Tabs.Content value="mutual_friends"className="outline-none space-y-3">
 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3"aria-label="Mutual Friends">
 {profile.mutualFriends?.map(friend => (
 <li key={friend.id} className="bg-slate-50/80 /40 p-4 rounded-2xl border border-[var(--color-border)]/80 flex items-center justify-between transition hover:border-emerald-500/50">
 <div className="flex items-center gap-3">
 <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
 <img src={friend.avatar} alt={friend.name} loading="lazy"className="w-full h-full object-cover"/>
 <span role="status"aria-label={`Status: ${friend.status}`} className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
 friend.status ==='dnd'?'bg-rose-500': friend.status ==='idle'?'bg-amber-400':'bg-emerald-500'
 }`} />
 </div>
 <div>
 <div className="font-bold text-xs text-[var(--color-text-primary)]">{friend.name}</div>
 <div className="text-[10px] text-purple-500 font-mono">{friend.handle}</div>
 </div>
 </div>
 <button
 type="button"
 aria-label={`Message ${friend.name}`}
 onClick={() => showToast(`Opening Direct Message with ${friend.name}...`)}
 className="p-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-slate-800 transition cursor-pointer text-xs font-bold flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-purple-500 outline-none"
 >
 <MessageSquare className="w-3.5 h-3.5"aria-hidden="true"/>
 <span>Message</span>
 </button>
 </li>
 ))}
 </ul>
 </Tabs.Content>
 </>
 );
}
