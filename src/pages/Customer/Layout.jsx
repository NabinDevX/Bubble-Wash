import { Suspense, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import CustomerSidebar from "../../components/CustomerSidebar.jsx";
import PageLoader from "../../components/PageLoader.jsx";
import useLenisScroll from "../../lib/useLenisScroll.js";

const navItems = [
  { to: "/customer", icon: "home", label: "Home", end: true },
  { to: "/customer/orders", icon: "receipt_long", label: "Orders" },
  { to: "/customer/track", icon: "local_shipping", label: "Track" },
  { to: "/customer/wallet", icon: "account_balance_wallet", label: "Wallet" },
  { to: "/customer/support", icon: "support_agent", label: "Support" },
  { to: "/customer/feedback", icon: "rate_review", label: "Feedback" },
  { to: "/customer/settings", icon: "settings", label: "Settings" },
];

export default function CustomerLayout() {
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

  return (
    <div className="app-green-gradient text-on-background font-body-md antialiased overflow-x-hidden flex h-screen w-full">
      <CustomerSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        items={navItems}
      />

      <main className="flex-1 flex flex-col h-full overflow-x-hidden relative min-w-0">
        <header className="app-shell-header h-16 md:h-20 shrink-0 flex items-center justify-between px-4 md:px-gutter border-b backdrop-blur-md z-30">
          <div className="flex items-center space-x-4 min-w-0">
            <button
              type="button"
              className="md:hidden text-on-surface hover:text-secondary transition-colors"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="min-w-0">
              <h2 className="font-headline-sm text-body-lg md:text-headline-sm text-on-surface truncate leading-tight">
                Customer
              </h2>
              <p className="font-body-md text-label-sm md:text-body-md text-on-surface-variant truncate leading-tight">
                Orders, Tracking &amp; Rewards
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => navigate("/customer/notifications")}
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/customer/profile")}
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
              aria-label="Profile"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </header>

        <div
          ref={scrollWrapperRef}
          className="app-content-surface mx-2 md:m-4 mt-3 flex-1 overflow-y-auto overflow-x-hidden custom-scroll rounded-2xl px-3 md:p-gutter pb-32 min-w-0 max-w-full box-border"
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
