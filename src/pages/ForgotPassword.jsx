import { useState } from "react";
import api from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMsg("");

    try {
      // ⚠️ Only if backend supports it
      await api.post("/auth/forgot-password", { email });

      setMsg("Reset link sent to your email ✅");
    } catch (err) {
      setError("Something went wrong");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="glass-card p-8 rounded-3xl w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-semibold">Forgot Password</h1>

        {error && <p className="text-red-500">{error}</p>}
        {msg && <p className="text-green-500">{msg}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg border"
          required
        />

        <button className="w-full bg-secondary text-white py-3 rounded-lg">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}