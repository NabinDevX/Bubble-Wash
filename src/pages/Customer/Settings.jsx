import { useState } from "react";
import api, { clearToken } from "../../lib/api.js";

export default function Settings() {
    const [emailNotif, setEmailNotif] = useState(true);
    const [smsNotif, setSmsNotif] = useState(false);
    const [pushNotif, setPushNotif] = useState(true);

    // 🔐 password states
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // ================= PASSWORD =================
    async function handleChangePassword() {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("All fields required");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            api.post("/users/settings/change-password", {
                currentPassword,
                newPassword,
            });

            alert("Password updated successfully");

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            alert(err.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    }

    // ================= NOTIFICATIONS =================
    async function updatePrefs(updated) {
        try {
            await api.put("/users/settings/update", {
                notifications: updated,
            });
        } catch {
            console.log("Preference save failed");
        }
    }

    // ================= DELETE =================
    async function handleDeleteAccount() {
        const confirmDelete = window.confirm(
            "Are you sure? This action cannot be undone."
        );

        if (!confirmDelete) return;

        try {
            api.delete("/users/settings/delete-account")

            clearToken();
            alert("Account deleted");

            window.location.href = "/";
        } catch {
            alert("Failed to delete account");
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">

            {/* ================= SECURITY ================= */}
            <section>
                <h2 className="text-base font-semibold text-gray-800 mb-4">
                    Security & Privacy
                </h2>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">

                    <div className="flex items-center gap-2 text-[#1E7F5A] text-sm font-medium mb-4">
                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#1E7F5A]/10">
                            <span className="material-symbols-outlined text-[16px]">
                                lock
                            </span>
                        </div>
                        Change Password
                    </div>

                    <div className="space-y-3">
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50"
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50"
                            />
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50"
                            />
                        </div>

                        <button
                            onClick={handleChangePassword}
                            disabled={loading}
                            className="cta-gradient text-white text-sm px-4 py-2 rounded-md shadow-sm mt-2"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </div>
            </section>

            {/* ================= NOTIFICATIONS ================= */}
            <section>
                <h2 className="text-base font-semibold text-gray-800 mb-4">
                    Notification Preferences
                </h2>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-5">

                    {/* EMAIL */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-3 items-start">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1E7F5A]/10">
                                <span className="material-symbols-outlined text-[18px] text-[#1E7F5A]">
                                    mail
                                </span>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-800">
                                    Email Notifications
                                </p>
                                <p className="text-xs text-gray-500">
                                    Receive service updates and billing reports via email.
                                </p>
                            </div>
                        </div>

                        <Toggle
                            state={emailNotif}
                            set={(val) => {
                                setEmailNotif(val);
                                updatePrefs({ email: val, sms: smsNotif, push: pushNotif });
                            }}
                        />
                    </div>

                    {/* SMS */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-3 items-start">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1E7F5A]/10">
                                <span className="material-symbols-outlined text-[18px] text-[#1E7F5A]">
                                    sms
                                </span>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-800">
                                    SMS Updates
                                </p>
                                <p className="text-xs text-gray-500">
                                    Real-time alerts for pickup and delivery schedules.
                                </p>
                            </div>
                        </div>

                        <Toggle
                            state={smsNotif}
                            set={(val) => {
                                setSmsNotif(val);
                                updatePrefs({ email: emailNotif, sms: val, push: pushNotif });
                            }}
                        />
                    </div>

                    {/* PUSH */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-3 items-start">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1E7F5A]/10">
                                <span className="material-symbols-outlined text-[18px] text-[#1E7F5A]">
                                    notifications
                                </span>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-800">
                                    Push Notifications
                                </p>
                                <p className="text-xs text-gray-500">
                                    Mobile app alerts for all active service requests.
                                </p>
                            </div>
                        </div>

                        <Toggle
                            state={pushNotif}
                            set={(val) => {
                                setPushNotif(val);
                                updatePrefs({ email: emailNotif, sms: smsNotif, push: val });
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* ================= DANGER ================= */}
            <section>
                <h2 className="text-base font-semibold text-red-600 mb-3">
                    ⚠ Danger Zone
                </h2>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-red-200 flex justify-between items-center">

                    <div>
                        <p className="text-sm font-medium text-gray-800">
                            Delete Account
                        </p>
                        <p className="text-xs text-gray-500 max-w-sm">
                            Once you delete your account, there is no going back.
                        </p>
                    </div>

                    <button
                        onClick={handleDeleteAccount}
                        className="bg-red-600 text-white text-sm px-4 py-2 rounded-md shadow hover:bg-red-700"
                    >
                        Delete Account
                    </button>
                </div>
            </section>
        </div>
    );
}

/* TOGGLE */
function Toggle({ state, set }) {
    return (
        <div
            onClick={() => set(!state)}
            className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition ${state ? "bg-[#1E7F5A]" : "bg-gray-300"
                }`}
        >
            <div
                className={`bg-white w-4 h-4 rounded-full shadow transform transition ${state ? "translate-x-5" : ""
                    }`}
            />
        </div>
    );
}