import type { SubscriptionTier } from './types';

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free' as SubscriptionTier,
    name: 'Free Standard',
    price: '$0',
    period: 'forever',
    badge: 'Basic',
    color: 'border-slate-700 bg-[#F9F9F7] text-slate-200',
    features: ['Standard Static Avatar', 'Basic Custom Status', 'View Feed Posts']
  },
  {
    id: 'nitro_basic' as SubscriptionTier,
    name: 'Nitro Basic',
    price: '$2.99',
    period: 'per month',
    badge: 'Popular',
    color: 'border-blue-500 bg-blue-950/40 text-blue-100',
    features: ['Custom Nitro Basic Badge', '50MB High-Res Uploads', 'Custom Emojis Everywhere']
  },
  {
    id: 'nitro_pro' as SubscriptionTier,
    name: 'Nitro Pro (Full Nitro)',
    price: '$9.99',
    period: 'per month',
    badge: 'Full Nitro Perks',
    recommended: true,
    color: 'border-purple-500 bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-slate-900 text-slate-800 shadow-xl shadow-purple-500/20',
    features: [
      'Looping GIF Animated Avatars & Banners',
      'Full Nitro Animated Profile & Banner Effects',
      'Shop Avatar Decoration Frames',
      'Server Specific Profiles & Animated Roles',
      '2 Free Server Boosts'
    ]
  }
];
