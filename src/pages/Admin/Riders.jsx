import { useState, useEffect, useCallback } from "react";
import { SkeletonCard, SkeletonTableRow } from "../../components/Skeleton.jsx";
import api from "../../lib/api.js";
import notify from "../../lib/notify.js";

function extractRiderArray(data) {
  if (Array.isArray(data?.riders)) return data.riders;
  if (Array.isArray(data?.data?.riders)) return data.data.riders;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
}

function normalizeRider(rider, index = 0) {
  const user = rider?.user ?? {};
  const name = rider?.name ?? user?.name ?? rider?.fullName ?? "Unknown Rider";
  const initials = String(name)
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    id: rider?._id ?? rider?.id ?? `RDR-${String(index + 1).padStart(3, "0")}`,
    name,
    initials: initials || "U",
    phone: rider?.phone ?? user?.phone ?? "—",
    email: rider?.email ?? user?.email ?? "—",
    status: rider?.isActive === false ? "Inactive" : "Active",
    joined: rider?.createdAt ?? null,
    detailsLoadedAt: rider?.updatedAt ?? rider?.lastActive ?? null,
    area: rider?.area ?? rider?.zone ?? rider?.city ?? "—",
    tasksCompleted: rider?.deliveries ?? rider?.completedDeliveries ?? 0,
    tasksPicked: rider?.pickups ?? rider?.pickupCount ?? 0,
    bikeNumber: rider?.vehicleNumber ?? rider?.bikeNumber ?? "—",
    address: rider?.address ?? rider?.currentLocation ?? "—",
    raw: rider,
  };
}

function DetailTile({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-white/40 border border-outline-variant/30">
      <p className="text-[10px] font-bold uppercase text-on-surface-variant">
        {label}
      </p>
      <p className="text-sm font-semibold text-on-surface mt-1 break-words">
        {formatDetailValue(value)}
      </p>
    </div>
  );
}

function formatDetailValue(value) {
  if (value == null || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default function Riders() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

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
      label: "Active Riders",
      value: "—",
      icon: "electric_moped",
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-600",
      badge: "",
      watermark: "electric_bike",
    },
    {
      label: "Inactive Riders",
      value: "—",
      icon: "do_not_disturb_on",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
      badge: "",
      watermark: "no_accounts",
    },
    {
      label: "Deliveries",
      value: "—",
      icon: "local_shipping",
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-600",
      badge: "",
      watermark: "delivery_dining",
    },
  ]);

  const fetchRiders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get("/admin/riders");
      const list = extractRiderArray(data);
      const mapped = list.map((rider, index) => normalizeRider(rider, index));

      setRiders(mapped);

      const activeCount = mapped.filter(
        (rider) => rider.status === "Active",
      ).length;
      const inactiveCount = mapped.length - activeCount;
      const deliveries = mapped.reduce(
        (sum, rider) => sum + Number(rider.tasksCompleted || 0),
        0,
      );

      setStats([
        {
          label: "Total Riders",
          value: String(mapped.length),
          icon: "groups",
          iconBg: "bg-blue-50",
          iconColor: "text-primary",
          badge: `${mapped.length} registered`,
          watermark: "motorcycle",
        },
        {
          label: "Active Riders",
          value: String(activeCount),
          icon: "electric_moped",
          iconBg: "bg-cyan-50",
          iconColor: "text-cyan-600",
          badge: mapped.length
            ? `${Math.round((activeCount / mapped.length) * 100)}% active`
            : "0% active",
          watermark: "electric_bike",
        },
        {
          label: "Inactive Riders",
          value: String(inactiveCount),
          icon: "do_not_disturb_on",
          iconBg: "bg-slate-100",
          iconColor: "text-slate-600",
          badge: `${inactiveCount} off duty`,
          watermark: "no_accounts",
        },
        {
          label: "Deliveries",
          value: String(deliveries),
          icon: "local_shipping",
          iconBg: "bg-yellow-50",
          iconColor: "text-yellow-600",
          badge: "Completed tasks",
          watermark: "delivery_dining",
        },
      ]);
    } catch (err) {
      setRiders([]);
      notify.error(err?.message || "Failed to load riders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchRiders();
    })();
  }, [fetchRiders]);

  function openCreateModal() {
    setFormData({
      name: "",
      phone: "",
      email: "",
      password: "",
    });
    setShowCreate(true);
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleCreateRider(e) {
    e.preventDefault();

    if (!formData.name.trim()) {
      notify.error("Please enter the rider name.");
      return;
    }

    if (!formData.phone.trim()) {
      notify.error("Please enter the rider phone number.");
      return;
    }

    if (!formData.password.trim() || formData.password.trim().length < 6) {
      notify.error("Please enter a password with at least 6 characters.");
      return;
    }

    setCreating(true);
    try {
      await api.post("/admin/riders", {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        email: formData.email.trim() || undefined,
      });

      notify.success("Rider created successfully.");
      setShowCreate(false);
      await fetchRiders();
    } catch (err) {
      notify.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create rider",
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleViewRider(rider) {
    setDetailsLoading(true);
    setSelectedRider(rider);

    try {
      const data = await api.get(`/admin/riders/${rider.id}`);
      const details = data?.rider ?? data?.data ?? data ?? {};
      setSelectedRider(normalizeRider(details));
    } catch (err) {
      notify.error(err?.message || "Failed to load rider details");
    } finally {
      setDetailsLoading(false);
    }
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
          onClick={openCreateModal}
          className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2 w-fit"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>{" "}
          Add New Rider
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          stats.map((s) => (
            <div
              key={s.label}
              className={`glass-card rounded-xl p-5 relative overflow-hidden group hover:shadow-lg transition-shadow`}
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
              <p className="text-3xl font-bold text-on-surface mt-1">
                {s.value}
              </p>
            </div>
          ))
        )}
      </div>

      <div
        className={`grid grid-cols-1 gap-4 items-start ${
          selectedRider
            ? "xl:grid-cols-[minmax(0,1.55fr)_minmax(0,0.95fr)]"
            : "xl:grid-cols-1"
        }`}
      >
        <div className="glass-card rounded-xl overflow-hidden">
          {/* Fleet Table */}
          <div>
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
                    <>
                      <SkeletonTableRow columns={7} />
                      <SkeletonTableRow columns={7} />
                      <SkeletonTableRow columns={7} />
                      <SkeletonTableRow columns={7} />
                      <SkeletonTableRow columns={7} />
                    </>
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
                        onClick={() => handleViewRider(r)}
                        className={`border-t border-outline-variant/20 hover:bg-white/30 transition-colors cursor-pointer ${selectedRider?.id === r.id ? "bg-secondary/5" : ""}`}
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
                                className={`absolute bottom-0 right-0 w-3 h-3 ${r.status === "Active" ? "bg-green-500" : "bg-slate-400"} border-2 border-white rounded-full`}
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
                          {formatDate(r.joined)}
                        </td>
                        <td className="px-5 py-3.5 text-on-surface-variant">
                          {formatDate(r.detailsLoadedAt)}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex justify-center items-center gap-4">
                            <div className="text-center">
                              <span className="text-[10px] text-on-surface-variant block uppercase">
                                Pick
                              </span>
                              <span className="font-bold text-on-surface">
                                {r.tasksPicked}
                              </span>
                            </div>
                            <div className="h-6 w-[1px] bg-outline-variant/50" />
                            <div className="text-center">
                              <span className="text-[10px] text-on-surface-variant block uppercase">
                                Del
                              </span>
                              <span className="font-bold text-on-surface">
                                {r.tasksCompleted}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              handleViewRider(r);
                            }}
                            className="p-2 text-on-surface-variant hover:text-secondary hover:bg-white/40 rounded-lg transition-all"
                          >
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

        {selectedRider ? (
          <div className="xl:sticky xl:top-4">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-on-surface">
                    Rider Details
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Click any rider row to view details.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRider(null);
                    setDetailsLoading(false);
                  }}
                  className="text-xs font-semibold text-secondary hover:text-secondary-fixed"
                >
                  Clear
                </button>
              </div>
              <div className="p-5 space-y-5">
                {detailsLoading ? (
                  <div className="space-y-4">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center font-bold text-secondary text-lg">
                        {selectedRider.initials}
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                          Selected Rider
                        </p>
                        <h4 className="text-xl font-semibold text-on-surface mt-1">
                          {selectedRider.name}
                        </h4>
                        <p className="text-sm text-on-surface-variant">
                          {selectedRider.status}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <DetailTile label="Rider ID" value={selectedRider.id} />
                      <DetailTile label="Phone" value={selectedRider.phone} />
                      <DetailTile label="Email" value={selectedRider.email} />
                      <DetailTile label="Area" value={selectedRider.area} />
                      <DetailTile
                        label="Joined"
                        value={formatDate(selectedRider.joined)}
                      />
                      <DetailTile
                        label="Last Sync"
                        value={formatDate(selectedRider.detailsLoadedAt)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <DetailTile
                        label="Pickups"
                        value={selectedRider.tasksPicked}
                      />
                      <DetailTile
                        label="Deliveries"
                        value={selectedRider.tasksCompleted}
                      />
                      <DetailTile
                        label="Bike Number"
                        value={selectedRider.bikeNumber}
                      />
                      <DetailTile
                        label="Address"
                        value={selectedRider.address}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form
            onSubmit={handleCreateRider}
            className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-outline-variant/30 bg-linear-to-r from-secondary-fixed to-white flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-on-surface text-lg">
                  Create Rider
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Add a new rider account using the admin API.
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

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  placeholder="Rider name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    placeholder="9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  placeholder="rider@example.com"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant/30 bg-white/50">
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
                      add
                    </span>
                    Create Rider
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
