import { type ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'default' | 'elevated' | 'bordered' | 'ghost';

interface CardProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const variantClasses: Record<Variant, string> = {
  default:
    'bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700',
  elevated:
    'bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700',
  bordered:
    'bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-600',
  ghost:
    'bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50',
};

export function Card({ variant = 'default', children, className, onClick }: CardProps) {
  return (
    <div
      className={cn(
        variantClasses[variant],
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
