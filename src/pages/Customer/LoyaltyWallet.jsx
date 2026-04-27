const recentActivity = [
  { icon: "local_laundry_service", iconBg: "bg-secondary-container/20", iconColor: "text-secondary", name: "Premium Wash & Fold", date: "Oct 24, 2023", points: "+150 pts" },
  { icon: "star", iconBg: "bg-tertiary-fixed-dim/20", iconColor: "text-tertiary-container", name: "Weekly Streak Bonus", date: "Oct 21, 2023", points: "+50 pts" },
];

export default function LoyaltyWallet() {
  return (
    <div className="space-y-6 px-4 md:px-8 py-6 max-w-6xl mx-auto">
      <header className="text-center md:text-left">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-2">Your Wallet</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Manage your points, tiers, and rewards.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Balance & Activity */}
        <div className="md:col-span-8 space-y-6">
          {/* Balance Card */}
          <div className="glass-card rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />
            <div className="mb-6 md:mb-0 z-10">
              <h2 className="font-label-md text-label-md text-on-surface-variant mb-2">Current Balance</h2>
              <div className="flex items-baseline space-x-2">
                <span className="font-display-xl text-display-xl bg-linear-to-r from-secondary to-secondary-container bg-clip-text text-transparent">2,450</span>
                <span className="text-on-surface-variant">pts</span>
              </div>
              <p className="font-label-sm text-label-sm text-secondary mt-2 flex items-center">
                <span className="material-symbols-outlined mr-1 text-sm">trending_up</span>
                +350 points this month
              </p>
            </div>
            <div className="w-full md:w-1/2 z-10 bg-surface/50 rounded-lg p-4 border border-outline-variant/30">
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
              <div className="w-full bg-surface-variant rounded-full h-3 mb-2 overflow-hidden relative">
                <div className="bg-linear-to-r from-secondary to-secondary-container h-3 rounded-full relative" style={{ width: "75%" }}>
                  <div className="absolute top-0 left-0 w-full h-full bg-linear-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite]" />
                </div>
              </div>
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                <span>2,450 / 3,000 pts</span>
                <span>550 to go</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card rounded-3xl p-6">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-surface/30 rounded-lg border border-outline-variant/20 hover:bg-surface/50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full ${item.iconBg} flex items-center justify-center ${item.iconColor}`}>
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">{item.name}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{item.date}</p>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md text-secondary font-semibold">{item.points}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors border border-outline-variant/30 rounded-lg hover:bg-surface-variant/30">
              View All Activity
            </button>
          </div>
        </div>

        {/* Right: Refer & Earn */}
        <div className="md:col-span-4">
          <div className="glass-card rounded-3xl p-6 h-full flex flex-col justify-between bg-linear-to-b from-white/10 to-primary-container/5 relative overflow-hidden">
            <div className="z-10">
              <div className="w-12 h-12 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary mb-4">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>group_add</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Refer & Earn</h3>
              <p className="text-on-surface-variant mb-6">
                Give your friends $20 off their first order, and you'll get <span className="font-bold text-secondary">500 points</span> when they complete it.
              </p>
              <div className="bg-surface rounded-lg p-3 flex items-center justify-between border border-outline-variant/30 mb-6">
                <code className="font-label-md text-label-md text-on-surface px-2">BUBBLEWASH-24</code>
                <button className="text-secondary hover:text-secondary-fixed-dim transition-colors p-2" title="Copy Code">
                  <span className="material-symbols-outlined">content_copy</span>
                </button>
              </div>
            </div>
            <button className="z-10 w-full py-4 bg-linear-to-r from-secondary to-secondary-fixed-dim text-white rounded-lg font-label-md text-label-md shadow-[0_0_20px_rgba(98,250,227,0.3)] hover:shadow-[0_0_25px_rgba(98,250,227,0.5)] transition-all active:scale-95">
              Share Invite Link
            </button>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary-fixed-dim/20 rounded-tl-full blur-2xl pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
