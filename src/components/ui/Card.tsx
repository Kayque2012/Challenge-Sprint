import type { ReactNode } from 'react';

type Variant = 'default' | 'elevated' | 'bordered';

interface CardProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  default:  'bg-white rounded-2xl border border-gray-100',
  elevated: 'bg-white rounded-2xl shadow-md border border-gray-100',
  bordered: 'bg-white rounded-2xl border-2 border-gray-200',
};

export function Card({ variant = 'default', children, className = '' }: CardProps) {
  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}
