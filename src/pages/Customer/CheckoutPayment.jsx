import { useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import api from "../../lib/api.js";

export default function CheckoutPayment() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [method, setMethod] = useState("razorpay");
  const [useWallet, setUseWallet] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const orderId =
    location.state?.orderId ||
    searchParams.get("orderId") ||
    null;

  const orderItems = location.state?.orderItems || [];
  const subtotal = location.state?.subtotal || 0;

  const deliveryCharge =
    location.state?.deliveryType === "express" ? 49 : 0;

  const serviceTax = Math.round(subtotal * 0.08); // approx like UI
  const total = subtotal + deliveryCharge + serviceTax;

  const walletBalance = 142.5;
  const walletUsed = useWallet ? Math.min(walletBalance, total) : 0;
  const finalPayable = total - walletUsed;

  const paymentMethod = useMemo(() => {
    if (method === "cod") return "cod";
    return "razorpay";
  }, [method]);

  async function handlePay() {
    setError("");
    setPaying(true);

    try {
      const response = await api.post("/payments/initiate", {
        orderId,
        paymentMethod,
      });

      const res = response?.data ?? response;

      if (res?.paymentUrl) {
        window.location.href = res.paymentUrl;
      } else {
        window.location.href = `/customer/feedback?orderId=${orderId}`;
      }

    } catch (err) {
      setError("Payment failed");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f7f6] px-4 md:px-10 py-10">

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-7 space-y-6">

          <div>
            <h1 className="text-3xl font-bold">Select Payment Method</h1>
            <p className="text-gray-500">
              Choose your preferred way to pay
            </p>
          </div>

          {/* WALLET */}
          <div className="bg-white p-5 rounded-xl flex justify-between items-center border">
            <div className="flex gap-3 items-center">
              <span className="material-symbols-outlined text-[#1E7F5A]">
                account_balance_wallet
              </span>
              <div>
                <h3 className="font-semibold">Bubble Wallet</h3>
                <p className="text-sm text-gray-500">
                  Available Balance: ₹{walletBalance}
                </p>
              </div>
            </div>

            {/* TOGGLE */}
            <div
              onClick={() => setUseWallet(!useWallet)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${useWallet ? "bg-[#1E7F5A]" : "bg-gray-300"
                }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow transform ${useWallet ? "translate-x-6" : ""
                  }`}
              />
            </div>
          </div>

          {/* RAZORPAY */}
          <div
            onClick={() => setMethod("razorpay")}
            className={`p-5 rounded-xl border flex justify-between items-center cursor-pointer ${method === "razorpay"
              ? "border-[#1E7F5A] bg-[#1E7F5A]/10"
              : "bg-white"
              }`}
          >
            <div className="flex gap-3 items-center">
              <span className="material-symbols-outlined text-[#1E7F5A]">
                security
              </span>
              <div>
                <h3 className="font-semibold">Razorpay Secure</h3>
                <p className="text-sm text-gray-500">
                  Cards, UPI, Netbanking & Wallets
                </p>
              </div>
            </div>

            <span className="text-xs bg-[#1E7F5A] text-white px-2 py-1 rounded">
              PRIMARY
            </span>
          </div>

          {/* COD */}
          <div
            onClick={() => setMethod("cod")}
            className={`p-5 rounded-xl border flex justify-between items-center cursor-pointer ${method === "cod"
              ? "border-[#1E7F5A] bg-[#1E7F5A]/10"
              : "bg-white"
              }`}
          >
            <div className="flex gap-3 items-center">
              <span className="material-symbols-outlined text-[#1E7F5A]">
                payments
              </span>
              <div>
                <h3 className="font-semibold">Cash on Delivery</h3>
                <p className="text-sm text-gray-500">
                  Pay at your doorstep after service
                </p>
              </div>
            </div>
          </div>

          {/* FEATURES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">

            {/* Guaranteed Care */}
            <div className="bg-gradient-to-br from-white to-gray-50 p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start">

              <div className="w-10 h-10 rounded-full bg-[#1E7F5A]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#1E7F5A] text-lg">
                  verified_user
                </span>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">
                  Guaranteed Care
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">
                  Our 100% satisfaction guarantee ensures your clothes are handled with precision or we re-wash for free.
                </p>
              </div>
            </div>

            {/* Express Processing */}
            <div className="bg-gradient-to-br from-white to-gray-50 p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start">

              <div className="w-10 h-10 rounded-full bg-[#1E7F5A]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#1E7F5A] text-lg">
                  bolt
                </span>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">
                  Express Processing
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">
                  Payments are cleared instantly to prioritize your order in our premium automated cleaning queue.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-5 space-y-6">

          <div className="bg-[#f8fafc] p-6 rounded-3xl shadow-xl border border-gray-100 space-y-5">

            {/* TITLE */}
            <h3 className="text-lg font-semibold text-gray-800">
              Order Summary
            </h3>

            {/* ITEMS */}
            <div className="space-y-4 text-sm">

              {orderItems.map((item, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">
                      {item.name} (x{item.quantity})
                    </p>
                    <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                      ECO-FRIENDLY DETERGENT
                    </p>
                  </div>

                  <span className="text-gray-800 font-medium">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}

              {/* DELIVERY */}
              <div className="flex justify-between text-gray-600">
                <span>Express Delivery</span>
                <span>₹{deliveryCharge}</span>
              </div>

              {/* TAX */}
              <div className="flex justify-between text-gray-600">
                <span>Service Tax</span>
                <span>₹{serviceTax}</span>
              </div>

            </div>

            {/* DIVIDER */}
            <div className="border-t border-gray-200"></div>

            {/* SUBTOTAL */}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>

            {/* WALLET */}
            {useWallet && (
              <div className="flex justify-between text-sm text-[#1E7F5A] font-medium">
                <span className="flex items-center gap-1">
                  Wallet Credit
                  <span className="text-xs">ⓘ</span>
                </span>
                <span>-₹{walletUsed}</span>
              </div>
            )}

            {/* TOTAL CARD (IMPORTANT) */}
            <div className="bg-[#0b1324] text-white px-5 py-4 rounded-2xl flex justify-between items-center shadow-lg">
              <span className="text-sm font-medium">Total Payable</span>
              <span className="text-lg font-semibold text-white">
                ₹{finalPayable}
              </span>
            </div>

            {/* BUTTON (ONLY GREEN CHANGE) */}
            <button
              onClick={handlePay}
              className="w-full py-3 rounded-xl text-white font-medium 
  bg-[#1E7F5A]
  shadow-md hover:bg-[#166a4a] hover:shadow-lg 
  hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Complete Payment →
            </button>

            {/* FOOTER */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">

              <span className="material-symbols-outlined text-[#1E7F5A] text-sm">
                lock
              </span>

              <span>SSL SECURE • RAZORPAY</span>

            </div>

          </div>

          {/* IMAGE CARD */}
          <div className="relative rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.15)]">

            {/* IMAGE */}
            <img
              src="https://plus.unsplash.com/premium_photo-1764094353320-7ce84985fb8f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Laundry"
              className="w-full h-48 object-cover object-center"
            />

            {/* SMOOTH OVERLAY */}
            <div className="absolute inset-0 
    bg-gradient-to-t 
    from-black/90 
    via-black/40 
    to-transparent">
            </div>

            {/* TEXT WITH GLOW */}
            <div className="absolute bottom-4 left-5 right-5 
    text-white text-sm font-semibold 
    drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">

              Trust Lumina for your most delicate fabrics.

            </div>

          </div>


        </div>

      </div>
    </div>
  );
}