export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'fire';

export interface ReactionConfig {
  type: ReactionType;
  label: string;
  emoji: string;
  color: string;
  bg: string;
}

export const REACTIONS: ReactionConfig[] = [
  { type: 'like', label: 'Like', emoji: '👍', color: 'text-blue-500', bg: 'bg-blue-50 /50' },
  { type: 'love', label: 'Love', emoji: '❤️', color: 'text-rose-500', bg: 'bg-rose-50 /50' },
  { type: 'fire', label: 'Fire', emoji: '🔥', color: 'text-amber-500', bg: 'bg-amber-50 /50' },
  { type: 'haha', label: 'Haha', emoji: '😆', color: 'text-yellow-500', bg: 'bg-yellow-50 /50' },
  { type: 'wow', label: 'Wow', emoji: '😮', color: 'text-purple-500', bg: 'bg-purple-50 /50' },
  { type: 'sad', label: 'Sad', emoji: '😢', color: 'text-sky-500', bg: 'bg-sky-50 /50' },
];

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollData {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVotedOptionId?: string;
  expiresIn?: string;
}

export interface ReactionUser {
  id: string;
  name: string;
  avatar: string;
  reaction: ReactionType;
  badge?: string;
}

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    badge?: string;
  };
  timestamp: string;
  text: string;
  likes: number;
  isLiked?: boolean;
  isPinned?: boolean;
  hasVoiceNote?: boolean;
  voiceDuration?: string;
  isEdited?: boolean;
  isAuthor?: boolean;
  reactions?: Record<string, number>;
  media?: string;
  replies?: Comment[];
}

export interface PostAnalytics {
  views: number;
  impressionsFeed: number;
  impressionsSearch: number;
  impressionsDirect: number;
  engagementRate: number;
  clicks: number;
}

export interface LinkPreviewData {
  url: string;
  title: string;
  description: string;
  image?: string;
  domain?: string;
}

import type { UserProfileData } from '../user-profile-card/types';



export interface SocialPostProps {
  postId?: string;
  author?: {
    name: string;
    avatar: string;
    location: string;
    verified?: boolean;
  };
  timestamp?: string;
  privacy?: 'public' | 'friends' | 'only_me';
  content?: string;
  translatedContent?: string;
  hashtags?: string[];
  images?: string[];
  videoUrl?: string;
  poll?: PollData;
  initialLikes?: number;
  initialSharesCount?: number;
  initialViews?: number;
  initialComments?: Comment[];
  analytics?: PostAnalytics;

  profile?: UserProfileData;

  // HeartLink Dating & Vibe Feed Extensions
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
  dateSpot?: {
    name: string;
    category: string;
    location: string;
    price: string;
    image?: string;
    introQuote?: string;
  };
  doubleDateGroup?: {
    title: string;
    vibe: string;
    time: string;
    location: string;
    filledSpots: number;
    maxSpots: number;
    hosts: { name: string; avatar: string }[];
    description: string;
  };
  voiceNoteUrl?: string;
  voiceDuration?: string;
  voiceWaveform?: number[];
  onSendOpener?: (authorName: string, promptText: string) => void;
  onProposeDate?: (dateSpotName: string, location: string) => void;
  onJoinGroup?: (groupTitle: string) => void;
}
