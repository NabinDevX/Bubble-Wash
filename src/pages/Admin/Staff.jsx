export default function Staff() {
  const employees = [
    { id: "#LL-1042", name: "Sarah Miller", role: "Senior Operations Lead", branch: "Downtown Hub", joined: "Oct 12, 2021", salary: "$84,500", status: "Active", selected: true, initials: "SM" },
    { id: "#LL-1045", name: "James Anderson", role: "Logistics Coordinator", branch: "North Side Facility", joined: "Jan 05, 2022", salary: "$62,000", status: "Active", initials: "JA" },
    { id: "#LL-1049", name: "Marcus Chen", role: "Head of Quality Control", branch: "Downtown Hub", joined: "Mar 18, 2022", salary: "$75,200", status: "Active", initials: "MC" },
    { id: "#LL-1052", name: "Elena Rodriguez", role: "Branch Manager", branch: "West Park Outlet", joined: "Jun 22, 2022", salary: "$92,000", status: "On Leave", initials: "ER" },
    { id: "#LL-1056", name: "David Kim", role: "Fleet Supervisor", branch: "East Side Logistics", joined: "Sep 10, 2022", salary: "$58,000", status: "Active", initials: "DK" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Staff Management</h1>
          <p className="text-on-surface-variant text-sm mt-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">groups</span>
            Managing 124 employees across 4 branches
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-outline-variant bg-white/60 text-on-surface font-medium rounded-lg hover:bg-white/80 transition-colors flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-lg">filter_list</span> Filters
          </button>
          <button className="px-5 py-2 bg-linear-to-r from-secondary-fixed-dim to-secondary text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm">
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
                {employees.map((e) => (
                  <tr key={e.id} className={`border-t border-outline-variant/20 hover:bg-white/30 transition-colors cursor-pointer ${e.selected ? 'bg-white/20 border-l-2 border-l-secondary' : 'border-l-2 border-l-transparent'}`}>
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
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-outline-variant/30 bg-white/30 flex items-center justify-between text-xs">
              <p className="text-on-surface-variant">Showing 1-10 of 124 employees</p>
              <div className="flex gap-1">
                <button className="p-1.5 border border-outline-variant/50 rounded-lg"><span className="material-symbols-outlined text-base">chevron_left</span></button>
                <button className="px-3 py-1 bg-secondary text-white rounded-lg text-xs font-bold">1</button>
                <button className="px-3 py-1 border border-outline-variant/50 rounded-lg text-xs font-bold">2</button>
                <button className="px-3 py-1 border border-outline-variant/50 rounded-lg text-xs font-bold">3</button>
                <button className="p-1.5 border border-outline-variant/50 rounded-lg"><span className="material-symbols-outlined text-base">chevron_right</span></button>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Card */}
        <div className="col-span-12 xl:col-span-4">
          <div className="glass-card rounded-xl overflow-hidden sticky top-8 shadow-lg">
            <div className="relative h-28 bg-linear-to-r from-secondary to-primary">
              <div className="absolute -bottom-10 left-6">
                <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-white/80 flex items-center justify-center text-2xl font-bold text-secondary">SM</div>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full text-white transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
                <button className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full text-white transition-colors"><span className="material-symbols-outlined text-lg">more_vert</span></button>
              </div>
            </div>
            <div className="pt-14 px-6 pb-6 space-y-5">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Sarah Miller</h3>
                <p className="text-secondary font-medium text-sm">Senior Operations Lead</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="material-symbols-outlined text-sm text-secondary">location_on</span>
                  <p className="text-xs text-on-surface-variant">Downtown Hub • Building 4, Floor 2</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/30 rounded-lg border border-outline-variant/30">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Employee ID</p>
                  <p className="font-bold text-on-surface">#LL-1042</p>
                </div>
                <div className="p-3 bg-white/30 rounded-lg border border-outline-variant/30">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Work Shift</p>
                  <p className="font-bold text-on-surface">Day (8AM-5PM)</p>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant/30 pb-2">Performance Metrics</h4>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-on-surface-variant">Efficiency Score</span><span className="font-bold text-secondary">94%</span></div>
                  <div className="h-1.5 w-full bg-white/30 rounded-full overflow-hidden"><div className="h-full bg-secondary rounded-full" style={{ width: '94%' }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-on-surface-variant">Service Resolution</span><span className="font-bold text-primary">88%</span></div>
                  <div className="h-1.5 w-full bg-white/30 rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: '88%' }} /></div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant/30 pb-2">Contact Info</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center"><span className="material-symbols-outlined text-secondary text-lg">mail</span></div><p className="text-sm text-on-surface-variant">s.miller@linenlogic.com</p></div>
                  <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center"><span className="material-symbols-outlined text-secondary text-lg">phone</span></div><p className="text-sm text-on-surface-variant">+1 (555) 012-3456</p></div>
                </div>
              </div>
              <button className="w-full py-2.5 bg-linear-to-r from-secondary-fixed-dim to-secondary text-white font-semibold rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">assignment</span> View Full History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
