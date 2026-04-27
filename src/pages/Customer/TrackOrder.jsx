const steps = [
  { label: "Pickup Complete", desc: "Items collected from your location.", icon: "check", done: true },
  { label: "Processing", desc: "Garments inspected and cleaned.", icon: "check", done: true },
  { label: "Out for Delivery", desc: "Driver is en route to your location.", icon: "local_shipping", done: false, active: true },
];

export default function TrackOrder() {
  return (
    <div className="space-y-6 px-4 md:px-8 py-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-200px)]">
        {/* Map */}
        <div className="flex-1 glass-card rounded-3xl overflow-hidden relative min-h-100 md:min-h-0">
          {/* Map placeholder */}
          <div className="absolute inset-0 bg-linear-to-br from-surface-container-low to-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-8xl text-outline-variant/30">map</span>
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-surface/80 via-transparent to-surface/30" />

          {/* Vehicle marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
            <div className="bg-secondary-container text-on-secondary-container p-3 rounded-full shadow-lg mb-2 relative animate-pulse">
              <span className="material-symbols-outlined">local_shipping</span>
              <div className="absolute inset-0 border-2 border-secondary-container rounded-full animate-ping opacity-50" />
            </div>
            <div className="bg-surface px-4 py-2 rounded-full shadow-md text-label-sm font-label-sm text-on-surface whitespace-nowrap">
              Arriving in 12 min
            </div>
          </div>

          {/* Driver card */}
          <div className="absolute top-6 left-6 right-6 md:right-auto md:w-80 glass-card p-6 rounded-xl z-10">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">Order #BW-8924</h2>
            <p className="text-outline mb-4">Driver: Michael S.</p>
            <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface">4.9 ★</span>
                  <button className="bg-primary-container text-on-primary-container p-2 rounded-full hover:bg-primary transition-colors hover:text-on-primary">
                    <span className="material-symbols-outlined text-sm">call</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline & Details */}
        <div className="w-full md:w-96 space-y-6">
          {/* Status */}
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/20 rounded-full blur-2xl -mr-10 -mt-10" />
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Live Status</h3>
            <div className="relative pl-6 border-l-2 border-surface-variant space-y-8">
              {steps.map((step) => (
                <div key={step.label} className="relative">
                  <span className={`absolute -left-8.75 top-0 w-6 h-6 rounded-full flex items-center justify-center ${step.active ? "bg-secondary-container border-2 border-secondary-container text-on-secondary-container shadow-[0_0_15px_rgba(98,250,227,0.5)]" : "bg-surface border-2 border-secondary text-secondary"}`}>
                    <span className="material-symbols-outlined text-[14px]">{step.icon}</span>
                  </span>
                  <div className={`font-label-md text-label-md uppercase tracking-wider mb-1 ${step.active ? "text-on-surface" : "text-secondary"}`}>{step.label}</div>
                  <div className={`text-sm ${step.active ? "text-on-surface-variant" : "text-outline"}`}>{step.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Details */}
          <div className="glass-card p-6 rounded-3xl">
            <h4 className="font-label-md text-label-md text-outline uppercase tracking-wider mb-4">Delivery Details</h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-outline">location_on</span>
                <div>
                  <div className="text-on-surface">123 Horizon Avenue</div>
                  <div className="text-sm text-outline">Apt 4B, Metro District</div>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-outline">schedule</span>
                <div>
                  <div className="text-on-surface">Estimated Arrival</div>
                  <div className="text-secondary font-semibold">2:45 PM - 3:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
