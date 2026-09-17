import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Navigation, 
  Sparkles, 
  Heart, 
  Globe, 
  Play, 
  Pause, 
  Filter, 
  MessageCircle, 
  Flame, 
  UserCheck, 
  ShieldCheck, 
  Volume2, 
  X,
  Compass,
  Zap,
  Radio
} from 'lucide-react';
import type { DatingFeedPost } from './HeartLinkFeedView';
import { cn } from '@/lib/utils';

// --- Orbiting Circles Subcomponent ---
interface OrbitingCirclesProps {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  isGlobeMode?: boolean;
  isPaused?: boolean;
  speedMultiplier?: number;
}

export function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 20,
  delay = 0,
  radius = 120,
  path = true,
  isGlobeMode = true,
  isPaused = false,
  speedMultiplier = 1,
}: OrbitingCirclesProps) {
  const calculatedDuration = Math.max(2, duration / speedMultiplier);

  return (
    <>
      {/* SVG Dashed Orbit Line */}
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full overflow-visible"
        >
          <defs>
            <linearGradient id={`orbit-grad-${radius}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <circle
            className="stroke-slate-300/40 dark:stroke-slate-700/60 stroke-1 transition-all duration-500"
            cx="50%"
            cy={isGlobeMode ? "82%" : "50%"}
            r={radius}
            fill="none"
            strokeDasharray="4 6"
          />
          {/* Animated active accent ring overlay */}
          <circle
            className="stroke-rose-500/30 dark:stroke-rose-400/30 stroke-1 animate-pulse"
            cx="50%"
            cy={isGlobeMode ? "82%" : "50%"}
            r={radius}
            fill="none"
            strokeDasharray="2 12"
          />
        </svg>
      )}

      {/* Orbit Container with CSS Keyframe Animation */}
      <div
        style={
          {
            "--duration": `${calculatedDuration}s`,
            "--radius": `${radius}px`,
            "--delay": `-${delay}s`,
            "--center-y": isGlobeMode ? "82%" : "50%",
          } as React.CSSProperties
        }
        className={cn(
          "absolute flex size-full transform-gpu items-center justify-center pointer-events-none",
          isGlobeMode ? "animate-orbit-globe" : "animate-orbit-full",
          {
            "[animation-direction:reverse]": reverse,
            "[animation-play-state:paused]": isPaused,
          },
          className
        )}
      >
        <div className="pointer-events-auto">
          {children}
        </div>
      </div>
    </>
  );
}

// --- Interactive 3D Dotted Globe Canvas (Centerpiece) ---
const GlobeParticleCanvas: React.FC<{ isGlobeMode: boolean }> = ({ isGlobeMode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate 3D sphere dots
    const numDots = 280;
    const radius = Math.min(width, height) * 0.22;
    const dots: { x: number; y: number; z: number; baseSize: number }[] = [];

    for (let i = 0; i < numDots; i++) {
      const phi = Math.acos(-1 + (2 * i) / numDots);
      const theta = Math.sqrt(numDots * Math.PI) * phi;
      dots.push({
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        baseSize: Math.random() * 1.8 + 1,
      });
    }

    let angleY = 0;
    let pulseRadius = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      angleY += 0.006;

      const centerX = width / 2;
      const centerY = isGlobeMode ? height * 0.82 : height / 2;

      // Draw Sonar Pulse Waves
      pulseRadius = (pulseRadius + 1.2) % 180;
      const pulseAlpha = Math.max(0, 1 - pulseRadius / 180);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(244, 63, 94, ${pulseAlpha * 0.4})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, (pulseRadius + 60) % 180, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(139, 92, 246, ${Math.max(0, 1 - ((pulseRadius + 60) % 180) / 180) * 0.3})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw 3D Rotating Sphere Dots
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      dots.forEach((dot) => {
        // Rotate around Y axis
        const rx = dot.x * cosY - dot.z * sinY;
        const ry = dot.y;
        const rz = dot.x * sinY + dot.z * cosY;

        // Clip bottom half if in Globe Mode for semi-sphere aesthetic
        if (isGlobeMode && ry > radius * 0.25) return;

        // Perspective projection
        const perspective = 400;
        const scale = perspective / (perspective + rz + 100);
        const projX = centerX + rx * scale;
        const projY = centerY + ry * scale;

        const alpha = Math.max(0.15, (rz + radius) / (2 * radius));
        const size = dot.baseSize * scale;

        ctx.beginPath();
        ctx.arc(projX, projY, size, 0, Math.PI * 2);
        
        // Gradient coloring based on depth
        if (rz > 0) {
          ctx.fillStyle = `rgba(244, 63, 94, ${alpha * 0.85})`;
        } else {
          ctx.fillStyle = `rgba(168, 85, 247, ${alpha * 0.6})`;
        }
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isGlobeMode]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 size-full pointer-events-none z-0"
    />
  );
};

// --- Extended Match Dataset for Rich Orbits ---
const EXTRA_RADAR_MATCHES: DatingFeedPost[] = [
  {
    id: 'post_radar_1',
    authorDetails: {
      name: 'Elena Rostova',
      age: 26,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      location: 'Brooklyn, NY',
      distance: '0.8 miles away',
      verified: true,
      intent: 'Long-term relationship'
    },
    timestamp: '15 mins ago',
    content: 'Searching for someone to try authentic ramen joints & talk about indie cinema 🍜🍿',
    promptAnswer: {
      question: 'Ideal Sunday Morning',
      answer: 'Farmer’s market strolls, fresh pastries, and reading Murakami in the park.'
    }
  },
  {
    id: 'post_radar_2',
    authorDetails: {
      name: 'Julian Vance',
      age: 28,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      location: 'SoHo, NY',
      distance: '1.4 miles away',
      verified: true,
      intent: 'Deep connection'
    },
    timestamp: '42 mins ago',
    content: 'Architect by day, vinyl record collector by night. Let us exchange favorite tracks! 🎶',
    promptAnswer: {
      question: 'Key to my heart',
      answer: 'Good espresso and a sense of curiosity about the world.'
    }
  },
  {
    id: 'post_radar_3',
    authorDetails: {
      name: 'Aria Chen',
      age: 23,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
      location: 'West Village, NY',
      distance: '2.1 miles away',
      verified: true,
      intent: 'Spontaneous fun'
    },
    timestamp: '1 hour ago',
    content: 'Spontaneous bouldering session followed by gelato? Who is down? 🧗‍♀️🍨',
    promptAnswer: {
      question: 'Together we could...',
      answer: 'Conquer the hardest climbs and find the best hidden rooftop views.'
    }
  },
  {
    id: 'post_radar_4',
    authorDetails: {
      name: 'Lucas Thorne',
      age: 27,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      location: 'Greenpoint, NY',
      distance: '3.2 miles away',
      verified: true,
      intent: 'Deep connection'
    },
    timestamp: '2 hours ago',
    content: 'Currently building an analog synth and drinking pour-overs. Let us collaborate! 🎹☕',
    promptAnswer: {
      question: 'My simple pleasures',
      answer: 'Rainy afternoon ambient music sessions.'
    }
  }
];

export interface RadarFeedProps {
  posts: DatingFeedPost[];
  onProfileClick?: (post: DatingFeedPost) => void;
}

export const RadarFeed: React.FC<RadarFeedProps> = ({ posts, onProfileClick }) => {
  const [isGlobeMode, setIsGlobeMode] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [hoveredMatchId, setHoveredMatchId] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<DatingFeedPost | null>(null);
  const [distanceFilter, setDistanceFilter] = useState<'all' | 'near' | 'mid'>('all');

  // Combine parent posts with extra rich match profiles
  const allMatches = useMemo(() => {
    const combined = [...posts, ...EXTRA_RADAR_MATCHES];
    // Deduplicate by ID or name
    const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
    
    if (distanceFilter === 'near') {
      return unique.filter(m => parseFloat(m.authorDetails.distance) <= 2.0);
    }
    if (distanceFilter === 'mid') {
      return unique.filter(m => parseFloat(m.authorDetails.distance) <= 3.5);
    }
    return unique;
  }, [posts, distanceFilter]);

  // Assign concentric orbit radiuses, durations, and stagger delays
  const orbitConfigurations = [
    { radius: isGlobeMode ? 140 : 110, duration: 22, reverse: false },
    { radius: isGlobeMode ? 220 : 180, duration: 32, reverse: true },
    { radius: isGlobeMode ? 300 : 250, duration: 42, reverse: false },
    { radius: isGlobeMode ? 380 : 320, duration: 52, reverse: true },
  ];

  // Distribute match items evenly across orbits
  const orbitItems = useMemo(() => {
    const distributed: { post: DatingFeedPost; orbitIndex: number; delay: number; matchPercent: number }[] = [];
    allMatches.forEach((post, index) => {
      const orbitIndex = index % orbitConfigurations.length;
      const itemsInThisOrbit = Math.floor(allMatches.length / orbitConfigurations.length) + 1;
      const stepDelay = orbitConfigurations[orbitIndex].duration / Math.max(1, itemsInThisOrbit);
      const delay = (index * 6) % orbitConfigurations[orbitIndex].duration;
      const matchPercent = 88 + ((index * 3 + 7) % 11);

      distributed.push({
        post,
        orbitIndex,
        delay,
        matchPercent
      });
    });
    return distributed;
  }, [allMatches, orbitConfigurations]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="w-full h-full min-h-[620px] flex flex-col items-center justify-between relative overflow-hidden bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl p-4 sm:p-6"
    >
      {/* Inline Keyframe Styles for Upright Orbit Navigation */}
      <style>{`
        @keyframes orbitGlobe {
          0% {
            transform: rotate(-90deg) translateY(calc(var(--radius) * 1px)) rotate(90deg);
          }
          100% {
            transform: rotate(270deg) translateY(calc(var(--radius) * 1px)) rotate(-270deg);
          }
        }

        @keyframes orbitFull {
          0% {
            transform: rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg);
          }
        }

        .animate-orbit-globe {
          top: var(--center-y);
          left: 50%;
          animation: orbitGlobe var(--duration) linear infinite;
        }

        .animate-orbit-full {
          top: var(--center-y);
          left: 50%;
          animation: orbitFull var(--duration) linear infinite;
        }
      `}</style>

      {/* --- TOP CONTROL & STATUS HEADER --- */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 bg-slate-900/60 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-slate-800/80 shadow-lg">
        
        {/* Title & Live Status */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 shadow-md">
            <Radio className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-ping" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2 tracking-tight">
              Orbiting Match Radar
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LIVE • {allMatches.length} Matches Nearby
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Real-time match affinity floating in your location orbit.
            </p>
          </div>
        </div>

        {/* Toolbar Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          
          {/* Mode Switcher */}
          <div className="flex bg-slate-800/90 p-1 rounded-xl border border-slate-700/60">
            <button
              type="button"
              onClick={() => setIsGlobeMode(true)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer",
                isGlobeMode 
                  ? "bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Globe className="w-3.5 h-3.5" /> Globe Arc
            </button>
            <button
              type="button"
              onClick={() => setIsGlobeMode(false)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer",
                !isGlobeMode 
                  ? "bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Compass className="w-3.5 h-3.5" /> 360° Radar
            </button>
          </div>

          {/* Pause / Play Controls */}
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-xl bg-slate-800/90 border border-slate-700/60 text-slate-300 hover:text-white transition cursor-pointer"
            title={isPaused ? "Resume Orbit" : "Pause Orbit"}
          >
            {isPaused ? <Play className="w-4 h-4 fill-emerald-400 text-emerald-400" /> : <Pause className="w-4 h-4 text-slate-300" />}
          </button>

          {/* Speed Multiplier Button */}
          <button
            type="button"
            onClick={() => setSpeedMultiplier(prev => (prev === 1 ? 2 : prev === 2 ? 0.5 : 1))}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/60 text-xs font-extrabold text-rose-400 hover:bg-slate-800 transition cursor-pointer"
          >
            {speedMultiplier}x Speed
          </button>

          {/* Distance Filter Chips */}
          <div className="flex bg-slate-800/90 p-1 rounded-xl border border-slate-700/60 text-xs font-bold">
            <button
              type="button"
              onClick={() => setDistanceFilter('all')}
              className={cn("px-2 py-1 rounded-lg transition cursor-pointer", distanceFilter === 'all' ? "bg-slate-700 text-white" : "text-slate-400")}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setDistanceFilter('near')}
              className={cn("px-2 py-1 rounded-lg transition cursor-pointer", distanceFilter === 'near' ? "bg-slate-700 text-white" : "text-slate-400")}
            >
              &lt;2mi
            </button>
          </div>

        </div>
      </div>

      {/* --- MAIN RADAR ORBIT DISPLAY STAGE --- */}
      <div className="relative w-full h-[520px] flex items-center justify-center overflow-visible my-auto">
        
        {/* 3D Dotted Canvas Globe / Sonar Pulse Background */}
        <GlobeParticleCanvas isGlobeMode={isGlobeMode} />

        {/* Central Core (User Profile / Heart Hub) */}
        <div 
          className={cn(
            "absolute flex flex-col items-center justify-center z-10 transition-all duration-700 pointer-events-none",
            isGlobeMode ? "bottom-[18%] left-1/2 -translate-x-1/2" : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          )}
        >
          {/* Pulse Glow Effect */}
          <div className="absolute w-28 h-28 rounded-full bg-rose-500/20 animate-ping blur-xl" />
          <div className="w-20 h-20 rounded-full border-2 border-rose-500 bg-slate-900/90 backdrop-blur-xl shadow-[0_0_40px_rgba(244,63,94,0.4)] flex flex-col items-center justify-center relative overflow-hidden pointer-events-auto cursor-pointer group">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-rose-400/50">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" 
                alt="You" 
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-rose-600/90 text-center py-0.5">
              <span className="text-[9px] font-black uppercase text-white tracking-widest flex items-center justify-center gap-0.5">
                <Flame className="w-2.5 h-2.5 fill-white" /> YOU
              </span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-400 mt-2 tracking-wide">
            Your Vibe Center
          </span>
        </div>

        {/* Concentric Orbit Rings with Floating Profile Nodes */}
        {orbitItems.map(({ post, orbitIndex, delay, matchPercent }) => {
          const config = orbitConfigurations[orbitIndex];
          const isHovered = hoveredMatchId === post.id;

          return (
            <OrbitingCircles
              key={post.id}
              radius={config.radius}
              duration={config.duration}
              reverse={config.reverse}
              delay={delay}
              isGlobeMode={isGlobeMode}
              isPaused={isPaused || isHovered}
              speedMultiplier={speedMultiplier}
              className="z-20"
            >
              {/* Floating Match Node */}
              <div 
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredMatchId(post.id)}
                onMouseLeave={() => setHoveredMatchId(null)}
                onClick={() => {
                  setSelectedMatch(post);
                  onProfileClick?.(post);
                }}
              >
                {/* Match Percentage Pill Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 px-2 py-0.5 rounded-full bg-slate-900/90 border border-rose-500/40 text-[9px] font-black text-rose-400 shadow-md whitespace-nowrap flex items-center gap-0.5">
                  <Zap className="w-2.5 h-2.5 fill-rose-400" />
                  {matchPercent}% Match
                </div>

                {/* Avatar Frame */}
                <div className={cn(
                  "w-13 h-13 rounded-full border-2 transition-all duration-300 overflow-hidden relative shadow-xl flex items-center justify-center bg-slate-900",
                  isHovered 
                    ? "border-rose-400 scale-125 shadow-[0_0_25px_rgba(244,63,94,0.6)] z-40" 
                    : post.authorDetails.intent === 'Long-term relationship'
                    ? "border-rose-500/80"
                    : post.authorDetails.intent === 'Deep connection'
                    ? "border-purple-500/80"
                    : "border-amber-500/80"
                )}>
                  <img 
                    src={post.authorDetails.avatar} 
                    alt={post.authorDetails.name} 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Online Indicator */}
                  <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                </div>

                {/* Quick Name Badge below avatar */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 rounded-md bg-slate-900/80 text-[10px] font-bold text-slate-200 whitespace-nowrap max-w-[80px] truncate border border-slate-800">
                  {post.authorDetails.name.split(' ')[0]}
                </div>

                {/* --- MNC-GRADE GLASS POPUP CARD ON HOVER --- */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-60 bg-slate-900/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-700/80 p-4 z-50 pointer-events-none"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={post.authorDetails.avatar} 
                          alt="Match" 
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-rose-500/40"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-sm text-white flex items-center gap-1 truncate">
                            {post.authorDetails.name}, {post.authorDetails.age}
                            {post.authorDetails.verified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20 shrink-0" />
                            )}
                          </h4>
                          <p className="text-[11px] font-semibold text-rose-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {post.authorDetails.distance}
                          </p>
                        </div>
                      </div>

                      {/* Intent Pill */}
                      <div className="mt-2.5 inline-block px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-[10px] font-extrabold text-purple-300">
                        ✨ {post.authorDetails.intent}
                      </div>

                      {/* Prompt Quote */}
                      <p className="mt-2.5 text-xs text-slate-300 font-medium italic line-clamp-2 bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
                        "{post.content}"
                      </p>

                      {/* Action Prompt */}
                      <div className="mt-3 flex items-center justify-between text-[10px] font-extrabold text-rose-400 pt-2 border-t border-slate-800">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" /> Click to Connect
                        </span>
                        <span className="text-emerald-400 font-bold">
                          {matchPercent}% Vibe Match
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </OrbitingCircles>
          );
        })}

      </div>

      {/* --- FOOTER INFORMATIONAL BAR --- */}
      <div className="w-full flex items-center justify-between text-xs text-slate-400 font-medium pt-3 border-t border-slate-800/80 z-20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>Proximity Radar: <strong className="text-slate-200">Active</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500">Hover avatar to inspect • Click to initiate match</span>
        </div>
      </div>

      {/* --- DETAILED MATCH MODAL ON CLICK --- */}
      <AnimatePresence>
        {selectedMatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-white space-y-4"
            >
              <button
                type="button"
                onClick={() => setSelectedMatch(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4">
                <img
                  src={selectedMatch.authorDetails.avatar}
                  alt={selectedMatch.authorDetails.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-rose-500"
                />
                <div>
                  <h3 className="text-lg font-black flex items-center gap-1.5">
                    {selectedMatch.authorDetails.name}, {selectedMatch.authorDetails.age}
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                  </h3>
                  <p className="text-xs text-rose-400 font-semibold flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" /> {selectedMatch.authorDetails.distance}
                  </p>
                  <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-extrabold">
                    {selectedMatch.authorDetails.intent}
                  </span>
                </div>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 space-y-2">
                <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Latest Vibe Note
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  "{selectedMatch.content}"
                </p>
              </div>

              {selectedMatch.promptAnswer && (
                <div className="bg-purple-950/40 p-4 rounded-2xl border border-purple-500/30 space-y-1">
                  <h4 className="text-xs font-extrabold text-purple-300">
                    "{selectedMatch.promptAnswer.question}"
                  </h4>
                  <p className="text-xs font-medium text-slate-200">
                    {selectedMatch.promptAnswer.answer}
                  </p>
                </div>
              )}

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onProfileClick?.(selectedMatch);
                    setSelectedMatch(null);
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" /> Send Opener
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMatch(null)}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-2xl transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};
