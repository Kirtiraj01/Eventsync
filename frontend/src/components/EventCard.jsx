import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { IconPin, IconCalendar, IconArrowRight } from "../icons/Icons";

export default function EventCard({ event, slugOverride }) {
  const params = useParams();
  const slug = slugOverride || event.clubSlug || params.slug || "robotics-club";

  // Parse date for Astrix glass date badge
  const dateParts = (event.date || "JAN 25").split(" ");
  const month = dateParts[0] || "JAN";
  const day = dateParts[1] || "25";

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[28px] overflow-hidden flex flex-col group bg-[#120E28] border border-[#241C4A] hover:border-[#7C5CFC]/70 transition-all p-3.5 shadow-card-dark"
    >
      {/* Astrix Poster Visual Block */}
      <div className="h-60 sm:h-64 relative rounded-2xl bg-[#1A1435] overflow-hidden flex flex-col justify-between p-4 shadow-inner">
        {event.posterUrl ? (
          <img
            src={event.posterUrl}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${event.banner || "from-[#381F78] via-[#241355] to-[#7C5CFC]"}`} />
        )}
        {/* Dark gradient overlay so badges and text are crisp */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0814] via-[#0B0814]/40 to-black/35 pointer-events-none" />

        {/* Top Header inside Poster: Club Tag on Left, Date Badge on Right */}
        <div className="relative z-10 flex items-start justify-between gap-2">
          <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-brand-lavender bg-[#0B0814]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#7C5CFC]/30 shadow-sm">
            {event.clubName ? `${event.clubName.toUpperCase()} PRESENTS` : "CAMPUS PASS"}
          </span>

          <div className="bg-[#0B0814]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-center shadow-md">
            <p className="font-mono text-[10px] tracking-widest uppercase font-bold text-brand-lavender">{month}</p>
            <p className="font-heading font-extrabold text-sm text-white leading-none">{day}</p>
          </div>
        </div>

        {/* Bottom inside Poster: Attendance / Status */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="font-mono text-[11px] font-bold text-white/90 bg-[#0B0814]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse" />
            <span>{event.daysLeft || 3} days left</span>
          </span>

          {typeof event.registered === "number" && (
            <span className="font-mono text-[11px] font-semibold text-[#D9CCFF] bg-[#1C153A]/90 px-2.5 py-1 rounded-full border border-[#7C5CFC]/30">
              {event.registered} registered
            </span>
          )}
        </div>
      </div>

      {/* Details & Action Block */}
      <div className="p-3 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-heading font-extrabold text-white text-lg sm:text-xl leading-snug group-hover:text-brand-lavender transition-colors">
            {event.title}
          </h3>
          <p className="font-heading text-xs text-text-muted mt-1 line-clamp-1">
            {event.description || "Official campus club event with instant verified attendance."}
          </p>
        </div>

        <div className="flex flex-col gap-1.5 font-mono text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <span className="text-brand-lavender"><IconCalendar width={14} height={14} /></span>
            <span className="truncate text-text-main font-medium">{event.date} · {event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-brand-lavender"><IconPin width={14} height={14} /></span>
            <span className="truncate text-text-muted">{event.location}</span>
          </div>
        </div>

        {/* Astrix Solid Lavender Pill Button */}
        <div className="mt-auto pt-2">
          <Link
            to={`/club/${slug}/events/${event.id}/register`}
            className="w-full bg-brand-lavender text-[#0B0814] font-heading font-extrabold text-xs sm:text-sm py-3 rounded-full hover:bg-[#D4C2FF] shadow-glow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Get Pass</span>
            <IconArrowRight width={15} height={15} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
