import { useState, useEffect } from "react";
import api from "../../lib/api.js";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState([
    { label: "Total Tickets", value: "—", icon: "confirmation_number", iconBg: "bg-blue-50", iconColor: "text-primary" },
    { label: "Open", value: "—", icon: "pending", iconBg: "bg-orange-50", iconColor: "text-orange-600" },
    { label: "Resolved", value: "—", icon: "task_alt", iconBg: "bg-emerald-50", iconColor: "text-secondary" },
    { label: "Avg Response", value: "—", icon: "schedule", iconBg: "bg-cyan-50", iconColor: "text-cyan-600" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ticketsRes, statsRes] = await Promise.allSettled([
          api.get("/admin/tickets"),
          api.get("/admin/tickets/stats"),
        ]);

        if (ticketsRes.status === "fulfilled") {
          const data = ticketsRes.value;
          const list = data.tickets ?? data.data ?? data ?? [];
          setTickets(
            list.map((t, i) => ({
              id: t._id ?? t.id ?? `#TK-${String(4000 + i).padStart(4, "0")}`,
              subject: t.subject ?? t.title ?? "No Subject",
              customer: t.userId?.name ?? t.customerName ?? "—",
              priority: t.priority ?? "Medium",
              status: t.status ?? "Open",
              date: t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—",
              priorityColor: (t.priority ?? "Medium") === "High" || (t.priority ?? "Medium") === "Urgent" ? "bg-red-100 text-red-700" : (t.priority ?? "Medium") === "Medium" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600",
              statusColor: (t.status ?? "Open") === "Open" ? "bg-orange-100 text-orange-700" : (t.status ?? "Open") === "Resolved" || (t.status ?? "Open") === "Closed" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700",
            }))
          );
        }

        if (statsRes.status === "fulfilled") {
          const s = statsRes.value;
          setStats([
            { label: "Total Tickets", value: String(s.total ?? 0), icon: "confirmation_number", iconBg: "bg-blue-50", iconColor: "text-primary" },
            { label: "Open", value: String(s.open ?? 0), icon: "pending", iconBg: "bg-orange-50", iconColor: "text-orange-600" },
            { label: "Resolved", value: String(s.resolved ?? s.closed ?? 0), icon: "task_alt", iconBg: "bg-emerald-50", iconColor: "text-secondary" },
            { label: "Avg Response", value: s.avgResponse ?? "—", icon: "schedule", iconBg: "bg-cyan-50", iconColor: "text-cyan-600" },
          ]);
        }
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Support Tickets</h1>
          <p className="text-on-surface-variant text-sm mt-1">Track and manage customer support requests.</p>
        </div>
        <button className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2 w-fit">
          <span className="material-symbols-outlined text-base">add</span> Create Ticket
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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

      {/* Ticket Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
          <h3 className="font-semibold text-on-surface">All Tickets</h3>
          <div className="flex gap-2">
            {["All", "Open", "In Progress", "Resolved"].map((f, i) => (
              <span key={f} className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors ${i === 0 ? 'bg-secondary text-white' : 'bg-white/40 border border-outline-variant/50 hover:bg-white/60'}`}>{f}</span>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-on-surface-variant bg-white/20">
              <tr>
                {["Ticket ID", "Subject", "Customer", "Priority", "Status", "Date"].map((h) => (
                  <th key={h} className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-on-surface-variant">Loading tickets…</td></tr>
              ) : tickets.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-on-surface-variant">No tickets found</td></tr>
              ) : (
                tickets.map((t) => (
                  <tr key={t.id} className="border-t border-outline-variant/20 hover:bg-white/30 transition-colors cursor-pointer">
                    <td className="px-5 py-3.5 font-mono text-xs text-on-surface-variant">{t.id}</td>
                    <td className="px-5 py-3.5 font-semibold text-on-surface">{t.subject}</td>
                    <td className="px-5 py-3.5 text-on-surface-variant">{t.customer}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${t.priorityColor}`}>{t.priority}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${t.statusColor}`}>{t.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-on-surface-variant">{t.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-outline-variant/30 bg-white/30 flex items-center justify-between text-xs text-on-surface-variant">
          <span>Showing 1 to {tickets.length} of {tickets.length} tickets</span>
        </div>
      </div>
    </div>
  );
}
