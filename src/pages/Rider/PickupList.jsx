export default function RiderPickupList() {
  const pickups = [
    { id: "BW-950", customer: "Sarah Parker", address: "88 Ocean Dr", slot: "08:00 - 10:00", items: "3 bags", status: "Pending", statusColor: "bg-orange-100 text-orange-700", icon: "light_mode" },
    { id: "BW-951", customer: "Chris Hall", address: "15 Main St", slot: "10:00 - 12:00", items: "1 bag", status: "En Route", statusColor: "bg-blue-100 text-blue-700", icon: "sunny" },
    { id: "BW-956", customer: "Lina Patel", address: "209 Elm St", slot: "14:00 - 16:00", items: "2 bags", status: "Scheduled", statusColor: "bg-slate-100 text-slate-600", icon: "partly_cloudy_day" },
    { id: "BW-960", customer: "Marcus Lee", address: "45 Park Ave", slot: "16:00 - 18:00", items: "4 bags", status: "Pending", statusColor: "bg-orange-100 text-orange-700", icon: "partly_cloudy_day" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Pickup List</h1>
          <p className="text-on-surface-variant text-sm mt-1">Scheduled pickups for your active shift.</p>
        </div>
        <button className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2 w-fit">
          <span className="material-symbols-outlined text-base">play_arrow</span> Start Pickups
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Pickups", value: pickups.length.toString(), icon: "inventory_2", color: "bg-blue-50 text-primary" },
          { label: "Pending", value: pickups.filter(p => p.status === "Pending").length.toString(), icon: "pending", color: "bg-orange-50 text-orange-700" },
          { label: "En Route", value: pickups.filter(p => p.status === "En Route").length.toString(), icon: "local_shipping", color: "bg-cyan-50 text-secondary" },
          { label: "Scheduled", value: pickups.filter(p => p.status === "Scheduled").length.toString(), icon: "schedule", color: "bg-slate-50 text-slate-600" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4 flex items-center gap-4">
            <div className={`p-2.5 rounded-lg ${s.color}`}><span className="material-symbols-outlined">{s.icon}</span></div>
            <div><p className="text-xs text-on-surface-variant uppercase font-semibold">{s.label}</p><p className="text-xl font-bold text-on-surface">{s.value}</p></div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {pickups.map((p) => (
          <div key={p.id} className="glass-card rounded-xl p-5 hover:shadow-lg transition-shadow flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-2.5 bg-white/30 rounded-lg">
                <span className="material-symbols-outlined text-secondary">{p.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-xs text-secondary font-semibold">{p.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${p.statusColor}`}>{p.status}</span>
                </div>
                <p className="font-semibold text-on-surface">{p.customer}</p>
                <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-sm">location_on</span> {p.address}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="text-[10px] text-on-surface-variant uppercase font-bold">Slot</p>
                <p className="font-semibold text-on-surface">{p.slot}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-on-surface-variant uppercase font-bold">Items</p>
                <p className="font-semibold text-on-surface">{p.items}</p>
              </div>
              <button className="p-2 text-secondary hover:bg-white/30 rounded-lg transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
