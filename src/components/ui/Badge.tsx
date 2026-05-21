import type { ReactNode } from 'react';

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-orange-100 text-orange-700',
  danger:  'bg-red-100 text-red-700',
  info:    'bg-blue-100 text-blue-700',
  neutral: 'bg-gray-100 text-gray-600',
};

const base =
  'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide';

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span className={`${base} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
