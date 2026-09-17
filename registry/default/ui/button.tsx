import React from'react';
import { clsx } from'clsx';
import { twMerge } from'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 variant?:'primary'|'secondary'|'outline'|'ghost';
 size?:'sm'|'md'|'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
 ({ className, variant ='primary', size ='md', ...props }, ref) => {
 const base ='inline-flex items-center justify-center font-semibold rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 cursor-pointer';
 
 const variants = {
 primary:'bg-[var(--color-accent-sage)] hover:bg-blue-700 text-slate-800 shadow-xs',
 secondary:'bg-[var(--color-bg-alt)] text-[var(--color-text-primary)] hover:bg-slate-200 :bg-slate-700',
 outline:'border border-[var(--color-border)] text-slate-700 hover:bg-slate-50 :bg-[var(--color-surface)]',
 ghost:'text-slate-600 hover:bg-[var(--color-bg-alt)] :bg-[var(--color-surface)]'
 };

 const sizes = {
 sm:'px-2.5 py-1 text-xs',
 md:'px-4 py-2 text-xs',
 lg:'px-5 py-2.5 text-sm'
 };

 return (
 <button
 ref={ref}
 className={twMerge(clsx(base, variants[variant], sizes[size], className))}
 {...props}
 />
 );
 }
);
Button.displayName ='Button';
