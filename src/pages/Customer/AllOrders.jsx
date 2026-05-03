import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const [orderRes, serviceRes] = await Promise.all([
          api.get("/orders/my-orders"),
          api.get("/services"),
        ]);

        const orderList =
          orderRes?.orders ||
          orderRes?.data ||
          [];

        const serviceList =
          serviceRes?.services ||
          serviceRes?.data?.services ||
          serviceRes?.data ||
          [];

        setOrders(orderList);
        setServices(serviceList);

      } catch (err) {
        console.error(err);
        setOrders([]);
        setServices([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // FILTER LOGIC
  const filteredOrders = orders.filter((o) => {
    const status = (o.status || o.orderStatus || "pending").toLowerCase();

    if (filter === "active") {
      return status !== "delivered" && status !== "completed";
    }

    if (filter === "completed") {
      return status === "delivered" || status === "completed";
    }

    return true;
  });

  return (
    <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>
          <p className="text-gray-500 text-sm">
            Manage and track your premium laundry care requests.
          </p>
        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">

          {/* SEARCH */}
          <div className="flex items-center bg-gray-100 px-4 py-2 rounded-xl w-64">
            <span className="material-symbols-outlined text-gray-400 mr-2">
              search
            </span>
            <input
              type="text"
              placeholder="Search orders..."
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          {/* FILTER */}
          <div className="flex bg-gray-100 rounded-full p-1">
            {["all", "active", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1 rounded-full text-sm capitalize transition ${filter === f
                  ? "bg-black text-white shadow"
                  : "text-gray-600"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredOrders.length === 0 ? (
        <p>No orders found</p>
      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredOrders.map((o) => {
            const status =
              (o.status || o.orderStatus || "pending").toLowerCase();

            const formattedStatus = status.replaceAll("_", " ");

            // STATUS COLORS
            const statusStyle = {
              processing: "bg-cyan-100 text-cyan-700",
              pending: "bg-yellow-100 text-yellow-700",
              completed: "bg-green-100 text-green-700",
              delivered: "bg-green-100 text-green-700",
              out_for_delivery: "bg-indigo-100 text-indigo-700",
            }[status] || "bg-gray-100 text-gray-600";

            return (
              <div
                key={o._id}
                className="bg-white rounded-3xl p-6 border shadow-sm hover:shadow-md transition"
              >

                {/* TOP */}
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <p className="text-xs text-gray-400 tracking-widest">
                      ORDER ID
                    </p>
                    <p className="font-semibold text-gray-800 text-lg">
                      #{`${o._id.slice(0, 2)}-${o._id.slice(-2)}`.toUpperCase()}
                    </p>
                  </div>

                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusStyle}`}>
                    {formattedStatus}
                  </span>
                </div>

                {/* SERVICE */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-cyan-600">
                      dry_cleaning
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">SERVICE</p>
                    <p className="font-medium text-gray-800">
                      {o.orderItems?.length > 0
                        ? o.orderItems
                          .map((item) => item.service?.name || "Service")
                          .join(", ")
                        : "Service"}
                    </p>
                  </div>
                </div>

                {/* DATE */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-500">
                      calendar_month
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">DATE</p>
                    <p className="text-gray-700">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* BUTTON */}
                {
                  status === "out_for_delivery" ? (
                    <Link
                      to={`/customer/track?orderId=${o._id}`}
                      className="block text-center py-3 rounded-xl text-white font-medium bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 transition"
                    >
                      View Live Tracker →
                    </Link>
                  ) : (
                    <Link
                      to={`/customer/track?orderId=${o._id}`}
                      className="block text-center border rounded-xl py-3 font-medium hover:bg-gray-100 transition"
                    >
                      View Details →
                    </Link>
                  )
                }

              </div>
            );
          })}

        </div>
      )
      }
    </div >
  );
}