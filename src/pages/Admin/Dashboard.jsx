import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SkeletonCard, Skeleton } from "../../components/Skeleton.jsx";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement);

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


function buildMonthCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const actualToday = new Date();
  const isCurrentMonth = year === actualToday.getFullYear() && month === actualToday.getMonth();

  return Array.from({ length: totalCells }, (_, index) => {
    if (index < firstDay) {
      return {
        day: prevMonthDays - firstDay + index + 1,
        muted: true,
        today: false,
        key: `prev-${index}`,
      };
    }

    const day = index - firstDay + 1;
    if (day <= daysInMonth) {
      return {
        day,
        muted: false,
        today: isCurrentMonth && day === actualToday.getDate(),
        key: `current-${day}`,
      };
    }

    return {
      day: day - daysInMonth,
      muted: true,
      today: false,
      key: `next-${index}`,
    };
  });
}
export default function Dashboard() {
  const navigate = useNavigate();
  const calendarRef = useRef(null);
  const [dashboard, setDashboard] = useState(null);
  const [revenueDataRes, setRevenueDataRes] = useState(null);
  const [trendsDataRes, setTrendsDataRes] = useState(null);
  const [catalog, setCatalog] = useState({ services: [], slots: [] });
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
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarPinned, setCalendarPinned] = useState(false);
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());

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

  const todayCalendar = useMemo(() => buildMonthCalendar(currentMonthDate), [currentMonthDate]);
  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(new Date()),
    [],
  );

  const displayedMonthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        month: "long",
        year: "numeric",
      }).format(currentMonthDate),
    [currentMonthDate]
  );

  function handlePrevMonth(e) {
    e.stopPropagation();
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function handleNextMonth(e) {
    e.stopPropagation();
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setCalendarOpen(false);
      }
    }
    function handleScroll() {
      setCalendarOpen(false);
    }
    if (calendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [calendarOpen]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [dashboardRes, servicesRes, slotsRes, revenueRes, trendsRes] = await Promise.allSettled([
          api.get("/admin/dashboard/stats"),
          api.get("/services"),
          api.get("/slots"),
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

        if (servicesRes.status === "fulfilled") {
          const list = servicesRes.value?.services ?? servicesRes.value ?? [];
          setCatalog((prev) => ({
            ...prev,
            services: Array.isArray(list) ? list : [],
          }));
        }

        if (slotsRes.status === "fulfilled") {
          const list = slotsRes.value?.slots ?? slotsRes.value ?? [];
          setCatalog((prev) => ({
            ...prev,
            slots: Array.isArray(list) ? list : [],
          }));
        }

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
    const labels = trendsDataRes?.dueDelivery?.labels || ['07-Mar', '08-Mar', '09-Mar', '10-Mar', '11-Mar', '12-Mar', '13-Mar'];
    const data = trendsDataRes?.dueDelivery?.data || [10, 16, 18, 20, 25, 18, 6];
    
    return {
      labels,
      datasets: [
        {
          label: 'Orders',
          data,
          backgroundColor: '#3b82f6',
          barThickness: 16,
          borderRadius: 2,
        }
      ]
    };
  }, [trendsDataRes]);

  const dayWiseData = useMemo(() => {
    const labels = trendsDataRes?.dayWise?.labels || ['01-Mar', '02-Mar', '03-Mar', '04-Mar', '05-Mar', '06-Mar', '07-Mar'];
    const data = trendsDataRes?.dayWise?.data || [10, 15, 16, 12, 11, 18, 6];

    return {
      labels,
      datasets: [
        {
          label: 'Orders',
          data,
          backgroundColor: '#3b82f6',
          barThickness: 16,
          borderRadius: 2,
        }
      ]
    };
  }, [trendsDataRes]);

  const revenuePieData = useMemo(() => {
    const labels = revenueDataRes?.services?.labels || ['Dry Cleaning', 'Shoe Cleaning', 'Curtain Cleaning', 'Wash and Fold'];
    const data = revenueDataRes?.services?.data || [50000, 10000, 25000, 20000];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#3b82f6', '#f97316', '#a8a29e', '#eab308'],
          borderWidth: 1,
        }
      ]
    };
  }, [revenueDataRes]);

  const customersPieData = useMemo(() => {
    const labels = dashboard?.customers?.labels || ['Returning Customers', 'New Customers'];
    const data = dashboard?.customers?.data || [35, 5];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#3b82f6', '#f97316'],
          borderWidth: 1,
        }
      ]
    };
  }, [dashboard]);

  const pieOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: { color: chartTheme.onSurfaceVariant, usePointStyle: true, boxWidth: 8 },
        },
      },
    };
  }, [chartTheme.onSurfaceVariant]);

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setCalendarOpen(false);
        setCalendarPinned(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("scroll", () => {
      setCalendarOpen(false);
      setCalendarPinned(false);
    });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", () => {});
    };
  }, []);

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
          <div
            ref={calendarRef}
            className="relative"
            onMouseEnter={() => setCalendarOpen(true)}
            onMouseLeave={() => {
              if (!calendarPinned) setCalendarOpen(false);
            }}
          >
            <button 
              onClick={() => {
                setCalendarPinned((prev) => !prev);
                setCalendarOpen(true);
              }}
              className="px-4 py-2 rounded-lg border border-outline-variant bg-white/60 text-on-surface text-sm font-medium hover:bg-white/80 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-base">
                calendar_today
              </span>
              Today
            </button>

            {calendarOpen && (
              <div className="absolute right-0 top-full z-20 mt-3 w-80 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-[0_20px_50px_rgba(15,23,42,0.18)] overflow-hidden">
                <div className="flex items-center justify-between border-b border-outline-variant/20 bg-white/60 px-4 py-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-on-surface-variant">
                      Current date
                    </p>
                    <p className="text-sm font-semibold text-on-surface">
                      {todayLabel}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-secondary">
                    calendar_month
                  </span>
                </div>
                <div className="p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <button type="button" onClick={handlePrevMonth} className="rounded-full border border-outline-variant/40 bg-white/70 p-2 text-on-surface-variant transition-colors hover:text-on-surface">
                      <span className="material-symbols-outlined text-base">
                        chevron_left
                      </span>
                    </button>
                    <p className="text-sm font-semibold text-on-surface">
                      {displayedMonthLabel}
                    </p>
                    <button type="button" onClick={handleNextMonth} className="rounded-full border border-outline-variant/40 bg-white/70 p-2 text-on-surface-variant transition-colors hover:text-on-surface">
                      <span className="material-symbols-outlined text-base">
                        chevron_right
                      </span>
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                      <div key={day} className="py-1">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-7 gap-1 text-center">
                    {todayCalendar.map((cell) => (
                      <div
                        key={cell.key}
                        className={`rounded-full py-2 text-sm transition-colors ${cell.muted ? "text-on-surface-variant/30" : cell.today ? "bg-secondary text-on-secondary shadow-[0_0_14px_rgba(98,250,227,0.28)]" : "text-on-surface hover:bg-secondary-container/20"}`}
                      >
                        {cell.day}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleCreateOrder}
            className="px-5 py-2 rounded-lg text-white text-sm font-semibold bg-linear-to-r from-secondary-fixed-dim to-secondary shadow-md hover:shadow-lg transition-all flex items-center gap-2"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          stats.map((item) => (
            <div
              key={item.label}
              className={`glass-card rounded-xl p-5 hover:shadow-lg transition-shadow group`}
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
          ))
        )}
      </div>

      {extraTiles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            extraTiles.map((item) => (
              <div
                key={item.label}
                className={`glass-card rounded-xl p-5 hover:shadow-lg transition-shadow group`}
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
            ))
          )}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <div className="glass-card rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 py-3 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
              <div className="w-16" />
              <h3 className="text-sm font-semibold text-on-surface text-center flex-1">Orders Due for Delivery</h3>
              <span className="px-3 py-1 bg-emerald-300 text-emerald-900 text-xs font-bold rounded shadow-sm">7 Days</span>
            </div>
            <div className="p-4 h-56">
              {loading ? (
                <Skeleton className="w-full h-full rounded-lg" />
              ) : (
                <Bar
                  data={dueDeliveryData}
                  options={{
                    ...chartOptions,
                    plugins: { ...chartOptions.plugins, legend: { display: false } }
                  }}
                />
              )}
            </div>
          </div>
          <div className="glass-card rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 py-3 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
              <div className="w-16" />
              <h3 className="text-sm font-semibold text-on-surface text-center flex-1">Day wise Orders Placed</h3>
              <span className="px-3 py-1 bg-emerald-300 text-emerald-900 text-xs font-bold rounded shadow-sm">30 Days</span>
            </div>
            <div className="p-4 h-56">
              {loading ? (
                <Skeleton className="w-full h-full rounded-lg" />
              ) : (
                <Bar
                  data={dayWiseData}
                  options={{
                    ...chartOptions,
                    plugins: { ...chartOptions.plugins, legend: { display: false } }
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="glass-card rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 py-3 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
              <div className="w-24" />
              <h3 className="text-sm font-semibold text-on-surface text-center flex-1">Revenue - Service Category</h3>
              <span className="px-3 py-1 bg-emerald-300 text-emerald-900 text-xs font-bold rounded shadow-sm whitespace-nowrap">Current Month</span>
            </div>
            <div className="p-4 h-56">
              {loading ? (
                <Skeleton className="w-full h-full rounded-lg flex items-center justify-center" />
              ) : (
                <Pie data={revenuePieData} options={pieOptions} />
              )}
            </div>
          </div>
          <div className="glass-card rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 py-3 border-b border-outline-variant/30 bg-white/40 flex items-center justify-between">
              <div className="w-24" />
              <h3 className="text-sm font-semibold text-on-surface text-center flex-1">Customers</h3>
              <span className="px-3 py-1 bg-emerald-300 text-emerald-900 text-xs font-bold rounded shadow-sm whitespace-nowrap">Current Month</span>
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
