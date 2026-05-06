import { Suspense, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext.jsx";

import AdminSidebar from "../../components/AdminSidebar.jsx";
import PageLoader from "../../components/PageLoader.jsx";
import useLenisScroll from "../../lib/useLenisScroll.js";

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
  {
    to: "/admin/promotions-billing",
    label: "Promotions & Billing",
    icon: "sell",
  },
  { to: "/admin/delivery-slots", label: "Delivery Slots", icon: "schedule" },
  { to: "/admin/tickets", label: "Tickets", icon: "support_agent" },
  { to: "/admin/riders", label: "Riders", icon: "two_wheeler" },
  { to: "/admin/service-areas", label: "Service Areas", icon: "map" },
  { to: "/admin/reports", label: "Reports & Analytics", icon: "analytics" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scrollWrapperRef = useRef(null);
  const scrollContentRef = useRef(null);

  useLenisScroll({
    wrapperRef: scrollWrapperRef,
    contentRef: scrollContentRef,
  });

  function toggleSidebar() {
    setIsSidebarOpen((v) => !v);
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const displayName = user?.name || user?.phone || "Admin";
  const initial = (user?.name || user?.phone || "A")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div className="app-green-gradient text-on-background font-body-md antialiased overflow-hidden flex h-screen w-full relative">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        items={adminNavItems}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
        <header className="app-shell-header h-16 md:h-20 shrink-0 flex items-center justify-between px-4 md:px-gutter border-b backdrop-blur-md z-30">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="md:hidden text-on-surface hover:text-secondary transition-colors"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="min-w-0">
              <h2 className="font-headline-sm text-headline-sm text-on-surface leading-tight">
                Admin
              </h2>
              <p className="text-xs text-on-surface-variant hidden sm:block">
                Operations &amp; Management
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                type="button"
                className="relative w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
                aria-label="Notifications"
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
              </button>
            </div>

            <div
              className="relative"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary-fixed font-bold"
                aria-label="Admin profile"
              >
                {initial}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-outline-variant/40 bg-surface-container-high shadow-lg p-4 z-40">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary-fixed font-bold">
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-on-surface truncate">
                        {displayName}
                      </p>
                      {user?.role && (
                        <p className="text-sm text-on-surface-variant truncate">
                          {String(user.role).replace(/_/g, " ")}
                        </p>
                      )}
                      {user?.phone && (
                        <p className="text-sm text-on-surface-variant truncate">
                          {user.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => navigate("/admin")}
                      className="px-3 py-1 rounded-lg border border-outline-variant"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        navigate("/signin");
                      }}
                      className="px-3 py-1 rounded-lg bg-red-500 text-white"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div
          ref={scrollWrapperRef}
          className="app-content-surface mx-2 md:mx-4 mt-3 mb-2 md:mb-4 flex-1 overflow-y-auto overflow-x-hidden custom-scroll rounded-2xl px-3 sm:px-5 md:px-gutter pb-12 min-w-0 max-w-full box-border"
        >
          <div ref={scrollContentRef}>
            <Suspense fallback={<PageLoader title="Loading page…" />}>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
