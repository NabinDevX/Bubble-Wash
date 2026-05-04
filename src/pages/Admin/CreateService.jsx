import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api.js";

export default function CreateService() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    pricePerKg: "",
    estimatedDeliveryDays: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        pricePerKg: Number(formData.pricePerKg),
        estimatedDeliveryDays: Number(formData.estimatedDeliveryDays),
      };

      await api.post("/admin/services", payload);
      navigate("/admin/services-rate-card");
    } catch (err) {
      setError(err.message || "Failed to create service");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
          <button
            onClick={() => navigate("/admin/services-rate-card")}
            className="p-1 rounded-full hover:bg-black/5 transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              arrow_back
            </span>
          </button>
          Create New Service
        </h1>
        <p className="text-on-surface-variant text-sm mt-1 ml-10">
          Add a new service category and pricing details.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6 sm:p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm flex items-start gap-2">
            <span className="material-symbols-outlined text-red-500">
              error
            </span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-on-surface">
                Service Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Wash & Fold"
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-on-surface">
                Category *
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="">Select a category</option>
                <option value="wash">Wash</option>
                <option value="dry_clean">Dry Clean</option>
                <option value="iron">Ironing</option>
                <option value="premium">Premium / Specialty</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-on-surface">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide details about what this service includes..."
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-on-surface">
                Price (per kg) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">
                  $
                </span>
                <input
                  type="number"
                  name="pricePerKg"
                  required
                  min="0"
                  step="0.01"
                  value={formData.pricePerKg}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-outline-variant bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-on-surface">
                Estimated Delivery (Days) *
              </label>
              <input
                type="number"
                name="estimatedDeliveryDays"
                required
                min="1"
                value={formData.estimatedDeliveryDays}
                onChange={handleChange}
                placeholder="e.g. 2"
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/services-rate-card")}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-black/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-xl">save</span>
              )}
              {loading ? "Creating..." : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
