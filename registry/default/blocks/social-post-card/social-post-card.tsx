import React, { useState, useRef, useMemo, useCallback, useEffect } from'react';
import { 
 Heart, 
 MessageCircle, 
 Share2, 
 MoreHorizontal, 
 Smile, 
 Edit3, 
 Copy, 
 Bookmark, 
 Flag, 
 Trash2, 
 CornerDownRight, 
 Send,
 X,
 MapPin,
 Sparkles,
 Play,
 Pause,
 Maximize2,
 ChevronLeft,
 ChevronRight,
 ChevronUp,
 ChevronDown,
 Pin,
 Share,
 Globe,
 Lock,
 Tag,
 CheckCircle2,
 Code2,
 Search,
 Eye,
 TrendingUp,
 Volume2,
 VolumeX,
 BarChart3,
 Check,
 Languages,
 PieChart,
 Users,
 ExternalLink,
 Image as ImageIcon
} from'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from"@/components/ui/hover-card";
import { cn } from"@/lib/utils";
import { AvatarDecorationFrame } from'../user-profile-card/decorations';
import type { ReactionType, Comment, SocialPostProps, PollData, ReactionUser, PostAnalytics, LinkPreviewData } from'./types';
import { REACTIONS } from'./types';

export type { ReactionType, Comment, SocialPostProps, PollData, ReactionUser, PostAnalytics, LinkPreviewData };

/* ========================================================
 PREMIUM SKELETON SHIMMER LOADER
======================================================== */
const SkeletonShimmer = React.memo(() => (
 <div className="w-full space-y-5 p-6 sm:p-7">
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 rounded-full bg-slate-200 skeleton-shimmer"/>
 <div className="space-y-2 flex-1">
 <div className="h-3.5 bg-slate-200 rounded-lg w-36 skeleton-shimmer"/>
 <div className="h-2.5 bg-[var(--color-bg-alt)]/60 rounded-lg w-52 skeleton-shimmer"/>
 </div>
 </div>
 <div className="space-y-2.5">
 <div className="h-3 bg-slate-200 rounded-lg w-full skeleton-shimmer"/>
 <div className="h-3 bg-slate-200 rounded-lg w-5/6 skeleton-shimmer"/>
 <div className="h-3 bg-[var(--color-bg-alt)]/60 rounded-lg w-3/4 skeleton-shimmer"/>
 </div>
 <div className="flex gap-2">
 {[1,2,3].map(i => <div key={i} className="h-7 bg-[var(--color-bg-alt)]/60 rounded-lg w-24 skeleton-shimmer"/>)}
 </div>
 <div className="grid grid-cols-2 gap-3">
 <div className="h-44 bg-slate-200 rounded-2xl skeleton-shimmer"/>
 <div className="h-44 bg-slate-200 rounded-2xl skeleton-shimmer"/>
 </div>
 <div className="flex justify-between pt-3 border-t border-slate-100">
 {[1,2,3].map(i => <div key={i} className="h-9 bg-[var(--color-bg-alt)]/60 rounded-xl w-28 skeleton-shimmer"/>)}
 </div>
 </div>
));
SkeletonShimmer.displayName ='SkeletonShimmer';

/* ========================================================
 DOUBLE-TAP HEART BURST ANIMATION OVERLAY
======================================================== */
const HeartBurstOverlay = React.memo(({ show, x, y }: { show: boolean; x: number; y: number }) => {
 if (!show) return null;
 return (
 <div
 className="absolute z-20 pointer-events-none"
 style={{ left: x - 36, top: y - 36 }}
 >
 <span
 className="text-6xl select-none block heart-burst-anim"
 style={{ filter:'drop-shadow(0 4px 16px rgba(239,68,68,0.5))'}}
 >
 ❤️
 </span>
 </div>
 );
});
HeartBurstOverlay.displayName ='HeartBurstOverlay';



/* ========================================================
 INDEXEDDB AUTO-PERSISTENCE ENGINE FOR SOCIAL POST CARD
======================================================== */
const DB_NAME ='SocialPostCardDB';
const DB_VERSION = 1;
const STORE_POST ='postState';

function openPostDB(): Promise<IDBDatabase> {
 return new Promise((resolve, reject) => {
 const request = indexedDB.open(DB_NAME, DB_VERSION);
 request.onupgradeneeded = () => {
 const db = request.result;
 if (!db.objectStoreNames.contains(STORE_POST)) {
 db.createObjectStore(STORE_POST);
 }
 };
 request.onsuccess = () => resolve(request.result);
 request.onerror = () => reject(request.error);
 });
}

async function idbSavePostState(key: string, data: any) {
 try {
 const db = await openPostDB();
 const tx = db.transaction(STORE_POST,'readwrite');
 tx.objectStore(STORE_POST).put(data, key);
 } catch (err) {
 console.warn('IndexedDB save skipped:', err);
 }
}

async function idbLoadPostState(key: string): Promise<any> {
 try {
 const db = await openPostDB();
 return new Promise((resolve) => {
 const tx = db.transaction(STORE_POST,'readonly');
 const req = tx.objectStore(STORE_POST).get(key);
 req.onsuccess = () => resolve(req.result);
 req.onerror = () => resolve(null);
 });
 } catch {
 return null;
 }
}

/* ========================================================
 INSTANT MNC AVATAR SYSTEM (0ms Slow 3G Latency)
======================================================== */
const GRADIENTS = [
'from-blue-500 to-indigo-600',
'from-emerald-500 to-teal-600',
'from-violet-500 to-purple-600',
'from-amber-500 to-orange-600',
'from-rose-500 to-pink-600',
'from-cyan-500 to-blue-600'
];

function getInitials(name: string): string {
 if (!name) return'??';
 const parts = name.trim().split('');
 if (parts.length >= 2) return`${parts[0][0]}${parts[1][0]}`.toUpperCase();
 return name.slice(0, 2).toUpperCase();
}

function getGradient(name: string): string {
 let hash = 0;
 for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
 return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

const AvatarWithFallback = React.memo(({ name, src, size ="w-10 h-10"}: { name: string; src?: string; size?: string }) => {
 const [imgError, setImgError] = useState(false);
 const initials = useMemo(() => getInitials(name), [name]);
 const gradient = useMemo(() => getGradient(name), [name]);

 if (!src || imgError) {
 return (
 <div 
 role="img"
 aria-label={name}
 className={`${size} rounded-full bg-gradient-to-br ${gradient} text-slate-800 font-bold text-xs flex items-center justify-center ring-2 ring-slate-100 shrink-0 shadow-2xs`}
 >
 {initials}
 </div>
 );
 }

 return (
 <img
 src={src}
 alt={name}
 loading="lazy"
 decoding="async"
 onError={() => setImgError(true)}
 className={`${size} rounded-full object-cover ring-2 ring-slate-100 shrink-0`}
 />
 );
});
AvatarWithFallback.displayName ='AvatarWithFallback';

/* ========================================================
 MEMOIZED VOICE PLAYER SUB-COMPONENT
======================================================== */
const VoicePlayer = React.memo(({ 
 duration 
}: { 
 duration?: string 
}) => {
 const [isPlaying, setIsPlaying] = useState(false);
 const timeoutRef = useRef<any>(null);

 const handleTogglePlay = () => {
 const nextState = !isPlaying;
 setIsPlaying(nextState);
 if (nextState) {
 if (timeoutRef.current) clearTimeout(timeoutRef.current);
 timeoutRef.current = setTimeout(() => setIsPlaying(false), 15000); // Auto-stop mock
 } else {
 if (timeoutRef.current) clearTimeout(timeoutRef.current);
 }
 };

 useEffect(() => {
 return () => {
 if (timeoutRef.current) clearTimeout(timeoutRef.current);
 };
 }, []);

 return (
 <div className="mt-2.5 p-2.5 bg-blue-50/80 /40 rounded-xl border border-blue-200/50 /50 flex items-center gap-3">
 <button
 type="button"
 onClick={handleTogglePlay}
 aria-label={isPlaying ?"Pause voice message":"Play voice message"}
 className="w-7 h-7 rounded-full bg-[var(--color-accent-sage)] text-slate-800 flex items-center justify-center shrink-0 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition shadow-xs cursor-pointer"
 >
 {isPlaying ? <Pause className="w-3.5 h-3.5"/> : <Play className="w-3.5 h-3.5 ml-0.5"/>}
 </button>
 <div className="flex-1 space-y-1">
 <div className="flex items-center gap-1 h-3">
 {[40, 75, 35, 95, 60, 100, 45, 80, 50, 70, 40, 85, 30, 65].map((h, i) => (
 <span 
 key={i} 
 className={`w-1 rounded-full transition-all duration-300 ${isPlaying ?'bg-[var(--color-accent-sage)] animate-pulse':'bg-blue-300'}`} 
 style={{ height:`${h}%`}}
 />
 ))}
 </div>
 <div className="flex justify-between text-[9px] text-blue-600 font-mono font-medium">
 <span>{isPlaying ?'Playing Voice Note...':'Voice Message'}</span>
 <span>{duration ||'0:24'}</span>
 </div>
 </div>
 </div>
 );
});
VoicePlayer.displayName ='VoicePlayer';

/* ========================================================
 DEEP LOGIC FEATURE: INTERACTIVE POLL / SURVEY WIDGET
======================================================== */
const PollWidget = React.memo(({ 
 poll, 
 onVote 
}: { 
 poll: PollData; 
 onVote: (optionId: string) => void; 
}) => {
 return (
 <div className="my-4 p-4 bg-[var(--color-bg-alt)]/60 rounded-2xl border border-[var(--color-border)]/80 space-y-3">
 <div className="flex items-center justify-between">
 <h4 className="font-bold text-xs sm:text-sm text-[var(--color-text-primary)] flex items-center gap-1.5">
 <BarChart3 className="w-4 h-4 text-[var(--color-accent-sage)]"/>
 {poll.question}
 </h4>
 {poll.expiresIn && (
 <span className="text-[10px] font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg-alt)]/80 px-2 py-0.5 rounded-full">
 {poll.expiresIn}
 </span>
 )}
 </div>

 <div className="space-y-2">
 {poll.options.map(option => {
 const isVoted = poll.userVotedOptionId === option.id;
 const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;

 return (
 <button
 key={option.id}
 type="button"
 aria-pressed={isVoted}
 data-voted={isVoted ?"true":"false"}
 onClick={() => onVote(option.id)}
 className={`w-full relative overflow-hidden rounded-xl p-3 text-left transition border cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 outline-none ${
 isVoted
 ?'border-blue-500 bg-blue-50/50 /40 text-blue-900 font-bold'
 :'border-[var(--color-border)] hover:border-blue-300 :border-blue-700 text-slate-800'
 }`}
 >
 <div 
 className={`absolute left-0 top-0 bottom-0 transition-all duration-500 ${
 isVoted ? 'bg-blue-500/20' : 'bg-[var(--color-bg-alt)]/80'
 }`}
 style={{ width:`${percentage}%`}}
 />

 <div className="relative z-10 flex items-center justify-between text-xs">
 <span className="flex items-center gap-2 font-medium">
 {isVoted && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 font-bold"/>}
 {option.text}
 </span>
 <span className="font-mono font-bold text-[11px]">
 {percentage}% <span className="text-[var(--color-text-secondary)] font-normal">({option.votes})</span>
 </span>
 </div>
 </button>
 );
 })}
 </div>

 <div className="text-[11px] text-[var(--color-text-secondary)] text-right font-medium">
 Total Votes: <span className="font-bold text-slate-700">{poll.totalVotes.toLocaleString()}</span>
 </div>
 </div>
 );
});
PollWidget.displayName ='PollWidget';

/* ========================================================
 MEMOIZED COMMENT ROW SUB-COMPONENT WITH INLINE REPLY
======================================================== */
/* ========================================================
 RICH TEXT FORMATTER FOR COMMENTS (Mentions & Hashtags)
======================================================== */
const formatRichText = (text: string) => {
 if (!text) return text;
 
 // Advanced regex to capture Markdown formatting, mentions, hashtags, and URLs.
 const tokens = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|@[a-zA-Z0-9_]+|#[a-zA-Z0-9_]+|https?:\/\/[^\s]+)/g);
 
 return (
 <>
 {tokens.map((token, i) => {
 if (!token) return null;
 
 if (token.startsWith('**') && token.endsWith('**')) {
 return <strong key={i} className="font-bold text-[var(--color-text-primary)]">{token.slice(2, -2)}</strong>;
 }
 if (token.startsWith('*') && token.endsWith('*')) {
 return <em key={i} className="italic">{token.slice(1, -1)}</em>;
 }
 if (token.startsWith('`') && token.endsWith('`')) {
 return <code key={i} className="bg-[var(--color-bg-alt)] px-1 py-0.5 rounded text-xs text-pink-500 font-mono">{token.slice(1, -1)}</code>;
 }
 if (token.startsWith('@') && token.length > 1) {
 const username = token.slice(1);
 return (
 <HoverCard key={i}>
 <HoverCardTrigger asChild>
 <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
 {token}
 </span>
 </HoverCardTrigger>
 <HoverCardContent className="w-72 p-4 animate-in zoom-in-95"align="start">
 <div className="flex justify-between space-x-4">
 <AvatarWithFallback name={username} size="w-12 h-12 text-lg"/>
 <div className="space-y-1 flex-1">
 <h4 className="text-sm font-bold text-[var(--color-text-primary)]">{username}</h4>
 <p className="text-xs text-[var(--color-text-secondary)]">Software Engineer & UI Enthusiast. Love building cool things!</p>
 <div className="flex items-center pt-2">
 <span className="text-xs font-medium text-[var(--color-text-secondary)]">Joined December 2021</span>
 </div>
 </div>
 </div>
 </HoverCardContent>
 </HoverCard>
 );
 }
 if (token.startsWith('#') && token.length > 1) {
 return (
 <span key={i} className="text-blue-600 font-semibold cursor-pointer hover:underline">
 {token}
 </span>
 );
 }
 if (token.startsWith('http://') || token.startsWith('https://')) {
 return (
 <a key={i} href={token} target="_blank"rel="noopener noreferrer"className="text-blue-600 hover:underline inline-flex items-center gap-0.5">
 {token.length > 30 ? token.substring(0, 30) +'...': token}
 <ExternalLink className="w-2.5 h-2.5"/>
 </a>
 );
 }
 
 return <React.Fragment key={i}>{token}</React.Fragment>;
 })}
 </>
 );
};

const USERS = ['Ray Hammond','Cynthia Henry','Marcus Vance','Sarah Jenkins','David Kim'];
const HASHTAGS = ['#React','#Frontend','#NYC','#Travel','#Coding','#Design'];

const CommentInputWithAutocomplete = ({
 value,
 onChange,
 placeholder,
 className,
 autoFocus,
 id
}: {
 value: string;
 onChange: (val: string) => void;
 placeholder?: string;
 className?: string;
 autoFocus?: boolean;
 id?: string;
}) => {
 const [showDropdown, setShowDropdown] = useState(false);
 const [options, setOptions] = useState<string[]>([]);
 const [matchInfo, setMatchInfo] = useState<{ trigger: string; query: string; index: number } | null>(null);
 const inputRef = useRef<HTMLInputElement>(null);

 const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
 const val = e.target.value;
 onChange(val);

 const cursor = e.target.selectionStart || 0;
 const textBeforeCursor = val.slice(0, cursor);
 const match = textBeforeCursor.match(/([@#][\w]*)$/);

 if (match) {
 const trigger = match[1][0];
 const query = match[1].slice(1).toLowerCase();
 
 let filtered: string[] = [];
 if (trigger ==='@') {
 filtered = USERS.filter(u => u.toLowerCase().includes(query)).map(u =>`@${u.replace(/\s+/g,'')}`);
 } else if (trigger ==='#') {
 filtered = HASHTAGS.filter(h => h.toLowerCase().includes(query));
 }

 if (filtered.length > 0) {
 setOptions(filtered);
 setMatchInfo({ trigger, query, index: match.index! });
 setShowDropdown(true);
 } else {
 setShowDropdown(false);
 }
 } else {
 setShowDropdown(false);
 }
 };

 const handleSelect = (option: string) => {
 if (!matchInfo) return;
 const before = value.slice(0, matchInfo.index);
 const after = value.slice(matchInfo.index + matchInfo.trigger.length + matchInfo.query.length);
 const newValue =`${before}${option} ${after}`;
 onChange(newValue);
 setShowDropdown(false);
 inputRef.current?.focus();
 };

 return (
 <div className="relative flex-1 flex">
 <input
 ref={inputRef}
 id={id}
 type="text"
 autoFocus={autoFocus}
 placeholder={placeholder}
 value={value}
 onChange={handleInput}
 className={className}
 />
 {showDropdown && (
 <div className="absolute bottom-full left-0 mb-2 w-48 max-h-40 overflow-y-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2">
 {options.map((opt, i) => (
 <button
 key={i}
 type="button"
 onClick={() => handleSelect(opt)}
 className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 :bg-blue-900/40 hover:text-blue-600 :text-blue-400 transition cursor-pointer"
 >
 {opt}
 </button>
 ))}
 </div>
 )}
 </div>
 );
};

/* ========================================================
 MEMOIZED COMMENT ROW SUB-COMPONENT WITH INLINE REPLY (N-LEVEL RECURSION)
======================================================== */
const CommentRow = React.memo(({ 
 comment, 
 onLike, 
 onAddReply, 
 onEdit,
 onDelete,
 onToggleReaction,
 onTogglePin,
 depth = 0,
 parentAuthorName
}: { 
 comment: Comment; 
 onLike: (id: string) => void; 
 onAddReply: (commentId: string, replyText: string, media?: string | null) => void; 
 onEdit: (id: string, text: string) => void;
 onDelete: (id: string) => void;
 onToggleReaction: (id: string, emoji: string) => void;
 onTogglePin?: (id: string) => void;
 depth?: number;
 parentAuthorName?: string;
}) => {
 const [isRepliesExpanded, setIsRepliesExpanded] = useState(true);
 const [isReplying, setIsReplying] = useState(false);
 const [replyInput, setReplyInput] = useState('');
 const [showMenu, setShowMenu] = useState(false);
 const [isEditing, setIsEditing] = useState(false);
 const [editInput, setEditInput] = useState(comment.text);
 const [showEmojiPicker, setShowEmojiPicker] = useState(false);
 const [replyMedia, setReplyMedia] = useState<string | null>(null);
 const [isSubmittingReply, setIsSubmittingReply] = useState(false);
 const activeTimeouts = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

 useEffect(() => {
 return () => {
 activeTimeouts.current.forEach(clearTimeout);
 activeTimeouts.current.clear();
 };
 }, []);

 const handleSendReply = (e: React.FormEvent) => {
 e.preventDefault();
 if (!replyInput.trim() && !replyMedia) return;
 if (isSubmittingReply) return;
 
 setIsSubmittingReply(true);
 // Simulate network latency for MNC-grade feel
 const t = setTimeout(() => {
 onAddReply(comment.id, replyInput.trim(), replyMedia);
 setIsRepliesExpanded(true); // Auto-expand when adding a reply
 setReplyInput('');
 setReplyMedia(null);
 setIsReplying(false);
 setIsSubmittingReply(false);
 activeTimeouts.current.delete(t);
 }, 300);
 activeTimeouts.current.add(t);
 };

 const handleSaveEdit = (e: React.FormEvent) => {
 e.preventDefault();
 if (!editInput.trim()) return;
 onEdit(comment.id, editInput.trim());
 setIsEditing(false);
 };

 // Limit visual indentation to 4 levels maximum
 const visualDepth = Math.min(depth, 4);

 return (
 <div className={`space-y-2 group animate-in fade-in duration-200 ${visualDepth > 0 ?'mt-2.5 pl-3 sm:pl-5 border-l-2 border-[var(--color-border)]/70 /70':''}`}>
 <div className="flex items-start gap-2.5">
 <AvatarWithFallback name={comment.author.name} src={comment.author.avatar} size={visualDepth > 0 ?"w-6 h-6":"w-8 h-8"} />
 <div className="flex-1 min-w-0">
 <div className="bg-[var(--color-bg-alt)]/60 p-3 rounded-2xl rounded-tl-none border border-[var(--color-border)]/80 shadow-2xs group/comment">
 <div className="flex items-start justify-between gap-2 mb-1">
 <div className="flex items-center gap-1.5 flex-wrap">
 <span className={`font-bold text-[var(--color-text-primary)] hover:underline cursor-pointer ${visualDepth > 0 ?'text-[11px]':'text-xs'}`}>
 {comment.author.name}
 </span>
 
 {parentAuthorName && (
 <div className="flex items-center gap-0.5 text-[var(--color-text-secondary)] font-medium text-[10px]">
 <CornerDownRight className="w-3 h-3"/>
 <span>{parentAuthorName}</span>
 </div>
 )}

 {comment.author.badge && (
 <span className="text-[10px] font-semibold bg-blue-100 text-blue-600 px-1.5 py-0.2 rounded-full border border-blue-200">
 {comment.author.badge}
 </span>
 )}
 {comment.isPinned && (
 <span className="text-[10px] font-semibold bg-amber-100 /80 text-amber-600 px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
 <Pin className="w-2.5 h-2.5 fill-amber-500"/> Pinned
 </span>
 )}
 </div>
 <div className="flex items-center gap-1.5">
 <span className="text-[var(--color-text-secondary)] text-[10px] whitespace-nowrap">{comment.timestamp}</span>
 {comment.isEdited && <span className="text-[var(--color-text-secondary)] text-[9px] font-medium italic">(edited)</span>}
 <div className="relative">
 <button 
 type="button"
 aria-haspopup="menu"
 aria-expanded={showMenu}
 onClick={() => setShowMenu(!showMenu)}
 className="opacity-0 group-hover/comment:opacity-100 transition-opacity p-2 text-[var(--color-text-secondary)] hover:text-slate-600 :text-slate-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
 title="Comment options"
 >
 <MoreHorizontal className="w-3.5 h-3.5"/>
 </button>
 {showMenu && (
 <>
 <div className="fixed inset-0 z-10"onClick={() => setShowMenu(false)} />
 <div role="menu"className="absolute right-0 top-6 z-20 w-32 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg py-1 animate-in zoom-in-95 fade-in">
 {comment.isAuthor && (
 <>
 <button role="menuitem"type="button"onClick={() => { setIsEditing(true); setShowMenu(false); }} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-[var(--color-bg-alt)] :bg-[var(--color-surface)] transition focus-visible:bg-[var(--color-bg-alt)] :bg-[var(--color-surface)] outline-none"><Edit3 className="w-3.5 h-3.5"/> Edit</button>
 <button role="menuitem"type="button"onClick={() => { onDelete(comment.id); setShowMenu(false); }} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 :bg-red-950/30 transition focus-visible:bg-red-50 :bg-red-950/30 outline-none"><Trash2 className="w-3.5 h-3.5"/> Delete</button>
 <div className="h-px bg-[var(--color-bg-alt)] my-1"/>
 </>
 )}
 <button 
 role="menuitem"
 type="button"
 onClick={() => {
 onTogglePin?.(comment.id);
 setShowMenu(false);
 }} 
 className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs text-amber-600 hover:bg-amber-50 :bg-amber-950/30 transition font-medium"
 >
 <Pin className="w-3.5 h-3.5 fill-amber-500"/> {comment.isPinned ?'Unpin comment':'Pin comment'}
 </button>
 <button 
 role="menuitem"
 type="button"
 onClick={() => {
 try {
 navigator.clipboard.writeText(comment.text);
 } catch {}
 setShowMenu(false);
 }} 
 className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-[var(--color-bg-alt)] :bg-[var(--color-surface)] transition"
 >
 <Copy className="w-3.5 h-3.5"/> Copy text
 </button>
 <button role="menuitem"type="button"onClick={() => setShowMenu(false)} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 :bg-red-950/30 transition focus-visible:bg-red-50 :bg-red-950/30 outline-none"><Flag className="w-3.5 h-3.5"/> Report</button>
 </div>
 </>
 )}
 </div>
 </div>
 </div>

 {isEditing ? (
 <form onSubmit={handleSaveEdit} className="mt-2 flex items-center gap-2">
 <CommentInputWithAutocomplete
 autoFocus
 value={editInput}
 onChange={setEditInput}
 className="flex-1 bg-[var(--color-surface)] px-2.5 py-1.5 rounded-lg text-xs border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-slate-800"
 />
 <button type="submit"className="px-3 py-1.5 bg-[var(--color-accent-sage)] text-slate-800 rounded-lg text-xs font-semibold hover:bg-blue-700 transition shadow-2xs">Save</button>
 <button type="button"onClick={() => { setIsEditing(false); setEditInput(comment.text); }} className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-300 :bg-slate-700 transition">Cancel</button>
 </form>
 ) : (
 <p className={`text-slate-700 leading-relaxed break-words ${visualDepth > 0 ?'text-[11px]':'text-xs'}`}>
 {formatRichText(comment.text)}
 </p>
 )}

 {comment.media && (
 <div className="mt-2 rounded-xl overflow-hidden border border-[var(--color-border)] bg-slate-50">
 <img src={comment.media} alt="Attached media"className="max-h-48 w-auto object-cover"/>
 </div>
 )}

 {comment.hasVoiceNote && (
 <VoicePlayer 
 duration={comment.voiceDuration} 
 />
 )}

 {/* Display active reactions */}
 {comment.reactions && Object.keys(comment.reactions).length > 0 && (
 <div className="flex flex-wrap items-center gap-1.5 mt-2">
 {Object.entries(comment.reactions).map(([emoji, count]) => {
 const rConfig = REACTIONS.find(r => r.emoji === emoji);
 return (
 <button 
 key={emoji}
 onClick={() => onToggleReaction(comment.id, emoji)}
 className={cn(
"flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer border",
 rConfig ? rConfig.bg :"bg-[var(--color-bg-alt)]",
 rConfig ? rConfig.color :"text-slate-700",
 rConfig ?"border-transparent":"border-[var(--color-border)]"
 )}
 >
 <span>{emoji}</span>
 <span>{count}</span>
 </button>
 );
 })}
 </div>
 )}
 </div>

 <div className="flex items-center gap-3 text-[11px] mt-1 px-1.5 relative">
 <button
 type="button"
 data-liked={comment.isLiked ?"true":"false"}
 onClick={() => onLike(comment.id)}
 className={`flex items-center gap-1 font-medium transition cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded-md px-1 ${
 comment.isLiked ?'text-red-500 font-semibold':'text-[var(--color-text-secondary)] hover:text-slate-600 :text-slate-200'
 }`}
 >
 <Heart className={`w-3 h-3 ${comment.isLiked ?'fill-red-500':''}`} />
 <span>{comment.likes > 0 ? comment.likes :'Like'}</span>
 </button>

 <button 
 type="button"
 onClick={() => setIsReplying(!isReplying)}
 className="text-[var(--color-text-secondary)] hover:text-slate-600 :text-slate-200 font-medium flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded-md px-1"
 >
 <CornerDownRight className="w-3 h-3"/>
 <span>Reply</span>
 </button>

 <div className="relative flex items-center">
 <button 
 type="button"
 onClick={() => setShowEmojiPicker(!showEmojiPicker)}
 className="text-[var(--color-text-secondary)] hover:text-slate-600 :text-slate-200 font-medium flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded-md px-1"
 >
 <Smile className="w-3 h-3"/>
 <span>React</span>
 </button>

 {showEmojiPicker && (
 <div className="absolute top-full left-0 mt-1 z-50 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl rounded-full px-2 py-1 flex items-center gap-1 animate-in zoom-in-95 fade-in duration-200">
 {REACTIONS.map((reaction) => (
 <button
 key={reaction.type}
 type="button"
 onClick={() => {
 onToggleReaction(comment.id, reaction.emoji);
 setShowEmojiPicker(false);
 }}
 className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[var(--color-bg-alt)] :bg-[var(--color-surface)] transition-transform hover:scale-125 cursor-pointer text-base"
 title={reaction.label}
 >
 {reaction.emoji}
 </button>
 ))}
 </div>
 )}
 </div>
 {comment.replies && comment.replies.length > 0 && (
 <div className="flex items-center mt-1">
 <button
 type="button"
 onClick={() => setIsRepliesExpanded(!isRepliesExpanded)}
 className="text-blue-600 hover:bg-blue-50 :bg-blue-900/40 px-2.5 py-1.5 rounded-full font-bold cursor-pointer flex items-center gap-1.5 text-xs transition-colors"
 >
 {isRepliesExpanded ? <ChevronUp className="w-3.5 h-3.5"/> : <ChevronDown className="w-3.5 h-3.5"/>}
 {isRepliesExpanded ?'Hide replies':`View ${comment.replies.length} ${comment.replies.length === 1 ?'reply':'replies'}`}
 </button>
 </div>
 )}
 </div>

 {/* Inline Reply Input Composer */}
 {isReplying && (
 <div className="mt-2.5 animate-in fade-in slide-in-from-top-1">
 <form onSubmit={handleSendReply} className="flex items-center gap-2">
 <div className="flex-1 relative flex items-center bg-[var(--color-bg-alt)] /80 rounded-xl px-2 focus-within:ring-2 focus-within:ring-blue-500/40 border border-[var(--color-border)]">
 <CommentInputWithAutocomplete
 autoFocus
 placeholder={`Reply to @${comment.author.name}...`}
 value={replyInput}
 onChange={setReplyInput}
 className="flex-1 bg-transparent py-1.5 px-1 text-xs outline-none text-slate-800 border-none"
 />
 <button
 type="button"
 title="Attach mock media"
 onClick={() => setReplyMedia(replyMedia ? null :"https://images.unsplash.com/photo-1682687982501-1e58b8147382?w=300&auto=format&fit=crop&q=80")}
 className={`p-1.5 rounded-full transition ${replyMedia ?'text-[var(--color-accent-sage)] bg-blue-50 /40':'text-[var(--color-text-secondary)] hover:text-slate-600 :text-slate-300'}`}
 >
 <ImageIcon className="w-3.5 h-3.5"/>
 </button>
 </div>
 <button
 type="submit"
 disabled={!replyInput.trim() && !replyMedia}
 className="px-3 py-1.5 bg-[var(--color-accent-sage)] disabled:opacity-50 text-slate-800 rounded-xl text-xs font-semibold hover:bg-blue-700 transition shadow-2xs cursor-pointer"
 >
 Reply
 </button>
 </form>
 {replyMedia && (
 <div className="mt-2 relative inline-block">
 <img src={replyMedia} alt="Preview"className="h-16 rounded-lg border border-[var(--color-border)] shadow-sm"/>
 <button type="button"onClick={() => setReplyMedia(null)} className="absolute -top-1.5 -right-1.5 bg-[var(--color-surface)] text-slate-800 rounded-full p-0.5 shadow-md hover:bg-slate-700 cursor-pointer">
 <X className="w-3 h-3"/>
 </button>
 </div>
 )}
 </div>
 )}

 {/* RECURSIVE REPLIES RENDER */}
 {isRepliesExpanded && comment.replies && comment.replies.length > 0 && (
 <div className="mt-1">
 {comment.replies.map(reply => (
 <CommentRow 
 key={reply.id}
 comment={reply}
 onLike={onLike}
 onAddReply={onAddReply}
 onEdit={onEdit}
 onDelete={onDelete}
 onToggleReaction={onToggleReaction}
 onTogglePin={onTogglePin}
 depth={depth + 1}
 parentAuthorName={comment.author.name}
 />
 ))}
 </div>
 )}
 </div>
 </div>
 </div>
 );
});
CommentRow.displayName ='CommentRow';

/* ========================================================
 MAIN MNC WORLD-GRADE SOCIAL POST CARD
======================================================== */
const updateNestedComment = (comments: Comment[], id: string, updater: (c: Comment) => Comment): Comment[] => {
 let changed = false;
 const newComments = comments.map(c => {
 if (c.id === id) {
 changed = true;
 return updater(c);
 }
 if (c.replies && c.replies.length > 0) {
 const nextReplies = updateNestedComment(c.replies, id, updater);
 if (nextReplies !== c.replies) {
 changed = true;
 return { ...c, replies: nextReplies };
 }
 }
 return c;
 });
 return changed ? newComments : comments;
};

const deleteNestedComment = (comments: Comment[], id: string): Comment[] => {
 let changed = false;
 const filtered = comments.filter(c => c.id !== id);
 
 if (filtered.length !== comments.length) {
 changed = true;
 }

 const newComments = filtered.map(c => {
 if (c.replies && c.replies.length > 0) {
 const nextReplies = deleteNestedComment(c.replies, id);
 if (nextReplies !== c.replies) {
 changed = true;
 return { ...c, replies: nextReplies };
 }
 }
 return c;
 });

 return changed ? newComments : comments;
};

export function SocialPostCard({
 author = {
 name:'Ray Hammond',
 avatar:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
 location:'New-York',
 verified: true
 },
 timestamp ='Thursday, Jun 31, 5:50 PM',
 privacy ='public',
 content ="Me alegro mucho de compartir con ustedes algunas fotos de mi reciente viaje a Nueva York. ¡La arquitectura, la naturaleza y la energía de la ciudad son increíbles! ¿Cuál es tu lugar favorito de NYC?",
 translatedContent ="I'm so glad to share with you guys some photos from my recent trip to New York. The architecture, nature, and energy of the city are incredible! What is your favorite place in NYC?",
 hashtags = ['#NewYorkCity','#TravelDiaries','#Wanderlust','#Architecture'],
 images = [
'/ny_skyscrapers.jpg',
'/ny_skyline.jpg'
 ],
 poll = {
 id:'p1',
 question:'Which NYC landmark should I visit next?',
 options: [
 { id:'opt1', text:'Central Park Sunset Walk', votes: 142 },
 { id:'opt2', text:'Edge Observation Deck', votes: 218 },
 { id:'opt3', text:'Brooklyn Bridge Photography', votes: 95 }
 ],
 totalVotes: 455,
 expiresIn:'2 days left'
 },
 initialLikes = 245,
 initialSharesCount = 12,
 initialViews = 3420,
 analytics = {
 views: 3420,
 impressionsFeed: 2223,
 impressionsSearch: 684,
 impressionsDirect: 513,
 engagementRate: 98.4,
 clicks: 412
 },
 initialComments = [
 {
 id:'c2',
 author: {
 name:'Marcus Vance',
 avatar:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
 },
 timestamp:'Yesterday at 8:45 PM',
 text:"Here is a quick voice note about the best Brooklyn pizza spots! 🍕",
 likes: 14,
 isLiked: true,
 hasVoiceNote: true,
 voiceDuration:'0:24'
 },
 {
 id:'c1',
 author: {
 name:'Cynthia Henry',
 avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
 badge:'Top Fan'
 },
 timestamp:'Today at 3:30 PM',
 text:"Wow, those photos look amazing! I'm visiting NYC next week. Can you recommend some must-see locations? 🙏",
 likes: 9,
 isLiked: false,
 isPinned: true,
 replies: [
 {
 id:'r1',
 author: {
 name:'Ray Hammond',
 avatar:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
 },
 timestamp:'Today at 4:10 PM',
 text:"Definitely check out Central Park at sunset and the Edge observation deck in Hudson Yards! 🌆",
 likes: 5
 }
 ]
 }
 ],
 profile,
 postId ='mainPost'
}: SocialPostProps) {
 // Post Core State
 const [currentReaction, setCurrentReaction] = useState<ReactionType | null>('love');
 const [likesCount, setLikesCount] = useState(initialLikes);
 const [sharesCount, setSharesCount] = useState(initialSharesCount);
 const [viewsCount] = useState(initialViews);
 const [isSaved, setIsSaved] = useState(false);
 const [soundEnabled, setSoundEnabled] = useState(true);

 // Translation Toggle State
 const [showTranslation, setShowTranslation] = useState(false);

 // Poll State
 const [pollState, setPollState] = useState<PollData | undefined>(poll);

 // Modals
 const [showReactionPicker, setShowReactionPicker] = useState(false);
 const [showMenu, setShowMenu] = useState(false);
 const [showShareModal, setShowShareModal] = useState(false);
 const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
 const [showReactionUsersModal, setShowReactionUsersModal] = useState(false);
 const [activeReactionTab, setActiveReactionTab] = useState<'all'| ReactionType>('all');
 const [isEditingPost, setIsEditingPost] = useState(false);
 const [postText, setPostText] = useState(content);

 // Discussion Comments Panel
 const [isCommentsOpen, setIsCommentsOpen] = useState(true);
 const [commentSort, setCommentSort] = useState<'newest'|'oldest'|'top'>('oldest');
 const [commentFilter, setCommentFilter] = useState<'all'|'top'|'pinned'>('all');
 const [comments, setComments] = useState<Comment[]>(initialComments);
 const [newCommentText, setNewCommentText] = useState('');
 const [newCommentMedia, setNewCommentMedia] = useState<string | null>(null);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [showEmojiPicker, setShowEmojiPicker] = useState(false);
 
 // Refs
 const commentsEndRef = useRef<HTMLDivElement>(null);
 const commentsStartRef = useRef<HTMLDivElement>(null);

 // Lightbox Modal
 const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

 // Debounced Search
 const [searchQuery, setSearchQuery] = useState('');
 const [debouncedQuery, setDebouncedQuery] = useState('');

 const [notification, setNotification] = useState<string | null>(null);
 const reactionTimeoutRef = useRef<any>(null);
 const toastTimeoutRef = useRef<any>(null);
 const heartBurstTimeoutRef = useRef<any>(null);
 const activeTimeouts = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

 // MNC-Grade Premium Feature States
 const [visibleCommentCount, setVisibleCommentCount] = useState(10);

 // MNC-Grade Premium Feature States
 const [isContentLoaded, setIsContentLoaded] = useState(false);
 const [isTextExpanded, setIsTextExpanded] = useState(false);
 const [heartBurst, setHeartBurst] = useState<{ show: boolean; x: number; y: number; idx: number }>({ show: false, x: 0, y: 0, idx: -1 });
 const [touchStartX, setTouchStartX] = useState<number | null>(null);

 // Auto-Hydration from IndexedDB
 useEffect(() => {
 idbLoadPostState(postId).then((stored) => {
 if (stored) {
 if (stored.likesCount !== undefined) setLikesCount(stored.likesCount);
 if (stored.currentReaction !== undefined) setCurrentReaction(stored.currentReaction);
 if (stored.isSaved !== undefined) setIsSaved(stored.isSaved);
 if (stored.comments) setComments(stored.comments);
 if (stored.pollState) setPollState(stored.pollState);
 }
 });
 }, [postId]);

 // Auto-Save to IndexedDB on State Change
 useEffect(() => {
 const handler = setTimeout(() => {
 idbSavePostState(postId, {
 likesCount,
 currentReaction,
 isSaved,
 comments,
 pollState
 });
 }, 500);
 return () => clearTimeout(handler);
 }, [likesCount, currentReaction, isSaved, comments, pollState, postId]);

 // Debounce search query effect
 useEffect(() => {
 const handler = setTimeout(() => setDebouncedQuery(searchQuery), 200);
 return () => clearTimeout(handler);
 }, [searchQuery]);

 // Premium skeleton loading simulation (700ms reveal)
 useEffect(() => {
 const t = setTimeout(() => setIsContentLoaded(true), 700);
 return () => clearTimeout(t);
 }, []);

 // MNC-Grade Timeout Cleanup
 useEffect(() => {
 return () => {
 if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
 if (reactionTimeoutRef.current) clearTimeout(reactionTimeoutRef.current);
 if (heartBurstTimeoutRef.current) clearTimeout(heartBurstTimeoutRef.current);
 activeTimeouts.current.forEach(clearTimeout);
 activeTimeouts.current.clear();
 };
 }, []);

 const showToast = useCallback((msg: string) => {
 setNotification(msg);
 if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
 toastTimeoutRef.current = setTimeout(() => setNotification(null), 2500);
 }, []);

 // Web Audio Synthesizer
 const playSoundEffect = useCallback((freq = 587.33) => {
 if (!soundEnabled) return;
 try {
 const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
 const osc = ctx.createOscillator();
 const gain = ctx.createGain();
 osc.type ='sine';
 osc.frequency.setValueAtTime(freq, ctx.currentTime);
 gain.gain.setValueAtTime(0.08, ctx.currentTime);
 gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
 osc.connect(gain);
 gain.connect(ctx.destination);
 osc.start();
 osc.stop(ctx.currentTime + 0.15);
 } catch {}
 }, [soundEnabled]);

 // Optimistic Reactions
 const handleSelectReaction = useCallback((type: ReactionType) => {
 playSoundEffect(660);
 setCurrentReaction(prev => {
 if (prev === type) {
 setLikesCount(l => l - 1);
 return null;
 }
 if (!prev) setLikesCount(l => l + 1);
 const reactionObj = REACTIONS.find(r => r.type === type);
 showToast(`Reacted with ${reactionObj?.emoji ||'❤️'}`);
 return type;
 });
 setShowReactionPicker(false);
 }, [playSoundEffect, showToast]);



 // Poll Vote Handler
 const handleVotePoll = useCallback((optionId: string) => {
 if (!pollState) return;
 playSoundEffect(880);

 setPollState(prev => {
 if (!prev) return prev;
 const currentVoted = prev.userVotedOptionId;
 if (currentVoted === optionId) return prev;

 const updatedOptions = prev.options.map(opt => {
 if (opt.id === optionId) {
 return { ...opt, votes: opt.votes + 1 };
 }
 if (opt.id === currentVoted) {
 return { ...opt, votes: Math.max(0, opt.votes - 1) };
 }
 return opt;
 });

 const newTotal = currentVoted ? prev.totalVotes : prev.totalVotes + 1;
 return {
 ...prev,
 options: updatedOptions,
 totalVotes: newTotal,
 userVotedOptionId: optionId
 };
 });

 showToast('Vote submitted! 📊');
 }, [pollState, playSoundEffect, showToast]);

 const handleToggleSave = useCallback(() => {
 playSoundEffect();
 setIsSaved(prev => {
 showToast(!prev ?'Saved to bookmarks 🔖':'Removed from bookmarks');
 return !prev;
 });
 setShowMenu(false);
 }, [playSoundEffect, showToast]);

 // Add Top-Level Comment
 const handleAddComment = useCallback((e: React.FormEvent) => {
 e.preventDefault();
 if (!newCommentText.trim() && !newCommentMedia) return;
 if (isSubmitting) return;

 setIsSubmitting(true);
 playSoundEffect();
 
 // Simulate API delay
 const t = setTimeout(() => {
 const newComment: Comment = {
 id: crypto.randomUUID(),
 author: {
 name: profile?.name ||'You',
 avatar: profile?.animatedAvatar || profile?.avatar ||'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
 badge: profile?.subscriptionTier ==='nitro_pro'?'Nitro Pro':'Author'
 },
 timestamp:'Just now',
 text: newCommentText.trim(),
 media: newCommentMedia || undefined,
 likes: 0
 };

 setComments(prev => [...prev, newComment]);
 setNewCommentText('');
 setNewCommentMedia(null);
 setShowEmojiPicker(false);
 setIsSubmitting(false);
 showToast('Comment posted! 🚀');

 const innerT = setTimeout(() => {
 if (commentSort ==='newest') {
 commentsStartRef.current?.scrollIntoView({ behavior:'smooth'});
 } else {
 commentsEndRef.current?.scrollIntoView({ behavior:'smooth'});
 }
 activeTimeouts.current.delete(innerT);
 }, 100);
 activeTimeouts.current.add(innerT);
 activeTimeouts.current.delete(t);
 }, 400);
 activeTimeouts.current.add(t);
 }, [newCommentText, newCommentMedia, playSoundEffect, profile, showToast, commentSort, isSubmitting]);

 // Add Nested Reply to Specific Comment
 const handleAddReplyToComment = useCallback((commentId: string, replyText: string, media?: string | null) => {
 playSoundEffect();
 const newReply: Comment = {
 id: crypto.randomUUID(),
 author: {
 name: profile?.name ||'You',
 avatar: profile?.animatedAvatar || profile?.avatar ||'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
 badge: profile?.subscriptionTier ==='nitro_pro'?'Nitro Pro':'Author'
 },
 timestamp:'Just now',
 text: replyText,
 media: media || undefined,
 likes: 0,
 isAuthor: true
 };

 setComments(prev => updateNestedComment(prev, commentId, (c) => ({
 ...c,
 replies: [...(c.replies || []), newReply]
 })));

 showToast('Reply posted! 💬');
 }, [playSoundEffect, showToast, profile]);

 const handleToggleCommentLike = useCallback((commentId: string) => {
 playSoundEffect();
 setComments(prev => updateNestedComment(prev, commentId, (c) => {
 const liked = !c.isLiked;
 return {
 ...c,
 isLiked: liked,
 likes: liked ? c.likes + 1 : Math.max(0, c.likes - 1)
 };
 }));
 }, [playSoundEffect]);

 const handleEditComment = useCallback((commentId: string, newText: string) => {
 playSoundEffect();
 setComments(prev => updateNestedComment(prev, commentId, (c) => ({
 ...c,
 text: newText,
 isEdited: true
 })));
 showToast('Comment edited! 📝');
 }, [playSoundEffect, showToast]);

 const handleDeleteComment = useCallback((commentId: string) => {
 playSoundEffect();
 setComments(prev => deleteNestedComment(prev, commentId));
 showToast('Comment deleted! 🗑️');
 }, [playSoundEffect, showToast]);

 const handleToggleReaction = useCallback((commentId: string, emoji: string) => {
 playSoundEffect();
 setComments(prev => updateNestedComment(prev, commentId, (c) => {
 const currentCount = c.reactions?.[emoji] || 0;
 const newCount = currentCount > 0 ? 0 : 1;
 const newReactions = { ...c.reactions };
 if (newCount === 0) {
 delete newReactions[emoji];
 } else {
 newReactions[emoji] = newCount;
 }
 return {
 ...c,
 reactions: newReactions
 };
 }));
 }, [playSoundEffect]);

 // Toggle Comment Pin Status
 const handleTogglePinComment = useCallback((commentId: string) => {
 playSoundEffect(700);
 setComments(prev => updateNestedComment(prev, commentId, (c) => {
 const nextPinned = !c.isPinned;
 showToast(nextPinned ?'Comment pinned to top! 📌':'Comment unpinned! 📌');
 return { ...c, isPinned: nextPinned };
 }));
 }, [playSoundEffect, showToast]);



 // Filtered & Sorted Comments List
 const filteredComments = useMemo(() => {
 const query = debouncedQuery.toLowerCase();
 const result = comments.filter(c => {
 if (commentFilter ==='pinned') return c.isPinned || c.replies?.some(r => r.isPinned);
 if (query) {
 const matchesComment = c.text.toLowerCase().includes(query) || c.author.name.toLowerCase().includes(query);
 const matchesReplies = c.replies?.some(r => r.text.toLowerCase().includes(query) || r.author.name.toLowerCase().includes(query));
 return matchesComment || matchesReplies;
 }
 return true;
 });

 let sorted = [...result];

 // 1. Apply primary sort
 if (commentSort ==='newest') {
 sorted.reverse();
 } else if (commentSort ==='top') {
 sorted.sort((a, b) => b.likes - a.likes);
 }
 
 // 2. MNC Grade Logic: Pinned comments MUST always float to the absolute top
 sorted.sort((a, b) => {
 if (a.isPinned && !b.isPinned) return -1;
 if (!a.isPinned && b.isPinned) return 1;
 return 0; // Maintain relative order if both are pinned or both are unpinned
 });

 return sorted;
 }, [comments, commentFilter, debouncedQuery, commentSort]);

 // Paginated Comments
 const paginatedComments = useMemo(() => {
 return filteredComments.slice(0, visibleCommentCount);
 }, [filteredComments, visibleCommentCount]);

 // Mock Reaction Users List for Reactions Breakdown Modal
 const mockReactionUsers: ReactionUser[] = useMemo(() => [
 { id:'u1', name:'Ray Hammond', avatar: author.avatar, reaction:'love', badge:'Author'},
 { id:'u2', name:'Cynthia Henry', avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', reaction:'love', badge:'Top Fan'},
 { id:'u3', name:'Marcus Vance', avatar:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', reaction:'fire'},
 { id:'u4', name:'Elena Rostova', avatar:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', reaction:'like'},
 { id:'u5', name:'Devon Lane', avatar:'', reaction:'haha'}
 ], [author.avatar]);

 const activeReactionObj = useMemo(() => REACTIONS.find(r => r.type === currentReaction), [currentReaction]);

 // Double-tap heart burst handler (Instagram/Twitter-style)
 const handleImageDoubleTap = useCallback((e: React.MouseEvent<HTMLDivElement>, imageIdx: number) => {
 const rect = e.currentTarget.getBoundingClientRect();
 const x = e.clientX - rect.left;
 const y = e.clientY - rect.top;
 setHeartBurst({ show: true, x, y, idx: imageIdx });
 if (!currentReaction) handleSelectReaction('love');
 playSoundEffect(880);
 
 if (heartBurstTimeoutRef.current) clearTimeout(heartBurstTimeoutRef.current);
 heartBurstTimeoutRef.current = setTimeout(() => setHeartBurst({ show: false, x: 0, y: 0, idx: -1 }), 900);
 }, [currentReaction, handleSelectReaction, playSoundEffect]);

 // Computed"Read More"text truncation (180-char threshold)
 const displayText = showTranslation ? (translatedContent ||'') : postText;
 const isTextLong = displayText.length > 180;
 const truncatedText = isTextLong && !isTextExpanded ? displayText.slice(0, 180) +'…': displayText;

 // MNC Keyboard Shortcuts: L=Like, C=Comment focus, Esc=Close all modals
 useEffect(() => {
 const onKey = (e: KeyboardEvent) => {
 if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
 switch (e.key.toLowerCase()) {
 case'l': handleSelectReaction(currentReaction ||'love'); break;
 case'c': 
 document.getElementById('main-comment-input')?.focus(); 
 setIsCommentsOpen(true); 
 break;
 case'escape':
 setShowShareModal(false);
 setShowAnalyticsModal(false);
 setShowReactionUsersModal(false);
 setLightboxIndex(null);
 setShowMenu(false);
 break;
 }
 };
 window.addEventListener('keydown', onKey);
 return () => window.removeEventListener('keydown', onKey);
 }, [currentReaction, handleSelectReaction]);

 // MNC-Grade Infinite Scroll Observer
 useEffect(() => {
 if (!isCommentsOpen || !commentsEndRef.current) return;
 
 const observer = new IntersectionObserver(
 (entries) => {
 if (entries[0].isIntersecting && visibleCommentCount < filteredComments.length) {
 setVisibleCommentCount(prev => Math.min(prev + 10, filteredComments.length));
 }
 },
 { threshold: 0.1, rootMargin:'100px'}
 );
 
 const currentRef = commentsEndRef.current;
 observer.observe(currentRef);
 
 return () => {
 observer.unobserve(currentRef);
 };
 }, [isCommentsOpen, visibleCommentCount, filteredComments.length]);

 return (
 <div className="w-full h-full font-sans selection:bg-[var(--color-accent-sage)] selection:text-slate-800 relative">
 
 {/* Toast Notification Pill */}
 {notification && (
 <div 
 role="status"
 aria-live="polite"
 className="fixed top-5 right-5 z-[100] bg-[#F9F9F7]/95 /95 text-slate-800 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in backdrop-blur-md"
 >
 <Sparkles className="w-4 h-4 text-amber-400 animate-spin"/>
 {notification}
 </div>
 )}

 {/* Main Layout Container */}
 <div className={`flex w-full h-full transition-all duration-500 ease-in-out`}>
 
 {/* LEFT COLUMN: Main Social Post Card */}
 <article 
 data-state="open"
 className={`${isCommentsOpen ?'hidden lg:flex lg:w-7/12 border-r':'flex w-full md:max-w-3xl mx-auto'} bg-[var(--color-surface)] border-[var(--color-border)] p-4 sm:p-7 transition-all relative text-[var(--color-text-primary)] flex-col justify-between overflow-y-auto h-full`}
 >
 
 {/* Premium Skeleton Loading State */}
 {!isContentLoaded && (
 <div className="absolute inset-0 z-30 bg-[var(--color-surface)] rounded-3xl overflow-hidden transition-opacity duration-500">
 <SkeletonShimmer />
 </div>
 )}

 <div>
 {/* Header */}
 <div className="flex items-start justify-between mb-4">
 <div className="flex items-center gap-3">
 <div className="relative">
 <AvatarWithFallback name={author.name} src={author.avatar} size="w-12 h-12"/>
 <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"title="Online"/>
 </div>

 <div>
 <div className="flex items-center gap-1.5 flex-wrap">
 <h3 className="font-bold text-base text-[var(--color-text-primary)] leading-tight flex items-center gap-1">
 {author.name}
 {author.verified && <CheckCircle2 className="w-4 h-4 text-[var(--color-accent-sage)] fill-blue-500/20"/>}
 </h3>
 <span className="text-[var(--color-text-secondary)] text-xs font-normal">is at</span>
 <a href="#location" className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline text-xs sm:text-sm bg-blue-500/10 px-2.5 py-0.5 rounded-lg border border-blue-500/20 focus-visible:ring-2 focus-visible:ring-blue-500 outline-none">
 <MapPin className="w-3 h-3 text-[var(--color-accent-sage)]"/>
 {author.location}
 </a>
 </div>

 <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-xs mt-1">
 <span>{timestamp}</span>
 <span>•</span>
 <span className="flex items-center gap-1 text-[var(--color-text-secondary)]"title={privacy}>
 {privacy ==='public'&& <Globe className="w-3 h-3"/>}
 {privacy ==='friends'&& <Tag className="w-3 h-3"/>}
 {privacy ==='only_me'&& <Lock className="w-3 h-3"/>}
 <span className="capitalize">{privacy}</span>
 </span>
 </div>
 </div>
 </div>

 {/* Sound Toggle & Options */}
 <div className="flex items-center gap-1">
 <button
 type="button"
 onClick={() => setSoundEnabled(!soundEnabled)}
 className="p-2 rounded-full hover:bg-[var(--color-bg-alt)] :bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-slate-600 :text-slate-200 transition focus-visible:ring-2 focus-visible:ring-blue-500 outline-none cursor-pointer"
 title={soundEnabled ?'Sound enabled':'Sound muted'}
 aria-label="Toggle haptic audio effects"
 >
 {soundEnabled ? <Volume2 className="w-4.5 h-4.5 text-[var(--color-accent-sage)]"/> : <VolumeX className="w-4.5 h-4.5"/>}
 </button>

 <div className="relative">
 <button
 type="button"
 onClick={() => setShowMenu(!showMenu)}
 className="p-2 rounded-full hover:bg-[var(--color-bg-alt)] :bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-slate-600 :text-slate-200 transition focus-visible:ring-2 focus-visible:ring-blue-500 outline-none cursor-pointer"
 aria-label="More post options"
 >
 <MoreHorizontal className="w-5 h-5"/>
 </button>

 {/* Options Dropdown */}
 {showMenu && (
 <>
 <div className="fixed inset-0 z-10"onClick={() => setShowMenu(false)} />
 <div className="absolute right-0 top-11 z-20 w-52 bg-[var(--color-surface)]/95 /95 backdrop-blur-md border border-[var(--color-border)]/80 rounded-2xl shadow-2xl p-1.5 space-y-0.5 text-sm animate-in fade-in zoom-in-95">
 <button
 type="button"
 onClick={() => { setShowMenu(false); setIsEditingPost(true); }}
 className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-blue-50 :bg-blue-950/50 hover:text-blue-600 transition text-xs font-medium cursor-pointer"
 >
 <Edit3 className="w-4 h-4 text-[var(--color-text-secondary)]"/>
 Edit post text
 </button>
 <button
 type="button"
 onClick={() => { setShowMenu(false); setShowShareModal(true); }}
 className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-blue-50 :bg-blue-950/50 hover:text-blue-600 transition text-xs font-medium cursor-pointer"
 >
 <Copy className="w-4 h-4 text-[var(--color-text-secondary)]"/>
 Copy post link
 </button>
 <button
 type="button"
 onClick={handleToggleSave}
 className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-blue-50 :bg-blue-950/50 hover:text-blue-600 transition text-xs font-medium cursor-pointer"
 >
 <Bookmark className={`w-4 h-4 ${isSaved ?'fill-amber-400 text-amber-500':'text-[var(--color-text-secondary)]'}`} />
 {isSaved ?'Saved in bookmarks':'Save post'}
 </button>
 <div className="h-px bg-[var(--color-bg-alt)] my-1"/>
 <button
 type="button"
 onClick={() => { setShowMenu(false); showToast('Report submitted'); }}
 className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-amber-50 :bg-amber-950/50 hover:text-amber-600 transition text-xs font-medium cursor-pointer"
 >
 <Flag className="w-4 h-4 text-amber-500"/>
 Report post
 </button>
 <button
 type="button"
 onClick={() => { setShowMenu(false); showToast('Post deleted'); }}
 className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 :bg-red-950/50 transition text-xs font-medium cursor-pointer"
 >
 <Trash2 className="w-4 h-4 text-red-500"/>
 Delete post
 </button>
 </div>
 </>
 )}
 </div>
 </div>
 </div>

 {/* Post Content */}
 {isEditingPost ? (
 <div className="mb-4 space-y-3 bg-[var(--color-bg-alt)]/60 p-4 rounded-2xl border border-[var(--color-border)]">
 <textarea
 value={postText}
 onChange={(e) => setPostText(e.target.value)}
 className="w-full bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-medium"
 rows={3}
 />
 <div className="flex items-center justify-end gap-2">
 <button
 type="button"
 onClick={() => setIsEditingPost(false)}
 className="px-3 py-1.5 rounded-xl text-xs font-medium text-[var(--color-text-secondary)] hover:bg-slate-200 :bg-slate-700 transition"
 >
 Cancel
 </button>
 <button
 type="button"
 onClick={() => { setIsEditingPost(false); showToast('Post updated!'); }}
 className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[var(--color-accent-sage)] text-slate-800 hover:bg-blue-700 transition shadow-xs cursor-pointer"
 >
 Save Changes
 </button>
 </div>
 </div>
 ) : (
 <div className="space-y-2 mb-3">
 <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-normal">
 {truncatedText}
 </p>
 {isTextLong && (
 <button
 type="button"
 onClick={() => setIsTextExpanded(!isTextExpanded)}
 className="text-xs font-bold text-blue-600 hover:underline cursor-pointer transition flex items-center gap-1"
 >
 {isTextExpanded ?'↑ Show less':'↓ Read more'}
 </button>
 )}
 {translatedContent && (
 <button
 type="button"
 onClick={() => setShowTranslation(!showTranslation)}
 className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
 >
 <Languages className="w-3.5 h-3.5"/>
 {showTranslation ?'See original text':'See translation (English)'}
 </button>
 )}
 </div>
 )}

 {/* Hashtags Chips */}
 {hashtags && hashtags.length > 0 && (
 <div className="flex items-center gap-1.5 flex-wrap mb-4">
 {hashtags.map((tag, idx) => (
 <span 
 key={idx} 
 className="text-xs font-semibold text-blue-600 bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 rounded-lg cursor-pointer transition border border-blue-500/20"
 >
 {tag}
 </span>
 ))}
 </div>
 )}



 {/* Media Gallery (0 CLS Aspect-Ratio Locked Grid) */}
 {images && images.length > 0 && (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 rounded-2xl overflow-hidden relative group">
 {images.map((img, index) => (
 <div 
 key={index} 
 className="relative group/img cursor-pointer overflow-hidden rounded-2xl bg-[var(--color-bg-alt)] aspect-video sm:aspect-[4/3]"
 onClick={() => setLightboxIndex(index)}
 onDoubleClick={(e) => { e.stopPropagation(); handleImageDoubleTap(e, index); }}
 >
 {heartBurst.show && heartBurst.idx === index && (
 <HeartBurstOverlay show={true} x={heartBurst.x} y={heartBurst.y} />
 )}
 <img
 src={img}
 alt={`Post photo media ${index + 1}`}
 loading="lazy"
 decoding="async"
 onError={(e) => {
 (e.target as HTMLImageElement).src ='https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=800&q=80'; // Fallback
 }}
 className="w-full h-full object-cover transition duration-500 group-hover/img:scale-105"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition duration-300 flex items-end justify-between p-4">
 <span className="text-slate-800 text-xs font-medium flex items-center gap-1 bg-[var(--color-surface)]/40 backdrop-blur-md px-2.5 py-1 rounded-full">
 <Maximize2 className="w-3.5 h-3.5"/> Fullscreen
 </span>
 <span className="text-slate-800/90 text-[11px] font-mono bg-[var(--color-surface)]/40 backdrop-blur-md px-2.5 py-1 rounded-full">
 Photo {index + 1} of {images.length}
 </span>
 </div>
 </div>
 ))}
 </div>
 )}

 {/* REAL-TIME INTERACTIVE SURVEY POLL WIDGET */}
 {pollState && <PollWidget poll={pollState} onVote={handleVotePoll} />}

 {/* Analytics Summary */}
 <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] mb-4 pt-1 border-b border-slate-100 pb-3">
 <div className="flex items-center gap-3">
 <button
 type="button"
 onClick={() => setShowAnalyticsModal(true)}
 className="flex items-center gap-1 text-slate-600 font-medium hover:text-[var(--color-accent-sage)] transition cursor-pointer"
 >
 <Eye className="w-3.5 h-3.5 text-[var(--color-accent-sage)]"/>
 {viewsCount.toLocaleString()} Views
 </button>
 <span>•</span>
 <button
 type="button"
 onClick={() => setShowAnalyticsModal(true)}
 className="flex items-center gap-1 text-emerald-600 font-medium hover:underline cursor-pointer"
 >
 <TrendingUp className="w-3.5 h-3.5"/>
 98.4% Engagement
 </button>
 </div>

 {isSaved && (
 <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
 <Bookmark className="w-3.5 h-3.5 fill-amber-500"/> Saved
 </span>
 )}
 </div>

 {/* Reaction Counts Summary with Modal Trigger */}
 <div className="flex items-center justify-between mb-4">
 <button 
 type="button"
 onClick={() => setShowReactionUsersModal(true)}
 className="flex items-center gap-2.5 hover:opacity-80 transition cursor-pointer text-left"
 >
 <div className="flex -space-x-2 overflow-hidden">
 <span className="inline-flex items-center justify-center h-6.5 w-6.5 rounded-full bg-rose-500 text-slate-800 ring-2 ring-white text-xs shadow-xs">❤️</span>
 <span className="inline-flex items-center justify-center h-6.5 w-6.5 rounded-full bg-amber-500 text-slate-800 ring-2 ring-white text-xs shadow-xs">🔥</span>
 <span className="inline-flex items-center justify-center h-6.5 w-6.5 rounded-full bg-[var(--color-accent-sage)] text-slate-800 ring-2 ring-white text-xs shadow-xs">👍</span>
 </div>
 <span className="text-slate-700 text-xs font-semibold hover:underline">
 {activeReactionObj ?`${activeReactionObj.emoji} You and ${likesCount - 1} others`:`${likesCount} Reactions`}
 </span>
 </button>

 <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)] font-medium">
 <button 
 type="button"
 onClick={() => setIsCommentsOpen(!isCommentsOpen)} 
 className="hover:text-[var(--color-accent-sage)] transition cursor-pointer underline-offset-4 hover:underline font-semibold"
 >
 {comments.length} Comments
 </button>
 <span>•</span>
 <span>{sharesCount} Shares</span>
 </div>
 </div>
 </div>

 {/* Action Buttons Bar */}
 <div className="relative border-t border-b border-slate-100 /80 py-2 mt-auto flex items-center justify-between text-xs sm:text-sm font-medium text-slate-600">
 
 {/* Reaction Popover */}
 {showReactionPicker && (
 <div 
 className="absolute bottom-12 left-2 z-30 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full shadow-2xl px-3 py-2 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2"
 onMouseEnter={() => clearTimeout(reactionTimeoutRef.current)}
 onMouseLeave={() => setShowReactionPicker(false)}
 >
 {REACTIONS.map((r) => (
 <button
 key={r.type}
 type="button"
 onClick={() => handleSelectReaction(r.type)}
 className="text-xl sm:text-2xl hover:scale-130 transition duration-200 transform hover:-translate-y-1 p-1 rounded-full hover:bg-[var(--color-bg-alt)] :bg-[var(--color-surface)] cursor-pointer"
 title={r.label}
 >
 {r.emoji}
 </button>
 ))}
 </div>
 )}

 {/* Like Trigger */}
 <div
 className="relative flex-1"
 onMouseEnter={() => {
 reactionTimeoutRef.current = setTimeout(() => setShowReactionPicker(true), 250);
 }}
 onMouseLeave={() => clearTimeout(reactionTimeoutRef.current)}
 >
 <button
 type="button"
 data-liked={currentReaction ?"true":"false"}
 onClick={() => handleSelectReaction(currentReaction ||'love')}
 className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 outline-none ${
 activeReactionObj ? `${activeReactionObj.color} font-bold ${activeReactionObj.bg}` : 'hover:bg-blue-500/10 hover:text-[var(--color-text-primary)] text-[var(--color-text-secondary)]'
 }`}
 >
 {activeReactionObj ? (
 <span className="text-base">{activeReactionObj.emoji}</span>
 ) : (
 <Heart className="w-4 h-4 sm:w-5 sm:h-5"/>
 )}
 <span>{activeReactionObj ? activeReactionObj.label :'Like'}</span>
 </button>
 </div>

 {/* Comments Drawer Toggle */}
 <button
 type="button"
 onClick={() => setIsCommentsOpen(!isCommentsOpen)}
 className={`flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl transition cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 outline-none ${
 isCommentsOpen 
 ? 'bg-blue-500/10 text-blue-600 font-bold'
 : 'hover:bg-[var(--color-bg-alt)]/60 hover:text-[var(--color-text-primary)] text-[var(--color-text-secondary)]'
 }`}
 >
 <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5"/>
 <span>Comments ({comments.length})</span>
 </button>

 {/* Share Trigger */}
 <button
 type="button"
 onClick={() => setShowShareModal(true)}
 className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl hover:bg-[var(--color-bg-alt)]/60 transition hover:text-[var(--color-text-primary)] text-[var(--color-text-secondary)] cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
 >
 <Share2 className="w-4 h-4 sm:w-5 sm:h-5"/>
 <span>Share</span>
 </button>
 </div>

 </article>

 {/* RIGHT COLUMN: Virtualized Discussion Stream Panel */}
 {isCommentsOpen && (
 <aside className="w-full lg:w-5/12 bg-[var(--color-surface)] border-[var(--color-border)] p-4 sm:p-6 transition-all duration-300 flex flex-col h-full relative overflow-hidden self-start">
 
 {/* Header */}
 <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4 shrink-0">
 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={() => setIsCommentsOpen(false)}
 className="lg:hidden p-1.5 mr-1 rounded-full hover:bg-[var(--color-bg-alt)] text-[var(--color-text-secondary)] hover:text-slate-600 transition cursor-pointer"
 aria-label="Back to post"
 >
 <ChevronLeft className="w-5 h-5"/>
 </button>
 <MessageCircle className="w-5 h-5 text-blue-600"/>
 <h3 className="font-bold text-base text-[var(--color-text-primary)]">
 Discussion Stream <span className="text-xs font-mono font-normal text-[var(--color-text-secondary)]">({comments.length})</span>
 </h3>
 </div>

 <button
 type="button"
 onClick={() => setIsCommentsOpen(false)}
 className="hidden lg:block p-1.5 rounded-full hover:bg-[var(--color-bg-alt)] :bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-slate-600 :text-slate-200 transition cursor-pointer"
 title="Close discussion panel"
 >
 <X className="w-5 h-5"/>
 </button>
 </div>

 {/* Search Filter Tabs */}
 <div className="space-y-3 mb-4 shrink-0">
 <div className="flex gap-2 relative">
 <div className="relative flex-1">
 <Search className="w-4 h-4 text-[var(--color-text-secondary)] absolute left-3.5 top-2.5"/>
 <input
 type="text"
 placeholder="Search mentions or keywords..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full bg-[var(--color-bg-alt)]/80 /80 pl-9 pr-4 py-2 rounded-xl text-xs border-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-800 placeholder:text-[var(--color-text-secondary)] font-medium"
 />
 </div>
 <select
 value={commentSort}
 onChange={(e) => setCommentSort(e.target.value as'newest'|'oldest'|'top')}
 className="bg-[var(--color-bg-alt)]/80 /80 px-3 py-2 rounded-xl text-xs border-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-800 font-medium cursor-pointer"
 >
 <option value="newest">Newest First</option>
 <option value="oldest">Oldest First</option>
 <option value="top">Top Comments</option>
 </select>
 </div>

 <div className="flex items-center gap-1 bg-[var(--color-bg-alt)] p-1 rounded-xl w-full text-xs">
 <button
 type="button"
 onClick={() => setCommentFilter('all')}
 className={`flex-1 py-1 rounded-lg font-semibold transition text-center cursor-pointer ${commentFilter ==='all'?'bg-[var(--color-surface)] text-blue-600 shadow-xs':'text-[var(--color-text-secondary)] hover:text-slate-600'}`}
 >
 All ({comments.length})
 </button>
 <button
 type="button"
 onClick={() => setCommentFilter('top')}
 className={`flex-1 py-1 rounded-lg font-semibold transition text-center cursor-pointer ${commentFilter ==='top'?'bg-[var(--color-surface)] text-blue-600 shadow-xs':'text-[var(--color-text-secondary)] hover:text-slate-600'}`}
 >
 Top Liked
 </button>
 <button
 type="button"
 onClick={() => setCommentFilter('pinned')}
 className={`flex-1 py-1 rounded-lg font-semibold transition text-center cursor-pointer ${commentFilter ==='pinned'?'bg-[var(--color-surface)] text-blue-600 shadow-xs':'text-[var(--color-text-secondary)] hover:text-slate-600'}`}
 >
 Pinned
 </button>
 </div>
 </div>

 {/* PAGINATED COMMENTS STREAM */}
 <div 
 role="log"
 aria-live="polite"
 className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-5 flex flex-col relative custom-scrollbar"
 >
 <div ref={commentsStartRef} />
 {paginatedComments.length === 0 ? (
 <div className="text-center py-12 text-[var(--color-text-secondary)] space-y-2">
 <MessageCircle className="w-8 h-8 mx-auto text-slate-300"/>
 <p className="text-xs font-medium">No comments match your filter</p>
 </div>
 ) : (
 <div className="space-y-4">
 {paginatedComments.map((comment) => (
 <CommentRow 
 key={comment.id} 
 comment={comment} 
 onLike={handleToggleCommentLike} 
 onAddReply={handleAddReplyToComment} 
 onEdit={handleEditComment}
 onDelete={handleDeleteComment}
 onToggleReaction={handleToggleReaction}
 onTogglePin={handleTogglePinComment}
 />
 ))}
 {visibleCommentCount < filteredComments.length && (
 <div className="pt-4 pb-4 text-center flex justify-center items-center">
 <div className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-blue-500 animate-spin"/>
 </div>
 )}
 <div ref={commentsEndRef} />
 </div>
 )}
 </div>

 {/* Comment Composer Input */}
 <div className="pt-3 border-t border-slate-100 mt-auto shrink-0">
 <form onSubmit={handleAddComment} className="flex items-center gap-3">
 <div className="relative">
 <AvatarWithFallback 
 name={profile?.name ||"You"} 
 src={profile?.animatedAvatar || profile?.avatar ||"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"} 
 size="w-8 h-8"
 />
 <div className="scale-75 origin-center">
 <AvatarDecorationFrame decoration={profile?.subscriptionTier ==='nitro_pro'? profile.avatarDecoration :'none'} />
 </div>
 </div>

 <div className="flex-1 bg-[var(--color-bg-alt)]/90 /80 rounded-full px-3.5 py-2 flex items-center gap-1.5 focus-within:ring-2 focus-within:ring-blue-500/40 transition">
 <CommentInputWithAutocomplete
 id="main-comment-input"
 placeholder="Write a comment..."
 value={newCommentText}
 onChange={setNewCommentText}
 className="w-full bg-transparent border-none text-xs text-slate-800 placeholder:text-[var(--color-text-secondary)] focus:outline-none font-medium"
 />

 <div className="flex items-center gap-0.5 text-[var(--color-text-secondary)]">
 <button
 type="button"
 title="Attach mock media"
 onClick={() => setNewCommentMedia(newCommentMedia ? null :"https://images.unsplash.com/photo-1682687982501-1e58b8147382?w=300&auto=format&fit=crop&q=80")}
 className={`hover:text-slate-600 :text-slate-200 transition p-1 cursor-pointer ${newCommentMedia ?'text-[var(--color-accent-sage)]':''}`}
 >
 <ImageIcon className="w-3.5 h-3.5"/>
 </button>
 <button 
 type="button"
 onClick={() => setShowEmojiPicker(!showEmojiPicker)}
 className="hover:text-slate-600 :text-slate-200 transition p-1 cursor-pointer"
 title="Add emoji"
 >
 <Smile className="w-3.5 h-3.5 text-amber-500"/>
 </button>
 {(newCommentText.trim() || newCommentMedia) && (
 <button 
 type="submit"
 disabled={isSubmitting}
 className="p-1.5 bg-[var(--color-accent-sage)] hover:bg-blue-700 disabled:bg-blue-400 text-slate-800 rounded-full transition ml-0.5 cursor-pointer shadow-xs"
 aria-label="Submit comment"
 >
 {isSubmitting ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Send className="w-3.5 h-3.5"/>}
 </button>
 )}
 </div>
 </div>
 </form>

 {newCommentMedia && (
 <div className="mt-2 ml-11 relative inline-block">
 <img src={newCommentMedia} alt="Preview"className="h-20 rounded-xl border border-[var(--color-border)] shadow-sm object-cover"/>
 <button type="button"onClick={() => setNewCommentMedia(null)} className="absolute -top-2 -right-2 bg-[var(--color-surface)] text-slate-800 rounded-full p-1 shadow-md hover:bg-slate-700 cursor-pointer">
 <X className="w-3 h-3"/>
 </button>
 </div>
 )}

 {showEmojiPicker && (
 <div className="flex items-center gap-1.5 pl-10 pt-2 animate-in fade-in">
 {['❤️','😍','🔥','👏','🗽','✨','🙌','💯'].map((emoji) => (
 <button
 key={emoji}
 type="button"
 onClick={() => setNewCommentText(prev => prev + emoji)}
 className="text-base hover:scale-125 transition p-0.5 cursor-pointer"
 >
 {emoji}
 </button>
 ))}
 </div>
 )}
 </div>

 </aside>
 )}

 </div>

 {/* Analytics Breakdown Modal */}
 {showAnalyticsModal && (
 <div 
 className="fixed inset-0 z-50 bg-[var(--color-surface)]/60 backdrop-blur-xs flex items-center justify-center p-4"
 onClick={() => setShowAnalyticsModal(false)}
 >
 <div 
 role="dialog"
 aria-modal="true"
 aria-label="Post Analytics"
 className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl animate-in fade-in zoom-in-95"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="flex items-center justify-between border-b border-slate-100 pb-3">
 <h3 className="font-bold text-base flex items-center gap-2 text-[var(--color-text-primary)]">
 <PieChart className="w-5 h-5 text-[var(--color-accent-sage)]"/>
 Post Performance Analytics
 </h3>
 <button type="button"aria-label="Close analytics modal"onClick={() => setShowAnalyticsModal(false)} className="p-1 rounded-full hover:bg-[var(--color-bg-alt)] :bg-[var(--color-surface)] text-[var(--color-text-secondary)] cursor-pointer">
 <X className="w-5 h-5"/>
 </button>
 </div>

 <div className="grid grid-cols-3 gap-3 text-center">
 <div className="p-3 bg-[var(--color-bg-alt)]/60 rounded-2xl border border-[var(--color-border)]">
 <div className="text-[var(--color-text-secondary)] text-[10px] uppercase font-bold">Total Views</div>
 <div className="text-lg font-bold text-blue-600 mt-0.5">{analytics.views.toLocaleString()}</div>
 </div>
 <div className="p-3 bg-[var(--color-bg-alt)]/60 rounded-2xl border border-[var(--color-border)]">
 <div className="text-[var(--color-text-secondary)] text-[10px] uppercase font-bold">Engagement Rate</div>
 <div className="text-lg font-bold text-emerald-600 mt-0.5">{analytics.engagementRate}%</div>
 </div>
 <div className="p-3 bg-[var(--color-bg-alt)]/60 rounded-2xl border border-[var(--color-border)]">
 <div className="text-[var(--color-text-secondary)] text-[10px] uppercase font-bold">Link Clicks</div>
 <div className="text-lg font-bold text-purple-600 mt-0.5">{analytics.clicks}</div>
 </div>
 </div>

 <div className="space-y-2 pt-2">
 <div className="text-xs font-bold text-slate-700">Impressions Breakdown:</div>
 <div className="space-y-1.5 text-xs">
 <div>
 <div className="flex justify-between text-[var(--color-text-secondary)] text-[11px] mb-0.5">
 <span>Main Feed</span>
 <span className="font-mono font-bold">65% ({analytics.impressionsFeed})</span>
 </div>
 <div className="h-2 bg-[var(--color-bg-alt)] rounded-full overflow-hidden">
 <div className="h-full bg-[var(--color-accent-sage)] rounded-full"style={{ width:'65%'}} />
 </div>
 </div>
 <div>
 <div className="flex justify-between text-[var(--color-text-secondary)] text-[11px] mb-0.5">
 <span>Search &amp; Hashtags</span>
 <span className="font-mono font-bold">20% ({analytics.impressionsSearch})</span>
 </div>
 <div className="h-2 bg-[var(--color-bg-alt)] rounded-full overflow-hidden">
 <div className="h-full bg-emerald-500 rounded-full"style={{ width:'20%'}} />
 </div>
 </div>
 <div>
 <div className="flex justify-between text-[var(--color-text-secondary)] text-[11px] mb-0.5">
 <span>Direct Links</span>
 <span className="font-mono font-bold">15% ({analytics.impressionsDirect})</span>
 </div>
 <div className="h-2 bg-[var(--color-bg-alt)] rounded-full overflow-hidden">
 <div className="h-full bg-purple-500 rounded-full"style={{ width:'15%'}} />
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* Reactions Users Breakdown Modal */}
 {showReactionUsersModal && (
 <div 
 className="fixed inset-0 z-50 bg-[var(--color-surface)]/60 backdrop-blur-xs flex items-center justify-center p-4"
 onClick={() => setShowReactionUsersModal(false)}
 >
 <div 
 role="dialog"
 aria-modal="true"
 aria-label="Reaction Users"
 className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in fade-in zoom-in-95"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="flex items-center justify-between border-b border-slate-100 pb-3">
 <h3 className="font-bold text-base flex items-center gap-2 text-[var(--color-text-primary)]">
 <Users className="w-5 h-5 text-rose-500"/>
 Post Reactions ({likesCount})
 </h3>
 <button type="button"aria-label="Close reactions modal"onClick={() => setShowReactionUsersModal(false)} className="p-1 rounded-full hover:bg-[var(--color-bg-alt)] :bg-[var(--color-surface)] text-[var(--color-text-secondary)] cursor-pointer">
 <X className="w-5 h-5"/>
 </button>
 </div>

 <div className="flex items-center gap-1 bg-[var(--color-bg-alt)] p-1 rounded-xl text-xs overflow-x-auto">
 <button
 type="button"
 onClick={() => setActiveReactionTab('all')}
 className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer shrink-0 ${activeReactionTab ==='all'?'bg-[var(--color-surface)] text-blue-600 shadow-xs':'text-[var(--color-text-secondary)] hover:text-slate-600'}`}
 >
 All ({likesCount})
 </button>
 {REACTIONS.map(r => (
 <button
 key={r.type}
 type="button"
 onClick={() => setActiveReactionTab(r.type)}
 className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer shrink-0 flex items-center gap-1 ${activeReactionTab === r.type ?'bg-[var(--color-surface)] text-blue-600 shadow-xs':'text-[var(--color-text-secondary)] hover:text-slate-600'}`}
 >
 <span>{r.emoji}</span>
 </button>
 ))}
 </div>

 <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
 {mockReactionUsers
 .filter(u => activeReactionTab ==='all'|| u.reaction === activeReactionTab)
 .map(u => {
 const rObj = REACTIONS.find(r => r.type === u.reaction);
 return (
 <div key={u.id} className="flex items-center justify-between">
 <div className="flex items-center gap-2.5">
 <AvatarWithFallback name={u.name} src={u.avatar} size="w-8 h-8"/>
 <div>
 <div className="font-bold text-xs text-[var(--color-text-primary)] flex items-center gap-1">
 {u.name}
 {u.badge && (
 <span className="text-[9px] font-semibold bg-blue-100 text-blue-600 px-1.5 py-0.2 rounded-full">
 {u.badge}
 </span>
 )}
 </div>
 </div>
 </div>
 <span className="text-base"title={rObj?.label}>{rObj?.emoji}</span>
 </div>
 );
 })}
 </div>
 </div>
 </div>
 )}

 {/* Share Modal */}
 {showShareModal && (
 <div 
 className="fixed inset-0 z-50 bg-[var(--color-surface)]/60 backdrop-blur-xs flex items-center justify-center p-4"
 onClick={() => setShowShareModal(false)}
 >
 <div 
 role="dialog"
 aria-modal="true"
 aria-label="Share Post"
 className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in fade-in zoom-in-95"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="flex items-center justify-between border-b border-slate-100 pb-3">
 <h3 className="font-bold text-base flex items-center gap-2">
 <Share className="w-5 h-5 text-[var(--color-accent-sage)]"/>
 Share Post
 </h3>
 <button type="button"aria-label="Close share modal"onClick={() => setShowShareModal(false)} className="p-1 rounded-full hover:bg-[var(--color-bg-alt)] :bg-[var(--color-surface)] text-[var(--color-text-secondary)] cursor-pointer">
 <X className="w-5 h-5"/>
 </button>
 </div>

 <div className="grid grid-cols-4 gap-3 py-2 text-center">
 {[
 { name:'Copy Link', icon: Copy, bg:'bg-blue-50 text-blue-600', action: () => { navigator.clipboard.writeText(window.location.href); setSharesCount(prev => prev + 1); showToast('Link copied!'); setShowShareModal(false); } },
 { name:'Twitter/X', icon: Share2, bg:'bg-sky-50 text-sky-600', action: () => { showToast('Redirecting to X...'); setShowShareModal(false); } },
 { name:'WhatsApp', icon: MessageCircle, bg:'bg-emerald-50 text-emerald-600', action: () => { showToast('Opening WhatsApp...'); setShowShareModal(false); } },
 { name:'Embed', icon: Code2, bg:'bg-purple-50 text-purple-600', action: () => { showToast('Embed code copied!'); setShowShareModal(false); } }
 ].map((item, idx) => {
 const Icon = item.icon;
 return (
 <button
 key={idx}
 type="button"
 onClick={item.action}
 className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-slate-50 :bg-[var(--color-surface)] transition cursor-pointer"
 >
 <div className={`p-3 rounded-2xl ${item.bg}`}>
 <Icon className="w-5 h-5"/>
 </div>
 <span className="text-xs font-medium text-slate-600">{item.name}</span>
 </button>
 );
 })}
 </div>
 </div>
 </div>
 )}

 {/* Lightbox Gallery Modal */}
 {lightboxIndex !== null && (
 <div 
 role="dialog"
 aria-modal="true"
 aria-label="Image Gallery Lightbox"
 className="fixed inset-0 z-50 bg-[var(--color-surface)]/90 backdrop-blur-md flex items-center justify-center p-4"
 onClick={() => setLightboxIndex(null)}
 onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
 onTouchEnd={(e) => {
 if (touchStartX === null) return;
 const diff = e.changedTouches[0].clientX - touchStartX;
 if (Math.abs(diff) > 60 && images.length > 1) {
 setLightboxIndex(prev => prev !== null ? (diff > 0 ? (prev - 1 + images.length) % images.length : (prev + 1) % images.length) : null);
 }
 setTouchStartX(null);
 }}
 >
 <button
 type="button"
 aria-label="Close lightbox"
 onClick={() => setLightboxIndex(null)}
 className="absolute top-5 right-5 p-3 bg-[var(--color-surface)]/10 text-slate-800 rounded-full hover:bg-[var(--color-surface)]/20 transition z-50 cursor-pointer"
 >
 <X className="w-6 h-6"/>
 </button>

 {images.length > 1 && (
 <>
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
 }}
 className="absolute left-5 p-3 bg-[var(--color-surface)]/10 text-slate-800 rounded-full hover:bg-[var(--color-surface)]/20 transition z-50 cursor-pointer"
 >
 <ChevronLeft className="w-6 h-6"/>
 </button>
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 setLightboxIndex((lightboxIndex + 1) % images.length);
 }}
 className="absolute right-5 p-3 bg-[var(--color-surface)]/10 text-slate-800 rounded-full hover:bg-[var(--color-surface)]/20 transition z-50 cursor-pointer"
 >
 <ChevronRight className="w-6 h-6"/>
 </button>
 </>
 )}

 <div 
 className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col items-center"
 onClick={(e) => e.stopPropagation()}
 >
 <img
 src={images[lightboxIndex]}
 alt={`Full view ${lightboxIndex + 1}`}
 className="max-h-[80vh] w-auto object-contain rounded-2xl"
 />
 <div className="mt-3 px-4 py-1.5 bg-background/60 backdrop-blur-md rounded-full text-[var(--color-text-primary)] text-xs font-mono">
 Photo {lightboxIndex + 1} of {images.length}
 </div>
 </div>
 </div>
 )}

 </div>
 );
}
