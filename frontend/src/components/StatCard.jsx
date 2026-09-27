import { motion } from "framer-motion";
import CountUp from "./CountUp";

export default function StatCard({ label, value, delta }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18 }}
      className="card rounded-2xl p-6 flex flex-col gap-1.5 bg-[#15102A] border border-[#261E4E] hover:border-[#7C5CFC]/50 hover:shadow-glow-sm transition-all"
    >
      <span className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
        {value === "…" ? "…" : <CountUp value={value} />}
      </span>
      <span className="text-xs sm:text-sm font-medium text-text-muted">{label}</span>
      {delta && (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded-full w-fit mt-1">
          ↑ {delta} vs last period
        </span>
      )}
    </motion.div>
  );
}
