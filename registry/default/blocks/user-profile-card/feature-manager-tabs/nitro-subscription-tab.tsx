import React from'react';
import { Crown, Check } from'lucide-react';
import { SUBSCRIPTION_PLANS } from'../feature-manager-constants';
import type { SubscriptionTier } from'../types';

interface NitroSubscriptionTabProps {
 onSelectSubscription?: (tier: SubscriptionTier) => void;
 showToast: (msg: string) => void;
}

export const NitroSubscriptionTab = React.memo(({
 onSelectSubscription,
 showToast
}: NitroSubscriptionTabProps) => {
 return (
 <div className="space-y-6 max-w-2xl">
 <div className="border-b border-[var(--color-border)]/80 pb-4">
 <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
 <Crown className="w-5 h-5 text-amber-400"/>
 Discord Nitro Subscriptions
 </h2>
 <p className="text-xs text-[var(--color-text-secondary)] mt-1">Upgrade your profile with animated effects, 50MB uploads, and server boosts.</p>
 </div>

 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4"aria-label="Subscription Plans">
 {SUBSCRIPTION_PLANS.map(plan => (
 <li key={plan.id} className={`p-5 rounded-2xl border ${plan.color} space-y-3`}>
 <div className="flex items-center justify-between">
 <span className="font-bold text-sm">{plan.name}</span>
 <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
 {plan.badge}
 </span>
 </div>
 <div className="text-xl font-extrabold">{plan.price} <span className="text-xs font-normal opacity-70">/ {plan.period}</span></div>
 <ul className="space-y-1 text-xs opacity-90"aria-label={`Features of ${plan.name}`}>
 {plan.features.map((feat, idx) => (
 <li key={idx} className="flex items-center gap-1.5">
 <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0"aria-hidden="true"/>
 <span>{feat}</span>
 </li>
 ))}
 </ul>
 <button 
 type="button"
 onClick={() => {
 if (onSelectSubscription) onSelectSubscription(plan.id);
 showToast(`🎉 Switched to ${plan.name}`);
 }}
 className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-slate-800 text-xs font-bold transition cursor-pointer shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
 aria-label={`Select ${plan.name} plan`}
 >
 Select Plan
 </button>
 </li>
 ))}
 </ul>
 </div>
 );
});

NitroSubscriptionTab.displayName ='NitroSubscriptionTab';
export default NitroSubscriptionTab;
