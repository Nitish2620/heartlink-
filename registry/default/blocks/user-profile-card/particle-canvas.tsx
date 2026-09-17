import React, { useEffect, useRef, useState } from'react';


// Detect if user has OS reduced motion enabled
export function useReducedMotion() {
 const [reducedMotion, setReducedMotion] = useState(false);
 useEffect(() => {
 const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
 setReducedMotion(mediaQuery.matches);
 const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
 mediaQuery.addEventListener('change', listener);
 return () => mediaQuery.removeEventListener('change', listener);
 }, []);
 return reducedMotion;
}

// Hook to pause animation when off-screen
export function useVisibilityObserver(ref: React.RefObject<Element | null>) {
 const [isVisible, setIsVisible] = useState(true); // Default true until mounted
 useEffect(() => {
 if (!ref.current) return;
 const observer = new IntersectionObserver(
 ([entry]) => {
 setIsVisible(entry.isIntersecting);
 },
 { threshold: 0.1 }
 );
 observer.observe(ref.current);
 return () => observer.disconnect();
 }, [ref]);
 return isVisible;
}

interface Particle {
 x: number;
 y: number;
 size: number;
 speedY: number;
 speedX: number;
 rotation: number;
 rotationSpeed: number;
 opacity: number;
 maxOpacity: number;
}

type ParticleType ='sakura'|'autumn'|'snow'|'star';

interface ParticleCanvasProps {
 type: ParticleType;
 count: number;
 className?: string;
 isBanner?: boolean;
}

const EMOJI_MAP = {
 sakura:'🌸',
 autumn:'🍂',
 snow:'❄️',
 star:'✨'
};

export const ParticleCanvas = React.memo(({ type, count, className ='', isBanner = false }: ParticleCanvasProps) => {
 const canvasRef = useRef<HTMLCanvasElement>(null);
 const isVisible = useVisibilityObserver(canvasRef);
 const prefersReducedMotion = useReducedMotion();

 useEffect(() => {
 // If not visible or prefers reduced motion, do not run animation loop
 if (!isVisible || prefersReducedMotion || !canvasRef.current) return;

 const canvas = canvasRef.current;
 const ctx = canvas.getContext('2d');
 if (!ctx) return;

 let animationFrameId: number;
 let width = canvas.offsetWidth;
 let height = canvas.offsetHeight;
 
 // Set internal resolution to match display size for crisp rendering
 canvas.width = width * window.devicePixelRatio;
 canvas.height = height * window.devicePixelRatio;
 ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

 const particles: Particle[] = [];
 const emoji = EMOJI_MAP[type];

 // Initialize particles
 for (let i = 0; i < count; i++) {
 particles.push({
 x: Math.random() * width,
 y: Math.random() * height - height, // Start above screen
 size: Math.random() * (isBanner ? 16 : 24) + 10,
 speedY: (Math.random() * 1.5) + (type ==='snow'? 1.5 : type ==='autumn'? 1.2 : 1),
 speedX: (Math.random() - 0.5) * (type ==='snow'? 1.5 : 2),
 rotation: Math.random() * Math.PI * 2,
 rotationSpeed: (Math.random() - 0.5) * 0.05,
 opacity: Math.random(),
 maxOpacity: Math.random() * 0.5 + 0.4
 });
 }

 const render = () => {
 ctx.clearRect(0, 0, width, height);

 particles.forEach(p => {
 // Update positions
 p.y += p.speedY;
 p.x += p.speedX;
 p.rotation += p.rotationSpeed;

 // Custom gravity/sway logic per type
 if (type ==='sakura'|| type ==='autumn') {
 p.x += Math.sin(p.y * 0.01) * 0.5; // Swaying motion
 }
 
 if (type ==='star') {
 p.opacity += p.rotationSpeed * 0.5; // Pulse opacity
 if (p.opacity > p.maxOpacity) p.opacity = p.maxOpacity;
 if (p.opacity < 0.1) p.opacity = 0.1;
 p.speedY = 0.5; // Slow fall
 } else {
 // Fade in and out based on vertical position
 const fadeThreshold = height * 0.1;
 if (p.y < fadeThreshold) {
 p.opacity = Math.min(p.maxOpacity, p.y / fadeThreshold);
 } else if (p.y > height - fadeThreshold) {
 p.opacity = Math.max(0, (height - p.y) / fadeThreshold);
 } else {
 p.opacity = p.maxOpacity;
 }
 }

 // Reset if out of bounds
 if (p.y > height + 20) {
 p.y = -20;
 p.x = Math.random() * width;
 }
 if (p.x > width + 20) p.x = -20;
 if (p.x < -20) p.x = width + 20;

 // Draw particle
 ctx.save();
 ctx.globalAlpha = Math.max(0, p.opacity);
 ctx.translate(p.x, p.y);
 ctx.rotate(p.rotation);
 ctx.font =`${p.size}px Arial`;
 ctx.textAlign ='center';
 ctx.textBaseline ='middle';
 ctx.fillText(emoji, 0, 0);
 ctx.restore();
 });

 animationFrameId = requestAnimationFrame(render);
 };

 render();

 const handleResize = () => {
 width = canvas.offsetWidth;
 height = canvas.offsetHeight;
 canvas.width = width * window.devicePixelRatio;
 canvas.height = height * window.devicePixelRatio;
 ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
 };

 window.addEventListener('resize', handleResize);

 return () => {
 cancelAnimationFrame(animationFrameId);
 window.removeEventListener('resize', handleResize);
 };
 }, [type, count, isVisible, prefersReducedMotion, isBanner]);

 return (
 <canvas
 ref={canvasRef}
 className={`absolute inset-0 w-full h-full pointer-events-none z-30 ${className}`}
 style={{
 opacity: prefersReducedMotion ? 0 : 1,
 transition:'opacity 0.5s ease-in-out'
 }}
 />
 );
});

ParticleCanvas.displayName ='ParticleCanvas';
export default ParticleCanvas;
