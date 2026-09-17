// @ts-nocheck
import React, { useMemo } from'react';
import { m as motion, AnimatePresence } from'framer-motion';
import { MoreHorizontal, Heart, MessageSquare, Share2, Crown, Zap, Award, Sparkles, Lock, Volume2, Eye, CheckCircle } from'lucide-react';
import * as Tabs from'@radix-ui/react-tabs';
import type { UserProfileData, PostItem, NitroSound, NitroSticker } from'../types';
import { SUBSCRIPTION_PLANS } from'../user-profile-card';


export default function MediaTab({
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
{/* MEDIA TAB CONTENT */}
 <Tabs.Content value="media"className="outline-none">
 <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3"aria-label="Media Gallery">
 {['/ny_skyscrapers.jpg','/ny_skyline.jpg','https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'].map((img, idx) => (
 <li key={`media-item-${idx}`} className="aspect-square rounded-2xl overflow-hidden bg-[#F9F9F7] group relative cursor-pointer focus-within:ring-2 focus-within:ring-purple-500">
 <button type="button"aria-label={`View media ${idx + 1}`} className="w-full h-full text-left outline-none">
 <img src={img} alt={`Media gallery ${idx + 1}`} loading="lazy"className="w-full h-full object-cover group-hover:scale-105 transition duration-300"/>
 <div className="absolute inset-0 bg-[var(--color-surface)]/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
 <Eye className="w-6 h-6 text-slate-800"aria-hidden="true"/>
 </div>
 </button>
 </li>
 ))}
 </ul>
 </Tabs.Content>
 </>
 );
}
