import React, { useState, useEffect } from'react';
import { ServerRail } from'./server-rail';
import { ChannelSidebar } from'./channel-sidebar';
import { UserFooterBar } from'./user-footer-bar';
import { VoiceDockBar } from'./voice-dock-bar';
import type { 
 ServerItem, 
 ChannelCategory, 
 DirectMessageItem, 
 ActiveVoiceConnection,
 DiscordSidebarNavProps 
} from'./types';
import { Search, X, Hash, Volume2 } from'lucide-react';

const MOCK_SERVERS: ServerItem[] = [
 {
 id:'s1',
 name:'Core AI Engineers',
 icon:'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
 unreadCount: 4,
 boostLevel: 3
 },
 {
 id:'s2',
 name:'Next.js & Tailwind Developers',
 icon:'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=200&q=80',
 hasUnread: true,
 boostLevel: 2
 },
 {
 id:'s3',
 name:'Cyberpunk Gaming HQ',
 icon:'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80',
 unreadCount: 12,
 boostLevel: 1
 },
 {
 id:'s4',
 name:'Design Systems & UI/UX',
 acronym:'DS',
 hasUnread: false
 }
];

const MOCK_CATEGORIES: ChannelCategory[] = [
 {
 id:'c1',
 name:'Welcome & Rules',
 channels: [
 { id:'ch-1', name:'rules-and-info', type:'announcement', unread: false },
 { id:'ch-2', name:'announcements', type:'announcement', unread: true, mentionCount: 2 }
 ]
 },
 {
 id:'c2',
 name:'Text Channels',
 channels: [
 { id:'ch-3', name:'general', type:'text', unread: true },
 { id:'ch-4', name:'showcase-and-projects', type:'text', unread: false },
 { id:'ch-5', name:'ai-code-agents', type:'text', unread: false, mentionCount: 1 },
 { id:'ch-6', name:'admin-lounge', type:'text', isLocked: true }
 ]
 },
 {
 id:'c3',
 name:'Voice Rooms',
 channels: [
 { 
 id:'ch-7', 
 name:'Lounge (General)', 
 type:'voice',
 activeVoiceMembers: [
 {
 id:'v1',
 name:'Alex Rivera',
 avatar:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
 isSpeaking: true,
 isStreaming: true
 },
 {
 id:'v2',
 name:'Sarah Connor',
 avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
 isMuted: true
 }
 ]
 },
 { id:'ch-8', name:'Pair Programming', type:'voice'},
 { id:'ch-9', name:'AFK Quiet Zone', type:'voice'}
 ]
 }
];

const MOCK_DMS: DirectMessageItem[] = [
 {
 id:'dm-1',
 userId:'u1',
 name:'Sarah Connor',
 handle:'sarah_c',
 avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
 status:'online',
 customStatus:'😴 Coding late at night',
 customStatusEmoji:'💻',
 unreadCount: 3
 },
 {
 id:'dm-2',
 userId:'u2',
 name:'Alex Rivera',
 handle:'arivera',
 avatar:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
 status:'dnd',
 activityText:'Playing Cyberpunk 2077'
 },
 {
 id:'dm-3',
 userId:'u3',
 name:'David Kim',
 handle:'dkim_dev',
 avatar:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
 status:'idle',
 activityText:'Listening to Spotify'
 }
];

export const DiscordSidebarNav = React.memo(({
 profile,
 onOpenSettings,
 onSelectServer,
 onSelectChannel,
 onSelectDM,
 className =''
}: DiscordSidebarNavProps) => {
 const [activeServerId, setActiveServerId] = useState<string | null>(null); // null = Home / DMs
 const [activeChannelId, setActiveChannelId] = useState<string | null>('ch-3');
 const [activeDMId, setActiveDMId] = useState<string | null>('dm-1');
 const [isSearchOpen, setIsSearchOpen] = useState(false);
 const [searchQuery, setSearchQuery] = useState('');

 // Voice Connection Dock State
 const [voiceConnection, setVoiceConnection] = useState<ActiveVoiceConnection>({
 serverId:'s1',
 serverName:'Core AI Engineers',
 channelId:'ch-7',
 channelName:'Lounge (General)',
 pingMs: 14,
 isConnected: true,
 isScreenSharing: false
 });

 // Handle Ctrl+K shortcut
 useEffect(() => {
 const handleKeyDown = (e: KeyboardEvent) => {
 if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() ==='k') {
 e.preventDefault();
 setIsSearchOpen(prev => !prev);
 }
 };
 window.addEventListener('keydown', handleKeyDown);
 return () => window.removeEventListener('keydown', handleKeyDown);
 }, []);

 const activeServer = MOCK_SERVERS.find(s => s.id === activeServerId) || null;

 const handleServerClick = (serverId: string | null) => {
 setActiveServerId(serverId);
 if (onSelectServer) onSelectServer(serverId);
 };

 const handleChannelClick = (channelId: string) => {
 setActiveChannelId(channelId);
 if (onSelectChannel) onSelectChannel(channelId);

 // If user clicks a voice channel, connect to it
 const allChannels = MOCK_CATEGORIES.flatMap(c => c.channels);
 const clickedChannel = allChannels.find(ch => ch.id === channelId);
 if (clickedChannel && clickedChannel.type ==='voice') {
 setVoiceConnection({
 serverId: activeServerId ||'s1',
 serverName: activeServer?.name ||'Core AI Engineers',
 channelId: clickedChannel.id,
 channelName: clickedChannel.name,
 pingMs: Math.floor(Math.random() * 10) + 12,
 isConnected: true,
 isScreenSharing: false
 });
 }
 };

 const handleDMClick = (dmId: string) => {
 setActiveDMId(dmId);
 if (onSelectDM) onSelectDM(dmId);
 };

 return (
 <div className={`h-[720px] w-[312px] bg-[#F9F9F7] rounded-3xl border border-[var(--color-border)] shadow-2xl overflow-hidden flex flex-col relative ${className}`} style={{ contain:'content'}}>
 
 {/* Sidebar Content (Server Rail + Channel Panel) */}
 <div className="flex-1 flex min-h-0">
 {/* Left Server Icon Rail (72px) */}
 <ServerRail 
 servers={MOCK_SERVERS} 
 activeServerId={activeServerId} 
 onSelectServer={handleServerClick}
 />

 {/* Right Channel & DMs List (240px) */}
 <ChannelSidebar 
 activeServer={activeServer}
 categories={MOCK_CATEGORIES}
 directMessages={MOCK_DMS}
 activeChannelId={activeChannelId}
 activeDMId={activeDMId}
 onSelectChannel={handleChannelClick}
 onSelectDM={handleDMClick}
 onQuickSearchClick={() => setIsSearchOpen(true)}
 />
 </div>

 {/* Docked Active Voice Call Bar (Appears when connected to voice) */}
 <VoiceDockBar 
 connection={voiceConnection}
 onDisconnect={() => setVoiceConnection(prev => ({ ...prev, isConnected: false }))}
 onToggleScreenShare={() => setVoiceConnection(prev => ({ ...prev, isScreenSharing: !prev.isScreenSharing }))}
 />

 {/* User Quick Controller Footer */}
 <UserFooterBar profile={profile} onOpenSettings={onOpenSettings} />

 {/* Ctrl+K Quick Switcher Modal */}
 {isSearchOpen && (
 <div className="absolute inset-0 bg-[var(--color-surface)]/80 backdrop-blur-sm z-50 p-4 flex flex-col animate-in fade-in duration-200">
 <div className="bg-[#F9F9F7] border border-[var(--color-border)] rounded-2xl p-3 shadow-2xl flex flex-col gap-3">
 <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
 <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
 <Search className="w-4 h-4 text-[var(--color-accent-sage)]"/>
 <span>Quick Switcher</span>
 </div>
 <button 
 onClick={() => setIsSearchOpen(false)}
 className="text-[var(--color-text-secondary)] hover:text-slate-800 p-1 rounded transition-colors cursor-pointer"
 >
 <X className="w-4 h-4"/>
 </button>
 </div>

 <input 
 type="text"
 placeholder="Where would you like to go?"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 autoFocus
 className="w-full bg-[#F9F9F7] border border-[var(--color-border)] rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-indigo-500"
 />

 <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
 <div className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider px-2">Channels & DMs</div>
 {MOCK_CATEGORIES.flatMap(c => c.channels).map(ch => (
 <button
 key={ch.id}
 onClick={() => {
 handleChannelClick(ch.id);
 setIsSearchOpen(false);
 }}
 className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-[var(--color-accent-sage)] hover:text-slate-800 transition-colors cursor-pointer text-left"
 >
 <span className="flex items-center gap-2">
 {ch.type ==='voice'? <Volume2 className="w-3.5 h-3.5"/> : <Hash className="w-3.5 h-3.5"/>}
 {ch.name}
 </span>
 <span className="text-[10px] opacity-60">Channel</span>
 </button>
 ))}
 </div>
 </div>
 </div>
 )}

 </div>
 );
});

DiscordSidebarNav.displayName ='DiscordSidebarNav';
export default DiscordSidebarNav;
