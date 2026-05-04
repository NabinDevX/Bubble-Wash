import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../../components/Skeleton.jsx";
import api from "../../lib/api.js";

export default function CreateOrder() {
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);

  const [formData, setFormData] = useState({
    service: "",
    weight: "1",
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
        const [servicesRes, slotsRes] = await Promise.allSettled([
          api.get("/services"),
          api.get("/slots"),
        ]);

        let loadedServices = [];
        let loadedSlots = [];

        if (servicesRes.status === "fulfilled") {
          loadedServices = servicesRes.value?.services ?? servicesRes.value ?? [];
          setServices(Array.isArray(loadedServices) ? loadedServices : []);
        }

        if (slotsRes.status === "fulfilled") {
          loadedSlots = slotsRes.value?.slots ?? slotsRes.value ?? [];
          setSlots(Array.isArray(loadedSlots) ? loadedSlots : []);
        }

        const activeService = loadedServices.find(s => s.isActive !== false) || loadedServices[0];
        const activeSlot = loadedSlots.find(s => s.isActive !== false) || loadedSlots[0];

        setFormData(prev => ({
          ...prev,
          service: activeService?._id ?? activeService?.id ?? "",
          pickupSlot: activeSlot?._id ?? activeSlot?.id ?? "",
        }));

      } catch (err) {
        setError(err?.message || "Unable to load services or slots.");
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.service || !formData.pickupSlot) {
      setError("Please select a service and a pickup slot.");
      return;
    }

    if (Number(formData.weight) <= 0) {
      setError("Please enter a valid weight (minimum 1 kg).");
      return;
    }

    if (!formData.street.trim() || !formData.area.trim() || !formData.city.trim() || !formData.state.trim() || !formData.pincode.trim()) {
      setError("Please fill in all required address fields (Street, Area, City, State, Pincode).");
      return;
    }

    if (!/^\d{5,6}$/.test(formData.pincode.trim())) {
      setError("Please enter a valid 5 or 6 digit pincode.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        orderItems: [
          {
            service: formData.service,
            weight: Number(formData.weight),
          },
        ],
        pickupAddress: {
          street: formData.street.trim(),
          area: formData.area.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          landmark: formData.landmark.trim(),
        },
        pickupSlot: formData.pickupSlot,
      };

      let createdOrder = null;
      const endpoints = ["/admin/orders/new", "/orders/new", "/orders"];

      for (const endpoint of endpoints) {
        try {
          createdOrder = await api.post(endpoint, payload);
          break;
        } catch (requestError) {
          if (endpoint === endpoints[endpoints.length - 1]) {
            throw requestError;
          }
        }
      }

      const orderId = createdOrder?.orderId ?? createdOrder?._id ?? createdOrder?.id ?? "";
      setSuccess(
        orderId
          ? `Order created successfully (${orderId}).`
          : "Order created successfully."
      );
      
      // Clear form except services/slots
      setFormData(prev => ({
        ...prev,
        weight: "1",
        street: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
      }));

    } catch (err) {
      setError(err?.message || "Failed to create order.");
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
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
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

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
          <span className="material-symbols-outlined">error</span>
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-2">
          <span className="material-symbols-outlined">check_circle</span>
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card rounded-xl overflow-hidden p-6">
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
                  <span className="material-symbols-outlined text-[20px]">local_laundry_service</span>
                </div>
                <h3 className="font-semibold text-on-surface text-lg">
                  Order Details
                </h3>
              </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Service</label>
                <select 
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  required
                >
                  <option value="" disabled>Select a service</option>
                  {services.map(s => (
                    <option key={s._id || s.id} value={s._id || s.id}>
                      {s.name || `Service (${s._id || s.id})`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Weight (kg)</label>
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

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Pickup Slot</label>
              <select 
                name="pickupSlot"
                value={formData.pickupSlot}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                required
              >
                <option value="" disabled>Select a slot</option>
                {slots.map(s => {
                  const displayTime = s.startTime && s.endTime ? `${s.startTime} - ${s.endTime}` : (s.name || `Slot (${s._id || s.id})`);
                  const displayDate = s.date ? ` | ${new Date(s.date).toLocaleDateString()}` : "";
                  return (
                    <option key={s._id || s.id} value={s._id || s.id}>
                      {displayTime}{displayDate}
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
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                </div>
                <h3 className="font-semibold text-on-surface text-lg">
                  Pickup Address
                </h3>
              </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-on-surface mb-1">Street Address</label>
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
                <label className="block text-sm font-medium text-on-surface mb-1">Area / Locality</label>
                <input 
                  type="text"
                  name="area"
                  placeholder="e.g. Downtown"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Landmark</label>
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
                <label className="block text-sm font-medium text-on-surface mb-1">City</label>
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
                  <label className="block text-sm font-medium text-on-surface mb-1">State</label>
                  <input 
                    type="text"
                    name="state"
                    placeholder="e.g. MH"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Pincode</label>
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
                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                    Creating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">add</span>
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
