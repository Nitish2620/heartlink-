import React, { useState, useCallback, useMemo } from'react';
import { 
 MessageSquare, 
 UserPlus, 
 MoreHorizontal, 
 Check, 
 Shield, 
 Server as ServerIcon
} from'lucide-react';
import type { 
 UserProfileData, 
 SubscriptionTier, 
 UserStatus
} from'./types';
import { Calendar } from'lucide-react';
import { AvatarDecorationFrame, ProfileEffectLayer, BannerEffectLayer } from'./decorations';

export interface UserProfilePopoutProps {
 profile: UserProfileData;
 subscriptionTier?: SubscriptionTier;
 onMessage?: () => void;
 onAddFriend?: () => void;
 className?: string;
}

export const UserProfilePopout = React.memo(({
 profile,
 subscriptionTier ='free',
 onMessage,
 onAddFriend,
 className =''
}: UserProfilePopoutProps) => {
 const [note, setNote] = useState('');
 const [quickDmText, setQuickDmText] = useState('');

 const isNitroPro = subscriptionTier ==='nitro_pro';

 const statusColors: Record<UserStatus, string> = {
 online:'bg-green-500',
 idle:'bg-amber-500',
 dnd:'bg-red-500',
 offline:'bg-gray-500'
 };

 const statusColor = statusColors[profile.userStatus] || statusColors.offline;


 const handleNoteChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
 setNote(e.target.value);
 }, []);

 const containerClasses = useMemo(() => {
 const base ='w-[340px] bg-[#F9F9F7] rounded-2xl overflow-hidden flex flex-col transition-all duration-200';
 const border = isNitroPro 
 ?'border border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.2)]'
 :'border border-[var(--color-border)]';
 const themeGradients: Record<string, string> = {
 blurple:'from-indigo-950/80 to-slate-950',
 synthwave_neon:'from-fuchsia-950/80 to-slate-950',
 matcha_mint:'from-emerald-950/80 to-slate-950',
 sakura_breeze:'from-pink-950/80 to-slate-950',
 midnight_gold:'from-amber-950/80 to-slate-950',
 abyssal_shadow:'from-slate-950 to-black',
 };
 
 const bgGradient = (isNitroPro && profile.profileTheme) ? themeGradients[profile.profileTheme] || themeGradients.blurple :'from-slate-950 to-slate-950';
 
 return`${base} bg-gradient-to-b ${bgGradient} ${border} ${className}`;
 }, [isNitroPro, profile.profileTheme, className]);

 const handleQuickDmSubmit = useCallback((e: React.FormEvent) => {
 e.preventDefault();
 if (!quickDmText.trim()) return;
 if (onMessage) onMessage();
 setQuickDmText('');
 }, [quickDmText, onMessage]);

 return (
 <div className={containerClasses} style={{ contain:'content'}}>
 <ProfileEffectLayer effect={isNitroPro ? profile.profileEffect :'none'} />
 {/* Banner */}
 <div 
 className="relative h-28 w-full bg-cover bg-center"
 style={{ backgroundImage:`url(${profile.banner ||'https://images.unsplash.com/photo-1557682250-33bd709cbe85'})`}}
 >
 <BannerEffectLayer effect={isNitroPro ? profile.bannerEffect :'none'} />
 <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-transparent opacity-60 z-0"/>
 
 {isNitroPro && profile.bannerEffect !=='none'&& (
 <div className="absolute top-3 right-3 bg-[#F9F9F7]/80 backdrop-blur-sm border border-purple-500/30 rounded-full px-2 py-1 flex items-center gap-1">
 <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Effect</span>
 </div>
 )}
 </div>

 {/* Profile Info Header */}
 <div className="px-4 relative pb-3">
 {/* Avatar Section */}
 <div className="relative -mt-10 mb-2 flex justify-between items-end">
 <div className="relative group">
 <div className={`relative w-20 h-20 rounded-full border-[6px] border-slate-900 bg-[#F9F9F7] overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-105 relative z-10 ${isNitroPro && profile.avatarDecoration !=='none'?'ring-2 ring-purple-500/50 ring-offset-2 ring-offset-slate-950':''}`}>
 <img 
 src={profile.animatedAvatar || profile.avatar ||'https://github.com/shadcn.png'} 
 alt={profile.name}
 loading="lazy"
 className="w-full h-full object-cover"
 />
 </div>
 
 <AvatarDecorationFrame decoration={isNitroPro ? profile.avatarDecoration :'none'} />

 {/* Status Indicator */}
 <div 
 className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-4 border-slate-950 z-20 ${statusColor}`} 
 role="status"
 aria-label={`Status: ${profile.userStatus}`}
 />
 </div>
 
 {/* Subscription Badge */}
 {isNitroPro ? (
 <div className="mb-2 px-2 py-1 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg text-[10px] font-bold text-slate-800 tracking-wide">
 NITRO PRO
 </div>
 ) : (
 <div className="mb-2 px-2 py-1 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-[10px] font-medium text-slate-300">
 FREE
 </div>
 )}
 </div>

 {/* User Info Block */}
 <div>
 <div className="flex items-center gap-1.5">
 <h2 className="text-lg font-bold text-slate-800">{profile.name}</h2>
 {profile.verified && (
 <div className="text-blue-400 bg-blue-400/10 rounded-full p-0.5">
 <Check className="w-3.5 h-3.5"/>
 </div>
 )}
 </div>
 <div className="flex items-center gap-2">
 <p className="text-xs text-[var(--color-text-secondary)]">@{profile.handle}</p>
 {profile.pronouns && (
 <>
 <span className="text-slate-600 text-xs">•</span>
 <span className="text-xs text-[var(--color-text-secondary)] font-medium">{profile.pronouns}</span>
 </>
 )}
 </div>
 </div>

 {/* Badges */}
 {profile.badges && profile.badges.length > 0 && (
 <ul className="flex flex-wrap gap-1 mt-3"aria-label="User Badges">
 {profile.badges.map(badge => (
 <li 
 key={badge.id}
 className="group relative flex items-center justify-center w-6 h-6 rounded-md bg-[#F9F9F7] border border-[var(--color-border)] hover:border-slate-600 transition-colors cursor-help"
 title={badge.description}
 aria-label={badge.description}
 >
 {/* Fallback shield icon since dynamic icons via string are tricky without mapping */}
 <Shield className="w-3.5 h-3.5"style={{ color: badge.color ||'#94a3b8'}} aria-hidden="true"/>
 </li>
 ))}
 </ul>
 )}
 </div>

 <div className="px-4">
 <div className="border-t border-[var(--color-border)]"/>
 </div>

 {/* Scrollable Content Area */}
 <div className="px-4 py-3 flex-1 flex flex-col gap-4 overflow-y-auto min-h-0 custom-scrollbar">
 
 {/* Custom Status */}
 {profile.customStatus && (
 <div className="flex items-center gap-2 px-3 py-2 bg-[#F9F9F7]/50 border border-[var(--color-border)]/50 rounded-lg">
 {profile.customStatusEmoji && <span className="text-sm">{profile.customStatusEmoji}</span>}
 <p className="text-xs text-slate-200">{profile.customStatus}</p>
 </div>
 )}

 {/* About Me */}
 {profile.bio && (
 <div>
 <h3 className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">About Me</h3>
 <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
 {profile.bio}
 </p>
 </div>
 )}

 {/* Server Roles */}
 {((profile.serverRoles && profile.serverRoles.length > 0) || (profile.badges && profile.badges.length > 0)) && (
 <div>
 <h3 className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">Roles</h3>
 <ul className="flex flex-wrap gap-1.5"aria-label="Roles">
 {profile.serverRoles && profile.serverRoles.length > 0 ? (
 profile.serverRoles.map(role => (
 <li key={role.id} className="flex items-center gap-1.5 bg-[#F9F9F7]/90 border border-[var(--color-border)] rounded-md px-2 py-0.5">
 <div className="w-2 h-2 rounded-full"style={{ background: role.colorGradient }} aria-hidden="true"/>
 <span className="text-xs font-medium text-slate-200">{role.name}</span>
 </li>
 ))
 ) : (
 <>
 <li className="flex items-center gap-1.5 bg-[var(--color-surface)]/80 border border-[var(--color-border)] rounded-md px-2 py-0.5">
 <div className="w-2 h-2 rounded-full bg-indigo-400"aria-hidden="true"/>
 <span className="text-xs font-medium text-slate-200">Admin</span>
 </li>
 <li className="flex items-center gap-1.5 bg-[var(--color-surface)]/80 border border-[var(--color-border)] rounded-md px-2 py-0.5">
 <div className="w-2 h-2 rounded-full bg-fuchsia-400"aria-hidden="true"/>
 <span className="text-xs font-medium text-slate-200">Nitro Booster</span>
 </li>
 </>
 )}
 </ul>
 </div>
 )}

 {/* Member Since dates */}
 {(profile.joinedDiscordDate || profile.joinedServerDate) && (
 <div>
 <h3 className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">Member Since</h3>
 <div className="flex flex-col gap-1 text-xs text-slate-300">
 {profile.joinedDiscordDate && (
 <div className="flex items-center gap-2">
 <Calendar className="w-3.5 h-3.5 text-[var(--color-text-secondary)]"/>
 <span>Discord: <strong className="text-slate-200">{profile.joinedDiscordDate}</strong></span>
 </div>
 )}
 {profile.joinedServerDate && (
 <div className="flex items-center gap-2">
 <Calendar className="w-3.5 h-3.5 text-[var(--color-text-secondary)]"/>
 <span>Server: <strong className="text-slate-200">{profile.joinedServerDate}</strong></span>
 </div>
 )}
 </div>
 </div>
 )}

 {/* Mutuals Summaries */}
 <div className="flex flex-col gap-2 border-t border-[var(--color-border)]/50 pt-3">
 {profile.mutualServers && profile.mutualServers.length > 0 && (
 <button type="button"aria-label={`View ${profile.mutualServers.length} mutual servers`} className="w-full flex items-center justify-between cursor-pointer group hover:bg-[#F9F9F7]/50 p-1.5 -mx-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
 <div className="flex items-center gap-2 text-[var(--color-text-secondary)] group-hover:text-slate-200 transition-colors">
 <span className="text-xs font-medium">{profile.mutualServers.length} Mutual Servers</span>
 </div>
 <ul className="flex -space-x-2"aria-label="Mutual Servers Icons">
 {profile.mutualServers.slice(0, 3).map((server, i) => (
 <li key={server.id} className="w-6 h-6 rounded-full border border-slate-950 bg-[var(--color-surface)] flex items-center justify-center overflow-hidden z-[3]"style={{ zIndex: 3 - i }}>
 {server.icon ? <img src={server.icon} alt={server.name} className="w-full h-full object-cover"/> : <ServerIcon className="w-3 h-3"aria-hidden="true"/>}
 </li>
 ))}
 </ul>
 </button>
 )}
 {profile.mutualFriends && profile.mutualFriends.length > 0 && (
 <button type="button"aria-label={`View ${profile.mutualFriends.length} mutual friends`} className="w-full flex items-center justify-between cursor-pointer group hover:bg-[#F9F9F7]/50 p-1.5 -mx-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
 <div className="flex items-center gap-2 text-[var(--color-text-secondary)] group-hover:text-slate-200 transition-colors">
 <span className="text-xs font-medium">{profile.mutualFriends.length} Mutual Friends</span>
 </div>
 <ul className="flex -space-x-2"aria-label="Mutual Friends Avatars">
 {profile.mutualFriends.slice(0, 3).map((friend, i) => (
 <li key={friend.id} className="w-6 h-6 rounded-full border border-slate-950 bg-[var(--color-surface)] overflow-hidden z-[3]"style={{ zIndex: 3 - i }}>
 <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover"/>
 </li>
 ))}
 </ul>
 </button>
 )}
 </div>

 {/* Note Field */}
 <div className="flex flex-col gap-1.5">
 <label htmlFor="popout-note-input"className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block">Note</label>
 <textarea
 id="popout-note-input"
 value={note}
 onChange={handleNoteChange}
 placeholder="Click to add a note"
 className="w-full bg-[#F9F9F7] border border-[var(--color-border)] rounded-lg p-2 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus-visible:ring-2 focus-visible:ring-indigo-500/50 resize-none transition-all"
 rows={2}
 />
 </div>
 </div>

 {/* Quick Message Bar */}
 <form onSubmit={handleQuickDmSubmit} className="px-4 py-2.5 bg-[#F9F9F7]/90 backdrop-blur-sm border-t border-slate-900 flex gap-2 items-center">
 <label htmlFor="quick-dm-input"className="sr-only">Send quick message</label>
 <input
 id="quick-dm-input"
 type="text"
 value={quickDmText}
 onChange={(e) => setQuickDmText(e.target.value)}
 placeholder={`Message @${profile.handle}...`}
 className="flex-1 bg-[#F9F9F7] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
 />
 <button 
 type="submit"
 className="flex items-center justify-center bg-[var(--color-accent-sage)] hover:bg-[var(--color-accent-sage)] text-slate-800 p-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
 title="Send DM"
 aria-label="Send DM"
 >
 <MessageSquare className="w-3.5 h-3.5"aria-hidden="true"/>
 </button>
 <button 
 type="button"
 onClick={onAddFriend}
 className="flex items-center justify-center bg-[var(--color-surface)] hover:bg-slate-700 text-slate-800 p-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
 title="Add Friend"
 aria-label="Add Friend"
 >
 <UserPlus className="w-3.5 h-3.5 text-slate-300"aria-hidden="true"/>
 </button>
 <button 
 type="button"
 className="flex items-center justify-center bg-[var(--color-surface)] hover:bg-slate-700 text-slate-800 p-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
 title="More Options"
 aria-label="More Options"
 >
 <MoreHorizontal className="w-3.5 h-3.5 text-slate-300"aria-hidden="true"/>
 </button>
 </form>
 </div>
 );
});

UserProfilePopout.displayName ='UserProfilePopout';

export default UserProfilePopout;
