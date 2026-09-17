import { useState } from'react';
import { Check, Sparkles } from'lucide-react';
import type { PricingTableProps, PricingPlan } from'./types';

export type { PricingTableProps, PricingPlan };

export function PricingTable({
 title ="Flexible Plans for Growing Teams",
 subtitle ="Choose the perfect plan for your business. Cancel or upgrade anytime.",
 plans = [
 {
 id:'starter',
 name:'Starter',
 description:'Ideal for solo developers and small projects.',
 priceMonthly: 0,
 priceYearly: 0,
 features: [
'Up to 5 custom components',
'Public registry access',
'Community Discord support',
'Standard CLI installation'
 ],
 ctaText:'Get Started Free'
 },
 {
 id:'pro',
 name:'Pro Subscription',
 description:'Everything you need to build MNC-grade applications.',
 priceMonthly: 19,
 priceYearly: 190,
 isPopular: true,
 features: [
'Unlimited Pro components access',
'Private authenticated registry (Bearer token)',
'Priority 1-on-1 support',
'Commercial license included',
'Figma UI Kit & source code access'
 ],
 ctaText:'Start Pro Trial'
 },
 {
 id:'enterprise',
 name:'Enterprise',
 description:'Dedicated infrastructure, SLA & custom security.',
 priceMonthly: 99,
 priceYearly: 990,
 features: [
'Custom internal component registries',
'99.99% Uptime SLA Guarantee',
'SSO / SAML authentication',
'Dedicated Solutions Architect',
'Custom contract & invoicing'
 ],
 ctaText:'Contact Sales'
 }
 ],
 onSelectPlan
}: PricingTableProps) {
 const [billingCycle, setBillingCycle] = useState<'monthly'|'yearly'>('monthly');

 return (
 <section className="w-full max-w-5xl mx-auto py-8 font-sans">
 <div className="text-center space-y-3 mb-8">
 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200">
 <Sparkles className="w-3.5 h-3.5"/> Pricing Plans
 </span>
 <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">{title}</h2>
 <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm max-w-xl mx-auto">{subtitle}</p>

 {/* Billing Toggle */}
 <div className="flex items-center justify-center gap-3 pt-2">
 <span className={`text-xs font-semibold ${billingCycle ==='monthly'?'text-[var(--color-text-primary)]':'text-[var(--color-text-secondary)]'}`}>Monthly</span>
 <button
 type="button"
 role="switch"
 aria-checked={billingCycle ==='yearly'}
 aria-label="Toggle yearly billing"
 onClick={() => setBillingCycle(b => b ==='monthly'?'yearly':'monthly')}
 className="w-12 h-6 bg-slate-200 rounded-full p-1 transition cursor-pointer relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
 >
 <div className={`w-4 h-4 bg-[var(--color-accent-sage)] rounded-full transition-transform ${billingCycle ==='yearly'?'translate-x-6':'translate-x-0'}`} />
 </button>
 <span className={`text-xs font-semibold flex items-center gap-1 ${billingCycle ==='yearly'?'text-[var(--color-text-primary)]':'text-[var(--color-text-secondary)]'}`}>
 Yearly <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1.5 py-0.2 rounded-full font-bold">Save 20%</span>
 </span>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {plans.map(plan => {
 const price = billingCycle ==='monthly'? plan.priceMonthly : Math.round(plan.priceYearly / 12);
 return (
 <div
 key={plan.id}
 className={`bg-[var(--color-surface)] rounded-3xl p-6 sm:p-7 border ${
 plan.isPopular 
 ?'border-2 border-indigo-500 shadow-xl relative'
 :'border-[var(--color-border)] shadow-sm'
 } flex flex-col justify-between space-y-6`}
 >
 {plan.isPopular && (
 <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[var(--color-accent-sage)] text-slate-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
 Most Popular
 </div>
 )}

 <div className="space-y-4">
 <div>
 <h3 className="font-bold text-lg text-[var(--color-text-primary)]">{plan.name}</h3>
 <p className="text-xs text-[var(--color-text-secondary)] mt-1">{plan.description}</p>
 </div>

 <div className="flex items-baseline gap-1">
 <span className="text-3xl font-extrabold text-[var(--color-text-primary)]">${price}</span>
 <span className="text-xs text-[var(--color-text-secondary)] font-normal">/ month</span>
 </div>

 <ul className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
 {plan.features.map((feat, idx) => (
 <li key={idx} className="flex items-center gap-2 text-slate-700">
 <Check className="w-4 h-4 text-emerald-500 shrink-0"/>
 <span>{feat}</span>
 </li>
 ))}
 </ul>
 </div>

 <button
 type="button"
 onClick={() => onSelectPlan?.(plan.id, billingCycle)}
 className={`w-full py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
 plan.isPopular
 ?'bg-[var(--color-accent-sage)] hover:bg-indigo-700 text-slate-800 shadow-md'
 :'bg-[var(--color-bg-alt)] hover:bg-slate-200 :bg-slate-700 text-[var(--color-text-primary)]'
 }`}
 >
 {plan.ctaText}
 </button>
 </div>
 );
 })}
 </div>
 </section>
 );
}
