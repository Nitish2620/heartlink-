import React, { useState } from'react';
import { Mic, MicOff, Headphones, Settings } from'lucide-react';
import type { UserProfileData, UserStatus } from'../user-profile-card/types';
import { AvatarDecorationFrame } from'../user-profile-card/decorations';

interface UserFooterBarProps {
 profile: UserProfileData;
 onOpenSettings?: () => void;
}

export const UserFooterBar = React.memo(({ profile, onOpenSettings }: UserFooterBarProps) => {
 const [isMuted, setIsMuted] = useState(false);
 const [isDeafened, setIsDeafened] = useState(false);

 const statusColors: Record<UserStatus, string> = {
 online:'bg-green-500',
 idle:'bg-amber-500',
 dnd:'bg-red-500',
 offline:'bg-slate-500'
 };

 const statusColor = statusColors[profile.userStatus] || statusColors.offline;
 const isNitroPro = profile.subscriptionTier ==='nitro_pro';

 return (
 <div className="h-14 bg-[#F9F9F7]/90 border-t border-slate-900 px-2 flex items-center justify-between shrink-0 select-none z-10">
 
 {/* User Info Button (Click opens quick settings) */}
 <button
 onClick={onOpenSettings}
 className="flex items-center gap-2 p-1 rounded-md hover:bg-[#F9F9F7] transition-colors flex-1 min-w-0 mr-1 text-left cursor-pointer group"
 >
 <div className="relative shrink-0">
 <div className={`w-8 h-8 rounded-full bg-[var(--color-surface)] overflow-hidden border border-[var(--color-border)]/80 ${
 isNitroPro && profile.avatarDecoration !=='none'?'ring-1 ring-purple-500':''
 }`}>
 <img 
 src={profile.avatar ||'https://github.com/shadcn.png'} 
 alt={profile.name} 
 className="w-full h-full object-cover"
 />
 </div>

 <AvatarDecorationFrame decoration={isNitroPro ? profile.avatarDecoration :'none'} />

 {/* User Status Dot */}
 <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-950 ${statusColor}`} />
 </div>

 <div className="flex flex-col min-w-0 leading-tight">
 <span className="text-xs font-bold text-slate-800 group-hover:text-slate-800 truncate">
 {profile.name}
 </span>
 <span className="text-[10px] text-[var(--color-text-secondary)] truncate">
 {profile.customStatus ||`@${profile.handle}`}
 </span>
 </div>
 </button>

 {/* Control Buttons */}
 <div className="flex items-center gap-0.5 shrink-0">
 {/* Mute Mic */}
 <button
 onClick={() => setIsMuted(!isMuted)}
 className={`p-1.5 rounded-md hover:bg-[#F9F9F7] transition-colors cursor-pointer ${
 isMuted ?'text-red-400 hover:text-red-300 bg-red-500/10':'text-[var(--color-text-secondary)] hover:text-slate-200'
 }`}
 title={isMuted ?'Unmute Microphone':'Mute Microphone'}
 >
 {isMuted ? <MicOff className="w-4 h-4"/> : <Mic className="w-4 h-4"/>}
 </button>

 {/* Deafen Headset */}
 <button
 onClick={() => setIsDeafened(!isDeafened)}
 className={`p-1.5 rounded-md hover:bg-[#F9F9F7] transition-colors cursor-pointer ${
 isDeafened ?'text-red-400 hover:text-red-300 bg-red-500/10':'text-[var(--color-text-secondary)] hover:text-slate-200'
 }`}
 title={isDeafened ?'Undeafen':'Deafen'}
 >
 <Headphones className={`w-4 h-4 ${isDeafened ?'line-through':''}`} />
 </button>

 {/* User Settings Gear */}
 <button
 onClick={onOpenSettings}
 className="p-1.5 rounded-md hover:bg-[#F9F9F7] text-[var(--color-text-secondary)] hover:text-slate-200 transition-colors cursor-pointer"
 title="User Settings"
 >
 <Settings className="w-4 h-4"/>
 </button>
 </div>

 </div>
 );
});

UserFooterBar.displayName ='UserFooterBar';
export default UserFooterBar;
