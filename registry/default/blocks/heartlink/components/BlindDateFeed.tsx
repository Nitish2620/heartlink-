import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, EyeOff, Sparkles, Heart } from 'lucide-react';
import { DatingFeedPost } from './HeartLinkFeedView';

interface BlindDateFeedProps {
  posts: DatingFeedPost[];
  onSendOpener?: (authorName: string, promptText: string) => void;
}

export const BlindDateFeed: React.FC<BlindDateFeedProps> = ({ posts, onSendOpener }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto space-y-8 pb-10"
    >
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/20 mb-2">
          <EyeOff className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Blind Date Feed</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Photos are blurred. Focus on personality, prompts, and vibes. Exchange 5 messages to reveal each other's photos.
        </p>
      </div>

      {posts.map((post, i) => (
        <BlindDateCard 
          key={post.id} 
          post={post} 
          index={i} 
          onSendOpener={onSendOpener} 
        />
      ))}
    </motion.div>
  );
};

const BlindDateCard = ({ post, index, onSendOpener }: { post: DatingFeedPost, index: number, onSendOpener?: (n: string, p: string) => void }) => {
  const bgImage = post.images?.[0] || post.authorDetails.avatar;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900"
    >
      {/* Blurred Background Header */}
      <div className="relative h-48 w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        {/* Extreme Blur Overlay */}
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider border border-white/10">
            Mystery Match
          </span>
          <span className="px-3 py-1 rounded-full bg-rose-500/80 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider border border-white/10 shadow-xs">
            {post.authorDetails.intent}
          </span>
        </div>

        {/* Reveal Progress Meter */}
        <div className="absolute top-4 right-4">
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider drop-shadow-md">
              Reveal Progress
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="w-4 h-1.5 rounded-full bg-white/20 overflow-hidden">
                  {/* Empty right now since 0 messages sent */}
                </div>
              ))}
            </div>
            <span className="text-[9px] text-white/60">0/5 messages</span>
          </div>
        </div>

        {/* Floating Avatar (Blurred) */}
        <div className="absolute -bottom-8 left-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-lg z-10">
              <img 
                src={post.authorDetails.avatar} 
                alt="Mystery User" 
                className="w-full h-full object-cover blur-xl opacity-80"
              />
            </div>
            {/* Lock Icon */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-slate-900 border-2 border-white dark:border-slate-900 flex items-center justify-center z-20 shadow-sm">
              <EyeOff className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="pt-12 pb-6 px-6 space-y-6">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            Mystery {post.authorDetails.age}
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              {post.authorDetails.distance}
            </span>
          </h3>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
            "{post.content}"
          </p>
        </div>

        {/* The Main Attraction: Prompts */}
        <div className="space-y-4">
          {post.promptAnswer ? (
            <div className="p-5 rounded-2xl bg-[#F5F6F9] dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 relative group transition-colors hover:bg-white dark:hover:bg-slate-800 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1 mb-2">
                <Sparkles className="w-3 h-3" /> {post.promptAnswer.category || 'Profile Prompt'}
              </span>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 mb-2">
                "{post.promptAnswer.question}"
              </h4>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic">
                {post.promptAnswer.answer}
              </p>
              
              {/* Quick Reply Button on Prompt */}
              <button 
                onClick={() => onSendOpener?.("Mystery Match", `"${post.promptAnswer!.question}" → "${post.promptAnswer!.answer}"`)}
                className="absolute -bottom-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full px-4 py-1.5 text-xs font-bold shadow-lg flex items-center gap-1.5 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Reply to this
              </button>
            </div>
          ) : (
            /* Fallback prompt if post doesn't have one */
            <div className="p-5 rounded-2xl bg-[#F5F6F9] dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 relative group transition-colors hover:bg-white dark:hover:bg-slate-800 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1 mb-2">
                <Heart className="w-3 h-3" /> Two Truths and a Lie
              </span>
              <ul className="text-sm font-medium text-slate-700 dark:text-slate-300 space-y-2 list-disc list-inside">
                <li>I've never been on a rollercoaster.</li>
                <li>I can speak three languages fluently.</li>
                <li>I once accidentally joined a cult for a day.</li>
              </ul>
              <button 
                onClick={() => onSendOpener?.("Mystery Match", "Guessing your lie: You've never been on a rollercoaster?")}
                className="absolute -bottom-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-full px-4 py-1.5 text-xs font-bold shadow-lg flex items-center gap-1.5 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Guess the Lie
              </button>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <p className="text-xs text-slate-500 font-medium">
            Send a message to start unlocking their photo.
          </p>
          <button
            onClick={() => onSendOpener?.("Mystery Match", "Hey! Ready to uncover the mystery?")}
            className="w-10 h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-md"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
