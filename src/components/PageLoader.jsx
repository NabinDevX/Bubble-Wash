export default function PageLoader({ title = "Loading…" }) {
  return (
    <div className="w-full">
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 rounded-full border-2 border-outline-variant/40" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-secondary-fixed-dim animate-spin" />
          </div>
          <div className="min-w-0">
            <p className="text-on-surface font-semibold truncate">{title}</p>
            <p className="text-on-surface-variant text-sm">Please wait</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="h-4 w-2/3 rounded-full bg-white/40 animate-pulse" />
          <div className="h-4 w-1/2 rounded-full bg-white/30 animate-pulse" />
          <div className="h-28 w-full rounded-xl bg-white/25 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-20 rounded-xl bg-white/25 animate-pulse" />
            <div className="h-20 rounded-xl bg-white/25 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
