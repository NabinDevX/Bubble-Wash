import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SkeletonCard, SkeletonTableRow } from "../../components/Skeleton.jsx";
import api from "../../lib/api.js";
import notify from "../../lib/notify.js";

function getFirstDefined(...values) {
  for (const value of values) {
    if (value === undefined || value === null) continue;
    if (value instanceof Date) return value;
    if (typeof value === "string" && value.trim() === "") continue;
    if (typeof value === "object") continue;
    return value;
  }
  return "—";
}

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
  if (Number.isNaN(amount)) {
    if (typeof value === "string" || typeof value === "number") {
      return String(getFirstDefined(value, "—"));
    }
    return "—";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function extractUsersArray(data) {
  if (Array.isArray(data?.users)) return data.users;
  if (Array.isArray(data?.data?.users)) return data.data.users;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
}

function extractPaginationMeta(data) {
  const meta =
    data?.pagination ??
    data?.meta ??
    data?.data?.pagination ??
    data?.data?.meta;

  const page = Number(
    getFirstDefined(
      meta?.page,
      meta?.currentPage,
      data?.page,
      data?.data?.page,
    ),
  );
  const limit = Number(
    getFirstDefined(
      meta?.limit,
      meta?.pageSize,
      data?.limit,
      data?.data?.limit,
    ),
  );
  const total = Number(
    getFirstDefined(
      meta?.total,
      meta?.totalCount,
      meta?.totalItems,
      meta?.totalUsers,
      meta?.count,
      data?.total,
      data?.count,
      data?.data?.total,
      data?.data?.count,
    ),
  );
  const totalPages = Number(
    getFirstDefined(
      meta?.totalPages,
      meta?.pages,
      data?.totalPages,
      data?.data?.totalPages,
    ),
  );

  return {
    page: Number.isFinite(page) && page > 0 ? page : null,
    limit: Number.isFinite(limit) && limit > 0 ? limit : null,
    total: Number.isFinite(total) && total >= 0 ? total : null,
    totalPages:
      Number.isFinite(totalPages) && totalPages > 0 ? totalPages : null,
  };
}

function formatAddress(customer) {
  const parts = [
    customer?.street,
    customer?.area,
    customer?.city,
    customer?.state,
    customer?.pincode,
  ]
    .map((part) => (part ? String(part).trim() : ""))
    .filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "—";
}

function normalizeCustomerRecord(user, index = 0) {
  const name = getFirstDefined(
    user?.name,
    user?.fullName,
    user?.customerName,
    "Unknown",
  );
  const id = getFirstDefined(
    user?._id,
    user?.id,
    user?.userId,
    `CUS-${String(index + 1).padStart(3, "0")}`,
  );
  const rawStatus = String(
    getFirstDefined(
      user?.status,
      user?.isActive === false ? "Inactive" : "Active",
    ),
  ).toLowerCase();

  return {
    id,
    name,
    initials: String(name || "U")
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    phone: getFirstDefined(user?.phone, user?.mobile, "—"),
    email: getFirstDefined(user?.email, "—"),
    orders: String(
      getFirstDefined(user?.totalOrders, user?.ordersCount, user?.orders, 0),
    ),
    joined: formatDate(
      getFirstDefined(user?.createdAt, user?.joinedAt, user?.registeredAt),
    ),
    status:
      rawStatus === "inactive" || rawStatus === "disabled"
        ? "Inactive"
        : "Active",
    role: getFirstDefined(user?.role, user?.type, "Customer"),
    walletBalance: formatCurrency(
      getFirstDefined(user?.walletBalance, user?.wallet, user?.balance),
    ),
    totalSpent: formatCurrency(
      getFirstDefined(user?.totalSpent, user?.spent, user?.lifetimeSpend),
    ),
    lastOrder: formatDate(
      getFirstDefined(
        user?.lastOrderAt,
        user?.lastOrderDate,
        user?.recentOrderAt,
      ),
    ),
    address: formatAddress(user),
    street: getFirstDefined(user?.street, "—"),
    area: getFirstDefined(user?.area, "—"),
    city: getFirstDefined(user?.city, "—"),
    state: getFirstDefined(user?.state, "—"),
    pincode: getFirstDefined(user?.pincode, "—"),
  };
}

function DetailTile({ label, value }) {
  return (
    <div className="p-3 bg-white/40 rounded-lg border border-outline-variant/30">
      <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">
        {label}
      </p>
      <p className="font-bold text-on-surface break-words">{value}</p>
    </div>
  );
}

export default function Customers() {
  const navigate = useNavigate();
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
  const [pageSize, setPageSize] = useState(10);
  const [maxPageButtons, setMaxPageButtons] = useState(5);
  const [page, setPage] = useState(1);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCustomerLoading, setSelectedCustomerLoading] = useState(false);
  const [selectedCustomerError, setSelectedCustomerError] = useState("");

  const showDetailsPanel = Boolean(selectedCustomerId);

  useEffect(() => {
    function updatePaginationForViewport() {
      const w = window.innerWidth;
      if (w < 640) {
        setPageSize(5);
        setMaxPageButtons(3);
      } else if (w < 1024) {
        setPageSize(7);
        setMaxPageButtons(5);
      } else {
        setPageSize(10);
        setMaxPageButtons(7);
      }
      setPage(1);
    }

    updatePaginationForViewport();
    window.addEventListener("resize", updatePaginationForViewport);
    return () =>
      window.removeEventListener("resize", updatePaginationForViewport);
  }, []);

  useEffect(() => {
    async function fetchStats() {
      try {
        const s = await api.get("/admin/users/stats");
        setStats([
          {
            label: "Total Customers",
            value: String(s.total ?? s.totalCustomers ?? "—").replace(
              /\B(?=(\d{3})+(?!\d))/g,
              ",",
            ),
            icon: "group",
            iconBg: "bg-blue-50",
            iconColor: "text-primary",
          },
          {
            label: "Active",
            value: String(s.active ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
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
      } catch {
        // keep default cards
      }
    }

    fetchStats();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const data = await api.get(
          `/admin/users?page=${page}&limit=${pageSize}`,
        );
        const list = extractUsersArray(data);
        const normalizedCustomers = list.map((user, index) =>
          normalizeCustomerRecord(user, index),
        );
        const meta = extractPaginationMeta(data);
        const computedTotalCount = Number.isFinite(meta.total)
          ? meta.total
          : normalizedCustomers.length;
        setCustomers(normalizedCustomers);
        setTotalCount(computedTotalCount);
      } catch {
        setCustomers([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [page, pageSize]);

  useEffect(() => {
    if (!selectedCustomerId) return;

    let active = true;

    async function fetchSelectedCustomer() {
      const summary = customers.find(
        (customer) => customer.id === selectedCustomerId,
      );
      if (summary) setSelectedCustomer(summary);

      setSelectedCustomerLoading(true);
      setSelectedCustomerError("");

      try {
        const response = await api.get(`/admin/users/${selectedCustomerId}`);
        const user = response.user ?? response.data ?? response;
        const normalized = normalizeCustomerRecord(user, 0);

        if (!active) return;

        setSelectedCustomer({ ...(summary ?? normalized), ...normalized });
      } catch (error) {
        if (!active) return;

        setSelectedCustomerError(
          error?.message || "Unable to load customer details",
        );
        if (!summary) setSelectedCustomer(null);
      } finally {
        if (active) setSelectedCustomerLoading(false);
      }
    }

    fetchSelectedCustomer();
    return () => {
      active = false;
    };
  }, [customers, selectedCustomerId]);

  const totalItems = Math.max(totalCount || 0, 0);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  function clampPage(next) {
    return Math.min(Math.max(1, next), totalPages);
  }

  const safePage = clampPage(page);
  const startIndex = (safePage - 1) * pageSize;
  const visibleCustomers = customers;

  function getPageWindow() {
    const max = Math.max(1, maxPageButtons);
    if (totalPages <= max)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    const half = Math.floor(max / 2);
    let start = safePage - half;
    let end = safePage + half;
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

  const pageNumbers = getPageWindow();
  const canPrev = safePage > 1;
  const canNext = safePage < totalPages;

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
      notify.error("Export failed");
    }
  }

  function handleSelectCustomer(customerId) {
    setSelectedCustomerId(customerId);
  }

  function handleRowKeyDown(event, customerId) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelectCustomer(customerId);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Customer Management
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Manage your customer base and view full account details.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-lg border border-outline-variant bg-white/60 text-on-surface text-sm font-medium hover:bg-white/80 transition-colors flex items-center gap-2"
            type="button"
          >
            <span className="material-symbols-outlined text-base">
              download
            </span>
            Export
          </button>
          <button
            className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            type="button"
            onClick={() => navigate("/admin/customers/new")}
          >
            <span className="material-symbols-outlined text-base">
              person_add
            </span>
            New Customer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          stats.map((item) => (
            <div
              key={item.label}
              className="glass-card rounded-xl p-5 hover:shadow-lg transition-shadow group"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-2.5 ${item.iconBg} rounded-lg group-hover:scale-110 transition-transform`}
                >
                  <span
                    className={`material-symbols-outlined ${item.iconColor}`}
                  >
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
          ))
        )}
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        <div
          className={
            showDetailsPanel ? "col-span-12 xl:col-span-8" : "col-span-12"
          }
        >
          <div className="glass-card rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
              <h3 className="font-semibold text-on-surface">
                Customer Directory
              </h3>
              <button
                className="p-2 text-on-surface-variant hover:bg-white/40 rounded-lg transition-colors border border-outline-variant/50"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">
                  filter_list
                </span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[760px]">
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
                    <>
                      <SkeletonTableRow columns={6} />
                      <SkeletonTableRow columns={6} />
                      <SkeletonTableRow columns={6} />
                      <SkeletonTableRow columns={6} />
                      <SkeletonTableRow columns={6} />
                    </>
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
                    visibleCustomers.map((customer) => (
                      <tr
                        key={customer.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelectCustomer(customer.id)}
                        onKeyDown={(event) =>
                          handleRowKeyDown(event, customer.id)
                        }
                        className={`border-t border-outline-variant/20 hover:bg-white/30 transition-colors cursor-pointer ${selectedCustomerId === customer.id ? "bg-white/20 border-l-2 border-l-secondary" : "border-l-2 border-l-transparent"}`}
                      >
                        <td className="px-5 py-3.5 text-on-surface-variant font-mono text-xs">
                          {customer.id}
                        </td>
                        <td className="px-5 py-3.5 text-on-surface font-semibold">
                          {customer.name}
                        </td>
                        <td className="px-5 py-3.5 text-on-surface-variant">
                          {customer.phone}
                        </td>
                        <td className="px-5 py-3.5 text-on-surface font-semibold">
                          {customer.orders}
                        </td>
                        <td className="px-5 py-3.5 text-on-surface-variant">
                          {customer.joined}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${customer.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                          >
                            {customer.status}
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
                Showing {totalItems === 0 ? 0 : startIndex + 1} to{" "}
                {totalItems === 0
                  ? 0
                  : Math.min(startIndex + customers.length, totalItems)}{" "}
                of {totalItems} entries
              </span>
              <div className="flex gap-1 items-center">
                <button
                  className="p-1.5 border border-outline-variant/50 rounded bg-white/40 hover:bg-white/60 disabled:opacity-50"
                  disabled={!canPrev}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                      p === safePage
                        ? "px-2.5 py-1 rounded text-white bg-secondary text-xs font-bold"
                        : "px-2.5 py-1 rounded border border-outline-variant/50 bg-white/40 hover:bg-white/60 text-xs font-bold"
                    }
                  >
                    {p}
                  </button>
                ))}

                <button
                  className="p-1.5 border border-outline-variant/50 rounded bg-white/40 hover:bg-white/60 disabled:opacity-50"
                  disabled={!canNext}
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
        </div>

        {showDetailsPanel ? (
          <div className="col-span-12 xl:col-span-4">
            <div className="glass-card rounded-xl overflow-hidden sticky top-8 shadow-lg">
              {selectedCustomer ? (
                <>
                  <div className="relative h-28 bg-linear-to-r from-secondary to-primary">
                    <div className="absolute -bottom-10 left-6">
                      <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-white/90 flex items-center justify-center text-2xl font-bold text-secondary">
                        {selectedCustomer.initials}
                      </div>
                    </div>
                  </div>

                  <div className="pt-14 px-6 pb-6 space-y-5">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-headline-md text-headline-md text-on-surface">
                            {selectedCustomer.name}
                          </h3>
                          <p className="text-secondary font-medium text-sm">
                            {selectedCustomer.role}
                          </p>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${selectedCustomer.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                        >
                          {selectedCustomer.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm text-secondary">
                          location_on
                        </span>
                        <p className="text-xs break-words">
                          {selectedCustomer.address}
                        </p>
                      </div>

                      {selectedCustomerLoading && (
                        <p className="text-xs text-secondary mt-2">
                          Refreshing customer details...
                        </p>
                      )}
                      {selectedCustomerError && (
                        <p className="text-xs text-error mt-2">
                          {selectedCustomerError}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <DetailTile
                        label="Customer ID"
                        value={selectedCustomer.id}
                      />
                      <DetailTile
                        label="Orders"
                        value={selectedCustomer.orders}
                      />
                      <DetailTile
                        label="Wallet Balance"
                        value={selectedCustomer.walletBalance}
                      />
                      <DetailTile
                        label="Total Spent"
                        value={selectedCustomer.totalSpent}
                      />
                      <DetailTile
                        label="Joined"
                        value={selectedCustomer.joined}
                      />
                      <DetailTile
                        label="Last Order"
                        value={selectedCustomer.lastOrder}
                      />
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
                            {selectedCustomer.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-secondary text-lg">
                              phone
                            </span>
                          </div>
                          <p className="text-sm text-on-surface-variant">
                            {selectedCustomer.phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant/30 pb-2">
                        Address Breakdown
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <DetailTile
                          label="Street"
                          value={selectedCustomer.street}
                        />
                        <DetailTile
                          label="Area"
                          value={selectedCustomer.area}
                        />
                        <DetailTile
                          label="City"
                          value={selectedCustomer.city}
                        />
                        <DetailTile
                          label="State"
                          value={selectedCustomer.state}
                        />
                        <DetailTile
                          label="Pincode"
                          value={selectedCustomer.pincode}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-6 space-y-3">
                  <h3 className="font-headline-md text-headline-md text-on-surface">
                    Customer Details
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    Loading customer details...
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
