import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../lib/AuthContext.jsx";

const USER_TYPES = ["Customer", "Rider"];

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("Customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!terms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signup(name, phone, password, true);
      navigate("/customer", { replace: true });
    } catch (err) {
      setError(err.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-green-gradient min-h-screen flex flex-col relative overflow-hidden">
      <div className="bubble-effect w-100 h-100 -top-20 -left-20" />
      <div className="bubble-effect w-75 h-75 bottom-10 right-10" />
      <div className="bubble-effect w-37.5 h-37.5 top-1/2 left-1/4" />

      <main className="grow flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-135">
          <div className="flex flex-col items-center mb-stack-md">
            <div className="w-16 h-16 bg-white rounded-full glass-card flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-secondary text-4xl">
                bubble_chart
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg text-primary tracking-tighter">
              Bubble Wash
            </h1>
            <p className="font-body-md text-on-surface-variant mt-2">
              Precision engineered laundry care.
            </p>
          </div>

          <div className="glass-card rounded-4xl p-8 md:p-12">
            <div className="mb-stack-md">
              <h2 className="font-headline-md text-headline-md text-on-background mb-2">
                Create Account
              </h2>
              <p className="font-body-md text-on-surface-variant">
                Join the future of fabric care.
              </p>
            </div>

            <div className="flex bg-surface-container-low p-1.5 rounded-xl mb-stack-md gap-1">
              {USER_TYPES.map((label) => {
                const isActive = userType === label;

                return (
                  <button
                    key={label}
                    type="button"
                    className={
                      "flex-1 py-2.5 px-4 rounded-lg font-label-md text-label-md transition-all " +
                      (isActive
                        ? "bg-white shadow-sm text-secondary"
                        : "text-on-surface-variant hover:bg-white/50")
                    }
                    onClick={() => setUserType(label)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base">
                  error
                </span>
                {error}
              </div>
            )}

            <form className="space-y-stack-sm" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface ml-1">
                  Full Name
                </label>
                <input
                  className="w-full glass-input px-4 py-3.5 rounded-xl font-body-md text-on-background placeholder:text-outline"
                  placeholder="Alex Rivers"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface ml-1">
                  Email Address
                </label>
                <input
                  className="w-full glass-input px-4 py-3.5 rounded-xl font-body-md text-on-background placeholder:text-outline"
                  placeholder="alex@wash.com"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface ml-1">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline material-symbols-outlined">
                    call
                  </span>
                  <input
                    className="w-full glass-input pl-12 pr-4 py-3.5 rounded-xl font-body-md text-on-background placeholder:text-outline"
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface ml-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline material-symbols-outlined">
                    lock
                  </span>

                  <input
                    className="w-full glass-input pl-12 pr-12 py-3.5 rounded-xl font-body-md text-on-background placeholder:text-outline"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  {/* Eye icon */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    className="w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary/20 bg-white/50"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                  />
                </div>
                <label
                  className="font-label-sm text-on-surface-variant leading-relaxed"
                  htmlFor="terms"
                >
                  I agree to the{" "}
                  <a
                    className="text-secondary font-bold hover:underline"
                    href="#"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    className="text-secondary font-bold hover:underline"
                    href="#"
                  >
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="cta-gradient w-full py-4 rounded-xl text-white font-label-md text-lg tracking-wide transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">
                        progress_activity
                      </span>
                      Creating Account…
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="font-body-md text-on-surface-variant">
                Already have an account?
                <Link
                  className="text-secondary font-bold hover:underline ml-1"
                  to="/signin"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-10 flex justify-center gap-stack-md">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-body-lg">
                verified_user
              </span>
              <span className="font-label-sm uppercase tracking-widest">
                Secure TLS 1.3
              </span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-body-lg">
                eco
              </span>
              <span className="font-label-sm uppercase tracking-widest">
                Eco Friendly
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <div className="fixed inset-0 pointer-events-none opacity-20 mix-blend-overlay">
        <img
          className="w-full h-full object-cover"
          alt="Bubbles background"
          src="/stitch/bubble-wash/auth/bubbles-bg.png"
        />
      </div>
    </div>
  );
}
