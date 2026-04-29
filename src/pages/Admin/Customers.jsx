import { useState, useEffect } from "react";
import api from "../../lib/api.js";

export default function Customers() {
  const [stats, setStats] = useState([
    {
      label: "Total Customers",
      value: "—",
      icon: "group",
      iconBg: "bg-blue-50",
      iconColor: "text-primary",
    },
    {
      label: "Active",
      value: "—",
      icon: "check_circle",
      iconBg: "bg-emerald-50",
      iconColor: "text-secondary",
      badge: "",
    },
    {
      label: "Inactive",
      value: "—",
      icon: "cancel",
      iconBg: "bg-red-50",
      iconColor: "text-error",
    },
    {
      label: "Returning",
      value: "—",
      icon: "replay",
      iconBg: "bg-cyan-50",
      iconColor: "text-secondary",
      badge: "",
    },
  ]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        let computedTotalCount = 0;
        const [usersRes, statsRes] = await Promise.allSettled([
          api.get("/admin/users"),
          api.get("/admin/users/stats"),
        ]);

        if (usersRes.status === "fulfilled") {
          const data = usersRes.value;
          const list = data.users ?? data.data ?? data ?? [];
          computedTotalCount = data.total ?? data.count ?? list.length;
          setCustomers(
            list.map((u, i) => ({
              id: u._id ?? u.id ?? `CUS-${String(i + 1).padStart(3, "0")}`,
              name: u.name ?? "Unknown",
              phone: u.phone ?? "—",
              orders: String(u.totalOrders ?? u.ordersCount ?? 0),
              joined: u.createdAt
                ? new Date(u.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "—",
              status: u.isActive === false ? "Inactive" : "Active",
            })),
          );
          setTotalCount(computedTotalCount);
        }

        if (statsRes.status === "fulfilled") {
          const s = statsRes.value;
          setStats([
            {
              label: "Total Customers",
              value: String(
                s.total ?? s.totalCustomers ?? computedTotalCount,
              ).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              icon: "group",
              iconBg: "bg-blue-50",
              iconColor: "text-primary",
            },
            {
              label: "Active",
              value: String(s.active ?? 0).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ",",
              ),
              icon: "check_circle",
              iconBg: "bg-emerald-50",
              iconColor: "text-secondary",
              badge: s.activeGrowth ? `+${s.activeGrowth}%` : "",
            },
            {
              label: "Inactive",
              value: String(s.inactive ?? 0).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ",",
              ),
              icon: "cancel",
              iconBg: "bg-red-50",
              iconColor: "text-error",
            },
            {
              label: "Returning",
              value: String(s.returning ?? 0).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ",",
              ),
              icon: "replay",
              iconBg: "bg-cyan-50",
              iconColor: "text-secondary",
              badge: s.returningGrowth ? `+${s.returningGrowth}%` : "",
            },
          ]);
        }
      } catch {
        // keep empty state
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleExport() {
    try {
      const data = await api.get("/admin/users/export");
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "customers_export.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export failed");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Customer Management
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Manage your customer base and view details.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-lg border border-outline-variant bg-white/60 text-on-surface text-sm font-medium hover:bg-white/80 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">
              download
            </span>
            Export
          </button>
          <button className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-base">
              person_add
            </span>
            New Customer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className={`glass-card rounded-xl p-5 hover:shadow-lg transition-shadow group ${loading ? "animate-pulse" : ""}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-2.5 ${item.iconBg} rounded-lg group-hover:scale-110 transition-transform`}
              >
                <span className={`material-symbols-outlined ${item.iconColor}`}>
                  {item.icon}
                </span>
              </div>
              {item.badge && (
                <span className="text-xs font-bold text-secondary bg-secondary-container/30 px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            <p className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              {item.label}
            </p>
            <p className="text-2xl font-bold text-on-surface mt-1">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Customer Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
          <h3 className="font-semibold text-on-surface">Customer Directory</h3>
          <div className="flex items-center gap-2">
            <button className="p-2 text-on-surface-variant hover:bg-white/40 rounded-lg transition-colors border border-outline-variant/50">
              <span className="material-symbols-outlined text-lg">
                filter_list
              </span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-on-surface-variant bg-white/20">
              <tr>
                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">
                  ID
                </th>
                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-8 text-center text-on-surface-variant"
                  >
                    Loading customers…
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-8 text-center text-on-surface-variant"
                  >
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((c, i) => (
                  <tr
                    key={c.id}
                    className={`border-t border-outline-variant/20 hover:bg-white/30 transition-colors cursor-pointer ${i === 0 ? "bg-white/20 border-l-2 border-l-secondary" : ""}`}
                  >
                    <td className="px-5 py-3.5 text-on-surface-variant font-mono text-xs">
                      {c.id}
                    </td>
                    <td className="px-5 py-3.5 text-on-surface font-semibold">
                      {c.name}
                    </td>
                    <td className="px-5 py-3.5 text-on-surface-variant">
                      {c.phone}
                    </td>
                    <td className="px-5 py-3.5 text-on-surface font-semibold">
                      {c.orders}
                    </td>
                    <td className="px-5 py-3.5 text-on-surface-variant">
                      {c.joined}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${c.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-outline-variant/30 bg-white/30 flex items-center justify-between text-xs text-on-surface-variant">
          <span>
            Showing 1 to {customers.length} of {totalCount || customers.length}{" "}
            entries
          </span>
          <div className="flex gap-1">
            <button
              className="p-1.5 border border-outline-variant/50 rounded bg-white/40 hover:bg-white/60 disabled:opacity-50"
              disabled
            >
              <span className="material-symbols-outlined text-base">
                chevron_left
              </span>
            </button>
            <button className="px-2.5 py-1 rounded text-white bg-secondary text-xs font-bold">
              1
            </button>
            <button className="px-2.5 py-1 rounded border border-outline-variant/50 bg-white/40 hover:bg-white/60 text-xs font-bold">
              2
            </button>
            <button className="p-1.5 border border-outline-variant/50 rounded bg-white/40 hover:bg-white/60">
              <span className="material-symbols-outlined text-base">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
