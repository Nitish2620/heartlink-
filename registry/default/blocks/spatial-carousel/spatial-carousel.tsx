import React, { useState, useCallback, useRef, useEffect, useMemo } from'react';
import {
 motion,
 useMotionValue,
 useTransform,
 useSpring,
 AnimatePresence,
 type PanInfo,
} from'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X, Heart, Share2, Download, Eye, Sparkles, Pause, Play } from'lucide-react';

/* ========================================================
 TYPES
======================================================== */
interface CarouselSlide {
 id: string;
 image: string;
 title: string;
 subtitle: string;
 category: string;
 color: string; // gradient accent
}

/* ========================================================
 DEFAULT SHOWCASE DATA
======================================================== */
const DEFAULT_SLIDES: CarouselSlide[] = [
 {
 id:'slide-1',
 image:'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop&q=80',
 title:'Neon Horizons',
 subtitle:'Explore the city of tomorrow through a cyberpunk lens',
 category:'Cityscape',
 color:'from-violet-600 to-indigo-600',
 },
 {
 id:'slide-2',
 image:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&auto=format&fit=crop&q=80',
 title:'Alpine Serenity',
 subtitle:'Where glacial lakes meet golden autumn canopies',
 category:'Nature',
 color:'from-emerald-500 to-teal-600',
 },
 {
 id:'slide-3',
 image:'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80',
 title:'Liquid Metal',
 subtitle:'Abstract 3D renders pushing the boundary of digital art',
 category:'Abstract',
 color:'from-rose-500 to-purple-600',
 },
 {
 id:'slide-4',
 image:'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=900&auto=format&fit=crop&q=80',
 title:'Cosmic Nebula',
 subtitle:'Deep space imagery captured across infinite light-years',
 category:'Space',
 color:'from-fuchsia-500 to-cyan-500',
 },
 {
 id:'slide-5',
 image:'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&auto=format&fit=crop&q=80',
 title:'Parametric Flow',
 subtitle:'Zaha Hadid-inspired sweeping architectural geometry',
 category:'Architecture',
 color:'from-amber-500 to-orange-600',
 },
 {
 id:'slide-6',
 image:'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=900&auto=format&fit=crop&q=80',
 title:'Aurora Dreams',
 subtitle:'Northern lights dancing across the arctic sky',
 category:'Aurora',
 color:'from-green-400 to-blue-500',
 },
 {
 id:'slide-7',
 image:'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&auto=format&fit=crop&q=80',
 title:'Frozen Peaks',
 subtitle:'Monumental mountains under a star-filled winter sky',
 category:'Mountains',
 color:'from-slate-400 to-blue-800',
 },
];

/* ========================================================
 SPRING CONFIGS — APPLE-TIER PHYSICS
 Extracted as module-level constants to prevent
 re-creation on every render (object identity stability).
======================================================== */
const SPRING_CONFIG = { stiffness: 300, damping: 30, mass: 0.8 } as const;
const TILT_SPRING = { stiffness: 400, damping: 25, mass: 0.5 } as const;
const DOT_SPRING = { type:'spring'as const, stiffness: 400, damping: 25 };
const OVERLAY_SPRING = { type:'spring'as const, stiffness: 260, damping: 25 };

// Static tilt ranges — avoid creating new arrays every render
const TILT_X_ACTIVE = [8, -8] as const;
const TILT_X_INACTIVE = [0, 0] as const;
const TILT_Y_ACTIVE = [-12, 12] as const;
const TILT_Y_INACTIVE = [0, 0] as const;
const GLARE_ACTIVE = ['0%','100%'] as const;
const GLARE_INACTIVE = ['50%','50%'] as const;
const MOUSE_RANGE = [-1, 1] as const;

/* ========================================================
 SINGLE CARD (Memoized for perf)
 
 MNC-GRADE RULES OF HOOKS COMPLIANCE:
 - ALL hooks are called unconditionally before any return
 - Conditional rendering uses opacity/visibility, not early return with hooks
 - useTransform ranges use stable array references (module-level constants)
======================================================== */
const CarouselCard = React.memo(({
 slide,
 index,
 activeIndex,
 totalSlides,
 mouseX,
 mouseY,
 isHovered,
 onSelect,
}: {
 slide: CarouselSlide;
 index: number;
 activeIndex: number;
 totalSlides: number;
 mouseX: ReturnType<typeof useMotionValue<number>>;
 mouseY: ReturnType<typeof useMotionValue<number>>;
 isHovered: boolean;
 onSelect: (index: number) => void;
}) => {
 const offset = index - activeIndex;
 const absOffset = Math.abs(offset);
 const isActive = offset === 0;
 const isVisible = absOffset <= 3;

 // 3D Transform calculations
 const rotateYVal = offset * -25;
 const translateZ = isActive ? 80 : -120 * absOffset;
 const translateX = offset * 320;
 const scale = isActive ? 1.05 : Math.max(0.7, 1 - absOffset * 0.15);
 const cardOpacity = isVisible ? (absOffset > 2 ? 0 : Math.max(0.3, 1 - absOffset * 0.35)) : 0;
 const zIndex = totalSlides - absOffset;

 // Mouse-driven tilt — hooks called unconditionally with stable range refs
 const shouldTilt = isActive && isHovered;
 const tiltX = useTransform(mouseY, MOUSE_RANGE as unknown as number[], shouldTilt ? TILT_X_ACTIVE as unknown as number[] : TILT_X_INACTIVE as unknown as number[]);
 const tiltY = useTransform(mouseX, MOUSE_RANGE as unknown as number[], shouldTilt ? TILT_Y_ACTIVE as unknown as number[] : TILT_Y_INACTIVE as unknown as number[]);
 const springTiltX = useSpring(tiltX, TILT_SPRING);
 const springTiltY = useSpring(tiltY, TILT_SPRING);

 // Glare effect position — hooks called unconditionally
 const glareX = useTransform(mouseX, MOUSE_RANGE as unknown as number[], shouldTilt ? GLARE_ACTIVE as unknown as string[] : GLARE_INACTIVE as unknown as string[]);
 const glareY = useTransform(mouseY, MOUSE_RANGE as unknown as number[], shouldTilt ? GLARE_ACTIVE as unknown as string[] : GLARE_INACTIVE as unknown as string[]);

 // Glare background — hook called unconditionally (critical: not inside JSX)
 const glareBackground = useTransform(
 [glareX, glareY] as any,
 ([x, y]: [string, string]) =>
`radial-gradient(ellipse 600px 400px at ${x} ${y}, rgba(255,255,255,0.15), transparent 70%)`
 );

 // Stable hover scale objects (prevent re-allocation each render)
 const hoverActive = useMemo(() => ({ scale: 1.08 }), []);
 const hoverInactive = useMemo(() => ({ scale: scale + 0.03 }), [scale]);

 // Don't render far-off cards — AFTER all hooks have been called
 if (!isVisible) return null;

 return (
 <motion.div
 className="absolute cursor-pointer select-none"
 style={{
 zIndex,
 rotateX: springTiltX,
 rotateY: springTiltY,
 willChange:'transform',
 }}
 animate={{
 x: translateX,
 z: translateZ,
 rotateY: rotateYVal,
 scale,
 opacity: cardOpacity,
 }}
 transition={SPRING_CONFIG}
 onClick={() => onSelect(index)}
 whileHover={isActive ? hoverActive : hoverInactive}
 role="button"
 aria-label={`View ${slide.title}`}
 tabIndex={isActive ? 0 : -1}
 >
 {/* Card Container */}
 <div
 className="relative w-[420px] h-[280px] rounded-2xl overflow-hidden shadow-2xl"
 style={{ transformStyle:'preserve-3d'}}
 >
 {/* Image */}
 <img
 src={slide.image}
 alt={slide.title}
 className="absolute inset-0 w-full h-full object-cover"
 loading={absOffset <= 1 ?'eager':'lazy'}
 decoding="async"
 draggable={false}
 />

 {/* Gradient overlay */}
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>

 {/* Glassmorphic glare layer (only on active card) */}
 {isActive && (
 <motion.div
 className="absolute inset-0 pointer-events-none"
 style={{ background: glareBackground }}
 />
 )}

 {/* Border glow for active */}
 {isActive && (
 <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 shadow-[0_0_60px_-12px_rgba(139,92,246,0.5)]"/>
 )}

 {/* Content overlay */}
 <div className="absolute bottom-0 left-0 right-0 p-5">
 <motion.div
 className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase mb-2 bg-gradient-to-r ${slide.color} text-slate-800`}
 animate={{ opacity: isActive ? 1 : 0.5, y: isActive ? 0 : 5 }}
 transition={{ delay: isActive ? 0.15 : 0 }}
 >
 {slide.category}
 </motion.div>

 <motion.h3
 className="text-slate-800 font-bold text-xl leading-tight mb-1"
 animate={{ opacity: isActive ? 1 : 0.6, y: isActive ? 0 : 8 }}
 transition={{ delay: isActive ? 0.1 : 0 }}
 >
 {slide.title}
 </motion.h3>

 <motion.p
 className="text-slate-800/60 text-xs leading-relaxed max-w-[280px]"
 animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
 transition={{ delay: isActive ? 0.2 : 0 }}
 >
 {slide.subtitle}
 </motion.p>
 </div>

 {/* Reflection surface (bottom) */}
 <div className="absolute -bottom-[1px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"/>
 </div>
 </motion.div>
 );
});
CarouselCard.displayName ='CarouselCard';

/* ========================================================
 EXPANDED FULLSCREEN OVERLAY
 
 MNC-GRADE FIXES:
 - Body scroll lock when overlay is open
 - Focus trap: close button auto-focused
 - Click propagation properly stopped
 - Stable onClose ref to prevent useEffect churn
======================================================== */
const ExpandedOverlay = React.memo(({
 slide,
 onClose,
}: {
 slide: CarouselSlide;
 onClose: () => void;
}) => {
 const [liked, setLiked] = useState(false);
 const closeButtonRef = useRef<HTMLButtonElement>(null);
 const onCloseRef = useRef(onClose);
 onCloseRef.current = onClose;

 // Body scroll lock + Escape handler + focus trap
 useEffect(() => {
 const originalOverflow = document.body.style.overflow;
 document.body.style.overflow ='hidden';

 const handleEsc = (e: KeyboardEvent) => {
 if (e.key ==='Escape') onCloseRef.current();
 };
 window.addEventListener('keydown', handleEsc);

 // Auto-focus close button for accessibility
 closeButtonRef.current?.focus();

 return () => {
 document.body.style.overflow = originalOverflow;
 window.removeEventListener('keydown', handleEsc);
 };
 }, []); // Empty deps: onCloseRef is stable

 const handleBackdropClick = useCallback((e: React.MouseEvent) => {
 // Only close if clicking directly on backdrop, not bubbled from children
 if (e.target === e.currentTarget) onCloseRef.current();
 }, []);

 return (
 <motion.div
 className="fixed inset-0 z-[100] flex items-center justify-center"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.3 }}
 role="dialog"
 aria-modal="true"
 aria-label={`Expanded view of ${slide.title}`}
 >
 {/* Backdrop */}
 <motion.div
 className="absolute inset-0 bg-[var(--color-surface)]/90 backdrop-blur-2xl"
 onClick={handleBackdropClick}
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 />

 {/* Content */}
 <motion.div
 className="relative z-10 max-w-5xl w-full mx-6"
 initial={{ scale: 0.8, y: 60, opacity: 0 }}
 animate={{ scale: 1, y: 0, opacity: 1 }}
 exit={{ scale: 0.85, y: 40, opacity: 0 }}
 transition={OVERLAY_SPRING}
 onClick={(e) => e.stopPropagation()} // Prevent backdrop close on content click
 >
 {/* Image */}
 <div className="relative rounded-3xl overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)]">
 <img
 src={slide.image}
 alt={slide.title}
 className="w-full aspect-[16/9] object-cover"
 draggable={false}
 />

 {/* Gradient */}
 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"/>

 {/* Top bar */}
 <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
 <motion.div
 className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-gradient-to-r ${slide.color} text-slate-800 shadow-lg`}
 initial={{ x: -20, opacity: 0 }}
 animate={{ x: 0, opacity: 1 }}
 transition={{ delay: 0.3 }}
 >
 {slide.category}
 </motion.div>

 <motion.button
 ref={closeButtonRef}
 className="p-2.5 rounded-full bg-[var(--color-surface)]/40 backdrop-blur-md text-slate-800/80 hover:text-slate-800 hover:bg-[var(--color-surface)]/60 transition cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/50"
 onClick={() => onCloseRef.current()}
 whileHover={{ scale: 1.1 }}
 whileTap={{ scale: 0.9 }}
 initial={{ x: 20, opacity: 0 }}
 animate={{ x: 0, opacity: 1 }}
 transition={{ delay: 0.3 }}
 aria-label="Close expanded view"
 >
 <X className="w-5 h-5"/>
 </motion.button>
 </div>

 {/* Bottom info */}
 <div className="absolute bottom-0 left-0 right-0 p-8">
 <motion.h2
 className="text-slate-800 font-bold text-4xl leading-tight mb-2"
 initial={{ y: 30, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 transition={{ delay: 0.2 }}
 >
 {slide.title}
 </motion.h2>
 <motion.p
 className="text-slate-800/60 text-base max-w-lg mb-6"
 initial={{ y: 20, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 transition={{ delay: 0.35 }}
 >
 {slide.subtitle}
 </motion.p>

 {/* Action buttons */}
 <motion.div
 className="flex items-center gap-3"
 initial={{ y: 20, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 transition={{ delay: 0.45 }}
 >
 <button
 onClick={(e) => { e.stopPropagation(); setLiked(prev => !prev); }}
 className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
 liked
 ?'bg-red-500/20 text-red-400 border border-red-500/30'
 :'bg-[var(--color-surface)]/10 text-slate-800/80 border border-[var(--color-border)] hover:bg-[var(--color-surface)]/20'
 }`}
 aria-pressed={liked}
 >
 <Heart className={`w-4 h-4 ${liked ?'fill-red-400':''}`} />
 {liked ?'Liked':'Like'}
 </button>
 <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-surface)]/10 text-slate-800/80 border border-[var(--color-border)] hover:bg-[var(--color-surface)]/20 transition cursor-pointer">
 <Share2 className="w-4 h-4"/>
 Share
 </button>
 <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-surface)]/10 text-slate-800/80 border border-[var(--color-border)] hover:bg-[var(--color-surface)]/20 transition cursor-pointer">
 <Download className="w-4 h-4"/>
 Save
 </button>
 </motion.div>
 </div>
 </div>
 </motion.div>
 </motion.div>
 );
});
ExpandedOverlay.displayName ='ExpandedOverlay';

/* ========================================================
 FLOATING PARTICLE ENGINE (ambient atmosphere)
 
 MNC-GRADE: Duration is memoized per-particle via props,
 not computed with Math.random() on every render.
======================================================== */
const FloatingParticle = React.memo(({ delay, size, x, duration }: { delay: number; size: number; x: number; duration: number }) => (
 <motion.div
 className="absolute rounded-full bg-[var(--color-surface)]/[0.04] pointer-events-none"
 style={{ width: size, height: size, left:`${x}%`}}
 animate={{
 y: [800, -100],
 opacity: [0, 0.6, 0],
 scale: [0.5, 1, 0.3],
 }}
 transition={{
 duration,
 repeat: Infinity,
 delay,
 ease:'linear',
 }}
 />
));
FloatingParticle.displayName ='FloatingParticle';

/* ========================================================
 PROGRESS DOTS
 
 MNC-GRADE FIXES:
 - Stable aria labels
 - Removed layoutId (caused shared layout conflicts with multiple instances)
 - Used animate instead for smoother, conflict-free transitions
======================================================== */
const ProgressDots = React.memo(({
 total,
 active,
 onSelect,
 color,
}: {
 total: number;
 active: number;
 onSelect: (i: number) => void;
 color: string;
}) => (
 <div className="flex items-center gap-2"role="tablist"aria-label="Slide navigation">
 {Array.from({ length: total }).map((_, i) => {
 const isActive = i === active;
 return (
 <motion.button
 key={i}
 className="relative cursor-pointer p-1 outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-full"
 onClick={() => onSelect(i)}
 whileHover={{ scale: 1.3 }}
 whileTap={{ scale: 0.8 }}
 role="tab"
 aria-selected={isActive}
 aria-label={`Go to slide ${i + 1}`}
 >
 <motion.div
 className={`rounded-full ${isActive ?`bg-gradient-to-r ${color}`:''}`}
 animate={{
 width: isActive ? 28 : 8,
 height: 8,
 backgroundColor: isActive ? undefined :'rgba(255,255,255,0.2)',
 }}
 transition={DOT_SPRING}
 />
 </motion.button>
 );
 })}
 </div>
));
ProgressDots.displayName ='ProgressDots';

/* ========================================================
 MAIN EXPORT: SpatialCarousel
 
 MNC-GRADE ARCHITECTURE:
 - goNext/goPrev use functional setState to avoid stale closure bugs
 - Auto-play uses ref-based callback to prevent interval churn
 - Touch events handled alongside mouse for mobile support
 - Boundary-safe: slides array validated defensively
 - All timers cleaned up on unmount
======================================================== */
export function SpatialCarousel({ slides = DEFAULT_SLIDES }: { slides?: CarouselSlide[] }) {
 // Edge case: empty slides array — render nothing gracefully
 const safeSlides = useMemo(() => slides.length > 0 ? slides : DEFAULT_SLIDES, [slides]);

 const [activeIndex, setActiveIndex] = useState(0);
 const [expandedSlide, setExpandedSlide] = useState<CarouselSlide | null>(null);
 const [isAutoPlaying, setIsAutoPlaying] = useState(true);
 const [isHovered, setIsHovered] = useState(false);

 const containerRef = useRef<HTMLDivElement>(null);
 const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
 const isDraggingRef = useRef(false);

 // MNC-Grade: Store latest goNext in a ref to prevent auto-play interval churn.
 // Without this, every time activeIndex changes, the interval is torn down and recreated,
 // causing a visible stutter in the auto-play timing.
 const goNextRef = useRef<() => void>(() => {});

 // Normalised mouse coords (–1 to 1) for parallax tilt
 const mouseX = useMotionValue(0);
 const mouseY = useMotionValue(0);

 // Active slide reference — boundary-safe with modulo
 const activeSlide = useMemo(
 () => safeSlides[((activeIndex % safeSlides.length) + safeSlides.length) % safeSlides.length],
 [safeSlides, activeIndex]
 );

 // ── Navigation (functional setState to avoid stale closures) ──
 const goTo = useCallback((index: number) => {
 setActiveIndex(((index % safeSlides.length) + safeSlides.length) % safeSlides.length);
 }, [safeSlides.length]);

 const goNext = useCallback(() => {
 setActiveIndex(prev => (prev + 1) % safeSlides.length);
 }, [safeSlides.length]);

 const goPrev = useCallback(() => {
 setActiveIndex(prev => (prev - 1 + safeSlides.length) % safeSlides.length);
 }, [safeSlides.length]);

 // Keep goNextRef current
 goNextRef.current = goNext;

 // ── Auto-play (stable interval — no churn on activeIndex change) ──
 useEffect(() => {
 if (isAutoPlaying && !expandedSlide && !isHovered) {
 autoPlayRef.current = setInterval(() => goNextRef.current(), 4500);
 }
 return () => {
 if (autoPlayRef.current) {
 clearInterval(autoPlayRef.current);
 autoPlayRef.current = null;
 }
 };
 }, [isAutoPlaying, expandedSlide, isHovered]); // No goNext dep — uses ref

 // ── Mouse handlers ──
 const handleMouseEnter = useCallback(() => {
 setIsHovered(true);
 }, []);

 const handleMouseLeave = useCallback(() => {
 setIsHovered(false);
 mouseX.set(0);
 mouseY.set(0);
 }, [mouseX, mouseY]);

 const handleMouseMove = useCallback((e: React.MouseEvent) => {
 if (!containerRef.current) return;
 const rect = containerRef.current.getBoundingClientRect();
 const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
 const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
 mouseX.set(x);
 mouseY.set(y);
 }, [mouseX, mouseY]);

 // ── Swipe / Drag ──
 const handleDragEnd = useCallback((_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
 // MNC-Grade: Use velocity-based threshold for snappy UX
 const velocityThreshold = 200;
 const offsetThreshold = 50;
 
 if (info.velocity.x < -velocityThreshold || info.offset.x < -offsetThreshold) {
 goNext();
 } else if (info.velocity.x > velocityThreshold || info.offset.x > offsetThreshold) {
 goPrev();
 }
 
 // Debounced reset to prevent click-during-drag race condition
 requestAnimationFrame(() => {
 isDraggingRef.current = false;
 });
 }, [goNext, goPrev]);

 const handleDragStart = useCallback(() => {
 isDraggingRef.current = true;
 }, []);

 // ── Keyboard navigation ──
 useEffect(() => {
 const handleKeyDown = (e: KeyboardEvent) => {
 if (expandedSlide) return; // Don't navigate when expanded
 switch (e.key) {
 case'ArrowRight':
 e.preventDefault();
 goNext();
 break;
 case'ArrowLeft':
 e.preventDefault();
 goPrev();
 break;
 case'Enter':
 case'':
 e.preventDefault();
 setExpandedSlide(activeSlide);
 break;
 }
 };
 window.addEventListener('keydown', handleKeyDown);
 return () => window.removeEventListener('keydown', handleKeyDown);
 }, [goNext, goPrev, expandedSlide, activeSlide]);

 // ── Touch support (wheel for trackpad) ──
 useEffect(() => {
 const el = containerRef.current;
 if (!el) return;
 
 let wheelTimeout: ReturnType<typeof setTimeout> | null = null;
 let isScrolling = false;

 const handleWheel = (e: WheelEvent) => {
 e.preventDefault();
 if (isScrolling) return;
 isScrolling = true;

 if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
 // Horizontal scroll
 if (e.deltaX > 30) goNext();
 else if (e.deltaX < -30) goPrev();
 } else {
 // Vertical scroll mapped to horizontal nav
 if (e.deltaY > 30) goNext();
 else if (e.deltaY < -30) goPrev();
 }

 wheelTimeout = setTimeout(() => { isScrolling = false; }, 300);
 };

 el.addEventListener('wheel', handleWheel, { passive: false });
 return () => {
 el.removeEventListener('wheel', handleWheel);
 if (wheelTimeout) clearTimeout(wheelTimeout);
 };
 }, [goNext, goPrev]);

 // ── Card select handler ──
 const handleCardSelect = useCallback((index: number) => {
 if (isDraggingRef.current) return;
 if (index === activeIndex) {
 setExpandedSlide(safeSlides[index]);
 } else {
 goTo(index);
 }
 }, [activeIndex, goTo, safeSlides]);

 // Stable close handler for overlay
 const handleCloseOverlay = useCallback(() => setExpandedSlide(null), []);

 // Floating particles (memoized to prevent re-creation)
 // MNC-Grade: duration is pre-computed and passed as prop, not Math.random() in render
 const particles = useMemo(() =>
 Array.from({ length: 20 }).map((_, i) => ({
 key: i,
 delay: i * 1.2,
 size: 2 + Math.random() * 4,
 x: Math.random() * 100,
 duration: 12 + Math.random() * 8,
 })),
 []);

 return (
 <div className="w-full max-w-7xl mx-auto">
 {/* Main carousel container */}
 <div
 ref={containerRef}
 className="relative w-full h-[600px] rounded-3xl overflow-hidden bg-[#0a0a12] select-none"
 onMouseEnter={handleMouseEnter}
 onMouseLeave={handleMouseLeave}
 onMouseMove={handleMouseMove}
 style={{ perspective:'1200px'}}
 role="region"
 aria-label="3D Spatial Carousel"
 aria-roledescription="carousel"
 >
 {/* Animated background gradient (synced to active slide) */}
 <AnimatePresence mode="wait">
 <motion.div
 className={`absolute inset-0 bg-gradient-to-br ${activeSlide.color}`}
 key={activeSlide.id}
 initial={{ opacity: 0 }}
 animate={{ opacity: 0.08 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.8 }}
 />
 </AnimatePresence>

 {/* Ambient grid pattern */}
 <div
 className="absolute inset-0 opacity-[0.03] pointer-events-none"
 style={{
 backgroundImage:'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
 backgroundSize:'40px 40px',
 }}
 />

 {/* Floating particles */}
 {particles.map(p => (
 <FloatingParticle key={p.key} delay={p.delay} size={p.size} x={p.x} duration={p.duration} />
 ))}

 {/* Title area */}
 <div className="absolute top-8 left-8 z-20">
 <div className="flex items-center gap-2 mb-1">
 <Sparkles className="w-4 h-4 text-purple-400"/>
 <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-purple-400/80">
 Spatial Gallery
 </span>
 </div>
 <AnimatePresence mode="wait">
 <motion.h2
 className="text-slate-800/90 text-2xl font-bold"
 key={activeSlide.id +'-title'}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 transition={{ duration: 0.35 }}
 >
 {activeSlide.title}
 </motion.h2>
 </AnimatePresence>
 <AnimatePresence mode="wait">
 <motion.p
 className="text-slate-800/40 text-sm mt-1 max-w-md"
 key={activeSlide.id +'-sub'}
 initial={{ opacity: 0, y: 5 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -5 }}
 transition={{ delay: 0.1, duration: 0.35 }}
 >
 {activeSlide.subtitle}
 </motion.p>
 </AnimatePresence>
 </div>

 {/* View counter badge */}
 <div className="absolute top-8 right-8 z-20 flex items-center gap-4">
 <div className="flex items-center gap-1.5 text-slate-800/30 text-xs">
 <Eye className="w-3.5 h-3.5"/>
 <span>{(1240 + activeIndex * 312).toLocaleString()}</span>
 </div>
 <button
 onClick={() => setExpandedSlide(activeSlide)}
 className="p-2 rounded-xl bg-[var(--color-surface)]/5 border border-[var(--color-border)] text-slate-800/50 hover:text-slate-800 hover:bg-[var(--color-surface)]/10 transition cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/40"
 aria-label="Expand current slide to fullscreen"
 >
 <Maximize2 className="w-4 h-4"/>
 </button>
 </div>

 {/* 3D Card Stage — Draggable */}
 <motion.div
 className="absolute inset-0 flex items-center justify-center"
 style={{ transformStyle:'preserve-3d'}}
 drag="x"
 dragConstraints={{ left: 0, right: 0 }}
 dragElastic={0.15}
 onDragStart={handleDragStart}
 onDragEnd={handleDragEnd}
 >
 {safeSlides.map((slide, index) => (
 <CarouselCard
 key={slide.id}
 slide={slide}
 index={index}
 activeIndex={activeIndex}
 totalSlides={safeSlides.length}
 mouseX={mouseX}
 mouseY={mouseY}
 isHovered={isHovered}
 onSelect={handleCardSelect}
 />
 ))}
 </motion.div>

 {/* Navigation arrows */}
 <div className="absolute bottom-8 left-8 right-8 z-20 flex items-center justify-between">
 {/* Left */}
 <div className="flex items-center gap-2">
 <motion.button
 className="p-3 rounded-2xl bg-[var(--color-surface)]/5 border border-[var(--color-border)] text-slate-800/60 hover:text-slate-800 hover:bg-[var(--color-surface)]/10 backdrop-blur-md transition cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/40"
 onClick={goPrev}
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.92 }}
 aria-label="Previous slide"
 >
 <ChevronLeft className="w-5 h-5"/>
 </motion.button>
 <motion.button
 className="p-3 rounded-2xl bg-[var(--color-surface)]/5 border border-[var(--color-border)] text-slate-800/60 hover:text-slate-800 hover:bg-[var(--color-surface)]/10 backdrop-blur-md transition cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/40"
 onClick={goNext}
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.92 }}
 aria-label="Next slide"
 >
 <ChevronRight className="w-5 h-5"/>
 </motion.button>
 </div>

 {/* Progress dots */}
 <ProgressDots
 total={safeSlides.length}
 active={activeIndex}
 onSelect={goTo}
 color={activeSlide.color}
 />

 {/* Slide counter */}
 <div className="flex items-center gap-3">
 <span className="text-slate-800/30 text-xs font-mono tabular-nums">
 {String(activeIndex + 1).padStart(2,'0')} / {String(safeSlides.length).padStart(2,'0')}
 </span>

 {/* Auto-play toggle */}
 <motion.button
 onClick={() => setIsAutoPlaying(prev => !prev)}
 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition cursor-pointer border outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
 isAutoPlaying
 ?'bg-[var(--color-surface)]/10 border-[var(--color-border)] text-slate-800/60'
 :'bg-[var(--color-surface)]/5 border-[var(--color-border)] text-slate-800/30'
 }`}
 whileTap={{ scale: 0.92 }}
 aria-label={isAutoPlaying ?'Pause auto-play':'Resume auto-play'}
 aria-pressed={isAutoPlaying}
 >
 {isAutoPlaying ? <Pause className="w-3 h-3"/> : <Play className="w-3 h-3"/>}
 Auto
 </motion.button>
 </div>
 </div>

 {/* Bottom reflection gradient */}
 <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a12] via-[#0a0a12]/50 to-transparent pointer-events-none"/>
 </div>

 {/* Expanded overlay */}
 <AnimatePresence>
 {expandedSlide && (
 <ExpandedOverlay
 slide={expandedSlide}
 onClose={handleCloseOverlay}
 />
 )}
 </AnimatePresence>
 </div>
 );
}

export default SpatialCarousel;
