import { useState } from "react";
import api from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setMsg("Reset link sent to your email ✅");
    } catch (err) {
      setError(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 app-green-gradient">
      <form
        onSubmit={handleSubmit}
        className="glass-card p-8 md:p-10 rounded-3xl w-full max-w-md space-y-6 relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Title */}
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Forgot Password
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Enter your email to receive a reset link
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {msg && (
          <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
            {msg}
          </div>
        )}

        {/* Input */}
        <div>
          <label className="block text-xs uppercase text-on-surface-variant mb-1">
            Email Address
          </label>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
              mail
            </span>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-t-md bg-surface-container-lowest/50 border-b border-outline-variant focus:border-secondary outline-none backdrop-blur-sm"
              required
            />
          </div>
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="w-full aqua-gradient text-white font-headline-sm py-3 rounded-lg hover:scale-[1.02] active:scale-95 transition-all"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* Back link */}
        <p className="text-sm text-center text-on-surface-variant">
          Remember your password?{" "}
          <a href="/signin" className="text-secondary hover:underline">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
}
