import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Message, JumpTarget } from './types';
import { AvatarWithFallback } from './avatar-with-fallback';
import { SmilePlus, CheckCheck, FileText, Play, Pause, Volume2, Copy, Check, ArrowDown, Reply, Pin, PinOff, ThumbsUp, Heart, Smile, Frown, Flame, CheckCircle, XCircle, MoreHorizontal, MoreVertical, Trash2, Forward, Sparkles, Ticket, Users } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from './ui/dropdown-menu';
import { TwemojiImg } from './twemoji-picker';
const REACTION_ICONS = ['👍', '❤️', '😂', '😮', '😢'];

// Bug 4 fix: Use React-native <img> rendering instead of DOM-mutating twemoji.parse()
// This prevents React reconciliation errors (NotFoundError) from DOM tree mismatches.
const TwemojiEmoji = React.memo(({ emoji, size = 18 }: { emoji: string; size?: number }) => (
  <TwemojiImg emoji={emoji} size={size} />
));
TwemojiEmoji.displayName = 'TwemojiEmoji';

// Perf 1: Hoist DOMParser to module scope — avoid allocating per message render
const _domParser = new DOMParser();

// Sec 2 + Perf 5: Safe HTML renderer that preserves links but strips dangerous attributes
const SAFE_TAGS = /^(b|i|s|u|em|strong|code|br|span|a)$/i;
const SAFE_ATTRS: Record<string, string[]> = { a: ['href', 'target', 'rel'] };

function renderSafeHtml(html: string): React.ReactNode {
  if (!html) return null;
  const cleanHtml = html
    .replace(/&lt;(\/?(?:b|i|s|u|em|strong|code|br|span|a)[^&]*)&gt;/gi, '<$1>');

  const doc = _domParser.parseFromString(cleanHtml, 'text/html');
  
  function walk(node: Node): React.ReactNode {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent;
    if (node.nodeType !== Node.ELEMENT_NODE) return null;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    if (tag === 'br') return React.createElement('br');
    const children = Array.from(el.childNodes).map((child, i) => {
      const result = walk(child);
      return result !== null ? <React.Fragment key={i}>{result}</React.Fragment> : null;
    });
    if (SAFE_TAGS.test(tag)) {
      // Build safe props: only allow whitelisted attributes per tag
      const props: Record<string, string> = {};
      const allowed = SAFE_ATTRS[tag];
      if (allowed) {
        for (const attr of allowed) {
          const val = el.getAttribute(attr);
          if (val !== null) {
            // Sec 2: Block javascript: and data: URLs
            if (attr === 'href') {
              const lower = val.trim().toLowerCase();
              if (lower.startsWith('javascript:') || lower.startsWith('data:')) continue;
            }
            props[attr] = val;
          }
        }
        // Force safe link behavior
        if (tag === 'a') {
          props.target = '_blank';
          props.rel = 'noopener noreferrer';
        }
      }
      return React.createElement(tag, Object.keys(props).length > 0 ? props : null, ...children);
    }
    return <>{children}</>;
  }
  
  const children = Array.from(doc.body.childNodes).map((child, i) => {
    const result = walk(child);
    return result !== null ? <React.Fragment key={i}>{result}</React.Fragment> : null;
  });
  return <>{children}</>;
}

function highlightMatches(text: string, query?: string): React.ReactNode {
  if (!query || !query.trim()) return renderSafeHtml(text);
  const safeNode = renderSafeHtml(text);
  const q = query.trim().toLowerCase();
  
  function applyHighlight(node: React.ReactNode): React.ReactNode {
    if (typeof node === 'string') {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const parts = node.split(new RegExp(`(${escaped})`, 'gi'));
      if (parts.length === 1) return node;
      return parts.map((part, idx) => 
        part.toLowerCase() === q ? (
          <mark key={idx} className="bg-amber-200 text-amber-950 font-bold px-0.5 rounded shadow-2xs">
            {part}
          </mark>
        ) : (
          part
        )
      );
    }
    if (React.isValidElement(node) && node.props && (node.props as any).children) {
      const children = React.Children.map((node.props as any).children, applyHighlight);
      return React.cloneElement(node, {}, children);
    }
    return node;
  }
  
  return applyHighlight(safeNode);
}

interface ParsedDatingCard {
  type: 'date_invite' | 'event_pass' | 'group_invite' | 'prompt_opener' | 'none';
  title?: string;
  subtitle?: string;
  quote?: string;
  rawRest?: string;
}

function parseDatingMessage(text: string): ParsedDatingCard {
  if (!text) return { type: 'none' };
  
  if (text.startsWith('🥂 Date Proposal:') || text.startsWith('🥂 Date Invite:')) {
    const lines = text.split('\n');
    const title = lines[0].replace(/🥂 Date (Proposal|Invite):\s*/, '').trim();
    const subtitle = lines[1] || '';
    const quote = lines[2] || '';
    return { type: 'date_invite', title, subtitle, quote };
  }
  
  if (text.startsWith('🎟️ Joint Event Pass:') || text.startsWith('🎟️ Joint RSVP Invite:')) {
    const lines = text.split('\n');
    const title = lines[0].replace(/🎟️ Joint (Event Pass|RSVP Invite):\s*/, '').trim();
    const subtitle = lines[1] || '';
    const quote = lines[2] || '';
    return { type: 'event_pass', title, subtitle, quote };
  }
  
  if (text.startsWith('👯 Double Date & Group Hangout:') || text.startsWith('👯 Double Date & Group Invite:')) {
    const lines = text.split('\n');
    const title = lines[0].replace(/👯 Double Date & Group (Hangout|Invite):\s*/, '').trim();
    const subtitle = lines[1] || '';
    const quote = lines[2] || '';
    return { type: 'group_invite', title, subtitle, quote };
  }
  
  if (text.startsWith('✨ Replying to prompt:') || text.startsWith('✨ Replying to feed post:')) {
    const cleanText = text.replace(/^✨ Replying to (?:prompt|feed post):\s*/, '');
    const parts = cleanText.split('→');
    if (parts.length >= 2) {
      const q = parts[0].trim().replace(/^"/, '').replace(/"$/, '');
      const a = parts[1].trim().replace(/^"/, '').replace(/"$/, '');
      const rest = parts.slice(2).join('→').trim();
      return { type: 'prompt_opener', title: q, quote: a, rawRest: rest };
    }
    return { type: 'prompt_opener', title: cleanText, quote: '', rawRest: '' };
  }

  return { type: 'none' };
}

function cleanQuotedText(text?: string): string {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, ' ')
    .replace(/&lt;[^&]*&gt;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 p-3 sm:p-4 shadow-sm bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-700/50 w-fit">
    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
  </div>
);

const MessageBubble = React.memo(({
  msg,
  selectedChatName,
  selectedChatAvatar,
  onToggleReaction,
  onReplyMessage,

  onForwardMessage,
  onPinMessage,
  onOpenImage,
  searchQuery,
  isPlayingVoice,
  onToggleVoicePlay,
  isHighlighted,
  onDeleteMessage
}: {
  msg: Message;
  selectedChatName?: string;
  selectedChatAvatar?: string;
  onToggleReaction: (msgId: string, emoji: string) => void;
  onReplyMessage?: (msg: Message) => void;

  onForwardMessage?: (msg: Message) => void;
  onPinMessage?: (msg: Message) => void;
  onOpenImage?: (url: string) => void;
  searchQuery?: string;
  isPlayingVoice?: boolean;
  onToggleVoicePlay?: (msgId: string) => void;
  isHighlighted?: boolean;
  onDeleteMessage?: (msgId: string) => void;
}) => {
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const onTogglePin = onPinMessage;
  const onCopyText = (text?: string) => {
    if (text) navigator.clipboard.writeText(text);
  };


  const HoverMenu = (
    <div className={`flex-none w-7 self-stretch transition-all duration-150 relative ${isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100'}`}>
      <div className="sticky top-2 z-20 flex flex-col items-center pt-2">
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className={`p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-md shadow-sm border border-slate-200/50 dark:border-slate-700/50 ${isMenuOpen ? 'bg-white shadow-md' : ''}`}
          aria-label="Message options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align={msg.isMe ? "end" : "start"} className="w-52 p-0 rounded-xl overflow-hidden shadow-lg border-slate-200 dark:border-slate-700">
        {/* MNC-Grade Quick Reactions Strip */}
        <div className="flex items-center justify-between p-1.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700/80">
          {REACTION_ICONS.slice(0, 5).map(icon => (
            <button
              key={icon}
              type="button"
              onClick={() => {
                onToggleReaction(msg.id, icon);
                setIsMenuOpen(false);
              }}
              className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md hover:scale-110 transition-all hover:shadow-sm flex items-center justify-center"
              title={icon}
            >
              <TwemojiEmoji emoji={icon} size={20} />
            </button>
          ))}
        </div>
        <div className="p-1 flex flex-col gap-0.5">
          <DropdownMenuItem onClick={() => onReplyMessage?.(msg)} className="text-[13px] py-1.5 cursor-pointer font-medium hover:bg-slate-100 rounded-md">
            <span className="w-4 h-4 mr-2 flex items-center justify-center"><Reply className="w-3.5 h-3.5 text-slate-500" /></span>
            <span>Reply in Thread</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onForwardMessage?.(msg)} className="text-[13px] py-1.5 cursor-pointer font-medium hover:bg-slate-100 rounded-md">
            <span className="w-4 h-4 mr-2 flex items-center justify-center"><Forward className="w-3.5 h-3.5 text-slate-500" /></span>
            <span>Forward</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTogglePin?.(msg)} className="text-[13px] py-1.5 cursor-pointer font-medium hover:bg-slate-100 rounded-md">
            <span className="w-4 h-4 mr-2 flex items-center justify-center">{msg.isPinnedInThread ? <PinOff className="w-3.5 h-3.5 text-amber-500" /> : <Pin className="w-3.5 h-3.5 text-slate-500" />}</span>
            <span>{msg.isPinnedInThread ? 'Unpin Message' : 'Pin Message'}</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-slate-100 my-1" />
          
          {msg.text && (
            <DropdownMenuItem onClick={() => onCopyText(msg.text)} className="text-[13px] py-1.5 cursor-pointer font-medium hover:bg-slate-100 rounded-md">
              <span className="w-4 h-4 mr-2 flex items-center justify-center"><Copy className="w-3.5 h-3.5 text-slate-500" /></span>
              <span>Copy Text</span>
            </DropdownMenuItem>
          )}
          
          {msg.isMe && (
            <DropdownMenuItem onClick={() => onDeleteMessage?.(msg.id)} className="text-[13px] py-1.5 cursor-pointer text-red-600 focus:text-red-700 font-medium hover:bg-red-50 focus:bg-red-50 rounded-md">
              <span className="w-4 h-4 mr-2 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5 text-red-500" /></span>
              <span>Delete Message</span>
            </DropdownMenuItem>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
    </div>
  );

  const datingCard = useMemo(() => parseDatingMessage(msg.text), [msg.text]);

  return (
    <div ref={bubbleRef} className={`flex flex-row ${msg.isMe ? 'justify-end' : 'justify-start'} items-end animate-in fade-in duration-200 group relative w-full gap-2.5 my-2 px-4 sm:px-6`}>
      {!msg.isMe && (
        <AvatarWithFallback name={selectedChatName || 'User'} src={selectedChatAvatar} size="w-8 h-8 mb-6" />
      )}
      {msg.isMe && HoverMenu}
      <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} max-w-[80%] sm:max-w-[65%] min-w-0`}>
        <div className={`relative group w-fit max-w-full ${msg.isMe ? 'ml-auto' : 'mr-auto'}`}>
          <div 
            className={`px-4 py-3 text-[13px] leading-relaxed shadow-2xs relative transition-all duration-300 rounded-2xl ${
            isHighlighted
              ? 'ring-2 ring-amber-500 border-amber-400 bg-amber-50 dark:bg-amber-900/30 shadow-md z-30'
              : msg.isPinnedInThread ? 'ring-2 ring-amber-400/80 dark:ring-amber-500/50 shadow-md' : ''
          } ${
            msg.isMe
              ? 'bg-[#7C3AED] text-white font-normal rounded-tr-xs shadow-xs'
              : 'bg-[#F0F2F6] dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200/40 dark:border-slate-700/40'
          }`}
        >

          {/* RICH HEARTHLINK DATING CARDS */}
          {datingCard.type === 'date_invite' && (
            <div className={`mb-2 p-3 rounded-2xl border ${msg.isMe ? 'bg-amber-950/40 border-amber-500/40 text-amber-100' : 'bg-gradient-to-r from-amber-50 to-rose-50 dark:bg-slate-900 border-amber-300 dark:border-amber-700 text-slate-900 dark:text-slate-100'}`}>
              <div className="flex items-center gap-1.5 mb-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Cupid AI Date Invitation</span>
              </div>
              <h4 className="font-extrabold text-xs">{datingCard.title}</h4>
              {datingCard.subtitle && <p className="text-[11px] opacity-90 font-medium">{datingCard.subtitle}</p>}
              {datingCard.quote && <p className="text-[10px] opacity-80 italic mt-1">{datingCard.quote}</p>}
            </div>
          )}

          {datingCard.type === 'event_pass' && (
            <div className={`mb-2 p-3 rounded-2xl border ${msg.isMe ? 'bg-purple-950/40 border-purple-500/40 text-purple-100' : 'bg-gradient-to-r from-purple-50 to-rose-50 dark:bg-slate-900 border-purple-300 dark:border-purple-700 text-slate-900 dark:text-slate-100'}`}>
              <div className="flex items-center gap-1.5 mb-1 text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                <Ticket className="w-3.5 h-3.5 text-purple-500" />
                <span>Joint Event Pass Stub</span>
              </div>
              <h4 className="font-extrabold text-xs">{datingCard.title}</h4>
              {datingCard.subtitle && <p className="text-[11px] opacity-90 font-medium">{datingCard.subtitle}</p>}
              {datingCard.quote && <p className="text-[10px] opacity-80 italic mt-1">{datingCard.quote}</p>}
            </div>
          )}

          {datingCard.type === 'group_invite' && (
            <div className={`mb-2 p-3 rounded-2xl border ${msg.isMe ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-100' : 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:bg-slate-900 border-indigo-300 dark:border-indigo-700 text-slate-900 dark:text-slate-100'}`}>
              <div className="flex items-center gap-1.5 mb-1 text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                <span>Double Date Group Invite</span>
              </div>
              <h4 className="font-extrabold text-xs">{datingCard.title}</h4>
              {datingCard.subtitle && <p className="text-[11px] opacity-90 font-medium">{datingCard.subtitle}</p>}
              {datingCard.quote && <p className="text-[10px] opacity-80 italic mt-1">{datingCard.quote}</p>}
            </div>
          )}

          {datingCard.type === 'prompt_opener' && (
            <div className={`mb-2 p-2.5 rounded-xl border-l-3 text-xs ${msg.isMe ? 'bg-white/15 border-amber-300 text-white' : 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-slate-800 dark:text-slate-200'}`}>
              <span className="font-extrabold block text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400">✨ Replying to Prompt</span>
              <span className="line-clamp-2 font-semibold italic text-[11px]">"{datingCard.title}" {datingCard.quote ? `→ "${datingCard.quote}"` : ''}</span>
            </div>
          )}

          {/* Quoted Reply Preview */}
          {msg.replyTo && (
            <div className={`mb-2 p-2 rounded-xl border-l-3 text-xs ${msg.isMe ? 'bg-white/15 border-white/80 text-white' : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-slate-800 dark:text-slate-200'}`}>
              <span className={`font-bold block text-[10px] uppercase tracking-wider ${msg.isMe ? 'text-indigo-100' : 'text-indigo-700 dark:text-indigo-300'}`}>{msg.replyTo.senderName}</span>
              <span className="line-clamp-1 opacity-90 text-[11px]">{cleanQuotedText(msg.replyTo.text)}</span>
            </div>
          )}

          {msg.attachment && (
            <div className="mb-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              {msg.attachment.type === 'image' ? (
                <img 
                  src={msg.attachment.url} 
                  alt={msg.attachment.name} 
                  onClick={() => onOpenImage?.(msg.attachment!.url)}
                  className="max-h-48 w-full object-cover rounded-lg cursor-zoom-in hover:opacity-95 transition" 
                />
              ) : (
                <div className={`flex items-center gap-2 p-2 rounded-lg text-xs font-semibold ${msg.isMe ? 'bg-white/15 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}>
                  <FileText className="w-4 h-4 shrink-0 text-purple-600 dark:text-purple-400" />
                  <span className="truncate">{msg.attachment.name}</span>
                  {msg.attachment.size && <span className="text-[10px] opacity-75 shrink-0">({msg.attachment.size})</span>}
                </div>
              )}
            </div>
          )}

          {msg.soundClip && (
            <div className="mb-2 p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between gap-3 text-xs font-bold text-purple-200">
              <div className="flex items-center gap-2">
                <span className="text-xl animate-bounce">{msg.soundClip.emoji}</span>
                <div>
                  <div className="text-purple-100 font-bold">{msg.soundClip.name}</div>
                  <span className="text-[9px] text-purple-400 font-mono">Soundboard Clip</span>
                </div>
              </div>
              <Volume2 className="w-4 h-4 text-purple-400 shrink-0" />
            </div>
          )}

          {msg.sticker && (
            <div className="mb-2 p-2 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex flex-col items-center">
              <img src={msg.sticker.image} alt={msg.sticker.name} className="w-24 h-24 object-cover rounded-xl shadow-lg animate-pulse" />
              <span className="text-[10px] font-extrabold text-purple-400 mt-1">{msg.sticker.name}</span>
            </div>
          )}

          {msg.voiceNote && (
            <div className={`mb-2 p-3 rounded-2xl flex items-center gap-3 w-56 shadow-2xs border ${msg.isMe ? 'bg-white/15 border-white/20 text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'}`}>
              <button
                type="button"
                onClick={() => onToggleVoicePlay?.(msg.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 cursor-pointer shadow-md ${msg.isMe ? 'bg-white text-purple-600 hover:bg-slate-100' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
              >
                {isPlayingVoice ? <Pause className="w-4 h-4 fill-current ml-0.5 animate-pulse" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              <div className="flex-1 space-y-1">
                <div className="flex items-end gap-1 h-5 px-1">
                  {msg.voiceNote.waveform.map((h, i) => (
                    <span
                      key={i}
                      style={{
                        height: `${isPlayingVoice ? Math.min(100, Math.max(25, h + (i % 2 === 0 ? 30 : -20))) : h}%`,
                      }}
                      className={`w-1 rounded-full transition-all duration-150 ${msg.isMe ? 'bg-white' : isPlayingVoice ? 'bg-purple-600 animate-pulse' : 'bg-purple-500'}`}
                    />
                  ))}
                </div>
                <div className={`flex justify-between text-[9px] font-mono font-semibold ${msg.isMe ? 'text-white/80' : 'text-purple-600 dark:text-purple-400'}`}>
                  <span>{isPlayingVoice ? 'Playing...' : 'Voice Note'}</span>
                  <span>{msg.voiceNote.duration}</span>
                </div>
              </div>
            </div>
          )}

          {datingCard.type === 'none' && (
            <p className="leading-relaxed break-words [word-break:break-word] text-xs sm:text-sm">
              <span>{highlightMatches(msg.text, searchQuery)}</span>
              {msg.nitroCustomEmoji && <span className="inline-block align-middle ml-1"><TwemojiEmoji emoji={msg.nitroCustomEmoji} size={20} /></span>}
            </p>
          )}

          {datingCard.type === 'prompt_opener' && datingCard.rawRest && (
            <p className="leading-relaxed break-words [word-break:break-word] text-xs sm:text-sm mt-1">
              <span>{highlightMatches(datingCard.rawRest, searchQuery)}</span>
            </p>
          )}

        </div>

        {msg.reactions && msg.reactions.length > 0 && (
          <div className={`flex flex-wrap items-center gap-1.5 mt-1.5 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
            {msg.reactions.map(r => (
              <button
                key={r.emoji}
                type="button"
                onClick={() => onToggleReaction(msg.id, r.emoji)}
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 transition cursor-pointer shadow-2xs ${
                  r.users.includes('me')
                    ? 'bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-100 font-bold'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                <TwemojiEmoji emoji={r.emoji} size={14} />
                <span>{r.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={`flex items-center gap-1.5 mt-1 text-[11px] text-slate-400 dark:text-slate-500 font-medium px-1 select-none ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
        {msg.isPinnedInThread && (
          <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-500 font-bold bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded-full border border-amber-200/80 dark:border-amber-700/50 shadow-2xs">
            <Pin className="w-2.5 h-2.5 fill-amber-500" />
            <span>Pinned</span>
          </span>
        )}
        <span>{msg.timestamp}</span>
        {msg.isEdited && <span className="italic text-slate-400">(edited)</span>}
        {msg.isMe && (
          <span className="flex items-center ml-0.5">
            {msg.status === 'read' && <CheckCheck className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />}
            {msg.status === 'delivered' && <CheckCheck className="w-3.5 h-3.5 text-slate-400" />}
            {(msg.status === 'sent' || !msg.status) && <Check className="w-3.5 h-3.5 text-slate-400" />}
          </span>
        )}
      </div>
      </div>
      {!msg.isMe && HoverMenu}
    </div>
  );
});
MessageBubble.displayName = 'MessageBubble';

interface VirtualizedMessageStreamProps {
  messages: Message[];
  isTyping: boolean;
  isAITyping?: boolean;
  selectedChatId: string;
  selectedChatName: string;
  selectedChatAvatar: string;
  onToggleReaction: (msgId: string, emoji: string) => void;
  onSendQuickMessage?: (text: string) => void;
  onReplyMessage?: (msg: Message) => void;

  onForwardMessage?: (msg: Message) => void;
  onPinMessage?: (msg: Message) => void;
  onDeleteMessage?: (msgId: string) => void;
  onOpenImage?: (url: string) => void;
  searchQuery?: string;
  jumpTarget?: JumpTarget | null;
  targetScrollIndex?: number | null;
  messageCount?: number;
  chatListVersion?: number;
}

export const VirtualizedMessageStream = React.memo(({
  messages,
  isTyping,
  isAITyping,
  selectedChatId,
  selectedChatName,
  selectedChatAvatar,
  onToggleReaction,
  onSendQuickMessage,
  onReplyMessage,

  onForwardMessage,
  onPinMessage,
  onDeleteMessage,
  onOpenImage,
  searchQuery,
  jumpTarget,
  targetScrollIndex,
  messageCount,
  chatListVersion
}: VirtualizedMessageStreamProps) => {

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // Bug 3 fix: Stable callback reference to prevent defeating React.memo on MessageBubble
  const handleToggleVoicePlay = useCallback((id: string) => {
    setPlayingVoiceId(prev => prev === id ? null : id);
  }, []);

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 80,
    overscan: 10,
  });

  const [autoScroll, setAutoScroll] = useState(true);
  const [highlightedMsgId, setHighlightedMsgId] = useState<string | null>(null);
  const prevMessagesLengthRef = useRef(messages.length);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Jump to target message & highlight with MNC precision
  useEffect(() => {
    if (!jumpTarget || jumpTarget.index === undefined || jumpTarget.index === null || jumpTarget.index < 0 || jumpTarget.index >= messages.length) {
      return;
    }

    // 1. Disable autoScroll mode so bottom autoScroll won't pull the view back
    setAutoScroll(false);

    // 2. Set highlight on target message ID
    if (jumpTarget.msgId) {
      setHighlightedMsgId(jumpTarget.msgId);
    }

    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
    }

    // 3. Smooth scroll alignment
    virtualizer.scrollToIndex(jumpTarget.index, { align: 'center', behavior: 'smooth' });

    // 4. Auto-remove highlight ring after 2.5 seconds
    highlightTimerRef.current = setTimeout(() => {
      setHighlightedMsgId(null);
    }, 2500);

    // Bug 8 fix: Clear highlight timer on unmount
    return () => {
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
        highlightTimerRef.current = null;
      }
    };
  }, [jumpTarget, virtualizer, messages.length]);

  // Target scroll index fallback for search result navigation
  useEffect(() => {
    if (targetScrollIndex !== null && targetScrollIndex !== undefined && targetScrollIndex >= 0 && targetScrollIndex < messages.length) {
      setAutoScroll(false);
      virtualizer.scrollToIndex(targetScrollIndex, { align: 'center', behavior: 'smooth' });
    }
  }, [targetScrollIndex, virtualizer, messages.length]);

  // Detect wheel / touch scroll events initiated by the user
  // IMPORTANT: All hooks MUST be called before any conditional returns (Rules of Hooks)
  const handleUserInteraction = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const isAtBottom = Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) <= 50;
    setAutoScroll(isAtBottom);
  }, []);

  // Sync scroll position when message count changes
  useEffect(() => {
    if (messages.length === 0) return; // guard inside effect, not early return
    const el = scrollContainerRef.current;
    const isMyNewMessage = messages[messages.length - 1].isMe;
    const isNewMessage = messages.length > prevMessagesLengthRef.current;
    
    if (autoScroll || isMyNewMessage || isNewMessage) {
      if (isTyping && el) {
        el.scrollTop = el.scrollHeight;
      } else {
        requestAnimationFrame(() => {
          virtualizer.scrollToIndex(messages.length - 1, { 
            align: 'end',
            behavior: 'auto'
          });
        });
      }
      
      if (isMyNewMessage || isNewMessage) {
        setAutoScroll(true);
      }
    }
    
    prevMessagesLengthRef.current = messages.length;
  }, [messageCount, virtualizer, messages.length, isTyping, autoScroll]);

  // Always scroll to bottom when switching chats
  useEffect(() => {
    if (messages.length > 0) {
      setAutoScroll(true);
      prevMessagesLengthRef.current = messages.length;
      virtualizer.scrollToIndex(messages.length - 1, { 
        align: 'end',
        behavior: 'auto'
      });
    }
  }, [selectedChatId]);

  // Empty state — shown when a new conversation has no messages yet
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-0 select-none animate-in fade-in duration-300">
        <div className="relative mb-4">
          <AvatarWithFallback name={selectedChatName} src={selectedChatAvatar} size="w-20 h-20" />
          <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">{selectedChatName}</h3>
        <p className="text-xs text-slate-500 max-w-xs mb-6 leading-relaxed">
          This is the beginning of your direct message history with <span className="font-semibold text-slate-700">{selectedChatName}</span>.
        </p>
        <button
          type="button"
          onClick={() => onSendQuickMessage?.('Hello! 👋')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200/80 rounded-full text-xs font-semibold text-slate-700 transition cursor-pointer active:scale-95 shadow-2xs"
        >
          <span>👋 Say hello to {selectedChatName}</span>
        </button>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      onWheel={handleUserInteraction}
      onTouchMove={handleUserInteraction}
      onKeyDown={handleUserInteraction}
      role="log"
      aria-live="polite"
      className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 min-h-0 w-full py-4 pr-1"
      style={{ overflowAnchor: 'none' }}
    >
      <div
        style={{
          width: '100%',
          paddingTop: `${virtualizer.getVirtualItems()[0]?.start ?? 0}px`,
          paddingBottom: `${virtualizer.getVirtualItems().length > 0 ? virtualizer.getTotalSize() - virtualizer.getVirtualItems()[virtualizer.getVirtualItems().length - 1].end : 0}px`
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const msg = messages[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                paddingBottom: '16px'
              }}
            >
              <MessageBubble 
                msg={msg} 
                selectedChatName={selectedChatName}
                selectedChatAvatar={selectedChatAvatar}
                onToggleReaction={onToggleReaction} 
                onReplyMessage={onReplyMessage}

                onForwardMessage={onForwardMessage}
                onPinMessage={onPinMessage}
                onDeleteMessage={onDeleteMessage}
                onOpenImage={onOpenImage}
                searchQuery={searchQuery}
                isPlayingVoice={playingVoiceId === msg.id}
                onToggleVoicePlay={handleToggleVoicePlay}
                isHighlighted={msg.id === highlightedMsgId}
              />
            </div>
          );
        })}
      </div>

      {isTyping && (
        <div className="flex flex-col items-start mt-2 px-4 sm:px-6">
          <div className="flex items-end gap-2 mb-1">
            <AvatarWithFallback name={selectedChatName} src={selectedChatAvatar} size="w-6 h-6"/>
            <span className="text-[10px] text-slate-400 font-medium">{selectedChatName} is typing</span>
          </div>
          <TypingIndicator />
        </div>
      )}

      {isAITyping && (
        <div className="flex flex-col items-start mt-2 mb-2 px-4 sm:px-6 animate-in fade-in duration-300">
          <div className="flex items-end gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center shadow-sm border border-white dark:border-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-white fill-white" />
            </div>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold tracking-wider uppercase">Cupid AI is crafting an icebreaker...</span>
          </div>
          <TypingIndicator />
        </div>
      )}

      {/* Floating Scroll to Bottom / New Messages Pill */}
      {!autoScroll && messages.length > 0 && (
        <button
          type="button"
          onClick={() => {
            setAutoScroll(true);
            virtualizer.scrollToIndex(messages.length - 1, { align: 'end', behavior: 'smooth' });
          }}
          className="absolute bottom-4 right-6 z-30 bg-purple-600 hover:bg-purple-700 text-white shadow-xl rounded-full px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 cursor-pointer active:scale-95"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span>New messages</span>
        </button>
      )}
    </div>
  );
});
VirtualizedMessageStream.displayName = 'VirtualizedMessageStream';
