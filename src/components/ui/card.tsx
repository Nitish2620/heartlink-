import React from'react';
import { clsx } from'clsx';
import { twMerge } from'tailwind-merge';

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
 ({ className, ...props }, ref) => (
 <div
 ref={ref}
 className={twMerge(clsx('rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-sm p-6', className))}
 {...props}
 />
 )
);
Card.displayName ='Card';
