import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Ticket, Calendar, MapPin, Users, Sparkles, Check, Send, Clock, Flame } from 'lucide-react';
import type { ChatItem } from '../types';

export interface LocalEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedChat: ChatItem | null;
  onSendEventInvite: (inviteMessage: string) => void;
}

export interface LocalEvent {
  id: string;
  title: string;
  category: 'Live Music' | 'Art & Wine' | 'Social Night' | 'Outdoor & Food';
  date: string;
  time: string;
  location: string;
  distance: string;
  price: string;
  attendingCount: number;
  image: string;
  description: string;
}

const LOCAL_EVENTS: LocalEvent[] = [
  {
    id: 'evt_1',
    title: 'Skyline Rooftop Jazz & Craft Cocktails',
    category: 'Live Music',
    date: 'This Friday',
    time: '8:00 PM',
    location: 'Skyline Terrace, Williamsburg',
    distance: '2.4 miles away',
    price: '$15 / person',
    attendingCount: 42,
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80',
    description: 'Candlelit live sax quartet, specialty mezcal cocktails, and 360-degree city views.'
  },
  {
    id: 'evt_2',
    title: 'Analog Vinyl Listening & Espresso Tasting',
    category: 'Social Night',
    date: 'Saturday',
    time: '4:00 PM',
    location: 'Groove Records Cafe, West Village',
    distance: '1.8 miles away',
    price: 'Free RSVP',
    attendingCount: 28,
    image: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=600&auto=format&fit=crop&q=80',
    description: 'Immersive hifi audio listening session featuring Japanese ambient synth & rare indie vinyl.'
  },
  {
    id: 'evt_3',
    title: 'Moonlight Gallery Walk & Natural Wine',
    category: 'Art & Wine',
    date: 'This Sunday',
    time: '6:30 PM',
    location: 'Lumina Contemporary Art, SoHo',
    distance: '3.1 miles away',
    price: '$20 / person',
    attendingCount: 35,
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    description: 'After-hours access to modern abstract exhibits paired with local organic natural wines.'
  },
  {
    id: 'evt_4',
    title: 'Sunset Harbor Kayaking & Picnic',
    category: 'Outdoor & Food',
    date: 'Next Saturday',
    time: '5:00 PM',
    location: 'Hudson River Boathouse',
    distance: '4.0 miles away',
    price: '$25 / person',
    attendingCount: 19,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80',
    description: 'Guided tandem kayaking session into golden hour followed by artisanal charcuterie picnic.'
  }
];

export const LocalEventsModal: React.FC<LocalEventsModalProps> = React.memo(({
  isOpen,
  onClose,
  selectedChat,
  onSendEventInvite
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>('evt_1');
  const [sentEventIds, setSentEventIds] = useState<Record<string, boolean>>({});

  const partnerName = selectedChat?.name || 'your match';

  const handleSendInvite = (event: LocalEvent) => {
    const inviteText = `🎟️ Joint Event Pass: ${event.title}\n📍 ${event.location} • ${event.date} at ${event.time}\n"${event.description}"\nWould you like to go together? ✨`;
    onSendEventInvite(inviteText);
    setSentEventIds(prev => ({ ...prev, [event.id]: true }));
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 p-0 overflow-hidden rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white relative">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-extrabold text-[11px] backdrop-blur-md flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5" />
              HeartLink Event Pass
            </span>
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight text-white">
            Exclusive Local Events & Experiences
          </DialogTitle>
          <DialogDescription className="text-xs text-purple-100 mt-1">
            Invite {partnerName} to a curated real-world event with a single tap.
          </DialogDescription>
        </div>

        {/* Event List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {LOCAL_EVENTS.map(evt => {
            const isSelected = selectedEventId === evt.id;
            const isSent = !!sentEventIds[evt.id];

            return (
              <div
                key={evt.id}
                onClick={() => setSelectedEventId(evt.id)}
                className={`relative rounded-2xl border transition overflow-hidden cursor-pointer ${
                  isSelected 
                    ? 'border-purple-500 ring-2 ring-purple-500/20 shadow-md bg-purple-50/30 dark:bg-purple-950/20' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Event Thumbnail */}
                  <div className="sm:w-36 h-32 sm:h-auto relative shrink-0 overflow-hidden">
                    <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white font-bold text-[10px]">
                      {evt.category}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                          {evt.title}
                        </h4>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                          {evt.price}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2 font-medium">
                        {evt.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400">
                          <Calendar className="w-3.5 h-3.5" />
                          {evt.date}, {evt.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {evt.distance}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Users className="w-3 h-3" />
                        {evt.attendingCount} attending
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Invite Button inside card */}
                {isSelected && (
                  <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      📍 {evt.location}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendInvite(evt);
                      }}
                      disabled={isSent}
                      className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-xs"
                    >
                      {isSent ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1" />
                          Invite Sent!
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 mr-1" />
                          Invite {partnerName} 🎟️
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
});

LocalEventsModal.displayName = 'LocalEventsModal';
