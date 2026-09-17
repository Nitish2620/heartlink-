import React, { useRef } from 'react';
import type { ChatItem } from './types';
import { isChatMuted } from './types';
import { AvatarWithFallback } from './avatar-with-fallback';
import { Pin, PinOff, VolumeX } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Badge } from './ui/badge';

const ChatRowItem = React.memo(({ 
  chat, 
  isSelected, 
  onSelect,
  onTogglePinChat,
  onContextMenu,
  chatOptionsRenderer
}: { 
  chat: ChatItem; 
  isSelected: boolean; 
  onSelect: (id: string) => void; 
  onTogglePinChat?: (id: string, e: React.MouseEvent) => void;
  onContextMenu?: (chat: ChatItem, e: React.MouseEvent) => void;
  chatOptionsRenderer?: (chat: ChatItem) => React.ReactNode;
}) => {
  const muted = isChatMuted(chat);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(chat.id)}
      onContextMenu={(e) => {
        if (onContextMenu) {
          e.preventDefault();
          onContextMenu(chat, e);
        }
      }}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(chat.id)}
      aria-label={`Chat with ${chat.name}`}
      data-state={isSelected ? "selected" : "idle"}
      className={`group h-full py-2.5 px-3 flex items-center gap-3 rounded-2xl cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 ${
        isSelected
          ? 'bg-purple-500/10 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-800/60 text-slate-900 dark:text-slate-100 shadow-2xs font-medium'
          : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
      }`}
    >
      {/* Avatar with Online Status & GIF Decoration Support */}
      <div className="relative shrink-0">
        <AvatarWithFallback 
          name={chat.name} 
          src={chat.avatar} 
          size="w-11 h-11" 
          decoration={chat.avatarDecoration}
          customDecorationUrl={chat.customDecorationUrl}
        />
        {chat.isOnline && (
          <span className="w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900 absolute bottom-0 right-0 z-10" />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className="font-bold text-xs sm:text-sm truncate flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            {chat.name}
            {chat.isPinned && (
              <Pin className="w-3.5 h-3.5 shrink-0 text-amber-500 fill-amber-500 group-hover:hidden" />
            )}
            {muted && (
              <span title={chat.muteDuration ? `Muted (${chat.muteDuration})` : "Notifications Muted"} className="shrink-0 flex items-center">
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              </span>
            )}
            {chat.isMatch && chat.expiresAt && (
              <span 
                className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold tracking-tight shrink-0 ${
                  (chat.expiresAt - Date.now()) < 3600000 * 6 
                    ? 'bg-rose-500/20 text-rose-600 border border-rose-500/40 animate-pulse' 
                    : 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                }`}
                title="72-Hour HeartPulse: Reply before match expires!"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                {Math.max(0, Math.ceil((chat.expiresAt - Date.now()) / (1000 * 3600)))}h
              </span>
            )}
          </span>

          <div className="flex items-center gap-1 shrink-0">

            
            {/* Shadcn UI Dropdown Menu Injection Point */}
            {chatOptionsRenderer && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                {chatOptionsRenderer(chat)}
              </div>
            )}

            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap ml-0.5">
              {chat.timestamp}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-normal leading-tight">
            {chat.lastMessage || <span className="italic text-slate-400 dark:text-slate-500">No messages yet</span>}
          </p>
          {!!chat.unreadCount && chat.unreadCount > 0 && (
            <Badge variant="default" className="text-[10px] font-bold h-4 min-w-[16px] px-1 bg-purple-600 text-white rounded-full flex items-center justify-center shrink-0">
              {chat.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
});

ChatRowItem.displayName = 'ChatRowItem';

export const VirtualizedSidebarList = React.memo(({
  chats,
  selectedChatId,
  onSelectChat,
  onTogglePinChat,
  onContextMenu,
  chatOptionsRenderer
}: {
  chats: ChatItem[];
  selectedChatId: string;
  onSelectChat: (id: string) => void;
  onTogglePinChat?: (id: string, e: React.MouseEvent) => void;
  onContextMenu?: (chat: ChatItem, e: React.MouseEvent) => void;
  chatOptionsRenderer?: (chat: ChatItem) => React.ReactNode;
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: chats.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 88, // 84px + 4px gap
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-full overflow-y-auto px-2 scrollbar-thin">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const chat = chats[virtualItem.index];
          if (!chat) return null;
          const isSelected = chat.id === selectedChatId;
          return (
            <div
              key={chat.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
                paddingBottom: '4px',
              }}
            >
              <ChatRowItem
                chat={chat}
                isSelected={isSelected}
                onSelect={onSelectChat}
                onTogglePinChat={onTogglePinChat}
                onContextMenu={onContextMenu}
                chatOptionsRenderer={chatOptionsRenderer}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

VirtualizedSidebarList.displayName = 'VirtualizedSidebarList';
