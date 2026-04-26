export default function Reports() {
  const metrics = [
    { label: "Total Revenue", value: "$128,430.00", icon: "payments", badge: "+12.5%", badgeColor: "text-secondary bg-secondary-container/30", barPct: 75 },
    { label: "Active Orders", value: "1,248", icon: "local_laundry_service", badge: "+4.2%", badgeColor: "text-secondary bg-secondary-container/30", miniChart: true },
    { label: "Avg. Delivery", value: "1h 42m", icon: "schedule", badge: "-2.1%", badgeColor: "text-error bg-red-50", note: "Goal: Under 1h 30m" },
    { label: "Satisfaction", value: "4.9/5.0", icon: "star", badge: "New High", badgeColor: "text-secondary bg-secondary-container/30", stars: true },
  ];

  const days = [
    { name: "Mon", pct: 40 }, { name: "Tue", pct: 55 }, { name: "Wed", pct: 75 },
    { name: "Thu", pct: 60 }, { name: "Fri", pct: 90 }, { name: "Sat", pct: 80 }, { name: "Sun", pct: 45 },
  ];

  const serviceTypes = [
    { name: "Wash & Fold", pct: "60%", color: "bg-primary" },
    { name: "Dry Cleaning", pct: "30%", color: "bg-secondary" },
    { name: "Ironing Only", pct: "10%", color: "bg-secondary-container" },
  ];

  const regions = [
    { area: "Downtown Hub", location: "New York, NY", orders: "452", revenue: "$42,300", rating: "4.9", growth: "+18%", growthPositive: true, status: "High Efficiency", statusColor: "bg-emerald-100 text-emerald-700" },
    { area: "Westside Annex", location: "Jersey City, NJ", orders: "318", revenue: "$28,150", rating: "4.7", growth: "+12%", growthPositive: true, status: "Optimal", statusColor: "bg-emerald-100 text-emerald-700" },
    { area: "Industrial North", location: "Queens, NY", orders: "285", revenue: "$19,400", rating: "4.2", growth: "-4%", growthPositive: false, status: "Needs Review", statusColor: "bg-red-100 text-red-700" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Reports & Analytics</h1>
          <p className="text-on-surface-variant text-sm mt-1">Performance metrics for April 2024</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant bg-white/60 text-on-surface text-sm font-semibold hover:bg-white/80 transition-colors">
            <span className="material-symbols-outlined text-lg">calendar_today</span> Apr 01 - Apr 30
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-secondary-fixed-dim to-secondary text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all">
            <span className="material-symbols-outlined text-lg">download</span> Export CSV
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="glass-card rounded-xl p-5 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/30 rounded-lg"><span className="material-symbols-outlined text-secondary">{m.icon}</span></div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${m.badgeColor}`}>{m.badge}</span>
            </div>
            <p className="text-on-surface-variant text-xs font-bold uppercase">{m.label}</p>
            <h3 className="text-2xl font-bold text-on-surface mt-1">{m.value}</h3>
            {m.barPct && <div className="mt-4 h-1 w-full bg-white/30 rounded-full overflow-hidden"><div className="h-full bg-secondary" style={{ width: `${m.barPct}%` }} /></div>}
            {m.miniChart && (
              <div className="mt-4 flex gap-1 items-end h-8">
                {[50, 67, 50, 75, 100].map((h, i) => (
                  <div key={i} className="w-full bg-secondary rounded-t" style={{ height: `${h}%`, opacity: 0.2 + i * 0.2 }} />
                ))}
              </div>
            )}
            {m.note && <p className="text-[11px] text-on-surface-variant mt-4 italic">{m.note}</p>}
            {m.stars && (
              <div className="flex gap-0.5 mt-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Bar Chart */}
        <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden">
          <div className="p-5 border-b border-outline-variant/30 flex justify-between items-center">
            <h4 className="font-semibold text-on-surface">Revenue Trend</h4>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-bold text-on-surface bg-white/40 rounded-md">Weekly</button>
              <button className="px-3 py-1 text-xs font-bold text-on-surface-variant hover:bg-white/30 rounded-md">Monthly</button>
            </div>
          </div>
          <div className="p-6 h-72 relative flex items-end justify-between gap-3">
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
              {[1, 2, 3, 4, 5].map((l) => <div key={l} className="w-full border-t border-outline-variant/20" />)}
            </div>
            {days.map((d) => (
              <div key={d.name} className="relative w-full group">
                <div className="bg-secondary-container/40 hover:bg-secondary-container transition-colors rounded-t w-full" style={{ height: `${d.pct}%` }} />
                <p className="text-[10px] text-on-surface-variant text-center mt-2">{d.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart */}
        <div className="glass-card rounded-xl flex flex-col">
          <div className="p-5 border-b border-outline-variant/30"><h4 className="font-semibold text-on-surface">Service Type</h4></div>
          <div className="p-5 flex-1 flex flex-col justify-center">
            <div className="relative w-40 h-40 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle className="stroke-white/30" cx="18" cy="18" fill="none" r="16" strokeWidth="4" />
                <circle className="stroke-primary" cx="18" cy="18" fill="none" r="16" strokeDasharray="60, 100" strokeWidth="4" />
                <circle className="stroke-secondary" cx="18" cy="18" fill="none" r="16" strokeDasharray="30, 100" strokeDashoffset="-60" strokeWidth="4" />
                <circle className="stroke-secondary-container" cx="18" cy="18" fill="none" r="16" strokeDasharray="10, 100" strokeDashoffset="-90" strokeWidth="4" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-on-surface">2.4k</span>
                <span className="text-[10px] text-on-surface-variant uppercase font-bold">Total Orders</span>
              </div>
            </div>
            <div className="space-y-3">
              {serviceTypes.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${s.color}`} /><span className="text-sm text-on-surface-variant">{s.name}</span></div>
                  <span className="text-sm font-bold text-on-surface">{s.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Regional Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-5 border-b border-outline-variant/30 flex justify-between items-center">
          <h4 className="font-semibold text-on-surface">Regional Performance</h4>
          <button className="text-secondary text-sm font-bold hover:underline">View All Regions</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/20">
              <tr>{["Service Area", "Total Orders", "Revenue", "Avg. Rating", "Growth", "Status"].map((h) => (
                <th key={h} className="px-5 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {regions.map((r) => (
                <tr key={r.area} className="border-t border-outline-variant/20 hover:bg-white/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-white/30 flex items-center justify-center"><span className="material-symbols-outlined text-on-surface-variant text-sm">location_on</span></div>
                      <div><p className="text-sm font-bold text-on-surface">{r.area}</p><p className="text-[11px] text-on-surface-variant">{r.location}</p></div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-medium">{r.orders}</td>
                  <td className="px-5 py-3.5 font-medium">{r.revenue}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1"><span className="font-bold">{r.rating}</span><span className="material-symbols-outlined text-secondary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span></div>
                  </td>
                  <td className="px-5 py-3.5"><span className={`font-bold ${r.growthPositive ? 'text-secondary' : 'text-error'}`}>{r.growth}</span></td>
                  <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${r.statusColor}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
