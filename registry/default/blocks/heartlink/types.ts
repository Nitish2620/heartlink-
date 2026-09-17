import type { UserProfileData } from '../user-profile-card/types';

export interface NitroCustomEmoji {
  id: string;
  name: string;
  url?: string;
  emoji: string;
  category: string;
  animated: boolean;
  isNitroOnly: boolean;
}

export interface NitroSoundClip {
  id: string;
  name: string;
  emoji: string;
  freq: number;
  isNitroOnly: boolean;
}

export type ChatThemeId = string;

export interface ChatTheme {
  id: ChatThemeId;
  name: string;
  background?: string;
  primary?: string;
  cardBg: string;
  gradient: string;
  textAccent: string;
  isNitroOnly: boolean;
}

export interface NitroSticker {
  id: string;
  name: string;
  url?: string;
  image: string;
  category: string;
  isNitroOnly: boolean;
}

export interface VoiceNote {
  duration: string;
  waveform: number[];
}


export type AvatarDecoration = 
  | 'none' 
  | 'crown' 
  | 'neon' 
  | 'sparkle' 
  | 'flame' 
  | 'diamond' 
  | 'sakura' 
  | 'matrix'
  | 'solar_flare'
  | 'galaxy_warp'
  | 'holographic_glitch'
  | 'anime_power_aura'
  | 'cyber_hacker_void'
  | 'celestial_orbit'
  | 'phoenix_flame'
  | 'custom_gif';

export type SubscriptionTier = 'free' | 'nitro_basic' | 'nitro_pro';

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
  isSuperReaction?: boolean;
}

export interface MessageAttachment {
  name: string;
  url: string;
  type: 'image' | 'file';
  size?: string;
  isNitroClip?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMe?: boolean;
  isEdited?: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  reactions?: MessageReaction[];
  attachment?: MessageAttachment;
  isNitroClip?: boolean;
  soundClip?: NitroSoundClip;
  sticker?: NitroSticker;
  voiceNote?: VoiceNote;
  isNitroSuperReaction?: boolean;
  nitroCustomEmoji?: string;
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  isPinnedInThread?: boolean;
}

export interface JumpTarget {
  msgId: string;
  index: number;
  jumpKey: number;
  source?: 'pinned' | 'search';
}

export interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  animatedAvatar?: string;
  avatarDecoration?: AvatarDecoration;
  customDecorationUrl?: string;
  customThemeUrl?: string;
  customThemeAngle?: number;
  customThemePattern?: 'none' | 'dots' | 'grid' | 'mesh';
  draftText?: string;
  folder?: 'all' | 'work' | 'personal' | 'vip' | 'archive';
  isMuted?: boolean;
  muteDuration?: string;
  mutedUntil?: number;
  lastMessage: string;
  timestamp: string;
  lastUpdated?: number;
  unreadCount?: number;
  isOnline?: boolean;
  isPinned?: boolean;
  isBlocked?: boolean;
  isNitroSubscriber?: boolean;
  statusText?: string;
  customStatusEmoji?: string;
  nitroTier?: SubscriptionTier;
  nameGradient?: string;
  isMatch?: boolean;
  matchedAt?: number;
  expiresAt?: number;
  pulseExtended?: boolean;
  messages: Message[];
}

export interface ChatListCardProps {
  title?: string;
  chats?: ChatItem[];
  subscriptionTier?: SubscriptionTier;
  profile?: UserProfileData;
  uiVariant?: 'modern_studio' | 'classic_dark';
  onSelectChat?: (chat: ChatItem) => void;
  onNewChat?: () => void;
  onSelectSubscription?: (tier: SubscriptionTier) => void;
  onToggleReaction?: (msgId: string, emoji: string) => void;
  onReplyMessage?: (msg: Message) => void;
  onEditMessage?: (msg: Message) => void;
  onForwardMessage?: (msg: Message) => void;
  onPinMessage?: (msg: Message) => void;
  onDeleteMessage?: (msgId: string) => void;
  onSubscriptionChange?: (tier: SubscriptionTier) => void;
  instanceId?: string;
}

export function isChatMuted(chat: ChatItem): boolean {
  if (!chat.isMuted) return false;
  if (!chat.mutedUntil) return true; // Always muted
  return Date.now() < chat.mutedUntil;
}



export interface DateSpot {
  name: string;
  category: string;
  location: string;
  price: string;
  image?: string;
  introQuote?: string;
}

export interface DoubleDateGroup {
  title: string;
  vibe: string;
  time: string;
  location: string;
  filledSpots: number;
  maxSpots: number;
  hosts: { name: string; avatar: string }[];
  description: string;
}

export interface HeartLinkDatingPostProps {
  postId?: string;
  authorDetails?: {
    name: string;
    age: number;
    avatar: string;
    location: string;
    distance: string;
    verified?: boolean;
    intent?: 'Long-term relationship' | 'Deep connection' | 'Spontaneous fun';
  };
  promptAnswer?: {
    question: string;
    answer: string;
    category?: string;
  };
  dateSpot?: DateSpot;
  doubleDateGroup?: DoubleDateGroup;
  images?: string[];
  voiceNoteUrl?: string;
  voiceDuration?: string;
  voiceWaveform?: number[];
  
  onSendOpener?: (authorName: string, promptText: string) => void;
  onProposeDate?: (dateSpotName: string, location: string) => void;
  onJoinGroup?: (groupTitle: string) => void;
}


export interface SpeedDiscoveryProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  distance: string;
  avatar: string;
  bio: string;
  promptQuestion: string;
  promptAnswer: string;
  matchScore: number;
  intent: 'Long-term relationship' | 'Deep connection' | 'Spontaneous fun';
}
