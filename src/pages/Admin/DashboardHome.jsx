export default function DashboardHome() {
  const stats = [
    { label: "Total Orders", value: "1,248", hint: "+8% this week", icon: "shopping_bag", iconBg: "bg-blue-50", iconColor: "text-primary" },
    { label: "Revenue", value: "$28,430", hint: "+12% month", icon: "payments", iconBg: "bg-emerald-50", iconColor: "text-secondary" },
    { label: "Active Riders", value: "34", hint: "5 on route", icon: "two_wheeler", iconBg: "bg-cyan-50", iconColor: "text-secondary" },
    { label: "Open Tickets", value: "12", hint: "3 urgent", icon: "support_agent", iconBg: "bg-orange-50", iconColor: "text-orange-600" },
  ];

  const slaRows = [
    { metric: "Pickup SLA", value: "96%", status: "Healthy", statusColor: "bg-emerald-100 text-emerald-700" },
    { metric: "Delivery SLA", value: "93%", status: "Monitor", statusColor: "bg-orange-100 text-orange-700" },
    { metric: "Customer Satisfaction", value: "4.8/5", status: "Healthy", statusColor: "bg-emerald-100 text-emerald-700" },
    { metric: "Workshop Utilization", value: "73%", status: "Optimal", statusColor: "bg-cyan-100 text-cyan-700" },
    { metric: "Avg Turnaround", value: "18h", status: "Healthy", statusColor: "bg-emerald-100 text-emerald-700" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Admin Dashboard</h1>
          <p className="text-on-surface-variant text-sm mt-1">Today at a glance</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg border border-outline-variant bg-white/60 text-on-surface text-sm font-medium hover:bg-white/80 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-base">calendar_today</span>
            Today
          </button>
          <button className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-base">add</span>
            Create Order
          </button>
        </div>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div key={item.label} className="glass-card rounded-xl p-5 hover:shadow-lg transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 ${item.iconBg} rounded-lg group-hover:scale-110 transition-transform`}>
                <span className={`material-symbols-outlined ${item.iconColor}`}>{item.icon}</span>
              </div>
              {item.hint && (
                <span className="text-xs font-bold text-secondary bg-secondary-container/30 px-2 py-1 rounded-full">
                  {item.hint}
                </span>
              )}
            </div>
            <p className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">{item.label}</p>
            <p className="text-2xl font-bold text-on-surface mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* SLA Metrics Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
          <h3 className="font-semibold text-on-surface">Performance Overview</h3>
          <button className="text-secondary text-sm font-semibold hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-on-surface-variant bg-white/20">
              <tr>
                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">Metric</th>
                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">Value</th>
                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {slaRows.map((row) => (
                <tr key={row.metric} className="border-t border-outline-variant/20 hover:bg-white/30 transition-colors">
                  <td className="px-5 py-3.5 text-on-surface font-medium">{row.metric}</td>
                  <td className="px-5 py-3.5 text-on-surface font-bold">{row.value}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${row.statusColor}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
