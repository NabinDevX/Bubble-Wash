import { useState, useEffect } from "react";
import api from "../../lib/api.js";

export default function RiderDeliveryList() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get("/rider/tasks");
        const tasks = data.tasks ?? data.data ?? data ?? [];
        setDeliveries(
          tasks.filter((t) => t.type === "delivery" || t.taskType === "delivery").map((t) => ({
            id: t.orderId ?? t._id ?? t.id,
            customer: t.customerName ?? t.user?.name ?? "—",
            address: t.address?.street ?? t.deliveryAddress ?? "—",
            eta: t.eta ?? "—",
            items: t.items ? `${t.items} bags` : "—",
            status: t.status ?? "Queued",
            statusColor: (t.status ?? "Queued") === "In Transit" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700",
            priority: t.priority ?? "Normal",
          }))
        );
      } catch {
        setDeliveries([
          { id: "BW-901", customer: "John Smith", address: "124 Market St", eta: "12 min", items: "2 bags", status: "In Transit", statusColor: "bg-blue-100 text-blue-700", priority: "Normal" },
          { id: "BW-912", customer: "David Kim", address: "402 7th St", eta: "41 min", items: "3 bags", status: "Queued", statusColor: "bg-orange-100 text-orange-700", priority: "Express" },
        ]);
      } finally { setLoading(false); }
    }
    load();
  }, []);

  async function updateStatus(orderId, newStatus) {
    try {
      await api.put(`/rider/tasks/${orderId}/status`, { status: newStatus });
      setDeliveries((prev) => prev.map((d) => d.id === orderId ? { ...d, status: newStatus, statusColor: newStatus === "Delivered" ? "bg-emerald-100 text-emerald-700" : d.statusColor } : d));
    } catch (err) { alert(err.message); }
  }

  const statCards = [
    { label: "Active Deliveries", value: String(deliveries.length), icon: "local_shipping", color: "bg-blue-50 text-primary" },
    { label: "In Transit", value: String(deliveries.filter((d) => d.status === "In Transit").length), icon: "delivery_dining", color: "bg-cyan-50 text-secondary" },
    { label: "Avg. ETA", value: deliveries.length > 0 ? `${Math.round(deliveries.reduce((a, d) => a + (parseInt(d.eta) || 0), 0) / deliveries.length)} min` : "—", icon: "schedule", color: "bg-orange-50 text-orange-700" },
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

      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${loading ? "animate-pulse" : ""}`}>
        {statCards.map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4 flex items-center gap-4">
            <div className={`p-2.5 rounded-lg ${s.color}`}><span className="material-symbols-outlined">{s.icon}</span></div>
            <div><p className="text-xs text-on-surface-variant uppercase font-semibold">{s.label}</p><p className="text-xl font-bold text-on-surface">{s.value}</p></div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-on-surface-variant">Loading deliveries…</div>
        ) : deliveries.length === 0 ? (
          <div className="text-center py-8 text-on-surface-variant">No deliveries assigned</div>
        ) : (
          deliveries.map((d) => (
            <div key={d.id} className="glass-card rounded-xl p-5 hover:shadow-lg transition-shadow flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="p-2.5 bg-white/30 rounded-lg"><span className="material-symbols-outlined text-secondary">local_shipping</span></div>
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
                <div className="text-center"><p className="text-[10px] text-on-surface-variant uppercase font-bold">ETA</p><p className="font-semibold text-on-surface">{d.eta}</p></div>
                <div className="text-center"><p className="text-[10px] text-on-surface-variant uppercase font-bold">Items</p><p className="font-semibold text-on-surface">{d.items}</p></div>
                {d.status !== "Delivered" && (
                  <button onClick={() => updateStatus(d.id, "Delivered")} className="px-3 py-1.5 text-xs font-semibold text-white bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">Mark Done</button>
                )}
                <button className="p-2 text-secondary hover:bg-white/30 rounded-lg transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
