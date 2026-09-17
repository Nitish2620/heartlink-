import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Users, UserPlus, MapPin, Calendar, Sparkles, Check, Send, Coffee, Gamepad2, Trophy, Flame } from 'lucide-react';
import type { ChatItem } from '../types';

export interface GroupHangoutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedChat: ChatItem | null;
  onSendGroupInvite: (inviteMessage: string) => void;
}

export interface GroupHangout {
  id: string;
  title: string;
  vibe: 'Double Date' | 'Coffee Crawl' | 'Board Games' | 'Outdoor Social';
  location: string;
  time: string;
  maxSpots: number;
  filledSpots: number;
  hosts: { name: string; avatar: string }[];
  description: string;
}

const SAMPLE_HANGOUTS: GroupHangout[] = [
  {
    id: 'grp_1',
    title: 'Rooftop Board Games & Craft Brews',
    vibe: 'Board Games',
    location: 'DUMBO Loft, Brooklyn',
    time: 'Saturday • 7:00 PM',
    maxSpots: 4,
    filledSpots: 3,
    hosts: [
      { name: 'Maya L.', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80' },
      { name: 'Ethan K.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' }
    ],
    description: 'Looking for 1 couple/pair to join us for Catan, Codenames, and cold craft ales.'
  },
  {
    id: 'grp_2',
    title: 'West Village Specialty Espresso Crawl',
    vibe: 'Coffee Crawl',
    location: 'West Village Cafe Trail',
    time: 'Sunday • 11:00 AM',
    maxSpots: 4,
    filledSpots: 2,
    hosts: [
      { name: 'Sofia R.', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80' }
    ],
    description: 'Tasting pour-overs and matcha lattes across 3 indie coffee bars.'
  },
  {
    id: 'grp_3',
    title: 'Sunset Beach Volleyball & Tacos',
    vibe: 'Outdoor Social',
    location: 'Pier 25 Courts, Hudson River',
    time: 'This Friday • 6:00 PM',
    maxSpots: 6,
    filledSpots: 4,
    hosts: [
      { name: 'Chloe D.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
      { name: 'Liam P.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' }
    ],
    description: 'Friendly double-date beach volley match followed by tacos on the pier.'
  }
];

export const GroupHangoutsModal: React.FC<GroupHangoutsModalProps> = React.memo(({
  isOpen,
  onClose,
  selectedChat,
  onSendGroupInvite
}) => {
  const [joinedGroupIds, setJoinedGroupIds] = useState<Record<string, boolean>>({});

  const partnerName = selectedChat?.name || 'your match';

  const handleInvitePair = (group: GroupHangout) => {
    const inviteText = `👯 Double Date & Group Hangout: ${group.title}\n📍 ${group.location} • ${group.time}\n"${group.description}"\nWant to join as a pair with me? ☕✨`;
    onSendGroupInvite(inviteText);
    setJoinedGroupIds(prev => ({ ...prev, [group.id]: true }));
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 p-0 overflow-hidden rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 text-white relative">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-extrabold text-[11px] backdrop-blur-md flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              Double Date & Social Groups
            </span>
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight text-white">
            Live Group Social Hangouts
          </DialogTitle>
          <DialogDescription className="text-xs text-purple-100 mt-1">
            Safe, low-pressure 4-person group hangouts & double dates with {partnerName}.
          </DialogDescription>
        </div>

        {/* Group List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {SAMPLE_HANGOUTS.map(group => {
            const isJoined = !!joinedGroupIds[group.id];

            return (
              <div
                key={group.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-purple-300 dark:hover:border-purple-700 transition"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 font-extrabold text-[10px]">
                        {group.vibe}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        {group.filledSpots}/{group.maxSpots} Spots Filled
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                      {group.title}
                    </h4>
                  </div>

                  {/* Host Avatars */}
                  <div className="flex -space-x-2 overflow-hidden shrink-0">
                    {group.hosts.map((host, idx) => (
                      <img
                        key={idx}
                        src={host.avatar}
                        alt={host.name}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                        title={host.name}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">
                  {group.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {group.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {group.location}
                    </span>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleInvitePair(group)}
                    disabled={isJoined}
                    className="bg-gradient-to-r from-indigo-500 via-purple-600 to-rose-500 hover:opacity-90 text-white font-extrabold text-xs rounded-xl shadow-xs"
                  >
                    {isJoined ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Invite Sent!
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5 mr-1" />
                        Invite {partnerName} 👯
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
});

GroupHangoutsModal.displayName = 'GroupHangoutsModal';
