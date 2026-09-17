import React, { useMemo } from'react';
import { Shield, Calendar, Server, Check } from'lucide-react';
import type { UserProfileData, SubscriptionTier, UserStatus } from'./types';

export interface ServerProfileCardProps {
 profile: UserProfileData;
 subscriptionTier?: SubscriptionTier;
 onMessage?: () => void;
 className?: string;
}

export const ServerProfileCard = React.memo(({
 profile,
 subscriptionTier ='free',
 onMessage,
 className =''
}: ServerProfileCardProps) => {
 const isNitroPro = subscriptionTier ==='nitro_pro';

 const statusColors: Record<UserStatus, string> = {
 online:'bg-green-500',
 idle:'bg-amber-500',
 dnd:'bg-red-500',
 offline:'bg-gray-500'
 };

 const statusColor = statusColors[profile.userStatus] || statusColors.offline;

 const displayName = profile.serverNickname || profile.name;
 const avatarUrl = profile.serverAvatar || profile.avatar;
 const bannerUrl = profile.serverBanner || profile.banner;
 const serverName = profile.serverName ||'Official Community Server';

 const containerClasses = useMemo(() => {
 const base ='w-[340px] bg-[#F9F9F7] rounded-2xl overflow-hidden flex flex-col transition-all duration-200';
 const border = isNitroPro 
 ?'border border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.2)]'
 :'border border-[var(--color-border)]';
 return`${base} ${border} ${className}`;
 }, [isNitroPro, className]);

 return (
 <div className={containerClasses} style={{ contain:'content'}}>
 {/* Server Banner */}
 <div 
 className="relative h-28 w-full bg-cover bg-center"
 style={{ backgroundImage:`url(${bannerUrl ||'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'})`}}
 >
 <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-transparent"/>
 <div className="absolute top-3 left-3 bg-[var(--color-surface)]/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-[var(--color-border)] flex items-center gap-1.5">
 {profile.serverIcon ? (
 <img src={profile.serverIcon} alt={serverName} className="w-3.5 h-3.5 rounded-full object-cover"/>
 ) : (
 <Server className="w-3.5 h-3.5 text-purple-400"/>
 )}
 <span className="text-[10px] font-bold text-slate-200 truncate max-w-[160px]">{serverName}</span>
 </div>
 </div>

 {/* Profile Header */}
 <div className="px-4 relative pb-3">
 <div className="relative -mt-10 mb-2 flex justify-between items-end">
 <div className="relative">
 <div className="w-20 h-20 rounded-full border-4 border-slate-950 overflow-hidden bg-[#F9F9F7]">
 <img 
 src={avatarUrl} 
 alt={displayName}
 loading="lazy"
 className="w-full h-full object-cover"
 />
 </div>
 <div 
 className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-4 border-slate-950 ${statusColor}`}
 role="status"
 aria-label={`Status: ${profile.userStatus}`}
 />
 </div>

 <div className="mb-2 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-[10px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
 <Shield className="w-3 h-3 text-purple-400"/>
 Server Profile
 </div>
 </div>

 {/* Names */}
 <div>
 <div className="flex items-center gap-1.5">
 <h2 className="text-lg font-extrabold text-slate-800">{displayName}</h2>
 {profile.verified && (
 <div className="text-blue-400 bg-blue-400/10 rounded-full p-0.5">
 <Check className="w-3.5 h-3.5"/>
 </div>
 )}
 </div>
 <p className="text-xs text-[var(--color-text-secondary)]">Real Name: @{profile.handle}</p>
 </div>
 </div>

 <div className="px-4">
 <div className="border-t border-[var(--color-border)]"/>
 </div>

 {/* Body Section */}
 <div className="px-4 py-3 flex-1 flex flex-col gap-4 overflow-y-auto min-h-0">
 {/* Server Roles Hierarchy */}
 {profile.serverRoles && profile.serverRoles.length > 0 && (
 <div>
 <h3 className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Server Roles ({profile.serverRoles.length})</h3>
 <ul className="flex flex-wrap gap-1.5"aria-label="Server roles">
 {profile.serverRoles.map(role => (
 <li key={role.id} className="flex items-center gap-1.5 bg-[#F9F9F7] border border-[var(--color-border)] rounded-md px-2.5 py-1">
 <div className="w-2.5 h-2.5 rounded-full"style={{ background: role.colorGradient }} aria-hidden="true"/>
 <span className="text-xs font-semibold text-slate-200">{role.name}</span>
 </li>
 ))}
 </ul>
 </div>
 )}

 {/* Member Since Server Date */}
 <div>
 <h3 className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">Server Membership</h3>
 <div className="flex items-center gap-2 text-xs text-slate-300 bg-[#F9F9F7]/60 p-2.5 rounded-xl border border-[var(--color-border)]/80">
 <Calendar className="w-4 h-4 text-purple-400"/>
 <span>Server Member Since <strong className="text-slate-800">{profile.joinedServerDate ||'Nov 02, 2022'}</strong></span>
 </div>
 </div>

 {/* Server Bio / Note */}
 {profile.bio && (
 <div>
 <h3 className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">About Member</h3>
 <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 bg-[#F9F9F7]/40 p-2.5 rounded-xl border border-[var(--color-border)]/50">
 {profile.bio}
 </p>
 </div>
 )}
 </div>

 {/* Footer */}
 <div className="px-4 py-3 bg-[#F9F9F7] border-t border-slate-900">
 <button
 onClick={onMessage}
 className="w-full bg-purple-600 hover:bg-purple-500 text-slate-800 font-bold text-xs py-2 px-3 rounded-xl transition-colors shadow-lg shadow-purple-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
 >
 Message in Server
 </button>
 </div>
 </div>
 );
});

ServerProfileCard.displayName ='ServerProfileCard';
export default ServerProfileCard;
