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
 ChevronLeft,
 ChevronRight,
 Maximize2,
 Play,
 Pause,
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
 Paperclip
} from'lucide-react';
import type { ReactionType, Comment, SocialPostProps } from'./types';
import { REACTIONS } from'./types';

export type { ReactionType, Comment, SocialPostProps };

/* ========================================================
 ENTERPRISE HIGH-TRAFFIC SUB-COMPONENTS (MEMOIZED & A11Y)
======================================================== */

/** Audio Voice Player Sub-Component **/
const VoicePlayer = React.memo(({ 
 commentId, 
 isPlaying, 
 onTogglePlay, 
 duration 
}: { 
 commentId: string; 
 isPlaying: boolean; 
 onTogglePlay: (id: string) => void; 
 duration?: string 
}) => {
 return (
 <div className="mt-2.5 p-2.5 bg-blue-50/80 /40 rounded-xl border border-blue-200/50 /50 flex items-center gap-3">
 <button
 type="button"
 onClick={() => onTogglePlay(commentId)}
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

/** Single Comment Component (Memoized + Lazy Image Handling) **/
const CommentRow = React.memo(({ 
 comment, 
 onLike, 
 onReply, 
 isPlayingAudio, 
 onToggleVoice, 
 showReplies, 
 onToggleReplies 
}: { 
 comment: Comment; 
 onLike: (id: string) => void; 
 onReply: (author: string) => void; 
 isPlayingAudio: boolean; 
 onToggleVoice: (id: string) => void; 
 showReplies: boolean; 
 onToggleReplies: (id: string) => void; 
}) => {
 return (
 <div className="space-y-2 group animate-in fade-in duration-300">
 <div className="flex items-start gap-2.5">
 <img
 src={comment.author.avatar}
 alt={comment.author.name}
 loading="lazy"
 decoding="async"
 className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 ring-2 ring-slate-100"
 />
 <div className="flex-1 min-w-0">
 <div className="bg-slate-50 /60 p-3 rounded-2xl rounded-tl-none border border-[var(--color-border)]/60 /80 shadow-2xs">
 <div className="flex items-center justify-between gap-2 mb-1">
 <div className="flex items-center gap-1.5 flex-wrap">
 <span className="font-bold text-xs text-[var(--color-text-primary)]">
 {comment.author.name}
 </span>
 {comment.author.badge && (
 <span className="text-[10px] font-semibold bg-blue-100 text-blue-600 px-1.5 py-0.2 rounded-full border border-blue-200">
 {comment.author.badge}
 </span>
 )}
 {comment.isPinned && (
 <span className="text-[10px] font-semibold bg-amber-100 /80 text-amber-600 px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
 <Pin className="w-2.5 h-2.5"/> Pinned
 </span>
 )}
 </div>
 <span className="text-[var(--color-text-secondary)] text-[10px]">{comment.timestamp}</span>
 </div>

 <p className="text-xs text-slate-700 leading-relaxed break-words">
 {comment.text}
 </p>

 {comment.hasVoiceNote && (
 <VoicePlayer 
 commentId={comment.id} 
 isPlaying={isPlayingAudio} 
 onTogglePlay={onToggleVoice} 
 duration={comment.voiceDuration} 
 />
 )}
 </div>

 {/* Comment Action Controls */}
 <div className="flex items-center gap-3 text-[11px] mt-1 px-1.5">
 <button
 type="button"
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
 onClick={() => onReply(comment.author.name)}
 className="text-[var(--color-text-secondary)] hover:text-slate-600 :text-slate-200 font-medium flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded-md px-1"
 >
 <CornerDownRight className="w-3 h-3"/>
 <span>Reply</span>
 </button>

 {comment.replies && comment.replies.length > 0 && (
 <button
 type="button"
 onClick={() => onToggleReplies(comment.id)}
 className="text-blue-600 hover:underline font-semibold cursor-pointer ml-auto"
 >
 {showReplies ?'Hide':`${comment.replies.length} replies`}
 </button>
 )}
 </div>

 {/* Nested Replies Tree */}
 {showReplies && comment.replies && (
 <div className="mt-2.5 pl-3 border-l-2 border-blue-500/30 /20 space-y-2.5">
 {comment.replies.map(reply => (
 <div key={reply.id} className="flex items-start gap-2">
 <img
 src={reply.author.avatar}
 alt={reply.author.name}
 loading="lazy"
 decoding="async"
 className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
 />
 <div className="bg-slate-50 /40 p-2.5 rounded-2xl rounded-tl-none text-xs border border-slate-100 /60 flex-1">
 <div className="flex items-center justify-between gap-1 mb-0.5">
 <span className="font-bold text-[var(--color-text-primary)] text-[11px]">{reply.author.name}</span>
 <span className="text-[var(--color-text-secondary)] text-[9px]">{reply.timestamp}</span>
 </div>
 <p className="text-slate-700 text-[11px] leading-relaxed">{reply.text}</p>
 </div>
 </div>
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
 MAIN MNC-GRADE HIGH-TRAFFIC SOCIAL POST CARD
======================================================== */
export function SocialPostCard({
 author = {
 name:'Ray Hammond',
 avatar:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
 location:'New-York',
 verified: true
 },
 timestamp ='Thursday, Jun 31, 5:50 PM',
 privacy ='public',
 content ="I'm so glad to share with you guys some photos from my recent trip to the New-York. This city looks amazing, the buildings, nature, people all are beautiful, i highly recommend to visit this cool place! Also i would like to know what is your favorite place here or what you would like to visit? 🥰",
 hashtags = ['#NewYorkCity','#TravelDiaries','#Wanderlust','#Architecture'],
 images = [
'/ny_skyscrapers.jpg',
'/ny_skyline.jpg'
 ],
 initialLikes = 245,
 initialSharesCount = 12,
 initialViews = 3420,
 initialComments = [
 {
 id:'c1',
 author: {
 name:'Cynthia Henry',
 avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
 badge:'Top Fan'
 },
 timestamp:'Today at 3:30 PM',
 text:"Wow, those photos looks amazing, i'm going to visit New-York on next week. Can you recommend some cool locations to visit there? 🙏",
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
 text:"Make sure to check out Central Park at sunset and the Edge observation deck in Hudson Yards! 🌆",
 likes: 5
 },
 {
 id:'r2',
 author: {
 name:'Cynthia Henry',
 avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
 },
 timestamp:'Today at 4:15 PM',
 text:"Thanks Ray! Will definitely add those to my itinerary ✨",
 likes: 2
 }
 ]
 },
 {
 id:'c2',
 author: {
 name:'Marcus Vance',
 avatar:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
 },
 timestamp:'Yesterday at 8:45 PM',
 text:"Check out this quick voice note about the best Brooklyn pizza spots! 🍕",
 likes: 14,
 isLiked: true,
 hasVoiceNote: true,
 voiceDuration:'0:24'
 }
 ]
}: SocialPostProps) {
 // State management
 const [currentReaction, setCurrentReaction] = useState<ReactionType | null>('love');
 const [likesCount, setLikesCount] = useState(initialLikes);
 const [sharesCount, setSharesCount] = useState(initialSharesCount);
 const [viewsCount] = useState(initialViews);
 const [isSaved, setIsSaved] = useState(false);
 const [soundEnabled, setSoundEnabled] = useState(true);

 // UI Modals & Popovers
 const [showReactionPicker, setShowReactionPicker] = useState(false);
 const [showMenu, setShowMenu] = useState(false);
 const [showShareModal, setShowShareModal] = useState(false);
 const [isEditingPost, setIsEditingPost] = useState(false);
 const [postText, setPostText] = useState(content);

 // Right-Side Comments Panel state
 const [isCommentsOpen, setIsCommentsOpen] = useState(true);

 // Lightbox Modal state
 const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

 // Audio voice note state
 const [isPlayingAudio, setIsPlayingAudio] = useState<{ [key: string]: boolean }>({});

 // Comments & High-Traffic Debounced Search state
 const [comments, setComments] = useState<Comment[]>(initialComments);
 const [newCommentText, setNewCommentText] = useState('');
 const [showEmojiPicker, setShowEmojiPicker] = useState(false);
 const [commentFilter, setCommentFilter] = useState<'all'|'top'|'pinned'>('all');
 const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({ c1: true });
 
 // Debounced search query for extreme high-traffic list performance
 const [searchQuery, setSearchQuery] = useState('');
 const [debouncedQuery, setDebouncedQuery] = useState('');
 
 const reactionTimeoutRef = useRef<any>(null);

 // Debounce search query effect (prevents main thread stutter under heavy lists)
 useEffect(() => {
 const handler = setTimeout(() => {
 setDebouncedQuery(searchQuery);
 }, 200);
 return () => clearTimeout(handler);
 }, [searchQuery]);

 const showToast = useCallback((msg: string) => {
 setNotification(msg);
 setTimeout(() => setNotification(null), 2500);
 }, []);

 const [notification, setNotification] = useState<string | null>(null);

 // Web Audio synthesizer simulation for haptic sound
 const playSoundEffect = useCallback(() => {
 if (!soundEnabled) return;
 try {
 const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
 const osc = ctx.createOscillator();
 const gain = ctx.createGain();
 osc.type ='sine';
 osc.frequency.setValueAtTime(587.33, ctx.currentTime);
 gain.gain.setValueAtTime(0.08, ctx.currentTime);
 gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
 osc.connect(gain);
 gain.connect(ctx.destination);
 osc.start();
 osc.stop(ctx.currentTime + 0.15);
 } catch {
 // Audio context fallbacks
 }
 }, [soundEnabled]);

 // Optimistic UI reaction update (0ms perceived user latency)
 const handleSelectReaction = useCallback((type: ReactionType) => {
 playSoundEffect();
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

 const handleToggleSave = useCallback(() => {
 playSoundEffect();
 setIsSaved(prev => {
 showToast(!prev ?'Saved to your bookmarks 🔖':'Removed from bookmarks');
 return !prev;
 });
 setShowMenu(false);
 }, [playSoundEffect, showToast]);

 // Optimistic Comment submission
 const handleAddComment = useCallback((e: React.FormEvent) => {
 e.preventDefault();
 if (!newCommentText.trim()) return;

 playSoundEffect();
 const newComment: Comment = {
 id: Date.now().toString(),
 author: {
 name:'You',
 avatar:'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
 badge:'Author'
 },
 timestamp:'Just now',
 text: newCommentText.trim(),
 likes: 0
 };

 setComments(prev => [newComment, ...prev]);
 setNewCommentText('');
 setShowEmojiPicker(false);
 showToast('Comment posted! 🚀');
 }, [newCommentText, playSoundEffect, showToast]);

 const handleToggleCommentLike = useCallback((commentId: string) => {
 playSoundEffect();
 setComments(prev => prev.map(c => {
 if (c.id === commentId) {
 const liked = !c.isLiked;
 return {
 ...c,
 isLiked: liked,
 likes: liked ? c.likes + 1 : c.likes - 1
 };
 }
 return c;
 }));
 }, [playSoundEffect]);

 const handleToggleVoicePlay = useCallback((id: string) => {
 setIsPlayingAudio(prev => ({ ...prev, [id]: !prev[id] }));
 }, []);

 const handleToggleReplies = useCallback((id: string) => {
 setShowReplies(prev => ({ ...prev, [id]: !prev[id] }));
 }, []);

 const handleReplyPrompt = useCallback((authorName: string) => {
 setNewCommentText(`@${authorName}`);
 document.getElementById('side-comment-input')?.focus();
 }, []);

 // Memoized & Debounced Comments List for extreme scalability under high traffic
 const filteredComments = useMemo(() => {
 const query = debouncedQuery.toLowerCase();
 return comments.filter(c => {
 if (commentFilter ==='pinned') return c.isPinned;
 if (commentFilter ==='top') return c.likes >= 5;
 if (query) return c.text.toLowerCase().includes(query) || c.author.name.toLowerCase().includes(query);
 return true;
 });
 }, [comments, commentFilter, debouncedQuery]);

 const activeReactionObj = useMemo(() => REACTIONS.find(r => r.type === currentReaction), [currentReaction]);

 return (
 <div className="w-full max-w-6xl mx-auto transition-all duration-300 font-sans selection:bg-[var(--color-accent-sage)] selection:text-slate-800">
 
 {/* Toast Notification Pill */}
 {notification && (
 <div 
 role="status"
 aria-live="polite"
 className="fixed top-5 right-5 z-50 bg-[#F9F9F7]/95 /95 text-slate-800 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3 border border-[var(--color-border)]/50 backdrop-blur-md"
 >
 <Sparkles className="w-4 h-4 text-amber-400 animate-spin"/>
 {notification}
 </div>
 )}

 {/* Main Responsive Grid Layout (MNC 12-Column Layout) */}
 <div className={`grid grid-cols-1 ${isCommentsOpen ?'lg:grid-cols-12':'max-w-2xl mx-auto'} gap-6 transition-all duration-500 ease-in-out`}>
 
 {/* LEFT COLUMN: Main Social Post Card */}
 <article className={`${isCommentsOpen ?'lg:col-span-7':'w-full'} bg-[var(--color-surface)]/95 /95 backdrop-blur-xl border border-[var(--color-border)]/90 rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-200/40 transition-all relative text-[var(--color-text-primary)]`}>
 
 {/* Header */}
 <div className="flex items-start justify-between mb-4">
 <div className="flex items-center gap-3">
 <div className="relative">
 <img
 src={author.avatar}
 alt={author.name}
 loading="eager"
 decoding="async"
 className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20 /20 shadow-xs"
 />
 <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"title="Online"/>
 </div>

 <div>
 <div className="flex items-center gap-1.5 flex-wrap">
 <h3 className="font-bold text-base text-[var(--color-text-primary)] leading-tight flex items-center gap-1">
 {author.name}
 {author.verified && (
 <CheckCircle2 className="w-4 h-4 text-[var(--color-accent-sage)] fill-blue-500/20"/>
 )}
 </h3>
 <span className="text-[var(--color-text-secondary)] text-xs font-normal">is at</span>
 <a href="#location"className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline text-xs sm:text-sm bg-blue-50 /60 px-2.5 py-0.5 rounded-lg border border-blue-200/60 /60 focus-visible:ring-2 focus-visible:ring-blue-500 outline-none">
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

 {/* Sound Toggle & Options Dropdown */}
 <div className="flex items-center gap-1">
 <button
 type="button"
 onClick={() => setSoundEnabled(!soundEnabled)}
 className="p-2 rounded-full hover:bg-[var(--color-bg-alt)] :bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-slate-600 :text-slate-200 transition focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
 title={soundEnabled ?'Sound enabled':'Sound muted'}
 aria-label="Toggle haptic audio effects"
 >
 {soundEnabled ? <Volume2 className="w-4 h-4 text-[var(--color-accent-sage)]"/> : <VolumeX className="w-4 h-4"/>}
 </button>

 <div className="relative">
 <button
 type="button"
 onClick={() => setShowMenu(!showMenu)}
 className="p-2 rounded-full hover:bg-[var(--color-bg-alt)] :bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-slate-600 :text-slate-200 transition focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
 aria-label="More post options"
 >
 <MoreHorizontal className="w-5 h-5"/>
 </button>

 {/* Context Dropdown Menu matching Image 2 */}
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
 Edit post
 </button>
 <button
 type="button"
 onClick={() => { setShowMenu(false); setShowShareModal(true); }}
 className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-blue-50 :bg-blue-950/50 hover:text-blue-600 transition text-xs font-medium cursor-pointer"
 >
 <Copy className="w-4 h-4 text-[var(--color-text-secondary)]"/>
 Copy link
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
 Report
 </button>
 <button
 type="button"
 onClick={() => { setShowMenu(false); showToast('Post deleted'); }}
 className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 :bg-red-950/50 transition text-xs font-medium cursor-pointer"
 >
 <Trash2 className="w-4 h-4 text-red-500"/>
 Delete
 </button>
 </div>
 </>
 )}
 </div>
 </div>
 </div>

 {/* Post Text & Live Editor */}
 {isEditingPost ? (
 <div className="mb-4 space-y-3 bg-slate-50 /60 p-4 rounded-2xl border border-blue-200">
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
 <p className="text-slate-800 text-sm sm:text-base leading-relaxed mb-3 font-normal">
 {postText}
 </p>
 )}

 {/* Hashtags Chips */}
 {hashtags && hashtags.length > 0 && (
 <div className="flex items-center gap-1.5 flex-wrap mb-4">
 {hashtags.map((tag, idx) => (
 <span 
 key={idx} 
 className="text-xs font-semibold text-blue-600 bg-blue-50 /40 hover:bg-blue-100 :bg-blue-900/60 px-2.5 py-1 rounded-lg cursor-pointer transition border border-blue-200/40 /40"
 >
 {tag}
 </span>
 ))}
 </div>
 )}

 {/* Media Grid with High Traffic Lazy Image Loading */}
 {images && images.length > 0 && (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 rounded-2xl overflow-hidden relative group">
 {images.map((img, index) => (
 <div 
 key={index} 
 className="relative group/img cursor-pointer overflow-hidden rounded-2xl bg-[var(--color-bg-alt)]"
 onClick={() => setLightboxIndex(index)}
 >
 <img
 src={img}
 alt={`Post photo media ${index + 1}`}
 loading="lazy"
 decoding="async"
 className="w-full h-60 sm:h-72 object-cover transition duration-500 group-hover/img:scale-105"
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

 {/* Analytics Bar */}
 <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] mb-4 pt-1 border-b border-slate-100 pb-3">
 <div className="flex items-center gap-3">
 <span className="flex items-center gap-1 text-slate-600 font-medium">
 <Eye className="w-3.5 h-3.5 text-[var(--color-accent-sage)]"/>
 {viewsCount.toLocaleString()} Views
 </span>
 <span>•</span>
 <span className="flex items-center gap-1 text-emerald-600 font-medium">
 <TrendingUp className="w-3.5 h-3.5"/>
 98.4% Engagement
 </span>
 </div>

 {isSaved && (
 <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
 <Bookmark className="w-3.5 h-3.5 fill-amber-500"/> Saved
 </span>
 )}
 </div>

 {/* Likers Stack & Reaction Summary */}
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-2.5">
 <div className="flex -space-x-2 overflow-hidden">
 <span className="inline-flex items-center justify-center h-6.5 w-6.5 rounded-full bg-rose-500 text-slate-800 ring-2 ring-white text-xs shadow-xs">❤️</span>
 <span className="inline-flex items-center justify-center h-6.5 w-6.5 rounded-full bg-amber-500 text-slate-800 ring-2 ring-white text-xs shadow-xs">🔥</span>
 <span className="inline-flex items-center justify-center h-6.5 w-6.5 rounded-full bg-[var(--color-accent-sage)] text-slate-800 ring-2 ring-white text-xs shadow-xs">👍</span>
 </div>
 <span className="text-slate-700 text-xs font-semibold">
 {activeReactionObj ?`${activeReactionObj.emoji} You and ${likesCount - 1} others`:`${likesCount} Reactions`}
 </span>
 </div>

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

 {/* Action Buttons Bar with Reaction Popover */}
 <div className="relative border-t border-b border-slate-100 /80 py-2 my-3 flex items-center justify-between text-xs sm:text-sm font-medium text-slate-600">
 
 {/* Reaction Picker Popover */}
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

 {/* Like Button */}
 <div
 className="relative flex-1"
 onMouseEnter={() => {
 reactionTimeoutRef.current = setTimeout(() => setShowReactionPicker(true), 250);
 }}
 onMouseLeave={() => clearTimeout(reactionTimeoutRef.current)}
 >
 <button
 type="button"
 onClick={() => {
 if (currentReaction) {
 handleSelectReaction(currentReaction);
 } else {
 handleSelectReaction('love');
 }
 }}
 className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl transition cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 outline-none ${
 activeReactionObj ?`${activeReactionObj.color} font-bold ${activeReactionObj.bg}`:'hover:bg-slate-50 :bg-[var(--color-surface)]/60 hover:text-[var(--color-text-primary)] :text-slate-800'
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

 {/* Comments Toggle Button (Opens Right-Side Panel) */}
 <button
 type="button"
 onClick={() => setIsCommentsOpen(!isCommentsOpen)}
 className={`flex items-center justify-center gap-2 flex-1 py-2 rounded-xl transition cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 outline-none ${
 isCommentsOpen 
 ?'bg-blue-50 text-blue-600 /60 font-bold'
 :'hover:bg-slate-50 :bg-[var(--color-surface)]/60 hover:text-[var(--color-text-primary)] :text-slate-800'
 }`}
 >
 <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5"/>
 <span>Comments ({comments.length})</span>
 </button>

 {/* Share Button */}
 <button
 type="button"
 onClick={() => setShowShareModal(true)}
 className="flex items-center justify-center gap-2 flex-1 py-2 rounded-xl hover:bg-slate-50 :bg-[var(--color-surface)]/60 transition hover:text-[var(--color-text-primary)] :text-slate-800 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
 >
 <Share2 className="w-4 h-4 sm:w-5 sm:h-5"/>
 <span>Share</span>
 </button>
 </div>

 </article>

 {/* RIGHT COLUMN: Right-Side Comments Panel / Drawer */}
 {isCommentsOpen && (
 <aside className="lg:col-span-5 bg-[var(--color-surface)]/95 /95 backdrop-blur-xl border border-[var(--color-border)]/90 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/40 transition-all duration-300 flex flex-col h-full relative">
 
 {/* Panel Header */}
 <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
 <div className="flex items-center gap-2">
 <MessageCircle className="w-5 h-5 text-blue-600"/>
 <h3 className="font-bold text-base text-[var(--color-text-primary)]">
 Discussion Stream <span className="text-xs font-mono font-normal text-[var(--color-text-secondary)]">({comments.length})</span>
 </h3>
 </div>

 <button
 type="button"
 onClick={() => setIsCommentsOpen(false)}
 className="p-1.5 rounded-full hover:bg-[var(--color-bg-alt)] :bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-slate-600 :text-slate-200 transition cursor-pointer"
 title="Close comments panel"
 >
 <X className="w-5 h-5"/>
 </button>
 </div>

 {/* Comment Debounced Search & Filters */}
 <div className="space-y-3 mb-4">
 <div className="relative">
 <Search className="w-4 h-4 text-[var(--color-text-secondary)] absolute left-3.5 top-3"/>
 <input
 type="text"
 placeholder="Filter comments..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full bg-[var(--color-bg-alt)]/80 /80 pl-9 pr-4 py-2 rounded-xl text-xs border-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-800 placeholder:text-[var(--color-text-secondary)] font-medium"
 />
 </div>

 <div className="flex items-center justify-between text-xs">
 <div className="flex items-center gap-1 bg-[var(--color-bg-alt)] p-1 rounded-xl w-full">
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
 </div>

 {/* Scrollable Comments Stream */}
 <div className="flex-1 overflow-y-auto max-h-[460px] pr-1 space-y-4 custom-scrollbar">
 {filteredComments.length === 0 ? (
 <div className="text-center py-12 text-[var(--color-text-secondary)] space-y-2">
 <MessageCircle className="w-8 h-8 mx-auto text-slate-300"/>
 <p className="text-xs font-medium">No comments match your filter</p>
 </div>
 ) : (
 filteredComments.map((comment) => (
 <CommentRow 
 key={comment.id} 
 comment={comment} 
 onLike={handleToggleCommentLike} 
 onReply={handleReplyPrompt} 
 isPlayingAudio={!!isPlayingAudio[comment.id]} 
 onToggleVoice={handleToggleVoicePlay} 
 showReplies={!!showReplies[comment.id]} 
 onToggleReplies={handleToggleReplies} 
 />
 ))
 )}
 </div>

 {/* Input Composer inside Right Panel */}
 <div className="pt-3 border-t border-slate-100 mt-auto">
 <form onSubmit={handleAddComment} className="flex items-center gap-2">
 <img
 src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
 alt="Current user"
 loading="lazy"
 decoding="async"
 className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
 />

 <div className="flex-1 bg-[var(--color-bg-alt)]/90 /80 rounded-full px-3.5 py-2 flex items-center gap-1.5 focus-within:ring-2 focus-within:ring-blue-500/40 transition">
 <input
 id="side-comment-input"
 type="text"
 placeholder="Write a comment..."
 value={newCommentText}
 onChange={(e) => setNewCommentText(e.target.value)}
 className="w-full bg-transparent border-none text-xs text-slate-800 placeholder:text-[var(--color-text-secondary)] focus:outline-none font-medium"
 />

 <div className="flex items-center gap-0.5 text-[var(--color-text-secondary)]">
 <button 
 type="button"
 onClick={() => showToast('Attachment simulation')} 
 className="hover:text-slate-600 :text-slate-200 transition p-1"
 title="Attach file"
 >
 <Paperclip className="w-3.5 h-3.5"/>
 </button>
 <button 
 type="button"
 onClick={() => setShowEmojiPicker(!showEmojiPicker)}
 className="hover:text-slate-600 :text-slate-200 transition p-1 cursor-pointer"
 title="Add emoji"
 >
 <Smile className="w-3.5 h-3.5 text-amber-500"/>
 </button>
 {newCommentText.trim() && (
 <button 
 type="submit"
 className="p-1 bg-[var(--color-accent-sage)] hover:bg-blue-700 text-slate-800 rounded-full transition ml-0.5 cursor-pointer shadow-xs"
 >
 <Send className="w-3 h-3"/>
 </button>
 )}
 </div>
 </div>
 </form>

 {/* Emoji bar popover */}
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

 {/* Share Modal */}
 {showShareModal && (
 <div 
 className="fixed inset-0 z-50 bg-[var(--color-surface)]/60 backdrop-blur-sm flex items-center justify-center p-4"
 onClick={() => setShowShareModal(false)}
 >
 <div 
 className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in fade-in zoom-in-95"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="flex items-center justify-between border-b border-slate-100 pb-3">
 <h3 className="font-bold text-base flex items-center gap-2">
 <Share className="w-5 h-5 text-[var(--color-accent-sage)]"/>
 Share Post
 </h3>
 <button type="button"onClick={() => setShowShareModal(false)} className="p-1 rounded-full hover:bg-[var(--color-bg-alt)] :bg-[var(--color-surface)] text-[var(--color-text-secondary)] cursor-pointer">
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
 className="fixed inset-0 z-50 bg-[var(--color-surface)]/90 backdrop-blur-md flex items-center justify-center p-4"
 onClick={() => setLightboxIndex(null)}
 >
 <button
 type="button"
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
 <div className="mt-3 px-4 py-1.5 bg-[var(--color-surface)]/60 backdrop-blur-md rounded-full text-slate-800 text-xs font-mono">
 Photo {lightboxIndex + 1} of {images.length}
 </div>
 </div>
 </div>
 )}

 </div>
 );
}
