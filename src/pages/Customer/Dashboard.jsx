import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api.js";
import { useAuth } from "../../lib/AuthContext.jsx";

export default function CustomerDashboard() {
  const { user } = useAuth();

  const [services, setServices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [walletData, setWalletData] = useState({
    balance: 0,
    points: 0,
  });

  const serviceImages = [
    "https://plus.unsplash.com/premium_photo-1664372899366-d5fb20b332d1?w=400",
    "https://images.unsplash.com/photo-1740684589228-54b6fba08985?w=400",
    "https://images.unsplash.com/photo-1545042746-ec9e5a59b359?w=400",
  ];

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
          const list = data?.orders ?? data?.data ?? data ?? [];
          setOrders(list);
        }

        if (servicesRes.status === "fulfilled") {
          const data = servicesRes.value;
          const list = data?.services ?? data?.data ?? data ?? [];
          setServices(list);
        }

        if (walletRes.status === "fulfilled") {
          const w = walletRes.value?.data ?? walletRes.value;
          setWalletData({
            balance: w.balance ?? 0,
            points: w.points ?? 0,
          });
        }
      } catch { }
    }

    fetchData();
  }, []);

  const displayName = user?.name?.split(" ")[0] ?? "User";

  const activeOrder = orders.find(
    (o) =>
      !["delivered", "completed"].includes(
        String(o.status ?? o.orderStatus).toLowerCase()
      )
  );

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-6 bg-[#f6f7fb] min-h-screen">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Welcome back, {displayName}!
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Your garments are in safe hands today.
        </p>
      </div>

      {/* ACTIVE ORDER */}
      {activeOrder && (
        <div className="bg-[#f1f3f7] rounded-3xl p-6 flex justify-between items-center border border-gray-200 mb-6">

          <div className="flex-1">

            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-medium">
                ACTIVE ORDER
              </span>
              <span className="text-sm text-gray-500">
                Order #{activeOrder._id || activeOrder.id}
              </span>
            </div>

            <h3 className="font-semibold text-lg text-gray-800">
              In Workshop
            </h3>

            <p className="text-sm text-gray-500">
              Precision cleaning your premium garments
            </p>

            {/* Progress */}
            <div className="mt-3">
              <p className="text-sm text-blue-500 font-medium mb-1">
                Progress: 65%
              </p>

              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-teal-400 w-[65%] rounded-full transition-all duration-500" />
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Est. Delivery: Tomorrow, 10 AM
            </p>
          </div>

          <Link
            to={`/customer/track?orderId=${activeOrder._id}`}
            className="border px-4 py-2 rounded-lg bg-white hover:bg-gray-100 transition"
          >
            Track Live
          </Link>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

        <div className="bg-[#f1f3f7] rounded-2xl p-5 flex items-center gap-4 border border-gray-200">
          <span className="material-symbols-outlined text-blue-500">
            account_balance_wallet
          </span>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              WALLET BALANCE
            </p>
            <h2 className="font-semibold text-gray-800">
              ₹{walletData.balance}
            </h2>
          </div>
        </div>

        <div className="bg-[#f1f3f7] rounded-2xl p-5 flex items-center gap-4 border border-gray-200">
          <span className="material-symbols-outlined text-green-500">
            receipt_long
          </span>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              TOTAL ORDERS
            </p>
            <h2 className="font-semibold text-gray-800">
              {orders.length}
            </h2>
          </div>
        </div>

        <div className="bg-[#f1f3f7] rounded-2xl p-5 flex items-center gap-4 border border-gray-200">
          <span className="material-symbols-outlined text-purple-500">
            confirmation_number
          </span>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              ACTIVE VOUCHERS
            </p>
            <h2 className="font-semibold text-gray-800">03</h2>
          </div>
        </div>

      </div>

      {/* INSTANT SCHEDULING */}
      <div className="mb-10">

        <h3 className="mb-4 font-semibold text-gray-800">
          Instant Scheduling
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          {services.slice(0, 3).map((svc, index) => (
            <div
              key={svc._id}
              className="bg-[#f8fafc] rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
            >

              {/* IMAGE */}
              <img
                src={serviceImages[index]}
                className="h-52 w-full object-cover"
              />

              {/* CONTENT */}
              <div className="p-5">

                <h4 className="font-semibold text-gray-800 text-sm">
                  {svc.name}
                </h4>

                <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                  {svc.description}
                </p>

                {/* BUTTON */}
                <Link
                  to="/customer/schedule"
                  className="mt-4 w-full block text-center py-2 rounded-full border border-teal-400 text-teal-600 text-sm font-medium hover:bg-teal-50 transition"
                >
                  Schedule Now
                </Link>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div>

        <div className="flex justify-between mb-4">
          <h3 className="font-semibold text-gray-800">
            Recent Activity
          </h3>

          <Link
            to="/customer/orders"
            className="text-blue-500 text-sm"
          >
            View All History
          </Link>
        </div>

        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl p-4 flex justify-between items-center shadow-sm border-l-4 border-teal-400"
            >
              <div className="flex items-center gap-3">

                <span className="material-symbols-outlined text-teal-500">
                  check_circle
                </span>

                <div>
                  <p className="font-medium text-gray-800">
                    {order.status ?? order.orderStatus}
                  </p>

                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()} • ₹{order.totalAmount || 0}
                  </p>
                </div>
              </div>

              <Link
                to={`/customer/track?orderId=${order._id}`}
                className="text-blue-500 text-sm"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}