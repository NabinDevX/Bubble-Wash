import { useState, useEffect } from "react";
import { SkeletonTableRow } from "../../components/Skeleton.jsx";
import api from "../../lib/api.js";
import notify from "../../lib/notify.js";

export default function ServiceAreas() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    pincode: "",
    city: "",
    deliveryCharge: "",
    minimumOrderAmount: "",
  });

  useEffect(() => {
    fetchAreas();
  }, []);

  async function fetchAreas() {
    try {
      setLoading(true);
      const response = await api.get("/admin/areas");
      const list =
        response.data?.areas ?? response.areas ?? response.data ?? [];
      setAreas(
        list.map((a) => ({
          id: a._id ?? a.id,
          pincode: a.pincode ?? a.pinCode ?? "—",
          city: a.city ?? "—",
          deliveryCharge: a.deliveryCharge ?? 0,
          minimumOrderAmount: a.minimumOrderAmount ?? 0,
          active: a.isActive !== false,
        })),
      );
    } catch {
      notify.error("Failed to fetch areas");
    } finally {
      setLoading(false);
    }
  }

  const activeCount = areas.filter((a) => a.active).length;
  const inactiveCount = areas.length - activeCount;

  const stats = [
    {
      label: "Total Areas",
      value: String(areas.length),
      icon: "map",
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

  function handleOpenModal() {
    setEditingId(null);
    setFormData({
      pincode: "",
      city: "",
      deliveryCharge: "",
      minimumOrderAmount: "",
    });
    setShowModal(true);
  }

  function handleEditArea(area) {
    setEditingId(area.id);
    setFormData({
      pincode: area.pincode === "—" ? "" : area.pincode,
      city: area.city === "—" ? "" : area.city,
      deliveryCharge: area.deliveryCharge || "",
      minimumOrderAmount: area.minimumOrderAmount || "",
    });
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      pincode: "",
      city: "",
      deliveryCharge: "",
      minimumOrderAmount: "",
    });
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.pincode.trim() || !formData.city.trim()) {
      notify.error("Pin code and city are required");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        pincode: formData.pincode,
        city: formData.city,
        deliveryCharge: Number(formData.deliveryCharge) || 0,
        minimumOrderAmount: Number(formData.minimumOrderAmount) || 0,
      };

      if (editingId) {
        // Update existing area
        await api.put(`/admin/areas/${editingId}`, payload);
        notify.success("Area updated successfully");
      } else {
        // Create new area
        await api.post("/admin/areas", payload);
        notify.success("Area created successfully");
      }
      handleCloseModal();
      fetchAreas();
    } catch (err) {
      notify.error(err?.message || "Failed to save area");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggle(id) {
    try {
      await api.patch(`/admin/areas/${id}/toggle`);
      setAreas((prev) =>
        prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)),
      );
      notify.success("Area status updated");
    } catch (err) {
      notify.error(err?.message || "Failed to toggle area");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this area?")) return;
    try {
      await api.delete(`/admin/areas/${id}`);
      setAreas((prev) => prev.filter((a) => a.id !== id));
      notify.success("Area deleted successfully");
    } catch (err) {
      notify.error(err?.message || "Failed to delete area");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Service Areas
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Manage serviceable pin codes and geographic zones.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg border border-outline-variant bg-white/60 text-on-surface text-sm font-medium hover:bg-white/80 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-base">search</span>{" "}
            Search
          </button>
          <button
            onClick={handleOpenModal}
            className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">add</span> New
            Area
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`glass-card rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition-shadow ${loading ? "animate-pulse" : ""}`}
          >
            <div className={`p-2.5 ${s.iconBg} rounded-lg`}>
              <span className={`material-symbols-outlined ${s.iconColor}`}>
                {s.icon}
              </span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                {s.label}
              </p>
              <p className="text-2xl font-bold text-on-surface">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Area Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
          <h3 className="font-semibold text-on-surface">Pin Code Directory</h3>
          <button className="p-2 text-on-surface-variant hover:bg-white/40 rounded-lg transition-colors border border-outline-variant/50">
            <span className="material-symbols-outlined text-lg">
              filter_list
            </span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-on-surface-variant bg-white/20">
              <tr>
                {[
                  "Pin Code",
                  "City",
                  "Delivery Charge",
                  "Min. Order Amount",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 font-semibold text-xs uppercase tracking-wider"
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
                </>
              ) : areas.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-8 text-center text-on-surface-variant"
                  >
                    No areas found
                  </td>
                </tr>
              ) : (
                areas.map((a) => (
                  <tr
                    key={a.id}
                    className="border-t border-outline-variant/20 hover:bg-white/30 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono font-semibold text-on-surface">
                      {a.pincode}
                    </td>
                    <td className="px-5 py-3.5 text-on-surface">{a.city}</td>
                    <td className="px-5 py-3.5 text-on-surface-variant">
                      ₹{a.deliveryCharge}
                    </td>
                    <td className="px-5 py-3.5 text-on-surface-variant">
                      ₹{a.minimumOrderAmount}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleToggle(a.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase cursor-pointer transition-colors ${a.active ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`}
                      >
                        {a.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditArea(a)}
                          className="p-1.5 text-on-surface-variant hover:text-secondary hover:bg-white/40 rounded-lg transition-all"
                        >
                          <span className="material-symbols-outlined text-lg">
                            edit
                          </span>
                        </button>
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="p-1.5 text-on-surface-variant hover:text-error hover:bg-red-50/50 rounded-lg transition-all"
                        >
                          <span className="material-symbols-outlined text-lg">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-outline-variant/30 bg-white/30 flex items-center justify-between text-xs text-on-surface-variant">
          <span>
            Showing 1 to {areas.length} of {areas.length} entries
          </span>
        </div>
      </div>

      {/* Modal for Create/Edit Area */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30">
              <h2 className="text-lg font-semibold text-on-surface">
                {editingId ? "Edit Area" : "Create New Area"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1 text-on-surface-variant hover:bg-white/40 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Pin Code <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="e.g., 700125"
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant bg-white/60 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  City <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g., Barasat"
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant bg-white/60 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Delivery Charge (₹)
                </label>
                <input
                  type="number"
                  name="deliveryCharge"
                  value={formData.deliveryCharge}
                  onChange={handleInputChange}
                  placeholder="e.g., 29"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant bg-white/60 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Minimum Order Amount (₹)
                </label>
                <input
                  type="number"
                  name="minimumOrderAmount"
                  value={formData.minimumOrderAmount}
                  onChange={handleInputChange}
                  placeholder="e.g., 200"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant bg-white/60 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 rounded-lg border border-outline-variant text-on-surface font-medium hover:bg-white/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 rounded-lg bg-secondary text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">
                        {editingId ? "check" : "add"}
                      </span>
                      {editingId ? "Update Area" : "Create Area"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
