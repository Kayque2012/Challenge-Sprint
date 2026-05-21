import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, id, className = '', ...rest }: InputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-sm text-gray-700',
          'outline-none transition-colors',
          'focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500',
          error ? 'border-red-400 bg-red-50' : 'border-gray-300',
          className,
        ].join(' ')}
        {...rest}
      />
      {error && (
        <span className="text-xs font-medium text-red-500">{error}</span>
      )}
      {hint && !error && (
        <span className="text-xs text-gray-400">{hint}</span>
      )}
    </div>
  );
}
