import { useState } from "react";

const stats = [
  {
    label: "Active Services",
    value: "142",
    icon: "local_laundry_service",
    badge: "+12%",
    badgeColor: "text-green-600 bg-green-50/70",
    iconBg: "bg-secondary-container/20",
    iconColor: "text-secondary",
  },
  {
    label: "Total Orders",
    value: "8,432",
    icon: "shopping_cart",
    badge: "+8%",
    badgeColor: "text-green-600 bg-green-50/70",
    iconBg: "bg-secondary-fixed/20",
    iconColor: "text-secondary",
  },
  {
    label: "Avg. Revenue / Service",
    value: "$4,210",
    icon: "payments",
    badge: "-2%",
    badgeColor: "text-red-600 bg-red-50/70",
    iconBg: "bg-purple-50/60",
    iconColor: "text-purple-600",
  },
  {
    label: "Service Categories",
    value: "12",
    icon: "category",
    badge: "Stable",
    badgeColor: "text-on-surface-variant bg-white/40",
    iconBg: "bg-amber-50/60",
    iconColor: "text-amber-600",
  },
];

const serviceRows = [
  {
    code: "WF",
    name: "Wash & Fold",
    category: "Standard Laundry",
    price: "$2.50/lb",
    orders: "3,240",
    activatedOn: "Oct 12, 2023",
    revenue: "$24,500.00",
    status: "Active",
    statusColor: "bg-green-100/70 text-green-800",
  },
  {
    code: "DC",
    name: "Dry Cleaning",
    category: "Premium Care",
    price: "$8.99/item",
    orders: "1,892",
    activatedOn: "Nov 05, 2023",
    revenue: "$18,240.50",
    status: "Active",
    statusColor: "bg-green-100/70 text-green-800",
  },
  {
    code: "IP",
    name: "Iron & Press",
    category: "Standard Laundry",
    price: "$3.50/item",
    orders: "2,110",
    activatedOn: "Aug 14, 2023",
    revenue: "$12,110.00",
    status: "Active",
    statusColor: "bg-green-100/70 text-green-800",
  },
  {
    code: "SR",
    name: "Stain Removal",
    category: "Add-on Service",
    price: "$12.00/item",
    orders: "754",
    activatedOn: "Jan 20, 2024",
    revenue: "$9,048.00",
    status: "Under Review",
    statusColor: "bg-blue-100/70 text-blue-800",
  },
  {
    code: "SC",
    name: "Shoe Cleaning",
    category: "Specialty",
    price: "$15.00/pair",
    orders: "421",
    activatedOn: "Feb 02, 2024",
    revenue: "$6,700.25",
    status: "Paused",
    statusColor: "bg-red-100/70 text-red-600",
  },
];

const zoneData = [
  { name: "Wash & Fold", percent: 82, color: "#0b5a49" },
  { name: "Dry Cleaning", percent: 95, color: "#0f8d65" },
  { name: "Iron & Press", percent: 45, color: "#f59e0b" },
];

export default function ServicesRateCard() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = serviceRows.filter(
    (s) =>
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Page Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface mb-1">
            Rate Card & Services
          </h1>
          <p className="text-on-surface-variant flex items-center gap-2 text-sm">
            <span>Management</span>
            <span className="material-symbols-outlined text-[14px]">
              chevron_right
            </span>
            <span className="text-secondary font-semibold">
              Service Pricing
            </span>
          </p>
        </div>
        <button
          className="px-6 py-2.5 text-white font-semibold rounded-lg flex items-center gap-2 hover:scale-[1.02] transition-all shadow-md active:scale-95 duration-150"
          style={{ background: "linear-gradient(135deg, #0b5a49, #0f8d65)" }}
        >
          <span className="material-symbols-outlined">add_circle</span>
          New Service
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass-card p-5 rounded-xl flex flex-col gap-4 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div
                className={`w-10 h-10 ${stat.iconBg} rounded-lg flex items-center justify-center`}
              >
                <span
                  className={`material-symbols-outlined ${stat.iconColor}`}
                >
                  {stat.icon}
                </span>
              </div>
              <span
                className={`text-xs font-bold ${stat.badgeColor} px-2 py-1 rounded-full`}
              >
                {stat.badge}
              </span>
            </div>
            <div>
              <p className="text-on-surface-variant text-xs uppercase font-bold tracking-wider mb-1">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold text-on-surface">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="glass-card rounded-xl overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/20">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">
              Service Catalog
            </h3>
            <div className="flex items-center gap-2 bg-white/40 px-3 py-1.5 rounded-lg border border-outline-variant/30">
              <span className="material-symbols-outlined text-sm text-outline">
                filter_list
              </span>
              <span className="text-xs font-medium text-on-surface-variant">
                Filters
              </span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="relative w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                search
              </span>
              <input
                className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-sm"
                placeholder="Search services..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-1.5 text-outline hover:text-secondary transition-colors">
              <span className="material-symbols-outlined text-lg">
                download
              </span>
            </button>
            <button className="p-1.5 text-outline hover:text-secondary transition-colors">
              <span className="material-symbols-outlined text-lg">
                more_vert
              </span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/15 border-b border-outline-variant/20">
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Service
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">
                  Price
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">
                  Orders
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Since
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">
                  Revenue
                </th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredServices.map((row) => (
                <tr
                  key={row.code}
                  className="hover:bg-secondary/5 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, #0b5a49, #0f8d65)",
                        }}
                      >
                        {row.code}
                      </div>
                      <span className="text-sm font-semibold text-on-surface group-hover:text-secondary transition-colors">
                        {row.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant font-medium">
                    {row.category}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-data-tabular text-data-tabular bg-secondary-container/15 px-2 py-1 rounded text-secondary font-semibold">
                      {row.price}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-data-tabular text-sm font-bold text-on-surface">
                      {row.orders}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {row.activatedOn}
                  </td>
                  <td className="px-6 py-4 text-right font-data-tabular text-sm font-bold text-secondary">
                    {row.revenue}
                  </td>
                  <td className="px-6 py-4">
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

        {/* Pagination */}
        <div className="px-6 py-4 bg-white/15 border-t border-outline-variant/20 flex items-center justify-between">
          <p className="text-xs font-medium text-on-surface-variant">
            Showing 1 to {filteredServices.length} of 142 entries
          </p>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/40 text-outline hover:bg-white/40 transition-colors">
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded text-white text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, #0b5a49, #0f8d65)",
              }}
            >
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/40 text-on-surface-variant text-xs font-bold hover:bg-white/40 transition-colors">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/40 text-on-surface-variant text-xs font-bold hover:bg-white/40 transition-colors">
              3
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/40 text-outline hover:bg-white/40 transition-colors">
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Map + Zone Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pricing Overview */}
        <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden min-h-[320px] relative">
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              background: `
                linear-gradient(135deg, rgba(236, 251, 243, 0.95) 0%, rgba(227, 248, 236, 0.8) 50%, rgba(214, 235, 224, 0.9) 100%),
                radial-gradient(circle at 30% 40%, rgba(37, 196, 143, 0.15), transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(11, 90, 73, 0.1), transparent 50%)
              `,
            }}
          >
            {/* Grid lines for visual texture */}
            <svg
              className="absolute inset-0 w-full h-full opacity-10"
              viewBox="0 0 800 400"
            >
              {[100, 200, 300, 400, 500, 600, 700].map((x) => (
                <line
                  key={`v-${x}`}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="400"
                  stroke="#0f8d65"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              ))}
              {[80, 160, 240, 320].map((y) => (
                <line
                  key={`h-${y}`}
                  x1="0"
                  y1={y}
                  x2="800"
                  y2={y}
                  stroke="#0f8d65"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              ))}
            </svg>

            {/* Floating info card */}
            <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-outline-variant/20 flex flex-col gap-3 z-10">
              <h4 className="text-xs font-bold uppercase text-on-surface-variant tracking-wider">
                Price Distribution
              </h4>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-xs font-medium text-on-surface">
                  Premium Tier ($8+)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: "#25c48f" }}
                />
                <span className="text-xs font-medium text-on-surface">
                  Standard Tier ($2-8)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: "#8af0cd" }}
                />
                <span className="text-xs font-medium text-on-surface">
                  Economy Tier (&lt;$2)
                </span>
              </div>
            </div>

            {/* Decorative chart bars */}
            <div className="absolute bottom-8 left-8 right-8 flex items-end justify-around gap-2 h-48 z-10">
              {[65, 95, 45, 78, 88, 55, 70, 82].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md transition-all duration-500 hover:opacity-90"
                  style={{
                    height: `${h}%`,
                    background: `linear-gradient(to top, #0b5a49, ${
                      h > 80
                        ? "#25c48f"
                        : h > 60
                        ? "#0f8d65"
                        : "#8af0cd"
                    })`,
                    opacity: 0.7,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Service Performance */}
        <div className="glass-card p-6 rounded-xl flex flex-col gap-6">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">
            Service Performance
          </h3>
          <div className="space-y-6">
            {zoneData.map((zone) => (
              <div key={zone.name} className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-on-surface-variant">
                    {zone.name}
                  </span>
                  <span
                    className="font-bold"
                    style={{ color: zone.color }}
                  >
                    {zone.percent}% Capacity
                  </span>
                </div>
                <div className="w-full bg-white/30 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${zone.percent}%`,
                      background: `linear-gradient(90deg, ${zone.color}, ${
                        zone.color === "#f59e0b" ? "#fbbf24" : "#25c48f"
                      })`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto p-4 bg-white/20 rounded-lg border border-dashed border-outline-variant/40">
            <p className="text-[11px] text-on-surface-variant leading-relaxed italic">
              &quot;Dry Cleaning at peak capacity. Consider adding express
              tier pricing for premium turnaround to optimize revenue per
              item.&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
