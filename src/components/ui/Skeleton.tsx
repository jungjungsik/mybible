import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  return (
    <div className={clsx('shimmer', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            'h-4 bg-bible-border/30 dark:bg-bible-border-dark/30 rounded-lg mb-3',
            i === lines - 1 ? 'w-2/3' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

export function VerseSkeleton() {
  return (
    <div className="space-y-6 p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="shimmer">
          <div className="flex gap-2">
            <div className="w-5 h-3 bg-bible-border/30 dark:bg-bible-border-dark/30 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-bible-border/30 dark:bg-bible-border-dark/30 rounded-lg w-full" />
              <div className="h-4 bg-bible-border/30 dark:bg-bible-border-dark/30 rounded-lg w-4/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
