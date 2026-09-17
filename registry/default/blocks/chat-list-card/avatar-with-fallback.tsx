import React, { useState, useMemo, useEffect } from 'react';
import type { AvatarDecoration } from './types';

function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).map(n => n[0]).filter(Boolean);
  if (parts.length === 0) return '?';
  return parts.join('').substring(0, 2).toUpperCase();
}

function getGradient(name: string): string {
  const gradients = [
    'from-red-500 to-orange-500', 
    'from-blue-500 to-cyan-500', 
    'from-purple-500 to-pink-500', 
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-yellow-500',
    'from-indigo-500 to-violet-500'
  ];
  let charSum = 0;
  for (let i = 0; i < name.length; i++) {
    charSum += name.charCodeAt(i);
  }
  return gradients[charSum % gradients.length];
}

interface AvatarProps {
  name: string;
  src?: string;
  size?: string;
  decoration?: AvatarDecoration;
  customDecorationUrl?: string;
}

export const AvatarWithFallback = React.memo(({ name, src, size = "w-11 h-11", decoration, customDecorationUrl }: AvatarProps) => {
  const [imgError, setImgError] = useState(false);

  // MNC Bugfix: Reset image error state when src changes
  useEffect(() => {
    setImgError(false);
  }, [src]);

  const initials = useMemo(() => getInitials(name), [name]);
  const gradient = useMemo(() => getGradient(name), [name]);

  const renderDecoration = () => {
    if (decoration === 'custom_gif' && customDecorationUrl) {
      return (
        <img 
          src={customDecorationUrl} 
          alt="Avatar Decoration" 
          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
          className="absolute -inset-1.5 w-[calc(100%+12px)] h-[calc(100%+12px)] max-w-none z-10 pointer-events-none object-contain scale-[1.1]"
        />
      );
    }
    return null;
  };

  const renderAvatar = () => {
    if (!src || imgError) {
      return (
        <div className={`${size} rounded-full bg-gradient-to-br ${gradient} text-white font-extrabold text-xs flex items-center justify-center ring-2 ring-slate-100 dark:ring-slate-800 shrink-0 shadow-xs relative z-0 overflow-hidden`}>
          {initials}
        </div>
      );
    }
    return (
      <img
        src={src}
        alt={name}
        loading="lazy"
        decoding="async"
        onError={() => setImgError(true)}
        className={`${size} rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 shrink-0 relative z-0`}
      />
    );
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${size}`}>
      {renderAvatar()}
      {renderDecoration()}
    </div>
  );
});
AvatarWithFallback.displayName = 'AvatarWithFallback';

