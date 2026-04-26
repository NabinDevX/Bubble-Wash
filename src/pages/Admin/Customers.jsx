import { useState } from "react";

const stats = [
  {
    label: "Total Customers",
    value: "2,451",
    icon: "groups",
    trend: "+12% from last month",
    trendUp: true,
    iconBg: "bg-secondary-container/30",
    iconColor: "text-secondary",
  },
  {
    label: "Active",
    value: "1,890",
    icon: "check_circle",
    trend: "Ordered in last 30 days",
    trendUp: null,
    iconBg: "bg-green-100/60",
    iconColor: "text-green-700",
  },
  {
    label: "Inactive",
    value: "561",
    icon: "pause_circle",
    trend: "> 30 days since last order",
    trendUp: null,
    iconBg: "bg-red-100/60",
    iconColor: "text-red-600",
  },
  {
    label: "Returning",
    value: "1,420",
    icon: "replay",
    trend: "75% retention rate",
    trendUp: null,
    iconBg: "bg-secondary-fixed/30",
    iconColor: "text-secondary",
  },
  {
    label: "New This Month",
    value: "124",
    icon: "fiber_new",
    trend: "Goal: 150",
    trendUp: null,
    iconBg: "bg-white/60",
    iconColor: "text-primary",
    highlight: true,
  },
];

const customerData = [
  {
    initials: "JS",
    name: "John Smith",
    id: "CUS-001",
    joined: "Jan 2023",
    phone: "+1 (555) 123-4567",
    status: "Active",
    billing: "$1,245.00",
    due: "$45.00",
    dueColor: "text-red-600",
    orders: 24,
  },
  {
    initials: "ED",
    name: "Emily Davis",
    id: "CUS-002",
    joined: "Mar 2023",
    phone: "+1 (555) 987-6543",
    status: "Inactive",
    billing: "$850.50",
    due: "$0.00",
    dueColor: "text-on-surface-variant",
    orders: 12,
  },
  {
    initials: "MW",
    name: "Michael Wilson",
    id: "CUS-003",
    joined: "Nov 2023",
    phone: "+1 (555) 456-7890",
    status: "Active",
    billing: "$3,200.00",
    due: "$150.00",
    dueColor: "text-red-600",
    orders: 45,
  },
  {
    initials: "SP",
    name: "Sarah Parker",
    id: "CUS-004",
    joined: "Jun 2024",
    phone: "+1 (555) 321-0987",
    status: "Active",
    billing: "$620.00",
    due: "$0.00",
    dueColor: "text-on-surface-variant",
    orders: 8,
  },
  {
    initials: "RJ",
    name: "Robert Johnson",
    id: "CUS-005",
    joined: "Sep 2023",
    phone: "+1 (555) 654-3210",
    status: "Inactive",
    billing: "$1,890.75",
    due: "$230.00",
    dueColor: "text-red-600",
    orders: 31,
  },
];

export default function Customers() {
  const [filter, setFilter] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customerData.filter((c) => {
    const matchesStatus =
      filter === "All Status" || c.status === filter;
    const matchesSearch =
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      {/* Page Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Customer Management
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Manage your customer base and view details.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/50 border border-outline-variant/50 rounded-lg shadow-sm hover:shadow-md hover:border-secondary/30 transition-all text-sm font-medium text-on-surface backdrop-blur-sm">
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-sm hover:shadow-md transition-all text-sm font-medium"
            style={{ background: "linear-gradient(135deg, #0b5a49, #0f8d65)" }}>
            <span className="material-symbols-outlined text-[18px]">
              person_add
            </span>
            New Customer
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`glass-card rounded-xl p-5 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 ${
              stat.highlight
                ? "bg-gradient-to-br from-secondary-container/15 to-white/30"
                : ""
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <p className="text-sm font-medium text-on-surface-variant">
                {stat.label}
              </p>
              <div
                className={`p-1.5 ${stat.iconBg} rounded-lg ${stat.iconColor}`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {stat.icon}
                </span>
              </div>
            </div>
            <div>
              <h3
                className={`font-headline-md text-[28px] ${
                  stat.highlight ? "text-secondary" : "text-on-surface"
                }`}
              >
                {stat.value}
              </h3>
              {stat.trendUp === true ? (
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px]">
                    trending_up
                  </span>
                  {stat.trend}
                </p>
              ) : (
                <p className={`text-xs mt-1 ${stat.highlight ? "text-secondary font-medium" : "text-on-surface-variant"}`}>
                  {stat.trend}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Data Table Section */}
      <div className="glass-card rounded-xl overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/30">
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              className="glass-input w-full pl-10 pr-4 py-2 rounded-lg text-sm"
              placeholder="Filter customers..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="px-3 py-1.5 border border-outline-variant/50 rounded-md text-sm font-medium flex items-center gap-1 hover:bg-white/40 transition-colors bg-white/20">
              <span className="material-symbols-outlined text-[18px]">
                filter_list
              </span>
              Filter
            </button>
            <select
              className="px-3 py-1.5 border border-outline-variant/50 rounded-md text-sm font-medium bg-white/30 hover:bg-white/50 outline-none focus:ring-2 focus:ring-secondary/30 transition-all"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/20 text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider border-b border-outline-variant/30">
                <th className="p-4 font-semibold w-12">
                  <input
                    className="rounded border-outline-variant/50 text-secondary focus:ring-secondary/30"
                    type="checkbox"
                  />
                </th>
                <th className="p-4 font-semibold">Customer Details</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Total Billing</th>
                <th className="p-4 font-semibold text-right">Due</th>
                <th className="p-4 font-semibold text-center">Orders</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-data-tabular text-data-tabular divide-y divide-outline-variant/15">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-secondary/5 transition-colors group"
                >
                  <td className="p-4">
                    <input
                      className="rounded border-outline-variant/50 text-secondary focus:ring-secondary/30"
                      type="checkbox"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
                        style={{ background: "linear-gradient(135deg, #0b5a49, #0f8d65)" }}>
                        {customer.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-on-surface group-hover:text-secondary transition-colors cursor-pointer">
                          {customer.name}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          ID: {customer.id} • Joined {customer.joined}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-on-surface-variant">
                    {customer.phone}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        customer.status === "Active"
                          ? "bg-green-100/70 text-green-800"
                          : "bg-gray-100/70 text-gray-700"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-medium text-on-surface">
                    {customer.billing}
                  </td>
                  <td
                    className={`p-4 text-right font-medium ${customer.dueColor}`}
                  >
                    {customer.due}
                  </td>
                  <td className="p-4 text-center text-on-surface-variant">
                    {customer.orders}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1.5 text-outline hover:text-secondary hover:bg-secondary/10 rounded transition-colors"
                        title="View Details"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          visibility
                        </span>
                      </button>
                      <button
                        className="p-1.5 text-outline hover:text-secondary hover:bg-secondary/10 rounded transition-colors"
                        title="Create Order"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          add_shopping_cart
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-outline-variant/20 bg-white/20 flex items-center justify-between">
          <p className="text-sm text-on-surface-variant">
            Showing 1 to {filteredCustomers.length} of 2,451 entries
          </p>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-md border border-outline-variant/50 text-outline hover:bg-white/40 transition-colors">
              <span className="material-symbols-outlined text-[18px]">
                chevron_left
              </span>
            </button>
            <button className="px-3 py-1 rounded-md text-white text-sm font-medium"
              style={{ background: "linear-gradient(135deg, #0b5a49, #0f8d65)" }}>
              1
            </button>
            <button className="px-3 py-1 rounded-md border border-outline-variant/50 text-on-surface-variant hover:bg-white/40 text-sm font-medium transition-colors">
              2
            </button>
            <button className="px-3 py-1 rounded-md border border-outline-variant/50 text-on-surface-variant hover:bg-white/40 text-sm font-medium transition-colors">
              3
            </button>
            <span className="px-2 text-outline">...</span>
            <button className="p-1.5 rounded-md border border-outline-variant/50 text-outline hover:bg-white/40 transition-colors">
              <span className="material-symbols-outlined text-[18px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
