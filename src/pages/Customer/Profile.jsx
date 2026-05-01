import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function Profile() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
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

                console.log("PROFILE DATA:", data);

                setUser({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                });

            } catch (err) {
                console.error(err);
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
            const res = await api.put("/users/settings/update", {
                name: user.name,
                phone: user.phone,
                email: user.email,
            });

            console.log("UPDATE RESPONSE:", res);

            setSuccess("Profile updated successfully");
            setEditing(false);

        } catch (err) {
            console.error("UPDATE ERROR:", err.response?.data || err.message);

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
            <div className={`glass-card p-6 rounded-3xl space-y-6 ${loading ? "animate-pulse" : ""}`}>

                {/* Avatar */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center text-xl font-semibold text-secondary">
                        {initials}
                    </div>
                    <div>
                        <p className="font-label-lg text-label-lg text-on-surface">
                            {user.name || "User"}
                        </p>
                        <p className="text-sm text-on-surface-variant">
                            {user.email || "—"}
                        </p>
                    </div>
                </div>

                {/* Inputs */}
                <div className="grid md:grid-cols-2 gap-4">

                    {/* Name */}
                    <input
                        value={user.name}
                        disabled={!editing}
                        onChange={(e) =>
                            setUser({ ...user, name: e.target.value })
                        }
                        className="p-3 rounded-lg bg-surface border border-outline-variant focus:border-secondary outline-none"
                        placeholder="Name"
                    />

                    {/* Phone */}
                    <input
                        value={user.phone}
                        disabled={!editing}
                        onChange={(e) =>
                            setUser({ ...user, phone: e.target.value })
                        }
                        className="p-3 rounded-lg bg-surface border border-outline-variant focus:border-secondary outline-none"
                        placeholder="Phone"
                    />

                    {/* Email (disabled always) */}
                    <input
                        value={user.email}
                        disabled
                        className="p-3 rounded-lg bg-surface border border-outline-variant opacity-70 col-span-full"
                        placeholder="Email"
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    {editing ? (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-5 py-2 rounded-lg bg-secondary text-white font-medium hover:opacity-90 transition disabled:opacity-60"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>

                            <button
                                onClick={() => setEditing(false)}
                                className="px-5 py-2 rounded-lg border border-outline-variant text-on-surface"
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