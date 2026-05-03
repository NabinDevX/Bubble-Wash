import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../lib/api.js";

export default function TrackOrder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || searchParams.get("id");
  const [orderIdInput, setOrderIdInput] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function buildSteps(status) {
    const normalized = String(status ?? "")
      .trim()
      .toLowerCase()
      .replace(/_/g, " ");

    const statusLabel = (() => {
      if (!normalized) return "";
      if (
        normalized.includes("pickup") ||
        normalized.includes("picked") ||
        normalized.includes("collected")
      )
        return "Pickup Complete";
      if (normalized.includes("process")) return "Processing";
      if (
        normalized.includes("out for delivery") ||
        normalized.includes("delivery")
      )
        return "Out for Delivery";
      if (normalized.includes("deliver")) return "Delivered";
      return "";
    })();

    const flow = [
      "Order Initiated",
      "Pickup Complete",
      "Processing",
      "Out for Delivery",
      "Delivered",
    ];

    let idx = flow.indexOf(statusLabel);

    // IMPORTANT FIX
    if (idx === -1) {
      if (
        normalized.includes("order") ||
        normalized.includes("initiated") ||
        normalized.includes("pending") ||
        normalized.includes("confirmed")
      ) {
        idx = 0; // force first step
      }
    }
    return [
      {
        label: "Order Initiated",
        desc: "Your order has been placed.",
        icon: "receipt_long",
        done: idx >= 0,
        active: idx === 0,
      },
      {
        label: "Pickup Complete",
        desc: "Items collected from your location.",
        icon: "inventory_2",
        done: idx >= 1,
        active: idx === 1,
      },
      {
        label: "Processing",
        desc: "Garments inspected and cleaned.",
        icon: "local_laundry_service",
        done: idx >= 2,
        active: idx === 2,
      },
      {
        label: "Out for Delivery",
        desc: "Driver is en route to your location.",
        icon: "local_shipping",
        done: idx >= 3,
        active: idx === 3,
      },
      {
        label: "Delivered",
        desc: "Order delivered successfully.",
        icon: "check_circle",
        done: idx >= 4,
        active: idx === 4,
      },
    ];
  }

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setOrder(null);
        setError(null);
        setLoading(false);
        return;
      }
      try {
        setError(null);
        const data = await api.get(`/orders/${orderId}`);
        const o = data.order ?? data;

        const status = o.status ?? o.orderStatus ?? o.state ?? "";

        const created = new Date(o.createdAt);

        let etaTime;

        if (o.deliveryType === "express") {
          etaTime = new Date(created.getTime() + 24 * 60 * 60 * 1000);
        } else {
          etaTime = new Date(created.getTime() + 48 * 60 * 60 * 1000);
        }

        setOrder({
          id: o.orderId ?? o._id ?? orderId,
          status: status,
          driverName: o.rider?.name ?? o.driverName ?? "—",
          driverRating: o.rider?.rating ?? "—",
          address:
            o.pickupAddress?.street ??
            o.deliveryAddress?.street ??
            o.address?.street ??
            o.deliveryAddress ??
            "—",
          addressDetail:
            o.pickupAddress?.city || o.address?.city
              ? `${o.pickupAddress?.city ?? o.address?.city}${o.pickupAddress?.pincode || o.address?.zip ? `, ${o.pickupAddress?.pincode ?? o.address?.zip}` : ""}`
              : "",
          eta: etaTime.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
          steps: buildSteps(status),
        });
      } catch (e) {
        setOrder(null);
        setError(e?.message || "Unable to load order.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  function handleTrackSubmit(e) {
    e.preventDefault();
    const next = orderIdInput.trim();
    if (!next) return;
    setSearchParams({ orderId: next });
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-on-surface-variant">
        Loading order…
      </div>
    );

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-on-surface-variant">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-outline-variant/40 mb-4 block">
            {error ? "error" : "search"}
          </span>
          {error ? (
            <p>{error}</p>
          ) : (
            <div className="space-y-4">
              <p>No order to track. Enter your Order ID to continue.</p>
              <form
                onSubmit={handleTrackSubmit}
                className="flex flex-col sm:flex-row gap-2 justify-center items-center"
              >
                <input
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  placeholder="Order ID (e.g. 12345)"
                  className="w-64 max-w-[70vw] bg-white/40 border border-outline-variant/40 rounded-xl px-4 py-2 focus:outline-none focus:border-secondary-container text-on-surface"
                />
                <button
                  type="submit"
                  className="cta-gradient text-white rounded-xl px-4 py-2"
                >
                  Track
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  const steps = order.steps;

  return (
    <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2">

          <div className="relative rounded-3xl overflow-hidden h-[440px] bg-gradient-to-br from-[#eef3f6] to-[#f8fbfd] shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

            {/* MAP BG */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-300 opacity-40">
              <span className="material-symbols-outlined text-[80px]">
                map
              </span>
            </div>

            {/* DRIVER ICON (with pulse animation) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-teal-400 rounded-full animate-ping opacity-40"></div>
                <div className="relative bg-gradient-to-r from-teal-500 to-green-500 text-white p-3 rounded-full shadow-lg">
                  <span className="material-symbols-outlined">
                    local_shipping
                  </span>
                </div>
              </div>
            </div>

            {/* ETA BADGE */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-5 py-2 rounded-full shadow text-sm font-medium">
              {order.eta !== "—" ? `Arriving: ${order.eta}` : order.status}
            </div>

            {/* ORDER CARD */}
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur rounded-2xl p-5 w-[270px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-white/40">

              <h2 className="font-semibold text-xl text-gray-800">
                Order
              </h2>

              <p className="text-xs text-gray-500 mb-2 break-all">
                {order.id}
              </p>

              <p className="text-xs text-gray-400 mb-4">
                Driver: {order.driverName}
              </p>

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                    <span className="material-symbols-outlined text-sm">person</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {order.driverRating} ★
                  </span>
                </div>

                <button className="bg-gradient-to-r from-teal-500 to-green-500 text-white p-2 rounded-full shadow hover:scale-105 transition">
                  <span className="material-symbols-outlined text-sm">
                    call
                  </span>
                </button>

              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {/* LIVE STATUS */}
          <div className="bg-white/70 backdrop-blur rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-white/40">

            <h3 className="text-3xl font-semibold mb-6 text-gray-800">
              Live Status
            </h3>

            <div className="space-y-6 border-l-2 border-gray-200 pl-6">

              {steps.map((step) => (
                <div key={step.label} className="relative group">

                  {/* DOT */}
                  <div
                    className={`absolute -left-[34px] top-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${step.done
                      ? "bg-green-100 text-green-600 shadow-md"
                      : "bg-gray-200 text-gray-400"
                      }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {step.icon}
                    </span>
                  </div>

                  {/* TEXT */}
                  <p className={`text-sm font-semibold ${step.done ? "text-gray-900" : "text-gray-500"
                    }`}>
                    {step.label}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {step.desc}
                  </p>

                </div>
              ))}

            </div>
          </div>

          {/* DELIVERY DETAILS */}
          <div className="bg-white/70 backdrop-blur rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-white/40">

            <h4 className="text-xs uppercase text-gray-400 mb-4 tracking-wider">
              Delivery Details
            </h4>

            <div className="space-y-5">

              <div className="flex gap-3 items-start">
                <span className="material-symbols-outlined text-gray-400">
                  location_on
                </span>
                <div>
                  <p className="text-gray-800 text-sm">{order.address}</p>
                  <p className="text-xs text-gray-500">
                    {order.addressDetail}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="material-symbols-outlined text-gray-400">
                  schedule
                </span>
                <div>
                  <p className="text-gray-800 text-sm">Estimated Arrival</p>
                  <p className="text-teal-600 font-semibold text-sm">
                    {order.eta}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}