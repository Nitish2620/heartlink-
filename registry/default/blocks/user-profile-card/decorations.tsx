import React from'react';
import { AvatarDecorationFrame as OriginalAvatarDecorationFrame } from'./avatar-decorations';
import { ProfileEffectOverlay as OriginalProfileEffectOverlay } from'./profile-effects';
import { BannerEffectOverlay as OriginalBannerEffectOverlay } from'./banner-effects';
import type { AvatarDecoration, ProfileEffect, BannerEffect } from'./types';

export const AvatarDecorationFrame = React.memo(({ decoration }: { decoration?: AvatarDecoration | string }) => {
 if (!decoration || decoration ==='none') return null;
 return <OriginalAvatarDecorationFrame decoration={decoration as AvatarDecoration} isUnlocked={true} />;
});
AvatarDecorationFrame.displayName ='AvatarDecorationFrame';

export const ProfileEffectLayer = React.memo(({ effect }: { effect?: ProfileEffect | string }) => {
 if (!effect || effect ==='none') return null;
 return <OriginalProfileEffectOverlay effect={effect as ProfileEffect} isUnlocked={true} />;
});
ProfileEffectLayer.displayName ='ProfileEffectLayer';

export const BannerEffectLayer = React.memo(({ effect }: { effect?: BannerEffect | string }) => {
 if (!effect || effect ==='none') return null;
 return <OriginalBannerEffectOverlay effect={effect as BannerEffect} isUnlocked={true} />;
});
BannerEffectLayer.displayName ='BannerEffectLayer';
