import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";

const USER_TYPES = ["Customer", "Rider"];

export default function SignUp() {
  const [userType, setUserType] = useState("Customer");

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

            <form
              className="space-y-stack-sm"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface ml-1">
                  Full Name
                </label>
                <input
                  className="w-full glass-input px-4 py-3.5 rounded-xl font-body-md text-on-background placeholder:text-outline"
                  placeholder="Alex Rivers"
                  type="text"
                  autoComplete="name"
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
                    className="w-full glass-input pl-12 pr-4 py-3.5 rounded-xl font-body-md text-on-background placeholder:text-outline"
                    placeholder="••••••••"
                    type="password"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    className="w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary/20 bg-white/50"
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
                  className="cta-gradient w-full py-4 rounded-xl text-white font-label-md text-lg tracking-wide transition-all active:scale-[0.98]"
                >
                  Create Account
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
