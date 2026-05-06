import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../../components/Skeleton.jsx";
import api from "../../lib/api.js";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
);

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
  if (!Number.isFinite(n)) return "₹0";
  return `₹${n.toLocaleString()}`;
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

function readCount(source, keys, fallback = 0) {
  for (const key of keys) {
    const value = source?.[key];
    if (value == null || value === "") continue;
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
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
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [revenueDataRes, setRevenueDataRes] = useState(null);
  const [trendsDataRes, setTrendsDataRes] = useState(null);
  const [slaRows, setSlaRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Calendar UI removed: state for calendar has been deleted.

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

  // Calendar-related helpers and effects removed.
  const displayedMonthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        month: "long",
        year: "numeric",
      }).format(new Date()),
    [],
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const [dashboardRes, revenueRes, trendsRes] = await Promise.allSettled([
          api.get("/admin/dashboard/stats"),
          api.get("/admin/dashboard/revenue"),
          api.get("/admin/dashboard/orders-trends"),
        ]);
        setError("");

        const data =
          dashboardRes.status === "fulfilled" ? dashboardRes.value : null;

        if (revenueRes.status === "fulfilled") {
          setRevenueDataRes(revenueRes.value);
        }
        if (trendsRes.status === "fulfilled") {
          setTrendsDataRes(trendsRes.value);
        }
        if (data?.overview || data?.periodStats) {
          const overview = data?.overview ?? {};
          const periodStats = data?.periodStats ?? {};
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
        if (data?.sla || data?.performance) {
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

  function handleCreateOrder() {
    navigate("/admin/create-order");
  }

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

  const dueDeliveryData = useMemo(() => {
    // Assuming trendsDataRes has a dueDelivery array or similar.
    // If not, we fallback to static data until the backend format is known.
    const labels = trendsDataRes?.dueDelivery?.labels || [
      "07-Mar",
      "08-Mar",
      "09-Mar",
      "10-Mar",
      "11-Mar",
      "12-Mar",
      "13-Mar",
    ];
    const data = trendsDataRes?.dueDelivery?.data || [
      10, 16, 18, 20, 25, 18, 6,
    ];

    return {
      labels,
      datasets: [
        {
          label: "Orders",
          data,
          backgroundColor: "#3b82f6",
          barThickness: 16,
          borderRadius: 2,
        },
      ],
    };
  }, [trendsDataRes]);

  const dayWiseData = useMemo(() => {
    const labels = trendsDataRes?.dayWise?.labels || [
      "01-Mar",
      "02-Mar",
      "03-Mar",
      "04-Mar",
      "05-Mar",
      "06-Mar",
      "07-Mar",
    ];
    const data = trendsDataRes?.dayWise?.data || [10, 15, 16, 12, 11, 18, 6];

    return {
      labels,
      datasets: [
        {
          label: "Orders",
          data,
          backgroundColor: "#3b82f6",
          barThickness: 16,
          borderRadius: 2,
        },
      ],
    };
  }, [trendsDataRes]);

  const revenuePieData = useMemo(() => {
    const labels = revenueDataRes?.services?.labels || [
      "Dry Cleaning",
      "Shoe Cleaning",
      "Curtain Cleaning",
      "Wash and Fold",
    ];
    const data = revenueDataRes?.services?.data || [50000, 10000, 25000, 20000];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["#3b82f6", "#f97316", "#a8a29e", "#eab308"],
          borderWidth: 1,
        },
      ],
    };
  }, [revenueDataRes]);

  const customersPieData = useMemo(() => {
    const labels = dashboard?.customers?.labels || [
      "Returning Customers",
      "New Customers",
    ];
    const data = dashboard?.customers?.data || [35, 5];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["#3b82f6", "#f97316"],
          borderWidth: 1,
        },
      ],
    };
  }, [dashboard]);

  const pieOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            color: chartTheme.onSurfaceVariant,
            usePointStyle: true,
            boxWidth: 8,
          },
        },
      },
    };
  }, [chartTheme.onSurfaceVariant]);

  const monthOverviewTiles = useMemo(() => {
    const overview = dashboard?.overview ?? {};
    const periodStats = dashboard?.periodStats ?? {};
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

    return [
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
    ];
  }, [dashboard]);

  const liveDataTiles = useMemo(() => {
    const overview = dashboard?.overview ?? {};
    const periodStats = dashboard?.periodStats ?? {};
    const statusBreakdown = periodStats.statusBreakdown ?? {};

    const pickupPending = readCount(statusBreakdown, [
      "pickup_pending",
      "pending_pickup",
      "pickupPending",
      "pending",
    ]);
    const warehouseInProgress = readCount(statusBreakdown, [
      "in_warehouse",
      "warehouse_in_progress",
      "warehouse",
      "processing",
    ]);
    const ownInProgress = readCount(statusBreakdown, [
      "in_progress",
      "in_progress_own",
      "own_in_progress",
      "ongoing",
    ]);
    const overdueOrders = readCount(statusBreakdown, [
      "overdue",
      "over_due",
      "due",
      "delayed",
    ]);
    const expressDelivery = readCount(statusBreakdown, [
      "express",
      "express_delivery",
      "rush",
      "priority",
    ]);
    const deliveryPending = readCount(statusBreakdown, [
      "delivery_pending",
      "out_for_delivery",
      "pending_delivery",
    ]);
    const openTickets = readCount(overview, [
      "openTickets",
      "ticketsOpen",
      "ticketCount",
    ]);
    const dueForCollection = readCount(
      overview,
      ["dueForCollection", "due_collection", "collectionsDue"],
      readCount(statusBreakdown, ["due_for_collection", "collection_due"]),
    );

    return [
      {
        label: "Pickup Pending",
        value: formatCount(pickupPending),
        icon: "inventory_2",
        iconBg: "bg-blue-50",
        iconColor: "text-primary",
      },
      {
        label: "In Progress Warehouse",
        value: formatCount(warehouseInProgress),
        icon: "warehouse",
        iconBg: "bg-orange-50",
        iconColor: "text-orange-600",
      },
      {
        label: "In-Progress Own",
        value: formatCount(ownInProgress),
        icon: "local_shipping",
        iconBg: "bg-cyan-50",
        iconColor: "text-secondary",
      },
      {
        label: "Over Due Orders",
        value: formatCount(overdueOrders),
        icon: "schedule",
        iconBg: "bg-rose-50",
        iconColor: "text-rose-600",
      },
      {
        label: "Express Delivery",
        value: formatCount(expressDelivery),
        icon: "bolt",
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
      },
      {
        label: "Delivery Pending",
        value: formatCount(deliveryPending),
        icon: "pending_actions",
        iconBg: "bg-teal-50",
        iconColor: "text-teal-600",
      },
      {
        label: "Open Tickets",
        value: formatCount(openTickets),
        icon: "support_agent",
        iconBg: "bg-orange-50",
        iconColor: "text-orange-600",
      },
      {
        label: "Due for Collection",
        value: formatCount(dueForCollection),
        icon: "payments",
        iconBg: "bg-emerald-50",
        iconColor: "text-secondary",
      },
    ];
  }, [dashboard]);

  useEffect(() => {
    // Calendar click/scroll handlers removed.
    return () => {};
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-headline-md text-headline-md text-on-surface leading-tight">
            Admin Dashboard
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Today at a glance
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleCreateOrder}
            className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-gradient-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
          >
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

      <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] items-stretch gap-4">
        <section className="flex h-full min-h-[180px] flex-col rounded-3xl border border-outline-variant/30 bg-[#e8eef7] p-3.5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-on-surface">
                Current Month
              </h3>
              <p className="text-xs uppercase tracking-[0.24em] text-on-surface-variant mt-1">
                {displayedMonthLabel}
              </p>
            </div>
            <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-on-surface-variant">
              Overview
            </span>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {(loading ? [0, 1] : monthOverviewTiles).map((item, index) => (
              <div
                key={loading ? index : item.label}
                className="min-h-[100px] rounded-2xl border border-white/60 bg-white/90 px-4 py-4 shadow-sm min-w-0"
              >
                {loading ? (
                  <Skeleton className="h-16 w-full rounded-xl" />
                ) : (
                  <div className="flex flex-col h-full gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`shrink-0 rounded-xl ${item.iconBg} p-2`}>
                        <span
                          className={`material-symbols-outlined text-[20px] ${item.iconColor}`}
                        >
                          {item.icon}
                        </span>
                      </div>
                      <p className="text-sm text-on-surface-variant font-medium leading-tight truncate min-w-0">
                        {item.label}
                      </p>
                    </div>
                    <div className="min-w-0 mt-auto">
                      <p className="text-2xl font-bold text-on-surface leading-none">
                        {item.value}
                      </p>
                      {item.hint && (
                        <span className="inline-block mt-1.5 rounded-full bg-secondary-container/30 px-2 py-0.5 text-[10px] font-bold text-secondary leading-tight max-w-full truncate">
                          {item.hint}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="flex h-full min-h-[180px] flex-col rounded-3xl border border-outline-variant/30 bg-[#fde5d6] p-3.5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-on-surface">
                Live Data
              </h3>
              <p className="text-xs uppercase tracking-[0.24em] text-on-surface-variant mt-1">
                Operational status
              </p>
            </div>
            <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-on-surface-variant">
              Real time
            </span>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 xl:grid-cols-4 content-start min-w-0">
            {(loading ? Array.from({ length: 8 }) : liveDataTiles).map(
              (item, index) => (
                <div
                  key={loading ? index : item.label}
                  className="rounded-2xl border border-white/70 bg-white/90 px-3 py-3.5 shadow-sm min-w-0"
                >
                  {loading ? (
                    <Skeleton className="h-16 w-full rounded-xl" />
                  ) : (
                    <div className="flex flex-col min-h-[72px]">
                      <div
                        className={`self-start rounded-xl ${item.iconBg} p-2`}
                      >
                        <span
                          className={`material-symbols-outlined text-[20px] ${item.iconColor}`}
                        >
                          {item.icon}
                        </span>
                      </div>
                      <div className="mt-2 min-w-0">
                        <p className="text-[11px] leading-tight text-on-surface-variant font-semibold line-clamp-2">
                          {item.label}
                        </p>
                        <p className="text-xl font-bold text-on-surface mt-1 leading-none">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <div className="glass-card rounded-xl overflow-hidden flex flex-col min-w-0">
            <div className="px-5 py-3 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
              <div className="w-16" />
              <h3 className="text-sm font-semibold text-on-surface text-center flex-1">
                Orders Due for Delivery
              </h3>
              <span className="px-3 py-1 bg-emerald-300 text-emerald-900 text-xs font-bold rounded shadow-sm">
                7 Days
              </span>
            </div>
            <div className="p-4 h-56">
              {loading ? (
                <Skeleton className="w-full h-full rounded-lg" />
              ) : (
                <Bar
                  data={dueDeliveryData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: { display: false },
                    },
                  }}
                />
              )}
            </div>
          </div>
          <div className="glass-card rounded-xl overflow-hidden flex flex-col min-w-0">
            <div className="px-5 py-3 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
              <div className="w-16" />
              <h3 className="text-sm font-semibold text-on-surface text-center flex-1">
                Day wise Orders Placed
              </h3>
              <span className="px-3 py-1 bg-emerald-300 text-emerald-900 text-xs font-bold rounded shadow-sm">
                30 Days
              </span>
            </div>
            <div className="p-4 h-56">
              {loading ? (
                <Skeleton className="w-full h-full rounded-lg" />
              ) : (
                <Bar
                  data={dayWiseData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: { display: false },
                    },
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="glass-card rounded-xl overflow-hidden flex flex-col min-w-0">
            <div className="px-5 py-3 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
              <div className="w-24" />
              <h3 className="text-sm font-semibold text-on-surface text-center flex-1">
                Revenue - Service Category
              </h3>
              <span className="px-3 py-1 bg-emerald-300 text-emerald-900 text-xs font-bold rounded shadow-sm whitespace-nowrap">
                Current Month
              </span>
            </div>
            <div className="p-4 h-56">
              {loading ? (
                <Skeleton className="w-full h-full rounded-lg flex items-center justify-center" />
              ) : (
                <Pie data={revenuePieData} options={pieOptions} />
              )}
            </div>
          </div>
          <div className="glass-card rounded-xl overflow-hidden flex flex-col min-w-0">
            <div className="px-5 py-3 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
              <div className="w-24" />
              <h3 className="text-sm font-semibold text-on-surface text-center flex-1">
                Customers
              </h3>
              <span className="px-3 py-1 bg-emerald-300 text-emerald-900 text-xs font-bold rounded shadow-sm whitespace-nowrap">
                Current Month
              </span>
            </div>
            <div className="p-4 h-56">
              {loading ? (
                <Skeleton className="w-full h-full rounded-lg flex items-center justify-center" />
              ) : (
                <Pie data={customersPieData} options={pieOptions} />
              )}
            </div>
          </div>
        </div>
      </div>

      {(statusChartData || popularChartData) && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {statusChartData && (
            <div className="glass-card rounded-xl overflow-hidden min-w-0">
              <div className="px-5 py-4 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
                <div>
                  {dashboard?.periodStats?.period && (
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {dashboard.periodStats.period}
                    </p>
                  )}
                </div>
              </div>
              <div className="p-5 h-72">
                {loading ? (
                  <Skeleton className="w-full h-full rounded-lg" />
                ) : (
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
                )}
              </div>
            </div>
          )}

          {popularChartData && (
            <div className="glass-card rounded-xl overflow-hidden min-w-0">
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
                {loading ? (
                  <Skeleton className="w-full h-full rounded-lg" />
                ) : (
                  <Bar
                    data={popularChartData}
                    options={popularHorizontalOptions}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="glass-card rounded-xl overflow-hidden min-w-0">
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
        <div className="glass-card rounded-xl overflow-hidden min-w-0">
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
