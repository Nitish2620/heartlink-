export type AvatarDecoration = 
  | 'none' 
  | 'sakura' 
  | 'autumn_leaves' 
  | 'snowfall' 
  | 'stardust';

export type BannerEffect = 
  | 'none' 
  | 'sakura_moonlight' 
  | 'autumn_sunset' 
  | 'winter_night' 
  | 'starry_galaxy';

export type ProfileEffect = 
  | 'none' 
  | 'sakura_breeze'
  | 'autumn_breeze'
  | 'winter_blizzard'
  | 'cosmic_stardust';

export type ProfileTheme = 'blurple' | 'nitro_pink' | 'cyber_emerald' | 'solar_gold' | 'midnight_obsidian' | 'synthwave_neon' | 'custom_hex';

export type UserStatus = 'online' | 'idle' | 'dnd' | 'offline';

export type NitroLevel = 'none' | 'level1' | 'level2' | 'level3';

export type SubscriptionTier = 'free' | 'nitro_basic' | 'nitro_pro';

export type ProfileTab = 
  | 'posts' 
  | 'activity' 
  | 'mutual_servers' 
  | 'mutual_friends' 
  | 'media' 
  | 'collectibles' 
  | 'soundboard' 
  | 'subscription' 
  | 'server_preview';

export type ProfileContext = 'global' | 'server';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: string;
  period: string;
  badge: string;
  color: string;
  features: string[];
  recommended?: boolean;
}

export interface ProfileBadge {
  id: string;
  name: string;
  iconName: string;
  color: string;
  description: string;
  animatedGradient?: boolean;
}

export interface ServerRole {
  id: string;
  name: string;
  colorGradient: string;
  animated: boolean;
}

export interface SpotifyPresence {
  song: string;
  artist: string;
  albumArt: string;
  durationSeconds: number;
  currentSeconds: number;
  isPlaying: boolean;
}

export interface GamePresence {
  name: string;
  details: string;
  state: string;
  icon: string;
  elapsedTime: string;
  partySize?: string;
}

export interface MutualServer {
  id: string;
  name: string;
  icon: string;
  memberCount: number;
  joinedDate: string;
  mutualFriendsCount: number;
}

export interface MutualFriend {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  status: UserStatus;
  customStatus?: string;
}

export interface ConnectedAccount {
  id: string;
  platform: 'github' | 'twitter' | 'spotify' | 'twitch' | 'youtube' | 'steam';
  name: string;
  url: string;
}

export interface UserProfileStats {
  followers: number;
  likes: number;
  mediaCount: number;
  postsCount: number;
  boostCount: number;
  nextLevelBoosts: number;
}

export interface PostItem {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  mediaUrl?: string;
  isNitroClip?: boolean;
}

export interface NitroSound {
  id: string;
  name: string;
  emoji: string;
  freq: number;
  category: 'Meme' | 'Gaming' | 'Nitro Special';
  lockedForFree?: boolean;
}

export interface NitroSticker {
  id: string;
  name: string;
  emoji: string;
  rarity: 'Common' | 'Rare' | 'Legendary' | 'Nitro Exclusive';
  animated?: boolean;
}

export interface ProfilePrompt {
  id: string;
  question: string;
  answer: string;
  category?: 'lifestyle' | 'dating' | 'humor' | 'ambition';
  likesCount?: number;
}

export interface UserProfileData {
  name: string;
  handle: string;
  verified?: boolean;
  userStatus: UserStatus;
  avatar: string;
  animatedAvatar?: string;
  banner: string;
  animatedBanner?: string;
  bio: string;
  pronouns?: string;
  joinedDiscordDate?: string;
  joinedServerDate?: string;
  location?: string;
  customStatus?: string;
  customStatusEmoji?: string;
  vanityUrl?: string;
  themeColor: string;
  customThemeColor?: string;
  profileTheme: ProfileTheme;
  avatarDecoration: AvatarDecoration;
  bannerEffect: BannerEffect;
  profileEffect: ProfileEffect;
  nitroLevel: NitroLevel;
  subscriptionTier: SubscriptionTier;
  badges: ProfileBadge[];
  stats: UserProfileStats;
  spotifyPresence?: SpotifyPresence;
  gamePresence?: GamePresence;
  mutualServers?: MutualServer[];
  mutualFriends?: MutualFriend[];
  connectedAccounts?: ConnectedAccount[];
  prompts?: ProfilePrompt[];
  // Server-Specific Profile Overrides
  serverName?: string;
  serverIcon?: string;
  animatedServerIcon?: string;
  serverAvatar?: string;
  serverBanner?: string;
  animatedServerBanner?: string;
  serverNickname?: string;
  serverRoles?: ServerRole[];
}

export interface UserProfileCardProps {
  initialProfile?: UserProfileData;
  onUpdateProfile?: (updated: UserProfileData) => void;
  onOpenSettings?: () => void;
}
