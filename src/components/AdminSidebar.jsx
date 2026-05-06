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
          "app-sidebar-green w-64 shrink-0 flex flex-col h-full text-on-primary-container z-40 shadow-[4px_0_24px_0_rgba(15,23,42,0.1)] transition-transform duration-300 md:translate-x-0 absolute md:relative overflow-hidden " +
          (isOpen ? "translate-x-0" : "-translate-x-full")
        }
        aria-label="Admin sidebar"
      >
        <div className="px-5 py-4 pb-3 border-b border-on-primary-container/10 flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-white text-base" style={{fontVariationSettings:"'FILL' 1"}}>local_laundry_service</span>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-[17px] font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight leading-tight truncate">
              {title}
            </h1>
            <p className="text-[10px] mt-0.5 text-on-primary-container/60 uppercase tracking-[0.18em] truncate">
              {subtitle}
            </p>
          </div>
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

        <div className="px-4 py-4 border-t border-on-primary-container/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 shrink-0 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary-fixed font-bold text-sm">
              A
            </div>
            <div className="min-w-0">
              <p className="text-sm text-surface font-semibold truncate">
                Admin User
              </p>
              <p className="text-[11px] text-on-primary-container/60 truncate">
                System Admin
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
