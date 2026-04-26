const steps = [
  {
    icon: "check",
    label: "Pickup Complete",
    desc: "Items collected from your location.",
    completed: true,
    active: false,
  },
  {
    icon: "check",
    label: "Processing",
    desc: "Garments inspected and cleaned.",
    completed: true,
    active: false,
  },
  {
    icon: "local_shipping",
    label: "Out for Delivery",
    desc: "Driver is en route to your location.",
    completed: false,
    active: true,
  },
];

export default function TrackOrder() {
  return (
    <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto h-full flex flex-col md:flex-row gap-gutter mt-8 md:mt-0">
      {/* Left Column: Map UI */}
      <div className="flex-1 rounded-2xl overflow-hidden shadow-lg relative h-[512px] md:h-[calc(100vh-160px)] z-10 glass-card">
        <div className="w-full h-full absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, rgba(236, 251, 243, 0.9) 0%, rgba(227, 248, 236, 0.7) 50%, rgba(214, 235, 224, 0.8) 100%),
              radial-gradient(circle at 30% 40%, rgba(37, 196, 143, 0.15), transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(11, 90, 73, 0.1), transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(138, 240, 205, 0.12), transparent 40%)
            `,
          }}>
          {/* Fake road lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 600">
            <line x1="100" y1="0" x2="100" y2="600" stroke="#0f8d65" strokeWidth="1" strokeDasharray="8,4" />
            <line x1="300" y1="0" x2="300" y2="600" stroke="#0f8d65" strokeWidth="1" strokeDasharray="8,4" />
            <line x1="500" y1="0" x2="500" y2="600" stroke="#0f8d65" strokeWidth="1" strokeDasharray="8,4" />
            <line x1="700" y1="0" x2="700" y2="600" stroke="#0f8d65" strokeWidth="1" strokeDasharray="8,4" />
            <line x1="0" y1="150" x2="800" y2="150" stroke="#0f8d65" strokeWidth="1" strokeDasharray="8,4" />
            <line x1="0" y1="300" x2="800" y2="300" stroke="#0f8d65" strokeWidth="1" strokeDasharray="8,4" />
            <line x1="0" y1="450" x2="800" y2="450" stroke="#0f8d65" strokeWidth="1" strokeDasharray="8,4" />
          </svg>
        </div>

        {/* Map Gradient Overlay */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(246,255,249,0.8), transparent 40%, rgba(246,255,249,0.3))" }} />

        {/* Floating Vehicle Marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
          <div className="p-3 rounded-full shadow-lg mb-2 relative"
            style={{ background: "linear-gradient(135deg, #0f8d65, #25c48f)" }}>
            <span className="material-symbols-outlined text-white">local_shipping</span>
            <div className="absolute inset-0 border-2 border-secondary rounded-full animate-ping opacity-40" />
          </div>
          <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-label-sm font-label-sm text-primary whitespace-nowrap border border-outline-variant/30">
            Arriving in 12 min
          </div>
        </div>

        {/* Overlay Info Card */}
        <div className="absolute top-6 left-6 right-6 md:right-auto md:w-80 glass-card p-6 rounded-xl z-10">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">Order #BW-8924</h2>
          <p className="font-body-md text-body-md text-outline mb-4">Driver: Michael S.</p>
          <div className="flex items-center gap-4 bg-white/30 p-4 rounded-lg border border-outline-variant/20">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #0b5a49, #0f8d65)" }}>
              <span className="material-symbols-outlined">person</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface">4.9 ★</span>
                <button className="p-2 rounded-full hover:bg-white/30 transition-colors text-secondary"
                  style={{ background: "rgba(138, 240, 205, 0.2)" }}>
                  <span className="material-symbols-outlined text-sm">call</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Timeline & Details */}
      <div className="w-full md:w-96 flex flex-col gap-stack-md z-10">
        {/* Status Card */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"
            style={{ background: "rgba(138, 240, 205, 0.25)" }} />
          <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Live Status</h3>

          {/* Stepper Timeline */}
          <div className="relative pl-6 border-l-2 border-outline-variant/40 space-y-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <span className={`absolute -left-[23px] top-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  step.active
                    ? "text-white shadow-[0_0_15px_rgba(37,196,143,0.5)]"
                    : step.completed
                    ? "bg-white border-2 border-secondary text-secondary"
                    : "bg-white border-2 border-outline-variant text-outline-variant"
                }`}
                  style={step.active ? { background: "linear-gradient(135deg, #0f8d65, #25c48f)" } : {}}>
                  <span className="material-symbols-outlined text-[14px]">{step.icon}</span>
                </span>
                <div className={`font-label-md text-label-md uppercase tracking-wider mb-1 ${
                  step.active ? "text-on-surface" : step.completed ? "text-secondary" : "text-outline"
                }`}>
                  {step.label}
                </div>
                <div className={`font-body-md text-body-md ${step.active ? "text-on-surface-variant" : "text-outline"}`}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Details */}
        <div className="glass-card p-6 rounded-2xl">
          <h4 className="font-label-md text-label-md text-outline uppercase tracking-wider mb-4">Delivery Details</h4>
          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-outline">location_on</span>
              <div>
                <div className="font-body-md text-body-md text-on-surface">123 Horizon Avenue</div>
                <div className="text-sm text-outline">Apt 4B, Metro District</div>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-outline">schedule</span>
              <div>
                <div className="font-body-md text-body-md text-on-surface">Estimated Arrival</div>
                <div className="font-semibold text-secondary">2:45 PM - 3:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
