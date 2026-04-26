const activityItems = [
  {
    icon: "local_laundry_service",
    title: "Premium Wash & Fold",
    date: "Apr 24, 2026",
    points: "+150 pts",
    iconBg: "rgba(138, 240, 205, 0.25)",
    iconColor: "text-secondary",
  },
  {
    icon: "star",
    title: "Weekly Streak Bonus",
    date: "Apr 21, 2026",
    points: "+50 pts",
    iconBg: "rgba(245, 158, 11, 0.15)",
    iconColor: "text-amber-600",
  },
];

export default function LoyaltyWallet() {
  return (
    <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto">
      <header className="mb-stack-lg text-center md:text-left mt-8 md:mt-0">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-unit">Your Wallet</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Manage your points, tiers, and rewards.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Balance & Tier + Activity */}
        <div className="md:col-span-8 space-y-gutter">
          {/* Balance & Tier Card */}
          <div className="glass-card rounded-2xl p-stack-md flex flex-col md:flex-row items-start md:items-center justify-between relative overflow-hidden"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.05), 0 12px 48px rgba(37,196,143,0.08)" }}>
            {/* Decorative glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none"
              style={{ background: "rgba(138, 240, 205, 0.25)" }} />

            <div className="mb-stack-md md:mb-0 z-10">
              <h2 className="font-label-md text-label-md text-on-surface-variant mb-unit">Current Balance</h2>
              <div className="flex items-baseline space-x-2">
                <span className="font-display-xl text-display-xl text-gradient">2,450</span>
                <span className="font-body-md text-body-md text-on-surface-variant">pts</span>
              </div>
              <p className="font-label-sm text-label-sm text-secondary mt-2 flex items-center">
                <span className="material-symbols-outlined mr-1 text-sm">trending_up</span>
                +350 points this month
              </p>
            </div>

            <div className="w-full md:w-1/2 z-10 bg-white/30 rounded-lg p-stack-sm border border-outline-variant/30">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider">Current Tier</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">Silver</span>
                </div>
                <div className="text-right">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider">Next Tier</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface/50">Gold</span>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="w-full rounded-full h-3 mb-2 overflow-hidden relative"
                style={{ background: "rgba(214, 235, 224, 0.6)" }}>
                <div className="h-3 rounded-full relative"
                  style={{
                    width: "75%",
                    background: "linear-gradient(90deg, #0f8d65, #25c48f, #8af0cd)",
                    transition: "width 1s ease-in-out",
                  }}>
                  <div className="absolute top-0 left-0 w-full h-full rounded-full opacity-60"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                      animation: "shimmer 2s infinite",
                    }} />
                </div>
              </div>
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                <span>2,450 / 3,000 pts</span>
                <span>550 to go</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card rounded-2xl p-stack-md"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.05), 0 12px 48px rgba(37,196,143,0.08)" }}>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-stack-sm">Recent Activity</h3>
            <div className="space-y-4">
              {activityItems.map((item) => (
                <div key={item.title}
                  className="flex items-center justify-between p-stack-sm bg-white/20 rounded-lg border border-outline-variant/20 hover:bg-white/40 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: item.iconBg }}>
                      <span className={`material-symbols-outlined ${item.iconColor}`}>{item.icon}</span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">{item.title}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{item.date}</p>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md text-secondary font-semibold">{item.points}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-stack-sm py-3 font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors border border-outline-variant/30 rounded-lg hover:bg-white/30">
              View All Activity
            </button>
          </div>
        </div>

        {/* Referral Section */}
        <div className="md:col-span-4">
          <div className="glass-card rounded-2xl p-stack-md h-full flex flex-col justify-between relative overflow-hidden"
            style={{
              background: "linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(11,90,73,0.05))",
              boxShadow: "0 4px 24px rgba(0,0,0,0.05), 0 12px 48px rgba(37,196,143,0.08)",
            }}>
            <div className="z-10">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white mb-stack-sm"
                style={{ background: "linear-gradient(135deg, #0f8d65, #25c48f)" }}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>group_add</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-unit">Refer & Earn</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md">
                Give your friends $20 off their first order, and you&apos;ll get{" "}
                <span className="font-bold text-secondary">500 points</span> when they complete it.
              </p>
              <div className="bg-white/40 rounded-lg p-3 flex items-center justify-between border border-outline-variant/30 mb-stack-md">
                <code className="font-label-md text-label-md text-on-surface px-2">BUBBLE-24</code>
                <button className="text-secondary hover:text-secondary/70 transition-colors p-2" title="Copy Code">
                  <span className="material-symbols-outlined">content_copy</span>
                </button>
              </div>
            </div>
            <button className="z-10 w-full py-4 text-white rounded-lg font-label-md text-label-md transition-all hover:scale-[1.02] duration-300"
              style={{
                background: "linear-gradient(90deg, #0f8d65, #25c48f)",
                boxShadow: "0 0 20px rgba(37,196,143,0.3)",
              }}>
              Share Invite Link
            </button>
            {/* Abstract decoration */}
            <div className="absolute bottom-0 right-0 w-48 h-48 rounded-tl-full blur-2xl pointer-events-none"
              style={{ background: "rgba(138, 240, 205, 0.2)" }} />
          </div>
        </div>
      </div>

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
