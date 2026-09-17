// @ts-nocheck
import React, { useMemo } from'react';
import { m as motion, AnimatePresence } from'framer-motion';
import { MoreHorizontal, Heart, MessageSquare, Share2, Crown, Zap, Award, Sparkles, Lock, Volume2, Eye, CheckCircle } from'lucide-react';
import * as Tabs from'@radix-ui/react-tabs';
import type { UserProfileData, PostItem, NitroSound, NitroSticker } from'../types';
import { SUBSCRIPTION_PLANS } from'../user-profile-card';


export default function PostsTab({
 profile,
 profileContext,
 isNitroPro,
 subscriptionTier,
 playingSoundId,
 playSoundboardClip,
 handleSelectSubscription
}: any) {
 const mockPosts: PostItem[] = useMemo(() => [
 {
 id:'p1',
 author: profileContext ==='server'? (profile.serverNickname || profile.name) : profile.name,
 avatar: profile.avatar,
 timestamp:'2 hours ago',
 content:'Just launched our MNC-grade Nitro Profile Dashboard with Next.js, Tailwind CSS & Radix UI primitives! Zero Cumulative Layout Shift (CLS) and 60 FPS frame rates 🔥 What do you think?',
 likes: 342,
 comments: 28,
 shares: 14,
 isNitroClip: true,
 mediaUrl:'/ny_skyline.jpg'
 },
 {
 id:'p2',
 author: profileContext ==='server'? (profile.serverNickname || profile.name) : profile.name,
 avatar: profile.avatar,
 timestamp:'Yesterday at 6:30 PM',
 content:'Configured automated IndexedDB state auto-persistence for 100k+ records. Hydrates in < 20ms with progressive windowing virtualization 🚀',
 likes: 890,
 comments: 64,
 shares: 42,
 mediaUrl:'/ny_skyscrapers.jpg'
 }
 ], [profileContext, profile.name, profile.serverNickname, profile.avatar]);

 
 return (
 <>
{/* POSTS TAB CONTENT */}
 <Tabs.Content value="posts"className="space-y-4 outline-none">
 <ul className="space-y-4"aria-label="User Posts">
 {mockPosts.map((post) => (
 <li key={post.id} className="bg-slate-50/80 /40 p-5 rounded-2xl border border-[var(--color-border)]/80 space-y-3">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2.5">
 <img src={post.avatar} alt={post.author} loading="lazy"className="w-9 h-9 rounded-full object-cover"/>
 <div>
 <div className="font-bold text-xs text-[var(--color-text-primary)] flex items-center gap-1">
 {post.author}
 {post.isNitroClip && (
 <span className="text-[9px] font-bold bg-purple-100 text-purple-600 px-1.5 py-0.2 rounded-full border border-purple-200">
 Nitro Clip ⚡
 </span>
 )}
 </div>
 <div className="text-[10px] text-[var(--color-text-secondary)]">{post.timestamp}</div>
 </div>
 </div>
 <button aria-label="More post options"className="p-1 rounded-full hover:bg-slate-200 :bg-[var(--color-surface)] transition focus-visible:ring-2 focus-visible:ring-purple-500 outline-none">
 <MoreHorizontal className="w-4 h-4 text-[var(--color-text-secondary)]"aria-hidden="true"/>
 </button>
 </div>

 <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
 {post.content}
 </p>

 {post.mediaUrl && (
 <div className="rounded-xl overflow-hidden aspect-video bg-[#F9F9F7]">
 <img src={post.mediaUrl} alt="Post content media"loading="lazy"className="w-full h-full object-cover"/>
 </div>
 )}

 <div className="flex items-center gap-4 pt-2 text-xs text-[var(--color-text-secondary)] border-t border-[var(--color-border)]/60">
 <button aria-label={`Like post, ${post.likes} likes`} className="flex items-center gap-1 hover:text-rose-500 transition cursor-pointer p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-purple-500 outline-none">
 <Heart className="w-3.5 h-3.5"aria-hidden="true"/> {post.likes}
 </button>
 <button aria-label={`Comment on post, ${post.comments} comments`} className="flex items-center gap-1 hover:text-[var(--color-accent-sage)] transition cursor-pointer p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-purple-500 outline-none">
 <MessageSquare className="w-3.5 h-3.5"aria-hidden="true"/> {post.comments}
 </button>
 <button aria-label={`Share post, ${post.shares} shares`} className="flex items-center gap-1 hover:text-purple-500 transition cursor-pointer p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-purple-500 outline-none">
 <Share2 className="w-3.5 h-3.5"aria-hidden="true"/> {post.shares}
 </button>
 </div>
 </li>
 ))}
 </ul>
 </Tabs.Content>
 </>
 );
}
