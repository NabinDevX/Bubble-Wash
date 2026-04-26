export default function Riders() {
  const stats = [
    { label: "Total Riders", value: "1,284", icon: "groups", iconBg: "bg-blue-50", iconColor: "text-primary", badge: "+12%", watermark: "motorcycle" },
    { label: "Active Now", value: "412", icon: "electric_moped", iconBg: "bg-cyan-50", iconColor: "text-cyan-600", badge: "85% active", watermark: "electric_bike" },
    { label: "On-Time Rate", value: "2.4k", suffix: "wkly", icon: "task_alt", iconBg: "bg-orange-50", iconColor: "text-orange-600", badge: "98.4%", watermark: "local_shipping" },
    { label: "Rider Rating", value: "4.92", icon: "star", iconBg: "bg-yellow-50", iconColor: "text-yellow-600", badge: "4.8 avg", watermark: "star" },
  ];

  const riders = [
    { id: "#RD-9281", name: "Jameson Daniel", area: "Downtown Area", phone: "+1 (555) 012-3456", joined: "Oct 12, 2023", lastService: "2 mins ago", pick: 42, del: 38, statusColor: "bg-green-500", initials: "JD" },
    { id: "#RD-9244", name: "Amara White", area: "North Harbor", phone: "+1 (555) 012-7890", joined: "Nov 04, 2023", lastService: "14 mins ago", pick: 15, del: 12, statusColor: "bg-yellow-500", initials: "AW" },
    { id: "#RD-9102", name: "Kevin Leon", area: "West Suburbs", phone: "+1 (555) 012-1122", joined: "Aug 29, 2023", lastService: "5 hours ago", pick: 89, del: 94, statusColor: "bg-slate-400", initials: "KL" },
    { id: "#RD-8840", name: "Sarah Miller", area: "Downtown Area", phone: "+1 (555) 012-5566", joined: "Jan 15, 2024", lastService: "Just now", pick: 8, del: 5, statusColor: "bg-green-500", initials: "SM" },
  ];

  const feed = [
    { text: "Jameson Daniel completed delivery #BW-4412", time: "2 mins ago", color: "bg-green-500" },
    { text: "Amara White picked up order #BW-4418", time: "14 mins ago", color: "bg-yellow-500" },
    { text: "Kevin Leon went off-duty", time: "5 hours ago", color: "bg-slate-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Riders Management</h1>
          <p className="text-on-surface-variant text-sm mt-1">Monitor rider performance and assignments.</p>
        </div>
        <button className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2 w-fit">
          <span className="material-symbols-outlined text-lg">person_add</span> Add New Rider
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-5 relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined" style={{ fontSize: 80 }}>{s.watermark}</span></div>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 ${s.iconBg} rounded-lg`}><span className={`material-symbols-outlined ${s.iconColor}`}>{s.icon}</span></div>
              <span className="text-xs font-bold text-secondary bg-secondary-container/30 px-2 py-1 rounded-full">{s.badge}</span>
            </div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{s.label}</h4>
            <p className="text-3xl font-bold text-on-surface mt-1">{s.value} {s.suffix && <span className="text-sm font-normal text-on-surface-variant">{s.suffix}</span>}</p>
          </div>
        ))}
      </div>

      {/* Fleet Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-on-surface">Fleet Summary</h3>
            <div className="flex gap-1">
              {["All", "Active", "Idle", "Off-duty"].map((f, i) => (
                <span key={f} className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors ${i === 1 ? 'bg-secondary text-white' : 'bg-white/40 border border-outline-variant/50 hover:bg-white/60'}`}>{f}</span>
              ))}
            </div>
          </div>
          <button className="text-sm font-medium text-secondary hover:underline flex items-center gap-1">View Detailed Map <span className="material-symbols-outlined text-base">arrow_forward</span></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/20 text-on-surface-variant text-[11px] uppercase tracking-widest font-bold">
              <tr>
                {["Rider ID", "Name & Status", "Mobile", "Joined Date", "Last Service", "Activity (P/D)", ""].map((h) => (
                  <th key={h} className={`px-5 py-3 ${h === 'Activity (P/D)' ? 'text-center' : ''} ${h === '' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {riders.map((r) => (
                <tr key={r.id} className="border-t border-outline-variant/20 hover:bg-white/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-on-surface-variant">{r.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-white/40 border border-outline-variant/50 flex items-center justify-center font-bold text-xs text-on-surface-variant">{r.initials}</div>
                        <span className={`absolute bottom-0 right-0 w-3 h-3 ${r.statusColor} border-2 border-white rounded-full`} />
                      </div>
                      <div><p className="font-semibold text-on-surface">{r.name}</p><p className="text-xs text-on-surface-variant">{r.area}</p></div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-on-surface-variant">{r.phone}</td>
                  <td className="px-5 py-3.5 text-on-surface-variant">{r.joined}</td>
                  <td className="px-5 py-3.5 text-on-surface-variant">{r.lastService}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-center items-center gap-4">
                      <div className="text-center"><span className="text-[10px] text-on-surface-variant block uppercase">Pick</span><span className="font-bold text-on-surface">{r.pick}</span></div>
                      <div className="h-6 w-[1px] bg-outline-variant/50" />
                      <div className="text-center"><span className="text-[10px] text-on-surface-variant block uppercase">Del</span><span className="font-bold text-on-surface">{r.del}</span></div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="p-2 text-on-surface-variant hover:text-secondary hover:bg-white/40 rounded-lg transition-all"><span className="material-symbols-outlined">more_vert</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-outline-variant/30 bg-white/30 flex items-center justify-between">
          <p className="text-sm text-on-surface-variant">Showing <span className="font-semibold text-on-surface">1-10</span> of <span className="font-semibold text-on-surface">1,284</span> riders</p>
          <div className="flex gap-1">
            <button className="p-2 border border-outline-variant/50 rounded-lg"><span className="material-symbols-outlined text-lg">chevron_left</span></button>
            <button className="px-3 py-1 bg-secondary text-white text-sm font-bold rounded-lg">1</button>
            <button className="px-3 py-1 border border-outline-variant/50 text-sm font-semibold rounded-lg">2</button>
            <button className="px-3 py-1 border border-outline-variant/50 text-sm font-semibold rounded-lg">3</button>
            <button className="p-2 border border-outline-variant/50 rounded-lg"><span className="material-symbols-outlined text-lg">chevron_right</span></button>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-on-surface">Active Zone Coverage</h3>
            <select className="bg-white/40 border border-outline-variant/50 text-xs font-bold rounded-lg px-3 py-1">
              <option>Daily View</option><option>Weekly View</option>
            </select>
          </div>
          <div className="relative h-48 bg-white/20 rounded-lg overflow-hidden flex items-center justify-center border border-outline-variant/30">
            <div className="flex gap-6">
              {[{ zone: "Downtown", count: 156 }, { zone: "North Harbor", count: 92 }, { zone: "West Suburbs", count: 48 }].map((z) => (
                <div key={z.zone} className="text-center">
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">{z.zone}</p>
                  <p className="text-xl font-bold text-on-surface">{z.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold text-on-surface mb-5">Real-time Feed</h3>
          <div className="space-y-5">
            {feed.map((f, i) => (
              <div key={i} className="flex gap-4">
                <div className={`w-2 h-2 rounded-full ${f.color} mt-2 shrink-0`} />
                <div><p className="text-xs font-semibold text-on-surface">{f.text}</p><p className="text-[10px] text-on-surface-variant">{f.time}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
