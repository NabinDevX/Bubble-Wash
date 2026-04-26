export default function Workshops() {
  const stats = [
    { label: "Total Workshops", value: "24", icon: "storefront", iconBg: "bg-blue-50", iconColor: "text-primary" },
    { label: "Active", value: "18", icon: "check_circle", iconBg: "bg-emerald-50", iconColor: "text-secondary" },
    { label: "Inactive", value: "6", icon: "cancel", iconBg: "bg-red-50", iconColor: "text-error" },
  ];

  const workshops = [
    { id: "WS-001", name: "Downtown Washhouse", mobile: "+1 (555) 123-4567", joined: "Oct 12, 2023", status: "Active", orders: "1,245", selected: true },
    { id: "WS-002", name: "Uptown Cleaners", mobile: "+1 (555) 987-6543", joined: "Nov 05, 2023", status: "Active", orders: "892" },
    { id: "WS-003", name: "Suburban Spin", mobile: "+1 (555) 456-7890", joined: "Dec 20, 2023", status: "Inactive", orders: "340" },
    { id: "WS-004", name: "EcoWash Central", mobile: "+1 (555) 222-3333", joined: "Jan 15, 2024", status: "Active", orders: "512" },
    { id: "WS-005", name: "Rapid Ironing Works", mobile: "+1 (555) 777-8888", joined: "Feb 02, 2024", status: "Active", orders: "210" },
  ];

  const services = [
    { name: "Wash & Fold", icon: "local_laundry_service", active: true },
    { name: "Dry Cleaning", icon: "dry_cleaning", active: true },
    { name: "Ironing", icon: "iron", active: true },
    { name: "Shoe Cleaning", icon: "imagesearch_roller", active: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-headline-md text-headline-md text-on-surface">Workshop Management</h1>
        <button className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-base">add</span>
          Add Workshop
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-5 flex items-center justify-between hover:shadow-lg transition-shadow">
            <div>
              <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.label === 'Active' ? 'text-secondary' : s.label === 'Inactive' ? 'text-error' : 'text-on-surface'}`}>{s.value}</p>
            </div>
            <div className={`h-12 w-12 rounded-lg ${s.iconBg} flex items-center justify-center`}>
              <span className={`material-symbols-outlined ${s.iconColor}`}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Table */}
        <div className="flex-1 glass-card rounded-xl overflow-hidden w-full lg:w-2/3">
          <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
            <h3 className="font-semibold text-on-surface text-sm">Workshop Directory</h3>
            <button className="p-1.5 text-on-surface-variant hover:bg-white/40 rounded-md transition-colors border border-outline-variant/50">
              <span className="material-symbols-outlined text-lg">filter_list</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-on-surface-variant bg-white/20 text-xs uppercase tracking-wider">
                <tr>
                  {["ID", "Name", "Mobile", "Joined Date", "Status", "Orders"].map((h) => (
                    <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {workshops.map((w) => (
                  <tr key={w.id} className={`border-t border-outline-variant/20 hover:bg-white/30 transition-colors cursor-pointer ${w.selected ? 'bg-white/20 border-l-2 border-l-secondary' : ''}`}>
                    <td className="px-4 py-3 text-on-surface-variant">{w.id}</td>
                    <td className={`px-4 py-3 font-medium ${w.selected ? 'text-secondary' : 'text-on-surface'}`}>{w.name}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{w.mobile}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{w.joined}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${w.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{w.status}</span>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">{w.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-outline-variant/30 bg-white/30 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Showing 1 to 5 of 24 entries</span>
            <div className="flex gap-1">
              <button className="p-1 border border-outline-variant/50 rounded disabled:opacity-50" disabled><span className="material-symbols-outlined text-base">chevron_left</span></button>
              <button className="px-2 py-0.5 rounded bg-secondary text-white text-xs font-bold">1</button>
              <button className="px-2 py-0.5 rounded border border-outline-variant/50 text-xs font-bold">2</button>
              <button className="px-2 py-0.5 rounded border border-outline-variant/50 text-xs font-bold">3</button>
              <button className="p-1 border border-outline-variant/50 rounded"><span className="material-symbols-outlined text-base">chevron_right</span></button>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="w-full lg:w-1/3 glass-card rounded-xl overflow-hidden flex flex-col sticky top-20 shadow-lg">
          <div className="p-6 border-b border-outline-variant/30 bg-white/30 relative">
            <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">Active</span>
            <div className="h-16 w-16 bg-white/40 rounded-xl flex items-center justify-center text-secondary mb-4 border border-outline-variant/50 shadow-sm">
              <span className="material-symbols-outlined" style={{ fontSize: 32 }}>store</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface">Downtown Washhouse</h3>
            <p className="text-on-surface-variant text-xs mt-1">ID: WS-001</p>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
            <div>
              <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3 border-b border-outline-variant/30 pb-1">Contact Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3"><span className="material-symbols-outlined text-outline text-lg">call</span><span>+1 (555) 123-4567</span></div>
                <div className="flex items-center gap-3"><span className="material-symbols-outlined text-outline text-lg">mail</span><span>contact@downtownwash.com</span></div>
                <div className="flex items-start gap-3"><span className="material-symbols-outlined text-outline text-lg mt-0.5">location_on</span><span>123 Main St, Suite 100<br />Metropolis, NY 10001</span></div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3 border-b border-outline-variant/30 pb-1">Services Offered</h4>
              <div className="flex flex-wrap gap-2">
                {services.map((s) => (
                  <span key={s.name} className={`px-3 py-1 bg-white/40 border border-outline-variant/50 rounded text-xs flex items-center gap-1.5 ${s.active ? '' : 'opacity-50'}`}>
                    <span className={`material-symbols-outlined ${s.active ? 'text-secondary' : 'text-outline'}`} style={{ fontSize: 14 }}>{s.icon}</span>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/30 p-3 rounded border border-outline-variant/50">
                <p className="text-xs text-on-surface-variant mb-1">Total Orders</p>
                <p className="font-bold text-on-surface">1,245</p>
              </div>
              <div className="bg-white/30 p-3 rounded border border-outline-variant/50">
                <p className="text-xs text-on-surface-variant mb-1">Last Service</p>
                <p className="font-bold text-on-surface">Today, 10:30 AM</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-outline-variant/30 bg-white/30 flex gap-3">
            <button className="flex-1 border border-outline-variant bg-white/60 text-on-surface px-4 py-2 rounded text-sm font-medium hover:bg-white/80 transition-colors">Edit Profile</button>
            <button className="flex-1 bg-linear-to-r from-secondary-fixed-dim to-secondary text-white px-4 py-2 rounded text-sm font-medium hover:shadow-md transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">receipt_long</span>
              Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
