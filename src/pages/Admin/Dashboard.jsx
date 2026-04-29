import { useMemo, useState, useEffect } from "react";
import api from "../../lib/api.js";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

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

function formatMoney(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "$0";
  return `$${n.toLocaleString()}`;
}

function formatCount(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString();
}

function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toTitleCase(v) {
  const s = String(v ?? "");
  if (!s) return "—";
  return s
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function getStatusPill(status) {
  const key = String(status ?? "").toLowerCase();
  if (["delivered", "completed"].includes(key)) {
    return { label: toTitleCase(key), cls: "bg-emerald-100 text-emerald-700" };
  }
  if (["confirmed", "picked_up", "in_progress"].includes(key)) {
    return { label: toTitleCase(key), cls: "bg-cyan-100 text-cyan-700" };
  }
  if (["pending"].includes(key)) {
    return { label: toTitleCase(key), cls: "bg-orange-100 text-orange-700" };
  }
  return {
    label: toTitleCase(key),
    cls: "bg-surface-container-high text-on-surface-variant",
  };
}

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [stats, setStats] = useState([
    {
      label: "Total Orders",
      value: "—",
      hint: "",
      icon: "shopping_bag",
      iconBg: "bg-blue-50",
      iconColor: "text-primary",
    },
    {
      label: "Revenue",
      value: "—",
      hint: "",
      icon: "payments",
      iconBg: "bg-emerald-50",
      iconColor: "text-secondary",
    },
    {
      label: "Active Riders",
      value: "—",
      hint: "",
      icon: "two_wheeler",
      iconBg: "bg-cyan-50",
      iconColor: "text-secondary",
    },
    {
      label: "Open Tickets",
      value: "—",
      hint: "",
      icon: "support_agent",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ]);
  const [slaRows, setSlaRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.get("/admin/dashboard/stats");
        setError("");

        if (data?.stats) {
          setStats([
            {
              label: "Total Orders",
              value: String(data.stats.totalOrders ?? "0"),
              hint: data.stats.ordersHint ?? "",
              icon: "shopping_bag",
              iconBg: "bg-blue-50",
              iconColor: "text-primary",
            },
            {
              label: "Revenue",
              value: data.stats.revenue
                ? `$${Number(data.stats.revenue).toLocaleString()}`
                : "$0",
              hint: data.stats.revenueHint ?? "",
              icon: "payments",
              iconBg: "bg-emerald-50",
              iconColor: "text-secondary",
            },
            {
              label: "Active Riders",
              value: String(data.stats.activeRiders ?? "0"),
              hint: data.stats.ridersHint ?? "",
              icon: "two_wheeler",
              iconBg: "bg-cyan-50",
              iconColor: "text-secondary",
            },
            {
              label: "Open Tickets",
              value: String(data.stats.openTickets ?? "0"),
              hint: data.stats.ticketsHint ?? "",
              icon: "support_agent",
              iconBg: "bg-orange-50",
              iconColor: "text-orange-600",
            },
          ]);
          setDashboard(null);
        } else if (data?.overview || data?.periodStats) {
          const overview = data?.overview ?? {};
          const periodStats = data?.periodStats ?? {};
          const period = periodStats.period;

          const periodOrdersRaw =
            overview.totalOrdersPeriod ?? periodStats.ordersCount;
          const periodRevenueRaw = periodStats.revenue;

          const ordersHint =
            period && periodOrdersRaw != null
              ? `${formatCount(periodOrdersRaw)} in ${period}`
              : "";
          const revenueHint =
            period && periodRevenueRaw != null
              ? `${formatMoney(periodRevenueRaw)} in ${period}`
              : "";

          setStats([
            {
              label: "Total Orders",
              value: formatCount(overview.totalOrders ?? 0),
              hint: ordersHint,
              icon: "shopping_bag",
              iconBg: "bg-blue-50",
              iconColor: "text-primary",
            },
            {
              label: "Revenue",
              value: formatMoney(overview.totalRevenue ?? 0),
              hint: revenueHint,
              icon: "payments",
              iconBg: "bg-emerald-50",
              iconColor: "text-secondary",
            },
            {
              label: "Active Riders",
              value: formatCount(overview.activeRiders ?? 0),
              hint: "",
              icon: "two_wheeler",
              iconBg: "bg-cyan-50",
              iconColor: "text-secondary",
            },
            {
              label: "Open Tickets",
              value: formatCount(overview.openTickets ?? 0),
              hint: "",
              icon: "support_agent",
              iconBg: "bg-orange-50",
              iconColor: "text-orange-600",
            },
          ]);
          setDashboard({
            overview,
            periodStats,
            popularServices: Array.isArray(data?.popularServices)
              ? data.popularServices
              : [],
            recentOrders: Array.isArray(data?.recentOrders)
              ? data.recentOrders
              : [],
            areaPerformance: Array.isArray(data?.areaPerformance)
              ? data.areaPerformance
              : [],
          });
        }
        if (data.sla || data.performance) {
          const sla = data.sla ?? data.performance ?? [];
          setSlaRows(
            sla.map((s) => ({
              metric: s.metric ?? s.name,
              value: s.value,
              status: s.status,
              statusColor:
                s.status === "Healthy"
                  ? "bg-emerald-100 text-emerald-700"
                  : s.status === "Monitor"
                    ? "bg-orange-100 text-orange-700"
                    : s.status === "Optimal"
                      ? "bg-cyan-100 text-cyan-700"
                      : "bg-emerald-100 text-emerald-700",
            })),
          );
        }
      } catch (err) {
        setError(err?.message || "Unable to load dashboard stats.");
        setSlaRows([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statusBreakdown = dashboard?.periodStats?.statusBreakdown ?? {};
  const statusLabels = Object.keys(statusBreakdown);
  const statusValues = statusLabels.map((k) => Number(statusBreakdown[k]) || 0);

  const statusChartData = useMemo(() => {
    if (!statusLabels.length) return null;
    return {
      labels: statusLabels.map((s) => toTitleCase(s)),
      datasets: [
        {
          label: "Orders",
          data: statusValues,
          backgroundColor: chartTheme.secondaryFixed,
          borderColor: "transparent",
        },
      ],
    };
  }, [chartTheme.secondaryFixed, statusLabels, statusValues]);

  const popular = dashboard?.popularServices ?? [];
  const popularLabels = popular.map((s) => s?.name ?? s?._id ?? "—");
  const popularCounts = popular.map((s) => Number(s?.totalOrders) || 0);
  const popularWeights = popular.map((s) => Number(s?.totalWeight) || 0);

  const popularChartData = useMemo(() => {
    if (!popularLabels.length) return null;
    return {
      labels: popularLabels,
      datasets: [
        {
          label: "Orders",
          data: popularCounts,
          backgroundColor: popularLabels.map(
            (_, i) =>
              [
                chartTheme.secondary,
                chartTheme.secondaryFixed,
                chartTheme.secondaryFixedDim,
              ][i % 3],
          ),
          borderColor: "transparent",
        },
        {
          label: "Weight",
          data: popularWeights,
          backgroundColor: popularLabels.map(
            (_, i) =>
              [
                chartTheme.fill,
                hexToRgba(chartTheme.secondaryFixedDim, 0.35),
                hexToRgba(chartTheme.secondary, 0.35),
              ][i % 3],
          ),
          borderColor: "transparent",
        },
      ],
    };
  }, [
    chartTheme.secondary,
    chartTheme.secondaryFixed,
    chartTheme.secondaryFixedDim,
    chartTheme.fill,
    popularCounts,
    popularLabels,
    popularWeights,
  ]);

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: chartTheme.onSurfaceVariant } },
      },
      scales: {
        x: {
          ticks: { color: chartTheme.onSurfaceVariant },
          grid: { color: hexToRgba(chartTheme.outlineVariant, 0.35) },
        },
        y: {
          ticks: { color: chartTheme.onSurfaceVariant },
          grid: { color: hexToRgba(chartTheme.outlineVariant, 0.2) },
        },
      },
    };
  }, [chartTheme.onSurfaceVariant, chartTheme.outlineVariant]);

  const popularHorizontalOptions = useMemo(() => {
    return {
      ...chartOptions,
      indexAxis: "y",
      plugins: {
        ...chartOptions.plugins,
        legend: {
          position: "bottom",
          labels: { color: chartTheme.onSurfaceVariant },
        },
      },
    };
  }, [chartOptions, chartTheme.onSurfaceVariant]);

  const extraTiles = useMemo(() => {
    const overview = dashboard?.overview;
    if (!overview) return [];
    return [
      {
        label: "Total Users",
        value: formatCount(overview.totalUsers ?? 0),
        icon: "group",
        iconBg: "bg-cyan-50",
        iconColor: "text-secondary",
      },
      {
        label: "Active Services",
        value: formatCount(overview.activeServices ?? 0),
        icon: "local_laundry_service",
        iconBg: "bg-blue-50",
        iconColor: "text-primary",
      },
      {
        label: "Active Slots",
        value: formatCount(overview.activeSlots ?? 0),
        icon: "schedule",
        iconBg: "bg-emerald-50",
        iconColor: "text-secondary",
      },
      {
        label: "Service Areas",
        value: formatCount(overview.totalAreas ?? 0),
        icon: "map",
        iconBg: "bg-orange-50",
        iconColor: "text-orange-600",
      },
    ];
  }, [dashboard]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Admin Dashboard
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Today at a glance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg border border-outline-variant bg-white/60 text-on-surface text-sm font-medium hover:bg-white/80 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-base">
              calendar_today
            </span>
            Today
          </button>
          <button className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-base">add</span>
            Create Order
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base">info</span>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className={`glass-card rounded-xl p-5 hover:shadow-lg transition-shadow group ${loading ? "animate-pulse" : ""}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-2.5 ${item.iconBg} rounded-lg group-hover:scale-110 transition-transform`}
              >
                <span className={`material-symbols-outlined ${item.iconColor}`}>
                  {item.icon}
                </span>
              </div>
              {item.hint && (
                <span className="text-xs font-bold text-secondary bg-secondary-container/30 px-2 py-1 rounded-full">
                  {item.hint}
                </span>
              )}
            </div>
            <p className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              {item.label}
            </p>
            <p className="text-2xl font-bold text-on-surface mt-1">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {extraTiles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {extraTiles.map((item) => (
            <div
              key={item.label}
              className={`glass-card rounded-xl p-5 hover:shadow-lg transition-shadow group ${loading ? "animate-pulse" : ""}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-2.5 ${item.iconBg} rounded-lg group-hover:scale-110 transition-transform`}
                >
                  <span
                    className={`material-symbols-outlined ${item.iconColor}`}
                  >
                    {item.icon}
                  </span>
                </div>
              </div>
              <p className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                {item.label}
              </p>
              <p className="text-2xl font-bold text-on-surface mt-1">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {(statusChartData || popularChartData) && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {statusChartData && (
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-on-surface">
                    Orders by Status
                  </h3>
                  {dashboard?.periodStats?.period && (
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {dashboard.periodStats.period}
                    </p>
                  )}
                </div>
              </div>
              <div className="p-5 h-72">
                <Bar
                  data={statusChartData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: { display: false },
                    },
                  }}
                />
              </div>
            </div>
          )}

          {popularChartData && (
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-on-surface">
                    Popular Services
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Most ordered services
                  </p>
                </div>
              </div>
              <div className="p-5 h-72">
                <Bar
                  data={popularChartData}
                  options={popularHorizontalOptions}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-on-surface">Recent Orders</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Latest activity
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-on-surface-variant bg-white/20">
              <tr>
                {["Created", "Customer", "Phone", "Status", "Amount"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 font-semibold text-xs uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(dashboard?.recentOrders) &&
                dashboard.recentOrders.slice(0, 10).map((o) => {
                  const pill = getStatusPill(o?.orderStatus);
                  return (
                    <tr
                      key={o?.id ?? o?._id}
                      className="border-t border-outline-variant/20 hover:bg-white/30 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-on-surface">
                        {formatDateTime(o?.createdAt)}
                      </td>
                      <td className="px-5 py-3.5 text-on-surface font-medium">
                        {o?.user?.name ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 text-on-surface">
                        {o?.user?.phone ?? "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${pill.cls}`}
                        >
                          {pill.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-on-surface font-bold">
                        {formatMoney(o?.finalAmount)}
                      </td>
                    </tr>
                  );
                })}

              {(!dashboard ||
                !Array.isArray(dashboard?.recentOrders) ||
                dashboard.recentOrders.length === 0) && (
                <tr className="border-t border-outline-variant/20">
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-on-surface-variant"
                  >
                    No recent orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {slaRows.length > 0 && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
            <h3 className="font-semibold text-on-surface">
              Performance Overview
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-on-surface-variant bg-white/20">
                <tr>
                  <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {slaRows.map((row) => (
                  <tr
                    key={row.metric}
                    className="border-t border-outline-variant/20 hover:bg-white/30 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-on-surface font-medium">
                      {row.metric}
                    </td>
                    <td className="px-5 py-3.5 text-on-surface font-bold">
                      {row.value}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${row.statusColor}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
