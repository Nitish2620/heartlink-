import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { ShieldCheck, CheckCircle2, MapPin, Clock, Lock, BellRing } from 'lucide-react';
import type { ChatItem } from '../../chat-list-card/types';

export interface SafetyGuardianModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedChat: ChatItem | null;
}

export const SafetyGuardianModal: React.FC<SafetyGuardianModalProps> = React.memo(({
  isOpen,
  onClose,
  selectedChat,
}) => {
  const [activeTab, setActiveTab] = useState<'verification' | 'safe_date'>('verification');
  const [isVerified, setIsVerified] = useState(true);
  const [checkInHours, setCheckInHours] = useState(2);
  const [isGuardianActive, setIsGuardianActive] = useState(false);

  if (!selectedChat) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6 rounded-3xl border border-blue-200 shadow-2xl bg-[#FBFBFC]">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600 fill-blue-500" />
            <span>HeartLink Safety & Verification</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium">
            Selfie pose verification & SafeDate live guardian check-in.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl my-2">
          <button
            type="button"
            onClick={() => setActiveTab('verification')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'verification' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Blue Check Verification
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('safe_date')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'safe_date' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            SafeDate Guardian
          </button>
        </div>

        {activeTab === 'verification' && (
          <div className="flex flex-col gap-4 py-2">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-slate-900">Photo Verified Profile</span>
                <span className="text-[11px] text-slate-600 font-medium">
                  3D Selfie pose match verified against profile photos.
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-500" />
                <span>Encrypted biometric pose matching</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>Zero catfish protection guarantee</span>
              </div>
            </div>

            <Button
              onClick={() => setIsVerified(true)}
              className="w-full rounded-full py-2.5 font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer"
            >
              Verify My Profile Pose Now
            </Button>
          </div>
        )}

        {activeTab === 'safe_date' && (
          <div className="flex flex-col gap-4 py-2">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <BellRing className="w-4 h-4 text-emerald-600" /> SafeDate Guardian Check-In
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isGuardianActive ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-600'}`}>
                  {isGuardianActive ? 'ACTIVE 🟢' : 'OFF ⚪'}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Going on a real-world date with <strong className="text-slate-900">{selectedChat.name}</strong>? Set an automatic check-in timer. If you don't confirm safety, your emergency contacts are notified.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-600" /> Check-In Timer Duration
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(hrs => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setCheckInHours(hrs)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      checkInHours === hrs ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {hrs} Hours
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setIsGuardianActive(!isGuardianActive)}
              className={`w-full rounded-full py-2.5 font-bold transition cursor-pointer ${
                isGuardianActive ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
              }`}
            >
              {isGuardianActive ? 'Deactivate SafeDate Guardian' : 'Activate SafeDate Guardian 🛡️'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
});

SafetyGuardianModal.displayName = 'SafetyGuardianModal';
