import { NavLink } from "react-router-dom";

const navLinkBase =
  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors";
const navLinkActive =
  "bg-surface/10 text-secondary-fixed border-l-2 border-secondary-fixed hover:bg-surface/20";
const navLinkInactive =
  "text-on-primary-container hover:bg-surface/5 hover:text-surface";

export default function AdminSidebar({
  isOpen,
  onClose,
  items,
  title = "Bubble Wash",
  subtitle = "Admin Control",
}) {
  return (
    <>
      <div
        className={
          "fixed inset-0 bg-black/40 z-30 md:hidden " +
          (isOpen ? "block" : "hidden")
        }
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={
          "app-sidebar-green w-64 shrink-0 flex flex-col h-full text-on-primary-container z-40 shadow-[4px_0_24px_0_rgba(15,23,42,0.1)] transition-transform duration-300 md:translate-x-0 absolute md:relative " +
          (isOpen ? "translate-x-0" : "-translate-x-full")
        }
        aria-label="Admin sidebar"
      >
        <div className="p-6 pb-2 border-b border-on-primary-container/10">
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-blue-600 tracking-tight">
            {title}
          </h1>
          <p className="font-label-sm text-label-sm mt-1 text-on-primary-container/70 uppercase tracking-widest">
            {subtitle}
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scroll py-6 px-4 space-y-2">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
              }
            >
              <span
                className="material-symbols-outlined"
                style={
                  item.end ? { fontVariationSettings: "'FILL' 1" } : undefined
                }
              >
                {item.icon}
              </span>
              <span
                className={
                  item.end
                    ? "font-label-md text-label-md font-bold"
                    : "font-label-md text-label-md"
                }
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-on-primary-container/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary-fixed font-bold">
              A
            </div>
            <div>
              <p className="font-label-md text-label-md text-surface font-semibold">
                Admin User
              </p>
              <p className="font-label-sm text-label-sm text-on-primary-container/70">
                System Admin
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
