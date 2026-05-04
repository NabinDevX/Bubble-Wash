import { useState, useEffect } from "react";
import { SkeletonCard, SkeletonTableRow } from "../../components/Skeleton.jsx";
import api from "../../lib/api.js";

export default function Workshops() {
  const [workshops, setWorkshops] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalWorkshops: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function fetchWorkshops() {
      try {
        const data = await api.get(
          `/admin/workshops?page=${page}&limit=${pageSize}`,
        );
        const list =
          data.data?.workshops ?? data.workshops ?? data.data ?? data ?? [];
        const pag = data.data?.pagination ?? data.pagination ?? {};
        const mapped = list.map((w, i) => ({
          id: w._id ?? w.id ?? `WS-${String(i + 1).padStart(3, "0")}`,
          name: w.name ?? "Unknown",
          mobile: w.phone ?? w.mobile ?? "—",
          joined: w.createdAt
            ? new Date(w.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "—",
          status: w.isActive !== false ? "Active" : "Inactive",
          orders: String(w.totalOrders ?? w.ordersCount ?? 0),
          address: w.address ?? "—",
          email: w.email ?? "—",
          capacity: w.capacity ?? "—",
          services: w.services ?? [],
        }));
        setWorkshops(mapped);
        if (mapped.length > 0) setSelected(mapped[0]);
        setPagination({
          currentPage: Number(pag.currentPage ?? pag.page ?? page),
          totalPages: Number(
            pag.totalPages ??
              Math.max(
                1,
                Math.ceil((pag.totalWorkshops ?? mapped.length) / pageSize),
              ),
          ),
          totalWorkshops: Number(
            pag.totalWorkshops ?? pag.total ?? mapped.length,
          ),
          hasNext: Boolean(pag.hasNext ?? false),
          hasPrev: Boolean(pag.hasPrev ?? false),
        });
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    }
    fetchWorkshops();
  }, [page, pageSize]);

  const activeCount = workshops.filter((w) => w.status === "Active").length;
  const inactiveCount = workshops.length - activeCount;

  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCapacity, setNewCapacity] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const stats = [
    {
      label: "Total Workshops",
      value: String(workshops.length),
      icon: "storefront",
      iconBg: "bg-blue-50",
      iconColor: "text-primary",
    },
    {
      label: "Active",
      value: String(activeCount),
      icon: "check_circle",
      iconBg: "bg-emerald-50",
      iconColor: "text-secondary",
    },
    {
      label: "Inactive",
      value: String(inactiveCount),
      icon: "cancel",
      iconBg: "bg-red-50",
      iconColor: "text-error",
    },
  ];

  async function handleAddWorkshop() {
    setShowCreate(true);
  }

  async function handleCreateSubmit(e) {
    e.preventDefault();
    if (!newName) return alert("Please provide a name");
    setCreating(true);
    try {
      await api.post("/admin/workshops", {
        name: newName,
        address: newAddress,
        capacity: Number(newCapacity) || undefined,
        phone: newPhone || undefined,
        email: newEmail || undefined,
      });
      // After create, refresh current page
      setShowCreate(false);
      setNewName("");
      setNewAddress("");
      setNewCapacity("");
      setNewPhone("");
      setNewEmail("");
      // refetch: set loading and call fetch by toggling page (or call API directly)
      setLoading(true);
      const data = await api.get(
        `/admin/workshops?page=${page}&limit=${pageSize}`,
      );
      const list =
        data.data?.workshops ?? data.workshops ?? data.data ?? data ?? [];
      const mapped = list.map((w, i) => ({
        id: w._id ?? w.id ?? `WS-${String(i + 1).padStart(3, "0")}`,
        name: w.name ?? "Unknown",
        mobile: w.phone ?? w.mobile ?? "—",
        joined: w.createdAt
          ? new Date(w.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "—",
        status: w.isActive !== false ? "Active" : "Inactive",
        orders: String(w.totalOrders ?? w.ordersCount ?? 0),
        address: w.address ?? "—",
        email: w.email ?? "—",
        capacity: w.capacity ?? "—",
        services: w.services ?? [],
      }));
      setWorkshops(mapped);
      const pag = data.data?.pagination ?? data.pagination ?? {};
      setPagination({
        currentPage: Number(pag.currentPage ?? pag.page ?? page),
        totalPages: Number(
          pag.totalPages ??
            Math.max(
              1,
              Math.ceil((pag.totalWorkshops ?? mapped.length) / pageSize),
            ),
        ),
        totalWorkshops: Number(
          pag.totalWorkshops ?? pag.total ?? mapped.length,
        ),
        hasNext: Boolean(pag.hasNext ?? false),
        hasPrev: Boolean(pag.hasPrev ?? false),
      });
    } catch (err) {
      alert(err?.message || "Create failed");
    } finally {
      setCreating(false);
      setLoading(false);
    }
  }

  async function handleSelectRow(w) {
    setSelected(w);
    try {
      const detail = await api.get(`/admin/workshops/${w.id}`);
      const d = detail.workshop ?? detail;
      setSelected((prev) => ({
        ...prev,
        email: d.email ?? prev.email,
        address: d.address ?? prev.address,
        services: d.services ?? prev.services,
      }));
    } catch {
      // keep existing
    }
  }

  const totalItems = Math.max(pagination.totalWorkshops || 0, 0);
  const totalPages = Math.max(1, Number(pagination.totalPages || 1));

  function clampPage(next) {
    return Math.min(Math.max(1, next), totalPages);
  }

  function getPageWindow(maxButtons = 7) {
    const max = Math.max(1, maxButtons);
    if (totalPages <= max)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const half = Math.floor(max / 2);
    let start = page - half;
    let end = page + half;
    if (max % 2 === 0) end -= 1;
    if (start < 1) {
      start = 1;
      end = max;
    }
    if (end > totalPages) {
      end = totalPages;
      start = totalPages - max + 1;
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  const pageNumbers = getPageWindow(7);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-headline-md text-headline-md text-on-surface">
          Workshop Management
        </h1>
        <button
          onClick={handleAddWorkshop}
          className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
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
            <div
              key={s.label}
              className="glass-card rounded-xl p-5 flex items-center justify-between hover:shadow-lg transition-shadow"
            >
              <div>
                <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                  {s.label}
                </p>
                <p
                  className={`text-2xl font-bold mt-1 ${s.label === "Active" ? "text-secondary" : s.label === "Inactive" ? "text-error" : "text-on-surface"}`}
                >
                  {s.value}
                </p>
              </div>
              <div
                className={`h-12 w-12 rounded-lg ${s.iconBg} flex items-center justify-center`}
              >
                <span className={`material-symbols-outlined ${s.iconColor}`}>
                  {s.icon}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Table */}
        <div className="flex-1 glass-card rounded-xl overflow-hidden w-full lg:w-2/3">
          <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
            <h3 className="font-semibold text-on-surface text-sm">
              Workshop Directory
            </h3>
            <button className="p-1.5 text-on-surface-variant hover:bg-white/40 rounded-md transition-colors border border-outline-variant/50">
              <span className="material-symbols-outlined text-lg">
                filter_list
              </span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-on-surface-variant bg-white/20 text-xs uppercase tracking-wider">
                <tr>
                  {[
                    "ID",
                    "Name",
                    "Mobile",
                    "Joined Date",
                    "Status",
                    "Orders",
                  ].map((h) => (
                    <th key={h} className="px-4 py-3 font-semibold">
                      {h}
                    </th>
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
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-on-surface-variant"
                    >
                      No workshops found
                    </td>
                  </tr>
                ) : (
                  workshops.map((w) => (
                    <tr
                      key={w.id}
                      onClick={() => handleSelectRow(w)}
                      className={`border-t border-outline-variant/20 hover:bg-white/30 transition-colors cursor-pointer ${selected?.id === w.id ? "bg-white/20 border-l-2 border-l-secondary" : ""}`}
                    >
                      <td className="px-4 py-3 text-on-surface-variant">
                        {w.id}
                      </td>
                      <td
                        className={`px-4 py-3 font-medium ${selected?.id === w.id ? "text-secondary" : "text-on-surface"}`}
                      >
                        {w.name}
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant">
                        {w.mobile}
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant">
                        {w.joined}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${w.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                        >
                          {w.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant">
                        {w.orders}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-outline-variant/30 bg-white/30 flex items-center justify-between text-xs text-on-surface-variant">
            <span>
              Showing {totalItems === 0 ? 0 : (page - 1) * pageSize + 1} to{" "}
              {totalItems === 0
                ? 0
                : Math.min(
                    (page - 1) * pageSize + workshops.length,
                    totalItems,
                  )}{" "}
              of {totalItems} entries
            </span>
            <div className="flex gap-2 items-center">
              <button
                className="p-1.5 border border-outline-variant/50 rounded bg-white/40 hover:bg-white/60 disabled:opacity-50"
                disabled={page <= 1}
                onClick={() => setPage((p) => clampPage(p - 1))}
                type="button"
              >
                <span className="material-symbols-outlined text-base">
                  chevron_left
                </span>
              </button>

              {pageNumbers.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(clampPage(p))}
                  className={
                    p === page
                      ? "px-2.5 py-1 rounded text-white bg-secondary text-xs font-bold"
                      : "px-2.5 py-1 rounded border border-outline-variant/50 bg-white/40 hover:bg-white/60 text-xs font-bold"
                  }
                >
                  {p}
                </button>
              ))}

              <button
                className="p-1.5 border border-outline-variant/50 rounded bg-white/40 hover:bg-white/60 disabled:opacity-50"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => clampPage(p + 1))}
                type="button"
              >
                <span className="material-symbols-outlined text-base">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="w-full lg:w-1/3 glass-card rounded-xl overflow-hidden flex flex-col sticky top-20 shadow-lg">
            <div className="p-6 border-b border-outline-variant/30 bg-white/30 relative">
              <span
                className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-medium border ${selected.status === "Active" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-700 border-red-200"}`}
              >
                {selected.status}
              </span>
              <div className="h-16 w-16 bg-white/40 rounded-xl flex items-center justify-center text-secondary mb-4 border border-outline-variant/50 shadow-sm">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 32 }}
                >
                  store
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                {selected.name}
              </h3>
              <p className="text-on-surface-variant text-xs mt-1">
                ID: {selected.id}
              </p>
            </div>
            <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3 border-b border-outline-variant/30 pb-1">
                  Contact Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-outline text-lg">
                      call
                    </span>
                    <span>{selected.mobile}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-outline text-lg">
                      mail
                    </span>
                    <span>{selected.email}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-outline text-lg mt-0.5">
                      location_on
                    </span>
                    <span>{selected.address}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/30 p-3 rounded border border-outline-variant/50">
                  <p className="text-xs text-on-surface-variant mb-1">
                    Total Orders
                  </p>
                  <p className="font-bold text-on-surface">{selected.orders}</p>
                </div>
                <div className="bg-white/30 p-3 rounded border border-outline-variant/50">
                  <p className="text-xs text-on-surface-variant mb-1">
                    Capacity
                  </p>
                  <p className="font-bold text-on-surface">
                    {selected.capacity}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Workshop Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form
            onSubmit={handleCreateSubmit}
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Add Workshop</h3>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="text-on-surface-variant"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-on-surface-variant mb-4">
              Fields marked with * are required. The create workshop endpoint
              expects name, address, and capacity.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-on-surface-variant">
                  Name *
                </label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border px-3 py-2 rounded mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-on-surface-variant">
                  Address *
                </label>
                <textarea
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full border px-3 py-2 rounded mt-1 min-h-24"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-on-surface-variant">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    className="w-full border px-3 py-2 rounded mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-on-surface-variant">
                    Phone
                  </label>
                  <input
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full border px-3 py-2 rounded mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-on-surface-variant">Email</label>
                <input
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full border px-3 py-2 rounded mt-1"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-4 py-2 rounded bg-secondary text-white"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
