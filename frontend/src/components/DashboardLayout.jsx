import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import PageTransition from "./PageTransition";
import {
  IconGrid, IconCalendar, IconList, IconScan, IconAward, IconBarChart,
  IconCode, IconMenu, IconX, IconLogOut,
} from "../icons/Icons";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: IconGrid, end: true },
  { to: "/dashboard/events", label: "Events", icon: IconCalendar },
  { to: "/dashboard/registrations", label: "Registrations", icon: IconList },
  { to: "/dashboard/scan", label: "Scan check-in", icon: IconScan },
  { to: "/dashboard/certificates", label: "Certificates", icon: IconAward },
  { to: "/dashboard/analytics", label: "Analytics", icon: IconBarChart },
];

function SidebarContent({ onNavigate }) {
  const { clubName, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0814] text-text-main">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-[#1F193B]">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7C5CFC] to-[#9E7FFF] text-white flex items-center justify-center shrink-0 shadow-glow-sm">
          <IconCode width={20} height={20} />
        </div>
        <div className="min-w-0">
          <span className="font-heading font-extrabold text-white leading-tight truncate block text-base">
            {clubName}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-lavender bg-[#201942] border border-[#3E2F77] px-2.5 py-0.5 rounded-full mt-1">
            Member Area
          </span>
        </div>
      </div>

      {/* Navigation Links with Astrix Pill Highlights */}
      <nav className="flex-1 px-3 flex flex-col gap-1.5 py-5">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `relative flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-[#201942] text-brand-lavender border border-[#7C5CFC]/40 shadow-glow-sm font-bold"
                  : "text-text-muted hover:bg-[#15102A] hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  width={18}
                  height={18}
                  className={isActive ? "text-brand-lavender" : "text-text-dim"}
                />
                <span>{item.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeNavTab"
                    className="absolute right-3 w-1.5 h-4 rounded-full bg-brand-lavender shadow-[0_0_8px_rgba(191,165,255,0.8)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Action */}
      <div className="p-4 border-t border-[#1F193B]">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-rose-300 hover:bg-rose-950/30 hover:text-rose-200 transition-colors w-full cursor-pointer"
        >
          <IconLogOut width={18} height={18} />
          Log out
        </motion.button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ title, subtitle, actions, children }) {
  const { clubName, clubSlug } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const initials = (clubName || "ES")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#07050E] font-body flex text-text-main">
      {/* Desktop sidebar rail */}
      <aside className="hidden lg:flex lg:w-64 shrink-0 bg-[#0B0814] border-r border-[#1F193B] flex-col sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile drawer with AnimatePresence */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="absolute left-0 top-0 bottom-0 w-72 bg-[#0B0814] shadow-2xl z-50 flex flex-col border-r border-[#1F193B]"
            >
              <div className="flex items-center justify-end px-4 pt-4">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-text-muted hover:text-white p-1.5 rounded-xl hover:bg-[#15102A]"
                >
                  <IconX width={18} height={18} />
                </button>
              </div>
              <SidebarContent onNavigate={() => setDrawerOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex-1 min-w-0 flex flex-col bg-[#07050E]">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-[#0B0814]/85 backdrop-blur-xl border-b border-[#1F193B]">
          <div className="flex items-center justify-between px-5 sm:px-8 h-18">
            <div className="flex items-center gap-3 min-w-0">
              <button
                className="lg:hidden text-text-muted hover:text-white p-1.5 rounded-xl hover:bg-[#15102A] shrink-0"
                onClick={() => setDrawerOpen(true)}
              >
                <IconMenu width={20} height={20} />
              </button>
              <div className="min-w-0">
                <h1 className="font-heading font-extrabold text-white text-base sm:text-xl truncate tracking-tight">{title}</h1>
                {subtitle && <p className="text-xs text-text-muted truncate font-medium">{subtitle}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3.5 shrink-0">
              {actions}
              {clubSlug && (
                <Link
                  to={`/club/${clubSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-brand-lavender bg-[#201942] hover:bg-[#2A2157] border border-[#3E2F77] px-4 py-2 rounded-full transition-colors shadow-2xs"
                >
                  View Public Page ↗
                </Link>
              )}
              {/* Club Avatar Chip */}
              <div className="flex items-center gap-3 pl-3 border-l border-[#1F193B]">
                <span className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#7C5CFC] to-[#9E7FFF] text-white text-xs font-extrabold flex items-center justify-center shadow-glow-sm">
                  {initials}
                </span>
                <span className="hidden sm:flex flex-col leading-tight">
                  <span className="text-xs font-bold text-white">{clubName}</span>
                  <span className="text-[10px] text-text-dim font-medium">Club Member</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 sm:px-8 py-8 bg-[#07050E]">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
