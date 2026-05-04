import { useState, useEffect } from "react";
import { SkeletonCard } from "../../components/Skeleton.jsx";
import api from "../../lib/api.js";
import notify from "../../lib/notify.js";

export default function DeliverySlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSlots() {
      try {
        const data = await api.get("/admin/slots");
        const list = data.slots ?? data.data ?? data ?? [];
        setSlots(
          list.map((s) => ({
            id: s._id ?? s.id,
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
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    }
    fetchSlots();
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
    } catch (err) {
      notify.error(err?.message || "Failed to update slot");
    }
  }

  async function handleAddSlot() {
    const startTime = prompt("Start time (e.g. 10:00 AM):");
    const endTime = prompt("End time (e.g. 12:00 PM):");
    const capacity = prompt("Capacity:");
    if (!startTime || !endTime) return;
    try {
      await api.post("/admin/slots", {
        startTime,
        endTime,
        capacity: Number(capacity),
      });
      window.location.reload();
    } catch (err) {
      notify.error(err?.message || "Failed to create slot");
    }
  }

  async function handleDeleteSlot(id) {
    if (!confirm("Delete this slot?")) return;
    try {
      await api.delete(`/admin/slots/${id}`);
      setSlots((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      notify.error(err?.message || "Failed to delete slot");
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
            onClick={handleAddSlot}
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
                    className="p-2 text-outline hover:text-secondary hover:bg-white/30 rounded-lg transition-colors"
                    aria-label="Edit Slot"
                  >
                    <span className="material-symbols-outlined text-lg">
                      edit
                    </span>
                  </button>
                  <button
                    onClick={() => handleDeleteSlot(slot.id)}
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
    </div>
  );
}
