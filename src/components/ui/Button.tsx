import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand text-white hover:bg-brand-hover shadow-sm focus-visible:ring-brand/50',
  secondary:
    'bg-brand-light text-brand border border-brand-border hover:bg-orange-100 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/50 dark:hover:bg-orange-950/50 focus-visible:ring-brand/40',
  ghost:
    'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white focus-visible:ring-slate-400/40',
  danger:
    'bg-red-500 text-white hover:bg-red-600 shadow-sm focus-visible:ring-red-500/50 dark:bg-red-600 dark:hover:bg-red-700',
  outline:
    'bg-transparent text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/60 focus-visible:ring-slate-400/40',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2',
};

const base =
  'inline-flex items-center justify-center font-bold transition-colors ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(base, variantClasses[variant], sizeClasses[size], className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
