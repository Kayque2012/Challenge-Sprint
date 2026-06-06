import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand';

interface BadgeProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

const variantClasses: Record<Variant, string> = {
  success: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400',
  warning: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400',
  danger:  'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',
  info:    'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
  neutral: 'bg-slate-100 text-slate-600 dark:bg-slate-700/60 dark:text-slate-300',
  brand:   'bg-brand-light text-brand dark:bg-orange-950/40 dark:text-orange-400',
};

const dotClasses: Record<Variant, string> = {
  success: 'bg-green-500',
  warning: 'bg-orange-500',
  danger:  'bg-red-500',
  info:    'bg-blue-500',
  neutral: 'bg-slate-400',
  brand:   'bg-brand',
};

const base =
  'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide';

export function Badge({ variant = 'neutral', children, className, dot }: BadgeProps) {
  return (
    <span className={cn(base, variantClasses[variant], className)}>
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotClasses[variant])} />
      )}
      {children}
    </span>
  );
}
