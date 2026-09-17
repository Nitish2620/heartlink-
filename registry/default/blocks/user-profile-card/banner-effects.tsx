import React from'react';
import type { BannerEffect } from'./types';
import ParticleCanvas from'./particle-canvas';

export const BannerEffectOverlay = React.memo(({ effect, isUnlocked }: { effect: BannerEffect; isUnlocked: boolean }) => {
 if (effect ==='none'|| !isUnlocked) return null;

 if (effect ==='sakura_moonlight') {
 return (
 <div className="absolute inset-0 z-20 pointer-events-none mix-blend-plus-lighter overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent z-10"/>
 <ParticleCanvas type="sakura"count={40} className="z-20"isBanner />
 </div>
 );
 }

 if (effect ==='autumn_sunset') {
 return (
 <div className="absolute inset-0 z-20 pointer-events-none mix-blend-plus-lighter overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent z-10"/>
 <ParticleCanvas type="autumn"count={30} className="z-20"isBanner />
 </div>
 );
 }

 if (effect ==='winter_night') {
 return (
 <div className="absolute inset-0 z-20 pointer-events-none mix-blend-plus-lighter overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent z-10"/>
 <ParticleCanvas type="snow"count={50} className="z-20"isBanner />
 </div>
 );
 }

 if (effect ==='starry_galaxy') {
 return (
 <div className="absolute inset-0 z-20 pointer-events-none mix-blend-plus-lighter overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-indigo-500/20 z-10"/>
 <ParticleCanvas type="star"count={40} className="z-20"isBanner />
 </div>
 );
 }

 return null;
});

BannerEffectOverlay.displayName ='BannerEffectOverlay';
export default BannerEffectOverlay;
