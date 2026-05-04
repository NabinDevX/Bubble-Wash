const pageLoaderKeyframes = `
  @keyframes spin-lenis {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse-glow {
    0%, 100% {
      opacity: 0.5;
      box-shadow: 0 0 8px rgba(98, 250, 227, 0.1);
    }
    50% {
      opacity: 0.8;
      box-shadow: 0 0 16px rgba(98, 250, 227, 0.2);
    }
  }

  .loader-spinner {
    animation: spin-lenis 2s linear infinite;
  }

  .loader-pulse {
    animation: pulse-glow 2s ease-in-out infinite;
  }
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = pageLoaderKeyframes;
  document.head.appendChild(style);
}

export default function PageLoader({
  title = "Loading…",
  subtitle = "Please wait",
}) {
  return (
    <div className="w-full">
      <div className="glass-card rounded-2xl p-6 loader-pulse">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 shrink-0">
            <div className="absolute inset-0 rounded-full border-2 border-outline-variant/30" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-secondary-fixed-dim loader-spinner" />
          </div>
          <div className="min-w-0">
            <p className="text-on-surface font-semibold truncate text-sm">
              {title}
            </p>
            {subtitle && (
              <p className="text-on-surface-variant text-xs">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="h-3 w-2/3 rounded-full bg-gradient-to-r from-white/30 to-white/10 skeleton-shimmer" />
          <div className="h-3 w-1/2 rounded-full bg-gradient-to-r from-white/25 to-white/5 skeleton-shimmer" />
          <div className="h-24 w-full rounded-xl bg-gradient-to-b from-white/20 to-white/5 skeleton-shimmer mt-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="h-16 rounded-xl bg-gradient-to-b from-white/15 to-white/5 skeleton-shimmer" />
            <div className="h-16 rounded-xl bg-gradient-to-b from-white/15 to-white/5 skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
