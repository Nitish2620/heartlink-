import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { Video, Mic, MicOff, VideoOff, PhoneOff, Sparkles, Heart, Dices } from 'lucide-react';
import type { ChatItem } from '../types';

export interface SpeedVideoDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedChat: ChatItem | null;
}

const ICEBREAKER_QUESTIONS = [
  "What is something surprising that always instantly brightens your day?",
  "If we could teleport anywhere in the world right now for dinner, where are we going?",
  "What's your ultimate comfort food and guilty-pleasure movie?",
  "What is the most spontaneous thing you've done this past year?",
  "What is your favorite early morning habit?"
];

export const SpeedVideoDateModal: React.FC<SpeedVideoDateModalProps> = React.memo(({
  isOpen,
  onClose,
  selectedChat,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(300);
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!selectedChat) return null;

  const formatMinSec = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl border border-rose-300 shadow-2xl bg-slate-950 text-white">
        {/* Call Header */}
        <div className="p-4 bg-slate-900/90 backdrop-blur-md flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-200">5-Min Speed Video Date</span>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 font-mono text-xs font-bold">
            ⏳ {formatMinSec(secondsLeft)}
          </div>
        </div>

        {/* Video Viewport Container */}
        <div className="relative h-80 w-full bg-slate-900 flex items-center justify-center overflow-hidden">
          {/* Main Remote View (Matched Profile) */}
          <img
            src={selectedChat.avatar}
            alt={selectedChat.name}
            className={`w-full h-full object-cover transition duration-300 ${isVideoOff ? 'blur-md opacity-40' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

          {/* User Self Cam Preview (Bottom Right Picture-in-Picture) */}
          <div className="absolute bottom-3 right-3 w-24 h-32 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl bg-slate-800">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"
              alt="Your Camera"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 left-1.5 text-[9px] font-bold text-white bg-black/60 px-1 rounded">You</span>
          </div>

          {/* Icebreaker Prompt Overlay */}
          <div className="absolute top-4 inset-x-4 p-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-lg text-center flex flex-col gap-1">
            <div className="flex items-center justify-center gap-1.5 text-rose-400 text-[10px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> Icebreaker Question
            </div>
            <p className="text-xs text-slate-100 font-semibold italic leading-relaxed">
              "{ICEBREAKER_QUESTIONS[questionIndex % ICEBREAKER_QUESTIONS.length]}"
            </p>
            <button
              type="button"
              onClick={() => setQuestionIndex(prev => prev + 1)}
              className="self-center mt-1 text-[10px] text-rose-300 hover:text-rose-200 font-bold flex items-center gap-1 cursor-pointer bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-full transition"
            >
              <Dices className="w-3 h-3" /> Next Question
            </button>
          </div>

          {/* Profile Name Tag */}
          <div className="absolute bottom-4 left-4 text-white">
            <h4 className="text-base font-extrabold flex items-center gap-1.5">
              {selectedChat.name}
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            </h4>
            <span className="text-[11px] text-slate-300">Live Video Session</span>
          </div>
        </div>

        {/* Call Controls Toolbar */}
        <div className="p-4 bg-slate-900 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
              isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
              isVideoOff ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition active:scale-95 cursor-pointer"
            title="End Video Date"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

SpeedVideoDateModal.displayName = 'SpeedVideoDateModal';
