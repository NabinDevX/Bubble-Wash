import { useState, useEffect } from "react";
import { SkeletonCard } from "../../components/Skeleton.jsx";
import api from "../../lib/api.js";
import notify from "../../lib/notify.js";

// Helper function to convert 24-hour format to 12-hour components
function parse24HourTime(timeStr) {
  if (!timeStr || timeStr === "—") {
    return { hour: "12", minute: "00", period: "AM" };
  }

  // Remove extra spaces and dashes
  timeStr = timeStr.trim().replace(/\s*--\s*/, "");

  // Try to parse 24-hour format (e.g., "10:00")
  const match = timeStr.match(/^(\d{1,2}):(\d{2})/);
  if (match) {
    let hours = parseInt(match[1]);
    const minutes = match[2];
    let period = "AM";

    if (hours >= 12) {
      period = "PM";
      if (hours > 12) {
        hours -= 12;
      }
    } else if (hours === 0) {
      hours = 12;
    }

    return {
      hour: String(hours),
      minute: minutes,
      period,
    };
  }

  return { hour: "12", minute: "00", period: "AM" };
}

// Helper function to convert 12-hour components to 24-hour format
function convert12HourTo24Hour(hour, minute, period) {
  let h = parseInt(hour) || 12;
  const m = String(minute || "00").padStart(2, "0");

  if (period === "PM" && h !== 12) {
    h += 12;
  } else if (period === "AM" && h === 12) {
    h = 0;
  }

  return `${String(h).padStart(2, "0")}:${m}`;
}

export default function DeliverySlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    startHour: "12",
    startMinute: "00",
    startPeriod: "AM",
    endHour: "12",
    endMinute: "00",
    endPeriod: "AM",
    capacity: "",
  });

  useEffect(() => {
    async function loadSlots() {
      setLoading(true);
      try {
        const data = await api.get("/admin/slots");
        const list = data.slots ?? data.data ?? data ?? [];
        setSlots(
          list.map((s) => ({
            id: s._id ?? s.id,
            startTime: s.startTime ?? "—",
            endTime: s.endTime ?? "—",
            time:
              s.startTime && s.endTime
                ? `${s.startTime} - ${s.endTime}`
                : (s.time ?? "—"),
            icon: s.icon ?? "schedule",
            booked: s.booked ?? s.currentBookings ?? 0,
            total: s.capacity ?? s.total ?? 20,
            active: s.isActive !== false,
            label:
              s.isActive === false
                ? "Inactive Slot"
                : (s.booked ?? 0) / (s.capacity ?? 20) >= 0.8
                  ? "Almost Full"
                  : "Available",
            labelColor:
              s.isActive === false
                ? "text-outline"
                : (s.booked ?? 0) / (s.capacity ?? 20) >= 0.8
                  ? "text-error"
                  : "text-secondary",
          })),
        );
      } catch (err) {
        notify.error(err?.message || "Failed to fetch slots");
      } finally {
        setLoading(false);
      }
    }

    loadSlots();
  }, []);

  async function toggleSlot(id) {
    try {
      await api.patch(`/admin/slots/${id}/toggle`);
      setSlots((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          const newActive = !s.active;
          return {
            ...s,
            active: newActive,
            label: !newActive
              ? "Inactive Slot"
              : s.booked / s.total >= 0.8
                ? "Almost Full"
                : "Available",
            labelColor: !newActive
              ? "text-outline"
              : s.booked / s.total >= 0.8
                ? "text-error"
                : "text-secondary",
          };
        }),
      );
      notify.success(`Slot ${editingId ? "updated" : "toggled"} successfully.`);
    } catch (err) {
      notify.error(err?.message || "Failed to update slot");
    }
  }

  function handleOpenCreate() {
    setEditingId(null);
    setFormData({
      startHour: "12",
      startMinute: "00",
      startPeriod: "AM",
      endHour: "12",
      endMinute: "00",
      endPeriod: "AM",
      capacity: "",
    });
    setShowModal(true);
  }

  function handleOpenEdit(slot) {
    const startParsed = parse24HourTime(slot.startTime);
    const endParsed = parse24HourTime(slot.endTime);

    setEditingId(slot.id);
    setFormData({
      startHour: startParsed.hour,
      startMinute: startParsed.minute,
      startPeriod: startParsed.period,
      endHour: endParsed.hour,
      endMinute: endParsed.minute,
      endPeriod: endParsed.period,
      capacity: String(slot.total),
    });
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setFormData({
      startHour: "12",
      startMinute: "00",
      startPeriod: "AM",
      endHour: "12",
      endMinute: "00",
      endPeriod: "AM",
      capacity: "",
    });
    setEditingId(null);
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmitForm(e) {
    e.preventDefault();
    setSubmitting(true);

    // Validate inputs
    const startHour = parseInt(formData.startHour) || 0;
    const startMinute = parseInt(formData.startMinute) || 0;
    const endHour = parseInt(formData.endHour) || 0;
    const endMinute = parseInt(formData.endMinute) || 0;

    if (
      startHour < 1 ||
      startHour > 12 ||
      startMinute < 0 ||
      startMinute > 59
    ) {
      notify.error("Please enter a valid start time.");
      setSubmitting(false);
      return;
    }

    if (endHour < 1 || endHour > 12 || endMinute < 0 || endMinute > 59) {
      notify.error("Please enter a valid end time.");
      setSubmitting(false);
      return;
    }

    const capacity = Number(formData.capacity);
    if (!Number.isFinite(capacity) || capacity < 1) {
      notify.error("Please enter a valid capacity.");
      setSubmitting(false);
      return;
    }

    try {
      // Convert 12-hour format to 24-hour format
      const startTime = convert12HourTo24Hour(
        formData.startHour,
        formData.startMinute,
        formData.startPeriod,
      );
      const endTime = convert12HourTo24Hour(
        formData.endHour,
        formData.endMinute,
        formData.endPeriod,
      );

      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;

      const payload = {
        date: dateStr,
        startTime,
        endTime,
        capacity,
      };

      if (editingId) {
        // Update
        await api.put(`/admin/slots/${editingId}`, payload);
        notify.success("Slot updated successfully.");
      } else {
        // Create
        await api.post("/admin/slots", payload);
        notify.success("Slot created successfully.");
      }

      handleCloseModal();
      setLoading(true);
      const data = await api.get("/admin/slots");
      const list = data.slots ?? data.data ?? data ?? [];
      setSlots(
        list.map((s) => ({
          id: s._id ?? s.id,
          startTime: s.startTime ?? "—",
          endTime: s.endTime ?? "—",
          time:
            s.startTime && s.endTime
              ? `${s.startTime} - ${s.endTime}`
              : (s.time ?? "—"),
          icon: s.icon ?? "schedule",
          booked: s.booked ?? s.currentBookings ?? 0,
          total: s.capacity ?? s.total ?? 20,
          active: s.isActive !== false,
          label:
            s.isActive === false
              ? "Inactive Slot"
              : (s.booked ?? 0) / (s.capacity ?? 20) >= 0.8
                ? "Almost Full"
                : "Available",
          labelColor:
            s.isActive === false
              ? "text-outline"
              : (s.booked ?? 0) / (s.capacity ?? 20) >= 0.8
                ? "text-error"
                : "text-secondary",
        })),
      );
      setLoading(false);
    } catch (err) {
      notify.error(
        err?.response?.data?.message ||
          err?.message ||
          `Failed to ${editingId ? "update" : "create"} slot`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleOpenDeleteConfirm(id) {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  }

  function handleCloseDeleteConfirm() {
    setShowDeleteConfirm(false);
    setDeleteId(null);
  }

  async function handleConfirmDelete() {
    if (!deleteId) return;
    setDeleting(true);

    try {
      await api.delete(`/admin/slots/${deleteId}`);
      notify.success("Slot deleted successfully.");
      setSlots((prev) => prev.filter((s) => s.id !== deleteId));
      handleCloseDeleteConfirm();
    } catch (err) {
      notify.error(err?.message || "Failed to delete slot");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Delivery Slots
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Manage available pickup and delivery windows.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-3 py-2 rounded-lg border border-outline-variant bg-white/60 text-on-surface text-sm font-medium">
            <option>All Zones (Default)</option>
          </select>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span> New
            Slot
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">
          No slots found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {slots.map((slot) => {
            const pct =
              slot.total > 0 ? Math.round((slot.booked / slot.total) * 100) : 0;
            return (
              <div
                key={slot.id}
                className={`glass-card rounded-xl p-5 flex flex-col group hover:shadow-lg transition-shadow ${!slot.active ? "opacity-70 grayscale-[0.2]" : ""}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`material-symbols-outlined ${slot.active ? "text-secondary" : "text-outline"}`}
                    >
                      {slot.icon}
                    </span>
                    <h3
                      className={`text-sm font-semibold ${slot.active ? "text-on-surface" : "text-on-surface-variant"}`}
                    >
                      {slot.time}
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleSlot(slot.id)}
                    aria-label="Toggle Slot Status"
                    className={`w-10 h-6 rounded-full relative flex items-center px-1 transition-colors duration-200 ${slot.active ? "bg-secondary" : "bg-outline-variant border border-outline-variant"}`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full shadow-sm transition-transform duration-200 ${slot.active ? "bg-white translate-x-4" : "bg-outline translate-x-0"}`}
                    />
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Capacity
                    </span>
                    <span className="text-sm font-semibold">
                      {slot.booked}{" "}
                      <span className="text-outline">/ {slot.total}</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${pct >= 80 ? "bg-primary" : slot.active ? "bg-secondary-container" : "bg-outline-variant"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className={`text-xs font-bold mt-2 ${slot.labelColor}`}>
                    {slot.label}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-outline-variant/30 flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleOpenEdit(slot)}
                    className="p-2 text-outline hover:text-secondary hover:bg-white/30 rounded-lg transition-colors"
                    aria-label="Edit Slot"
                  >
                    <span className="material-symbols-outlined text-lg">
                      edit
                    </span>
                  </button>
                  <button
                    onClick={() => handleOpenDeleteConfirm(slot.id)}
                    className="p-2 text-outline hover:text-error hover:bg-red-50/50 rounded-lg transition-colors"
                    aria-label="Delete Slot"
                  >
                    <span className="material-symbols-outlined text-lg">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form
            onSubmit={handleSubmitForm}
            className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-outline-variant/30 bg-linear-to-r from-secondary-fixed to-white flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-on-surface text-lg">
                  {editingId
                    ? "Edit Delivery Slot"
                    : "Create New Delivery Slot"}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Required fields are marked with *.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="h-9 w-9 rounded-full hover:bg-black/5 flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Start Time *
                </label>
                <div className="flex items-end gap-2">
                  {/* Hour */}
                  <div className="flex-1">
                    <label className="text-xs text-on-surface-variant mb-1 block">
                      Hour (1-12)
                    </label>
                    <input
                      type="number"
                      name="startHour"
                      min="1"
                      max="12"
                      value={formData.startHour}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50 text-center font-semibold"
                    />
                  </div>
                  {/* Minute */}
                  <div className="flex-1">
                    <label className="text-xs text-on-surface-variant mb-1 block">
                      Minute
                    </label>
                    <input
                      type="number"
                      name="startMinute"
                      min="0"
                      max="59"
                      step="5"
                      value={formData.startMinute}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50 text-center font-semibold"
                    />
                  </div>
                  {/* AM/PM Radio */}
                  <div className="flex-1">
                    <label className="text-xs text-on-surface-variant mb-1 block">
                      Period
                    </label>
                    <div className="flex gap-1 h-10">
                      <label
                        className="flex-1 flex items-center justify-center rounded-lg border border-outline-variant/60 cursor-pointer transition-all"
                        style={{
                          backgroundColor:
                            formData.startPeriod === "AM"
                              ? "rgb(99, 182, 155)"
                              : "transparent",
                          color:
                            formData.startPeriod === "AM" ? "white" : "inherit",
                          borderColor:
                            formData.startPeriod === "AM"
                              ? "rgb(99, 182, 155)"
                              : "inherit",
                        }}
                      >
                        <input
                          type="radio"
                          name="startPeriod"
                          value="AM"
                          checked={formData.startPeriod === "AM"}
                          onChange={handleFormChange}
                          className="hidden"
                        />
                        <span className="text-sm font-semibold">AM</span>
                      </label>
                      <label
                        className="flex-1 flex items-center justify-center rounded-lg border border-outline-variant/60 cursor-pointer transition-all"
                        style={{
                          backgroundColor:
                            formData.startPeriod === "PM"
                              ? "rgb(99, 182, 155)"
                              : "transparent",
                          color:
                            formData.startPeriod === "PM" ? "white" : "inherit",
                          borderColor:
                            formData.startPeriod === "PM"
                              ? "rgb(99, 182, 155)"
                              : "inherit",
                        }}
                      >
                        <input
                          type="radio"
                          name="startPeriod"
                          value="PM"
                          checked={formData.startPeriod === "PM"}
                          onChange={handleFormChange}
                          className="hidden"
                        />
                        <span className="text-sm font-semibold">PM</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  End Time *
                </label>
                <div className="flex items-end gap-2">
                  {/* Hour */}
                  <div className="flex-1">
                    <label className="text-xs text-on-surface-variant mb-1 block">
                      Hour (1-12)
                    </label>
                    <input
                      type="number"
                      name="endHour"
                      min="1"
                      max="12"
                      value={formData.endHour}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50 text-center font-semibold"
                    />
                  </div>
                  {/* Minute */}
                  <div className="flex-1">
                    <label className="text-xs text-on-surface-variant mb-1 block">
                      Minute
                    </label>
                    <input
                      type="number"
                      name="endMinute"
                      min="0"
                      max="59"
                      step="5"
                      value={formData.endMinute}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50 text-center font-semibold"
                    />
                  </div>
                  {/* AM/PM Radio */}
                  <div className="flex-1">
                    <label className="text-xs text-on-surface-variant mb-1 block">
                      Period
                    </label>
                    <div className="flex gap-1 h-10">
                      <label
                        className="flex-1 flex items-center justify-center rounded-lg border border-outline-variant/60 cursor-pointer transition-all"
                        style={{
                          backgroundColor:
                            formData.endPeriod === "AM"
                              ? "rgb(99, 182, 155)"
                              : "transparent",
                          color:
                            formData.endPeriod === "AM" ? "white" : "inherit",
                          borderColor:
                            formData.endPeriod === "AM"
                              ? "rgb(99, 182, 155)"
                              : "inherit",
                        }}
                      >
                        <input
                          type="radio"
                          name="endPeriod"
                          value="AM"
                          checked={formData.endPeriod === "AM"}
                          onChange={handleFormChange}
                          className="hidden"
                        />
                        <span className="text-sm font-semibold">AM</span>
                      </label>
                      <label
                        className="flex-1 flex items-center justify-center rounded-lg border border-outline-variant/60 cursor-pointer transition-all"
                        style={{
                          backgroundColor:
                            formData.endPeriod === "PM"
                              ? "rgb(99, 182, 155)"
                              : "transparent",
                          color:
                            formData.endPeriod === "PM" ? "white" : "inherit",
                          borderColor:
                            formData.endPeriod === "PM"
                              ? "rgb(99, 182, 155)"
                              : "inherit",
                        }}
                      >
                        <input
                          type="radio"
                          name="endPeriod"
                          value="PM"
                          checked={formData.endPeriod === "PM"}
                          onChange={handleFormChange}
                          className="hidden"
                        />
                        <span className="text-sm font-semibold">PM</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Capacity *
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleFormChange}
                  placeholder="e.g. 20"
                  min="1"
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  required
                />
              </div>

              <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-sm text-blue-900">
                The slot will be {editingId ? "updated" : "created"} via{" "}
                <span className="font-semibold">
                  {editingId ? "PUT /admin/slots/:id" : "POST /admin/slots"}
                </span>
                .
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant/30 bg-white/50">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-5 py-2.5 rounded-lg text-on-surface-variant font-medium hover:bg-black/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-lg text-white font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">
                      progress_activity
                    </span>
                    {editingId ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">
                      {editingId ? "edit" : "add"}
                    </span>
                    {editingId ? "Update Slot" : "Create Slot"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-error">
                  warning
                </span>
              </div>
              <h3 className="font-semibold text-on-surface text-lg">
                Delete Slot?
              </h3>
            </div>

            <div className="px-6 py-4">
              <p className="text-sm text-on-surface-variant">
                Are you sure you want to delete this delivery slot? This action
                cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant/30 bg-white/50">
              <button
                type="button"
                onClick={handleCloseDeleteConfirm}
                disabled={deleting}
                className="px-5 py-2.5 rounded-lg text-on-surface-variant font-medium hover:bg-black/5 transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-6 py-2.5 rounded-lg text-white font-semibold bg-error shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">
                      progress_activity
                    </span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">
                      delete
                    </span>
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
