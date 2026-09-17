import type { UserStatus, UserProfileData } from '../user-profile-card/types';

export interface ServerItem {
  id: string;
  name: string;
  icon?: string;
  acronym?: string;
  unreadCount?: number;
  hasUnread?: boolean;
  isMentioned?: boolean;
  boostLevel?: number;
  folderId?: string;
}

export interface ServerFolder {
  id: string;
  name: string;
  color: string;
  serverIds: string[];
}

export interface VoiceParticipant {
  id: string;
  name: string;
  avatar: string;
  isMuted?: boolean;
  isDeafened?: boolean;
  isSpeaking?: boolean;
  isStreaming?: boolean;
}

export interface ChannelItem {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'announcement' | 'forum';
  unread?: boolean;
  mentionCount?: number;
  isLocked?: boolean;
  activeVoiceMembers?: VoiceParticipant[];
}

export interface ChannelCategory {
  id: string;
  name: string;
  channels: ChannelItem[];
}

export interface DirectMessageItem {
  id: string;
  userId: string;
  name: string;
  handle: string;
  avatar: string;
  status: UserStatus;
  customStatus?: string;
  customStatusEmoji?: string;
  unreadCount?: number;
  activityText?: string;
}

export interface ActiveVoiceConnection {
  serverId: string;
  serverName: string;
  channelId: string;
  channelName: string;
  pingMs: number;
  isConnected: boolean;
  isScreenSharing?: boolean;
  isVideoOn?: boolean;
}

export interface DiscordSidebarNavProps {
  profile: UserProfileData;
  onOpenSettings?: () => void;
  onSelectServer?: (serverId: string | null) => void;
  onSelectChannel?: (channelId: string) => void;
  onSelectDM?: (dmId: string) => void;
  className?: string;
}
