import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../components/DashboardLayout";
import Badge from "../components/Badge";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { getEvent, listRegistrations, scanTicket } from "../api/clubhub";
import { toDisplayEvent } from "../utils/format";
import { IconCheckCircle, IconAlertTriangle } from "../icons/Icons";

export default function ScanCheckIn() {
  const { id } = useParams();
  const { clubSlug, token } = useAuth();

  const [event, setEvent] = useState(null);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [checkedInCount, setCheckedInCount] = useState(0);
  const [recentScans, setRecentScans] = useState([]);

  const [ticketInput, setTicketInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [scanError, setScanError] = useState(null);

  const refreshCounts = () => {
    listRegistrations(clubSlug, token, id).then((rows) => {
      setRegisteredCount(rows.length);
      setCheckedInCount(rows.filter((r) => r.attended).length);
    });
  };

  useEffect(() => {
    getEvent(clubSlug, id).then((e) => setEvent(toDisplayEvent(e)));
    refreshCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubSlug, token, id]);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;
    setScanning(true);
    setScanError(null);
    try {
      const result = await scanTicket(clubSlug, token, ticketInput.trim());
      setLastResult(result);
      setRecentScans((prev) => [{ ...result, ticketInput: ticketInput.trim() }, ...prev].slice(0, 6));
      setTicketInput("");
      refreshCounts();
    } catch (err) {
      setScanError(err.message || "Couldn't scan this ticket");
    } finally {
      setScanning(false);
    }
  };

  return (
    <DashboardLayout title="Scan check-in" subtitle={event?.title}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Scanner Viewfinder + Manual Entry */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Viewfinder */}
          <div className="relative bg-[#07050E] border border-surface-border rounded-3xl aspect-[16/10] overflow-hidden flex flex-col items-center justify-center shadow-glow-sm">
            {/* Viewfinder corners */}
            {[
              "top-6 left-6 border-t-2 border-l-2",
              "top-6 right-6 border-t-2 border-r-2",
              "bottom-6 left-6 border-b-2 border-l-2",
              "bottom-6 right-6 border-b-2 border-r-2",
            ].map((pos) => (
              <span key={pos} className={`absolute w-8 h-8 border-brand-violet rounded-sm ${pos}`} />
            ))}

            {/* Laser scanning beam */}
            <motion.div
              animate={{ y: [-80, 80, -80] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="absolute left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-brand-lavender to-transparent opacity-90 shadow-[0_0_16px_rgba(191,165,255,0.9)]"
            />

            <span className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[11px] font-bold text-white bg-rose-500/90 px-3.5 py-1 rounded-full shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> SCANNER ACTIVE
            </span>

            <p className="text-[#9E97B8] text-xs sm:text-sm px-6 text-center max-w-sm font-medium z-10">
              Camera scanning is simulated in this build — paste a ticket token below to check in an attendee
            </p>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleScan}
            className="card rounded-3xl p-6 bg-surface-card border border-surface-border shadow-glow-sm flex flex-col gap-3.5"
          >
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#9E97B8]">Ticket token (JWT)</label>
              <span className="text-[11px] font-semibold text-brand-lavender bg-brand-lavender/10 border border-brand-lavender/25 px-2.5 py-0.5 rounded-full">
                QR Payload
              </span>
            </div>
            <p className="text-xs text-[#9E97B8] -mt-1 font-medium">
              Paste the JWT string encoded inside the attendee's emailed QR ticket.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 mt-1">
              <input
                type="text"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                placeholder="eyJhbGciOi..."
                className="input-modern flex-1 font-mono text-xs"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={scanning}
                className="bg-brand-lavender text-[#0B0814] font-heading font-extrabold text-xs sm:text-sm rounded-full px-7 py-3 disabled:opacity-60 shadow-glow-sm hover:bg-[#D4C2FF] transition-all cursor-pointer shrink-0"
              >
                {scanning ? "Checking…" : "Check in"}
              </motion.button>
            </div>
            {scanError && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs sm:text-sm font-semibold text-rose-300 bg-rose-950/40 border border-rose-800/60 rounded-2xl px-4 py-2.5 mt-1"
              >
                {scanError}
              </motion.p>
            )}
          </motion.form>
        </div>

        {/* Results & Stats */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Registered" value={registeredCount} />
            <StatCard label="Checked in" value={checkedInCount} />
          </div>

          {/* Last result notification */}
          <AnimatePresence>
            {lastResult && (
              <motion.div
                key={lastResult.attendeeName + lastResult.status}
                initial={{ scale: 0.9, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className={`card rounded-3xl p-5 border shadow-glow-sm ${
                  lastResult.status === "checked_in"
                    ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-200"
                    : "bg-amber-950/40 border-amber-800/60 text-amber-200"
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                    lastResult.status === "checked_in" ? "bg-emerald-900/60 text-emerald-400" : "bg-amber-900/60 text-amber-400"
                  }`}>
                    {lastResult.status === "checked_in" ? (
                      <IconCheckCircle width={18} height={18} />
                    ) : (
                      <IconAlertTriangle width={18} height={18} />
                    )}
                  </span>
                  <div>
                    <p className={`text-sm font-bold ${lastResult.status === "checked_in" ? "text-emerald-300" : "text-amber-300"}`}>
                      {lastResult.status === "checked_in" ? "Check-in Successful" : "Already Scanned"}
                    </p>
                    <p className="text-xs text-[#9E97B8] font-medium">
                      {lastResult.status === "checked_in" ? "Attendance recorded • Added to certificate queue" : "Previously checked in"}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-[#9E97B8] flex flex-col gap-1 pl-10 font-medium">
                  <span className="text-[#F3F2F8] font-bold text-sm">{lastResult.attendeeName}</span>
                  <span>Scanned at {new Date(lastResult.attendedAt).toLocaleTimeString()}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent scans feed */}
          <div className="card rounded-3xl bg-surface-card border border-surface-border shadow-glow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#9E97B8]">Recent Scans</h2>
              <span className="text-[11px] font-semibold text-brand-lavender bg-brand-lavender/10 border border-brand-lavender/25 px-2.5 py-0.5 rounded-full">
                Live Feed
              </span>
            </div>
            <div className="divide-y divide-surface-border">
              {recentScans.length === 0 && (
                <p className="px-5 py-8 text-xs sm:text-sm text-[#9E97B8] font-medium text-center">No scans recorded this session.</p>
              )}
              {recentScans.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-surface-elevated/50 transition-colors"
                >
                  <p className="text-xs sm:text-sm font-bold text-[#F3F2F8] truncate">{s.attendeeName}</p>
                  <Badge color={s.status === "checked_in" ? "green" : "amber"}>
                    {s.status === "checked_in" ? "Checked in" : "Already scanned"}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
