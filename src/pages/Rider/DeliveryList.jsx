export default function RiderDeliveryList() {
  const deliveries = [
    { id: "BW-901", customer: "John Smith", address: "124 Market St", eta: "12 min", items: "2 bags", status: "In Transit", statusColor: "bg-blue-100 text-blue-700", priority: "Normal" },
    { id: "BW-904", customer: "Emily Davis", address: "19 Pine Ave", eta: "25 min", items: "1 bag", status: "In Transit", statusColor: "bg-blue-100 text-blue-700", priority: "Normal" },
    { id: "BW-912", customer: "David Kim", address: "402 7th St", eta: "41 min", items: "3 bags", status: "Queued", statusColor: "bg-orange-100 text-orange-700", priority: "Express" },
    { id: "BW-918", customer: "Ana Costa", address: "88 Sunset Blvd", eta: "55 min", items: "2 bags", status: "Queued", statusColor: "bg-orange-100 text-orange-700", priority: "Normal" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Delivery List</h1>
          <p className="text-on-surface-variant text-sm mt-1">Orders currently out for delivery.</p>
        </div>
        <button className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2 w-fit">
          <span className="material-symbols-outlined text-base">route</span> Optimize Route
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Active Deliveries", value: deliveries.length.toString(), icon: "local_shipping", color: "bg-blue-50 text-primary" },
          { label: "In Transit", value: deliveries.filter(d => d.status === "In Transit").length.toString(), icon: "delivery_dining", color: "bg-cyan-50 text-secondary" },
          { label: "Avg. ETA", value: "33 min", icon: "schedule", color: "bg-orange-50 text-orange-700" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4 flex items-center gap-4">
            <div className={`p-2.5 rounded-lg ${s.color}`}><span className="material-symbols-outlined">{s.icon}</span></div>
            <div><p className="text-xs text-on-surface-variant uppercase font-semibold">{s.label}</p><p className="text-xl font-bold text-on-surface">{s.value}</p></div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {deliveries.map((d) => (
          <div key={d.id} className="glass-card rounded-xl p-5 hover:shadow-lg transition-shadow flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-2.5 bg-white/30 rounded-lg">
                <span className="material-symbols-outlined text-secondary">local_shipping</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-xs text-secondary font-semibold">{d.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${d.statusColor}`}>{d.status}</span>
                  {d.priority === "Express" && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-700">Express</span>}
                </div>
                <p className="font-semibold text-on-surface">{d.customer}</p>
                <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-sm">location_on</span> {d.address}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="text-[10px] text-on-surface-variant uppercase font-bold">ETA</p>
                <p className="font-semibold text-on-surface">{d.eta}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-on-surface-variant uppercase font-bold">Items</p>
                <p className="font-semibold text-on-surface">{d.items}</p>
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
