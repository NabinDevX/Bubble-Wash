export default function Tickets() {
  const stats = [
    { label: "Total Open", value: "1,284", icon: "confirmation_number", iconBg: "bg-blue-50", iconColor: "text-primary", badge: "+24 today" },
    { label: "Pending", value: "42", icon: "pending_actions", iconBg: "bg-orange-50", iconColor: "text-orange-700", badge: "Urgent: 8", badgeColor: "text-error bg-red-50" },
    { label: "Resolved Today", value: "156", icon: "check_circle", iconBg: "bg-cyan-50", iconColor: "text-cyan-700", badge: "94% Rate" },
    { label: "Avg. Response Time", value: "18m", icon: "timer", iconBg: "bg-purple-50", iconColor: "text-purple-700", badge: "-2m avg" },
  ];

  const tickets = [
    { id: "#TK-8492", customer: "Eleanor Shellstrop", issue: "Delayed delivery for Order #4421", date: "Oct 24, 09:12 AM", status: "Processing", statusColor: "bg-orange-100 text-orange-700", assignee: "John Doe", initials: "JD" },
    { id: "#TK-8488", customer: "Chidi Anagonye", issue: "Stained linen report - Premium Silk", date: "Oct 23, 04:45 PM", status: "Resolved", statusColor: "bg-emerald-100 text-emerald-700", assignee: "Alice Sun", initials: "AS" },
    { id: "#TK-8481", customer: "Tahani Al-Jamil", issue: "Missing item in wedding set", date: "Oct 23, 11:20 AM", status: "Critical", statusColor: "bg-red-100 text-red-700", assignee: "Michael K.", initials: "MK" },
    { id: "#TK-8475", customer: "Jason Mendoza", issue: "App login issues", date: "Oct 22, 02:15 PM", status: "On Hold", statusColor: "bg-slate-100 text-slate-600", assignee: "Unassigned", initials: null },
  ];

  const categories = [
    { name: "Logistics", icon: "local_shipping", count: "142" },
    { name: "Quality Control", icon: "dry_cleaning", count: "88" },
    { name: "Billing", icon: "payments", count: "34" },
    { name: "Tech Support", icon: "smartphone", count: "19" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Ticket Management</h1>
          <p className="text-on-surface-variant text-sm mt-1">Customer support queues and resolutions.</p>
        </div>
        <button className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2 w-fit">
          <span className="material-symbols-outlined text-base">add</span> Create Ticket
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-5 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 ${s.iconBg} rounded-lg`}><span className={`material-symbols-outlined ${s.iconColor}`}>{s.icon}</span></div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${s.badgeColor || 'text-secondary bg-secondary-container/30'}`}>{s.badge}</span>
            </div>
            <p className="text-on-surface-variant text-xs font-bold uppercase mb-1">{s.label}</p>
            <h3 className="text-2xl font-bold text-on-surface">{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Ticket Table */}
        <div className="lg:col-span-3">
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40 flex justify-between items-center">
              <h3 className="font-semibold text-on-surface">Active Support Tickets</h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/40 rounded-lg transition-colors border border-outline-variant/50"><span className="material-symbols-outlined text-lg">filter_list</span></button>
                <button className="p-2 hover:bg-white/40 rounded-lg transition-colors border border-outline-variant/50"><span className="material-symbols-outlined text-lg">download</span></button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/20">
                  <tr>
                    {["Ticket ID", "Customer", "Issue", "Date", "Status", "Assigned To", ""].map((h) => (
                      <th key={h} className="px-5 py-3 text-xs font-bold text-on-surface-variant uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id} className="border-t border-outline-variant/20 hover:bg-white/30 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs text-secondary font-semibold">{t.id}</td>
                      <td className="px-5 py-3.5 font-medium">{t.customer}</td>
                      <td className="px-5 py-3.5 text-on-surface-variant text-xs">{t.issue}</td>
                      <td className="px-5 py-3.5 text-xs">{t.date}</td>
                      <td className="px-5 py-3.5"><span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${t.statusColor}`}>{t.status}</span></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          {t.initials ? <div className="w-6 h-6 rounded-full bg-secondary/20 text-secondary text-[10px] flex items-center justify-center font-bold">{t.initials}</div> : null}
                          <span className={`text-sm ${!t.initials ? 'text-on-surface-variant italic' : ''}`}>{t.assignee}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right"><button className="text-secondary hover:underline text-sm font-medium">View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 bg-white/30 border-t border-outline-variant/30 flex justify-between items-center">
              <p className="text-xs text-on-surface-variant">Showing 4 of 1,284 tickets</p>
              <div className="flex gap-1">
                <button className="p-1.5 border border-outline-variant/50 rounded disabled:opacity-50" disabled><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                <button className="p-1.5 border border-outline-variant/50 rounded"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="glass-card rounded-xl p-5">
            <h3 className="font-semibold text-on-surface text-sm mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">category</span> Issue Categories
            </h3>
            <div className="space-y-2">
              {categories.map((c) => (
                <div key={c.name} className="p-3 bg-white/30 rounded-lg border border-outline-variant/30 flex justify-between items-center hover:border-secondary/50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-secondary transition-colors">{c.icon}</span>
                    <span className="text-sm font-medium">{c.name}</span>
                  </div>
                  <span className="bg-white/40 text-on-surface px-2 py-0.5 rounded text-[10px] font-bold">{c.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Efficiency Widget */}
          <div className="rounded-xl p-5 bg-linear-to-br from-secondary to-primary shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><span className="material-symbols-outlined text-7xl text-white">verified</span></div>
            <h4 className="text-white font-semibold text-sm mb-2 relative z-10">Weekly Efficiency</h4>
            <p className="text-white/70 text-xs mb-4 relative z-10 leading-relaxed">Your team resolved 14% more tickets this week compared to last.</p>
            <div className="h-1 bg-white/20 rounded-full mb-2 overflow-hidden"><div className="h-full bg-white/80 w-[78%]" /></div>
            <span className="text-white text-[10px] font-medium">78% SLA Goal Achieved</span>
          </div>

          {/* Urgent Actions */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="font-semibold text-on-surface text-sm mb-4">Urgent Actions</h3>
            <div className="space-y-4">
              <div className="flex gap-3"><div className="w-2 h-2 mt-1.5 rounded-full bg-error shrink-0" /><div><p className="text-xs font-semibold">Review Escalated Ticket #TK-8481</p><p className="text-[10px] text-on-surface-variant">Escalated 20m ago</p></div></div>
              <div className="flex gap-3"><div className="w-2 h-2 mt-1.5 rounded-full bg-orange-400 shrink-0" /><div><p className="text-xs font-semibold">Unassigned logistics query</p><p className="text-[10px] text-on-surface-variant">Waiting 2h</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
