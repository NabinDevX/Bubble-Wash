import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/orders/my-orders");

        const list =
          res?.orders ||
          res?.data ||
          [];

        setOrders(list);
      } catch (err) {
        console.error(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
      <h1 className="font-display-lg text-display-lg mb-6">
        All Orders
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const status =
              o.status ??
              o.orderStatus ??
              "pending";

            return (
              <Link
                key={o._id}
                to={`/customer/track?orderId=${o._id}`}
                className="block p-4 rounded-xl bg-white/20 border border-outline-variant/20 hover:bg-white/40 transition"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">
                      {o._id}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="text-secondary font-medium">
                    {status.replaceAll("_", " ")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}