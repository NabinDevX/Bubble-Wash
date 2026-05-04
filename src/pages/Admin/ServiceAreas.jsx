import { useState, useEffect } from "react";
import { SkeletonTableRow } from "../../components/Skeleton.jsx";
import api from "../../lib/api.js";

export default function ServiceAreas() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAreas() {
      try {
        const data = await api.get("/admin/areas");
        const list = data.areas ?? data.data ?? data ?? [];
        setAreas(
          list.map((a) => ({
            id: a._id ?? a.id,
            pin: a.pinCode ?? a.pin ?? "—",
            area: a.areaName ?? a.name ?? a.area ?? "—",
            city: a.city ?? "—",
            state: a.state ?? "—",
            active: a.isActive !== false,
          }))
        );
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    }
    fetchAreas();
  }, []);

  const activeCount = areas.filter((a) => a.active).length;
  const inactiveCount = areas.length - activeCount;

  const stats = [
    { label: "Total Areas", value: String(areas.length), icon: "map", iconBg: "bg-blue-50", iconColor: "text-primary" },
    { label: "Active", value: String(activeCount), icon: "check_circle", iconBg: "bg-emerald-50", iconColor: "text-secondary" },
    { label: "Inactive", value: String(inactiveCount), icon: "cancel", iconBg: "bg-red-50", iconColor: "text-error" },
  ];

  async function handleAddArea() {
    const pinCode = prompt("Pin code:");
    const areaName = prompt("Area name:");
    const city = prompt("City:");
    const state = prompt("State:");
    if (!pinCode || !areaName) return;
    try {
      await api.post("/admin/areas", { pinCode, areaName, city, state });
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleToggle(id) {
    try {
      await api.patch(`/admin/areas/${id}/toggle`);
      setAreas((prev) =>
        prev.map((a) => a.id === id ? { ...a, active: !a.active } : a)
      );
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this area?")) return;
    try {
      await api.delete(`/admin/areas/${id}`);
      setAreas((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Service Areas</h1>
          <p className="text-on-surface-variant text-sm mt-1">Manage serviceable pin codes and geographic zones.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg border border-outline-variant bg-white/60 text-on-surface text-sm font-medium hover:bg-white/80 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-base">search</span> Search
          </button>
          <button onClick={handleAddArea} className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-base">add</span> New Pin Code
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`glass-card rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition-shadow ${loading ? "animate-pulse" : ""}`}>
            <div className={`p-2.5 ${s.iconBg} rounded-lg`}>
              <span className={`material-symbols-outlined ${s.iconColor}`}>{s.icon}</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">{s.label}</p>
              <p className="text-2xl font-bold text-on-surface">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Area Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
          <h3 className="font-semibold text-on-surface">Pin Code Directory</h3>
          <button className="p-2 text-on-surface-variant hover:bg-white/40 rounded-lg transition-colors border border-outline-variant/50">
            <span className="material-symbols-outlined text-lg">filter_list</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-on-surface-variant bg-white/20">
              <tr>
                {["Pin Code", "Area Name", "City", "State", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <SkeletonTableRow columns={6} />
                  <SkeletonTableRow columns={6} />
                  <SkeletonTableRow columns={6} />
                </>
              ) : areas.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-on-surface-variant">No areas found</td></tr>
              ) : (
                areas.map((a) => (
                  <tr key={a.id} className="border-t border-outline-variant/20 hover:bg-white/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-semibold text-on-surface">{a.pin}</td>
                    <td className="px-5 py-3.5 text-on-surface">{a.area}</td>
                    <td className="px-5 py-3.5 text-on-surface-variant">{a.city}</td>
                    <td className="px-5 py-3.5 text-on-surface-variant">{a.state}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => handleToggle(a.id)} className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase cursor-pointer transition-colors ${a.active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                        {a.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button className="p-1.5 text-on-surface-variant hover:text-secondary hover:bg-white/40 rounded-lg transition-all">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button onClick={() => handleDelete(a.id)} className="p-1.5 text-on-surface-variant hover:text-error hover:bg-red-50/50 rounded-lg transition-all">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-outline-variant/30 bg-white/30 flex items-center justify-between text-xs text-on-surface-variant">
          <span>Showing 1 to {areas.length} of {areas.length} entries</span>
        </div>
      </div>
    </div>
  );
}
