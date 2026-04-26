import { useState } from "react";

const paymentMethods = [
  { id: "card", icon: "credit_card", label: "Credit Card" },
  { id: "apple", icon: "phone_iphone", label: "Apple Pay" },
  { id: "upi", icon: "account_balance", label: "UPI" },
];

const orderItems = [
  { icon: "dry_cleaning", title: "Premium Wash & Fold", sub: "Standard 48h Turnaround", price: "$45.00" },
  { icon: "iron", title: "Hand Ironing", sub: "5 Shirts", price: "$15.00" },
];

export default function CheckoutPayment() {
  const [selectedMethod, setSelectedMethod] = useState("card");

  return (
    <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto">
      {/* Header */}
      <header className="mb-stack-lg text-center md:text-left mt-8 md:mt-0">
        <h1 className="font-display-lg text-display-lg text-primary mb-2">Secure Checkout</h1>
        <p className="font-body-lg text-body-lg text-outline">Complete your premium laundry service booking.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Payment Details */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-stack-md">
          <section className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[60px] pointer-events-none"
              style={{ background: "rgba(138, 240, 205, 0.2)" }} />

            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-3 relative z-10">
              <span className="material-symbols-outlined text-white p-2 rounded-full text-sm"
                style={{ background: "linear-gradient(135deg, #0b5a49, #0f8d65)" }}>payment</span>
              Payment Method
            </h2>

            {/* Method Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 relative z-10">
              {paymentMethods.map((method) => (
                <label key={method.id} className="relative cursor-pointer group" onClick={() => setSelectedMethod(method.id)}>
                  <div className={`h-full text-center p-4 rounded-lg flex flex-col items-center gap-2 transition-all duration-300 ${
                    selectedMethod === method.id
                      ? "border-2 border-secondary bg-primary/90 text-white shadow-[0_0_15px_rgba(37,196,143,0.2)]"
                      : "border border-outline-variant bg-white/30 text-on-surface hover:border-secondary/50"
                  }`}>
                    <span className={`material-symbols-outlined ${
                      selectedMethod === method.id ? "text-secondary-container" : "text-on-surface-variant group-hover:text-secondary"
                    } transition-colors`}>{method.icon}</span>
                    <span className="font-label-md text-label-md">{method.label}</span>
                  </div>
                </label>
              ))}
            </div>

            {/* Card Details Form */}
            <div className="space-y-5 relative z-10">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">
                  Cardholder Name
                </label>
                <input
                  className="glass-input w-full rounded-lg px-4 py-3 font-body-md text-body-md"
                  placeholder="John Doe"
                  type="text"
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    className="glass-input w-full rounded-lg pl-12 pr-4 py-3 font-body-md text-body-md"
                    placeholder="0000 0000 0000 0000"
                    type="text"
                  />
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">credit_card</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">
                    Expiry Date
                  </label>
                  <input
                    className="glass-input w-full rounded-lg px-4 py-3 font-body-md text-body-md"
                    placeholder="MM/YY"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">
                    CVC
                  </label>
                  <div className="relative">
                    <input
                      className="glass-input w-full rounded-lg px-4 py-3 font-body-md text-body-md"
                      placeholder="123"
                      type="text"
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline text-sm cursor-help"
                      title="3 digits on back of card">info</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 xl:col-span-4">
          <aside className="glass-card rounded-2xl p-6 md:p-8 sticky top-28">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-6 border-b border-outline-variant/30 pb-4">
              Order Summary
            </h3>
            <div className="space-y-4 mb-8">
              {orderItems.map((item) => (
                <div key={item.title} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(138, 240, 205, 0.2)" }}>
                      <span className="material-symbols-outlined text-secondary text-sm">{item.icon}</span>
                    </div>
                    <div>
                      <p className="font-body-md text-body-md text-on-surface font-medium">{item.title}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{item.sub}</p>
                    </div>
                  </div>
                  <span className="font-body-md text-body-md text-on-surface">{item.price}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-outline-variant/30 pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-on-surface-variant font-body-md text-body-md">
                <span>Subtotal</span><span>$60.00</span>
              </div>
              <div className="flex justify-between text-on-surface-variant font-body-md text-body-md">
                <span>Service Fee</span><span>$4.50</span>
              </div>
              <div className="flex justify-between font-headline-md text-headline-md text-primary mt-4 pt-4 border-t border-outline-variant/30">
                <span>Total</span><span>$64.50</span>
              </div>
            </div>

            <button className="cta-gradient w-full py-4 rounded-lg text-white font-label-md text-label-md tracking-widest uppercase hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">lock</span>
              Pay Securely
            </button>
            <p className="text-center mt-4 font-label-sm text-label-sm text-outline flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[12px]">verified_user</span>
              256-bit Encryption
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
