import { useEffect, useState, useCallback } from "react";
import { SkeletonTableRow } from "../../components/Skeleton.jsx";
import api from "../../lib/api.js";
import notify from "../../lib/notify.js";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(value) {
  const amount = Number(value);
  if (Number.isNaN(amount)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function extractStaffArray(data) {
  if (Array.isArray(data?.staff)) return data.staff;
  if (Array.isArray(data?.data?.staff)) return data.data.staff;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
}

function extractPagination(data) {
  const meta =
    data?.pagination ??
    data?.meta ??
    data?.data?.pagination ??
    data?.data?.meta ??
    {};
  const currentPage = Number(
    meta.currentPage ?? meta.page ?? data?.page ?? data?.data?.page ?? 1,
  );
  const totalPages = Number(
    meta.totalPages ?? data?.totalPages ?? data?.data?.totalPages ?? 1,
  );
  const totalStaff = Number(
    meta.totalStaff ??
      meta.total ??
      meta.count ??
      data?.total ??
      data?.count ??
      data?.data?.total ??
      data?.data?.count ??
      0,
  );

  return {
    currentPage:
      Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1,
    totalPages: Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1,
    totalStaff: Number.isFinite(totalStaff) && totalStaff >= 0 ? totalStaff : 0,
    hasNext: Boolean(meta.hasNext ?? false),
    hasPrev: Boolean(meta.hasPrev ?? false),
  };
}

function normalizeStaffMember(staff, index = 0) {
  const name = staff?.name ?? "Unknown";
  const initials = String(name)
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    id: staff?._id ?? staff?.id ?? `STF-${String(index + 1).padStart(3, "0")}`,
    name,
    initials: initials || "U",
    role: staff?.role ?? "Staff",
    phone: staff?.phone ?? "—",
    email: staff?.email ?? "—",
    source: staff?.source ?? "—",
    joined: formatDate(staff?.createdAt),
    billingValue: formatCurrency(staff?.totalBillingValue),
    dueAmount: formatCurrency(staff?.dueAmount),
    totalOrders: String(staff?.totalOrderCount ?? 0),
    loyaltyPoints: String(staff?.loyaltyPoints ?? 0),
    gstNumber: staff?.gstNumber || "—",
    referralCode: staff?.referralCode || "—",
    profileImage: staff?.profileImage || "",
    status: staff?.isDeleted ? "Inactive" : "Active",
  };
}

function getPageWindow(page, totalPages, maxButtons) {
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

function DetailTile({ label, value }) {
  return (
    <div className="p-3 bg-white/30 rounded-lg border border-outline-variant/30">
      <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">
        {label}
      </p>
      <p className="font-bold text-on-surface break-words">{value}</p>
    </div>
  );
}

export default function Staff() {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "staff",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalStaff: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Top-level fetch function so we can call it after creating a new employee
  // without changing pagination logic elsewhere.
  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`/admin/staff?page=${page}&limit=${pageSize}`);
      const list = extractStaffArray(data);
      const mapped = list.map((staff, index) =>
        normalizeStaffMember(staff, index),
      );
      const meta = extractPagination(data);

      setEmployees(mapped);
      setPagination(meta);
      setSelected((current) => {
        if (!current) return null;
        return mapped.find((staff) => staff.id === current.id) ?? null;
      });
    } catch {
      setEmployees([]);
      setSelected(null);
      setPagination({
        currentPage: page,
        totalPages: 1,
        totalStaff: 0,
        hasNext: false,
        hasPrev: false,
      });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    (async () => {
      await fetchStaff();
    })();
  }, [fetchStaff]);

  const totalItems = pagination.totalStaff ?? employees.length;
  const totalPages = Math.max(1, pagination.totalPages ?? 1);
  const safePage = Math.min(Math.max(1, page), totalPages);
  const canPrev = pagination.hasPrev || safePage > 1;
  const canNext = pagination.hasNext || safePage < totalPages;
  const pageNumbers = getPageWindow(safePage, totalPages, 7);
  const hasSelectedStaff = Boolean(selected);

  async function handleAddStaff() {
    setShowCreate(true);
  }

  function handleCreateChange(e) {
    const { name, value } = e.target;
    setNewStaff((current) => ({ ...current, [name]: value }));
  }

  async function handleCreateSubmit(e) {
    e.preventDefault();

    if (!newStaff.name.trim()) {
      notify.error("Please enter the employee name.");
      return;
    }

    if (!newStaff.phone.trim()) {
      notify.error("Please enter the employee phone number.");
      return;
    }

    if (!newStaff.password.trim() || newStaff.password.trim().length < 6) {
      notify.error("Please enter a password with at least 6 characters.");
      return;
    }

    if (!newStaff.role.trim()) {
      notify.error("Please select the employee role.");
      return;
    }

    setCreating(true);
    try {
      await api.post("/admin/staff", {
        name: newStaff.name.trim(),
        phone: newStaff.phone.trim(),
        email: newStaff.email.trim() || undefined,
        password: newStaff.password,
        role: newStaff.role.trim(),
      });

      notify.success("Employee created successfully.");
      setShowCreate(false);
      setNewStaff({
        name: "",
        phone: "",
        email: "",
        password: "",
        role: "staff",
      });
      setPage(1);
      // Ensure the list refreshes even if `page` was already 1.
      await fetchStaff();
    } catch (err) {
      notify.error(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to create employee.",
      );
    } finally {
      setCreating(false);
    }
  }

  function handleSelectRow(staff) {
    setSelected(staff);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Staff Management
          </h1>
          <p className="text-on-surface-variant text-sm mt-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">groups</span>
            Managing {totalItems} employees
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-outline-variant bg-white/60 text-on-surface font-medium rounded-lg hover:bg-white/80 transition-colors flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-lg">
              filter_list
            </span>
            Filters
          </button>
          <button
            onClick={handleAddStaff}
            className="px-5 py-2 bg-linear-to-r from-secondary-fixed-dim to-secondary text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm"
          >
            <span className="material-symbols-outlined text-lg">
              person_add
            </span>
            New Employee
          </button>
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form
            onSubmit={handleCreateSubmit}
            className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-outline-variant/30 bg-linear-to-r from-secondary-fixed to-white flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-on-surface text-lg">
                  Add New Employee
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Required fields are marked with *.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="h-9 w-9 rounded-full hover:bg-black/5 flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Employee Name *
                  </label>
                  <input
                    name="name"
                    value={newStaff.name}
                    onChange={handleCreateChange}
                    placeholder="e.g. John Smith"
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Phone *
                  </label>
                  <input
                    name="phone"
                    value={newStaff.phone}
                    onChange={handleCreateChange}
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={newStaff.email}
                    onChange={handleCreateChange}
                    placeholder="e.g. admin@bubblewash.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Password *
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={newStaff.password}
                    onChange={handleCreateChange}
                    placeholder="Minimum 6 characters"
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={newStaff.role}
                    onChange={handleCreateChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    required
                  >
                    <option value="staff">Staff</option>
                    <option value="store_manager">Store Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-900">
                The new employee will be created through{" "}
                <span className="font-semibold">POST /admin/staff</span> and the
                list will refresh automatically.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-5 py-2.5 rounded-lg text-on-surface-variant font-medium hover:bg-black/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2.5 rounded-lg text-white font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  {creating ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">
                        progress_activity
                      </span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">
                        person_add
                      </span>
                      Create Employee
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div
          className={
            hasSelectedStaff ? "col-span-12 xl:col-span-8" : "col-span-12"
          }
        >
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/20 border-b border-outline-variant/30">
                <tr>
                  {[
                    "Employee ID",
                    "Name & Role",
                    "Phone",
                    "Joined Date",
                    "Billing Value",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider"
                    >
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
                    <SkeletonTableRow columns={6} />
                    <SkeletonTableRow columns={6} />
                  </>
                ) : employees.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-on-surface-variant"
                    >
                      No staff found
                    </td>
                  </tr>
                ) : (
                  employees.map((staff) => (
                    <tr
                      key={staff.id}
                      onClick={() => handleSelectRow(staff)}
                      className={`border-t border-outline-variant/20 hover:bg-white/30 transition-colors cursor-pointer ${selected?.id === staff.id ? "bg-white/20 border-l-2 border-l-secondary" : "border-l-2 border-l-transparent"}`}
                    >
                      <td className="px-5 py-3.5 font-mono text-xs text-on-surface-variant">
                        {staff.id}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {staff.profileImage ? (
                            <img
                              src={staff.profileImage}
                              alt={staff.name}
                              className="w-9 h-9 rounded-full object-cover border border-outline-variant/50"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-white/40 flex items-center justify-center font-bold text-on-surface-variant text-xs border border-outline-variant/50">
                              {staff.initials}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-on-surface">
                              {staff.name}
                            </p>
                            <p className="text-xs text-on-surface-variant">
                              {staff.role}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-on-surface-variant">
                        {staff.phone}
                      </td>
                      <td className="px-5 py-3.5 text-on-surface-variant">
                        {staff.joined}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-on-surface">
                        {staff.billingValue}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${staff.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                        >
                          {staff.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="px-5 py-3 border-t border-outline-variant/30 bg-white/30 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs">
              <p className="text-on-surface-variant">
                Showing {totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1}{" "}
                to{" "}
                {totalItems === 0
                  ? 0
                  : Math.min(
                      (safePage - 1) * pageSize + employees.length,
                      totalItems,
                    )}{" "}
                of {totalItems} employees
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  disabled={!canPrev}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="p-1.5 border border-outline-variant/50 rounded bg-white/40 hover:bg-white/60 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base">
                    chevron_left
                  </span>
                </button>

                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => setPage(number)}
                    className={
                      number === safePage
                        ? "px-2.5 py-1 rounded text-white bg-secondary text-xs font-bold"
                        : "px-2.5 py-1 rounded border border-outline-variant/50 bg-white/40 hover:bg-white/60 text-xs font-bold"
                    }
                  >
                    {number}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={!canNext}
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  className="p-1.5 border border-outline-variant/50 rounded bg-white/40 hover:bg-white/60 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {hasSelectedStaff && (
          <div className="col-span-12 xl:col-span-4">
            <div className="glass-card rounded-xl overflow-hidden sticky top-8 shadow-lg">
              <div className="relative h-28 bg-linear-to-r from-secondary to-primary">
                <div className="absolute -bottom-10 left-6">
                  <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-white/80 flex items-center justify-center overflow-hidden">
                    {selected.profileImage ? (
                      <img
                        src={selected.profileImage}
                        alt={selected.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-secondary">
                        {selected.initials}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-14 px-6 pb-6 space-y-5">
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">
                    {selected.name}
                  </h3>
                  <p className="text-secondary font-medium text-sm">
                    {selected.role}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="material-symbols-outlined text-sm text-secondary">
                      account_circle
                    </span>
                    <p className="text-xs text-on-surface-variant">
                      {selected.source}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/30 rounded-lg border border-outline-variant/30">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">
                      Employee ID
                    </p>
                    <p className="font-bold text-on-surface break-words">
                      {selected.id}
                    </p>
                  </div>
                  <div className="p-3 bg-white/30 rounded-lg border border-outline-variant/30">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">
                      Referral Code
                    </p>
                    <p className="font-bold text-on-surface break-words">
                      {selected.referralCode}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant/30 pb-2">
                    Contact Info
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                        <span className="material-symbols-outlined text-secondary text-lg">
                          mail
                        </span>
                      </div>
                      <p className="text-sm text-on-surface-variant break-words">
                        {selected.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                        <span className="material-symbols-outlined text-secondary text-lg">
                          phone
                        </span>
                      </div>
                      <p className="text-sm text-on-surface-variant">
                        {selected.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <DetailTile label="Joined" value={selected.joined} />
                  <DetailTile label="Status" value={selected.status} />
                  <DetailTile label="Orders" value={selected.totalOrders} />
                  <DetailTile label="Due Amount" value={selected.dueAmount} />
                  <DetailTile
                    label="Billing Value"
                    value={selected.billingValue}
                  />
                  <DetailTile
                    label="Loyalty Points"
                    value={selected.loyaltyPoints}
                  />
                  <DetailTile label="GST Number" value={selected.gstNumber} />
                  <DetailTile label="Source" value={selected.source} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
