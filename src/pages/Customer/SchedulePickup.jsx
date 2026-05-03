import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api.js";

export default function SchedulePickup() {
  const navigate = useNavigate();

  // Dynamic Date Setup
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  // Get number of days in month
  function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  const daysInMonth = getDaysInMonth(month, year);
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Month name
  const monthName = new Date(year, month).toLocaleString("default", {
    month: "long",
  });

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [services, setServices] = useState([]);
  // STEP CONTROL
  const [step, setStep] = useState(1);
  // QUANTITY STATE
  const [quantities, setQuantities] = useState({});
  const subtotal = services.reduce((sum, s) => {
    if (!selectedServices.includes(s.id)) return sum;
    return sum + (quantities[s.id] || 1) * (s.price || 0);
  }, 0);

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
  const [deliveryType, setDeliveryType] = useState("standard");

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
            list.map((s) => {
              let icon = "local_laundry_service";

              if (s.name.toLowerCase().includes("wash")) {
                icon = "local_laundry_service";
              } else if (s.name.toLowerCase().includes("iron")) {
                icon = "iron";
              } else if (s.name.toLowerCase().includes("dry")) {
                icon = "dry_cleaning";
              } else if (s.name.toLowerCase().includes("fold")) {
                icon = "checkroom";
              } else {
                icon = "cleaning_services"; // fallback
              }

              return {
                id: s._id ?? s.id,
                icon,
                name: s.name,
                desc: s.description ?? "Professional garment care.",
                price: s.price ?? 49,
                unit: s.unit ?? "kg",
              };
            })
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

  useEffect(() => {
    const daysInNewMonth = new Date(year, month + 1, 0).getDate();

    if (selectedDay > daysInNewMonth) {
      setSelectedDay(daysInNewMonth);
    }
  }, [month, year]);

  function toggleService(id) {
    setSelectedServices((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  }
  function updateQty(id, delta) {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [id]: next };
    });
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
        orderItems: selectedServices.map((serviceId) => {
          const service = services.find((s) => {
            const sid = s._id?.$oid || s._id || s.id;
            return sid === serviceId;
          });

          return {
            service: serviceId, // backend
            quantity: quantities[serviceId] || 1,
          };
        }),
        pickupAddress: {
          street: address.street,
          area: "",
          city: address.city,
          state: "",
          pincode: address.zip,
          landmark: address.instructions || "",
        },

        pickupSlotId: selectedSlot,
        deliveryType: deliveryType,
      };

      console.log("FINAL PAYLOAD:", payload);

      const res = await api.post("/orders", payload);

      const orderId =
        res?.order?.orderId ||
        res?.order?._id ||
        res?.orderId ||
        res?._id;

      console.log("ORDER ID:", orderId);

      const selectedSlotData = timeSlots.find(s => s.id === selectedSlot);

      navigate("/customer/review", {
        state: {
          orderItems: selectedServices.map((serviceId) => {
            const service = services.find((s) => s.id === serviceId);

            return {
              name: service?.name || "Service",
              price: Number(service?.price) || 0,
              quantity: quantities[serviceId] || 1,
            };
          }),
          pickupAddress: payload.pickupAddress,
          pickupSlot: selectedSlotData?.label,
          pickupDate: new Date(year, month, selectedDay)
            .toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),

          deliveryType: deliveryType,
          subtotal: subtotal,
        },
      });

    } catch (err) {
      setError(err.message || "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 px-4 md:px-8 py-6 max-w-6xl mx-auto pb-24">
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
        <div className="lg:col-span-8 space-y-6">
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

          <div className="space-y-6">

            {/* HEADER */}
            {step !== 2 && (
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">
                    {step === 1 ? "dry_cleaning" : "local_shipping"}
                  </span>
                </div>

                <h2 className="font-headline-sm text-headline-sm">
                  {step === 1 ? "Select Services" : "Delivery Option"}
                </h2>
              </div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4">
                {services.map((s) => {
                  const active = selectedServices.includes(s.id);

                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleService(s.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border ${active
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-2xl text-[#1E7F5A]">
                          {s.icon}
                        </span>

                        <div>
                          <h3 className="font-semibold text-gray-800">{s.name}</h3>
                          <p className="text-[#1E7F5A] text-sm">
                            ₹{s.price}/{s.unit}
                          </p>
                        </div>
                      </div>

                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${active
                        ? "bg-[#1E7F5A] text-white"
                        : "border-gray-300"
                        }`}>
                        {active && "✓"}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* GRID START */}
            {step === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* ================= LEFT (Laundry Card) ================= */}
                <div className="lg:col-span-6 space-y-6">

                  <section className="glass-card rounded-3xl p-6 md:p-8">

                    <div className="flex items-center gap-3 mb-6">
                      <span className="material-symbols-outlined text-secondary">
                        local_laundry_service
                      </span>
                      <h2>Laundry Details</h2>
                    </div>

                    <div className="space-y-4">
                      {services
                        .filter((s) => selectedServices.includes(s.id))
                        .map((s) => (
                          <div
                            key={s.id}
                            className="flex items-center justify-between bg-white border p-4 rounded-xl"
                          >
                            <div className="flex items-center gap-4">
                              <span className="material-symbols-outlined text-[#1E7F5A]">
                                {s.icon}
                              </span>
                              <div>
                                <h3>{s.name}</h3>
                                <p>₹{s.price}/{s.unit}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <button onClick={() => updateQty(s.id, -1)}>-</button>
                              <span>{quantities[s.id] || 1}</span>
                              <button onClick={() => updateQty(s.id, 1)}>+</button>
                            </div>
                          </div>
                        ))}

                      <div className="flex justify-between bg-gray-100 p-4 rounded-xl font-semibold">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                      </div>
                    </div>

                  </section>

                </div>


                {/* ================= RIGHT (Schedule Card) ================= */}
                <div className="lg:col-span-6 space-y-6">

                  <section className="glass-card rounded-3xl p-6 md:p-8 w-full">

                    <div className="flex items-center gap-3 mb-6">
                      <span className="material-symbols-outlined text-secondary">
                        calendar_month
                      </span>
                      <h2>Schedule Time</h2>
                    </div>

                    {/* Calendar */}
                    <div className="mb-6">
                      {/* Calendar */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">

                          <button
                            onClick={() => {
                              if (month === 0) {
                                setMonth(11);
                                setYear(year - 1);
                              } else {
                                setMonth(month - 1);
                              }
                            }}
                            className="text-on-surface-variant hover:text-on-surface"
                          >
                            <span className="material-symbols-outlined">
                              chevron_left
                            </span>
                          </button>

                          <span className="font-label-md text-label-md">
                            {monthName} {year}
                          </span>

                          <button
                            onClick={() => {
                              if (month === 11) {
                                setMonth(0);
                                setYear(year + 1);
                              } else {
                                setMonth(month + 1);
                              }
                            }}
                            className="text-on-surface-variant hover:text-on-surface"
                          >
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
                            const isSelected = day === selectedDay;

                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => setSelectedDay(day)}
                                className={`p-2 rounded-full text-sm transition-all ${isSelected
                                  ? "bg-secondary text-on-secondary shadow-[0_0_15px_rgba(98,250,227,0.3)]"
                                  : "hover:bg-white/40 cursor-pointer"
                                  }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Slots */}
                    <div className="grid grid-cols-2 gap-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot.id)}
                          className={`p-3 rounded-lg border ${slot.id === selectedSlot
                            ? "border-secondary bg-secondary-container/20"
                            : "border-gray-300"
                            }`}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>

                  </section>

                </div>

              </div>
            )}
            {/* GRID END */}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-4">

                {/* STANDARD */}
                <div
                  onClick={() => setDeliveryType("standard")}
                  className={`border rounded-xl p-4 flex justify-between items-center cursor-pointer transition ${deliveryType === "standard"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryType === "standard" ? "border-blue-500" : "border-gray-400"
                      }`}>
                      {deliveryType === "standard" && (
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold">Standard Delivery</h3>
                      <p className="text-sm text-gray-500">48 hours turnaround</p>
                    </div>
                  </div>

                  <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">Free</span>
                </div>


                {/* EXPRESS */}
                <div
                  onClick={() => setDeliveryType("express")}
                  className={`border rounded-xl p-4 flex justify-between items-center cursor-pointer transition ${deliveryType === "express"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryType === "express" ? "border-blue-500" : "border-gray-400"
                      }`}>
                      {deliveryType === "express" && (
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold">Express Delivery</h3>
                      <p className="text-sm text-gray-500">24 hours turnaround</p>
                    </div>
                  </div>

                  <span className="bg-yellow-400 text-white px-3 py-1 rounded-full text-sm">
                    +₹49
                  </span>
                </div>

              </div>
            )}

          </div>
        </div >
      </div >
      <div className="flex justify-between mt-8">

        {/* BACK */}
        <button
          onClick={() => setStep((prev) => Math.max(1, prev - 1))}
          className="px-6 py-3 border rounded-xl"
        >
          ← Back
        </button>

        {/* CONTINUE */}
        <button
          onClick={() => {

            // STEP 1 → SERVICES
            if (step === 1) {
              if (selectedServices.length === 0) {
                setError("Please select at least one service");
                return;
              }
              setError("");
              setStep(2);
            }

            // STEP 2 → SLOT + ADDRESS
            else if (step === 2) {
              if (!address.street || !address.city || !address.zip) {
                setError("Please fill address properly");
                return;
              }

              if (!selectedSlot) {
                setError("Please select a time slot");
                return;
              }

              setError("");
              setStep(3);
            }

            // STEP 3 → FINAL SUBMIT
            else if (step === 3) {
              handleSubmit();
            }
          }}
          disabled={
            (step === 1 && selectedServices.length === 0) ||
            (step === 2 && (!selectedSlot || !address.street || !address.city || !address.zip))
          }
          className="px-6 py-3 bg-[#1E7F5A] text-white rounded-xl disabled:opacity-50 hover:bg-[#166a4a] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md"
        >
          Continue →
        </button>
      </div>

    </div >

  );
}