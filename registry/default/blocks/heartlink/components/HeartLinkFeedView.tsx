import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Flame, MapPin, Sparkles, Navigation, Video, EyeOff } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

// Import our new sub-feeds
import { RadarFeed } from './RadarFeed';
import { VibeReelsFeed } from './VibeReelsFeed';
import { BlindDateFeed } from './BlindDateFeed';

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
    images: ['https://images.unsplash.com/photo-1516280440502-6c9fa1a33d9c?w=800&auto=format&fit=crop&q=80'], // Added video-like aesthetic image for reels
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
    images: ['https://images.unsplash.com/photo-1507133750070-4ed0b48bb361?w=800&auto=format&fit=crop&q=80'],
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
    images: ['https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&auto=format&fit=crop&q=80'],
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
  type FeedMode = 'vibes' | 'radar' | 'reels' | 'blind';
  const [feedTab, setFeedTab] = useState<FeedMode>('vibes');
  const [intentFilter, setIntentFilter] = useState<'all' | 'Long-term relationship' | 'Deep connection' | 'Spontaneous fun'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    return SAMPLE_DATING_POSTS.filter(post => {
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
  }, [intentFilter, searchQuery]);

  return (
    <div className="w-full h-full flex flex-col bg-[#F4F5F8] dark:bg-slate-950 overflow-hidden font-sans">
      {/* Top Header Bar */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 shrink-0 shadow-xs z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 flex items-center justify-center text-white text-xs shadow-xs">
                <Flame className="w-4 h-4 fill-white" />
              </span>
              HeartLink Discovery
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Find your next match using dynamic reels, location radars, or blind dates.
            </p>
          </div>

          {/* Discovery Modes Tabs */}
          <Tabs value={feedTab} onValueChange={(val) => setFeedTab(val as FeedMode)} className="w-full md:w-auto">
            <TabsList className="flex w-full md:w-auto bg-[#F5F6F9] dark:bg-slate-800 p-1 rounded-2xl overflow-x-auto hide-scrollbar border border-slate-200 dark:border-slate-700/50 shadow-inner">
              <TabsTrigger value="vibes" className="rounded-xl text-xs font-bold py-2 px-4 flex items-center gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-rose-600 dark:data-[state=active]:text-rose-400 data-[state=active]:shadow-sm">
                <Sparkles className="w-3.5 h-3.5" /> For You
              </TabsTrigger>
              <TabsTrigger value="reels" className="rounded-xl text-xs font-bold py-2 px-4 flex items-center gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-fuchsia-600 dark:data-[state=active]:text-fuchsia-400 data-[state=active]:shadow-sm">
                <Video className="w-3.5 h-3.5" /> Vibe Reels
              </TabsTrigger>
              <TabsTrigger value="radar" className="rounded-xl text-xs font-bold py-2 px-4 flex items-center gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-sm">
                <Navigation className="w-3.5 h-3.5" /> Radar
              </TabsTrigger>
              <TabsTrigger value="blind" className="rounded-xl text-xs font-bold py-2 px-4 flex items-center gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm">
                <EyeOff className="w-3.5 h-3.5" /> Blind Date
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Filter Row (Only show on 'vibes' or 'blind' modes where list sorting makes sense) */}
        <AnimatePresence>
          {(feedTab === 'vibes' || feedTab === 'blind') && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-col sm:flex-row items-center justify-between gap-3 overflow-hidden"
            >
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

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 hide-scrollbar">
                {(['all', 'Long-term relationship', 'Deep connection', 'Spontaneous fun'] as const).map(intent => (
                  <button
                    key={intent}
                    type="button"
                    onClick={() => setIntentFilter(intent)}
                    className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition whitespace-nowrap cursor-pointer ${
                      intentFilter === intent
                        ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-md'
                        : 'bg-[#F5F6F9] dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {intent === 'all' ? '✨ All Intentions' : intent}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dynamic Orchestrator Content Area */}
      <div className="flex-1 overflow-y-auto relative w-full">
        <AnimatePresence mode="wait">
          
          {feedTab === 'vibes' && (
            <motion.div 
              key="vibes"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto w-full pb-20"
            >
              {/* Legacy Vibe Cards (The old Standard Feed) */}
              {filteredPosts.map(post => (
                <StandardVibeCard 
                  key={post.id} 
                  post={post} 
                  onSendOpener={onSendOpener}
                  onProposeDate={onProposeDate}
                  onJoinGroup={onJoinGroup}
                />
              ))}
            </motion.div>
          )}

          {feedTab === 'reels' && (
            <motion.div
              key="reels"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full p-2 sm:p-4 max-w-lg mx-auto"
            >
              <VibeReelsFeed posts={SAMPLE_DATING_POSTS} onSendOpener={onSendOpener} />
            </motion.div>
          )}

          {feedTab === 'radar' && (
            <motion.div
              key="radar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full p-4 max-w-4xl mx-auto"
            >
              <RadarFeed posts={SAMPLE_DATING_POSTS} onProfileClick={(post) => onSendOpener?.(post.authorDetails.name, "Hey, looks like we just crossed paths! 📍")} />
            </motion.div>
          )}

          {feedTab === 'blind' && (
            <motion.div
              key="blind"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full p-4 sm:p-6 max-w-3xl mx-auto overflow-y-auto"
            >
              <BlindDateFeed posts={filteredPosts} onSendOpener={onSendOpener} />
            </motion.div>
          )}
          
        </AnimatePresence>
      </div>
    </div>
  );
});

HeartLinkFeedView.displayName = 'HeartLinkFeedView';

// --- Subcomponent: Legacy Vibe Card extracted for cleaner code ---
const StandardVibeCard = ({ post, onSendOpener, onProposeDate, onJoinGroup }: { post: DatingFeedPost, onSendOpener: any, onProposeDate: any, onJoinGroup: any }) => {
  return (
    <div className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <img src={post.authorDetails.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500/20" />
          <div>
            <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              {post.authorDetails.name}, {post.authorDetails.age}
            </h3>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold">
                <MapPin className="w-3 h-3" /> {post.authorDetails.distance}
              </span>
              <span>•</span>
              <span>{post.timestamp}</span>
            </div>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 text-[10px] font-extrabold">{post.authorDetails.intent}</span>
      </div>

      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{post.content}</p>

      {/* Date Spot */}
      {post.dateSpot && (
        <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/5 flex justify-between items-center">
          <div>
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">📍 {post.dateSpot.name}</h4>
            <p className="text-[11px] text-slate-500 mt-1">{post.dateSpot.location}</p>
          </div>
          <button onClick={() => onProposeDate?.(post.dateSpot!.name, post.dateSpot!.location)} className="px-3 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white text-xs font-bold rounded-xl cursor-pointer">Let's Go 🥂</button>
        </div>
      )}

      {/* Hinge Prompt */}
      {post.promptAnswer && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/30">
          <h4 className="font-extrabold text-xs text-slate-900 dark:text-white mb-1">"{post.promptAnswer.question}"</h4>
          <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 italic">{post.promptAnswer.answer}</p>
        </div>
      )}

      {/* Image */}
      {post.images && post.images.length > 0 && (
        <div className="rounded-2xl overflow-hidden max-h-80 border border-slate-100 dark:border-slate-800">
          <img src={post.images[0]} alt="Post" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
        <button className="text-xs font-bold text-rose-500 flex items-center gap-1 cursor-pointer">
          <Flame className="w-4 h-4" /> Like Vibe
        </button>
        <button 
          onClick={() => onSendOpener(post.authorDetails.name, post.content)}
          className="px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/30 text-xs font-extrabold flex items-center gap-1 cursor-pointer"
        >
          Send Opener 💬
        </button>
      </div>
    </div>
  );
};
