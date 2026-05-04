import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../../components/Skeleton.jsx";
import api from "../../lib/api.js";
import notify from "../../lib/notify.js";

function normalizeCustomer(user, index = 0) {
  const id =
    user?._id ??
    user?.id ??
    user?.userId ??
    `CUS-${String(index + 1).padStart(3, "0")}`;
  const name = user?.name ?? user?.fullName ?? user?.customerName ?? "Unknown";
  const phone = user?.phone ?? user?.mobile ?? "—";
  const email = user?.email ?? "";
  const active = user?.isActive !== false;

  return {
    id: String(id),
    name: String(name),
    phone: String(phone),
    email: String(email),
    active,
  };
}

export default function CreateOrder() {
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [formData, setFormData] = useState({
    customerId: "",
    service: "",
    weight: "1",
    paymentMethod: "cash",
    expressOrder: "false",
    street: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    pickupSlot: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesRes, slotsRes, customersRes] = await Promise.allSettled([
          api.get("/services"),
          api.get("/slots"),
          api.get("/admin/users"),
        ]);

        let loadedServices = [];
        let loadedSlots = [];
        let loadedCustomers = [];

        if (servicesRes.status === "fulfilled") {
          loadedServices =
            servicesRes.value?.services ?? servicesRes.value ?? [];
          setServices(Array.isArray(loadedServices) ? loadedServices : []);
        }

        if (slotsRes.status === "fulfilled") {
          loadedSlots = slotsRes.value?.slots ?? slotsRes.value ?? [];
          setSlots(Array.isArray(loadedSlots) ? loadedSlots : []);
        }

        if (customersRes.status === "fulfilled") {
          loadedCustomers =
            customersRes.value?.users ??
            customersRes.value?.data?.users ??
            customersRes.value?.data ??
            customersRes.value ??
            [];
          const normalizedCustomers = Array.isArray(loadedCustomers)
            ? loadedCustomers.map(normalizeCustomer)
            : [];
          setCustomers(normalizedCustomers);
        }

        const activeService =
          loadedServices.find((s) => s.isActive !== false) || loadedServices[0];
        const activeSlot =
          loadedSlots.find((s) => s.isActive !== false) || loadedSlots[0];
        const activeCustomer =
          (Array.isArray(loadedCustomers) ? loadedCustomers : [])
            .map(normalizeCustomer)
            .find((customer) => customer.active) ||
          (Array.isArray(loadedCustomers) ? loadedCustomers : []).map(
            normalizeCustomer,
          )[0];

        setFormData((prev) => ({
          ...prev,
          customerId: activeCustomer?.id ?? "",
          service: activeService?._id ?? activeService?.id ?? "",
          pickupSlot: activeSlot?._id ?? activeSlot?.id ?? "",
        }));
      } catch (err) {
        notify.error(
          err?.message || "Unable to load services, slots, or customers.",
        );
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.service || !formData.pickupSlot) {
      notify.error("Please select a service and a pickup slot.");
      return;
    }

    if (!formData.customerId) {
      notify.error("Please select a customer.");
      return;
    }

    if (Number(formData.weight) <= 0) {
      notify.error("Please enter a valid weight (minimum 1 kg).");
      return;
    }

    if (
      !formData.street.trim() ||
      !formData.city.trim() ||
      !formData.pincode.trim()
    ) {
      notify.error(
        "Please fill in all required address fields (Street, City, Pincode).",
      );
      return;
    }

    if (!/^\d{5,6}$/.test(formData.pincode.trim())) {
      notify.error("Please enter a valid 5 or 6 digit pincode.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        userId: formData.customerId,
        paymentMethod: formData.paymentMethod,
        paymentStatus: "success",
        orderItems: [
          {
            service: formData.service,
            weight: Number(formData.weight),
          },
        ],
        pickupAddress: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
        },
        pickupSlotId: formData.pickupSlot,
        expressOrder: formData.expressOrder === "true",
        source: "walk_in",
      };

      const createdOrder = await api.post("/admin/orders/new", payload);

      const orderId =
        createdOrder?.orderId ?? createdOrder?._id ?? createdOrder?.id ?? "";
      notify.success(
        orderId
          ? `Order created successfully (${orderId}).`
          : "Order created successfully.",
      );

      // Clear form except services/slots
      setFormData((prev) => ({
        ...prev,
        customerId: prev.customerId,
        weight: "1",
        paymentMethod: "cash",
        expressOrder: "false",
        street: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
      }));
    } catch (err) {
      notify.error(err?.message || "Failed to create order.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-1 text-sm font-medium text-secondary hover:text-secondary-fixed mb-2"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            Back to Dashboard
          </button>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Create Order
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Manually create a new customer order.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-card rounded-xl overflow-hidden p-6"
      >
        {loadingData ? (
          <div className="space-y-6">
            <Skeleton className="w-48 h-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
            </div>
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-48 h-6 mt-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="w-full h-12 sm:col-span-2" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="w-full h-12" />
                <Skeleton className="w-full h-12" />
              </div>
            </div>
            <div className="pt-6 flex justify-end">
              <Skeleton className="w-32 h-10" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Order Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3">
                <div className="p-2 bg-blue-50 text-primary rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">
                    local_laundry_service
                  </span>
                </div>
                <h3 className="font-semibold text-on-surface text-lg">
                  Order Details
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Customer
                </label>
                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  required
                >
                  <option value="" disabled>
                    Select a customer
                  </option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {c.phone !== "—" ? ` • ${c.phone}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Service
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    required
                  >
                    <option value="" disabled>
                      Select a service
                    </option>
                    {services.map((s) => (
                      <option key={s._id || s.id} value={s._id || s.id}>
                        {s.name || `Service (${s._id || s.id})`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    min="0.1"
                    step="0.1"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  >
                    <option value="cash">Cash</option>
                    <option value="cod">Cash on Delivery</option>
                    <option value="card">Card</option>
                    <option value="wallet">Wallet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Express Order
                  </label>
                  <select
                    name="expressOrder"
                    value={formData.expressOrder}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Pickup Slot
                </label>
                <select
                  name="pickupSlot"
                  value={formData.pickupSlot}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  required
                >
                  <option value="" disabled>
                    Select a slot
                  </option>
                  {slots.map((s) => {
                    const displayTime =
                      s.startTime && s.endTime
                        ? `${s.startTime} - ${s.endTime}`
                        : s.name || `Slot (${s._id || s.id})`;
                    const displayDate = s.date
                      ? ` | ${new Date(s.date).toLocaleDateString()}`
                      : "";
                    return (
                      <option key={s._id || s.id} value={s._id || s.id}>
                        {displayTime}
                        {displayDate}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Right Column: Pickup Address */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">
                    location_on
                  </span>
                </div>
                <h3 className="font-semibold text-on-surface text-lg">
                  Pickup Address
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street"
                    placeholder="e.g. 123 Main St"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Area / Locality
                  </label>
                  <input
                    type="text"
                    name="area"
                    placeholder="e.g. Downtown"
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    placeholder="e.g. Opposite Mall"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="e.g. Mumbai"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      placeholder="e.g. MH"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      placeholder="e.g. 400001"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-end lg:col-span-2 border-t border-outline-variant/30 mt-4">
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="px-5 py-2.5 rounded-lg text-on-surface-variant font-medium hover:bg-black/5 transition-colors mr-3"
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
                    Creating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">
                      add
                    </span>
                    Create Order
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
