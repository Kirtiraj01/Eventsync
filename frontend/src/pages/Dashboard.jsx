import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import { useAuth } from "../context/AuthContext";
import { listAllEventsForMember, getEventAnalytics } from "../api/clubhub";
import { toDisplayEvent } from "../utils/format";
import { IconPlus, IconAlertTriangle, IconPin, IconCalendar, IconArrowRight } from "../icons/Icons";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

export default function Dashboard() {
  const { clubName, clubSlug, token } = useAuth();
  const [events, setEvents] = useState([]);
  const [totals, setTotals] = useState({ registrations: 0, attended: 0 });
  const [lowAttendance, setLowAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!clubSlug || !token) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    listAllEventsForMember(clubSlug, token)
      .then(async (rawEvents) => {
        if (cancelled) return;
        const displayEvents = (rawEvents || []).map(toDisplayEvent);
        setEvents(displayEvents);

        const sample = (rawEvents || []).slice(0, 6);
        const analyticsResults = await Promise.all(
          sample.map((ev) =>
            getEventAnalytics(clubSlug, token, ev._id)
              .then((a) => ({ event: ev, analytics: a }))
              .catch(() => null)
          )
        );

        if (cancelled) return;
        const valid = analyticsResults.filter(Boolean);
        const registrations = valid.reduce((sum, r) => sum + (r.analytics?.totalRegistrations || 0), 0);
        const attended = valid.reduce((sum, r) => sum + (r.analytics?.totalAttended || 0), 0);
        setTotals({ registrations, attended });
        setLowAttendance(
          valid
            .filter((r) => r.analytics && r.analytics.totalRegistrations > 0 && r.analytics.attendanceRate < 50)
            .map((r) => ({ title: r.event.title, rate: r.analytics.attendanceRate }))
        );
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Couldn't load dashboard data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clubSlug, token]);

  const attendanceRate = totals.registrations === 0 ? 0 : Math.round((totals.attended / totals.registrations) * 100);

  const stats = [
    { label: "Total Registrations", value: totals.registrations },
    { label: "Attendees Checked In", value: totals.attended },
    { label: "Events Tracked", value: Math.min(events.length, 6) },
    { label: "Attendance Rate", value: `${attendanceRate}%` },
  ];

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle={`Live overview and turn-out for ${clubName}`}
      actions={
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/dashboard/events/new"
            className="btn-primary text-xs sm:text-sm font-bold rounded-full px-5 py-2.5 flex items-center gap-2 shadow-glow-sm cursor-pointer"
          >
            <IconPlus width={16} height={16} /> Create Event
          </Link>
        </motion.div>
      }
    >
      {error && (
        <div className="card rounded-3xl p-5 mb-8 bg-rose-950/40 border border-rose-500/30 text-rose-300 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={itemVariants}>
            <StatCard label={s.label} value={loading ? "…" : s.value} />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Events Card */}
        <div className="lg:col-span-3 card rounded-3xl bg-[#15102A] border border-[#261E4E] shadow-card-dark overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-[#261E4E] flex items-center justify-between">
            <h2 className="font-heading font-extrabold text-white text-sm tracking-tight">Recent Events</h2>
            <Link to="/dashboard/events" className="text-xs text-brand-lavender font-bold hover:underline flex items-center gap-1">
              View all <IconArrowRight width={13} height={13} />
            </Link>
          </div>
          <div className="divide-y divide-[#261E4E] flex-1">
            {loading && (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between py-2">
                    <div className="space-y-2">
                      <div className="h-4 bg-[#1C1638] rounded-full w-44" />
                      <div className="h-3 bg-[#130E28] rounded-full w-28" />
                    </div>
                    <div className="h-6 bg-[#1C1638] rounded-full w-16" />
                  </div>
                ))}
              </div>
            )}
            {!loading && events.length === 0 && (
              <div className="px-6 py-14 text-center">
                <p className="text-sm font-medium text-text-muted mb-3">No events created yet.</p>
                <Link to="/dashboard/events/new" className="text-xs font-bold text-brand-lavender hover:underline">
                  + Create your first event
                </Link>
              </div>
            )}
            {!loading && events.slice(0, 5).map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ backgroundColor: "#1C1638" }}
                transition={{ duration: 0.15 }}
              >
                <Link
                  to={`/dashboard/events/${event.id}/registrations`}
                  className="flex items-center justify-between gap-4 px-6 py-4.5 transition-colors group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {event.posterUrl && (
                      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[#2E2458] bg-[#120E28] shadow-sm">
                        <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-white truncate group-hover:text-brand-lavender transition-colors">
                        {event.title}
                      </p>
                      <p className="text-xs text-text-muted flex items-center gap-3.5 mt-1.5 font-medium">
                        <span className="flex items-center gap-1.5 text-text-main">
                          <IconCalendar width={13} height={13} className="text-brand-violet" /> {event.date}
                        </span>
                        <span className="flex items-center gap-1.5 text-text-muted">
                          <IconPin width={13} height={13} className="text-brand-violet" /> {event.location}
                        </span>
                      </p>
                    </div>
                  </div>
                  <Badge color={event.daysLeft === 0 ? "gray" : "indigo"}>
                    {event.daysLeft === 0 ? "Past" : `${event.daysLeft}d left`}
                  </Badge>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Alerts Card */}
        <div className="lg:col-span-2 card rounded-3xl bg-[#15102A] border border-[#261E4E] shadow-card-dark overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-[#261E4E]">
            <h2 className="font-heading font-extrabold text-white text-sm tracking-tight">Alerts & Notifications</h2>
          </div>
          <div className="divide-y divide-[#261E4E] flex-1">
            {!loading && lowAttendance.length === 0 && (
              <div className="px-6 py-14 text-center">
                <span className="w-10 h-10 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-bold text-sm flex items-center justify-center mx-auto mb-3 shadow-glow-sm">
                  ✓
                </span>
                <p className="text-sm font-medium text-text-main">Everything looks healthy</p>
                <p className="text-xs text-text-dim mt-0.5">No attendance or check-in anomalies detected.</p>
              </div>
            )}
            {lowAttendance.map((a) => (
              <div key={a.title} className="flex items-start gap-3.5 px-6 py-4.5 bg-amber-950/20">
                <span className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 bg-amber-950/40 text-amber-300 border border-amber-500/30 shadow-2xs">
                  <IconAlertTriangle width={17} height={17} />
                </span>
                <div className="text-xs sm:text-sm text-text-muted leading-snug">
                  <p className="font-bold text-white">Low Attendance Notice</p>
                  <p className="text-xs text-text-muted mt-1">
                    Check-in for <strong className="text-white font-semibold">{a.title}</strong> is currently at{" "}
                    <span className="text-amber-300 font-extrabold">{a.rate}%</span>.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
