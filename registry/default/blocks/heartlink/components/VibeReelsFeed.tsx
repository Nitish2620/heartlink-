import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, MapPin, Sparkles } from 'lucide-react';
import { DatingFeedPost } from './HeartLinkFeedView';

interface VibeReelsFeedProps {
  posts: DatingFeedPost[];
  onSendOpener?: (authorName: string, promptText: string) => void;
}

export const VibeReelsFeed: React.FC<VibeReelsFeedProps> = ({ posts, onSendOpener }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePostId, setActivePostId] = useState<string>(posts[0]?.id);

  // We can track which post is in view using IntersectionObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActivePostId(entry.target.getAttribute('data-post-id') || '');
          }
        });
      },
      {
        root: container,
        threshold: 0.6,
      }
    );

    const children = Array.from(container.children);
    children.forEach((child) => observer.observe(child));

    return () => {
      children.forEach((child) => observer.unobserve(child));
    };
  }, [posts]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full min-h-[600px] overflow-y-scroll snap-y snap-mandatory rounded-3xl bg-black scrollbar-hide relative shadow-2xl"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {posts.map((post) => (
        <VibeReelItem 
          key={post.id} 
          post={post} 
          isActive={activePostId === post.id}
          onSendOpener={onSendOpener}
        />
      ))}
    </div>
  );
};

const VibeReelItem = ({ post, isActive, onSendOpener }: { post: DatingFeedPost, isActive: boolean, onSendOpener?: (n: string, p: string) => void }) => {
  const [showHeart, setShowHeart] = useState<{ x: number, y: number, id: number } | null>(null);
  const [liked, setLiked] = useState(false);

  // For prototype, if they don't have images, we'll use a dynamic gradient background to simulate a video
  const bgImage = post.images?.[0] || 'https://images.unsplash.com/photo-1516280440502-6c9fa1a33d9c?w=800&auto=format&fit=crop&q=80';

  const handleDoubleTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setLiked(true);
    setShowHeart({ x, y, id: Date.now() });
    
    setTimeout(() => {
      setShowHeart(null);
    }, 1000);
  };

  return (
    <div 
      data-post-id={post.id}
      className="w-full h-full snap-start snap-always relative flex items-center justify-center shrink-0"
    >
      {/* Background Image / Video Simulation */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
        style={{ 
          backgroundImage: `url(${bgImage})`,
          transform: isActive ? 'scale(1)' : 'scale(1.1)',
        }}
        onClick={handleDoubleTap}
      />
      
      {/* Dark Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none" />

      {/* Floating Double Tap Heart Particle */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            key={showHeart.id}
            initial={{ opacity: 0, scale: 0.5, y: showHeart.y, x: showHeart.x - 40 }}
            animate={{ opacity: 1, scale: 1.5, y: showHeart.y - 100 }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100 }}
            className="absolute pointer-events-none z-50 text-rose-500"
          >
            <Heart className="w-20 h-20 fill-rose-500 drop-shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content - Bottom Left */}
      <div className="absolute bottom-6 left-6 right-20 z-20 pointer-events-none">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full border-2 border-white/50 overflow-hidden shadow-lg p-[2px] bg-white/10 backdrop-blur-md">
            <img 
              src={post.authorDetails.avatar} 
              alt={post.authorDetails.name} 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <h3 className="text-white font-black text-lg flex items-center gap-2 drop-shadow-md">
              {post.authorDetails.name}, {post.authorDetails.age}
              {post.authorDetails.verified && (
                <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white">✓</span>
              )}
            </h3>
            <p className="text-white/80 text-xs font-medium flex items-center gap-1 drop-shadow-md">
              <MapPin className="w-3 h-3" /> {post.authorDetails.distance}
            </p>
          </div>
        </div>
        
        <p className="text-white text-sm font-medium mb-3 drop-shadow-md line-clamp-3">
          {post.content}
        </p>

        {post.promptAnswer && (
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 p-3 rounded-2xl max-w-sm pointer-events-auto shadow-xl">
            <p className="text-[10px] text-purple-300 font-bold uppercase mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {post.promptAnswer.category || 'Vibe Prompt'}
            </p>
            <p className="text-white text-xs font-bold mb-1">"{post.promptAnswer.question}"</p>
            <p className="text-white/80 text-xs italic">{post.promptAnswer.answer}</p>
          </div>
        )}
      </div>

      {/* Action Buttons - Right Side */}
      <div className="absolute right-4 bottom-12 z-30 flex flex-col gap-5 items-center">
        <button 
          onClick={() => setLiked(!liked)}
          className="group flex flex-col items-center gap-1 cursor-pointer transition hover:scale-110 active:scale-95"
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/20 shadow-xl ${liked ? 'bg-rose-500/20 border-rose-500/50' : ''}`}>
            <Heart className={`w-6 h-6 transition-colors ${liked ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
          </div>
          <span className="text-white text-[10px] font-bold drop-shadow-md">
            {liked ? '1.2K' : '1.1K'}
          </span>
        </button>

        <button 
          onClick={() => onSendOpener?.(post.authorDetails.name, post.content)}
          className="group flex flex-col items-center gap-1 cursor-pointer transition hover:scale-110 active:scale-95"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/20 shadow-xl group-hover:bg-purple-500/20 group-hover:border-purple-500/50">
            <MessageCircle className="w-6 h-6 text-white group-hover:text-purple-300 transition-colors" />
          </div>
          <span className="text-white text-[10px] font-bold drop-shadow-md">Opener</span>
        </button>

        <button className="group flex flex-col items-center gap-1 cursor-pointer transition hover:scale-110 active:scale-95">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/20 shadow-xl">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-[10px] font-bold drop-shadow-md">Share</span>
        </button>
      </div>
    </div>
  );
};
