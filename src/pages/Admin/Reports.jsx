import { useMemo, useState, useEffect } from "react";
import { SkeletonTableRow, Skeleton } from "../../components/Skeleton.jsx";
import api from "../../lib/api.js";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
);

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function normalizeRevenueByCategory(list) {
  if (!Array.isArray(list)) return [];
  return list.map((r) => ({
    category: r.category ?? r._id ?? "—",
    revenue: toNumber(r.revenue ?? r.totalRevenue ?? r.amount ?? r.value),
  }));
}

function normalizeDaywiseOrders(list) {
  if (!Array.isArray(list)) return [];
  return list.map((r) => ({
    date: r.date ?? r._id ?? r.day ?? "—",
    totalOrders: toNumber(r.totalOrders ?? r.orders ?? r.count ?? r.value),
  }));
}

function normalizeRiderPerformance(list) {
  if (!Array.isArray(list)) return [];
  return list.map((r) => ({
    name: r.name ?? r.riderName ?? r._id ?? "—",
    deliveries: toNumber(
      r.deliveries ?? r.totalDeliveries ?? r.completed ?? r.count ?? r.value,
    ),
  }));
}

function normalizeWorkshopPerformance(list) {
  if (!Array.isArray(list)) return [];
  return list.map((r) => ({
    name: r.name ?? r.workshopName ?? r._id ?? "—",
    orders: toNumber(r.orders ?? r.totalOrders ?? r.count ?? r.value),
  }));
}

function readCssVar(name, fallback) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

function hexToRgba(hex, alpha) {
  if (typeof hex !== "string") return hex;
  const h = hex.trim();
  if (!h.startsWith("#")) return hex;
  const raw = h.slice(1);
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  if (full.length !== 6) return hex;

  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  if (![r, g, b].every((n) => Number.isFinite(n))) return hex;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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
        const [rev, orders, riders, workshops, customers] =
          await Promise.allSettled([
            api.get("/admin/reports/revenue-by-category"),
            api.get("/admin/reports/daywise-orders"),
            api.get("/admin/reports/rider-performance"),
            api.get("/admin/reports/workshop-performance"),
            api.get("/admin/reports/customer-insights"),
          ]);

        if (rev.status === "fulfilled") {
          const list = rev.value?.data ?? rev.value ?? [];
          setRevenueData(normalizeRevenueByCategory(list));
        }
        if (orders.status === "fulfilled") {
          const list = orders.value?.data ?? orders.value ?? [];
          setOrdersData(normalizeDaywiseOrders(list));
        }
        if (riders.status === "fulfilled") {
          const list = riders.value?.data ?? riders.value ?? [];
          setRiderData(normalizeRiderPerformance(list));
        }
        if (workshops.status === "fulfilled") {
          const list = workshops.value?.data ?? workshops.value ?? [];
          setWorkshopData(normalizeWorkshopPerformance(list));
        }
        if (customers.status === "fulfilled") {
          setCustomerData(customers.value?.data ?? customers.value ?? []);
        }
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
      return (
        <p className="text-center py-8 text-on-surface-variant">
          No data available
        </p>
      );
    }
    const keys = columns ?? Object.keys(data[0]);

    const labelForKey = (k) =>
      String(k)
        .replace(/_/g, " ")
        .replace(/([A-Z])/g, " $1")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/^./, (s) => s.toUpperCase());

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-on-surface-variant bg-white/20">
            <tr>
              {keys.map((k) => (
                <th
                  key={k}
                  className="px-5 py-3 font-semibold text-xs uppercase tracking-wider"
                >
                  {labelForKey(k)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                className="border-t border-outline-variant/20 hover:bg-white/30 transition-colors"
              >
                {keys.map((k) => (
                  <td key={k} className="px-5 py-3.5 text-on-surface">
                    {typeof row[k] === "number"
                      ? row[k].toLocaleString()
                      : String(row[k] ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const chartTheme = useMemo(() => {
    const secondary = readCssVar("--color-secondary", "#0f8d65");
    const secondaryFixed = readCssVar("--color-secondary-fixed", "#25c48f");
    const secondaryFixedDim = readCssVar(
      "--color-secondary-fixed-dim",
      "#0ea974",
    );
    const outlineVariant = readCssVar("--color-outline-variant", "#bad7c9");
    const onSurfaceVariant = readCssVar(
      "--color-on-surface-variant",
      "#45464d",
    );

    return {
      secondary,
      secondaryFixed,
      secondaryFixedDim,
      outlineVariant,
      onSurfaceVariant,
      fill: hexToRgba(secondaryFixed, 0.25),
    };
  }, []);

  function renderRevenueChart() {
    if (!Array.isArray(revenueData) || revenueData.length === 0) return null;

    const labels = revenueData.map((d) => d.category);
    const values = revenueData.map((d) => d.revenue);
    const palette = [
      chartTheme.secondary,
      chartTheme.secondaryFixed,
      chartTheme.secondaryFixedDim,
    ];

    const data = {
      labels,
      datasets: [
        {
          label: "Revenue",
          data: values,
          backgroundColor: labels.map((_, i) => palette[i % palette.length]),
          borderColor: "transparent",
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: chartTheme.onSurfaceVariant },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const v = Number(ctx.raw) || 0;
              return `${ctx.label}: $${v.toLocaleString()}`;
            },
          },
        },
      },
    };

    return (
      <div className="px-5 py-5">
        <div className="h-72">
          <Doughnut data={data} options={options} />
        </div>
      </div>
    );
  }

  function renderOrdersChart() {
    if (!Array.isArray(ordersData) || ordersData.length === 0) return null;
    const labels = ordersData.map((d) => d.date);
    const values = ordersData.map((d) => d.totalOrders);

    const data = {
      labels,
      datasets: [
        {
          label: "Orders",
          data: values,
          borderColor: chartTheme.secondary,
          backgroundColor: chartTheme.fill,
          tension: 0.35,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: chartTheme.secondary,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          ticks: { color: chartTheme.onSurfaceVariant },
          grid: { color: hexToRgba(chartTheme.outlineVariant, 0.35) },
        },
        y: {
          beginAtZero: true,
          ticks: { color: chartTheme.onSurfaceVariant, precision: 0 },
          grid: { color: hexToRgba(chartTheme.outlineVariant, 0.35) },
        },
      },
    };

    return (
      <div className="px-5 py-5">
        <div className="h-72">
          <Line data={data} options={options} />
        </div>
      </div>
    );
  }

  function renderHorizontalBarChart(rows, labelKey, valueKey, label) {
    if (!Array.isArray(rows) || rows.length === 0) return null;
    const labels = rows.map((d) => d[labelKey]);
    const values = rows.map((d) => Number(d[valueKey]) || 0);

    const data = {
      labels,
      datasets: [
        {
          label,
          data: values,
          backgroundColor: chartTheme.secondaryFixed,
          borderRadius: 8,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { color: chartTheme.onSurfaceVariant, precision: 0 },
          grid: { color: hexToRgba(chartTheme.outlineVariant, 0.35) },
        },
        y: {
          ticks: { color: chartTheme.onSurfaceVariant },
          grid: { display: false },
        },
      },
    };

    return (
      <div className="px-5 py-5">
        <div className="h-72">
          <Bar data={data} options={options} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Reports & Analytics
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Insights across revenue, operations, and performance.
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg border border-outline-variant bg-white/60 text-on-surface text-sm font-medium hover:bg-white/80 transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-base">download</span>{" "}
          Export Reports
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${activeTab === t.key ? "bg-secondary text-white shadow-md" : "bg-white/40 border border-outline-variant/50 text-on-surface-variant hover:bg-white/60"}`}
          >
            <span className="material-symbols-outlined text-base">
              {t.icon}
            </span>{" "}
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="w-full h-80 rounded-xl" />
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40">
              <Skeleton className="w-48 h-6" />
            </div>
            <div className="p-5">
              <SkeletonTableRow columns={2} />
              <SkeletonTableRow columns={2} />
              <SkeletonTableRow columns={2} />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === "revenue" && (
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40">
                <h3 className="font-semibold text-on-surface">
                  Revenue by Category
                </h3>
              </div>
              {renderRevenueChart()}
              {renderTable(revenueData)}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40">
                <h3 className="font-semibold text-on-surface">
                  Day-wise Orders
                </h3>
              </div>
              {renderOrdersChart()}
              {renderTable(ordersData, ["date", "totalOrders"])}
            </div>
          )}

          {activeTab === "riders" && (
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40">
                <h3 className="font-semibold text-on-surface">
                  Rider Performance
                </h3>
              </div>
              {renderHorizontalBarChart(
                riderData,
                "name",
                "deliveries",
                "Deliveries",
              )}
              {renderTable(riderData, ["name", "deliveries"])}
            </div>
          )}

          {activeTab === "workshops" && (
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40">
                <h3 className="font-semibold text-on-surface">
                  Workshop Performance
                </h3>
              </div>
              {renderHorizontalBarChart(
                workshopData,
                "name",
                "orders",
                "Orders",
              )}
              {renderTable(workshopData, ["name", "orders"])}
            </div>
          )}

          {activeTab === "customers" && (
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40">
                <h3 className="font-semibold text-on-surface">
                  Customer Insights
                </h3>
              </div>
              {renderTable(customerData)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
