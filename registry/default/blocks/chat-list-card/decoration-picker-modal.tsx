import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Ban, Sparkles, Crown, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { AvatarWithFallback } from './avatar-with-fallback';
import type { ChatItem, AvatarDecoration } from './types';

interface DecorationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** The live chat item from parent state */
  selectedChat: ChatItem | null;
  tier: string;
  onSubscriptionChange: (tier: string) => void;
  onApplyDecoration: (chatId: string, decoration: string, url?: string) => void;
}

const AVAILABLE_DECORATIONS = [
  'none',
  'discord-avatar-decoration.gif',
  'venom-discord.gif',
  'bonsai-discord.gif',
  'g-toilet-discord.gif',
  'holiday-cat-ears-discord.gif',
  'infinite-swirl-discord.gif',
  'jack-o-lantern-discord.gif',
  'karina-decoration.gif',
  'lofi-girl-outfit-discord.gif',
  'panzy-discord.gif',
  "reyna's-leer-discord.gif",
  'sakura-ink-discord.gif',
  'scarlet-leaves-discord.gif',
  'treat-pumpkin-discord.gif',
  'trick-pumpkin-discord.gif',
  'trick-spider-discord.gif',
];

function prettyName(filename: string): string {
  return filename
    .replace('-discord.gif', '')
    .replace('.gif', '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const DecorationGridItem = React.memo(({
  filename,
  isSelected,
  onSelect,
  onHover,
  onLeave,
}: {
  filename: string;
  isSelected: boolean;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
}) => {
  const isNone = filename === 'none';
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    onHover();
  }, [onHover]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    onLeave();
  }, [onLeave]);

  return (
    <div
      className="flex flex-col items-center gap-2 relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-label={isNone ? 'Select no avatar decoration' : `Select ${prettyName(filename)} decoration`}
        className={`w-[72px] h-[72px] rounded-full relative flex items-center justify-center transition-all duration-200 cursor-pointer outline-none transform-gpu ${
          isSelected
            ? 'shadow-[0_0_0_3px_rgba(255,255,255,1)] dark:shadow-[0_0_0_3px_rgba(30,41,59,1)] ring-2 ring-violet-500 scale-[1.08]'
            : 'shadow-[0_0_0_1px_rgba(226,232,240,0.8)] dark:shadow-[0_0_0_1px_rgba(51,65,85,0.8)] hover:ring-2 hover:ring-violet-400 hover:scale-[1.05]'
        }`}
      >
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full text-white flex items-center justify-center shadow-md z-30"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </motion.div>
        )}

        {isNone ? (
          <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500">
            <Ban className="w-6 h-6" />
          </div>
        ) : (
          <img
            src={
              isHovered || isSelected
                ? `/decorations/${filename}`
                : `/decorations/static/${filename.replace('.gif', '.webp')}`
            }
            alt={prettyName(filename)}
            className="w-full h-full object-cover scale-[1.2] rounded-full pointer-events-none transform-gpu"
            loading="lazy"
            decoding="async"
          />
        )}
      </button>
      <span
        className={`text-[10px] font-medium max-w-[80px] truncate text-center leading-tight transition-colors ${
          isSelected
            ? 'text-slate-900 dark:text-slate-100 font-bold'
            : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
        }`}
      >
        {isNone ? 'None' : prettyName(filename)}
      </span>
    </div>
  );
});
DecorationGridItem.displayName = 'DecorationGridItem';

export function DecorationPickerModal({
  isOpen,
  onClose,
  selectedChat,
  tier,
  onSubscriptionChange,
  onApplyDecoration,
}: DecorationPickerModalProps) {
  const [hoveredDecoration, setHoveredDecoration] = useState<string | null>(null);

  const handleSelectDecoration = useCallback(
    (filename: string) => {
      if (!selectedChat) return;
      const isNone = filename === 'none';
      const deco: AvatarDecoration = isNone ? 'none' : 'custom_gif';
      const url = isNone ? undefined : `/decorations/${filename}`;
      onApplyDecoration(selectedChat.id, deco, url);
    },
    [selectedChat, onApplyDecoration]
  );

  if (!selectedChat) return null;

  const isPremium = tier === 'nitro_pro' || tier === 'nitro_basic';

  const currentDecoration = selectedChat.customDecorationUrl
    ? selectedChat.customDecorationUrl.replace('/decorations/', '')
    : 'none';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="fixed top-0 bottom-0 right-0 left-auto translate-x-0 translate-y-0 sm:max-w-[420px] h-full rounded-none border-l border-y-0 border-r-0 border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col p-0 overflow-hidden duration-300 data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right">
        {/* HEADER */}
        <DialogHeader className="shrink-0 px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between text-left space-y-0">
          <div>
            <DialogTitle className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-500" />
              Avatar GIF Animations
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Choose animated GIF decorations for {selectedChat.name}.
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* LIVE PREVIEW STRIP */}
        <div className="shrink-0 px-6 py-4 bg-slate-50/80 dark:bg-slate-850/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              {(() => {
                const previewFile = hoveredDecoration || currentDecoration;
                const isNone = previewFile === 'none';
                return (
                  <AvatarWithFallback
                    name={selectedChat.name}
                    src={selectedChat.avatar}
                    size="w-16 h-16"
                    decoration={isNone ? 'none' : 'custom_gif'}
                    customDecorationUrl={isNone ? undefined : `/decorations/${previewFile}`}
                  />
                );
              })()}
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate max-w-[140px]">
                {selectedChat.name}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Live GIF Preview</p>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
            <Crown className="w-3 h-3 text-amber-500 shrink-0" />
            Premium
          </span>
        </div>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto relative p-6">
          {/* Premium gate overlay */}
          <AnimatePresence>
            {!isPremium && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs"
              >
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-xl max-w-sm text-center mx-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-1.5">
                    Unlock GIF Animations
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                    Get animated avatar decorations and custom GIF effects with Premium.
                  </p>
                  <Button
                    onClick={() => onSubscriptionChange('nitro_pro')}
                    className="w-full py-5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer text-sm border-0"
                  >
                    Upgrade to Premium
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid Content */}
          <div className={`transition-all duration-300 ${!isPremium ? 'blur-[3px] grayscale pointer-events-none select-none' : ''}`}>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-violet-500" />
              Available GIF Animations
            </h3>
            <div className="grid grid-cols-4 gap-4 pb-12">
              {AVAILABLE_DECORATIONS.map((filename) => (
                <DecorationGridItem
                  key={filename}
                  filename={filename}
                  isSelected={currentDecoration === filename}
                  onSelect={() => handleSelectDecoration(filename)}
                  onHover={() => setHoveredDecoration(filename)}
                  onLeave={() => setHoveredDecoration(null)}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
