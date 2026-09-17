import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Sparkles } from 'lucide-react';
import { DatingFeedPost } from './HeartLinkFeedView';

interface RadarMatch extends DatingFeedPost {
  angle: number;
  radius: number; // percentage from center
}

interface RadarFeedProps {
  posts: DatingFeedPost[];
  onProfileClick?: (post: DatingFeedPost) => void;
}

export const RadarFeed: React.FC<RadarFeedProps> = ({ posts, onProfileClick }) => {
  const [radarMatches, setRadarMatches] = useState<RadarMatch[]>([]);
  const [hoveredMatch, setHoveredMatch] = useState<string | null>(null);
  
  useEffect(() => {
    // Generate pseudo-random positions for the radar map based on the post ID
    const mapped = posts.slice(0, 8).map((post, i) => {
      // Create a deterministic pseudo-random distribution
      const pseudoRandomAngle = (post.id.charCodeAt(post.id.length - 1) * 45 + i * 37) % 360;
      const pseudoRandomRadius = 25 + ((post.id.charCodeAt(0) * 17) % 65); // 25% to 90% distance from center
      
      return {
        ...post,
        angle: pseudoRandomAngle,
        radius: pseudoRandomRadius,
      };
    });
    setRadarMatches(mapped);
  }, [posts]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full h-full min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-6"
    >
      <div className="absolute top-6 left-6 z-20">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <Navigation className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
          Missed Connections
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
          People you've crossed paths with recently. Stay nearby to establish connection.
        </p>
      </div>

      {/* Radar Background & Grid */}
      <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)] flex items-center justify-center mt-8">
        
        {/* Concentric Rings */}
        <div className="absolute inset-4 rounded-full border border-emerald-500/20" />
        <div className="absolute inset-16 rounded-full border border-emerald-500/20" />
        <div className="absolute inset-28 rounded-full border border-emerald-500/20" />
        
        {/* Crosshairs */}
        <div className="absolute w-full h-[1px] bg-emerald-500/20" />
        <div className="absolute h-full w-[1px] bg-emerald-500/20" />
        
        {/* Center Node (You) */}
        <div className="absolute w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)] z-10">
          <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
        </div>

        {/* Sweeping Radar Beam */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute w-[50%] h-[50%] top-0 left-[50%] origin-bottom-left"
          style={{
            background: 'conic-gradient(from 0deg, rgba(16,185,129,0) 0%, rgba(16,185,129,0.1) 70%, rgba(16,185,129,0.4) 100%)',
            clipPath: 'polygon(0 100%, 100% 0, 100% 100%)'
          }}
        />

        {/* Radar Nodes */}
        {radarMatches.map((match) => {
          // Convert polar to cartesian coordinates (0,0 is center)
          // angle 0 is top, 90 is right, 180 is bottom, 270 is left
          const rad = (match.angle - 90) * (Math.PI / 180);
          const x = (match.radius / 100) * 50 * Math.cos(rad);
          const y = (match.radius / 100) * 50 * Math.sin(rad);
          
          const isHovered = hoveredMatch === match.id;

          return (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.random() * 0.5 + 0.2 }}
              className="absolute z-20"
              style={{
                left: `calc(50% + ${x}%)`,
                top: `calc(50% + ${y}%)`,
                transform: 'translate(-50%, -50%)'
              }}
              onMouseEnter={() => setHoveredMatch(match.id)}
              onMouseLeave={() => setHoveredMatch(null)}
              onClick={() => onProfileClick?.(match)}
            >
              <div className="relative group cursor-pointer">
                {/* Ping animation when not hovered */}
                {!isHovered && (
                  <div className="absolute inset-0 rounded-full bg-rose-500/40 animate-ping" />
                )}
                
                {/* The Avatar */}
                <div className={`w-10 h-10 rounded-full border-2 transition-all duration-500 overflow-hidden ${isHovered ? 'border-rose-500 scale-125 shadow-[0_0_20px_rgba(244,63,94,0.5)] z-30' : 'border-slate-700 bg-slate-800'}`}>
                  <img 
                    src={match.authorDetails.avatar} 
                    alt="Match" 
                    className={`w-full h-full object-cover transition-all duration-1000 ${isHovered ? 'blur-0' : 'blur-md opacity-70'}`}
                  />
                </div>

                {/* Info Card Popover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 z-40 pointer-events-none"
                    >
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {match.authorDetails.name}, {match.authorDetails.age}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        {match.authorDetails.distance}
                      </p>
                      
                      <div className="mt-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
                        <p className="text-[10px] font-medium text-slate-700 dark:text-slate-300 line-clamp-2 italic">
                          "{match.content}"
                        </p>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-center gap-1 text-[9px] font-bold text-rose-500 uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" /> Connect Now
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
