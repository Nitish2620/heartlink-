import React, { useState, useMemo } from'react';
import * as Dialog from'@radix-ui/react-dialog';
import {
 X,
 MessageSquare,
 UserPlus,
 Music,
 Gamepad2,
 Shield,
 Check,
 MapPin,
 Calendar,
 Users,
 Server as ServerIcon,
 Radio,
 Globe,
 ExternalLink,
 Heart,
 Sparkles
} from'lucide-react';
import { AvatarDecorationFrame, ProfileEffectLayer, BannerEffectLayer } from'./decorations';
import type {
 UserProfileData,
 SubscriptionTier,
 ProfileTheme,
 UserStatus,
 ProfilePrompt,
} from'./types';

export interface UserProfileModalProps {
 profile: UserProfileData;
 isOpen: boolean;
 onClose: () => void;
 subscriptionTier?: SubscriptionTier;
 onMessage?: () => void;
 onAddFriend?: () => void;
 onSendOpener?: (question: string, answer: string) => void;
 className?: string;
}

const getStatusColor = (status: UserStatus) => {
 switch (status) {
 case'online': return'bg-green-500';
 case'idle': return'bg-yellow-500';
 case'dnd': return'bg-red-500';
 case'offline': return'bg-slate-500';
 default: return'bg-slate-500';
 }
};

const getPlatformIcon = (platform: string) => {
 switch (platform.toLowerCase()) {
 case'github':
 return (
 <svg className="w-4 h-4 text-slate-200"viewBox="0 0 24 24"fill="currentColor">
 <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
 </svg>
 );
 case'twitter':
 case'x':
 return (
 <svg className="w-4 h-4 text-sky-400"viewBox="0 0 24 24"fill="currentColor">
 <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
 </svg>
 );
 case'spotify':
 return (
 <svg className="w-4 h-4 text-green-500"viewBox="0 0 24 24"fill="currentColor">
 <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.66.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38C8.88 5.88 15.96 6.12 20.28 8.7c.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.56.42z"/>
 </svg>
 );
 case'twitch':
 return (
 <svg className="w-4 h-4 text-purple-400"viewBox="0 0 24 24"fill="currentColor">
 <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
 </svg>
 );
 case'youtube':
 return (
 <svg className="w-4 h-4 text-red-500"viewBox="0 0 24 24"fill="currentColor">
 <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
 </svg>
 );
 case'steam':
 return (
 <svg className="w-4 h-4 text-sky-300"viewBox="0 0 24 24"fill="currentColor">
 <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.03 4.524 4.524s-2.03 4.524-4.524 4.524h-.105l-4.076 2.911c0 .052.005.105.005.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.155-3.331-2.707L.425 15.19C1.863 20.354 6.48 24 11.979 24c6.627 0 12-5.373 12-12s-5.373-12-12-12z"/>
 </svg>
 );
 default:
 return <Globe className="w-4 h-4 text-purple-400"/>;
 }
};

const getThemeBorderColor = (theme: ProfileTheme, subTier: SubscriptionTier) => {
 if (subTier ==='free') return'border-[var(--color-border)]';
 switch (theme) {
 case'blurple': return'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]';
 case'nitro_pink': return'border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.2)]';
 case'cyber_emerald': return'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
 case'solar_gold': return'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]';
 case'midnight_obsidian': return'border-[var(--color-border)] shadow-[0_0_15px_rgba(51,65,85,0.2)]';
 case'synthwave_neon': return'border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.2)]';
 case'custom_hex': return'border-[var(--custom-border-color)] shadow-[0_0_15px_var(--custom-border-color)]';
 default: return'border-[var(--color-border)]';
 }
};

export const UserProfileModal = React.memo(({
 profile,
 isOpen,
 onClose,
 subscriptionTier ='free',
 onMessage,
 onAddFriend,
 onSendOpener,
 className =''
}: UserProfileModalProps) => {
 const [activeTab, setActiveTab] = useState<'about'|'mutual_servers'|'mutual_friends'>('about');

 const tabs = useMemo(() => ['about','mutual_servers','mutual_friends'] as const, []);

 const handleTabKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
 let nextIndex = index;
 if (e.key ==='ArrowRight'|| e.key ==='ArrowDown') {
 nextIndex = (index + 1) % tabs.length;
 } else if (e.key ==='ArrowLeft'|| e.key ==='ArrowUp') {
 nextIndex = (index - 1 + tabs.length) % tabs.length;
 } else if (e.key ==='Home') {
 nextIndex = 0;
 } else if (e.key ==='End') {
 nextIndex = tabs.length - 1;
 } else {
 return;
 }
 e.preventDefault();
 const nextTab = tabs[nextIndex];
 setActiveTab(nextTab);
 // Focus the new tab
 requestAnimationFrame(() => {
 document.getElementById(`tab-${nextTab}`)?.focus();
 });
 }, [tabs]);

 const themeStyle = useMemo(() => {
 if (subscriptionTier ==='nitro_pro'&& profile.profileTheme ==='custom_hex'&& profile.customThemeColor) {
 return {'--custom-border-color': profile.customThemeColor } as React.CSSProperties;
 }
 return {};
 }, [profile.profileTheme, profile.customThemeColor, subscriptionTier]);

 const formattedHandle = useMemo(() => {
 if (!profile.handle) return'';
 return profile.handle.startsWith('@') ? profile.handle :`@${profile.handle}`;
 }, [profile.handle]);

 const formatTime = (seconds: number) => {
 const mins = Math.floor(seconds / 60);
 const secs = Math.floor(seconds % 60);
 return`${mins}:${secs < 10 ?'0':''}${secs}`;
 };

 const [liveSpotifySeconds, setLiveSpotifySeconds] = useState<number>(profile.spotifyPresence?.currentSeconds || 0);

 React.useEffect(() => {
 if (!profile.spotifyPresence) return;
 setLiveSpotifySeconds(profile.spotifyPresence.currentSeconds);
 }, [profile.spotifyPresence]);

 React.useEffect(() => {
 if (!isOpen || !profile.spotifyPresence?.isPlaying) return;
 const interval = setInterval(() => {
 setLiveSpotifySeconds(prev => {
 const max = profile.spotifyPresence?.durationSeconds || 300;
 return prev >= max ? 0 : prev + 1;
 });
 }, 1000);
 return () => clearInterval(interval);
 }, [isOpen, profile.spotifyPresence?.isPlaying, profile.spotifyPresence?.durationSeconds]);

 const spotifyProgress = useMemo(() => {
 if (!profile.spotifyPresence) return 0;
 const duration = profile.spotifyPresence.durationSeconds;
 if (duration <= 0) return 0;
 return Math.min(100, Math.max(0, (liveSpotifySeconds / duration) * 100));
 }, [profile.spotifyPresence, liveSpotifySeconds]);

 const hasActivity = profile.spotifyPresence || profile.gamePresence || (profile.serverRoles && profile.serverRoles.length > 0);

 return (
 <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
 <Dialog.Portal>
 <Dialog.Overlay className="fixed inset-0 bg-[var(--color-surface)]/80 backdrop-blur-sm z-50 transition-opacity"/>
 <Dialog.Content 
 className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[600px] max-w-full max-h-[85vh] flex flex-col bg-[#F9F9F7] rounded-2xl border ${getThemeBorderColor(profile.profileTheme, subscriptionTier)} overflow-hidden focus:outline-none ${className}`}
 style={themeStyle}
 >
 <Dialog.Title className="sr-only">User Profile for {profile.name}</Dialog.Title>
 <Dialog.Description className="sr-only">Detailed user profile, activity, and connections.</Dialog.Description>
 <ProfileEffectLayer effect={subscriptionTier ==='nitro_pro'? profile.profileEffect :'none'} />
 {/* Banner & Header section */}
 <div className="relative w-full h-36 bg-[var(--color-surface)] shrink-0">
 {profile.banner ? (
 <div 
 className="absolute inset-0 bg-cover bg-center"
 style={{ backgroundImage:`url(${profile.banner})`}}
 >
 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-0"/>
 <BannerEffectLayer effect={subscriptionTier ==='nitro_pro'? profile.bannerEffect :'none'} />
 </div>
 ) : (
 <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-950 to-slate-950"/>
 )}
 
 {subscriptionTier ==='nitro_pro'&& profile.bannerEffect && profile.bannerEffect !=='none'&& (
 <div className="absolute top-3 left-4 bg-[#F9F9F7]/70 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-purple-300 border border-purple-500/30 flex items-center gap-1.5 z-10 shadow-lg">
 <Shield className="w-3.5 h-3.5 text-purple-400"/>
 <span>Banner Effect Active</span>
 </div>
 )}
 
 <Dialog.Close className="absolute top-3 right-3 bg-[#F9F9F7]/70 hover:bg-[#F9F9F7] backdrop-blur-md transition-colors p-2 rounded-full text-slate-300 hover:text-slate-800 z-20 focus:outline-none border border-[var(--color-border)] shadow-lg cursor-pointer">
 <X className="w-4 h-4"/>
 </Dialog.Close>
 </div>

 <div className="flex flex-col flex-1 min-h-0">
 <div className="grid grid-cols-[1fr_240px] flex-1 min-h-0">
 
 {/* Left Column */}
 <div className="flex flex-col bg-[#F9F9F7] border-r border-[var(--color-border)]/80 relative min-h-0">
 {/* Non-scrolling identity header with unclipped Avatar */}
 <div className="px-6 pb-0 pt-0 relative z-20 shrink-0">
 {/* Avatar wrapper */}
 <div className="relative -mt-12 mb-3 w-24 h-24 rounded-full border-4 border-slate-950 bg-[var(--color-surface)] z-30 drop-shadow-xl">
 <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full object-cover"/>
 
 
 <AvatarDecorationFrame decoration={subscriptionTier ==='nitro_pro'? profile.avatarDecoration :'none'} />
 
 <div 
 className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-slate-950 ${getStatusColor(profile.userStatus)}`} 
 role="status"
 aria-label={`Status: ${profile.userStatus}`}
 />
 </div>

 <div className="flex flex-col gap-0.5 mb-3">
 <div className="flex items-center gap-2">
 <h2 className="text-xl font-extrabold text-slate-800">{profile.name}</h2>
 {profile.verified && <Check className="w-4 h-4 text-slate-800 bg-[var(--color-accent-sage)] rounded-full p-0.5"/>}
 </div>
 <div className="flex items-center gap-2">
 <span className="text-sm text-[var(--color-text-secondary)]">{formattedHandle}</span>
 {profile.pronouns && (
 <>
 <span className="text-slate-600 text-sm">•</span>
 <span className="text-sm text-[var(--color-text-secondary)] font-medium">{profile.pronouns}</span>
 </>
 )}
 </div>
 </div>

 {profile.badges && profile.badges.length > 0 && (
 <ul className="flex flex-wrap gap-1.5 mb-3"aria-label="User badges">
 {profile.badges.map(badge => (
 <li 
 key={badge.id}
 className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#F9F9F7] border border-[var(--color-border)]"
 title={badge.description}
 aria-label={badge.description}
 >
 <div className="w-2 h-2 rounded-full"style={{ backgroundColor: badge.color }} aria-hidden="true"/>
 <span className="text-[11px] font-medium text-slate-300">{badge.name}</span>
 </li>
 ))}
 </ul>
 )}

 {profile.customStatus && (
 <div className="flex items-center gap-2 text-xs text-slate-300 mb-3 bg-[#F9F9F7]/60 p-2 rounded-lg border border-[var(--color-border)]/80">
 {profile.customStatusEmoji && <span>{profile.customStatusEmoji}</span>}
 <span>{profile.customStatus}</span>
 </div>
 )}

 {/* Tab Navigation */}
 <div className="flex border-b border-[var(--color-border)]"role="tablist"aria-label="Profile Sections">
 <button
 role="tab"
 aria-selected={activeTab ==='about'}
 aria-controls="panel-about"
 id="tab-about"
 tabIndex={activeTab ==='about'? 0 : -1}
 onKeyDown={(e) => handleTabKeyDown(e, 0)}
 onClick={() => setActiveTab('about')}
 className={`px-3 py-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset ${activeTab ==='about'?'text-slate-800 border-b-2 border-indigo-500':'text-[var(--color-text-secondary)] hover:text-slate-200'}`}
 >
 About Me
 </button>
 <button
 role="tab"
 aria-selected={activeTab ==='mutual_servers'}
 aria-controls="panel-mutual_servers"
 id="tab-mutual_servers"
 tabIndex={activeTab ==='mutual_servers'? 0 : -1}
 onKeyDown={(e) => handleTabKeyDown(e, 1)}
 onClick={() => setActiveTab('mutual_servers')}
 className={`px-3 py-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset ${activeTab ==='mutual_servers'?'text-slate-800 border-b-2 border-indigo-500':'text-[var(--color-text-secondary)] hover:text-slate-200'}`}
 >
 Mutual Servers
 </button>
 <button
 role="tab"
 aria-selected={activeTab ==='mutual_friends'}
 aria-controls="panel-mutual_friends"
 id="tab-mutual_friends"
 tabIndex={activeTab ==='mutual_friends'? 0 : -1}
 onKeyDown={(e) => handleTabKeyDown(e, 2)}
 onClick={() => setActiveTab('mutual_friends')}
 className={`px-3 py-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset ${activeTab ==='mutual_friends'?'text-slate-800 border-b-2 border-indigo-500':'text-[var(--color-text-secondary)] hover:text-slate-200'}`}
 >
 Mutual Friends
 </button>
 </div>
 </div>

 {/* Scrollable Tab Content Area */}
 <div className="px-6 py-4 flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[var(--color-surface)] [&::-webkit-scrollbar-thumb]:rounded-full">

 <div className="text-slate-300 text-sm">
 {activeTab ==='about'&& (
 <div id="panel-about"role="tabpanel"aria-labelledby="tab-about"className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
 <p className="whitespace-pre-wrap leading-relaxed">{profile.bio}</p>
 
 <div className="flex flex-col gap-2 mt-2">
 {profile.location && (
 <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
 <MapPin className="w-4 h-4"/>
 <span>{profile.location}</span>
 </div>
 )}
 {profile.joinedDiscordDate && (
 <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
 <Calendar className="w-4 h-4 text-[var(--color-accent-sage)]"/>
 <span>Discord Member since <strong className="text-slate-200">{profile.joinedDiscordDate}</strong></span>
 </div>
 )}
 {profile.joinedServerDate && (
 <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
 <Calendar className="w-4 h-4 text-purple-400"/>
 <span>Server Member since <strong className="text-slate-200">{profile.joinedServerDate}</strong></span>
 </div>
 )}
 {!profile.joinedDiscordDate && !profile.joinedServerDate && (
 <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
 <Calendar className="w-4 h-4"/>
 <span>Member since {new Date().getFullYear() - 2}</span>
 </div>
 )}
 </div>
 
 {profile.connectedAccounts && profile.connectedAccounts.length > 0 && (
 <div className="mt-4 pt-4 border-t border-[var(--color-border)]/50">
 <h3 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Connections</h3>
 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2"aria-label="Connected accounts">
 {profile.connectedAccounts.map(account => (
 <li key={account.id}>
 <a 
 href={account.url}
 target="_blank"
 rel="noopener noreferrer"
 className="flex items-center gap-3 p-2.5 rounded-lg bg-[#F9F9F7]/50 border border-[var(--color-border)] hover:bg-[var(--color-surface)] hover:border-[var(--color-border)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
 aria-label={`Open ${account.name} on ${account.platform}`}
 >
 <span aria-hidden="true">{getPlatformIcon(account.platform)}</span>
 <span className="text-sm font-medium text-slate-200 truncate">{account.name}</span>
 <ExternalLink className="w-3 h-3 text-[var(--color-text-secondary)] ml-auto"aria-hidden="true"/>
 </a>
 </li>
 ))}
 </ul>
 </div>
 )}

 {/* Hinge-style Prompts & Conversation Starters */}
 {profile.prompts && profile.prompts.length > 0 && (
 <div className="mt-4 pt-4 border-t border-[var(--color-border)]/50">
 <div className="flex items-center gap-1.5 mb-3">
 <Sparkles className="w-4 h-4 text-rose-500 animate-pulse" />
 <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
 HeartLink Prompts & Opener Spells
 </h3>
 </div>
 <div className="flex flex-col gap-3">
 {profile.prompts.map((p) => (
 <div 
 key={p.id}
 className="p-3.5 rounded-xl bg-gradient-to-br from-rose-50/70 via-purple-50/50 to-indigo-50/40 border border-rose-200/80 shadow-xs flex flex-col gap-1.5 relative group hover:border-rose-400 transition"
 >
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-bold tracking-wider text-rose-600 uppercase px-2 py-0.5 rounded-full bg-rose-100/70">
 {p.category || 'Dating Style'}
 </span>
 {p.likesCount !== undefined && (
 <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
 <Heart className="w-3 h-3 fill-rose-400 text-rose-400" /> {p.likesCount}
 </span>
 )}
 </div>
 <h4 className="text-xs font-extrabold text-slate-800">
 "{p.question}"
 </h4>
 <p className="text-xs text-slate-700 font-medium italic bg-white/80 p-2.5 rounded-lg border border-rose-100/80 shadow-2xs leading-relaxed">
 {p.answer}
 </p>
 {onSendOpener && (
 <button
 type="button"
 onClick={() => onSendOpener(p.question, p.answer)}
 className="mt-1 self-end inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-sm transition active:scale-95 cursor-pointer"
 >
 <Heart className="w-3.5 h-3.5 fill-white" />
 <span>Send Opener</span>
 </button>
 )}
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 )}

 {activeTab ==='mutual_servers'&& (
 <div id="panel-mutual_servers"role="tabpanel"aria-labelledby="tab-mutual_servers"className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
 {profile.mutualServers && profile.mutualServers.length > 0 ? (
 <ul className="flex flex-col gap-3"aria-label="Mutual servers">
 {profile.mutualServers.map(server => (
 <li key={server.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--color-surface)]/50 transition-colors cursor-pointer">
 <img src={server.icon} alt={`${server.name} icon`} className="w-10 h-10 rounded-xl bg-[var(--color-surface)] object-cover"/>
 <div className="flex flex-col">
 <span className="font-semibold text-slate-200">{server.name}</span>
 <span className="text-xs text-[var(--color-text-secondary)]">{server.memberCount.toLocaleString()} members</span>
 </div>
 </li>
 ))}
 </ul>
 ) : (
 <div className="flex flex-col items-center justify-center py-8 text-[var(--color-text-secondary)]">
 <ServerIcon className="w-8 h-8 mb-2 opacity-20"aria-hidden="true"/>
 <span>No mutual servers</span>
 </div>
 )}
 </div>
 )}

 {activeTab ==='mutual_friends'&& (
 <div id="panel-mutual_friends"role="tabpanel"aria-labelledby="tab-mutual_friends"className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
 {profile.mutualFriends && profile.mutualFriends.length > 0 ? (
 <ul className="flex flex-col gap-3"aria-label="Mutual friends">
 {profile.mutualFriends.map(friend => (
 <li key={friend.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--color-surface)]/50 transition-colors cursor-pointer">
 <div className="relative">
 <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full bg-[var(--color-surface)] object-cover"/>
 <div 
 className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-950 ${getStatusColor(friend.status)}`}
 role="status"
 aria-label={`Status: ${friend.status}`}
 />
 </div>
 <div className="flex flex-col">
 <span className="font-semibold text-slate-200">{friend.name}</span>
 <span className="text-xs text-[var(--color-text-secondary)]">@{friend.handle}</span>
 </div>
 </li>
 ))}
 </ul>
 ) : (
 <div className="flex flex-col items-center justify-center py-8 text-[var(--color-text-secondary)]">
 <Users className="w-8 h-8 mb-2 opacity-20"aria-hidden="true"/>
 <span>No mutual friends</span>
 </div>
 )}
 </div>
 )}
 </div>
 
 <div className="mt-8 pt-4 border-t border-[var(--color-border)]/50 flex flex-col gap-2">
 <label htmlFor="modal-note-input"className="text-xs font-bold text-[var(--color-text-secondary)] uppercase block">Note</label>
 <textarea 
 id="modal-note-input"
 placeholder="Click to add a note"
 className="w-full bg-[#F9F9F7]/50 hover:bg-[#F9F9F7] border border-transparent hover:border-[var(--color-border)] focus:border-indigo-500 rounded-lg p-2.5 text-sm text-slate-200 resize-none transition-colors outline-none h-16 focus:bg-[#F9F9F7] focus-visible:ring-2 focus-visible:ring-indigo-400"
 />
 </div>
 </div>
 </div>

 {/* Right Column */}
 <div className="bg-[#F9F9F7]/40 p-6 flex flex-col gap-6 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[var(--color-surface)] [&::-webkit-scrollbar-thumb]:rounded-full">
 {hasActivity ? (
 <>
 {/* Activity Header */}
 <div className="flex flex-col gap-1">
 <h3 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Current Activity</h3>
 </div>

 {/* Spotify Widget */}
 {profile.spotifyPresence && (
 <div className="flex flex-col gap-3 p-3 rounded-xl bg-[#F9F9F7] border border-[var(--color-border)] hover:border-[var(--color-border)] transition-colors group">
 <div className="flex items-center gap-2 mb-1">
 <Music className="w-3.5 h-3.5 text-green-500"/>
 <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Listening to Spotify</span>
 </div>
 <div className="flex gap-3">
 <img 
 src={profile.spotifyPresence.albumArt} 
 alt="Album Art"
 className="w-14 h-14 rounded-md object-cover bg-[var(--color-surface)] shadow-md group-hover:shadow-lg transition-shadow"
 />
 <div className="flex flex-col justify-center flex-1 min-w-0">
 <span className="text-sm font-bold text-slate-800 truncate">{profile.spotifyPresence.song}</span>
 <span className="text-xs text-[var(--color-text-secondary)] truncate hover:underline cursor-pointer">{profile.spotifyPresence.artist}</span>
 </div>
 </div>
 <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-text-secondary)] mt-1">
 <span>{formatTime(liveSpotifySeconds)}</span>
 <div className="flex-1 mx-2 bg-[var(--color-surface)] h-1.5 rounded-full overflow-hidden">
 <div 
 className="h-full bg-green-500 transition-all duration-1000 ease-linear rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"
 style={{ width:`${spotifyProgress}%`}}
 />
 </div>
 <span>{formatTime(profile.spotifyPresence.durationSeconds)}</span>
 </div>
 <button 
 type="button"
 className="mt-1 w-full py-1.5 px-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
 >
 <Music className="w-3.5 h-3.5"aria-hidden="true"/>
 Listen Along on Spotify
 </button>
 </div>
 )}

 {/* Game Widget */}
 {profile.gamePresence && (
 <div className="flex flex-col gap-3 p-3 rounded-xl bg-[#F9F9F7] border border-[var(--color-border)] hover:border-[var(--color-border)] transition-colors">
 <div className="flex items-center gap-2 mb-1">
 <Gamepad2 className="w-3.5 h-3.5 text-[var(--color-accent-sage)]"/>
 <span className="text-[10px] font-bold text-[var(--color-accent-sage)] uppercase tracking-wider">Playing a game</span>
 </div>
 <div className="flex gap-3">
 <img src={profile.gamePresence.icon} alt="Game Icon"className="w-14 h-14 rounded-xl object-cover bg-[var(--color-surface)]"/>
 <div className="flex flex-col justify-center flex-1 min-w-0">
 <span className="text-sm font-bold text-slate-800 truncate">{profile.gamePresence.name}</span>
 <span className="text-xs text-[var(--color-text-secondary)] truncate">{profile.gamePresence.details}</span>
 <span className="text-[10px] text-[var(--color-text-secondary)] truncate mt-0.5">{profile.gamePresence.elapsedTime}</span>
 </div>
 </div>
 <button 
 type="button"
 className="mt-1 w-full py-1.5 px-3 bg-[var(--color-accent-sage)] hover:bg-[var(--color-accent-sage)] text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
 >
 <Gamepad2 className="w-3.5 h-3.5"aria-hidden="true"/>
 Ask to Join Game
 </button>
 </div>
 )}

 {/* Roles */}
 {profile.serverRoles && profile.serverRoles.length > 0 && (
 <div className="mt-2">
 <h3 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Roles</h3>
 <ul className="flex flex-wrap gap-1.5"aria-label="Roles">
 {profile.serverRoles.map(role => (
 <li 
 key={role.id}
 className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#F9F9F7] border border-[var(--color-border)] hover:bg-[var(--color-surface)] hover:border-[var(--color-border)] transition-colors cursor-pointer"
 >
 <div className="w-2.5 h-2.5 rounded-full"style={{ background: role.colorGradient }} aria-hidden="true"/>
 <span className="text-xs font-medium text-slate-300">{role.name}</span>
 </li>
 ))}
 </ul>
 </div>
 )}
 </>
 ) : (
 <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-secondary)] gap-3 opacity-60">
 <Radio className="w-12 h-12"/>
 <span className="text-sm font-medium">No current activity</span>
 </div>
 )}
 </div>
 </div>

 {/* Action Bar */}
 <div className="p-4 bg-[#F9F9F7] border-t border-[var(--color-border)]/80 flex gap-3 shrink-0">
 <button 
 onClick={onMessage}
 className="flex-1 bg-[var(--color-accent-sage)] hover:bg-[var(--color-accent-sage)] text-slate-800 font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
 >
 <MessageSquare className="w-4 h-4"aria-hidden="true"/>
 Send Message
 </button>
 <button 
 onClick={onAddFriend}
 className="bg-[var(--color-surface)] hover:bg-slate-700 text-slate-200 font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors border border-[var(--color-border)] hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
 >
 <UserPlus className="w-4 h-4"aria-hidden="true"/>
 Add Friend
 </button>
 </div>
 </div>
 </Dialog.Content>
 </Dialog.Portal>
 </Dialog.Root>
 );
});

UserProfileModal.displayName ='UserProfileModal';
export default UserProfileModal;
