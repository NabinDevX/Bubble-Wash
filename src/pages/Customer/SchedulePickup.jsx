import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api.js";

export default function SchedulePickup() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(4);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [services, setServices] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    zip: "",
    instructions: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const calendarDays = [29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  useEffect(() => {
    async function fetchData() {
      try {
        const [svcRes, slotRes, addrRes] = await Promise.allSettled([
          api.get("/services"),
          api.get("/slots"),
          api.get("/addresses"),
        ]);

        if (svcRes.status === "fulfilled") {
          const data = svcRes.value;
          const list =
            data?.services ??
            data?.data?.services ??
            data?.data ??
            data ??
            [];
          setServices(
            list.map((s) => ({
              id: s._id ?? s.id,
              icon: s.name?.includes("Dry") ? "iron" : "local_laundry_service",
              name: s.name,
              desc: s.description ?? "Professional garment care.",
              popular: s.popular ?? false,
            })),
          );
        }

        if (slotRes.status === "fulfilled") {
          const data = slotRes.value;
          const list =
            data?.slots ??
            data?.data?.slots ??
            data?.data ??
            data ??
            [];
          setTimeSlots(
            list
              .map((s) => ({
                id: s?._id?.$oid || s?._id || s?.id || null,
                label:
                  s.startTime && s.endTime
                    ? `${s.startTime} - ${s.endTime}`
                    : (s.time ?? "—"),
                available: s.isActive !== false,
              }))
              .filter((s) => s.id !== null)
          );
        }

        if (addrRes.status === "fulfilled") {
          const data = addrRes.value;
          const addrs =
            data?.addresses ??
            data?.data?.addresses ??
            data?.data ??
            data ??
            [];
          if (addrs.length > 0) {
            const a = addrs[0];
            setAddress({
              street: a.street ?? a.address ?? "",
              city: a.city ?? "",
              zip: a.zip ?? a.pinCode ?? "",
              instructions: a.instructions ?? "",
            });
          }
        }
      } catch {
        setServices([]);
        setTimeSlots([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function toggleService(id) {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  async function handleSubmit() {
    if (selectedServices.length === 0) {
      setError("Please select at least one service");
      return;
    }

    if (selectedSlot === null) {
      setError("Please select a valid time slot");
      return;
    }

    if (!address.street || !address.city || !address.zip) {
      setError("Please fill address properly");
      return;
    }

    setError("");
    setSubmitting(true);

    console.log("Selected Services:", selectedServices);

    try {
      const payload = {
        orderItems: selectedServices.map((serviceId) => ({
          service: serviceId,
          weight: 1,
        })),

        pickupAddress: {
          street: address.street,
          area: "",
          city: address.city,
          state: "",
          pincode: address.zip,
          landmark: address.instructions || "",
        },

        pickupSlotId: selectedSlot,
      };

      console.log("FINAL PAYLOAD:", payload);

      const res = await api.post("/orders", payload);

      const orderId =
        res?.order?.orderId ||
        res?.order?._id ||
        res?.orderId ||
        res?._id;

      console.log("ORDER ID:", orderId);

      navigate("/customer/checkout", {
        state: {
          orderId,
          orderItems: payload.orderItems,
          pickupAddress: payload.pickupAddress,
          pickupSlot: payload.pickupSlotId,
        },
        replace: true,
      });

    } catch (err) {
      setError(err.message || "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 px-4 md:px-8 py-6 max-w-6xl mx-auto">
      {/* Header */}
      <header className="text-center md:text-left">
        <p className="font-label-md text-label-md text-secondary mb-2 uppercase tracking-widest">
          Step 2 of 3
        </p>
        <h1 className="font-display-lg text-headline-sm sm:text-headline-md md:text-display-lg text-on-surface">
          Schedule Pickup
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
          When and where should we collect your items?
        </p>
      </header>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>{" "}
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Address & Services */}
        <div className="lg:col-span-7 space-y-6">
          {/* Address */}
          <section className="glass-card rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm">
                Pickup Address
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <input
                className="bg-white/40 border-b border-surface-tint/20 rounded-t-lg px-4 py-3 focus:outline-none focus:border-secondary-container transition-colors placeholder-on-surface-variant/50 text-on-surface"
                placeholder="Street Address"
                value={address.street}
                onChange={(e) =>
                  setAddress((p) => ({ ...p, street: e.target.value }))
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  className="bg-white/40 border-b border-surface-tint/20 rounded-t-lg px-4 py-3 focus:outline-none focus:border-secondary-container transition-colors placeholder-on-surface-variant/50 text-on-surface"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) =>
                    setAddress((p) => ({ ...p, city: e.target.value }))
                  }
                />
                <input
                  className="bg-white/40 border-b border-surface-tint/20 rounded-t-lg px-4 py-3 focus:outline-none focus:border-secondary-container transition-colors placeholder-on-surface-variant/50 text-on-surface"
                  placeholder="ZIP Code"
                  value={address.zip}
                  onChange={(e) =>
                    setAddress((p) => ({ ...p, zip: e.target.value }))
                  }
                />
              </div>
              <textarea
                className="bg-white/40 border-b border-surface-tint/20 rounded-t-lg px-4 py-3 focus:outline-none focus:border-secondary-container transition-colors placeholder-on-surface-variant/50 text-on-surface resize-none h-24 mt-2"
                placeholder="Delivery Instructions (Optional, e.g., 'Leave with doorman')"
                value={address.instructions}
                onChange={(e) =>
                  setAddress((p) => ({ ...p, instructions: e.target.value }))
                }
              />
            </div>
          </section>

          {/* Services */}
          <section className="glass-card rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">dry_cleaning</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm">
                Select Services
              </h2>
            </div>
            {loading ? (
              <p className="text-on-surface-variant">Loading services…</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((s) => {
                  const active = selectedServices.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleService(s.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${active ? "border-2 border-secondary bg-secondary-container/10" : "border border-white/40 bg-white/20 hover:bg-white/40"}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span
                          className={`material-symbols-outlined ${active ? "text-secondary" : "text-on-surface-variant"}`}
                        >
                          {s.icon}
                        </span>
                        {s.popular && (
                          <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/20 px-2 py-1 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <h3 className="font-label-md text-label-md mb-1 text-on-surface">
                        {s.name}
                      </h3>
                      <p className="text-sm text-on-surface-variant">
                        {s.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right: Calendar & Time */}
        <div className="lg:col-span-5 space-y-6">
          <section className="glass-card rounded-3xl p-6 md:p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">
                  calendar_month
                </span>
              </div>
              <h2 className="font-headline-sm text-headline-sm">
                Schedule Time
              </h2>
            </div>

            {/* Calendar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <button className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined">
                    chevron_left
                  </span>
                </button>
                <span className="font-label-md text-label-md">
                  October 2023
                </span>
                <button className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center font-label-sm text-label-sm text-on-surface-variant mb-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <div key={i}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {calendarDays.map((day) => {
                  const isPrev = day > 20;
                  const isSelected = day === selectedDay && !isPrev;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => !isPrev && setSelectedDay(day)}
                      className={`p-2 rounded-full text-sm transition-all ${isPrev ? "text-on-surface-variant/30 cursor-default" : isSelected ? "bg-secondary text-on-secondary shadow-[0_0_15px_rgba(98,250,227,0.3)]" : "hover:bg-white/40 cursor-pointer"}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots */}
            <div className="mt-auto">
              <h3 className="font-label-md text-label-md mb-3 text-on-surface-variant">
                Available Windows
              </h3>
              {loading ? (
                <p className="text-on-surface-variant">Loading slots…</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((slot, i) => (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`py-3 px-4 rounded-lg text-sm transition-colors ${!slot.available ? "border border-white/40 bg-white/20 text-on-surface-variant/50 cursor-not-allowed" : slot.id === selectedSlot ? "border-2 border-secondary bg-secondary-container/10 text-on-surface" : "border border-white/40 bg-white/20 hover:bg-white/40"}`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Action */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full md:w-auto bg-linear-to-r from-secondary to-secondary-container text-on-secondary px-8 py-4 rounded-full font-label-md text-label-md hover:shadow-[0_0_20px_rgba(98,250,227,0.4)] transition-shadow duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? "Creating Order…" : "Continue to Payment"}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}