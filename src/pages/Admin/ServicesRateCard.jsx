import { useState, useEffect } from "react";
import api from "../../lib/api.js";

export default function ServicesRateCard() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await api.get("/admin/services");
        const list = data.services ?? data.data ?? data ?? [];
        setServices(
          list.map((s) => ({
            id: s._id ?? s.id,
            name: s.name ?? "Unknown",
            category: s.category ?? "—",
            price: s.pricePerKg ? `$${s.pricePerKg} / kg` : s.pricePerItem ? `$${s.pricePerItem} / item` : s.price ? `$${s.price}` : "—",
            status: s.isActive !== false ? "Active" : "Paused",
            popular: s.popular ?? false,
          }))
        );
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  // Derive categories from services list
  const categoryMap = {};
  services.forEach((s) => {
    const cat = s.category || "Other";
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  const categoryIcons = { Laundry: "local_laundry_service", "Dry Cleaning": "dry_cleaning", Ironing: "iron", Specialty: "auto_awesome", wash: "local_laundry_service", premium: "dry_cleaning" };
  const categoryColors = { Laundry: "bg-blue-50 text-primary", "Dry Cleaning": "bg-cyan-50 text-secondary", Ironing: "bg-amber-50 text-amber-700", Specialty: "bg-purple-50 text-purple-700", wash: "bg-blue-50 text-primary", premium: "bg-cyan-50 text-secondary" };
  const categories = Object.entries(categoryMap).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    icon: categoryIcons[name] ?? "category",
    count: `${count} service${count !== 1 ? "s" : ""}`,
    color: categoryColors[name] ?? "bg-blue-50 text-primary",
  }));

  async function handleAddService() {
    const name = prompt("Service name:");
    const category = prompt("Category (e.g. wash, premium):");
    const pricePerKg = prompt("Price per kg:");
    if (!name) return;
    try {
      await api.post("/admin/services", { name, category, pricePerKg: Number(pricePerKg) });
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleToggle(serviceId) {
    try {
      await api.patch(`/admin/services/${serviceId}/toggle`);
      setServices((prev) =>
        prev.map((s) => s.id === serviceId ? { ...s, status: s.status === "Active" ? "Paused" : "Active" } : s)
      );
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Rate Card & Services</h1>
          <p className="text-on-surface-variant text-sm mt-1">Manage service categories and detailed pricing.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg border border-outline-variant bg-white/60 text-on-surface text-sm font-medium hover:bg-white/80 transition-colors">Export</button>
          <button onClick={handleAddService} className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-base">add</span> New Service
          </button>
        </div>
      </div>

      {/* Category Cards */}
      {categories.length > 0 && (
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
      )}

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
                {["Service", "Category", "Price", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-on-surface-variant">Loading services…</td></tr>
              ) : services.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-on-surface-variant">No services found</td></tr>
              ) : (
                services.map((s) => (
                  <tr key={s.id ?? s.name} className="border-t border-outline-variant/20 hover:bg-white/30 transition-colors cursor-pointer">
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
                    <td className="px-5 py-3.5">
                      <button onClick={() => handleToggle(s.id)} className="text-xs text-secondary hover:underline font-semibold">
                        {s.status === "Active" ? "Pause" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
