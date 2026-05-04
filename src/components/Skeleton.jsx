const skeletonKeyframes = `
  @keyframes skeleton-shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  @keyframes skeleton-pulse {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 0.3;
    }
  }

  .skeleton-shimmer {
    animation: skeleton-shimmer 2s infinite;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0.1) 100%
    );
    background-size: 1000px 100%;
  }

  .skeleton-pulse {
    animation: skeleton-pulse 1.5s ease-in-out infinite;
  }
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = skeletonKeyframes;
  document.head.appendChild(style);
}

export function Skeleton({ className = "", animated = true }) {
  const animationClass = animated ? "skeleton-shimmer" : "skeleton-pulse";
  return (
    <div
      className={`${animationClass} bg-outline-variant/30 rounded-md will-change-auto ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card rounded-xl p-5 border border-outline-variant/30 transform-gpu">
      <div className="flex justify-between items-start mb-4">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
      <Skeleton className="w-24 h-4 mb-2" />
      <Skeleton className="w-32 h-8" />
    </div>
  );
}

export function SkeletonTableRow({ columns = 6 }) {
  return (
    <tr className="border-t border-outline-variant/20">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <Skeleton className="w-full h-4" />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonGrid({ count = 4, cols = 2 }) {
  return (
    <div className={`grid grid-cols-${cols} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonSection() {
  return (
    <div className="space-y-4">
      <Skeleton className="w-40 h-8 rounded-lg" />
      <div className="space-y-3">
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-5/6 h-4 rounded" />
        <Skeleton className="w-4/5 h-4 rounded" />
      </div>
    </div>
  );
}
