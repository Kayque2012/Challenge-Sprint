interface SkeletonProps {
  variant?: 'text' | 'card' | 'avatar';
  lines?: number;
  className?: string;
}

const pulse = 'animate-pulse bg-gray-200 rounded';

export function Skeleton({ variant = 'text', lines = 3, className = '' }: SkeletonProps) {
  if (variant === 'avatar') {
    return <div className={`${pulse} rounded-full w-10 h-10 ${className}`} />;
  }

  if (variant === 'card') {
    return <div className={`${pulse} w-full h-32 rounded-2xl ${className}`} />;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${pulse} h-4 ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}
