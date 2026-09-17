import { useState } from'react';
import { Crown, CheckCircle } from'lucide-react';

export interface SubscriptionPlan {
 id: string;
 name: string;
 price: string;
 period: string;
 features: string[];
 color: string;
 recommended?: boolean;
 badge: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
 {
 id:'free',
 name:'Free Standard',
 price:'$0',
 period:'forever',
 features: [
'Standard Static Avatar & Cover Photo',
'Basic Custom Status',
'View Feed Posts & Media Gallery',
'Standard Like & Share Reactions'
 ],
 color:'bg-[var(--color-surface)] border-[var(--color-border)]',
 badge:'Basic'
 },
 {
 id:'nitro_basic',
 name:'Nitro Basic',
 price:'$2.99',
 period:'per month',
 features: [
'Custom Nitro Basic Badge',
'50MB High-Res File Uploads',
'Custom Emojis Everywhere',
'Nitro Special Reactions'
 ],
 color:'bg-indigo-50/50 /20 border-indigo-200 /50',
 badge:'Popular'
 },
 {
 id:'nitro_pro',
 name:'Nitro Pro (Full Nitro)',
 price:'$9.99',
 period:'per month',
 features: [
'Looping GIF Animated Profile Avatar',
'Looping GIF Animated Cover Banner',
'Full-Screen Programmatic Profile Effects (Anime Power, Cyber Matrix, Retrowave Sunset)',
'Shop Avatar Decorations (Solar Flare, Anime Aura, Cyber Hacker Void, Celestial Orbit)',
'Server Level 1 Animated Sidebar Server Icon',
'Server Level 1 Holographic Animated Gradient Roles',
'Server Level 3 Animated Sidebar Banner Slot',
'Nitro Soundboard Audio Sampler & 2 Free Server Boosts'
 ],
 color:'bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-purple-400 /50',
 recommended: true,
 badge:'Full Nitro Perks'
 }
];

export interface NitroSubscriptionPricingProps {
 subscriptionTier?: string;
 onSelectSubscription?: (id: string) => void;
}

export default function NitroSubscriptionPricing({ subscriptionTier: propTier ='free', onSelectSubscription }: NitroSubscriptionPricingProps = {}) {
 const [localTier, setLocalTier] = useState<string>(propTier);
 const subscriptionTier = propTier || localTier;

 const handleSelectSubscription = (id: string) => {
 setLocalTier(id);
 if (onSelectSubscription) {
 onSelectSubscription(id);
 }
 };

 return (
 <div className="w-full max-w-6xl mx-auto p-4 sm:p-8">
 <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
 <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-primary)] flex flex-col sm:flex-row items-center justify-center gap-3">
 <Crown className="w-8 h-8 text-amber-400 fill-amber-400"/>
 Upgrade Your Profile to Full Discord Nitro
 </h3>
 <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
 Selecting a subscription plan instantly unlocks all avatar decorations, banner effects, soundboard clips, and persists state in IndexedDB!
 </p>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {SUBSCRIPTION_PLANS.map(plan => {
 const isSelected = subscriptionTier === plan.id;
 return (
 <div 
 key={plan.id}
 className={`rounded-3xl p-8 border flex flex-col justify-between relative transition-all duration-300 ${plan.color} ${
 isSelected ?'ring-2 ring-purple-500 shadow-2xl scale-[1.02]':'hover:border-purple-400/60 hover:scale-[1.01]'
 }`}
 >
 {plan.recommended && (
 <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-slate-800 font-extrabold text-xs uppercase px-4 py-1 rounded-full shadow-lg whitespace-nowrap">
 FULL NITRO UNLOCKED
 </div>
 )}

 <div className="space-y-6">
 <div>
 <span className="text-xs font-bold uppercase tracking-wider bg-[var(--color-surface)]/50 /80 px-3 py-1.5 rounded-full text-slate-700 backdrop-blur-sm">
 {plan.badge}
 </span>
 <h4 className="text-2xl font-extrabold mt-5 text-[var(--color-text-primary)]">{plan.name}</h4>
 <div className="text-4xl font-black mt-2 text-[var(--color-text-primary)]">
 {plan.price} <span className="text-sm font-semibold text-[var(--color-text-secondary)]">/{plan.period}</span>
 </div>
 </div>

 <ul className="space-y-3.5 text-sm font-medium text-slate-700">
 {plan.features.map((feat, idx) => (
 <li key={`${plan.id}-feat-${idx}`} className="flex items-start gap-3">
 <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"/>
 <span className="leading-relaxed">{feat}</span>
 </li>
 ))}
 </ul>
 </div>

 <button
 type="button"
 onClick={() => handleSelectSubscription(plan.id)}
 className={`w-full py-3.5 rounded-2xl font-bold text-sm mt-8 transition-all cursor-pointer shadow-lg active:scale-95 ${
 isSelected 
 ?'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/25'
 :'bg-purple-600 hover:bg-purple-700 text-slate-800 shadow-purple-500/25'
 }`}
 >
 {isSelected ?'Active Plan (IndexedDB Saved)':`Switch to ${plan.name}`}
 </button>
 </div>
 );
 })}
 </div>
 </div>
 );
}
