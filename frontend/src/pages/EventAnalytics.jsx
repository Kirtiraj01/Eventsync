import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { getEvent, getEventAnalytics } from "../api/clubhub";
import { toDisplayEvent } from "../utils/format";

function CircularProgress({ pct }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 120 120" width={130} height={130} className="transform -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#261E4E" strokeWidth="10" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="url(#grad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C5CFC" />
            <stop offset="100%" stopColor="#BFA5FF" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading font-extrabold text-2xl text-[#F3F2F8] tracking-tight">{pct}%</span>
        <span className="text-[10px] uppercase font-bold text-[#9E97B8] tracking-wider -mt-0.5">Turnout</span>
      </div>
    </div>
  );
}

export default function EventAnalytics() {
  const { id } = useParams();
  const { clubSlug, token } = useAuth();

  const [event, setEvent] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([getEvent(clubSlug, id), getEventAnalytics(clubSlug, token, id)])
      .then(([eventData, analyticsData]) => {
        if (cancelled) return;
        setEvent(toDisplayEvent(eventData));
        setAnalytics(analyticsData);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Couldn't load analytics");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clubSlug, token, id]);

  if (loading) {
    return (
      <DashboardLayout title="Event analytics">
        <p className="text-sm font-medium text-body">Loading analytics…</p>
      </DashboardLayout>
    );
  }

  if (error || !analytics) {
    return (
      <DashboardLayout title="Event analytics">
        <div className="card rounded-2xl p-4 bg-rose-50 border border-rose-100 text-rose-700 text-sm font-medium">
          {error || "Couldn't load analytics."}
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    { label: "Total Registrations", value: analytics.totalRegistrations },
    { label: "Checked in", value: analytics.totalAttended },
    { label: "Not checked in", value: analytics.totalRegistrations - analytics.totalAttended },
  ];

  const series = analytics.registrationsOverTime || [];
  const max = Math.max(1, ...series.map((d) => d.count));

  return (
    <DashboardLayout title="Event analytics" subtitle={event?.title}>
      {/* Highlight card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card rounded-3xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center gap-8 bg-surface-card border border-surface-border shadow-glow-sm"
      >
        <CircularProgress pct={analytics.attendanceRate} />
        <div>
          <span className="text-[11px] font-bold text-brand-lavender uppercase tracking-wider bg-brand-lavender/10 border border-brand-lavender/25 px-3 py-1 rounded-full">
            Attendance Rate
          </span>
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#F3F2F8] mt-2.5 mb-1.5 tracking-tight">
            {analytics.attendanceRate}% attendance for {event?.title}
          </h2>
          <p className="text-sm text-[#9E97B8] max-w-md font-medium leading-relaxed">
            <strong className="text-brand-lavender font-semibold">{analytics.totalAttended}</strong> of{" "}
            <strong className="text-[#F3F2F8] font-semibold">{analytics.totalRegistrations}</strong> registered students checked in.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>

      {/* Chart */}
      <div className="card rounded-3xl p-6 sm:p-8 bg-surface-card border border-surface-border shadow-glow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold text-[#F3F2F8] uppercase tracking-wider">Registrations over time</h2>
          <span className="text-xs text-[#9E97B8] font-medium">Daily sign-ups</span>
        </div>

        {series.length === 0 ? (
          <p className="text-sm font-medium text-[#9E97B8] py-8 text-center">No registration activity recorded yet.</p>
        ) : (
          <>
            <div className="flex items-end gap-3 h-48 pt-6">
              {series.map((d, i) => (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end" title={`${d.date}: ${d.count}`}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.count / max) * 100}%` }}
                    transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-brand-violet to-brand-lavender group-hover:opacity-85 transition-opacity min-h-[4px] relative"
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold text-black opacity-0 group-hover:opacity-100 transition-opacity bg-brand-lavender px-2 py-0.5 rounded-full shadow-2xs">
                      {d.count}
                    </span>
                  </motion.div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs font-semibold text-[#9E97B8] mt-4 pt-3 border-t border-surface-border">
              <span>{series[0]?.date}</span>
              <span>{series[series.length - 1]?.date}</span>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
