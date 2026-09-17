import React from'react';
import { Radio, PhoneOff, Video } from'lucide-react';
import type { ActiveVoiceConnection } from'./types';

interface VoiceDockBarProps {
 connection: ActiveVoiceConnection;
 onDisconnect?: () => void;
 onToggleScreenShare?: () => void;
}

export const VoiceDockBar = React.memo(({
 connection,
 onDisconnect,
 onToggleScreenShare
}: VoiceDockBarProps) => {
 if (!connection.isConnected) return null;

 return (
 <div className="bg-[#F9F9F7] border-t border-slate-900 px-3 py-2 flex flex-col gap-1.5 shrink-0 z-10 animate-in slide-in-from-bottom-2 duration-200">
 
 {/* Top Status Line */}
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
 <div className="flex items-end gap-[1px] h-3 w-3 shrink-0">
 <div className="w-[2px] bg-emerald-400 rounded-t-sm animate-[bounce_0.8s_infinite] h-full"style={{ animationDelay:'0ms'}} />
 <div className="w-[2px] bg-emerald-400 rounded-t-sm animate-[bounce_0.8s_infinite] h-full"style={{ animationDelay:'200ms'}} />
 <div className="w-[2px] bg-emerald-400 rounded-t-sm animate-[bounce_0.8s_infinite] h-full"style={{ animationDelay:'400ms'}} />
 </div>
 <span>Voice Connected / {connection.pingMs}ms</span>
 </div>

 <span className="text-[9px] font-mono text-[var(--color-text-secondary)] truncate max-w-[100px]">
 {connection.serverName}
 </span>
 </div>

 {/* Main Info & Action Controls */}
 <div className="flex items-center justify-between gap-2">
 <div className="flex items-center gap-1.5 min-w-0">
 <Radio className="w-4 h-4 text-emerald-400 shrink-0"/>
 <span className="text-xs font-bold text-slate-800 truncate">
 {connection.channelName}
 </span>
 </div>

 <div className="flex items-center gap-1 shrink-0">
 {/* Screen Share Button */}
 <button
 onClick={onToggleScreenShare}
 className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
 connection.isScreenSharing 
 ?'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
 :'bg-[#F9F9F7] hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-slate-800'
 }`}
 title={connection.isScreenSharing ?'Stop Screen Share':'Share Your Screen'}
 >
 <Video className="w-3.5 h-3.5"/>
 </button>

 {/* Disconnect Button */}
 <button
 onClick={onDisconnect}
 className="p-1.5 rounded-lg bg-red-600/90 hover:bg-red-500 text-slate-800 transition-colors cursor-pointer shadow-sm"
 title="Disconnect Call"
 >
 <PhoneOff className="w-3.5 h-3.5"/>
 </button>
 </div>
 </div>

 </div>
 );
});

VoiceDockBar.displayName ='VoiceDockBar';
export default VoiceDockBar;
