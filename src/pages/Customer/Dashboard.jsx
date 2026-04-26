import { Link } from "react-router-dom";

const services = [
  {
    icon: "local_laundry_service",
    title: "Wash & Fold",
    desc: "Everyday garments, perfectly folded.",
    tag: "Popular",
  },
  {
    icon: "iron",
    title: "Dry Cleaning",
    desc: "Delicate items requiring special care.",
    tag: null,
  },
  {
    icon: "checkroom",
    title: "Premium Press",
    desc: "Crisp, wrinkle-free finish for formals.",
    tag: "New",
  },
];

const recentOrders = [
  { id: "#BW-8924", status: "Delivered", date: "Apr 22, 2026", amount: "$64.50", color: "text-secondary" },
  { id: "#BW-8901", status: "Processing", date: "Apr 20, 2026", amount: "$45.00", color: "text-amber-600" },
  { id: "#BW-8879", status: "Completed", date: "Apr 18, 2026", amount: "$107.41", color: "text-secondary" },
];

export default function CustomerDashboard() {
  return (
    <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto">
      {/* Hero Header */}
      <header className="mb-stack-lg text-center md:text-left mt-8 md:mt-0">
        <p className="font-label-md text-label-md text-secondary mb-2 uppercase tracking-widest">Welcome back</p>
        <h1 className="font-display-lg text-display-lg text-primary">
          Hello, <span className="text-gradient">Nabin</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
          Your premium laundry service is just a tap away. Schedule a pickup or track your orders.
        </p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter mb-stack-lg">
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl pointer-events-none"
            style={{ background: "rgba(37, 196, 143, 0.25)" }} />
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ background: "linear-gradient(135deg, #0f8d65, #25c48f)" }}>
              <span className="material-symbols-outlined text-sm">shopping_bag</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Active Orders</span>
          </div>
          <p className="font-display-lg text-display-lg text-primary leading-none">2</p>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl pointer-events-none"
            style={{ background: "rgba(138, 240, 205, 0.3)" }} />
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ background: "linear-gradient(135deg, #0b5a49, #0f8d65)" }}>
              <span className="material-symbols-outlined text-sm">stars</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Loyalty Points</span>
          </div>
          <p className="font-display-lg text-display-lg text-primary leading-none">2,450</p>
          <p className="font-label-sm text-label-sm text-secondary mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            +350 this month
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl pointer-events-none"
            style={{ background: "rgba(11, 90, 73, 0.15)" }} />
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ background: "linear-gradient(135deg, #25c48f, #8af0cd)" }}>
              <span className="material-symbols-outlined text-sm">savings</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Saved</span>
          </div>
          <p className="font-display-lg text-display-lg text-primary leading-none">$124</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Services Section */}
        <div className="lg:col-span-7 space-y-stack-md">
          <section className="glass-card rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ background: "linear-gradient(135deg, #0f8d65, #25c48f)" }}>
                <span className="material-symbols-outlined">dry_cleaning</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm">Our Services</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {services.map((svc) => (
                <div key={svc.title}
                  className="p-4 rounded-xl border border-outline-variant/30 bg-white/20 hover:bg-white/40 transition-all duration-300 cursor-pointer group hover:scale-[1.02]">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-secondary"
                      style={{ background: "rgba(138, 240, 205, 0.25)" }}>
                      <span className="material-symbols-outlined">{svc.icon}</span>
                    </div>
                    {svc.tag && (
                      <span className="font-label-sm text-label-sm text-secondary px-2 py-1 rounded-full"
                        style={{ background: "rgba(138, 240, 205, 0.3)" }}>
                        {svc.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="font-label-md text-label-md text-primary mb-1">{svc.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm">{svc.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <Link to="/customer/schedule"
            className="cta-gradient text-white rounded-2xl p-6 md:p-8 flex items-center justify-between group hover:scale-[1.01] transition-transform duration-300 block">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-white mb-1">Schedule a Pickup</h3>
              <p className="text-white/80 text-sm">Fresh clothes, delivered to your door.</p>
            </div>
            <span className="material-symbols-outlined text-white/80 group-hover:translate-x-1 transition-transform duration-300">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-5">
          <section className="glass-card rounded-2xl p-6 md:p-8 sticky top-28">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline-sm text-headline-sm">Recent Orders</h3>
              <span className="font-label-sm text-label-sm text-secondary cursor-pointer hover:underline">View All</span>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/20 border border-outline-variant/20 hover:bg-white/40 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-secondary"
                      style={{ background: "rgba(138, 240, 205, 0.25)" }}>
                      <span className="material-symbols-outlined text-sm">receipt_long</span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-primary">{order.id}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{order.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-label-md text-label-md text-primary">{order.amount}</p>
                    <p className={`font-label-sm text-label-sm ${order.color}`}>{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
