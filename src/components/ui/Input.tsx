import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, id, className, ...rest }, ref) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-gray-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full py-2.5 bg-white dark:bg-slate-700/60 rounded-xl text-sm',
              'text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500',
              'border outline-none transition-all duration-200',
              'focus:ring-2 focus:ring-brand/25 focus:border-brand',
              error
                ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-950/20'
                : 'border-slate-200 dark:border-slate-600',
              leftIcon  ? 'pl-9'  : 'pl-4',
              rightIcon ? 'pr-9'  : 'pr-4',
              className
            )}
            {...rest}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-slate-400 dark:text-slate-500">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
