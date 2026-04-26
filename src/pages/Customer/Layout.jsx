import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/customer", icon: "home", label: "Home", end: true },
  { to: "/customer/schedule", icon: "calendar_today", label: "Schedule" },
  { to: "/customer/track", icon: "local_shipping", label: "Track" },
  { to: "/customer/wallet", icon: "account_balance_wallet", label: "Wallet" },
  { to: "/customer/feedback", icon: "person", label: "Profile" },
];

export default function CustomerLayout() {
  return (
    <div className="min-h-screen relative app-green-gradient text-on-surface font-body-md antialiased overflow-x-hidden">
      {/* Decorative Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[100px]"
          style={{ background: "rgba(37, 196, 143, 0.18)" }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px]"
          style={{ background: "rgba(11, 90, 73, 0.12)" }} />
        <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full blur-[80px]"
          style={{ background: "rgba(138, 240, 205, 0.15)" }} />
      </div>

      {/* Top Navigation (Desktop) */}
      <nav className="hidden md:flex fixed top-0 w-full z-50 app-shell-header backdrop-blur-lg border-b border-white/20">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full">
          <NavLink to="/" className="text-lg font-black tracking-tighter text-primary font-[Inter] antialiased">
            BUBBLE WASH
          </NavLink>
          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg font-label-md text-label-md transition-colors duration-200 active:scale-95 ${
                    isActive
                      ? "text-secondary font-semibold relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-secondary after:rounded-full after:shadow-[0_0_10px_rgba(37,196,143,0.7)]"
                      : "text-outline hover:bg-white/20"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-4 text-secondary">
            <button className="hover:bg-white/20 p-2 rounded-full transition-colors active:scale-95 duration-200">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="hover:bg-white/20 p-2 rounded-full transition-colors active:scale-95 duration-200">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-4 md:pt-[100px] pb-32 md:pb-12">
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-lg rounded-3xl border border-white/30 backdrop-blur-xl shadow-[0_20px_50px_rgba(11,90,73,0.15)] flex justify-around items-center py-4 px-2 z-50"
        style={{ background: "rgba(255, 255, 255, 0.35)" }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center hover:scale-110 transition-transform duration-300 ease-out cursor-pointer ${
                isActive
                  ? "text-secondary relative after:content-[''] after:absolute after:-bottom-2 after:w-1.5 after:h-1.5 after:bg-secondary after:rounded-full after:shadow-[0_0_10px_rgba(37,196,143,0.7)]"
                  : "text-outline"
              }`
            }
          >
            <span className="material-symbols-outlined mb-1">{item.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
