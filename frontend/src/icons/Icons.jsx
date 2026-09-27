// Lightweight inline icon set — no external icon lib dependency
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

export const IconUsers = (p) => (
  <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="10" cy="7" r="4" />
    <path d="M22.5 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16.5 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const IconCalendar = (p) => (
  <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
    <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
    <path d="M16 2.5v4M8 2.5v4M3 9.5h18" />
  </svg>
);

export const IconCheckCircle = (p) => (
  <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M8 12.5l2.6 2.6L16.2 9" />
  </svg>
);

export const IconPin = (p) => (
  <svg viewBox="0 0 24 24" width={16} height={16} {...base} {...p}>
    <path d="M12 21.5s7-6.6 7-12A7 7 0 0 0 5 9.5c0 5.4 7 12 7 12z" />
    <circle cx="12" cy="9.5" r="2.3" />
  </svg>
);

export const IconClock = (p) => (
  <svg viewBox="0 0 24 24" width={16} height={16} {...base} {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M12 7v5.3l3.5 2" />
  </svg>
);

export const IconArrowRight = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <path d="M4.5 12h15M13 5.5l6.5 6.5-6.5 6.5" />
  </svg>
);

export const IconMail = (p) => (
  <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <path d="M3 6.5l9 6.5 9-6.5" />
  </svg>
);

export const IconTrendUp = (p) => (
  <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
    <path d="M3 16.5l6-6 4 4 8-8.5" />
    <path d="M15.5 6h5.5v5.5" />
  </svg>
);

export const IconDownload = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <path d="M12 3.5v13M7 12l5 5 5-5" />
    <path d="M4 20.5h16" />
  </svg>
);

export const IconCalendarPlus = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
    <path d="M16 2.5v4M8 2.5v4M3 9.5h18" />
    <path d="M12 13v5M9.5 15.5h5" />
  </svg>
);

export const IconShield = (p) => (
  <svg viewBox="0 0 24 24" width={28} height={28} {...base} {...p}>
    <path d="M12 2.5l8 3v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10v-6l8-3z" />
    <path d="M8.3 12.3l2.5 2.5 5-5.2" />
  </svg>
);

export const IconTicket = (p) => (
  <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
    <path d="M3 9.5a2.5 2.5 0 0 1 0-5H21a2.5 2.5 0 0 1 0 5v0a2.5 2.5 0 0 0 0 5v0a2.5 2.5 0 0 1 0 5H3a2.5 2.5 0 0 1 0-5v0a2.5 2.5 0 0 0 0-5v0z" />
    <path d="M14 5v14" strokeDasharray="2 2" />
  </svg>
);

export const IconCode = (p) => (
  <svg viewBox="0 0 24 24" width={26} height={26} {...base} {...p}>
    <path d="M8 8l-5 4.5L8 17M16 8l5 4.5L16 17M13.5 5l-3 15" />
  </svg>
);

export const IconChevronDown = (p) => (
  <svg viewBox="0 0 24 24" width={16} height={16} {...base} {...p}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const IconChevronRight = (p) => (
  <svg viewBox="0 0 24 24" width={16} height={16} {...base} {...p}>
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export const IconChevronLeft = (p) => (
  <svg viewBox="0 0 24 24" width={16} height={16} {...base} {...p}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const IconShare = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <circle cx="18" cy="5" r="2.5" />
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="19" r="2.5" />
    <path d="M8.2 10.8l7.6-4.6M8.2 13.2l7.6 4.6" />
  </svg>
);

export const IconGrid = (p) => (
  <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
    <rect x="3" y="3" width="8" height="8" rx="1.5" />
    <rect x="13" y="3" width="8" height="8" rx="1.5" />
    <rect x="3" y="13" width="8" height="8" rx="1.5" />
    <rect x="13" y="13" width="8" height="8" rx="1.5" />
  </svg>
);

export const IconList = (p) => (
  <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
    <path d="M8 6h13M8 12h13M8 18h13" />
    <path d="M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);

export const IconScan = (p) => (
  <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
    <path d="M3 8V5.5A2.5 2.5 0 0 1 5.5 3H8M16 3h2.5A2.5 2.5 0 0 1 21 5.5V8M21 16v2.5a2.5 2.5 0 0 1-2.5 2.5H16M8 21H5.5A2.5 2.5 0 0 1 3 18.5V16" />
    <path d="M3 12h18" />
  </svg>
);

export const IconAward = (p) => (
  <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
    <circle cx="12" cy="8.5" r="5.5" />
    <path d="M8.5 13.5L7 21l5-2.5 5 2.5-1.5-7.5" />
  </svg>
);

export const IconBarChart = (p) => (
  <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
    <path d="M4 20V10M12 20V4M20 20v-7" />
    <path d="M2.5 20h19" />
  </svg>
);

export const IconPlus = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconLock = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
  </svg>
);

export const IconAlertTriangle = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <path d="M10.3 3.9L1.9 18.5A1.8 1.8 0 0 0 3.5 21.2h17a1.8 1.8 0 0 0 1.6-2.7L13.7 3.9a1.8 1.8 0 0 0-3.4 0z" />
    <path d="M12 9v4.5M12 17h.01" />
  </svg>
);

export const IconLogOut = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <path d="M9 21H5.5A2.5 2.5 0 0 1 3 18.5v-13A2.5 2.5 0 0 1 5.5 3H9" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </svg>
);

export const IconMenu = (p) => (
  <svg viewBox="0 0 24 24" width={22} height={22} {...base} {...p}>
    <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" />
  </svg>
);

export const IconX = (p) => (
  <svg viewBox="0 0 24 24" width={20} height={20} {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconFileText = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <path d="M6 2.5h8l5 5V19a2.5 2.5 0 0 1-2.5 2.5h-10A2.5 2.5 0 0 1 4 19V5A2.5 2.5 0 0 1 6 2.5z" />
    <path d="M14 2.5V8h5" />
    <path d="M8 13h8M8 16.5h8M8 9.5h3" />
  </svg>
);

export const IconEdit = (p) => (
  <svg viewBox="0 0 24 24" width={16} height={16} {...base} {...p}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const IconTrash = (p) => (
  <svg viewBox="0 0 24 24" width={16} height={16} {...base} {...p}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export const IconSearch = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

export const IconAstrixLogo = ({ width = 28, height = 28, className = "" }) => (
  <svg viewBox="0 0 32 32" width={width} height={height} fill="currentColor" className={className}>
    {/* Astrix Signature 4-Blade Pinwheel */}
    <path d="M14 4h4v10h-4z" rx="2" />
    <path d="M18 14h10v4H18z" rx="2" />
    <path d="M14 18h4v10h-4z" rx="2" />
    <path d="M4 14h10v4H4z" rx="2" />
    <circle cx="16" cy="16" r="3" fill="#BFA5FF" />
  </svg>
);

export const IconBell = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export const IconSettings = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export const IconHeart = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const IconMessageSquare = (p) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...p}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);



