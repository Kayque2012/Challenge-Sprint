import type { LucideIcon } from 'lucide-react';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}>
      <div className="bg-gray-100 p-5 rounded-full mb-4">
        <Icon size={40} className="text-gray-400" />
      </div>
      <h3 className="text-base font-bold text-gray-700 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-400 max-w-xs">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-5 py-2 rounded-xl text-sm font-bold border border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
