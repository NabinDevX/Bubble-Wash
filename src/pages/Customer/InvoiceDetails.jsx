const serviceItems = [
  {
    title: "Premium Dry Cleaning",
    sub: "Men's Dress Shirts (x5)",
    price: "$45.00",
  },
  {
    title: "Delicate Care",
    sub: "Silk Evening Gown (x1)",
    price: "$32.50",
  },
];

const addons = [
  { title: "Stain Removal Treatment", sub: "Targeted enzyme pre-wash", price: "$12.00" },
  { title: "Eco-Friendly Detergent", sub: "Plant-based, hypoallergenic", price: "$5.00" },
];

export default function InvoiceDetails() {
  return (
    <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto relative z-10">
      {/* Header */}
      <div className="mb-stack-lg text-center mt-8 md:mt-0">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-stack-sm">Invoice Details</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Review your final charges before processing payment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Invoice Breakdown */}
        <div className="lg:col-span-8 space-y-stack-md">
          {/* Service Items */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-outline-variant/30 pb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ background: "linear-gradient(135deg, #0f8d65, #25c48f)" }}>
                <span className="material-symbols-outlined">local_laundry_service</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Service Items</h2>
            </div>
            <div className="space-y-4">
              {serviceItems.map((item) => (
                <div key={item.title} className="flex justify-between items-start group">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                      style={{ background: "rgba(138, 240, 205, 0.15)" }}>
                      <span className="material-symbols-outlined text-secondary text-2xl">checkroom</span>
                    </div>
                    <div>
                      <h3 className="font-label-md text-label-md text-on-surface mb-1">{item.title}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant text-sm">{item.sub}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-md text-label-md text-on-surface">{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add-ons & Care */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-outline-variant/30 pb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ background: "linear-gradient(135deg, #25c48f, #8af0cd)" }}>
                <span className="material-symbols-outlined">flare</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Add-ons & Care</h2>
            </div>
            <div className="space-y-4">
              {addons.map((addon) => (
                <div key={addon.title} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface">{addon.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm">{addon.sub}</p>
                  </div>
                  <span className="font-label-md text-label-md text-on-surface">{addon.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary & Payment */}
        <div className="lg:col-span-4">
          <div className="glass-card rounded-2xl p-6 sticky top-28">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">Summary</h2>
            <div className="space-y-3 mb-6 border-b border-outline-variant/30 pb-6">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="font-label-md text-label-md text-on-surface">$94.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Service Fee (5%)</span>
                <span className="font-label-md text-label-md text-on-surface">$4.73</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Estimated Tax</span>
                <span className="font-label-md text-label-md text-on-surface">$8.18</span>
              </div>
            </div>
            <div className="flex justify-between items-end mb-8">
              <span className="font-headline-sm text-headline-sm text-on-surface">Total</span>
              <span className="font-display-lg text-display-lg text-secondary">$107.41</span>
            </div>
            <button className="cta-gradient w-full text-white font-label-md text-label-md py-4 rounded-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
              Proceed to Payment
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
            <p className="text-center mt-4 text-xs text-on-surface-variant flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              Secure transaction encrypted via TLS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
