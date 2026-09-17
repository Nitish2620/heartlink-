import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Heart } from 'lucide-react';
import type { SpeedDiscoveryProfile } from '../chat-list-card';

export interface MatchCelebrationModalProps {
  matchedProfile: SpeedDiscoveryProfile | null;
  onClose: () => void;
  onStartChat: (profile: SpeedDiscoveryProfile) => void;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = React.memo(({
  matchedProfile,
  onClose,
  onStartChat,
}) => {
  return (
    <Dialog open={!!matchedProfile} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm text-center p-6 bg-gradient-to-b from-rose-50 via-purple-50 to-white border-2 border-rose-300 shadow-2xl rounded-3xl">
        <div className="flex justify-center mb-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-rose-500 overflow-hidden shadow-lg">
              <img src={matchedProfile?.avatar} alt="Match" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center border-2 border-white shadow-md">
              <Heart className="w-4 h-4 fill-white" />
            </div>
          </div>
        </div>

        <DialogHeader className="items-center">
          <DialogTitle className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-600">
            It's a HeartMatch! 🎉
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-600 mt-1 font-medium">
            You and <strong className="text-slate-900">{matchedProfile?.name}</strong> liked each other! 
            Your 72-Hour HeartPulse timer is active.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 space-y-2">
          <Button
            onClick={() => {
              if (matchedProfile) {
                onStartChat(matchedProfile);
              }
            }}
            className="w-full py-3 rounded-full font-extrabold bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white shadow-md cursor-pointer"
          >
            Send First Message (Opener) 💬
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Keep Swiping in Speed Deck
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

MatchCelebrationModal.displayName = 'MatchCelebrationModal';
