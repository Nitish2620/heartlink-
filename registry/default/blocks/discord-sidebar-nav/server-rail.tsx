import React, { useState } from'react';
import { Plus, Compass, Sparkles, MessageSquare, FolderOpen } from'lucide-react';
import type { ServerItem, ServerFolder } from'./types';

interface ServerRailProps {
 servers: ServerItem[];
 folders?: ServerFolder[];
 activeServerId: string | null; // null = Home / DMs
 onSelectServer: (serverId: string | null) => void;
 onAddServer?: () => void;
 onExploreServers?: () => void;
}

export const ServerRail = React.memo(({
 servers,
 folders = [
 { id:'f1', name:'Dev & Coding', color:'#6366f1', serverIds: ['s1','s2'] }
 ],
 activeServerId,
 onSelectServer,
 onAddServer,
 onExploreServers
}: ServerRailProps) => {
 // Folder expansion state
 const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({ f1: true });

 const toggleFolder = (folderId: string) => {
 setOpenFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }));
 };

 // Group servers by standalone vs foldered
 const folderedServerIds = new Set(folders.flatMap(f => f.serverIds));
 const standaloneServers = servers.filter(s => !folderedServerIds.has(s.id));

 return (
 <div className="w-[72px] bg-[#F9F9F7] flex flex-col items-center py-3 gap-2 shrink-0 border-r border-slate-900 selection:bg-none z-20">
 
 {/* Home / Direct Messages Icon Button */}
 <div className="relative group flex items-center justify-center w-full">
 {/* Left Edge Indicator Pill */}
 <div 
 className={`absolute left-0 w-1 bg-[var(--color-surface)] rounded-r-full transition-all duration-300 ${
 activeServerId === null 
 ?'h-10 opacity-100'
 :'h-0 group-hover:h-5 opacity-0 group-hover:opacity-100'
 }`}
 />
 
 <button
 onClick={() => onSelectServer(null)}
 className={`w-12 h-12 rounded-3xl group-hover:rounded-2xl flex items-center justify-center transition-all duration-300 relative cursor-pointer ${
 activeServerId === null 
 ?'bg-[var(--color-accent-sage)] rounded-2xl text-slate-800 shadow-[0_0_15px_rgba(99,102,241,0.5)]'
 :'bg-[#F9F9F7] group-hover:bg-[var(--color-accent-sage)] text-slate-300 group-hover:text-slate-800'
 }`}
 title="Direct Messages / Home"
 >
 <MessageSquare className="w-6 h-6"/>
 </button>
 </div>

 {/* Divider */}
 <div className="w-8 h-[2px] bg-[#F9F9F7] rounded-full my-1"/>

 {/* Server Icon List */}
 <div className="flex-1 w-full flex flex-col items-center gap-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
 
 {/* Render Folders First */}
 {folders.map(folder => {
 const isOpen = openFolders[folder.id];
 const folderServers = servers.filter(s => folder.serverIds.includes(s.id));

 return (
 <div key={folder.id} className="w-full flex flex-col items-center gap-1.5 transition-all">
 {/* Folder Header Icon */}
 <button
 onClick={() => toggleFolder(folder.id)}
 className={`w-12 h-12 rounded-3xl hover:rounded-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden flex items-center justify-center ${
 isOpen ?'bg-indigo-900/30':'bg-indigo-950/40 hover:bg-indigo-900/60 p-1.5'
 }`}
 title={folder.name}
 >
 {isOpen ? (
 <FolderOpen className="w-5 h-5 text-[var(--color-accent-sage)] group-hover:text-indigo-300 transition-colors"/>
 ) : (
 <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5">
 {folderServers.slice(0, 4).map((server) => (
 <div key={server.id} className="w-full h-full rounded-full overflow-hidden bg-[var(--color-surface)] flex items-center justify-center">
 {server.icon ? (
 <img src={server.icon} alt={server.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"/>
 ) : (
 <span className="text-[6px] font-bold text-slate-300">
 {server.acronym || server.name.substring(0, 2).toUpperCase()}
 </span>
 )}
 </div>
 ))}
 </div>
 )}
 </button>

 {/* Nested Server Icons inside Folder */}
 {isOpen && folderServers.map(server => {
 const isActive = activeServerId === server.id;
 const hasUnread = server.hasUnread || (server.unreadCount && server.unreadCount > 0);

 return (
 <div key={server.id} className="relative group flex items-center justify-center w-full">
 {/* Left Edge Pill Indicator */}
 <div 
 className={`absolute left-0 w-1 bg-[var(--color-surface)] rounded-r-full transition-all duration-300 ${
 isActive 
 ?'h-10 opacity-100'
 : hasUnread 
 ?'h-2 opacity-100'
 :'h-0 group-hover:h-5 opacity-0 group-hover:opacity-100'
 }`}
 />

 <button
 onClick={() => onSelectServer(server.id)}
 className={`w-12 h-12 rounded-3xl group-hover:rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden cursor-pointer ${
 isActive 
 ?'bg-[var(--color-accent-sage)] rounded-2xl text-slate-800 shadow-lg'
 :'bg-[#F9F9F7] group-hover:bg-[var(--color-accent-sage)] text-slate-200'
 }`}
 title={server.name}
 >
 {server.icon ? (
 <img src={server.icon} alt={server.name} className="w-full h-full object-cover"/>
 ) : (
 <span className="font-bold text-xs tracking-wider">
 {server.acronym || server.name.substring(0, 2).toUpperCase()}
 </span>
 )}

 {server.unreadCount && server.unreadCount > 0 ? (
 <div className="absolute -bottom-1 -right-1 bg-red-500 text-slate-800 font-extrabold text-[10px] min-w-5 h-5 px-1 rounded-full border-4 border-slate-950 flex items-center justify-center shadow-md animate-pulse">
 {server.unreadCount > 99 ?'99+': server.unreadCount}
 </div>
 ) : null}
 </button>
 </div>
 );
 })}
 </div>
 );
 })}

 {/* Render Standalone Servers */}
 {standaloneServers.map((server) => {
 const isActive = activeServerId === server.id;
 const hasUnread = server.hasUnread || (server.unreadCount && server.unreadCount > 0);

 return (
 <div key={server.id} className="relative group flex items-center justify-center w-full">
 {/* Left Edge Pill Indicator */}
 <div 
 className={`absolute left-0 w-1 bg-[var(--color-surface)] rounded-r-full transition-all duration-300 ${
 isActive 
 ?'h-10 opacity-100'
 : hasUnread 
 ?'h-2 opacity-100'
 :'h-0 group-hover:h-5 opacity-0 group-hover:opacity-100'
 }`}
 />

 <button
 onClick={() => onSelectServer(server.id)}
 className={`w-12 h-12 rounded-3xl group-hover:rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden cursor-pointer ${
 isActive 
 ?'bg-[var(--color-accent-sage)] rounded-2xl text-slate-800 shadow-lg'
 :'bg-[#F9F9F7] group-hover:bg-[var(--color-accent-sage)] text-slate-200'
 }`}
 title={server.name}
 >
 {server.icon ? (
 <img src={server.icon} alt={server.name} className="w-full h-full object-cover"/>
 ) : (
 <span className="font-bold text-xs tracking-wider">
 {server.acronym || server.name.substring(0, 2).toUpperCase()}
 </span>
 )}

 {server.unreadCount && server.unreadCount > 0 ? (
 <div className="absolute -bottom-1 -right-1 bg-red-500 text-slate-800 font-extrabold text-[10px] min-w-5 h-5 px-1 rounded-full border-4 border-slate-950 flex items-center justify-center shadow-md animate-pulse">
 {server.unreadCount > 99 ?'99+': server.unreadCount}
 </div>
 ) : null}
 </button>
 </div>
 );
 })}

 {/* Add Server Button */}
 <div className="relative group flex items-center justify-center w-full mt-1">
 <button
 onClick={onAddServer}
 className="w-12 h-12 rounded-3xl group-hover:rounded-2xl bg-[#F9F9F7] group-hover:bg-emerald-600 text-emerald-400 group-hover:text-slate-800 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm"
 title="Add a Server"
 >
 <Plus className="w-6 h-6"/>
 </button>
 </div>

 {/* Explore Discoverable Servers Button */}
 <div className="relative group flex items-center justify-center w-full">
 <button
 onClick={onExploreServers}
 className="w-12 h-12 rounded-3xl group-hover:rounded-2xl bg-[#F9F9F7] group-hover:bg-emerald-600 text-emerald-400 group-hover:text-slate-800 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm"
 title="Explore Public Servers"
 >
 <Compass className="w-6 h-6"/>
 </button>
 </div>
 </div>

 {/* Nitro Feature Quick Link at Bottom */}
 <div className="relative group flex items-center justify-center w-full pt-1">
 <button
 onClick={() => onSelectServer(null)}
 className="w-12 h-12 rounded-3xl group-hover:rounded-2xl bg-gradient-to-tr from-purple-900 via-indigo-900 to-pink-900 text-pink-300 hover:text-slate-800 flex items-center justify-center transition-all duration-300 cursor-pointer border border-pink-500/30 shadow-md"
 title="Discord Nitro Boost & Perks"
 >
 <Sparkles className="w-5 h-5 animate-pulse text-amber-300"/>
 </button>
 </div>

 </div>
 );
});

ServerRail.displayName ='ServerRail';
export default ServerRail;
