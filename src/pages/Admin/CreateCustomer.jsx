import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../lib/api.js";

function onlyDigits(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function isValidPhone(value) {
  const digits = onlyDigits(value);
  return digits.length >= 10 && digits.length <= 15;
}

export default function CreateCustomer() {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    street: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  const cleanedPhone = useMemo(
    () => onlyDigits(formData.phone),
    [formData.phone],
  );

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Please enter the customer's name.");
      return;
    }

    if (!isValidPhone(formData.phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!formData.password) {
      setError("Please set a password for the customer.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (
      formData.pincode &&
      !/^\d{5,6}$/.test(String(formData.pincode).trim())
    ) {
      setError("Please enter a valid 5 or 6 digit pincode.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        phone: cleanedPhone,
        password: formData.password,
        email: formData.email.trim() || undefined,
        street: formData.street.trim() || undefined,
        area: formData.area.trim() || undefined,
        city: formData.city.trim() || undefined,
        state: formData.state.trim() || undefined,
        pincode: formData.pincode.trim() || undefined,
        landmark: formData.landmark.trim() || undefined,
      };

      const endpoints = [
        "/admin/users",
        "/admin/users/new",
        "/admin/users/create",
      ];
      let res = null;

      for (const endpoint of endpoints) {
        try {
          res = await api.post(endpoint, payload);
          break;
        } catch (requestError) {
          if (endpoint === endpoints[endpoints.length - 1]) {
            throw requestError;
          }
        }
      }

      const createdId =
        res?.user?._id ?? res?.user?.id ?? res?._id ?? res?.id ?? "";

      setSuccess(
        createdId
          ? `Customer created successfully (${createdId}).`
          : "Customer created successfully.",
      );

      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        street: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
      });

      // Go back to directory after a successful creation.
      setTimeout(() => navigate("/admin/customers"), 500);
    } catch (err) {
      setError(err?.message || "Failed to create customer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/admin/customers")}
            className="flex items-center gap-1 text-sm font-medium text-secondary hover:text-secondary-fixed mb-2"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            Back to Customers
          </button>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            New Customer
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Create a new customer profile from the admin panel.
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

      <form
        onSubmit={handleSubmit}
        className="glass-card rounded-xl overflow-hidden p-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3">
              <div className="p-2 bg-blue-50 text-primary rounded-lg">
                <span className="material-symbols-outlined text-[20px]">
                  person
                </span>
              </div>
              <h3 className="font-semibold text-on-surface text-lg">Account</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  required
                />
                <p className="text-xs text-on-surface-variant mt-1">
                  Stored as digits only.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. user@email.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <span className="material-symbols-outlined text-[20px]">
                  location_on
                </span>
              </div>
              <h3 className="font-semibold text-on-surface text-lg">
                Address (optional)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Street
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="e.g. 123 Main St"
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Area
                </label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="e.g. Downtown"
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
                  value={formData.landmark}
                  onChange={handleChange}
                  placeholder="e.g. Near mall"
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
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai"
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Maharashtra"
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
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 400001"
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/customers")}
            className="px-4 py-2 rounded-lg border border-outline-variant bg-white/60 text-on-surface text-sm font-medium hover:bg-white/80 transition-colors"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-base">
              person_add
            </span>
            {submitting ? "Creating…" : "Create Customer"}
          </button>
        </div>
      </form>
    </div>
  );
}
