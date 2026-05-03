import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext.jsx";
import { useState } from "react";

const navLinkBase =
  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors";
const navLinkActive =
  "bg-surface/10 text-secondary-fixed border-l-2 border-secondary-fixed hover:bg-surface/20";
const navLinkInactive =
  "text-on-primary-container hover:bg-surface/5 hover:text-surface";

export default function CustomerSidebar({
  isOpen,
  onClose,
  items,
  title = "Bubble Wash",
  subtitle = "Customer Portal",
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const displayName = user?.name || user?.phone || "—";
  const initial = (user?.name || user?.phone || "C")
    .trim()
    .charAt(0)
    .toUpperCase();
  const secondaryLine = user?.role
    ? String(user.role).replace(/_/g, " ")
    : "";

  return (
    <>
      {/* Overlay */}
      <div
        className={
          "fixed inset-0 bg-black/40 z-30 md:hidden " +
          (isOpen ? "block" : "hidden")
        }
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Sidebar */}
      <aside
        className={
          "app-sidebar-green w-64 shrink-0 flex flex-col h-full text-on-primary-container z-40 shadow-[4px_0_24px_0_rgba(15,23,42,0.1)] transition-transform duration-300 md:translate-x-0 absolute md:relative " +
          (isOpen ? "translate-x-0" : "-translate-x-full")
        }
        aria-label="Customer sidebar"
      >
        {/* Header */}
        <div className="p-6 pb-2 border-b border-on-primary-container/10">
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-blue-600 tracking-tight">
            {title}
          </h1>
          <p className="font-label-sm text-label-sm mt-1 text-on-primary-container/70 uppercase tracking-widest">
            {subtitle}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto custom-scroll py-6 px-4 space-y-2">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive
                }`
              }
            >
              <span className="material-symbols-outlined">
                {item.icon}
              </span>
              <span className="font-label-md text-label-md">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-6 border-t border-on-primary-container/10 space-y-4">

          {/* User Info */}
          <div
            onClick={() => navigate("/customer/profile")}
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition"
          >
            <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary-fixed font-bold">
              {initial}
            </div>

            <div>
              <p className="font-label-md text-label-md text-surface font-semibold">
                {displayName}
              </p>

              {secondaryLine ? (
                <p className="font-label-sm text-label-sm text-on-primary-container/70">
                  {secondaryLine}
                </p>
              ) : null}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-red-300 hover:bg-red-500/10 transition"
          >
            <span className="material-symbols-outlined text-sm">
              logout
            </span>
            <span className="font-label-md">Logout</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-surface-container-high p-6 rounded-2xl w-[90%] max-w-sm space-y-4 shadow-2xl border border-outline-variant">

            <h2 className="font-headline-sm text-on-surface">
              Confirm Logout
            </h2>

            <p className="text-sm text-on-surface-variant">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border border-outline-variant"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate("/signin");
                }}
                className="px-4 py-2 rounded-lg bg-red-500 text-white"
              >
                Logout
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}