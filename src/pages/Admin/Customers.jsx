export default function Customers() {
  const stats = [
    { label: "Total Customers", value: "2,451", icon: "group", iconBg: "bg-blue-50", iconColor: "text-primary" },
    { label: "Active", value: "1,890", icon: "check_circle", iconBg: "bg-emerald-50", iconColor: "text-secondary", badge: "+5%" },
    { label: "Inactive", value: "561", icon: "cancel", iconBg: "bg-red-50", iconColor: "text-error" },
    { label: "Returning", value: "1,420", icon: "replay", iconBg: "bg-cyan-50", iconColor: "text-secondary", badge: "+12%" },
  ];

  const customers = [
    { id: "CUS-001", name: "John Smith", phone: "+1 (555) 123-4567", orders: "45", joined: "Oct 12, 2023", status: "Active" },
    { id: "CUS-002", name: "Emily Davis", phone: "+1 (555) 987-6543", orders: "12", joined: "Nov 05, 2023", status: "Inactive" },
    { id: "CUS-003", name: "Michael Wilson", phone: "+1 (555) 456-7890", orders: "38", joined: "Dec 20, 2023", status: "Active" },
    { id: "CUS-004", name: "Sarah Parker", phone: "+1 (555) 222-3333", orders: "56", joined: "Jan 15, 2024", status: "Active" },
    { id: "CUS-005", name: "David Kim", phone: "+1 (555) 777-8888", orders: "8", joined: "Feb 02, 2024", status: "Inactive" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Customer Management</h1>
          <p className="text-on-surface-variant text-sm mt-1">Manage your customer base and view details.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg border border-outline-variant bg-white/60 text-on-surface text-sm font-medium hover:bg-white/80 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-base">download</span>
            Export
          </button>
          <button className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-base">person_add</span>
            New Customer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div key={item.label} className="glass-card rounded-xl p-5 hover:shadow-lg transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 ${item.iconBg} rounded-lg group-hover:scale-110 transition-transform`}>
                <span className={`material-symbols-outlined ${item.iconColor}`}>{item.icon}</span>
              </div>
              {item.badge && (
                <span className="text-xs font-bold text-secondary bg-secondary-container/30 px-2 py-1 rounded-full">{item.badge}</span>
              )}
            </div>
            <p className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">{item.label}</p>
            <p className="text-2xl font-bold text-on-surface mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Customer Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
          <h3 className="font-semibold text-on-surface">Customer Directory</h3>
          <div className="flex items-center gap-2">
            <button className="p-2 text-on-surface-variant hover:bg-white/40 rounded-lg transition-colors border border-outline-variant/50">
              <span className="material-symbols-outlined text-lg">filter_list</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-on-surface-variant bg-white/20">
              <tr>
                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">ID</th>
                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">Name</th>
                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">Phone</th>
                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">Orders</th>
                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">Joined</th>
                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={c.id} className={`border-t border-outline-variant/20 hover:bg-white/30 transition-colors cursor-pointer ${i === 0 ? 'bg-white/20 border-l-2 border-l-secondary' : ''}`}>
                  <td className="px-5 py-3.5 text-on-surface-variant font-mono text-xs">{c.id}</td>
                  <td className="px-5 py-3.5 text-on-surface font-semibold">{c.name}</td>
                  <td className="px-5 py-3.5 text-on-surface-variant">{c.phone}</td>
                  <td className="px-5 py-3.5 text-on-surface font-semibold">{c.orders}</td>
                  <td className="px-5 py-3.5 text-on-surface-variant">{c.joined}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${c.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-outline-variant/30 bg-white/30 flex items-center justify-between text-xs text-on-surface-variant">
          <span>Showing 1 to 5 of 2,451 entries</span>
          <div className="flex gap-1">
            <button className="p-1.5 border border-outline-variant/50 rounded bg-white/40 hover:bg-white/60 disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-base">chevron_left</span>
            </button>
            <button className="px-2.5 py-1 rounded text-white bg-secondary text-xs font-bold">1</button>
            <button className="px-2.5 py-1 rounded border border-outline-variant/50 bg-white/40 hover:bg-white/60 text-xs font-bold">2</button>
            <button className="px-2.5 py-1 rounded border border-outline-variant/50 bg-white/40 hover:bg-white/60 text-xs font-bold">3</button>
            <button className="p-1.5 border border-outline-variant/50 rounded bg-white/40 hover:bg-white/60">
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
