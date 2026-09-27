import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../components/DashboardLayout";
import Badge from "../components/Badge";
import { useAuth } from "../context/AuthContext";
import { listAllEventsForMember, deleteEvent } from "../api/clubhub";
import { toDisplayEvent } from "../utils/format";
import { IconPlus, IconCalendar, IconPin, IconList, IconScan, IconBarChart, IconEdit, IconTrash } from "../icons/Icons";

export default function EventsList() {
  const { clubSlug, token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!clubSlug || !token) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    listAllEventsForMember(clubSlug, token)
      .then((data) => {
        if (!cancelled) setEvents((data || []).map(toDisplayEvent));
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

  const handleDelete = async (eventId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    setDeletingId(eventId);
    try {
      await deleteEvent(clubSlug, token, eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (err) {
      alert(err.message || "Failed to delete event");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout
      title="Events"
      subtitle="Manage your society's schedule, registrations, and check-in"
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
      {loading && <p className="text-sm font-medium text-text-muted">Loading events…</p>}
      {error && !loading && (
        <div className="card rounded-3xl p-5 bg-rose-950/40 border border-rose-500/30 text-rose-300 text-sm font-medium mb-6">
          {error}
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div className="card rounded-3xl p-14 text-center bg-[#15102A] border border-[#261E4E] shadow-card-dark">
          <p className="text-sm font-medium text-text-muted mb-4">You haven't created any events yet.</p>
          <Link to="/dashboard/events/new" className="btn-primary text-xs sm:text-sm font-bold rounded-full px-6 py-3 inline-block shadow-glow-sm">
            Create your first event
          </Link>
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <div className="card rounded-3xl bg-[#15102A] border border-[#261E4E] shadow-card-dark divide-y divide-[#261E4E] overflow-hidden">
          {events.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ backgroundColor: "#1C1638" }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                {event.posterUrl && (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shrink-0 border border-[#2E2458] bg-[#120E28] shadow-sm">
                    <img
                      src={event.posterUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-extrabold text-white truncate">{event.title}</p>
                  <p className="text-xs text-text-muted flex items-center gap-3.5 mt-1.5 font-medium">
                    <span className="flex items-center gap-1.5 text-text-main">
                      <IconCalendar width={13} height={13} className="text-brand-violet" /> {event.date} · {event.time}
                    </span>
                    <span className="flex items-center gap-1.5 text-text-muted">
                      <IconPin width={13} height={13} className="text-brand-violet" /> {event.location}
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Buttons as Pill Chips */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <Badge color={event.daysLeft === 0 ? "amber" : "indigo"}>
                  {event.daysLeft === 0 ? "Today or past" : `${event.daysLeft}d left`}
                </Badge>
                <Link
                  to={`/dashboard/events/${event.id}/registrations`}
                  title="Registrations"
                  aria-label={`View registrations for ${event.title}`}
                  className="btn-secondary text-xs font-bold rounded-full p-2.5 flex items-center shadow-2xs hover:text-brand-lavender"
                >
                  <IconList width={16} height={16} />
                </Link>
                <Link
                  to={`/dashboard/events/${event.id}/scan`}
                  title="Scan check-in"
                  aria-label={`Scan tickets for ${event.title}`}
                  className="btn-secondary text-xs font-bold rounded-full p-2.5 flex items-center shadow-2xs hover:text-brand-lavender"
                >
                  <IconScan width={16} height={16} />
                </Link>
                <Link
                  to={`/dashboard/events/${event.id}/analytics`}
                  title="Analytics"
                  aria-label={`View analytics for ${event.title}`}
                  className="btn-secondary text-xs font-bold rounded-full p-2.5 flex items-center shadow-2xs hover:text-brand-lavender"
                >
                  <IconBarChart width={16} height={16} />
                </Link>
                <Link
                  to={`/dashboard/events/${event.id}/edit`}
                  title="Edit event"
                  aria-label={`Edit ${event.title}`}
                  className="btn-secondary text-xs font-bold rounded-full p-2.5 flex items-center shadow-2xs hover:text-brand-lavender"
                >
                  <IconEdit width={16} height={16} />
                </Link>
                <button
                  onClick={() => handleDelete(event.id, event.title)}
                  disabled={deletingId === event.id}
                  title="Delete event"
                  aria-label={`Delete ${event.title}`}
                  className="btn-secondary text-xs font-bold rounded-full p-2.5 flex items-center shadow-2xs text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 border-rose-500/20 disabled:opacity-50 cursor-pointer"
                >
                  <IconTrash width={16} height={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
