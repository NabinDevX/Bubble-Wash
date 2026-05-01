import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function Notifications() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [ordersRes, walletRes] = await Promise.allSettled([
          api.get("/orders/my-orders"),
          api.get("/wallet/history"),
        ]);

        let notifications = [];

        // Orders → notifications
        if (ordersRes.status === "fulfilled") {
          const orders =
            ordersRes.value?.orders ||
            ordersRes.value?.data ||
            [];

          notifications.push(
            ...orders.map((o) => {
              const status =
                o.status ??
                o.orderStatus ??
                o.state ??
                "placed";

              return {
                message: `${status.replaceAll("_", " ")}`,
                time: o.createdAt,
              };
            })
          );
        }

        // Wallet → notifications
        if (walletRes.status === "fulfilled") {
          const history =
            walletRes.value?.history ||
            walletRes.value?.data ||
            [];

          notifications.push(
            ...history.map((w) => ({
              message: `${w.points > 0 ? "+" : ""}${w.points} points`,
              time: w.createdAt,
            }))
          );
        }

        // Sort latest first
        notifications.sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        );

        setList(notifications.slice(0, 10));
      } catch (err) {
        console.error(err);
        setList([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Notifications</h1>

      {loading ? (
        <p>Loading...</p>
      ) : list.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <div className="space-y-3">
          {list.map((n, i) => (
            <div key={i} className="glass-card p-4 rounded-xl">
              <p>{n.message}</p>
              <p className="text-sm text-on-surface-variant">
                {n.time
                  ? new Date(n.time).toLocaleString()
                  : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}