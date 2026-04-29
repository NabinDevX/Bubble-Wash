import { useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import api from "../../lib/api.js";

const paymentMethods = [
  { id: "card", icon: "credit_card", label: "Credit Card" },
  { id: "apple", icon: "phone_iphone", label: "Apple Pay" },
  { id: "upi", icon: "account_balance", label: "UPI" },
];

export default function CheckoutPayment() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [method, setMethod] = useState("card");
  const [coupon, setCoupon] = useState("");
  const [couponResult, setCouponResult] = useState(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const orderId =
    location.state?.orderId ||
    searchParams.get("orderId") ||
    searchParams.get("id") ||
    null;

  const paymentMethod = useMemo(() => {
    // Backend expects e.g. 'razorpay', 'upi', 'cod'
    if (method === "upi") return "upi";
    // Treat card/apple as gateway payments
    return "razorpay";
  }, [method]);

  async function handleValidateCoupon() {
    if (!coupon.trim()) return;
    try {
      const res = await api.post("/coupons/validate", { code: coupon });
      setCouponResult({
        valid: true,
        discount: res.discount ?? res.discountPercent ?? 0,
        message: res.message ?? "Coupon applied!",
      });
    } catch (err) {
      setCouponResult({
        valid: false,
        message: err.message || "Invalid coupon",
      });
    }
  }

  async function handlePay() {
    setError("");
    setPaying(true);
    try {
      if (!orderId) {
        throw new Error("Missing orderId. Please create an order first.");
      }

      const res = await api.post("/payments/initiate", {
        orderId,
        paymentMethod,
      });
      if (res.paymentUrl || res.gatewayUrl) {
        window.location.href = res.paymentUrl ?? res.gatewayUrl;
      } else {
        // If the backend supports instant confirmation (e.g. COD), it may return a paymentId.
        if (res.paymentId) {
          await api.get(`/payments/${res.paymentId}`);
        }
        alert("Payment initiated successfully.");
      }
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="space-y-6 px-4 md:px-8 py-6 max-w-6xl mx-auto">
      <header className="text-center md:text-left">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-2">
          Secure Checkout
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Complete your premium laundry service booking.
        </p>
      </header>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>{" "}
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 xl:col-span-8">
          <section className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary-container/20 rounded-full blur-[60px] pointer-events-none" />
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-3 relative z-10">
              <span className="material-symbols-outlined text-secondary-container bg-primary-container p-2 rounded-full text-sm">
                payment
              </span>
              Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 relative z-10">
              {paymentMethods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`p-4 rounded-lg flex flex-col items-center gap-2 text-center transition-all ${method === m.id ? "border border-secondary-container/50 bg-primary-container text-on-primary shadow-[0_0_15px_rgba(98,250,227,0.15)] ring-1 ring-secondary-container" : "border border-outline-variant bg-surface-container-lowest text-on-surface hover:border-secondary-container/50"}`}
                >
                  <span
                    className={`material-symbols-outlined ${method === m.id ? "text-secondary-container" : "text-on-surface-variant"}`}
                  >
                    {m.icon}
                  </span>
                  <span className="font-label-md text-label-md">{m.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-5 relative z-10">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">
                  Cardholder Name
                </label>
                <input
                  className="w-full bg-surface-container-lowest/50 border-b border-outline-variant focus:border-secondary-container focus:ring-0 px-4 py-3 text-on-surface placeholder:text-outline transition-all rounded-t-md outline-none backdrop-blur-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest/50 border-b border-outline-variant focus:border-secondary-container focus:ring-0 pl-12 pr-4 py-3 text-on-surface placeholder:text-outline transition-all rounded-t-md outline-none backdrop-blur-sm"
                    placeholder="0000 0000 0000 0000"
                  />
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                    credit_card
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">
                    Expiry Date
                  </label>
                  <input
                    className="w-full bg-surface-container-lowest/50 border-b border-outline-variant focus:border-secondary-container focus:ring-0 px-4 py-3 text-on-surface placeholder:text-outline transition-all rounded-t-md outline-none backdrop-blur-sm"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">
                    CVC
                  </label>
                  <input
                    className="w-full bg-surface-container-lowest/50 border-b border-outline-variant focus:border-secondary-container focus:ring-0 px-4 py-3 text-on-surface placeholder:text-outline transition-all rounded-t-md outline-none backdrop-blur-sm"
                    placeholder="123"
                  />
                </div>
              </div>

              {/* Coupon */}
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-surface-container-lowest/50 border-b border-outline-variant focus:border-secondary-container focus:ring-0 px-4 py-3 text-on-surface placeholder:text-outline transition-all rounded-t-md outline-none"
                    placeholder="Enter code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <button
                    onClick={handleValidateCoupon}
                    className="px-4 py-2 bg-secondary/20 text-secondary rounded-lg text-sm font-semibold hover:bg-secondary/30 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponResult && (
                  <p
                    className={`mt-2 text-sm ${couponResult.valid ? "text-secondary" : "text-red-600"}`}
                  >
                    {couponResult.message}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <aside className="glass-card rounded-3xl p-6 md:p-8 sticky top-32">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-6 border-b border-outline-variant/30 pb-4">
              Order Summary
            </h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-on-surface">Services</span>
                <span className="text-on-surface">—</span>
              </div>
            </div>
            <div className="border-t border-outline-variant/30 pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span>—</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Service Fee</span>
                <span>—</span>
              </div>
              {couponResult?.valid && (
                <div className="flex justify-between text-secondary">
                  <span>Discount</span>
                  <span>-{couponResult.discount}%</span>
                </div>
              )}
              <div className="flex justify-between font-headline-md text-headline-md text-on-surface mt-4 pt-4 border-t border-outline-variant/30">
                <span>Total</span>
                <span>—</span>
              </div>
            </div>
            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full py-4 rounded-lg bg-linear-to-r from-primary-container to-surface-tint text-on-primary font-label-md text-label-md tracking-widest uppercase hover:shadow-[0_0_20px_rgba(98,250,227,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-sm">lock</span>
              {paying ? "Processing…" : "Pay Securely"}
            </button>
            <p className="text-center mt-4 font-label-sm text-label-sm text-outline flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-xs">
                verified_user
              </span>
              256-bit Encryption
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
