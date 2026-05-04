import { useState, useEffect } from "react";
import { SkeletonTableRow } from "../../components/Skeleton.jsx";
import api from "../../lib/api.js";

export default function Staff() {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStaff() {
      try {
        const data = await api.get("/admin/staff");
        const list = data.staff ?? data.data ?? data ?? [];
        const mapped = list.map((e, i) => ({
          id: e._id ?? e.id ?? `#LL-${String(1000 + i).padStart(4, "0")}`,
          name: e.name ?? "Unknown",
          role: e.role ?? e.designation ?? "Staff",
          branch: e.branch ?? "—",
          joined: e.createdAt ? new Date(e.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—",
          salary: e.salary ? `$${Number(e.salary).toLocaleString()}` : "—",
          status: e.isActive === false || e.status === "On Leave" ? "On Leave" : "Active",
          initials: (e.name ?? "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
          email: e.email ?? "—",
          phone: e.phone ?? "—",
          shift: e.shift ?? "—",
        }));
        setEmployees(mapped);
        if (mapped.length > 0) setSelected(mapped[0]);
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    }
    fetchStaff();
  }, []);

  async function handleAddStaff() {
    const name = prompt("Staff name:");
    const phone = prompt("Phone:");
    const password = prompt("Password:");
    if (!name || !phone || !password) return;
    try {
      await api.post("/admin/staff", { name, phone, password });
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleSelectRow(e) {
    setSelected(e);
    try {
      const detail = await api.get(`/admin/staff/${e.id}`);
      const d = detail.staff ?? detail;
      setSelected((prev) => ({ ...prev, email: d.email ?? prev.email, phone: d.phone ?? prev.phone, shift: d.shift ?? prev.shift }));
    } catch {
      // keep existing
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Staff Management</h1>
          <p className="text-on-surface-variant text-sm mt-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">groups</span>
            Managing {employees.length} employees
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-outline-variant bg-white/60 text-on-surface font-medium rounded-lg hover:bg-white/80 transition-colors flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-lg">filter_list</span> Filters
          </button>
          <button onClick={handleAddStaff} className="px-5 py-2 bg-linear-to-r from-secondary-fixed-dim to-secondary text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-lg">person_add</span> New Employee
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Employee Table */}
        <div className="col-span-12 xl:col-span-8">
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/20 border-b border-outline-variant/30">
                <tr>
                  {["Employee ID", "Name & Role", "Branch", "Joined Date", "Salary", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
                    <SkeletonTableRow columns={6} />
                    <SkeletonTableRow columns={6} />
                    <SkeletonTableRow columns={6} />
                    <SkeletonTableRow columns={6} />
                    <SkeletonTableRow columns={6} />
                  </>
                ) : employees.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-on-surface-variant">No staff found</td></tr>
                ) : (
                  employees.map((e) => (
                    <tr key={e.id} onClick={() => handleSelectRow(e)} className={`border-t border-outline-variant/20 hover:bg-white/30 transition-colors cursor-pointer ${selected?.id === e.id ? 'bg-white/20 border-l-2 border-l-secondary' : 'border-l-2 border-l-transparent'}`}>
                      <td className="px-5 py-3.5 font-mono text-xs text-on-surface-variant">{e.id}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-white/40 flex items-center justify-center font-bold text-on-surface-variant text-xs border border-outline-variant/50">{e.initials}</div>
                          <div>
                            <p className="font-semibold text-on-surface">{e.name}</p>
                            <p className="text-xs text-on-surface-variant">{e.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-on-surface-variant">{e.branch}</td>
                      <td className="px-5 py-3.5 text-on-surface-variant">{e.joined}</td>
                      <td className="px-5 py-3.5 font-semibold">{e.salary}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${e.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{e.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-outline-variant/30 bg-white/30 flex items-center justify-between text-xs">
              <p className="text-on-surface-variant">Showing 1-{employees.length} of {employees.length} employees</p>
            </div>
          </div>
        </div>

        {/* Detail Card */}
        {selected && (
          <div className="col-span-12 xl:col-span-4">
            <div className="glass-card rounded-xl overflow-hidden sticky top-8 shadow-lg">
              <div className="relative h-28 bg-linear-to-r from-secondary to-primary">
                <div className="absolute -bottom-10 left-6">
                  <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-white/80 flex items-center justify-center text-2xl font-bold text-secondary">{selected.initials}</div>
                </div>
              </div>
              <div className="pt-14 px-6 pb-6 space-y-5">
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">{selected.name}</h3>
                  <p className="text-secondary font-medium text-sm">{selected.role}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="material-symbols-outlined text-sm text-secondary">location_on</span>
                    <p className="text-xs text-on-surface-variant">{selected.branch}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/30 rounded-lg border border-outline-variant/30">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Employee ID</p>
                    <p className="font-bold text-on-surface">{selected.id}</p>
                  </div>
                  <div className="p-3 bg-white/30 rounded-lg border border-outline-variant/30">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Work Shift</p>
                    <p className="font-bold text-on-surface">{selected.shift}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant/30 pb-2">Contact Info</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center"><span className="material-symbols-outlined text-secondary text-lg">mail</span></div><p className="text-sm text-on-surface-variant">{selected.email}</p></div>
                    <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center"><span className="material-symbols-outlined text-secondary text-lg">phone</span></div><p className="text-sm text-on-surface-variant">{selected.phone}</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
