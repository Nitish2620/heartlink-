// @ts-nocheck
import React, { useMemo } from'react';
import { m as motion, AnimatePresence } from'framer-motion';
import { MoreHorizontal, Heart, MessageSquare, Share2, Crown, Zap, Award, Sparkles, Lock, Volume2, Eye, CheckCircle } from'lucide-react';
import * as Tabs from'@radix-ui/react-tabs';
import type { UserProfileData, PostItem, NitroSound, NitroSticker } from'../types';
import { SUBSCRIPTION_PLANS } from'../user-profile-card';


export default function CollectiblesTab({
 profile,
 profileContext,
 isNitroPro,
 subscriptionTier,
 playingSoundId,
 playSoundboardClip,
 handleSelectSubscription
}: any) {
 const mockCollectibles: NitroSticker[] = useMemo(() => [
 { id:'s1', name:'Cyberpunk Neon Wave', emoji:'🌌', rarity:'Nitro Exclusive', animated: true },
 { id:'s2', name:'Super Reaction Spark', emoji:'✨', rarity:'Legendary', animated: true },
 { id:'s3', name:'Golden Dragon Flame', emoji:'🐉', rarity:'Legendary', animated: true },
 { id:'s4', name:'HypeSquad Bravery Badge', emoji:'⚡', rarity:'Rare', animated: false },
 { id:'s5', name:'Active Developer Badge', emoji:'💻', rarity:'Rare', animated: false },
 { id:'s6', name:'Early Supporter 2017', emoji:'👾', rarity:'Nitro Exclusive', animated: true }
 ], []);


 return (
 <>
{/* NITRO COLLECTIBLES TAB CONTENT */}
 <Tabs.Content value="collectibles"className="outline-none">
 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3"aria-label="Collectibles">
 {mockCollectibles.map(item => (
 <li key={item.id} className="bg-slate-50/80 /40 p-4 rounded-2xl border border-[var(--color-border)]/80 flex items-center justify-between">
 <div className="flex items-center gap-3">
 <span className="text-3xl"aria-hidden="true">{item.emoji}</span>
 <div>
 <div className="font-bold text-xs text-[var(--color-text-primary)]">{item.name}</div>
 <span className="text-[10px] font-semibold text-purple-500">{item.rarity}</span>
 </div>
 </div>
 <Sparkles className="w-4 h-4 text-amber-400"aria-hidden="true"/>
 </li>
 ))}
 </ul>
 </Tabs.Content>
 </>
 );
}
