import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { listAllEventsForMember } from "../api/clubhub";
import { toDisplayEvent } from "../utils/format";
import { IconCalendar, IconPin, IconArrowRight } from "../icons/Icons";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

export default function EventPicker({ title, subtitle, destination, icon: Icon }) {
  const { clubSlug, token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    listAllEventsForMember(clubSlug, token)
      .then((data) => {
        if (!cancelled) setEvents(data.map(toDisplayEvent));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Couldn't load events");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [clubSlug, token]);

  return (
    <DashboardLayout title={title} subtitle={subtitle || "Choose an event"}>
      {loading && <p className="text-sm font-medium text-[#9E97B8]">Loading events…</p>}
      {error && !loading && <div className="card rounded-2xl p-4 bg-rose-950/50 border border-rose-800/60 text-rose-300 text-sm font-medium">{error}</div>}

      {!loading && !error && events.length === 0 && (
        <div className="card rounded-3xl p-12 text-center bg-surface-card border border-surface-border shadow-glow-sm">
          <p className="text-sm font-medium text-[#9E97B8] mb-4">You need at least one event first.</p>
          <Link to="/dashboard/events/new" className="btn-primary text-xs sm:text-sm font-semibold rounded-full px-6 py-2.5 inline-block shadow-glow-sm cursor-pointer">
            Create an event
          </Link>
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {events.map((event) => (
            <motion.div key={event.id} variants={itemVariants}>
              <Link
                to={destination(event.id)}
                className="card card-hover rounded-3xl p-6 flex flex-col gap-3.5 bg-surface-card border border-surface-border shadow-glow-sm group hover:border-brand-violet/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="w-11 h-11 rounded-2xl bg-brand-lavender/10 border border-brand-lavender/25 text-brand-lavender flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <Icon width={20} height={20} />
                  </span>
                  <span className="text-xs font-semibold text-brand-lavender opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Select <IconArrowRight width={13} height={13} />
                  </span>
                </div>
                <p className="text-sm sm:text-base font-bold text-[#F3F2F8] group-hover:text-brand-lavender transition-colors leading-snug">{event.title}</p>
                <div className="text-xs text-[#9E97B8] flex flex-col gap-1.5 font-medium">
                  <span className="flex items-center gap-2"><IconCalendar width={13} height={13} className="text-brand-lavender" /> {event.date}</span>
                  <span className="flex items-center gap-2"><IconPin width={13} height={13} className="text-brand-lavender" /> {event.location}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </DashboardLayout>
  );
}
