import { useState } from "react";
import { Outlet } from "react-router-dom";

import CustomerSidebar from "../../components/CustomerSidebar.jsx";

const navItems = [
  { to: "/customer", icon: "home", label: "Home", end: true },
  { to: "/customer/schedule", icon: "calendar_today", label: "Schedule" },
  { to: "/customer/track", icon: "local_shipping", label: "Track" },
  { to: "/customer/wallet", icon: "account_balance_wallet", label: "Wallet" },
  { to: "/customer/feedback", icon: "rate_review", label: "Feedback" },
];

export default function CustomerLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function toggleSidebar() {
    setIsSidebarOpen((v) => !v);
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className="app-green-gradient text-on-background font-body-md antialiased overflow-hidden flex h-screen w-full">
      <CustomerSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        items={navItems}
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
                Customer
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Orders, Tracking &amp; Rewards
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
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
              aria-label="Profile"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </header>

        <div className="app-content-surface m-4 mt-3 flex-1 overflow-y-auto custom-scroll rounded-2xl pb-32">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
