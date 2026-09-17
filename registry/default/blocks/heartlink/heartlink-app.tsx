import { VirtualizedSidebarList } from "./virtualized-sidebar-list";
import { VirtualizedMessageStream } from './heartlink-message-stream';
import { AvatarWithFallback } from './avatar-with-fallback';
import { ChatInputEditor } from './chat-input-editor';
import { DecorationPickerModal } from './decoration-picker-modal';
import { TwemojiPicker } from './twemoji-picker';
import { UserProfileModal } from '../user-profile-card/user-profile-modal';
import type { UserProfileData } from '../user-profile-card/types';
import { HeartPulseBanner } from './components/HeartPulseBanner';
import { SpeedPulseDeckModal } from './components/SpeedPulseDeckModal';
import { MatchCelebrationModal } from './components/MatchCelebrationModal';
import { IntentFilterModal } from './components/IntentFilterModal';
import { AIDateConciergeModal } from './components/AIDateConciergeModal';
import { SpeedVideoDateModal } from './components/SpeedVideoDateModal';
import { SafetyGuardianModal } from './components/SafetyGuardianModal';
import { AntiGhostingPrompt } from './components/AntiGhostingPrompt';
import { LocalEventsModal } from './components/LocalEventsModal';
import { GroupHangoutsModal } from './components/GroupHangoutsModal';
import { HeartLinkFeedView } from './components/HeartLinkFeedView';
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Send, 
  Phone, 
  Video, 
  MoreHorizontal, 
  Pin, 
  PinOff,
  X, 
  Paperclip, 
  Volume2,
  VolumeX,
  User,
  Share2,
  Ban,
  Trash2,
  SmilePlus,
  FileText,
  Music,
  Mic,
  Square,
  Image as ImageIcon,
  Reply,
  ChevronUp,
  ChevronDown,
  Activity,
  Palette,
  CheckCheck,
  Folder,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link,
  Clock,
  ArrowLeft,
  Check,
  Flame,
  Heart,
  Sparkles,
  RotateCcw,
  Filter,
  ShieldCheck,
  Ticket,
  Users
} from 'lucide-react';
import type {
  SpeedDiscoveryProfile,
  ChatItem, 
  ChatListCardProps, 
  Message, 
  MessageAttachment, 
  MessageReaction,
  SubscriptionTier,
  VoiceNote,
  JumpTarget
} from './types';
import { isChatMuted } from './types';
import { INITIAL_CHATS, idbSaveChats, idbLoadChats, idbClearChats } from './db';
import { generateId, stripHtmlAndNewlines, formatTime } from './utils';


// shadcn UI primitives
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuSub, 
  DropdownMenuSubContent, 
  DropdownMenuSubTrigger, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

export type { 
  ChatItem, 
  ChatListCardProps, 
  Message, 
  MessageAttachment, 
  MessageReaction, 
  SubscriptionTier, 
  VoiceNote
};


export const SPEED_DISCOVERY_PROFILES: SpeedDiscoveryProfile[] = [
  {
    id: 'disc_1',
    name: 'Maya Lin',
    age: 24,
    location: 'Brooklyn, NY',
    distance: '3 miles away',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    bio: 'Architectural designer with a weakness for specialty coffee, vintage flea markets, and analog film photography.',
    promptQuestion: 'Together, we could...',
    promptAnswer: 'Design the ultimate reading nook, hunt down secret rooftop coffee spots, and bake sourdough pizzas on weekends.',
    matchScore: 97,
    intent: 'Long-term relationship'
  },
  {
    id: 'disc_2',
    name: 'Sofia Ruiz',
    age: 25,
    location: 'Manhattan, NY',
    distance: '5 miles away',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    bio: 'Indie filmmaker & synth collector. Always looking for new acoustic indie music recommendations!',
    promptQuestion: 'My simple pleasures...',
    promptAnswer: '35mm film photography, vintage synths, rainy afternoon espresso, and rooftop stargazing.',
    matchScore: 94,
    intent: 'Deep connection'
  },
  {
    id: 'disc_3',
    name: 'Chloe Dupont',
    age: 23,
    location: 'West Village, NY',
    distance: '2 miles away',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'Product designer & marathon runner. Passionate about modern art galleries, matcha lattes, and golden retrievers.',
    promptQuestion: 'The green flag I look for...',
    promptAnswer: 'Kindness to servers, genuine curiosity about the world, and effortless playful banter.',
    matchScore: 98,
    intent: 'Long-term relationship'
  }
];




/* ========================================================
   SHARED CHAT OPTIONS MENU COMPONENT
======================================================== */
interface SharedChatOptionsMenuProps {
  chat: ChatItem;
  isHeader?: boolean;
  showRightSidebar?: boolean;
  onToggleRightSidebar?: () => void;
  onViewProfile: (chatId: string) => void;
  onCustomizeTheme?: () => void;
  onTogglePin: (chatId: string, e?: React.MouseEvent) => void;
  onShare: (chatId: string) => void;
  onMute: (chatId: string, duration: '1h' | '8h' | '24h' | 'always' | 'unmute') => void;
  onBlock: (chatId: string) => void;
  onDelete: (chatId: string) => void;
  children: React.ReactNode;
}

const SharedChatOptionsMenu = React.memo(({
  chat,
  isHeader = false,
  showRightSidebar,
  onToggleRightSidebar,
  onViewProfile,
  onCustomizeTheme,
  onTogglePin,
  onShare,
  onMute,
  onBlock,
  onDelete,
  children
}: SharedChatOptionsMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-md rounded-xl border border-[var(--color-border)] shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-150">
        {!isHeader && (
          <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
            <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 block truncate">{chat.name}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">{chat.statusText || 'Quick Actions'}</span>
          </div>
        )}
        
        <DropdownMenuItem onClick={() => onViewProfile(chat.id)} className="w-full px-2 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition cursor-pointer">
          <User className="w-4 h-4 text-slate-500 shrink-0" />
          <span>View Profile</span>
        </DropdownMenuItem>

        {isHeader && onToggleRightSidebar && (
          <DropdownMenuItem onClick={() => onToggleRightSidebar()} className="w-full px-2 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition cursor-pointer">
            <Activity className="w-4 h-4 text-slate-500 shrink-0" />
            <span>{showRightSidebar ? 'Hide Chat Info' : 'Show Chat Info'}</span>
          </DropdownMenuItem>
        )}

        {isHeader && onCustomizeTheme && (
          <DropdownMenuItem onClick={() => onCustomizeTheme()} className="w-full px-2 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition cursor-pointer">
            <Palette className="w-4 h-4 text-violet-500 shrink-0" />
            <span>Customize Theme</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={(e) => onTogglePin(chat.id, e)} className="w-full px-2 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition cursor-pointer">
          {chat.isPinned ? <PinOff className="w-4 h-4 text-amber-500 shrink-0" /> : <Pin className="w-4 h-4 text-slate-500 shrink-0" />}
          <span>{chat.isPinned ? 'Unpin Conversation' : 'Pin Conversation'}</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onShare(chat.id)} className="w-full px-2 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition cursor-pointer">
          <Share2 className="w-4 h-4 text-slate-500 shrink-0" />
          <span>Share Conversation</span>
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="w-full px-2 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition cursor-pointer">
            <VolumeX className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Mute Notifications</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-background/95 backdrop-blur-md rounded-xl border border-[var(--color-border)] shadow-2xl p-1.5 min-w-[160px]">
            <DropdownMenuItem onClick={() => onMute(chat.id, '1h')} className="px-2 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">1 Hour{isChatMuted(chat) && chat.muteDuration === '1 Hour' && <Check className="w-4 h-4 ml-auto text-emerald-500" />}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMute(chat.id, '8h')} className="px-2 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">8 Hours{isChatMuted(chat) && chat.muteDuration === '8 Hours' && <Check className="w-4 h-4 ml-auto text-emerald-500" />}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMute(chat.id, '24h')} className="px-2 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">24 Hours{isChatMuted(chat) && chat.muteDuration === '24 Hours' && <Check className="w-4 h-4 ml-auto text-emerald-500" />}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMute(chat.id, 'always')} className="px-2 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">Until turned back on{isChatMuted(chat) && chat.muteDuration === 'Always' && <Check className="w-4 h-4 ml-auto text-emerald-500" />}</DropdownMenuItem>
            {isChatMuted(chat) && (
              <>
                <DropdownMenuSeparator className="my-1 border-t border-slate-100 dark:border-slate-800" />
                <DropdownMenuItem onClick={() => onMute(chat.id, 'unmute')} className="px-2 py-2 rounded-xl text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition cursor-pointer focus:bg-emerald-50 dark:focus:bg-emerald-900/30 focus:text-emerald-600">
                  Unmute Notifications
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator className="my-1 border-t border-slate-100 dark:border-slate-800" />
        
        <DropdownMenuItem onClick={() => onBlock(chat.id)} className="w-full px-2 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2.5 transition cursor-pointer focus:bg-red-50 dark:focus:bg-red-900/30 focus:text-red-600">
          <Ban className="w-4 h-4 text-red-500 shrink-0" />
          <span>Block Contact</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onDelete(chat.id)} className="w-full px-2 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2.5 transition cursor-pointer focus:bg-red-50 dark:focus:bg-red-900/30 focus:text-red-600">
          <Trash2 className="w-4 h-4 text-red-500 shrink-0" />
          <span>Delete Conversation</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
SharedChatOptionsMenu.displayName = 'SharedChatOptionsMenu';

/* ========================================================
   MAIN CHAT LIST CARD COMPONENT
======================================================== */
export function HeartLinkApp({
  title = "Messages",
  chats = INITIAL_CHATS,
  subscriptionTier = 'free',
  uiVariant = 'modern_studio',
  onSelectChat,
}: ChatListCardProps) {

  const [chatList, setChatList] = useState<ChatItem[]>(chats);
  const [selectedChatId, setSelectedChatId] = useState<string | null>('1');
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>(subscriptionTier);

  // Voice Note Recording State
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSecs, setRecordingSecs] = useState(0);

  // Voice Recording Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isRecordingVoice) {
      interval = setInterval(() => setRecordingSecs(s => s + 1), 1000);
    } else {
      setRecordingSecs(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  const selectedChat = useMemo(() => 
    chatList.find(c => c.id === selectedChatId) || chatList[0],
  [chatList, selectedChatId]);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'pinned'>('all');
  const [newMessageText, setNewMessageText] = useState('');
  const newMessageTextRef = useRef(newMessageText);
  useEffect(() => { newMessageTextRef.current = newMessageText; }, [newMessageText]);

  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [showDecorationPicker, setShowDecorationPicker] = useState(false);
  const [selectedChatForDecoration, setSelectedChatForDecoration] = useState<ChatItem | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLoadingFromDB, setIsLoadingFromDB] = useState(true);
  const [isDBReady, setIsDBReady] = useState(false);
  const [typingState, setTypingState] = useState<Record<string, boolean>>({});
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [profileModalChat, setProfileModalChat] = useState<ChatItem | null>(null);

  const mappedProfileModalUser: UserProfileData | null = useMemo(() => {
    if (!profileModalChat) return null;
    return {
      name: profileModalChat.name,
      handle: profileModalChat.name.toLowerCase().replace(/\s+/g, ''),
      verified: true,
      userStatus: profileModalChat.isOnline ? 'online' : 'offline',
      avatar: profileModalChat.avatar,
      banner: '',
      bio: profileModalChat.statusText || `Looking for genuine connection & shared adventures on HeartLink. ✨`,
      themeColor: '#6366f1',
      profileTheme: 'blurple',
      avatarDecoration: 'none',
      bannerEffect: 'none',
      profileEffect: 'none',
      nitroLevel: 'none',
      subscriptionTier: 'free',
      badges: [],
      stats: { followers: 1420, likes: 389, mediaCount: 42, postsCount: 18, boostCount: 2, nextLevelBoosts: 5 },
      prompts: [
        {
          id: 'p1',
          category: 'dating',
          question: 'Together, we could...',
          answer: 'Discover hidden rooftop coffee spots, debate film endings, and go on spontaneous weekend road trips.',
          likesCount: 38
        },
        {
          id: 'p2',
          category: 'lifestyle',
          question: 'My simple pleasures...',
          answer: 'Fresh morning espresso, acoustic playlists on rainy afternoons, and warm vinyl records.',
          likesCount: 24
        },
        {
          id: 'p3',
          category: 'ambition',
          question: 'The green flag I look for...',
          answer: 'Someone who listens attentively, laughs easily at silly banter, and values intentional communication.',
          likesCount: 49
        }
      ]
    };
  }, [profileModalChat]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const chatListRef = useRef<ChatItem[]>(chatList);
  useEffect(() => { chatListRef.current = chatList; }, [chatList]);

  // Bug 1 fix: Instance-scoped IDB save queue (not module singleton)
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());

  // Bug 3/6/17 fix: Live ref for selectedChatId to avoid stale closures in timeouts
  const selectedChatIdRef = useRef<string | null>(selectedChatId);
  useEffect(() => { selectedChatIdRef.current = selectedChatId; }, [selectedChatId]);

  // File Upload Draft State
  const [draftAttachment, setDraftAttachment] = useState<MessageAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Bug 5 fix: Track blob URL for cleanup
  const blobUrlRef = useRef<string | null>(null);

  // HeartLink Speed Pulse Deck States
  const [showSpeedPulseModal, setShowSpeedPulseModal] = useState(false);
  const [speedDeckIndex, setSpeedDeckIndex] = useState(0);
  const [matchedCelebrationProfile, setMatchedCelebrationProfile] = useState<SpeedDiscoveryProfile | null>(null);
  const [intentFilter, setIntentFilter] = useState<'all' | 'Long-term relationship' | 'Deep connection' | 'Spontaneous fun'>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAIDateModal, setShowAIDateModal] = useState(false);
  const [showSpeedVideoModal, setShowSpeedVideoModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showLocalEventsModal, setShowLocalEventsModal] = useState(false);
  const [showGroupHangoutsModal, setShowGroupHangoutsModal] = useState(false);
  const [activeMainView, setActiveMainView] = useState<'chat' | 'feed'>('chat');

  const filteredDiscoveryProfiles = useMemo(() => {
    if (intentFilter === 'all') return SPEED_DISCOVERY_PROFILES;
    return SPEED_DISCOVERY_PROFILES.filter(p => p.intent === intentFilter);
  }, [intentFilter]);

  const handleMatchProfile = useCallback((profile: SpeedDiscoveryProfile) => {
    const existingChat = chatList.find(c => c.id === profile.id);
    if (!existingChat) {
      const newMatchChat: ChatItem = {
        id: profile.id,
        name: profile.name,
        avatar: profile.avatar,
        lastMessage: `Matched on HeartLink! ✨`,
        timestamp: 'Just now',
        lastUpdated: Date.now(),
        unreadCount: 1,
        isOnline: true,
        statusText: `Matched on HeartLink • ${profile.intent}`,
        isMatch: true,
        matchedAt: Date.now(),
        expiresAt: Date.now() + 72 * 3600 * 1000,
        messages: [
          {
            id: `m_init_${Date.now()}`,
            senderId: profile.id,
            senderName: profile.name,
            text: `Hey! We matched on HeartLink! Loved your profile prompt ✨`,
            timestamp: formatTime(Date.now())
          }
        ]
      };
      setChatList(prev => [newMatchChat, ...prev]);
    }
    setMatchedCelebrationProfile(profile);
  }, [chatList]);

  // Bug 2 fix: Track whether chatList has diverged from initial data
  const isHydratedFromDB = useRef(false);

  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);
  const [activeLightboxUrl, setActiveLightboxUrl] = useState<string | null>(null);

  // Lightbox Escape Key Listener
  useEffect(() => {
    if (!activeLightboxUrl) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveLightboxUrl(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxUrl]);

  const contextMenuRef = useRef<HTMLDivElement>(null);
  const typingTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const aiReplyTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Notifications Mute Handler
  const handleMuteChat = useCallback((chatId: string, duration: '1h' | '8h' | '24h' | 'always' | 'unmute') => {
    setChatList(prev => prev.map(c => {
      if (c.id === chatId) {
        if (duration === 'unmute') {
          return { ...c, isMuted: false, muteDuration: undefined, mutedUntil: undefined };
        }
        let until: number | undefined;
        let label = 'Always';
        if (duration === '1h') { until = Date.now() + 3600000; label = '1 Hour'; }
        if (duration === '8h') { until = Date.now() + 28800000; label = '8 Hours'; }
        if (duration === '24h') { until = Date.now() + 86400000; label = '24 Hours'; }
        return { ...c, isMuted: true, muteDuration: label, mutedUntil: until };
      }
      return c;
    }));
  }, []);

  // Opener from Prompt Handler
  const handleSendOpenerFromPrompt = useCallback((question: string, answer: string) => {
    if (!profileModalChat) return;
    const targetChat = profileModalChat;
    setSelectedChatId(targetChat.id);
    const openerText = `✨ Replying to prompt "${question}" → "${answer}":\nHey ${targetChat.name}! `;
    setNewMessageText(openerText);
    setProfileModalChat(null);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  }, [profileModalChat]);

  // Extend 72h Match Pulse Handler
  const handleExtendMatchPulse = useCallback((chatId: string) => {
    setChatList(prev => prev.map(c => {
      if (c.id === chatId && c.expiresAt) {
        return {
          ...c,
          expiresAt: c.expiresAt + 24 * 3600 * 1000,
          pulseExtended: true
        };
      }
      return c;
    }));
  }, []);



  const totalUnreadCount = useMemo(() => {
    return chatList.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  }, [chatList]);

  const handleMarkAllAsRead = useCallback(() => {
    setChatList(prev => prev.map(c => ({ ...c, unreadCount: 0 })));
  }, []);

  const handleSelectChatWithDraft = useCallback((id: string) => {
    if (selectedChatIdRef.current && selectedChatIdRef.current !== id) {
      const targetChat = chatListRef.current.find(c => c.id === id);
      const currentDraft = newMessageTextRef.current.trim() ? newMessageTextRef.current : undefined;
      setChatList(prev => prev.map(c => {
        if (c.id === selectedChatIdRef.current) {
          return { ...c, draftText: currentDraft };
        }
        return c;
      }));
      setNewMessageText(targetChat?.draftText || '');
    }
    setSelectedChatId(id);
  }, []);

  // In-Thread Search & Pinned Jump State
  const [showThreadSearch, setShowThreadSearch] = useState(false);
  const [threadSearchQuery, setThreadSearchQuery] = useState('');
  const [threadMatchIndex, setThreadMatchIndex] = useState(0);
  const [pinnedScrollIndex, setPinnedScrollIndex] = useState<number | null>(null);
  const [activePinnedIndex, setActivePinnedIndex] = useState<number>(0);
  const [showAllPinnedModal, setShowAllPinnedModal] = useState<boolean>(false);

  // In-Thread Search Matches
  const threadMatches = useMemo(() => {
    if (!showThreadSearch || !threadSearchQuery.trim() || !selectedChat) return [];
    const q = threadSearchQuery.trim().toLowerCase();
    const indices: number[] = [];
    selectedChat.messages.forEach((m, idx) => {
      if (m.text && m.text.toLowerCase().includes(q)) {
        indices.push(idx);
      }
    });
    return indices;
  }, [showThreadSearch, threadSearchQuery, selectedChat]);

  const targetScrollIndex = useMemo(() => {
    if (threadMatches.length === 0) return null;
    const safeIdx = Math.max(0, Math.min(threadMatchIndex, threadMatches.length - 1));
    return threadMatches[safeIdx];
  }, [threadMatches, threadMatchIndex]);

  const effectiveScrollIndex = useMemo(() => {
    if (pinnedScrollIndex !== null) return pinnedScrollIndex;
    return targetScrollIndex;
  }, [pinnedScrollIndex, targetScrollIndex]);

  const pinnedMsgsInThread = useMemo(() => {
    if (!selectedChat) return [];
    return selectedChat.messages.filter(m => m.isPinnedInThread);
  }, [selectedChat]);

  const liveChatForDecorationPicker = useMemo(() => {
    if (!selectedChatForDecoration) return null;
    return chatList.find(c => c.id === selectedChatForDecoration.id) || selectedChatForDecoration;
  }, [chatList, selectedChatForDecoration]);

  const [jumpTarget, setJumpTarget] = useState<JumpTarget | null>(null);

  const handleJumpToMessage = useCallback((msgId: string, indexInThread: number, source: 'pinned' | 'search' = 'pinned') => {
    if (indexInThread < 0) return;
    setJumpTarget({
      msgId,
      index: indexInThread,
      jumpKey: Date.now(),
      source
    });
  }, []);

  // Reset pinned scroll index & modal when changing chats or searching
  // eslint-disable-next-line
  useEffect(() => {
    setPinnedScrollIndex(null);
    setActivePinnedIndex(0);
    setShowAllPinnedModal(false);
    setJumpTarget(null);
  }, [selectedChatId, threadSearchQuery]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > 8) {
      return;
    }

    // Bug 5 fix: Revoke previous blob URL to prevent memory leak
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    const newBlobUrl = URL.createObjectURL(file);
    blobUrlRef.current = newBlobUrl;

    setDraftAttachment({
      name: file.name,
      url: newBlobUrl,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      size: `${sizeMb.toFixed(1)} MB`
    });
    e.target.value = '';
  }, []);

  // Global Timer + Resource Cleanup to prevent memory leaks on unmount
  useEffect(() => {
    const typingTimers = typingTimersRef.current;
    const aiTimers = aiReplyTimersRef.current;
    return () => {
      Object.values(typingTimers).forEach(clearTimeout);
      Object.values(aiTimers).forEach(clearTimeout);
      // Bug 12 fix: Close AudioContext on unmount
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      // Bug 5 fix: Revoke any remaining blob URL
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

function sanitizeLoadedChats(chats: ChatItem[]): ChatItem[] {
  return chats.map(c => {
    const customThemeUrl = c.customThemeUrl && c.customThemeUrl.includes('purple') ? undefined : c.customThemeUrl;
    return {
      ...c,
      customThemeUrl,
      messages: c.messages.map(m => {
        let text = m.text;
        if (text && (text.includes('<br>') || text.includes('Skip to main content') || text.includes('YOU'))) {
          text = text
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<[^>]*>/g, '')
            .replace(/&lt;br\s*\/&gt;/gi, '\n')
            .replace(/&lt;[^&]*&gt;/gi, '')
            .replace(/^YOU\s*/i, '')
            .replace(/Skip to main content.*/gi, '')
            .trim();
        }
        return { ...m, text };
      })
    };
  });
}

  // Progressive Hydration
  useEffect(() => {
    let cancelled = false;
    let hydrationTimer: ReturnType<typeof setTimeout>;
    idbLoadChats()
      .then(stored => {
        if (cancelled) return;
        if (stored && stored.length > 0) {
          const clean = sanitizeLoadedChats(stored);
          isHydratedFromDB.current = true;
          setChatList(clean.slice(0, 50));
          setSelectedChatId(clean[0]?.id || '1');
          setIsLoadingFromDB(false);

          if (clean.length > 50 || clean.some(c => c.messages.length > 50)) {
            hydrationTimer = setTimeout(() => {
              if (!cancelled) {
                setChatList(clean);
                setIsDBReady(true);
              }
            }, 30);
          } else {
            setIsDBReady(true);
          }
        } else {
          setIsLoadingFromDB(false);
          setIsDBReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsLoadingFromDB(false);
          setIsDBReady(true);
        }
      });
    return () => { 
      cancelled = true; 
      if (hydrationTimer) clearTimeout(hydrationTimer);
    };
  }, []);

  // Debounced Auto-Save — Perf 4: Increase debounce to 2000ms
  // Persistent IndexedDB Auto-Saver
  useEffect(() => {
    if (!isDBReady) return;
    const saveTimer = setTimeout(() => {
      idbSaveChats(chatList, saveQueueRef).catch(err => {
        console.warn('IDB Save warning:', err);
      });
    }, 300);
    return () => clearTimeout(saveTimer);
  }, [chatList, isDBReady]);


  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Audio Haptic Synthesizer
  const soundEnabledRef = useRef(soundEnabled);
  useEffect(() => { soundEnabledRef.current = soundEnabled; }, [soundEnabled]);

  const playSoundEffect = useCallback((type: 'send' | 'select' | 'pop' = 'send') => {
    if (!soundEnabledRef.current) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(type === 'send' ? 660 : type === 'pop' ? 880 : 440, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      console.warn("AudioContext error", e);
    }
  }, []);

  // Filter & Smart Pin Sorting
  const filteredChats = useMemo(() => {
    const query = debouncedQuery.toLowerCase().trim();
    const list = chatList.filter(c => {
      if (filterTab === 'unread') return (c.unreadCount || 0) > 0;
      if (filterTab === 'pinned') return c.isPinned;
      if (query) {
        return c.name.toLowerCase().includes(query) || c.lastMessage.toLowerCase().includes(query);
      }
      return true;
    });

    // Sort pinned to top, then by most recently updated
    return [...list].sort((a, b) => {
      const pinA = a.isPinned ? 1 : 0;
      const pinB = b.isPinned ? 1 : 0;
      if (pinA !== pinB) return pinB - pinA;
      
      const timeA = a.lastUpdated || 0;
      const timeB = b.lastUpdated || 0;
      return timeB - timeA;
    });
  }, [chatList, debouncedQuery, filterTab]);

  // Message Emoji Reaction Toggle Handler — Bug 17 fix: use ref for current chatId
  const handleDeleteMessage = useCallback((msgId: string) => {
    const currentChatId = selectedChatIdRef.current;
    if (!currentChatId) return;
    playSoundEffect('pop');

    setChatList(prev => prev.map(c => {
      if (c.id === currentChatId) {
        return {
          ...c,
          messages: c.messages.filter(m => m.id !== msgId)
        };
      }
      return c;
    }));
  }, []);

  const handleToggleReaction = useCallback((msgId: string, emoji: string) => {
    const currentChatId = selectedChatIdRef.current;
    if (!currentChatId) return;
    playSoundEffect('pop');

    setChatList(prev => prev.map(c => {
      if (c.id === currentChatId) {
        const updatedMessages = c.messages.map(m => {
          if (m.id === msgId) {
            const currentReactions = m.reactions || [];
            const existingIndex = currentReactions.findIndex(r => r.emoji === emoji);

            let newReactions: MessageReaction[] = [];
            if (existingIndex >= 0) {
              const r = currentReactions[existingIndex];
              const hasMe = r.users.includes('me');
              if (hasMe && r.count === 1) {
                newReactions = currentReactions.filter(x => x.emoji !== emoji);
              } else if (hasMe) {
                newReactions = currentReactions.map(x => x.emoji === emoji ? { ...x, count: x.count - 1, users: x.users.filter(u => u !== 'me') } : x);
              } else {
                newReactions = currentReactions.map(x => x.emoji === emoji ? { ...x, count: x.count + 1, users: [...x.users, 'me'] } : x);
              }
            } else {
              newReactions = [...currentReactions, { emoji, count: 1, users: ['me'] }];
            }
            return { ...m, reactions: newReactions };
          }
          return m;
        });
        return { ...c, messages: updatedMessages };
      }
      return c;
    }));
  }, [playSoundEffect]);

  // Message Thread Operations
  const handleTogglePinMessage = useCallback((msg: Message) => {
    if (!selectedChatIdRef.current) return;
    setChatList(prev => prev.map(c => {
      if (c.id === selectedChatIdRef.current) {
        const updatedMessages = c.messages.map(m => {
          if (m.id === msg.id) {
            return { ...m, isPinnedInThread: !m.isPinnedInThread };
          }
          return m;
        });
        return { ...c, messages: updatedMessages };
      }
      return c;
    }));
  }, []);

  const isSubmittingRef = useRef(false);
  const submitLockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (submitLockTimerRef.current) clearTimeout(submitLockTimerRef.current);
    };
  }, []);

  // Send Message & Trigger AI Responder
  const handleSendMessage = useCallback((e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    const textToSend = overrideText !== undefined ? overrideText : newMessageTextRef.current;
    if ((!textToSend.trim() && !draftAttachment) || !selectedChatId) return;
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    
    // Release the submission lock after a short delay
    if (submitLockTimerRef.current) clearTimeout(submitLockTimerRef.current);
    submitLockTimerRef.current = setTimeout(() => {
      isSubmittingRef.current = false;
    }, 100);

    playSoundEffect('send');



    const newMsg: Message = {
      id: generateId(), // Bug 16 fix: collision-free ID
      senderId: 'me',
      senderName: 'You',
      text: textToSend.trim() || (draftAttachment ? `Shared attachment: ${draftAttachment.name}` : ''),
      timestamp: 'Just now',
      isMe: true,
      status: 'read',
      attachment: draftAttachment || undefined,
      replyTo: replyingToMessage ? {
        id: replyingToMessage.id,
        senderName: replyingToMessage.senderName,
        text: replyingToMessage.text
      } : undefined
    };

    setReplyingToMessage(null);

    // Capture the target before async work
    const targetChatId = selectedChatId;

    setChatList(prev => prev.map(c => {
      if (c.id === targetChatId) {
        return {
          ...c,
          lastMessage: newMsg.text,
          timestamp: 'Just now',
          lastUpdated: Date.now(),
          unreadCount: 0,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    setNewMessageText('');
    // Bug 5 fix: Clear blob ref when attachment is consumed
    if (draftAttachment) {
      blobUrlRef.current = null; // Don't revoke — the message now owns it
    }
    setDraftAttachment(null);

    // AI Auto-Responder — Realistic Business Logic
    const currentContactName = chatListRef.current.find(c => c.id === targetChatId)?.name || 'Contact';

    if (typingTimersRef.current[targetChatId]) clearTimeout(typingTimersRef.current[targetChatId]);
    if (aiReplyTimersRef.current[targetChatId]) clearTimeout(aiReplyTimersRef.current[targetChatId]);

    // AI Auto-Responder — Realistic Business Logic with Keyword Intents
    let randomReply = '';
    const lowerText = textToSend.toLowerCase();
    
    if (draftAttachment || lowerText.includes('file') || lowerText.includes('document') || lowerText.includes('attached')) {
      const fileReplies = [
        `Thanks for sending that over! Checking it right now. 👍`,
        `Got the file. I'll review and get back to you shortly.`,
        `Perfect, I've saved this to our project folder.`
      ];
      randomReply = fileReplies[Math.floor(Math.random() * fileReplies.length)];
    } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
      const greetingReplies = [
        `Hi there! How can I help you today?`,
        `Hello! Hope you're having a good day.`,
        `Hey! What's on your mind?`
      ];
      randomReply = greetingReplies[Math.floor(Math.random() * greetingReplies.length)];
    } else if (lowerText.includes('approve') || lowerText.includes('looks good') || lowerText.includes('lgtm') || lowerText.includes('ok')) {
      const approvalReplies = [
        `Great! I'll move forward with the next steps. 🚀`,
        `Awesome, I'll let the team know.`,
        `Perfect! I've logged this in the project tracker.`
      ];
      randomReply = approvalReplies[Math.floor(Math.random() * approvalReplies.length)];
    } else if (lowerText.includes('meeting') || lowerText.includes('call') || lowerText.includes('sync')) {
      const meetingReplies = [
        `Let's sync on tomorrow's call about this.`,
        `Can we push our 1:1 to Thursday? I have a clash with the all-hands.`,
        `I'll send over a calendar invite shortly.`
      ];
      randomReply = meetingReplies[Math.floor(Math.random() * meetingReplies.length)];
    } else if (lowerText.includes('?')) {
      const questionReplies = [
        `I'll have to double check that and get back to you.`,
        `That's a good question. Let me run this by the design team.`,
        `Could you clarify a bit more?`
      ];
      randomReply = questionReplies[Math.floor(Math.random() * questionReplies.length)];
    } else {
      const genericReplies = [
        `The deployment has been scheduled for 2 AM UTC as requested.`,
        `I've approved the pull request. Feel free to merge when ready.`,
        `The staging environment has been updated with the latest changes.`,
        `Appreciate the update!`
      ];
      randomReply = genericReplies[Math.floor(Math.random() * genericReplies.length)];
    }

    // Calculate a dynamic typing delay based on message length (~25 chars/sec + baseline latency)
    const typingDuration = Math.max(1200, randomReply.length * 40);
    const initialDelay = 500; // time before they "start" typing

    const typingTimer = setTimeout(() => {
      setTypingState(prev => ({ ...prev, [targetChatId]: true }));
    }, initialDelay);
    typingTimersRef.current[targetChatId] = typingTimer;

    const replyTimer = setTimeout(() => {
      setTypingState(prev => {
        const next = { ...prev };
        delete next[targetChatId];
        return next;
      });
      playSoundEffect('pop');

      const autoMsg: Message = {
        id: generateId(),
        senderId: targetChatId,
        senderName: currentContactName,
        text: randomReply,
        timestamp: 'Just now',
        status: 'read'
      };

      // Read LIVE selectedChatId from ref to determine unread count accurately
      const liveSelectedId = selectedChatIdRef.current;
      setChatList(prev => prev.map(c => {
        if (c.id === targetChatId) {
          // If we aren't currently viewing this chat, increment unread count and bump to top
          const isViewing = liveSelectedId === targetChatId;
          return {
            ...c,
            lastMessage: autoMsg.text,
            timestamp: 'Just now',
            lastUpdated: Date.now(),
            unreadCount: isViewing ? 0 : (c.unreadCount || 0) + 1,
            messages: [...c.messages, autoMsg]
          };
        }
        return c;
      }));
    }, initialDelay + typingDuration);
    aiReplyTimersRef.current[targetChatId] = replyTimer;
  }, [newMessageText, draftAttachment, selectedChatId, playSoundEffect, replyingToMessage]);

  // Decoration Handler — writes to `avatarDecoration` (the field ChatRowItem reads)
  const applyDecoration = useCallback((chatId: string, decoration: string, url?: string) => {
    setChatList(prev => 
      prev.map(c => 
        c.id === chatId ? { ...c, avatarDecoration: decoration as any, customDecorationUrl: url } : c
      )
    );
  }, []);

  // Theme Handler — writes `customThemeUrl` (CSS gradient string, not an image URL)
  const applyTheme = useCallback((chatId: string, themeUrl: string | undefined) => {
    setChatList(prev =>
      prev.map(c =>
        c.id === chatId ? { ...c, customThemeUrl: themeUrl } : c
      )
    );
  }, []);

  // Navigation Handler
  const handleSelectChat = useCallback((id: string) => {
    playSoundEffect('select');
    const currentDraft = newMessageTextRef.current.trim() ? newMessageTextRef.current : undefined;
    
    setChatList(prev => prev.map(c => {
      if (c.id === selectedChatIdRef.current) {
        return { ...c, draftText: currentDraft };
      }
      if (c.id === id) {
        return { ...c, unreadCount: 0 };
      }
      return c;
    }));
    
    const targetChat = chatListRef.current.find(c => c.id === id);
    setNewMessageText(targetChat?.draftText || '');
    setSelectedChatId(id);
  }, [playSoundEffect]);

  // Bug 16 fix: Use collision-free IDs
  const handleCreateNewChat = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatName.trim()) return;

    playSoundEffect('send');

    const chatId = generateId();
    const newChat: ChatItem = {
      id: chatId,
      name: newChatName.trim(),
      avatar: '',
      lastMessage: 'No messages yet',
      timestamp: 'Just now',
      lastUpdated: Date.now(),
      isOnline: true,
      statusText: 'Active now',
      messages: []
    };

    setChatList(prev => [newChat, ...prev]);
    setSelectedChatId(chatId);
    setNewChatName('');
    setShowNewChatModal(false);
  }, [newChatName, playSoundEffect]);

  /* Single-Source-Of-Truth Chat Action Handlers */
  const handleViewProfileForChat = useCallback((chatId: string) => {
    const target = chatListRef.current.find(c => c.id === chatId);
    if (target) {
      setProfileModalChat(target);
      if (onSelectChat) {
        onSelectChat(target);
      }
    }
  }, [onSelectChat]);

  const handleTogglePinChatForId = useCallback((chatId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setChatList(prev => prev.map(c => c.id === chatId ? { ...c, isPinned: !c.isPinned } : c));
  }, []);

  const handleShareChatForId = useCallback((chatId: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`https://chat.example.com/c/${chatId}`).catch(() => {});
    }
  }, []);

  const handleBlockUserForId = useCallback((chatId: string) => {
    setChatList(prev => prev.map(c => c.id === chatId ? { ...c, isBlocked: !c.isBlocked } : c));
  }, []);

  const handleDeleteChatForId = useCallback((chatId: string) => {
    if (!chatId) return;
    
    // Clean up pending AI timers to prevent memory leaks and zombie state updates
    if (typingTimersRef.current[chatId]) clearTimeout(typingTimersRef.current[chatId]);
    if (aiReplyTimersRef.current[chatId]) clearTimeout(aiReplyTimersRef.current[chatId]);
    delete typingTimersRef.current[chatId];
    delete aiReplyTimersRef.current[chatId];
    
    setChatList(prev => {
      const remaining = prev.filter(c => c.id !== chatId);
      if (remaining.length > 0 && selectedChatIdRef.current === chatId) {
        setSelectedChatId(remaining[0].id);
      } else if (remaining.length === 0) {
        setSelectedChatId(null);
      }
      return remaining;
    });

    setTypingState(prev => {
      const newState = { ...prev };
      delete newState[chatId];
      return newState;
    });
  }, []);

  const chatOptionsRenderer = useCallback((chat: ChatItem) => (
    <SharedChatOptionsMenu
      chat={chat}
      onViewProfile={handleViewProfileForChat}
      onTogglePin={handleTogglePinChatForId}
      onShare={handleShareChatForId}
      onMute={handleMuteChat}
      onBlock={handleBlockUserForId}
      onDelete={handleDeleteChatForId}
    >
      <button type="button" className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition cursor-pointer" title="More options">
        <MoreHorizontal className="w-3.5 h-3.5" />
      </button>
    </SharedChatOptionsMenu>
  ), [handleViewProfileForChat, handleTogglePinChatForId, handleShareChatForId, handleMuteChat, handleBlockUserForId, handleDeleteChatForId]);

  const handleSendQuickMessage = useCallback((text: string) => {
    setNewMessageText(text);
    setTimeout(() => handleSendMessage(undefined, text), 0);
  }, [handleSendMessage]);

  const handleReplyMessage = useCallback((msg: Message) => {
    setReplyingToMessage(msg);
    inputRef.current?.focus();
  }, []);

  return (
    <TooltipProvider delayDuration={150}>
      <div className="w-full h-full font-sans relative flex gap-3 sm:gap-4 p-3 sm:p-4 bg-[#F4F5F8] dark:bg-slate-950 overflow-hidden">
        
        {/* Left Side: Chats Sidebar Panel */}
        <div className={`transition-all duration-300 ease-in-out shrink-0 bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col h-full min-h-0 overflow-hidden ${selectedChatId ? 'hidden md:flex' : 'flex'} w-full md:w-[320px] xl:w-[360px]`}>
          
          <div className="p-4 space-y-3 shrink-0">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {title}
              </h2>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveMainView(prev => prev === 'feed' ? 'chat' : 'feed')}
                  className={`px-2.5 py-1.5 rounded-full flex items-center justify-center gap-1 transition cursor-pointer text-xs font-extrabold active:scale-95 ${
                    activeMainView === 'feed' 
                      ? 'bg-purple-600 text-white shadow-xs' 
                      : 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 hover:bg-purple-200'
                  }`}
                  title="Toggle HeartLink Vibe Feed"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>{activeMainView === 'feed' ? 'Chat' : 'Vibe Feed'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowSpeedPulseModal(true)}
                  className="px-2.5 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white flex items-center justify-center gap-1 hover:opacity-90 transition cursor-pointer shadow-xs text-xs font-extrabold active:scale-95"
                  title="Speed Pulse Swipe Deck (Tinder Mode)"
                >
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  <span>Speed Deck</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewChatModal(true)}
                  className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center hover:bg-purple-200 transition cursor-pointer shadow-xs"
                  title="New Conversation"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search Input Box */}
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5F6F9] dark:bg-slate-800 border-none pl-9 pr-9 py-2.5 rounded-2xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-purple-500/20 transition"
              />
            </div>

            {/* Filter Tabs */}
            <Tabs value={filterTab} onValueChange={(val) => setFilterTab(val as any)} className="w-full">
              <TabsList className="grid grid-cols-3 w-full bg-[#F5F6F9] dark:bg-slate-800 p-1 rounded-2xl">
                <TabsTrigger value="all" className="rounded-xl text-xs font-semibold py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-300 data-[state=active]:shadow-2xs">All ({chatList.length})</TabsTrigger>
                <TabsTrigger value="unread" className="rounded-xl text-xs font-semibold py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-300 data-[state=active]:shadow-2xs">Unread ({totalUnreadCount})</TabsTrigger>
                <TabsTrigger value="pinned" className="rounded-xl text-xs font-semibold py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-300 data-[state=active]:shadow-2xs">Pinned</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>


        {/* VIRTUALIZED CHAT STREAM */}
        <VirtualizedSidebarList
          chats={filteredChats}
          selectedChatId={selectedChatId || ''}
          onSelectChat={handleSelectChat}
          onTogglePinChat={handleTogglePinChatForId}
          chatOptionsRenderer={chatOptionsRenderer}
        />
      </div>



      {/* Center: Active Messenger Thread Panel or HeartLink Vibe Feed */}
      <div className={`flex-1 bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col h-full min-h-0 overflow-hidden relative ${!selectedChatId && activeMainView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
        
        {activeMainView === 'feed' ? (
          <HeartLinkFeedView
            onSendOpener={(authorName, promptText) => {
              const matchingChat = chatList.find(c => c.name.toLowerCase().includes(authorName.toLowerCase())) || chatList[0];
              if (matchingChat) {
                setSelectedChatId(matchingChat.id);
                setActiveMainView('chat');
                handleSendOpenerFromPrompt('Feed Post Opener', promptText);
              }
            }}
            onProposeDate={(dateSpotName, location) => {
              const targetChat = selectedChat || chatList[0];
              if (targetChat) {
                setSelectedChatId(targetChat.id);
                setActiveMainView('chat');
                handleSendMessage(undefined, `🥂 Date Proposal: ${dateSpotName} (${location})\nWould you like to check this out together? ✨`);
              }
            }}
            onJoinGroup={(groupTitle) => {
              const targetChat = selectedChat || chatList[0];
              if (targetChat) {
                setSelectedChatId(targetChat.id);
                setActiveMainView('chat');
                handleSendMessage(undefined, `👯 Double Date & Group Invite: ${groupTitle}\nWant to join as a pair with me? ☕✨`);
              }
            }}
          />
        ) : selectedChat ? (
          <>
            {/* Header Bar */}
            <div className="h-16 px-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0 z-20">
              <div className="flex items-center gap-3">
                <Button type="button" variant="ghost" size="icon" className="md:hidden mr-1" onClick={() => setSelectedChatId(null)}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="relative">
                  <AvatarWithFallback name={selectedChat.name} src={selectedChat.avatar} size="w-10 h-10" />
                  {selectedChat.isOnline && <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900 absolute bottom-0 right-0 z-10" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    {selectedChat.name}
                    <span title="Verified Contact" className="w-3.5 h-3.5 rounded-full bg-amber-400 text-amber-950 font-bold text-[9px] inline-flex items-center justify-center">★</span>
                  </h3>
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    Online now
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button" 
                      onClick={() => setShowAIDateModal(true)}
                      className="px-2.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1.5 transition cursor-pointer text-xs font-extrabold shadow-2xs active:scale-95" 
                      title="Cupid AI Date Spot Concierge"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                      <span className="hidden sm:inline">Cupid AI</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Cupid AI Date Concierge</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button" 
                      onClick={() => setShowSpeedVideoModal(true)}
                      className="w-9 h-9 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center justify-center transition cursor-pointer shadow-2xs active:scale-95" 
                      title="5-Minute Speed Video Date"
                    >
                      <Video className="w-4 h-4 text-rose-500" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>5-Min Speed Video Date</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button" 
                      onClick={() => setShowSafetyModal(true)}
                      className="w-9 h-9 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center transition cursor-pointer shadow-2xs active:scale-95" 
                      title="SafeDate Guardian & Pose Verification"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>SafeDate Guardian</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button" 
                      onClick={() => setShowLocalEventsModal(true)}
                      className="w-9 h-9 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center justify-center transition cursor-pointer shadow-2xs active:scale-95" 
                      title="Exclusive Local Event Passes"
                    >
                      <Ticket className="w-4 h-4 text-purple-500" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Exclusive Local Event Passes</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button" 
                      onClick={() => setShowGroupHangoutsModal(true)}
                      className="w-9 h-9 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 flex items-center justify-center transition cursor-pointer shadow-2xs active:scale-95" 
                      title="Double Date & Group Hangouts"
                    >
                      <Users className="w-4 h-4 text-indigo-500" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Double Date & Group Hangouts</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="w-9 h-9 rounded-full bg-[#F5F6F9] dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition cursor-pointer" title="Audio Call">
                      <Phone className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Audio Call</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="w-9 h-9 rounded-full bg-[#F5F6F9] dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition cursor-pointer" title="Video Call">
                      <Video className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Video Call</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowThreadSearch(!showThreadSearch);
                        if (showThreadSearch) setThreadSearchQuery('');
                      }} 
                      className={`w-9 h-9 rounded-full text-slate-600 dark:text-slate-300 flex items-center justify-center transition cursor-pointer ${showThreadSearch ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600' : 'bg-[#F5F6F9] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`} 
                      title="Search Thread"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Search in thread (Ctrl+F)</TooltipContent>
                </Tooltip>


              </div>
            </div>

              {/* IN-THREAD FLOATING SEARCH BAR */}
              {showThreadSearch && (
                <div className="px-5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1 shrink-0">
                  <div className="flex items-center gap-2 flex-1 max-w-md bg-background border border-[var(--color-border)] rounded-xl px-3 py-1.5 shadow-2xs focus-within:ring-2 focus-within:ring-purple-200">
                    <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Find in thread..."
                      value={threadSearchQuery}
                      onChange={(e) => {
                        setThreadSearchQuery(e.target.value);
                        setThreadMatchIndex(0);
                      }}
                      className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder-slate-400"
                      autoFocus
                    />
                    {threadSearchQuery && (
                      <button type="button" onClick={() => setThreadSearchQuery('')} className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer" aria-label="Clear search">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {threadMatches.length > 0 ? (
                      <div className="flex items-center gap-1 text-xs text-slate-600 font-mono">
                        <span className="font-semibold">{threadMatchIndex + 1} of {threadMatches.length}</span>
                        <button
                          type="button"
                          onClick={() => setThreadMatchIndex(prev => (prev > 0 ? prev - 1 : threadMatches.length - 1))}
                          className="p-2 hover:bg-slate-200 rounded-md transition cursor-pointer"
                          aria-label="Previous match"
                          title="Previous match"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setThreadMatchIndex(prev => (prev < threadMatches.length - 1 ? prev + 1 : 0))}
                          className="p-2 hover:bg-slate-200 rounded-md transition cursor-pointer"
                          aria-label="Next match"
                          title="Next match"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : threadSearchQuery.trim() ? (
                      <span className="text-xs text-slate-400 italic">No matches</span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        setShowThreadSearch(false);
                        setThreadSearchQuery('');
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition cursor-pointer ml-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* PINNED MESSAGES BANNER */}
              {(() => {
                const pinnedMsgs = selectedChat.messages.filter(m => m.isPinnedInThread);
                if (pinnedMsgs.length === 0) return null;

                const safePinnedIdx = Math.max(0, Math.min(activePinnedIndex, pinnedMsgs.length - 1));
                const currentPinned = pinnedMsgs[safePinnedIdx];
                const pinnedMsgIndexInThread = selectedChat.messages.findIndex(m => m.id === currentPinned.id);
                const cleanText = stripHtmlAndNewlines(currentPinned.text);

                return (
                  <div className="px-4 py-2 bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 border-b border-amber-300/60 flex items-center justify-between text-xs animate-in fade-in shrink-0 shadow-2xs backdrop-blur-xs relative z-20">
                    <div 
                      onClick={() => {
                        if (pinnedMsgIndexInThread >= 0) {
                          handleJumpToMessage(currentPinned.id, pinnedMsgIndexInThread);
                        }
                      }}
                      className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer hover:opacity-90 transition group/pin"
                      title="Click to jump to pinned message"
                    >
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-400/40">
                        <Pin className="w-3.5 h-3.5 text-amber-700 fill-amber-500 shrink-0" />
                      </div>
                      
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-950">
                          <span>Pinned Message</span>
                          {pinnedMsgs.length > 1 && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-200/90 text-amber-900 border border-amber-300">
                              {safePinnedIdx + 1} of {pinnedMsgs.length}
                            </span>
                          )}
                        </div>
                        <span className="text-amber-900/95 truncate text-xs font-medium">
                          <span className="font-bold text-amber-950">{currentPinned.senderName}:</span> {cleanText || (currentPinned.attachment ? `[Attachment: ${currentPinned.attachment.name}]` : 'Media / Voice note')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-3">
                      {/* Navigation arrows if > 1 pinned message */}
                      {pinnedMsgs.length > 1 && (
                        <div className="flex items-center gap-0.5 bg-amber-200/70 p-0.5 rounded-lg border border-amber-300/80 mr-1">
                          <button
                            type="button"
                            onClick={() => {
                              const nextIdx = safePinnedIdx === 0 ? pinnedMsgs.length - 1 : safePinnedIdx - 1;
                              setActivePinnedIndex(nextIdx);
                              const targetMsg = pinnedMsgs[nextIdx];
                              const targetIdx = selectedChat.messages.findIndex(m => m.id === targetMsg.id);
                              if (targetIdx >= 0) handleJumpToMessage(targetMsg.id, targetIdx);
                            }}
                            aria-label="Previous pinned message"
                            title="Previous pinned message"
                            className="p-1 hover:bg-amber-300 text-amber-950 rounded-md transition cursor-pointer"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const nextIdx = (safePinnedIdx + 1) % pinnedMsgs.length;
                              setActivePinnedIndex(nextIdx);
                              const targetMsg = pinnedMsgs[nextIdx];
                              const targetIdx = selectedChat.messages.findIndex(m => m.id === targetMsg.id);
                              if (targetIdx >= 0) handleJumpToMessage(targetMsg.id, targetIdx);
                            }}
                            aria-label="Next pinned message"
                            title="Next pinned message"
                            className="p-1 hover:bg-amber-300 text-amber-950 rounded-md transition cursor-pointer"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (pinnedMsgIndexInThread >= 0) {
                            handleJumpToMessage(currentPinned.id, pinnedMsgIndexInThread);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-[11px] transition cursor-pointer shadow-2xs border border-amber-300"
                      >
                        Jump
                      </button>

                      {pinnedMsgs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setShowAllPinnedModal(!showAllPinnedModal)}
                          className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] transition cursor-pointer border border-amber-300/80"
                          title="View all pinned messages"
                        >
                          All ({pinnedMsgs.length})
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleTogglePinMessage(currentPinned)}
                        aria-label="Unpin message"
                        className="p-1 text-amber-800 hover:text-amber-950 rounded-full hover:bg-amber-200/80 transition cursor-pointer ml-0.5"
                        title="Unpin message"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* 72-HOUR MATCH PULSE BANNER */}
              <HeartPulseBanner
                isMatch={selectedChat.isMatch}
                expiresAt={selectedChat.expiresAt}
                pulseExtended={selectedChat.pulseExtended}
                chatId={selectedChat.id}
                onExtendMatchPulse={handleExtendMatchPulse}
              />

              {/* ALL PINNED MESSAGES DRAWER MODAL */}
              {showAllPinnedModal && selectedChat && (
                <div className="absolute inset-x-0 top-16 z-40 bg-amber-50/98 border-b-2 border-amber-300/80 p-4 shadow-xl animate-in slide-in-from-top duration-200 max-h-80 overflow-y-auto backdrop-blur-md">
                  <div className="flex items-center justify-between mb-3 border-b border-amber-200/80 pb-2">
                    <div className="flex items-center gap-2">
                      <Pin className="w-4 h-4 text-amber-600 fill-amber-500" />
                      <h4 className="font-bold text-xs text-amber-950 uppercase tracking-wider">
                        Pinned Messages in Thread ({selectedChat.messages.filter(m => m.isPinnedInThread).length})
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAllPinnedModal(false)}
                      className="p-1 text-amber-800 hover:text-amber-950 rounded-full hover:bg-amber-200 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {selectedChat.messages.filter(m => m.isPinnedInThread).map((pm, pIdx) => {
                      const msgIndex = selectedChat.messages.findIndex(m => m.id === pm.id);
                      const clean = stripHtmlAndNewlines(pm.text);
                      return (
                        <div
                          key={pm.id}
                          className="p-2.5 rounded-xl bg-background border border-amber-200/80 hover:border-amber-400 hover:shadow-md transition flex items-center justify-between gap-3 text-xs"
                        >
                          <div
                            onClick={() => {
                              setActivePinnedIndex(pIdx);
                              if (msgIndex >= 0) handleJumpToMessage(pm.id, msgIndex);
                              setShowAllPinnedModal(false);
                            }}
                            className="flex-1 min-w-0 cursor-pointer"
                          >
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-bold text-amber-950 text-xs">{pm.senderName}</span>
                              <span className="text-[10px] text-amber-700/80 font-mono">{pm.timestamp}</span>
                            </div>
                            <p className="text-slate-700 truncate font-medium">
                              {clean || (pm.attachment ? `[Attachment: ${pm.attachment.name}]` : 'Media / Voice note')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setActivePinnedIndex(pIdx);
                                if (msgIndex >= 0) handleJumpToMessage(pm.id, msgIndex);
                                setShowAllPinnedModal(false);
                              }}
                              className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] transition cursor-pointer"
                            >
                              Jump
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTogglePinMessage(pm)}
                              className="p-1 text-amber-700 hover:text-amber-950 hover:bg-amber-100 rounded transition cursor-pointer"
                              title="Unpin"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MESSAGES STREAM */}
              <VirtualizedMessageStream
                messages={selectedChat.messages}
                isTyping={typingState[selectedChat.id] || false}
                selectedChatId={selectedChatId ?? ''}
                selectedChatName={selectedChat.name}
                selectedChatAvatar={selectedChat.avatar}
                onToggleReaction={handleToggleReaction}
                onSendQuickMessage={handleSendQuickMessage}
                onReplyMessage={handleReplyMessage}
                onDeleteMessage={handleDeleteMessage}
                onPinMessage={handleTogglePinMessage}
                onOpenImage={setActiveLightboxUrl}
                searchQuery={threadSearchQuery}
                jumpTarget={jumpTarget}
                targetScrollIndex={targetScrollIndex}
                messageCount={selectedChat.messages.length}
              />


              {/* DRAFT REPLY PREVIEW BAR */}
              {replyingToMessage && (
                <div className="px-5 py-2 bg-purple-50/80 border-t border-purple-100 flex items-center justify-between gap-2 animate-in fade-in slide-in-from-bottom-1 shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <Reply className="w-4 h-4 text-purple-600 shrink-0" />
                    <div className="text-xs min-w-0">
                      <span className="font-bold text-purple-900 block truncate">Replying to {replyingToMessage.senderName}</span>
                      <span className="text-slate-600 truncate block text-[11px]">{replyingToMessage.text}</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setReplyingToMessage(null)} 
                    aria-label="Cancel reply"
                    className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer rounded-full hover:bg-purple-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}


              {/* ANTI-GHOSTING AI RE-IGNITER PROMPT */}
              <AntiGhostingPrompt
                partnerName={selectedChat.name}
                onSelectPrompt={(promptText: string) => {
                  setNewMessageText(promptText);
                  inputRef.current?.focus();
                }}
              />

              {/* DRAFT ATTACHMENT PREVIEW */}
              {draftAttachment && (
                <div className="px-5 pt-3 pb-1 -mt-2">
                  <div className="group relative p-2.5 bg-background shadow-lg border border-[var(--color-border)] rounded-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 w-max min-w-[240px] max-w-[80%] hover:border-purple-300 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      {draftAttachment.type === 'image' ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                          <img src={draftAttachment.url} alt="Draft" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100/50 shadow-sm">
                          <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                      )}
                      <div className="flex flex-col truncate">
                        <span className="text-[13px] text-slate-800 truncate font-semibold">{draftAttachment.name}</span>
                        {draftAttachment.size && <span className="text-[11px] text-slate-500 font-medium">{draftAttachment.size}</span>}
                      </div>
                    </div>
                    <button type="button" onClick={() => setDraftAttachment(null)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer" aria-label="Remove attachment">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Input Controls Row */}
              <div className="p-3 sm:p-4 border-t border-slate-200/80 dark:border-slate-800/80 shrink-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
                <form onSubmit={handleSendMessage} className="flex flex-col gap-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-2.5 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500/80 transition-all shadow-2xs">
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.txt"
                  />

                  <ChatInputEditor
                    placeholder={isRecordingVoice ? `Recording (${Math.floor(recordingSecs / 60)}:${(recordingSecs % 60).toString().padStart(2, '0')})...` : `Type a message...`}
                    value={newMessageText}
                    onChange={(val) => setNewMessageText(val)}
                    onSubmit={() => handleSendMessage()}
                    disabled={isRecordingVoice}
                    maxLength={4000}
                  />

                  {/* Bottom Toolbar Row */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/40 dark:border-slate-700/40 px-1">
                    <div className="flex items-center gap-1">
                      <button type="button" aria-label="Add attachment" className="p-1.5 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition cursor-pointer rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50" onClick={() => fileInputRef.current?.click()}>
                        <Plus className="w-4 h-4" />
                      </button>
                      
                      <div className="relative">
                        <button type="button" aria-label="Add emoji" className={`p-1.5 transition cursor-pointer rounded-lg ${showEmojiPicker ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/30' : 'text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'}`} onClick={(e) => { e.preventDefault(); setShowEmojiPicker(v => !v); }}>
                          <SmilePlus className="w-4 h-4" />
                        </button>
                        {showEmojiPicker && (
                          <div className="absolute bottom-10 left-0 z-50">
                            <TwemojiPicker
                              onSelect={(emoji) => {
                                setNewMessageText(prev => prev + emoji);
                              }}
                              onClose={() => setShowEmojiPicker(false)}
                            />
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!isRecordingVoice) {
                            setIsRecordingVoice(true);
                          } else {
                            setIsRecordingVoice(false);
                            playSoundEffect('send');
                            
                            const formatTime = (secs: number) => `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, '0')}`;
                            const durationStr = formatTime(Math.max(3, recordingSecs));
                            
                            const newMsg: Message = {
                              id: generateId(),
                              senderId: 'me',
                              senderName: 'You',
                              text: `Voice note (${durationStr})`,
                              timestamp: 'Just now',
                              isMe: true,
                              status: 'read',
                              voiceNote: { duration: durationStr, waveform: [40, 80, 60, 100, 30, 70, 90, 50] }
                            };
                            const currentId = selectedChatIdRef.current;
                            if (currentId) {
                              setChatList(prev => prev.map(c => c.id === currentId ? { ...c, lastMessage: newMsg.text, lastUpdated: Date.now(), timestamp: 'Just now', messages: [...c.messages, newMsg] } : c));
                            }
                          }
                        }}
                        aria-label="Record voice note"
                        className={`p-1.5 transition cursor-pointer rounded-lg ${isRecordingVoice ? 'bg-red-50 text-red-500 animate-pulse' : 'text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'}`}
                      >
                        {isRecordingVoice ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono select-none ${newMessageText.length >= 4000 ? 'text-red-500 font-bold' : 'text-slate-400 dark:text-slate-500'}`}>
                        {newMessageText.length} / 4000
                      </span>
                      <button 
                        type="submit" 
                        aria-label="Send message" 
                        className={`w-8 h-8 rounded-full transition-all shadow-sm flex items-center justify-center cursor-pointer ${newMessageText.trim() || draftAttachment ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'}`}
                        disabled={!newMessageText.trim() && !draftAttachment}
                      >
                        <Send className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-slate-400 text-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Send className="w-6 h-6 text-slate-300" />
              </div>
              Select a conversation to start messaging
            </div>
          )}
        </div>

        {/* Right Side: Info Sidebar */}
        {showRightSidebar && selectedChat && (
          <div className="w-[300px] xl:w-[320px] shrink-0 border-l border-slate-200/60 bg-[#F8F9FB]/50 flex flex-col h-full min-h-0 overflow-y-auto animate-in slide-in-from-right-8 duration-300">
            <div className="p-6 flex flex-col items-center border-b border-slate-200/60 text-center">
              <AvatarWithFallback name={selectedChat.name} src={selectedChat.avatar} size="w-24 h-24 mb-4 shadow-md ring-4 ring-white" />
              <h3 className="font-bold text-lg text-slate-900 leading-tight">{selectedChat.name}</h3>
              <p className="text-sm text-slate-500 mb-5">{selectedChat.statusText || 'Active now'}</p>
              
              <div className="flex gap-2 w-full">
                <Button variant="outline" className="flex-1 bg-background hover:bg-[var(--color-bg-alt)] shadow-sm" onClick={() => handleViewProfileForChat(selectedChat.id)}>
                  <User className="w-4 h-4 mr-1.5 text-slate-500" /> Profile
                </Button>
                <Button variant="outline" className="flex-1 bg-background hover:bg-[var(--color-bg-alt)] shadow-sm" onClick={() => handleMuteChat(selectedChat.id, isChatMuted(selectedChat) ? 'unmute' : 'always')}>
                  {isChatMuted(selectedChat) ? <Volume2 className="w-4 h-4 mr-1.5 text-emerald-500" /> : <VolumeX className="w-4 h-4 mr-1.5 text-slate-500" />}
                  {isChatMuted(selectedChat) ? 'Unmute' : 'Mute'}
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">About</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Frontend Engineer. Working on the new Antigravity UI components.
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Media & Links</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-square bg-slate-200 rounded-xl overflow-hidden group relative cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop" className="w-full h-full object-cover transition group-hover:scale-110" alt="Media" />
                  </div>
                  <div className="aspect-square bg-slate-200 rounded-xl overflow-hidden group relative cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&h=200&fit=crop" className="w-full h-full object-cover transition group-hover:scale-110" alt="Media" />
                  </div>
                  <div className="aspect-square bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-xs font-bold text-slate-500 hover:bg-slate-200 cursor-pointer transition">
                    12+
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* New Chat Modal using shadcn Dialog */}
      <Dialog open={showNewChatModal} onOpenChange={setShowNewChatModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>New Conversation</DialogTitle>
            <DialogDescription>Start a new chat with anyone in your workspace or organization.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateNewChat} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Contact Name</label>
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins"
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
                className="w-full p-3 bg-slate-50 rounded-xl text-xs border border-slate-200 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition shadow-2xs"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full py-2.5 font-bold">
              Start Conversation
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Profile Modal */}
      {mappedProfileModalUser && (
        <UserProfileModal
          isOpen={!!profileModalChat}
          onClose={() => setProfileModalChat(null)}
          profile={mappedProfileModalUser}
          subscriptionTier="free"
          onMessage={() => setProfileModalChat(null)}
          onAddFriend={() => setProfileModalChat(null)}
          onSendOpener={handleSendOpenerFromPrompt}
        />
      )}

      {/* SPEED PULSE DECK MODAL */}
      <SpeedPulseDeckModal
        isOpen={showSpeedPulseModal}
        onClose={() => setShowSpeedPulseModal(false)}
        profiles={filteredDiscoveryProfiles}
        onMatch={handleMatchProfile}
        onOpenFilter={() => setShowFilterModal(true)}
      />

      {/* CELEBRATION MATCH DIALOG */}
      <MatchCelebrationModal
        matchedProfile={matchedCelebrationProfile}
        onClose={() => setMatchedCelebrationProfile(null)}
        onStartChat={(profile: any) => {
          setSelectedChatId(profile.id);
          setMatchedCelebrationProfile(null);
          setShowSpeedPulseModal(false);
        }}
      />

      {/* COMPATIBILITY INTENT FILTER MODAL */}
      <IntentFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        selectedIntent={intentFilter}
        onSelectIntent={setIntentFilter}
      />

      {/* CUPID AI DATE SPOT CONCIERGE MODAL */}
      <AIDateConciergeModal
        isOpen={showAIDateModal}
        onClose={() => setShowAIDateModal(false)}
        selectedChat={selectedChat}
        onSendDateInvite={(inviteText: string) => {
          handleSendMessage(undefined, inviteText);
          setShowAIDateModal(false);
        }}
      />

      {/* SPEED VIDEO DATE ROOM MODAL */}
      <SpeedVideoDateModal
        isOpen={showSpeedVideoModal}
        onClose={() => setShowSpeedVideoModal(false)}
        selectedChat={selectedChat}
      />

      {/* SAFETY & VERIFICATION GUARDIAN MODAL */}
      <SafetyGuardianModal
        isOpen={showSafetyModal}
        onClose={() => setShowSafetyModal(false)}
        selectedChat={selectedChat}
      />

      {/* EXCLUSIVE LOCAL EVENT PASSES MODAL */}
      <LocalEventsModal
        isOpen={showLocalEventsModal}
        onClose={() => setShowLocalEventsModal(false)}
        selectedChat={selectedChat}
        onSendEventInvite={(inviteMessage) => {
          handleSendMessage(undefined, inviteMessage);
          setShowLocalEventsModal(false);
        }}
      />

      {/* LIVE DOUBLE DATE & GROUP HANGOUTS MODAL */}
      <GroupHangoutsModal
        isOpen={showGroupHangoutsModal}
        onClose={() => setShowGroupHangoutsModal(false)}
        selectedChat={selectedChat}
        onSendGroupInvite={(inviteMessage: string) => {
          handleSendMessage(undefined, inviteMessage);
          setShowGroupHangoutsModal(false);
        }}
      />
      {/* Image Lightbox Modal */}
      {activeLightboxUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActiveLightboxUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <div className="absolute -top-12 right-0 flex items-center gap-2">
              <a
                href={activeLightboxUrl}
                download="attachment"
                target="_blank"
                rel="noreferrer"
                className="text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer text-xs font-semibold flex items-center gap-1"
                title="Download full resolution"
              >
                Download
              </a>
              <button
                type="button"
                onClick={() => setActiveLightboxUrl(null)}
                className="text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <img src={activeLightboxUrl} alt="Preview" className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/10" />
          </div>
        </div>
      )}

      {/* Decoration & Theme Picker — positioned beside the card */}
      <DecorationPickerModal
        isOpen={showDecorationPicker && !!liveChatForDecorationPicker}
        onClose={() => {
          setShowDecorationPicker(false);
          setSelectedChatForDecoration(null);
        }}
        selectedChat={liveChatForDecorationPicker}
        tier={currentTier}
        onSubscriptionChange={(t) => setCurrentTier(t as SubscriptionTier)}
        onApplyDecoration={applyDecoration}
      />

    </TooltipProvider>
  );
}


