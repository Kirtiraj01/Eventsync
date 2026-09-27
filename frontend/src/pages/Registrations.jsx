import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import { useAuth } from "../context/AuthContext";
import { listAllEventsForMember, listRegistrations, getEvent } from "../api/clubhub";
import { toDisplayEvent } from "../utils/format";
import { IconDownload, IconChevronDown } from "../icons/Icons";

function toCsv(rows) {
  const header = ["Name", "Email", "Registered", "Status"];
  const lines = rows.map((r) =>
    [r.attendeeName, r.attendeeEmail, new Date(r.createdAt).toLocaleDateString(), r.attended ? "Checked in" : "Registered"]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header.join(","), ...lines].join("\n");
}

export default function Registrations() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clubSlug, token } = useAuth();

  const [event, setEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      getEvent(clubSlug, id),
      listRegistrations(clubSlug, token, id),
      listAllEventsForMember(clubSlug, token),
    ])
      .then(([eventData, regData, allEvents]) => {
        if (cancelled) return;
        setEvent(toDisplayEvent(eventData));
        setRows(regData);
        setEvents(allEvents.map(toDisplayEvent));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Couldn't load registrations");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clubSlug, token, id]);

  const checkedIn = rows.filter((r) => r.attended).length;
  const certsSent = rows.filter((r) => r.certificateId).length;

  const stats = [
    { label: "Registered", value: rows.length },
    { label: "Checked in", value: checkedIn },
    { label: "Not yet checked in", value: rows.length - checkedIn },
    { label: "Certificates issued", value: certsSent },
  ];

  const handleExport = () => {
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event?.title || "registrations"}.csv`.replace(/\s+/g, "-").toLowerCase();
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout
      title="Registrations"
      subtitle={event?.title}
      actions={
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={id}
              onChange={(e) => navigate(`/dashboard/events/${e.target.value}/registrations`)}
              className="appearance-none text-xs sm:text-sm font-semibold text-[#F3F2F8] bg-surface-elevated border border-surface-border rounded-full pl-4 pr-9 py-2.5 outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20 cursor-pointer shadow-2xs"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id} className="bg-[#15102A] text-[#F3F2F8]">{ev.title}</option>
              ))}
            </select>
            <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E97B8] pointer-events-none" width={14} height={14} />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExport}
            disabled={rows.length === 0}
            className="btn-secondary text-xs sm:text-sm font-semibold rounded-full px-5 py-2.5 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <IconDownload width={15} height={15} /> Export CSV
          </motion.button>
        </div>
      }
    >
      {error && <div className="card rounded-2xl p-4 mb-6 bg-rose-950/50 border border-rose-800/60 text-rose-300 text-sm font-medium">{error}</div>}
      {loading && <p className="text-sm font-medium text-[#9E97B8]">Loading registrations…</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
            {stats.map((s) => (
              <StatCard key={s.label} label={s.label} value={s.value} />
            ))}
          </div>

          <div className="card rounded-3xl bg-surface-card border border-surface-border shadow-glow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="text-xs font-bold text-[#9E97B8] uppercase tracking-wider bg-[#100C22] border-b border-surface-border">
                    <th className="px-6 py-4">Attendee</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Registered</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-[#9E97B8] font-medium">No registrations recorded yet.</td>
                    </tr>
                  )}
                  {rows.map((r) => (
                    <tr key={r._id} className="hover:bg-surface-elevated/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#F3F2F8] whitespace-nowrap">{r.attendeeName}</td>
                      <td className="px-6 py-4 text-[#9E97B8] whitespace-nowrap font-medium">{r.attendeeEmail}</td>
                      <td className="px-6 py-4 text-[#9E97B8] whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4"><Badge>{r.attended ? "Checked in" : "Registered"}</Badge></td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {r.certificateId ? <Badge color="green">Issued</Badge> : <span className="text-[#9E97B8]/40">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
