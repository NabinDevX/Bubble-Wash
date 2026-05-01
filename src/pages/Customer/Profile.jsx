import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function Profile() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const res = await api.get("/auth/user");
                const data = res?.data?.user ?? res?.data ?? res;

                setUser({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    address: data.address || "",
                });
            } catch (err) {
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    async function handleSave() {
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            await api.put("/users/settings/update", {
                name: user.name,
                phone: user.phone,
                email: user.email,
                address: user.address,
            });

            setSuccess("Profile updated successfully");
            setEditing(false);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Update failed"
            );
        } finally {
            setSaving(false);
        }
    }

    const initials = user.name?.charAt(0)?.toUpperCase() || "U";

    return (
        <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto space-y-6">

            {/* Header */}
            <div>
                <h1 className="font-display-lg text-display-lg text-on-surface">
                    My Profile
                </h1>
                <p className="text-on-surface-variant">
                    Manage your personal information
                </p>
            </div>

            {/* Alerts */}
            {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                    {success}
                </div>
            )}

            {/* Card */}
            <div
                className={`glass-card p-6 rounded-3xl space-y-8 transition-all duration-300 ${loading ? "animate-pulse" : ""
                    } ${editing ? "ring-2 ring-secondary/30" : ""}`}
            >

                {/* PROFILE HEADER */}
                <div className="flex items-center gap-4 border-b border-outline-variant/30 pb-4">
                    <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center text-xl font-semibold text-secondary shadow-inner">
                        {initials}
                    </div>
                    <div>
                        <p className="font-label-lg text-label-lg text-on-surface">
                            {user.name || "User"}
                        </p>
                        <p className="text-sm text-on-surface-variant">
                            {user.phone || "—"}
                        </p>
                    </div>
                </div>

                {/* INPUTS */}
                <div className="grid md:grid-cols-2 gap-4">

                    {/* NAME */}
                    <div>
                        <label className="text-xs text-on-surface-variant uppercase mb-1 block">
                            Name
                        </label>
                        <input
                            value={user.name}
                            disabled={!editing}
                            onChange={(e) =>
                                setUser({ ...user, name: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-t-md bg-surface-container-lowest/50 border-b border-outline-variant focus:border-secondary outline-none backdrop-blur-sm"
                            placeholder="Name"
                        />
                    </div>

                    {/* PHONE */}
                    <div>
                        <label className="text-xs text-on-surface-variant uppercase mb-1 block">
                            Phone
                        </label>
                        <input
                            value={user.phone}
                            disabled={!editing}
                            onChange={(e) =>
                                setUser({ ...user, phone: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-t-md bg-surface-container-lowest/50 border-b border-outline-variant focus:border-secondary outline-none backdrop-blur-sm"
                            placeholder="Phone"
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="col-span-full">
                        <label className="text-xs text-on-surface-variant uppercase mb-1 block">
                            Email
                        </label>
                        <input
                            value={user.email}
                            disabled
                            className="w-full px-4 py-3 rounded-t-md bg-surface-container-low border-dashed border-outline-variant opacity-60 outline-none"
                            placeholder="Email"
                        />
                    </div>
                    {/* Address */}
                    <div className="col-span-full">
                        <label className="text-xs text-on-surface-variant uppercase mb-1 block">
                            Address
                        </label>
                        <input
                            value={user.address}
                            disabled={!editing}
                            onChange={(e) =>
                                setUser({ ...user, address: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-t-md bg-surface-container-lowest/50 border-b border-outline-variant focus:border-secondary outline-none"
                            placeholder="Enter your address"
                        />
                    </div>

                </div>

                {/* ACTIONS */}
                <div className="flex gap-3">
                    {editing ? (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-5 py-2 rounded-lg bg-linear-to-r from-primary-container to-surface-tint text-on-primary font-medium hover:shadow-[0_0_10px_rgba(98,250,227,0.3)] transition disabled:opacity-60"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>

                            <button
                                onClick={() => setEditing(false)}
                                className="px-5 py-2 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-high transition"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setEditing(true)}
                            className="px-5 py-2 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-high transition"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}