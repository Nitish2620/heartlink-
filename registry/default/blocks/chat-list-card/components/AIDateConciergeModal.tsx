import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Sparkles, MapPin, Calendar, Check, Send } from 'lucide-react';
import type { ChatItem } from '../types';

export interface AIDateConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedChat: ChatItem | null;
  onSendDateInvite: (inviteText: string) => void;
}

interface DateIdea {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  matchReason: string;
  emoji: string;
}

export const AIDateConciergeModal: React.FC<AIDateConciergeModalProps> = React.memo(({
  isOpen,
  onClose,
  selectedChat,
  onSendDateInvite,
}) => {
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>('idea_1');

  if (!selectedChat) return null;

  const dateIdeas: DateIdea[] = [
    {
      id: 'idea_1',
      title: 'Rooftop Espresso & Vinyl Record Hunt',
      category: 'Coffee & Music',
      location: 'SoHo & Greenwich Village',
      description: 'Start with single-origin pour-overs at a sunlit rooftop café, then browse vintage jazz vinyls together.',
      matchReason: `Matched based on ${selectedChat.name}'s passion for coffee and music prompts.`,
      emoji: '☕'
    },
    {
      id: 'idea_2',
      title: 'Indie Art Gallery & Speakeasy Cocktails',
      category: 'Arts & Speakeasy',
      location: 'Chelsea Art District',
      description: 'Explore contemporary photography exhibits followed by craft cocktails behind a hidden bookshelf door.',
      matchReason: `High compatibility score on shared aesthetic & nightlife preferences.`,
      emoji: '🎨'
    },
    {
      id: 'idea_3',
      title: 'Sunset Botanical Walk & Tacos',
      category: 'Outdoors & Food',
      location: 'Brooklyn Botanic Garden',
      description: 'A relaxed golden-hour stroll through blooming gardens followed by artisanal street tacos.',
      matchReason: `Ideal for spontaneous outdoor dates & relaxed conversations.`,
      emoji: '🌿'
    }
  ];

  const activeIdea = dateIdeas.find(i => i.id === selectedIdeaId) || dateIdeas[0];

  const handleSendInvite = () => {
    const inviteMessage = `🥂 **Date Invitation via Cupid AI**:\n"Hey ${selectedChat.name}! I found this date idea: **${activeIdea.title}** ${activeIdea.emoji} at *${activeIdea.location}*. ${activeIdea.description} Free this weekend?"`;
    onSendDateInvite(inviteMessage);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6 rounded-3xl border border-purple-200 shadow-2xl bg-gradient-to-b from-purple-50/70 via-white to-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 fill-purple-500 animate-pulse" />
            <span>Cupid AI Date Concierge</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-600 font-medium">
            AI-curated date spots tailored to your mutual prompts with <strong className="text-slate-900">{selectedChat.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 my-2">
          {dateIdeas.map((idea) => {
            const isSelected = idea.id === selectedIdeaId;
            return (
              <div
                key={idea.id}
                onClick={() => setSelectedIdeaId(idea.id)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col gap-1.5 relative ${
                  isSelected
                    ? 'bg-purple-50/90 border-purple-400 shadow-xs ring-2 ring-purple-300/50'
                    : 'bg-white border-slate-200 hover:border-purple-200 hover:bg-purple-50/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span className="text-base">{idea.emoji}</span> {idea.title}
                  </span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span>{idea.location}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic">{idea.description}</p>
                <span className="text-[10px] text-purple-700 font-bold bg-purple-100/70 px-2 py-0.5 rounded-full w-fit">
                  {idea.matchReason}
                </span>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-full text-xs font-bold text-slate-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendInvite}
            className="flex-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Date Invite</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

AIDateConciergeModal.displayName = 'AIDateConciergeModal';
