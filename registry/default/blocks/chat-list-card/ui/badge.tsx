import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-purple-600 text-white shadow-2xs',
        secondary: 'border-transparent bg-slate-100 text-slate-900',
        destructive: 'border-transparent bg-red-500 text-white shadow-2xs',
        outline: 'text-slate-700 border-slate-200 bg-white',
        nitro: 'border-amber-300/80 bg-gradient-to-r from-amber-100 to-pink-100 text-amber-900 shadow-2xs',
        purple: 'border-purple-200 bg-purple-100 text-purple-700',
        emerald: 'border-emerald-200 bg-emerald-100 text-emerald-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
