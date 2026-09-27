import { Link, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { IconAstrixLogo, IconBell, IconSettings } from "../icons/Icons";

export default function Nav({ clubName }) {
  const { slug } = useParams();
  const location = useLocation();

  const isHome = location.pathname === "/" || location.pathname.startsWith("/club/");

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 bg-[#080512]/90 backdrop-blur-xl border-b border-[#1E1738]"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Wordmark (Astrix Style) */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group shrink-0"
        >
          <div className="text-white group-hover:text-brand-lavender transition-colors">
            <IconAstrixLogo width={30} height={30} />
          </div>
          <span className="font-heading font-extrabold text-white text-xl sm:text-2xl tracking-tight group-hover:text-brand-lavender transition-colors">
            {clubName || "EventSync."}
          </span>
        </Link>

        {/* Center Pill-Shaped Navigation Container (Exact Astrix Pattern) */}
        <div className="hidden md:flex items-center bg-[#130E28] border border-[#261E4E] rounded-full p-1.5 shadow-inner">
          <Link
            to="/"
            className={`text-xs sm:text-sm font-bold px-5 py-1.5 rounded-full transition-all duration-200 ${
              isHome
                ? "bg-brand-lavender text-[#0B0814] shadow-sm"
                : "text-text-muted hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link
            to="/dashboard/scan"
            className="text-xs sm:text-sm font-semibold text-text-muted hover:text-white px-5 py-1.5 rounded-full transition-colors"
          >
            Scan Pass
          </Link>
          <Link
            to="/dashboard/certificates"
            className="text-xs sm:text-sm font-semibold text-text-muted hover:text-white px-5 py-1.5 rounded-full transition-colors"
          >
            Certificates
          </Link>
        </div>

        {/* Right Section: Actions & Profile (Exact Astrix Pattern) */}
        <div className="flex items-center gap-3 shrink-0">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/dashboard"
              className="bg-brand-lavender text-[#0B0814] font-heading font-extrabold text-xs sm:text-sm px-5 py-2 rounded-full inline-flex items-center gap-2 shadow-glow-sm hover:bg-[#D4C2FF] transition-all"
            >
              Dashboard
            </Link>
          </motion.div>

          {/* Notification Bell */}
          <button
            title="Notifications"
            className="w-10 h-10 rounded-full bg-[#130E28] border border-[#261E4E] text-text-muted hover:text-white hover:border-[#7C5CFC] flex items-center justify-center transition-all cursor-pointer hidden sm:flex"
          >
            <IconBell width={17} height={17} />
          </button>

          {/* Settings Gear */}
          <button
            title="Settings"
            className="w-10 h-10 rounded-full bg-[#130E28] border border-[#261E4E] text-text-muted hover:text-white hover:border-[#7C5CFC] flex items-center justify-center transition-all cursor-pointer hidden sm:flex"
          >
            <IconSettings width={17} height={17} />
          </button>

          {/* User Profile Badge (Astrix Capsule) */}
          <div className="flex items-center gap-2.5 bg-[#130E28] border border-[#261E4E] pl-1 pr-3 py-1 rounded-full">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C5CFC] to-[#BFA5FF] flex items-center justify-center text-[#0B0814] font-heading font-bold text-xs">
              ES
            </div>
            <span className="text-xs font-semibold text-text-main hidden lg:inline font-heading">
              Campus Lead
            </span>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
