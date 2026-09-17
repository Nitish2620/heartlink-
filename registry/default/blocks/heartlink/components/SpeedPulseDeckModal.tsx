import React, { useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Flame, Filter, X, Sparkles, Check, RotateCcw, Volume2, Zap } from 'lucide-react';
import type { SpeedDiscoveryProfile } from '../types';

export interface SpeedPulseDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: SpeedDiscoveryProfile[];
  onMatch: (profile: SpeedDiscoveryProfile) => void;
  onOpenFilter: () => void;
}

export const SpeedPulseDeckModal: React.FC<SpeedPulseDeckModalProps> = React.memo(({
  isOpen,
  onClose,
  profiles,
  onMatch,
  onOpenFilter,
}) => {
  const [deckIndex, setDeckIndex] = useState(0);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isSuperPulseActive, setIsSuperPulseActive] = useState(false);

  if (!profiles || profiles.length === 0) return null;

  const activeCard = profiles[deckIndex % profiles.length];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl border border-rose-200/80 shadow-2xl bg-[#FCFCFA]">
        <div className="p-4 bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 fill-white animate-bounce" />
            <div>
              <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                HeartLink Speed Deck
                {isSuperPulseActive && (
                  <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full flex items-center gap-0.5 animate-pulse">
                    <Zap className="w-3 h-3 fill-slate-950" /> 3X BOOST
                  </span>
                )}
              </h3>
              <p className="text-[10px] text-rose-100 font-medium">Tinder Speed + Hinge Intentionality</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsSuperPulseActive(!isSuperPulseActive)}
              className={`px-2 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 transition cursor-pointer ${
                isSuperPulseActive ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300' : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              title="Activate SuperPulse 3X Profile Visibility Boost"
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>Boost</span>
            </button>
            <button
              type="button"
              onClick={onOpenFilter}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
              title="Compatibility Intent Filter"
            >
              <Filter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {activeCard && (
          <div className="p-5 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-md bg-white">
              <div className="relative h-72 w-full bg-slate-900">
                <img src={activeCard.avatar} alt={activeCard.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                
                <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-extrabold text-rose-600 border border-rose-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-rose-500 fill-rose-500" />
                  <span>{activeCard.matchScore}% Compatibility</span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xl font-extrabold">{activeCard.name}, {activeCard.age}</h4>
                    <Check className="w-4 h-4 text-white bg-blue-500 rounded-full p-0.5" />
                  </div>
                  <p className="text-xs text-slate-200">{activeCard.location} • {activeCard.distance}</p>
                  
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/80 text-white border border-rose-300">
                      💖 {activeCard.intent}
                    </span>

                    {/* Playable Voice Intro Pill */}
                    <button
                      type="button"
                      onClick={() => setIsPlayingVoice(!isPlayingVoice)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition backdrop-blur-md border cursor-pointer ${
                        isPlayingVoice
                          ? 'bg-emerald-500/90 text-white border-emerald-300 animate-pulse'
                          : 'bg-white/20 hover:bg-white/30 text-white border-white/30'
                      }`}
                      title="Play 10-sec Voice Intro Teaser"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{isPlayingVoice ? 'Playing Voice Intro... 🔊' : '▶ 0:10 Voice Intro'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 flex flex-col gap-3 bg-white">
                <p className="text-xs text-slate-700 leading-relaxed italic">"{activeCard.bio}"</p>
                
                <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Hinge Opener Prompt</span>
                  <span className="text-xs font-bold text-slate-800">"{activeCard.promptQuestion}"</span>
                  <p className="text-xs text-slate-600 font-medium italic">"{activeCard.promptAnswer}"</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-around py-2">
              <button
                type="button"
                onClick={() => setDeckIndex(prev => prev + 1)}
                className="w-12 h-12 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 flex items-center justify-center border border-slate-200 transition active:scale-95 shadow-sm cursor-pointer"
                title="Pass (Swipe Left)"
              >
                <X className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={() => setDeckIndex(prev => Math.max(0, prev - 1))}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-purple-100 text-slate-500 hover:text-purple-600 flex items-center justify-center border border-slate-200 transition active:scale-95 shadow-sm cursor-pointer"
                title="Rewind Previous Card"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onMatch(activeCard);
                  setDeckIndex(prev => prev + 1);
                }}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white flex items-center justify-center shadow-lg transition active:scale-95 cursor-pointer ring-4 ring-rose-200"
                title="Instant HeartPulse Match! (Swipe Right 🔥)"
              >
                <Flame className="w-7 h-7 fill-white animate-pulse" />
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
});

SpeedPulseDeckModal.displayName = 'SpeedPulseDeckModal';
