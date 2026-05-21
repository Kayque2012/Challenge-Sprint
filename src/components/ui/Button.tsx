import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-500 shadow-sm',
  secondary: 'bg-white text-orange-500 border border-orange-500 hover:bg-orange-50 focus-visible:ring-orange-500',
  danger:    'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500 shadow-sm',
  ghost:     'text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus-visible:ring-gray-400',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
};

const base =
  'inline-flex items-center justify-center gap-2 font-bold transition-colors ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
