const serviceItems = [
  { name: "Premium Dry Cleaning", detail: "Men's Dress Shirts (x5)", price: "$45.00", icon: "dry_cleaning" },
  { name: "Delicate Care", detail: "Silk Evening Gown (x1)", price: "$32.50", icon: "checkroom" },
];

const addons = [
  { name: "Stain Removal Treatment", detail: "Targeted enzyme pre-wash", price: "$12.00" },
  { name: "Eco-Friendly Detergent", detail: "Plant-based, hypoallergenic", price: "$5.00" },
];

export default function InvoiceDetails() {
  return (
    <div className="space-y-6 px-4 md:px-8 py-6 max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-2">Invoice Details</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">Review your final charges before processing payment.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Breakdown */}
        <div className="lg:col-span-8 space-y-6">
          {/* Service Items */}
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
              <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary">local_laundry_service</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Service Items</h2>
            </div>
            <div className="space-y-4">
              {serviceItems.map((item) => (
                <div key={item.name} className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-on-surface-variant">{item.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-label-md text-label-md text-on-surface mb-1">{item.name}</h3>
                      <p className="text-sm text-on-surface-variant">{item.detail}</p>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md text-on-surface">{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
              <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary">flare</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Add-ons & Care</h2>
            </div>
            <div className="space-y-4">
              {addons.map((item) => (
                <div key={item.name} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface">{item.name}</h3>
                    <p className="text-sm text-on-surface-variant">{item.detail}</p>
                  </div>
                  <span className="font-label-md text-label-md text-on-surface">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-4">
          <div className="glass-card rounded-3xl p-6 sticky top-30">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">Summary</h2>
            <div className="space-y-3 mb-6 border-b border-outline-variant pb-6">
              <div className="flex justify-between"><span className="text-on-surface-variant">Subtotal</span><span className="font-label-md text-label-md text-on-surface">$94.50</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">Service Fee (5%)</span><span className="font-label-md text-label-md text-on-surface">$4.73</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">Estimated Tax</span><span className="font-label-md text-label-md text-on-surface">$8.18</span></div>
            </div>
            <div className="flex justify-between items-end mb-8">
              <span className="font-headline-sm text-headline-sm text-on-surface">Total</span>
              <span className="font-display-lg text-display-lg text-secondary">$107.41</span>
            </div>
            <button className="w-full bg-linear-to-r from-secondary to-secondary-container text-on-secondary font-label-md text-label-md py-4 rounded-xl hover:shadow-[0_0_20px_rgba(0,107,95,0.3)] transition-all duration-300 active:scale-95 flex items-center justify-center gap-2">
              Proceed to Payment
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
            <p className="text-center mt-4 text-xs text-on-surface-variant flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">lock</span>
              Secure transaction encrypted via TLS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
