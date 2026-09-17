import React, { useState, useMemo } from 'react';
import { SocialPostCard } from '../../social-post-card/social-post-card';
import { Search, Flame, MapPin, Sparkles, Filter, Users, Ticket, MessageCircle, Heart } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

export interface HeartLinkFeedViewProps {
  onSendOpener?: (authorName: string, promptText: string) => void;
  onProposeDate?: (dateSpotName: string, location: string) => void;
  onJoinGroup?: (groupTitle: string) => void;
}

export interface DatingFeedPost {
  id: string;
  authorDetails: {
    name: string;
    age: number;
    avatar: string;
    location: string;
    distance: string;
    verified: boolean;
    intent: 'Long-term relationship' | 'Deep connection' | 'Spontaneous fun';
  };
  timestamp: string;
  content: string;
  images?: string[];
  voiceNoteUrl?: string;
  voiceDuration?: string;
  promptAnswer?: {
    question: string;
    answer: string;
    category?: string;
  };
  dateSpot?: {
    name: string;
    category: string;
    location: string;
    price: string;
    image?: string;
    introQuote?: string;
  };
  doubleDateGroup?: {
    title: string;
    vibe: string;
    time: string;
    location: string;
    filledSpots: number;
    maxSpots: number;
    hosts: { name: string; avatar: string }[];
    description: string;
  };
  poll?: {
    id: string;
    question: string;
    options: { id: string; text: string; votes: number }[];
    totalVotes: number;
  };
}

const SAMPLE_DATING_POSTS: DatingFeedPost[] = [
  {
    id: 'post_1',
    authorDetails: {
      name: 'Maya Lin',
      age: 24,
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
      location: 'Brooklyn, NY',
      distance: '2.8 miles away',
      verified: true,
      intent: 'Long-term relationship'
    },
    timestamp: '2 hours ago',
    content: 'Just spent the afternoon exploring vintage flea markets and hunting down analog film cameras. Here is my current weekend vibe audio note! 📷✨',
    images: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80'],
    voiceNoteUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
    voiceDuration: '0:14',
    promptAnswer: {
      question: 'Together, we could...',
      answer: 'Design the ultimate reading nook, hunt down secret rooftop coffee spots, and bake sourdough pizzas on rainy weekends.',
      category: 'Match Vibe'
    }
  },
  {
    id: 'post_2',
    authorDetails: {
      name: 'Sofia Ruiz',
      age: 25,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
      location: 'SoHo, Manhattan',
      distance: '3.4 miles away',
      verified: true,
      intent: 'Deep connection'
    },
    timestamp: '4 hours ago',
    content: 'Stumbled upon this hidden candlelit rooftop terrace in SoHo with a live sax quartet and natural wines. Absolute date spot perfection! 🎷🍷',
    images: ['https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop&q=80'],
    dateSpot: {
      name: 'Skyline Rooftop Jazz & Wine',
      category: 'Live Music & Bar',
      location: 'SoHo Terrace, Manhattan',
      price: '$15 / person',
      image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop&q=80',
      introQuote: 'Candlelit sax quartet with 360-degree city skyline views.'
    }
  },
  {
    id: 'post_3',
    authorDetails: {
      name: 'Chloe Dupont',
      age: 23,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      location: 'West Village, NY',
      distance: '1.9 miles away',
      verified: true,
      intent: 'Spontaneous fun'
    },
    timestamp: '5 hours ago',
    content: 'Organizing a low-key 4-person espresso & matcha crawl this Sunday! Looking for another pair to join us ☕✨',
    doubleDateGroup: {
      title: 'West Village Specialty Espresso Crawl',
      vibe: 'Coffee Crawl',
      time: 'Sunday • 11:00 AM',
      location: 'West Village Cafe Trail',
      filledSpots: 2,
      maxSpots: 4,
      hosts: [
        { name: 'Chloe D.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
        { name: 'Liam P.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' }
      ],
      description: 'Tasting pour-overs and matcha lattes across 3 indie coffee bars.'
    }
  },
  {
    id: 'post_4',
    authorDetails: {
      name: 'Noah Vance',
      age: 26,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      location: 'Greenpoint, Brooklyn',
      distance: '4.1 miles away',
      verified: true,
      intent: 'Deep connection'
    },
    timestamp: '6 hours ago',
    content: 'Settling a debate with my friends: what is the single best first date atmosphere?',
    poll: {
      id: 'poll_date_vibe',
      question: 'Ideal First Date Vibe?',
      options: [
        { id: 'opt_1', text: '🎷 Speakeasy Jazz & Craft Cocktails', votes: 64 },
        { id: 'opt_2', text: '☕ Cozy Coffee Crawl & Bookshop Stroll', votes: 48 },
        { id: 'opt_3', text: '🍕 Casual Arcade Bar & Sourdough Pizza', votes: 32 }
      ],
      totalVotes: 144
    }
  }
];

export const HeartLinkFeedView: React.FC<HeartLinkFeedViewProps> = React.memo(({
  onSendOpener,
  onProposeDate,
  onJoinGroup
}) => {
  const [feedTab, setFeedTab] = useState<'vibes' | 'spots'>('vibes');
  const [intentFilter, setIntentFilter] = useState<'all' | 'Long-term relationship' | 'Deep connection' | 'Spontaneous fun'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    return SAMPLE_DATING_POSTS.filter(post => {
      // Tab filter
      if (feedTab === 'spots' && !post.dateSpot && !post.doubleDateGroup) return false;
      // Intent filter
      if (intentFilter !== 'all' && post.authorDetails.intent !== intentFilter) return false;
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesAuthor = post.authorDetails.name.toLowerCase().includes(q);
        const matchesContent = post.content.toLowerCase().includes(q);
        const matchesLocation = post.authorDetails.location.toLowerCase().includes(q);
        return matchesAuthor || matchesContent || matchesLocation;
      }
      return true;
    });
  }, [feedTab, intentFilter, searchQuery]);

  return (
    <div className="w-full h-full flex flex-col bg-[#F4F5F8] dark:bg-slate-950 overflow-hidden font-sans">
      {/* Top Header Bar */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 shrink-0 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 flex items-center justify-center text-white text-xs shadow-xs">
                <Flame className="w-4 h-4 fill-white" />
              </span>
              HeartLink Vibe Feed
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Discover real-time vibe notes, prompt answers, and local date spots from matches near you.
            </p>
          </div>

          {/* Dual Feed Tabs */}
          <Tabs value={feedTab} onValueChange={(val) => setFeedTab(val as any)} className="w-full md:w-auto">
            <TabsList className="grid grid-cols-2 w-full md:w-72 bg-[#F5F6F9] dark:bg-slate-800 p-1 rounded-2xl">
              <TabsTrigger value="vibes" className="rounded-xl text-xs font-bold py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-300 data-[state=active]:shadow-2xs">
                🔥 For You Vibes
              </TabsTrigger>
              <TabsTrigger value="spots" className="rounded-xl text-xs font-bold py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-300 data-[state=active]:shadow-2xs">
                📍 Date Spots
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Search & Intent Filter Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search vibes, locations, names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F5F6F9] dark:bg-slate-800 border-none pl-9 pr-4 py-2.5 rounded-2xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-purple-500/20 transition"
            />
          </div>

          {/* Intent Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {(['all', 'Long-term relationship', 'Deep connection', 'Spontaneous fun'] as const).map(intent => (
              <button
                key={intent}
                type="button"
                onClick={() => setIntentFilter(intent)}
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition whitespace-nowrap cursor-pointer ${
                  intentFilter === intent
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-2xs'
                    : 'bg-[#F5F6F9] dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {intent === 'all' ? '✨ All Intentions' : intent}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed Stream Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-3xl mx-auto w-full">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-medium">
            No feed posts match your filter query. Try selecting "✨ All Intentions".
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm p-5 space-y-4">
              {/* Dating Header Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorDetails.avatar}
                    alt={post.authorDetails.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500/20 shadow-xs"
                  />
                  <div>
                    <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      {post.authorDetails.name}, {post.authorDetails.age}
                      {post.authorDetails.verified && (
                        <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold inline-flex items-center justify-center" title="Verified Profile">
                          ✓
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold">
                        <MapPin className="w-3 h-3" />
                        {post.authorDetails.distance}
                      </span>
                      <span>•</span>
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-extrabold">
                  {post.authorDetails.intent}
                </span>
              </div>

              {/* Text Body */}
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                {post.content}
              </p>

              {/* Voice Note Pill if available */}
              {post.voiceNoteUrl && (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500/10 to-rose-500/10 border border-purple-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="w-9 h-9 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs hover:scale-105 transition cursor-pointer"
                    >
                      ▶
                    </button>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                        Voice Vibe Clip ({post.voiceDuration})
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        Hear {post.authorDetails.name}'s voice note
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[40, 70, 30, 90, 60, 80, 50, 90, 40, 60].map((h, i) => (
                      <span key={i} className="w-1 bg-purple-500/50 rounded-full" style={{ height: `${h * 0.25}px` }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Hinge Prompt Quote Card */}
              {post.promptAnswer && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-500/30 space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    ✨ {post.promptAnswer.category || 'Profile Prompt'}
                  </span>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                    "{post.promptAnswer.question}"
                  </h4>
                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 italic">
                    {post.promptAnswer.answer}
                  </p>
                </div>
              )}

              {/* Date Spot Check-In Card */}
              {post.dateSpot && (
                <div className="p-4 rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-500/5 to-purple-500/5 flex items-center justify-between gap-3">
                  <div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-extrabold mb-1 inline-block">
                      📍 Date Spot Check-In
                    </span>
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                      {post.dateSpot.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {post.dateSpot.location} • {post.dateSpot.price}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onProposeDate?.(post.dateSpot!.name, post.dateSpot!.location)}
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-extrabold text-xs shadow-2xs shrink-0 cursor-pointer transition active:scale-95"
                  >
                    Let's Go 🥂
                  </button>
                </div>
              )}

              {/* Double Date Group Card */}
              {post.doubleDateGroup && (
                <div className="p-4 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 flex items-center justify-between gap-3">
                  <div>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold mb-1 inline-block">
                      👯 Double Date Group
                    </span>
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                      {post.doubleDateGroup.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {post.doubleDateGroup.time} • {post.doubleDateGroup.filledSpots}/{post.doubleDateGroup.maxSpots} Spots
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onJoinGroup?.(post.doubleDateGroup!.title)}
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-xs shadow-2xs shrink-0 cursor-pointer transition active:scale-95"
                  >
                    Join Group ☕
                  </button>
                </div>
              )}

              {/* Photo Attachment if available */}
              {post.images && post.images.length > 0 && (
                <div className="rounded-2xl overflow-hidden max-h-80 border border-slate-100 dark:border-slate-800 shadow-xs">
                  <img src={post.images[0]} alt="Feed Attachment" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Footer Action Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                <button
                  type="button"
                  className="flex items-center gap-1.5 hover:text-rose-500 transition cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>Like Vibe</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const promptText = post.promptAnswer ? `"${post.promptAnswer.question}" → "${post.promptAnswer.answer}"` : post.content;
                    onSendOpener?.(post.authorDetails.name, promptText);
                  }}
                  className="px-3 py-1.5 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center gap-1.5 transition cursor-pointer text-xs font-extrabold shadow-2xs active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-purple-500" />
                  <span>Send Opener 💬</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

HeartLinkFeedView.displayName = 'HeartLinkFeedView';
