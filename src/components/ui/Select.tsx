import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = '', children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full appearance-none px-4 py-3 pr-10 bg-white dark:bg-slate-700/60 border rounded-xl text-sm text-gray-700 dark:text-slate-200 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 ${
              error
                ? 'border-red-400 dark:border-red-500'
                : 'border-slate-200 dark:border-slate-600'
            } ${className}`}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            size={15}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
