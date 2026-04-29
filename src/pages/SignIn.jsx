import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../lib/AuthContext.jsx";

const USER_TYPES = ["Customer", "Rider", "Admin"];
const REDIRECT_MAP = { customer: "/customer", rider: "/rider", admin: "/admin" };

export default function SignIn() {
  const [userType, setUserType] = useState("Customer");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const passwordIcon = useMemo(
    () => (showPassword ? "visibility_off" : "visibility"),
    [showPassword],
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(phone, password);
      const role = (res.user?.role ?? res.role ?? userType).toLowerCase();
      navigate(REDIRECT_MAP[role] || "/customer", { replace: true });
    } catch (err) {
      setError(err.message || "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-green-gradient font-body-md text-on-background min-h-screen flex flex-col relative">
      <main className="grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-stack-lg">
        <div className="w-full max-w-120 z-10">
          <div className="text-center mb-stack-md">
            <h1 className="font-headline-md text-headline-md tracking-tighter text-primary-container mb-2">
              Bubble Wash
            </h1>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
              Precision Care Platform
            </p>
          </div>

          <div className="glass-panel rounded-xl p-8 md:p-10 inner-glow relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />

            <h2 className="font-headline-sm text-headline-sm text-on-background mb-stack-md text-center">
              Welcome back
            </h2>

            <div className="flex p-1 bg-surface-container-low rounded-lg mb-stack-md gap-1">
              {USER_TYPES.map((label) => {
                const isActive = userType === label;

                return (
                  <button
                    key={label}
                    type="button"
                    className={
                      "flex-1 py-2.5 rounded-md font-label-md text-label-md transition-all duration-300 " +
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
                <span className="material-symbols-outlined text-base">error</span>
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  className="font-label-md text-label-md text-on-surface-variant block ml-1"
                  htmlFor="phone"
                >
                  PHONE NUMBER
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors">
                    person
                  </span>
                  <input
                    id="phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/40 border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 pl-12 pr-4 py-3.5 rounded-t-lg transition-all placeholder:text-outline-variant font-body-md text-body-md"
                    placeholder="Enter your phone number"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label
                    className="font-label-md text-label-md text-on-surface-variant block"
                    htmlFor="password"
                  >
                    PASSWORD
                  </label>
                  <a
                    className="font-label-sm text-label-sm text-secondary hover:underline"
                    href="#"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors">
                    lock
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/40 border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 pl-12 pr-12 py-3.5 rounded-t-lg transition-all placeholder:text-outline-variant font-body-md text-body-md"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <span className="material-symbols-outlined">
                      {passwordIcon}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 px-1">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="remember"
                    type="checkbox"
                    className="sr-only peer"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <div className="w-10 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary" />
                </div>
                <label
                  className="font-label-md text-label-md text-on-surface-variant cursor-pointer"
                  htmlFor="remember"
                >
                  Keep me signed in
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full aqua-gradient text-white font-headline-sm text-headline-sm py-4 rounded-xl shadow-[0_4px_20px_rgba(98,250,227,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Signing In…
                  </>
                ) : (
                  <>
                    Sign In
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                New to Bubble Wash?
                <Link
                  className="text-secondary font-bold hover:underline ml-1"
                  to="/signup"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>


        </div>
      </main>

      <Footer />

      <div className="fixed inset-0 pointer-events-none opacity-15 mix-blend-overlay -z-10">
        <img
          className="w-full h-full object-cover"
          alt="Bubbles background"
          src="/stitch/bubble-wash/auth/bubbles-bg.png"
        />
      </div>

      <div className="fixed top-20 left-[10%] w-64 h-64 bg-secondary-fixed/10 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-20 right-[10%] w-96 h-96 bg-primary-fixed/5 rounded-full blur-[150px] -z-10" />
    </div>
  );
}
