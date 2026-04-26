export default function ServiceAreas() {
  const stats = [
    { label: "Active Pin Codes", value: "142", icon: "pin_drop", iconBg: "bg-blue-50", iconColor: "text-primary", badge: "+12%", badgeColor: "text-green-600 bg-green-50" },
    { label: "Total Orders", value: "8,432", icon: "shopping_cart", iconBg: "bg-cyan-50", iconColor: "text-secondary", badge: "+8%", badgeColor: "text-green-600 bg-green-50" },
    { label: "Avg. Revenue / Area", value: "$4,210", icon: "payments", iconBg: "bg-purple-50", iconColor: "text-purple-600", badge: "-2%", badgeColor: "text-red-600 bg-red-50" },
    { label: "Coverage Radius", value: "45 km", icon: "distance", iconBg: "bg-orange-50", iconColor: "text-orange-600", badge: "Static", badgeColor: "text-slate-400 bg-slate-50" },
  ];

  const areas = [
    { city: "New York", abbr: "NY", pin: "10001", area: "Manhattan Mid-town", orders: "1,240", date: "Oct 12, 2023", revenue: "$24,500.00", status: "Active", statusColor: "bg-cyan-100 text-secondary" },
    { city: "Los Angeles", abbr: "LA", pin: "90012", area: "Downtown LA", orders: "982", date: "Nov 05, 2023", revenue: "$18,240.50", status: "Active", statusColor: "bg-cyan-100 text-secondary" },
    { city: "Chicago", abbr: "CHI", pin: "60601", area: "The Loop", orders: "754", date: "Jan 20, 2024", revenue: "$12,110.00", status: "Reviewing", statusColor: "bg-blue-100 text-primary" },
    { city: "San Francisco", abbr: "SF", pin: "94103", area: "South of Market", orders: "2,110", date: "Aug 14, 2023", revenue: "$42,890.00", status: "Active", statusColor: "bg-cyan-100 text-secondary" },
    { city: "Miami", abbr: "MIA", pin: "33101", area: "Miami Beach", orders: "421", date: "Feb 02, 2024", revenue: "$6,700.25", status: "Maintenance", statusColor: "bg-red-100 text-error" },
  ];

  const zones = [
    { name: "North Sector", pct: 82, color: "bg-primary", textColor: "text-primary" },
    { name: "Central Sector", pct: 95, color: "bg-secondary", textColor: "text-secondary" },
    { name: "Coastal Sector", pct: 45, color: "bg-orange-400", textColor: "text-orange-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Service Areas</h1>
          <p className="text-on-surface-variant text-sm mt-1 flex items-center gap-2">
            <span>Management</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-secondary font-semibold">Pin Code Coverage</span>
          </p>
        </div>
        <button className="px-5 py-2.5 bg-linear-to-r from-secondary-fixed-dim to-secondary text-white font-semibold rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all text-sm">
          <span className="material-symbols-outlined">add_location</span> New Pin Code
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-5 flex flex-col gap-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className={`w-10 h-10 ${s.iconBg} rounded-lg flex items-center justify-center`}><span className={`material-symbols-outlined ${s.iconColor}`}>{s.icon}</span></div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${s.badgeColor}`}>{s.badge}</span>
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-on-surface-variant mb-1">{s.label}</p>
              <h3 className="text-2xl font-bold text-on-surface">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Serviced Locations</h3>
            <div className="flex items-center gap-2 bg-white/40 px-3 py-1.5 rounded-lg border border-outline-variant/50">
              <span className="material-symbols-outlined text-sm text-on-surface-variant">filter_list</span>
              <span className="text-xs font-medium text-on-surface-variant">Filters</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-1.5 text-on-surface-variant hover:text-secondary transition-colors"><span className="material-symbols-outlined text-lg">download</span></button>
            <button className="p-1.5 text-on-surface-variant hover:text-secondary transition-colors"><span className="material-symbols-outlined text-lg">more_vert</span></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/20">
              <tr>
                {["City", "Pin Code", "Area Name", "Orders Received", "Activation Date", "Revenue", "Status"].map((h) => (
                  <th key={h} className={`px-5 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest ${h === 'Orders Received' || h === 'Revenue' ? 'text-right' : ''} ${h === 'Pin Code' ? 'text-center' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {areas.map((a) => (
                <tr key={a.pin} className="border-t border-outline-variant/20 hover:bg-white/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-white/30 flex items-center justify-center text-xs font-bold text-on-surface-variant">{a.abbr}</div>
                      <span className="text-sm font-semibold text-on-surface">{a.city}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-center"><span className="font-mono bg-white/30 px-2 py-1 rounded text-xs">{a.pin}</span></td>
                  <td className="px-5 py-3.5 text-on-surface-variant font-medium">{a.area}</td>
                  <td className="px-5 py-3.5 text-right"><span className="font-bold text-on-surface">{a.orders}</span></td>
                  <td className="px-5 py-3.5 text-on-surface-variant">{a.date}</td>
                  <td className="px-5 py-3.5 text-right font-bold text-secondary">{a.revenue}</td>
                  <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${a.statusColor}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 bg-white/30 border-t border-outline-variant/30 flex items-center justify-between">
          <p className="text-xs font-medium text-on-surface-variant">Showing 1 to 5 of 142 entries</p>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/50"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-secondary text-white text-xs font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/50 text-xs font-bold">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/50 text-xs font-bold">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/50"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
          </div>
        </div>
      </div>

      {/* Zone Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden min-h-[300px] relative flex items-center justify-center">
          <div className="text-center p-8">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">map</span>
            <h4 className="text-xs font-bold uppercase text-on-surface-variant tracking-wider mb-2">Live Coverage Map</h4>
            <div className="flex items-center gap-4 justify-center mt-4">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-secondary" /><span className="text-xs font-medium">High Density</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary" /><span className="text-xs font-medium">Standard Coverage</span></div>
            </div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-xl flex flex-col gap-6">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Zone Performance</h3>
          <div className="space-y-5">
            {zones.map((z) => (
              <div key={z.name} className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-on-surface-variant">{z.name}</span>
                  <span className={`font-bold ${z.textColor}`}>{z.pct}% Capacity</span>
                </div>
                <div className="w-full bg-white/30 h-2 rounded-full overflow-hidden"><div className={`${z.color} h-full rounded-full`} style={{ width: `${z.pct}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-auto p-4 bg-white/20 rounded-lg border border-dashed border-outline-variant/50">
            <p className="text-[11px] text-on-surface-variant leading-relaxed italic">"Optimal efficiency reached in Central Sector. Suggesting expansion to adjacent pin codes (10014, 10018) to balance logistics load."</p>
          </div>
        </div>
      </div>
    </div>
  );
}
