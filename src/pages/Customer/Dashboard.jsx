import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api.js";
import { useAuth } from "../../lib/AuthContext.jsx";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [walletData, setWalletData] = useState({
    points: "—",
    savedThisMonth: "—",
    totalSaved: "—",
  });
  const [activeOrderCount, setActiveOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, servicesRes, walletRes] = await Promise.allSettled([
          api.get("/orders/my-orders"),
          api.get("/services"),
          api.get("/wallet"),
        ]);

        if (ordersRes.status === "fulfilled") {
          const data = ordersRes.value;

          console.log("CORRECT DATA:", data);

          const list = Array.isArray(data?.orders)
            ? data.orders
            : Array.isArray(data)
              ? data
              : [];

          console.log("FINAL LIST:", list);

          setActiveOrderCount(
            list.filter((o) => {
              const status = String(o.status ?? o.orderStatus).toLowerCase();

              return [
                "order_initiated",
                "pending",
                "processing",
                "picked up",
                "picked_up",
                "in transit",
                "in_transit",
                "out for delivery",
                "out_for_delivery",
              ].includes(status);
            }).length
          );

          setRecentOrders(
            list.slice(0, 3).map((o) => ({
              id: o.orderId ?? o._id ?? o.id,
              status: o.status ?? o.orderStatus ?? "Pending",
              date: o.createdAt
                ? new Date(o.createdAt).toLocaleDateString()
                : "—",
              amount: o.totalAmount ? `₹${o.totalAmount}` : "—",
              color:
                ["delivered", "completed"].includes(
                  String(o.status ?? o.orderStatus).toLowerCase()
                )
                  ? "text-secondary"
                  : "text-amber-600",
            }))
          );
        }

        if (servicesRes.status === "fulfilled") {
          const data = servicesRes.value;
          const list =
            data?.services ??
            data?.data?.services ??
            data?.data ??
            data ??
            [];
          const iconMap = {
            wash: "local_laundry_service",
            iron: "iron",
            wash_and_iron: "checkroom",
            "wash & iron": "checkroom",
            dry_clean: "dry_cleaning",
            "dry clean": "dry_cleaning",
          };
          setServices(
            list.map((s) => {
              const categoryKey = String(s.category ?? s.name ?? "")
                .toLowerCase()
                .trim();
              return {
                id: s._id ?? s.id ?? s.name,
                icon: iconMap[categoryKey] ?? "dry_cleaning",
                title: s.name ?? "—",
                desc: s.description ?? "—",
                category: s.category ?? "—",
                isActive: Boolean(s.isActive ?? true),
                pricePerKg: s.pricePerKg,
                estimatedDeliveryDays: s.estimatedDeliveryDays,
              };
            }),
          );
        }

        if (walletRes.status === "fulfilled") {
          const wRaw = walletRes.value;
          const w = wRaw?.data ?? wRaw;
          setWalletData({
            points: String(w.balance ?? w.points ?? 0).replace(
              /\B(?=(\d{3})+(?!\d))/g,
              ",",
            ),
            savedThisMonth:
              (w.savedThisMonth ?? w.monthlyEarnings)
                ? `+${w.monthlyEarnings ?? 0}`
                : "+0",
            totalSaved: w.totalSaved ? `$${w.totalSaved}` : "$0",
          });
        }
      } catch {
        // fallback to empty
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Fallback display name
  const displayName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto">
      {/* Hero Header */}
      <header className="mb-stack-lg text-center md:text-left mt-8 md:mt-0">
        <p className="font-label-md text-label-md text-secondary mt-2 mb-2 uppercase tracking-widest">
          Welcome back
        </p>
        <h1 className="font-display-lg text-headline-md md:text-display-lg text-primary">
          Hello, <span className="text-gradient">{displayName}</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
          Your premium laundry service is just a tap away. Schedule a pickup or
          track your orders.
        </p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter mb-stack-lg">
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group md:hover:scale-[1.02] transition-transform duration-300">
          <div
            className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl pointer-events-none"
            style={{ background: "rgba(37, 196, 143, 0.25)" }}
          />
          <div className="flex items-center gap-3 mb-3 min-w-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{
                background: "linear-gradient(135deg, #0f8d65, #25c48f)",
              }}
            >
              <span className="material-symbols-outlined text-sm">
                shopping_bag
              </span>
            </div>
            <span className="font-label-sm text-label-sm md:font-label-md md:text-label-md text-on-surface-variant uppercase tracking-wider whitespace-normal break-words leading-tight">
              Active Orders
            </span>
          </div>
          <p className="font-display-lg text-headline-md md:text-display-lg text-primary leading-none">
            {loading ? "—" : activeOrderCount}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group md:hover:scale-[1.02] transition-transform duration-300">
          <div
            className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl pointer-events-none"
            style={{ background: "rgba(138, 240, 205, 0.3)" }}
          />
          <div className="flex items-center gap-3 mb-3 min-w-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{
                background: "linear-gradient(135deg, #0b5a49, #0f8d65)",
              }}
            >
              <span className="material-symbols-outlined text-sm">stars</span>
            </div>
            <span className="font-label-sm text-label-sm md:font-label-md md:text-label-md text-on-surface-variant uppercase tracking-wider whitespace-normal break-words leading-tight">
              Loyalty Points
            </span>
          </div>
          <p className="font-display-lg text-headline-md md:text-display-lg text-primary leading-none">
            {walletData.points}
          </p>
          <p className="font-label-sm text-label-sm text-secondary mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">
              trending_up
            </span>
            {walletData.savedThisMonth} this month
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group md:hover:scale-[1.02] transition-transform duration-300">
          <div
            className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl pointer-events-none"
            style={{ background: "rgba(11, 90, 73, 0.15)" }}
          />
          <div className="flex items-center gap-3 mb-3 min-w-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{
                background: "linear-gradient(135deg, #25c48f, #8af0cd)",
              }}
            >
              <span className="material-symbols-outlined text-sm">savings</span>
            </div>
            <span className="font-label-sm text-label-sm md:font-label-md md:text-label-md text-on-surface-variant uppercase tracking-wider whitespace-normal break-words leading-tight">
              Total Saved
            </span>
          </div>
          <p className="font-display-lg text-headline-md md:text-display-lg text-primary leading-none">
            {walletData.totalSaved}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Services Section */}
        <div className="lg:col-span-7 space-y-stack-md">
          <section className="glass-card rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{
                  background: "linear-gradient(135deg, #0f8d65, #25c48f)",
                }}
              >
                <span className="material-symbols-outlined">dry_cleaning</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm">
                Our Services
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className={
                    "p-5 rounded-xl border border-outline-variant/30 bg-white/20 transition-all duration-300 group " +
                    (svc.isActive
                      ? "md:hover:bg-white/40 md:hover:scale-[1.02] cursor-pointer"
                      : "opacity-70")
                  }
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-secondary shrink-0"
                        style={{ background: "rgba(138, 240, 205, 0.25)" }}
                      >
                        <span className="material-symbols-outlined">
                          {svc.icon}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-label-md text-label-md text-primary truncate">
                          {svc.title}
                        </h3>
                        <p className="font-label-sm text-label-sm text-on-surface-variant truncate">
                          {String(svc.category ?? "").replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                    <span
                      className={
                        "font-label-sm text-label-sm px-2 py-1 rounded-full border " +
                        (svc.isActive
                          ? "text-secondary border-secondary/30 bg-secondary-container/20"
                          : "text-on-surface-variant border-outline-variant/40 bg-surface/40")
                      }
                    >
                      {svc.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="font-body-md text-body-md text-on-surface-variant text-sm leading-relaxed break-words">
                    {svc.desc}
                  </p>

                  <div className="mt-4 pt-4 border-t border-outline-variant/20 flex flex-col gap-2">

                    {/* PRICE BOX */}
                    <div className="bg-surface/30 rounded-lg p-3 border border-outline-variant/20 text-center">
                      <div className="text-xs text-on-surface-variant uppercase tracking-wider">
                        Price
                      </div>
                      <div className="font-label-md text-on-surface">
                        {svc.pricePerKg != null ? `₹${svc.pricePerKg}/kg` : "—"}
                      </div>
                    </div>

                    {/* DELIVERY BOX */}
                    <div className="bg-surface/30 rounded-lg p-3 border border-outline-variant/20 text-center">
                      <div className="text-xs text-on-surface-variant uppercase tracking-wider">
                        Delivery
                      </div>
                      <div className="font-label-md text-on-surface">
                        {svc.estimatedDeliveryDays != null
                          ? `${svc.estimatedDeliveryDays} days`
                          : "—"}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
            {!loading && services.length === 0 ? (
              <p className="text-on-surface-variant text-sm mt-4">
                No services available.
              </p>
            ) : null}
          </section>

          {/* CTA */}
          <Link
            to="/customer/schedule"
            className="cta-gradient text-white rounded-2xl p-6 md:p-8 flex items-center justify-between group md:hover:scale-[1.01] transition-transform duration-300"
          >
            <div>
              <h3 className="font-headline-sm text-headline-sm text-white mb-1">
                Schedule a Pickup
              </h3>
              <p className="text-white/80 text-sm">
                Fresh clothes, delivered to your door.
              </p>
            </div>
            <span className="material-symbols-outlined text-white/80 group-hover:translate-x-1 transition-transform duration-300">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-5">
          <section className="glass-card rounded-2xl p-6 md:p-8 lg:sticky lg:top-28">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline-sm text-headline-sm">
                Recent Orders
              </h3>
              <Link
                to="/customer/orders"
                className="font-label-sm text-label-sm text-secondary hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/customer/track?orderId=${encodeURIComponent(order.id)}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/20 border border-outline-variant/20 hover:bg-white/40 transition-colors cursor-pointer min-w-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-secondary"
                      style={{ background: "rgba(138, 240, 205, 0.25)" }}
                    >
                      <span className="material-symbols-outlined text-sm">
                        receipt_long
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-label-md text-label-md text-primary truncate">
                        {order.id}
                      </p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">
                        {order.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-label-md text-label-md text-primary">
                      {order.amount}
                    </p>
                    <p className={`font-label-sm text-label-sm ${order.color}`}>
                      {order.status}
                    </p>
                  </div>
                </Link>
              ))}
              {!loading && recentOrders.length === 0 ? (
                <div className="p-4 rounded-xl bg-white/20 border border-outline-variant/20">
                  <p className="text-on-surface-variant text-sm">
                    No orders yet.
                  </p>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}