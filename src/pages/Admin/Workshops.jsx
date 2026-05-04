import { useState, useEffect } from "react";
import { SkeletonCard, SkeletonTableRow } from "../../components/Skeleton.jsx";
import api from "../../lib/api.js";

export default function Workshops() {
  const [workshops, setWorkshops] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkshops() {
      try {
        const data = await api.get("/admin/workshops");
        const list = data.workshops ?? data.data ?? data ?? [];
        const mapped = list.map((w, i) => ({
          id: w._id ?? w.id ?? `WS-${String(i + 1).padStart(3, "0")}`,
          name: w.name ?? "Unknown",
          mobile: w.phone ?? w.mobile ?? "—",
          joined: w.createdAt ? new Date(w.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—",
          status: w.isActive !== false ? "Active" : "Inactive",
          orders: String(w.totalOrders ?? w.ordersCount ?? 0),
          address: w.address ?? "—",
          email: w.email ?? "—",
          capacity: w.capacity ?? "—",
          services: w.services ?? [],
        }));
        setWorkshops(mapped);
        if (mapped.length > 0) setSelected(mapped[0]);
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    }
    fetchWorkshops();
  }, []);

  const activeCount = workshops.filter((w) => w.status === "Active").length;
  const inactiveCount = workshops.length - activeCount;

  const stats = [
    { label: "Total Workshops", value: String(workshops.length), icon: "storefront", iconBg: "bg-blue-50", iconColor: "text-primary" },
    { label: "Active", value: String(activeCount), icon: "check_circle", iconBg: "bg-emerald-50", iconColor: "text-secondary" },
    { label: "Inactive", value: String(inactiveCount), icon: "cancel", iconBg: "bg-red-50", iconColor: "text-error" },
  ];

  async function handleAddWorkshop() {
    const name = prompt("Workshop name:");
    const address = prompt("Address:");
    const capacity = prompt("Capacity:");
    if (!name) return;
    try {
      await api.post("/admin/workshops", { name, address, capacity: Number(capacity) });
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleSelectRow(w) {
    setSelected(w);
    try {
      const detail = await api.get(`/admin/workshops/${w.id}`);
      const d = detail.workshop ?? detail;
      setSelected((prev) => ({ ...prev, email: d.email ?? prev.email, address: d.address ?? prev.address, services: d.services ?? prev.services }));
    } catch {
      // keep existing
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-headline-md text-headline-md text-on-surface">Workshop Management</h1>
        <button onClick={handleAddWorkshop} className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-base">add</span>
          Add Workshop
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          stats.map((s) => (
            <div key={s.label} className="glass-card rounded-xl p-5 flex items-center justify-between hover:shadow-lg transition-shadow">
              <div>
                <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">{s.label}</p>
                <p className={`text-2xl font-bold mt-1 ${s.label === 'Active' ? 'text-secondary' : s.label === 'Inactive' ? 'text-error' : 'text-on-surface'}`}>{s.value}</p>
              </div>
              <div className={`h-12 w-12 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                <span className={`material-symbols-outlined ${s.iconColor}`}>{s.icon}</span>
              </div>
            </div>
          ))
        )}
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
                {loading ? (
                  <>
                    <SkeletonTableRow columns={6} />
                    <SkeletonTableRow columns={6} />
                    <SkeletonTableRow columns={6} />
                  </>
                ) : workshops.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-on-surface-variant">No workshops found</td></tr>
                ) : (
                  workshops.map((w) => (
                    <tr key={w.id} onClick={() => handleSelectRow(w)} className={`border-t border-outline-variant/20 hover:bg-white/30 transition-colors cursor-pointer ${selected?.id === w.id ? 'bg-white/20 border-l-2 border-l-secondary' : ''}`}>
                      <td className="px-4 py-3 text-on-surface-variant">{w.id}</td>
                      <td className={`px-4 py-3 font-medium ${selected?.id === w.id ? 'text-secondary' : 'text-on-surface'}`}>{w.name}</td>
                      <td className="px-4 py-3 text-on-surface-variant">{w.mobile}</td>
                      <td className="px-4 py-3 text-on-surface-variant">{w.joined}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${w.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{w.status}</span>
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant">{w.orders}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-outline-variant/30 bg-white/30 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Showing 1 to {workshops.length} of {workshops.length} entries</span>
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="w-full lg:w-1/3 glass-card rounded-xl overflow-hidden flex flex-col sticky top-20 shadow-lg">
            <div className="p-6 border-b border-outline-variant/30 bg-white/30 relative">
              <span className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-medium border ${selected.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200'}`}>{selected.status}</span>
              <div className="h-16 w-16 bg-white/40 rounded-xl flex items-center justify-center text-secondary mb-4 border border-outline-variant/50 shadow-sm">
                <span className="material-symbols-outlined" style={{ fontSize: 32 }}>store</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">{selected.name}</h3>
              <p className="text-on-surface-variant text-xs mt-1">ID: {selected.id}</p>
            </div>
            <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3 border-b border-outline-variant/30 pb-1">Contact Information</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3"><span className="material-symbols-outlined text-outline text-lg">call</span><span>{selected.mobile}</span></div>
                  <div className="flex items-center gap-3"><span className="material-symbols-outlined text-outline text-lg">mail</span><span>{selected.email}</span></div>
                  <div className="flex items-start gap-3"><span className="material-symbols-outlined text-outline text-lg mt-0.5">location_on</span><span>{selected.address}</span></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/30 p-3 rounded border border-outline-variant/50">
                  <p className="text-xs text-on-surface-variant mb-1">Total Orders</p>
                  <p className="font-bold text-on-surface">{selected.orders}</p>
                </div>
                <div className="bg-white/30 p-3 rounded border border-outline-variant/50">
                  <p className="text-xs text-on-surface-variant mb-1">Capacity</p>
                  <p className="font-bold text-on-surface">{selected.capacity}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
