const styles = {
  green: "text-emerald-300 bg-emerald-950/40 border border-emerald-500/30",
  indigo: "text-brand-lavender bg-[#201942] border border-[#3D2E77]",
  amber: "text-amber-300 bg-amber-950/40 border border-amber-500/30",
  gray: "text-text-muted bg-[#1A1435] border border-[#2B2256]",
  red: "text-rose-300 bg-rose-950/40 border border-rose-500/30",
};

const dotColors = {
  green: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
  indigo: "bg-[#7C5CFC] shadow-[0_0_8px_rgba(124,92,252,0.8)]",
  amber: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
  gray: "bg-gray-400",
  red: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]",
};

const statusColor = (status) => {
  const s = status.toLowerCase();
  if (s.includes("checked in") || s.includes("sent") || s.includes("generated") || s.includes("valid") || s.includes("issued")) return "green";
  if (s.includes("pending") || s.includes("registered") || s.includes("today") || s.includes("in queue")) return "amber";
  if (s.includes("no-show") || s.includes("no show") || s.includes("past")) return "gray";
  if (s.includes("error") || s.includes("invalid")) return "red";
  return "indigo";
};

export default function Badge({ children, color, icon: Icon }) {
  const resolved = color || statusColor(String(children));
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full shadow-2xs backdrop-blur-md ${styles[resolved] || styles.gray}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[resolved] || dotColors.gray}`} />
      {Icon && <Icon width={12} height={12} />}
      {children}
    </span>
  );
}
