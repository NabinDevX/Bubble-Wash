import { useState, useEffect } from "react";
import api from "../../lib/api.js";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("revenue");
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [riderData, setRiderData] = useState([]);
  const [workshopData, setWorkshopData] = useState([]);
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    async function fetchReports() {
      try {
        const [rev, orders, riders, workshops, customers] = await Promise.allSettled([
          api.get("/admin/reports/revenue-by-category"),
          api.get("/admin/reports/daywise-orders"),
          api.get("/admin/reports/rider-performance"),
          api.get("/admin/reports/workshop-performance"),
          api.get("/admin/reports/customer-insights"),
        ]);

        if (rev.status === "fulfilled") setRevenueData(rev.value.data ?? rev.value ?? []);
        if (orders.status === "fulfilled") setOrdersData(orders.value.data ?? orders.value ?? []);
        if (riders.status === "fulfilled") setRiderData(riders.value.data ?? riders.value ?? []);
        if (workshops.status === "fulfilled") setWorkshopData(workshops.value.data ?? workshops.value ?? []);
        if (customers.status === "fulfilled") setCustomerData(customers.value.data ?? customers.value ?? []);
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  const tabs = [
    { key: "revenue", label: "Revenue", icon: "payments" },
    { key: "orders", label: "Orders", icon: "shopping_bag" },
    { key: "riders", label: "Riders", icon: "two_wheeler" },
    { key: "workshops", label: "Workshops", icon: "store" },
    { key: "customers", label: "Customers", icon: "group" },
  ];

  function renderTable(data, columns) {
    if (!Array.isArray(data) || data.length === 0) {
      return <p className="text-center py-8 text-on-surface-variant">No data available</p>;
    }
    const keys = columns ?? Object.keys(data[0]);
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-on-surface-variant bg-white/20">
            <tr>
              {keys.map((k) => (
                <th key={k} className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">
                  {k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-t border-outline-variant/20 hover:bg-white/30 transition-colors">
                {keys.map((k) => (
                  <td key={k} className="px-5 py-3.5 text-on-surface">{typeof row[k] === "number" ? row[k].toLocaleString() : String(row[k] ?? "—")}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function renderBarChart(data, labelKey, valueKey) {
    if (!Array.isArray(data) || data.length === 0) return null;
    const maxVal = Math.max(...data.map((d) => Number(d[valueKey]) || 0));
    return (
      <div className="space-y-3 mt-4">
        {data.map((d, i) => {
          const val = Number(d[valueKey]) || 0;
          const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
          return (
            <div key={i} className="flex items-center gap-4">
              <span className="text-sm text-on-surface-variant w-28 truncate">{d[labelKey] ?? `Item ${i + 1}`}</span>
              <div className="flex-1 h-6 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-linear-to-r from-secondary to-secondary-container rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-sm font-bold text-on-surface w-20 text-right">{typeof val === "number" && valueKey.toLowerCase().includes("revenue") ? `$${val.toLocaleString()}` : val.toLocaleString()}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Reports & Analytics</h1>
          <p className="text-on-surface-variant text-sm mt-1">Insights across revenue, operations, and performance.</p>
        </div>
        <button className="px-4 py-2 rounded-lg border border-outline-variant bg-white/60 text-on-surface text-sm font-medium hover:bg-white/80 transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-base">download</span> Export Reports
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${activeTab === t.key ? 'bg-secondary text-white shadow-md' : 'bg-white/40 border border-outline-variant/50 text-on-surface-variant hover:bg-white/60'}`}>
            <span className="material-symbols-outlined text-base">{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">Loading reports…</div>
      ) : (
        <div className="space-y-6">
          {activeTab === "revenue" && (
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40">
                <h3 className="font-semibold text-on-surface">Revenue by Category</h3>
              </div>
              {renderBarChart(revenueData, "category", "revenue")}
              {renderTable(revenueData)}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40">
                <h3 className="font-semibold text-on-surface">Day-wise Orders</h3>
              </div>
              {renderBarChart(ordersData, "date", "orders")}
              {renderTable(ordersData)}
            </div>
          )}

          {activeTab === "riders" && (
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40">
                <h3 className="font-semibold text-on-surface">Rider Performance</h3>
              </div>
              {renderBarChart(riderData, "name", "deliveries")}
              {renderTable(riderData)}
            </div>
          )}

          {activeTab === "workshops" && (
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40">
                <h3 className="font-semibold text-on-surface">Workshop Performance</h3>
              </div>
              {renderBarChart(workshopData, "name", "orders")}
              {renderTable(workshopData)}
            </div>
          )}

          {activeTab === "customers" && (
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40">
                <h3 className="font-semibold text-on-surface">Customer Insights</h3>
              </div>
              {renderTable(customerData)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
