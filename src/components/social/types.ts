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
  replies?: Comment[];
}

export interface SocialPostProps {
  author?: {
    name: string;
    avatar: string;
    location: string;
    verified?: boolean;
  };
  timestamp?: string;
  privacy?: 'public' | 'friends' | 'only_me';
  content?: string;
  hashtags?: string[];
  images?: string[];
  initialLikes?: number;
  initialSharesCount?: number;
  initialViews?: number;
  initialComments?: Comment[];
}
