export default function ServicesRateCard() {
  const categories = [
    { name: "Laundry", icon: "local_laundry_service", count: "12 services", color: "bg-blue-50 text-primary" },
    { name: "Dry Cleaning", icon: "dry_cleaning", count: "8 services", color: "bg-cyan-50 text-secondary" },
    { name: "Ironing", icon: "iron", count: "5 services", color: "bg-amber-50 text-amber-700" },
    { name: "Specialty", icon: "auto_awesome", count: "4 services", color: "bg-purple-50 text-purple-700" },
  ];

  const services = [
    { name: "Wash & Fold", category: "Laundry", price: "$2.50 / lb", status: "Active", popular: true },
    { name: "Dry Cleaning", category: "Premium", price: "$8.99 / item", status: "Active", popular: true },
    { name: "Iron Only", category: "Laundry", price: "$3.50 / item", status: "Active", popular: false },
    { name: "Stain Removal", category: "Specialty", price: "$5.00 / item", status: "Active", popular: false },
    { name: "Curtain Cleaning", category: "Premium", price: "$15.00 / pair", status: "Active", popular: false },
    { name: "Shoe Cleaning", category: "Specialty", price: "$12.00 / pair", status: "Paused", popular: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Rate Card & Services</h1>
          <p className="text-on-surface-variant text-sm mt-1">Manage service categories and detailed pricing.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg border border-outline-variant bg-white/60 text-on-surface text-sm font-medium hover:bg-white/80 transition-colors">Export</button>
          <button className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-base">add</span> New Service
          </button>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {categories.map((c) => (
          <div key={c.name} className="glass-card rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer group">
            <div className={`p-2.5 ${c.color} rounded-lg w-fit mb-3 group-hover:scale-110 transition-transform`}>
              <span className="material-symbols-outlined">{c.icon}</span>
            </div>
            <h3 className="font-semibold text-on-surface">{c.name}</h3>
            <p className="text-xs text-on-surface-variant mt-1">{c.count}</p>
          </div>
        ))}
      </div>

      {/* Services Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
          <h3 className="font-semibold text-on-surface">All Services</h3>
          <div className="flex gap-2">
            <button className="p-2 text-on-surface-variant hover:bg-white/40 rounded-lg transition-colors border border-outline-variant/50">
              <span className="material-symbols-outlined text-lg">filter_list</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-white/40 rounded-lg transition-colors border border-outline-variant/50">
              <span className="material-symbols-outlined text-lg">search</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-on-surface-variant bg-white/20">
              <tr>
                {["Service", "Category", "Price", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.name} className="border-t border-outline-variant/20 hover:bg-white/30 transition-colors cursor-pointer">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-on-surface">{s.name}</span>
                      {s.popular && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">Popular</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-on-surface-variant">{s.category}</td>
                  <td className="px-5 py-3.5 font-semibold text-secondary">{s.price}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${s.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{s.status}</span>
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
