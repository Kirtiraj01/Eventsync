import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import { useAuth } from "../context/AuthContext";
import {
  listAllEventsForMember,
  listRegistrations,
  downloadCertificateUrl,
  generateCertificates,
} from "../api/clubhub";
import { toDisplayEvent } from "../utils/format";
import { IconChevronDown, IconDownload, IconAward, IconCheckCircle, IconMail } from "../icons/Icons";

const filters = ["All", "In Queue", "Issued"];

export default function CertificateManager() {
  const { clubSlug, token } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rows, setRows] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Batch certificate generation state
  const [generating, setGenerating] = useState(false);
  const [generateSuccess, setGenerateSuccess] = useState(null);
  const [generateError, setGenerateError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    listAllEventsForMember(clubSlug, token)
      .then((data) => {
        if (cancelled) return;
        const displayed = data.map(toDisplayEvent);
        setEvents(displayed);
        if (displayed.length > 0) setSelectedEvent(displayed[0].id);
        else setLoading(false);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Couldn't load events");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [clubSlug, token]);

  const loadEventRegistrations = (eventId) => {
    setLoading(true);
    setError(null);
    listRegistrations(clubSlug, token, eventId)
      .then((data) => {
        setRows(data.filter((r) => r.attended));
      })
      .catch((err) => {
        setError(err.message || "Couldn't load registrations");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!selectedEvent) return;
    loadEventRegistrations(selectedEvent);
  }, [clubSlug, token, selectedEvent]);

  const handleBatchGenerate = async (forceAll = false) => {
    if (!selectedEvent) return;
    setGenerating(true);
    setGenerateSuccess(null);
    setGenerateError(null);

    try {
      const res = await generateCertificates(clubSlug, token, selectedEvent, { forceAll });
      setGenerateSuccess(res.message || `Successfully generated and emailed ${res.totalGenerated} certificate(s)!`);
      // Reload attendee rows to show updated certificate IDs
      await loadEventRegistrations(selectedEvent);
    } catch (err) {
      setGenerateError(err.message || "Failed to generate certificates");
    } finally {
      setGenerating(false);
    }
  };

  const issued = rows.filter((r) => r.certificateId).length;
  const pending = rows.filter((r) => !r.certificateId).length;

  const stats = [
    { label: "Attendees Checked In", value: rows.length },
    { label: "In Queue (Pending)", value: pending },
    { label: "Certificates Issued & Emailed", value: issued },
  ];

  const filteredRows = rows.filter((r) => {
    if (activeFilter === "Issued") return Boolean(r.certificateId);
    if (activeFilter === "In Queue") return !r.certificateId;
    return true;
  });

  const selectedEventObj = events.find((e) => e.id === selectedEvent);

  return (
    <DashboardLayout
      title="Certificates"
      subtitle="Manual queue processing: Review attendees and generate certificates in batch with direct email delivery"
      actions={
        events.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <select
                value={selectedEvent || ""}
                onChange={(e) => {
                  setSelectedEvent(e.target.value);
                  setGenerateSuccess(null);
                  setGenerateError(null);
                }}
                className="appearance-none text-xs sm:text-sm font-semibold text-[#F3F2F8] bg-surface-elevated border border-surface-border rounded-full pl-4 pr-9 py-2.5 outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20 cursor-pointer shadow-2xs"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id} className="bg-[#15102A] text-[#F3F2F8]">{ev.title}</option>
                ))}
              </select>
              <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E97B8] pointer-events-none" width={14} height={14} />
            </div>

            {/* Manual Generate & Email Certificates Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleBatchGenerate(false)}
              disabled={generating || pending === 0}
              className="bg-brand-lavender text-[#0B0814] font-heading font-extrabold text-xs sm:text-sm rounded-full px-6 py-2.5 flex items-center gap-2 shadow-glow-sm hover:bg-[#D4C2FF] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {generating ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Generating & Emailing…
                </>
              ) : (
                <>
                  <IconAward width={16} height={16} />
                  Generate Certificates ({pending} in queue)
                </>
              )}
            </motion.button>
          </div>
        )
      }
    >
      {error && (
        <div className="card rounded-2xl p-4 mb-6 bg-rose-950/50 border border-rose-800/60 text-rose-300 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Success Notification Banner */}
      <AnimatePresence>
        {generateSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="card rounded-2xl p-4 mb-6 bg-emerald-950/50 border border-emerald-800/60 text-emerald-200 text-sm font-semibold flex items-center gap-3 shadow-xs"
          >
            <span className="w-8 h-8 rounded-xl bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0">
              <IconCheckCircle width={18} height={18} />
            </span>
            <div className="flex-1">
              <p className="font-bold text-emerald-300">Batch Generation Completed</p>
              <p className="text-xs text-emerald-400/90 font-medium">{generateSuccess}</p>
            </div>
            <button
              onClick={() => setGenerateSuccess(null)}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-200"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Notification Banner */}
      {generateError && (
        <div className="card rounded-2xl p-4 mb-6 bg-rose-950/50 border border-rose-800/60 text-rose-300 text-sm font-medium">
          {generateError}
        </div>
      )}

      {!loading && events.length === 0 && !error && (
        <div className="card rounded-3xl p-12 text-center bg-surface-card border border-surface-border shadow-glow-sm">
          <p className="text-sm font-medium text-[#9E97B8]">Create an event first — certificates are tied to attendance at a specific event.</p>
        </div>
      )}

      {selectedEvent && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
            {stats.map((s) => (
              <StatCard key={s.label} label={s.label} value={loading ? "…" : s.value} />
            ))}
          </div>

          {/* Queue Status Callout */}
          {pending > 0 && (
            <div className="card rounded-3xl p-6 mb-6 bg-surface-card border border-brand-violet/40 shadow-glow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
              <div className="flex items-center gap-3.5">
                <span className="w-10 h-10 rounded-2xl bg-brand-lavender/10 border border-brand-lavender/25 text-brand-lavender flex items-center justify-center shrink-0 shadow-2xs">
                  <IconMail width={20} height={20} />
                </span>
                <div>
                  <p className="text-sm font-bold text-[#F3F2F8]">
                    {pending} attendee{pending === 1 ? "" : "s"} waiting for certificate issuance
                  </p>
                  <p className="text-xs text-[#9E97B8] font-medium mt-0.5">
                    Door check-in records attendance only. Click "Generate Certificates" to batch-render verified PDFs and forward them to each attendee's email address.
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBatchGenerate(false)}
                disabled={generating}
                className="btn-primary text-xs font-semibold rounded-full px-6 py-2.5 shrink-0 shadow-glow-sm disabled:opacity-60 cursor-pointer"
              >
                {generating ? "Processing..." : `Process Queue (${pending})`}
              </motion.button>
            </div>
          )}

          {/* Filter Pills */}
          <div className="flex items-center gap-2 mb-4 bg-surface-elevated/80 border border-surface-border p-1 rounded-full w-fit">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`relative text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full transition-colors cursor-pointer ${
                  activeFilter === f ? "text-black font-bold" : "text-[#9E97B8] hover:text-[#F3F2F8]"
                }`}
              >
                {activeFilter === f && (
                  <motion.div
                    layoutId="certFilter"
                    className="absolute inset-0 bg-brand-lavender rounded-full shadow-glow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{f}</span>
              </button>
            ))}
          </div>

          {/* Attendees Table */}
          <div className="card rounded-3xl bg-surface-card border border-surface-border shadow-glow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="text-xs font-bold text-[#9E97B8] uppercase tracking-wider bg-[#100C22] border-b border-surface-border">
                    <th className="px-6 py-4">Attendee</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Check-in Time</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Certificate ID</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {!loading && filteredRows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[#9E97B8] font-medium">
                        {rows.length === 0
                          ? "No attendees have checked in to this event yet. Check in attendees from the Scan page to add them to the certificate queue."
                          : "No matching attendees found for this filter."}
                      </td>
                    </tr>
                  )}
                  {filteredRows.map((r) => (
                    <tr key={r._id} className="hover:bg-surface-elevated/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#F3F2F8] whitespace-nowrap">{r.attendeeName}</td>
                      <td className="px-6 py-4 text-[#9E97B8] whitespace-nowrap font-medium">{r.attendeeEmail}</td>
                      <td className="px-6 py-4 text-[#9E97B8] whitespace-nowrap font-medium">
                        {r.attendedAt ? new Date(r.attendedAt).toLocaleTimeString() : "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge color={r.certificateId ? "green" : "amber"}>
                          {r.certificateId ? "Issued & Emailed" : "In Queue (Pending)"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">
                        {r.certificateId ? (
                          <span className="text-brand-lavender font-bold">{r.certificateId}</span>
                        ) : (
                          <span className="text-amber-400 font-sans font-medium text-xs">Awaiting issuance</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {r.certificateId ? (
                          <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={downloadCertificateUrl(r._id)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-black font-bold text-xs bg-brand-lavender px-4 py-1.5 rounded-full hover:bg-brand-lavender/90 transition-colors shadow-2xs"
                          >
                            <IconDownload width={13} height={13} /> Download PDF
                          </motion.a>
                        ) : (
                          <span className="text-xs text-[#9E97B8] font-medium italic">Ready in queue</span>
                        )}
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
