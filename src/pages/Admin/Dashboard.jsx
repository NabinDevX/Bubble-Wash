import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../../components/AdminSidebar.jsx";

const adminNavItems = [
  { to: "/admin", label: "Dashboard", icon: "dashboard", end: true },
  { to: "/admin/customers", label: "Customers", icon: "group" },
  { to: "/admin/workshops", label: "Workshops", icon: "storefront" },
  { to: "/admin/staff", label: "Staff", icon: "groups" },
  {
    to: "/admin/services-rate-card",
    label: "Services / Rate Card",
    icon: "local_laundry_service",
  },
  { to: "/admin/delivery-slots", label: "Delivery Slots", icon: "schedule" },
  { to: "/admin/tickets", label: "Tickets", icon: "support_agent" },
  { to: "/admin/riders", label: "Riders", icon: "two_wheeler" },
  { to: "/admin/service-areas", label: "Service Areas", icon: "map" },
  { to: "/admin/reports", label: "Reports & Analytics", icon: "analytics" },
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function toggleSidebar() {
    setIsSidebarOpen((v) => !v);
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className="app-green-gradient text-on-background font-body-md antialiased overflow-hidden flex h-screen w-full">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        items={adminNavItems}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="app-shell-header h-20 shrink-0 flex items-center justify-between px-gutter border-b backdrop-blur-md z-30">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="md:hidden text-on-surface hover:text-secondary transition-colors"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                Admin
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Operations &amp; Management
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
            </button>

            <button
              type="button"
              className="bg-linear-to-r from-secondary-fixed-dim to-secondary-fixed text-on-secondary px-6 py-2.5 rounded-full font-label-md text-label-md font-bold shadow-[0_4px_12px_rgba(98,250,227,0.3)] hover:shadow-[0_6px_16px_rgba(98,250,227,0.5)] hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <span className="material-symbols-outlined text-body-lg">
                add
              </span>
              <span>New</span>
            </button>
          </div>
        </header>

        <div className="app-content-surface m-4 mt-3 flex-1 overflow-y-auto custom-scroll rounded-2xl p-gutter pb-32">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
