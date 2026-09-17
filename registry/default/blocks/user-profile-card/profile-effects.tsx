import React from'react';
import type { ProfileEffect } from'./types';
import ParticleCanvas from'./particle-canvas';

export const ProfileEffectOverlay = React.memo(({ effect, isUnlocked }: { effect: ProfileEffect; isUnlocked: boolean }) => {
 if (effect ==='none'|| !isUnlocked) return null;

 if (effect ==='sakura_breeze') {
 return <ParticleCanvas type="sakura"count={40} />;
 }

 if (effect ==='autumn_breeze') {
 return <ParticleCanvas type="autumn"count={30} />;
 }

 if (effect ==='winter_blizzard') {
 return <ParticleCanvas type="snow"count={50} />;
 }

 if (effect ==='cosmic_stardust') {
 return <ParticleCanvas type="star"count={40} />;
 }

 return null;
});

ProfileEffectOverlay.displayName ='ProfileEffectOverlay';
export default ProfileEffectOverlay;
