import { useState, useEffect } from "react";
import api from "../../lib/api.js";

export default function Riders() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    {
      label: "Total Riders",
      value: "—",
      icon: "groups",
      iconBg: "bg-blue-50",
      iconColor: "text-primary",
      badge: "",
      watermark: "motorcycle",
    },
    {
      label: "Active Now",
      value: "—",
      icon: "electric_moped",
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-600",
      badge: "",
      watermark: "electric_bike",
    },
    {
      label: "On-Time Rate",
      value: "—",
      icon: "task_alt",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      badge: "",
      watermark: "local_shipping",
    },
    {
      label: "Rider Rating",
      value: "—",
      icon: "star",
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-600",
      badge: "",
      watermark: "star",
    },
  ]);

  useEffect(() => {
    async function fetchRiders() {
      try {
        const data = await api.get("/admin/riders");
        const list = data.riders ?? data.data ?? data ?? [];
        const mapped = list.map((r, i) => ({
          id: r._id ?? r.id ?? `#RD-${String(9000 + i).padStart(4, "0")}`,
          name: r.name ?? "Unknown",
          area: r.area ?? r.zone ?? "—",
          phone: r.phone ?? "—",
          joined: r.createdAt
            ? new Date(r.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "—",
          lastService: r.lastActive ?? "—",
          pick: r.pickups ?? 0,
          del: r.deliveries ?? 0,
          statusColor: r.isActive !== false ? "bg-green-500" : "bg-slate-400",
          initials: (r.name ?? "U")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
        }));
        setRiders(mapped);

        const active = list.filter((r) => r.isActive !== false).length;
        setStats([
          {
            label: "Total Riders",
            value: String(list.length).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            icon: "groups",
            iconBg: "bg-blue-50",
            iconColor: "text-primary",
            badge: `${list.length} total`,
            watermark: "motorcycle",
          },
          {
            label: "Active Now",
            value: String(active),
            icon: "electric_moped",
            iconBg: "bg-cyan-50",
            iconColor: "text-cyan-600",
            badge: `${Math.round((active / (list.length || 1)) * 100)}% active`,
            watermark: "electric_bike",
          },
          {
            label: "On-Time Rate",
            value: "—",
            icon: "task_alt",
            iconBg: "bg-orange-50",
            iconColor: "text-orange-600",
            badge: "—",
            watermark: "local_shipping",
          },
          {
            label: "Rider Rating",
            value: "—",
            icon: "star",
            iconBg: "bg-yellow-50",
            iconColor: "text-yellow-600",
            badge: "—",
            watermark: "star",
          },
        ]);
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    }
    fetchRiders();
  }, []);

  async function handleAddRider() {
    const name = prompt("Rider name:");
    const phone = prompt("Phone:");
    const password = prompt("Password:");
    if (!name || !phone || !password) return;
    try {
      await api.post("/admin/riders", { name, phone, password });
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Riders Management
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Monitor rider performance and assignments.
          </p>
        </div>
        <button
          onClick={handleAddRider}
          className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2 w-fit"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>{" "}
          Add New Rider
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`glass-card rounded-xl p-5 relative overflow-hidden group hover:shadow-lg transition-shadow ${loading ? "animate-pulse" : ""}`}
          >
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 80 }}
              >
                {s.watermark}
              </span>
            </div>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 ${s.iconBg} rounded-lg`}>
                <span className={`material-symbols-outlined ${s.iconColor}`}>
                  {s.icon}
                </span>
              </div>
              <span className="text-xs font-bold text-secondary bg-secondary-container/30 px-2 py-1 rounded-full">
                {s.badge}
              </span>
            </div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {s.label}
            </h4>
            <p className="text-3xl font-bold text-on-surface mt-1">{s.value}</p>
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
                <span
                  key={f}
                  className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors ${i === 1 ? "bg-secondary text-white" : "bg-white/40 border border-outline-variant/50 hover:bg-white/60"}`}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/20 text-on-surface-variant text-[11px] uppercase tracking-widest font-bold">
              <tr>
                {[
                  "Rider ID",
                  "Name & Status",
                  "Mobile",
                  "Joined Date",
                  "Last Service",
                  "Activity (P/D)",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className={`px-5 py-3 ${h === "Activity (P/D)" ? "text-center" : ""} ${h === "" ? "text-right" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-on-surface-variant"
                  >
                    Loading riders…
                  </td>
                </tr>
              ) : riders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-on-surface-variant"
                  >
                    No riders found
                  </td>
                </tr>
              ) : (
                riders.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-outline-variant/20 hover:bg-white/30 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono text-xs text-on-surface-variant">
                      {r.id}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-white/40 border border-outline-variant/50 flex items-center justify-center font-bold text-xs text-on-surface-variant">
                            {r.initials}
                          </div>
                          <span
                            className={`absolute bottom-0 right-0 w-3 h-3 ${r.statusColor} border-2 border-white rounded-full`}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-on-surface">
                            {r.name}
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            {r.area}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-on-surface-variant">
                      {r.phone}
                    </td>
                    <td className="px-5 py-3.5 text-on-surface-variant">
                      {r.joined}
                    </td>
                    <td className="px-5 py-3.5 text-on-surface-variant">
                      {r.lastService}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-center items-center gap-4">
                        <div className="text-center">
                          <span className="text-[10px] text-on-surface-variant block uppercase">
                            Pick
                          </span>
                          <span className="font-bold text-on-surface">
                            {r.pick}
                          </span>
                        </div>
                        <div className="h-6 w-[1px] bg-outline-variant/50" />
                        <div className="text-center">
                          <span className="text-[10px] text-on-surface-variant block uppercase">
                            Del
                          </span>
                          <span className="font-bold text-on-surface">
                            {r.del}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="p-2 text-on-surface-variant hover:text-secondary hover:bg-white/40 rounded-lg transition-all">
                        <span className="material-symbols-outlined">
                          more_vert
                        </span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-outline-variant/30 bg-white/30 flex items-center justify-between">
          <p className="text-sm text-on-surface-variant">
            Showing{" "}
            <span className="font-semibold text-on-surface">
              1-{riders.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-on-surface">
              {riders.length}
            </span>{" "}
            riders
          </p>
          <div className="flex gap-1">
            <button className="p-2 border border-outline-variant/50 rounded-lg">
              <span className="material-symbols-outlined text-lg">
                chevron_left
              </span>
            </button>
            <button className="px-3 py-1 bg-secondary text-white text-sm font-bold rounded-lg">
              1
            </button>
            <button className="p-2 border border-outline-variant/50 rounded-lg">
              <span className="material-symbols-outlined text-lg">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
