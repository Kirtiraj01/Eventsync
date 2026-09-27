import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import Badge from "../components/Badge";
import { verifyCertificate } from "../api/clubhub";
import { IconShield } from "../icons/Icons";

export default function CertificateVerify() {
  const { certificateId } = useParams();
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("checking"); // checking | done | error

  useEffect(() => {
    let cancelled = false;
    setStatus("checking");

    verifyCertificate(certificateId)
      .then((data) => {
        if (!cancelled) {
          setResult(data);
          setStatus("done");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResult({ valid: false });
          setStatus("done");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [certificateId]);

  const rows = result?.valid
    ? [
        { label: "Attendee name", value: result.attendeeName },
        { label: "Event", value: result.eventTitle },
        { label: "Club", value: result.clubName },
        { label: "Date", value: result.date ? new Date(result.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—" },
      ]
    : [];

  return (
    <div className="min-h-screen bg-night font-body flex flex-col text-[#F3F2F8]">
      <Nav />

      <PageTransition className="flex-1">
        <section className="max-w-lg mx-auto px-6 py-16 text-center">
          {status === "checking" && (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <span className="w-5 h-5 rounded-full border-2 border-brand-lavender border-t-transparent animate-spin" />
              <p className="text-sm font-medium text-[#9E97B8]">Verifying certificate authenticity…</p>
            </div>
          )}

          {status === "done" && (
            <>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow-sm ${
                  result.valid
                    ? "bg-brand-lavender/10 text-brand-lavender border border-brand-lavender/25"
                    : "bg-rose-950/60 text-rose-400 border border-rose-800/60"
                }`}
              >
                <IconShield />
              </motion.span>

              <h1 className="font-heading font-extrabold text-3xl text-[#F3F2F8] mb-2 tracking-tight">
                {result.valid ? "Certificate verified" : "Certificate not found"}
              </h1>
              <p className="text-[#9E97B8] text-sm mb-8 font-medium">
                {result.valid ? (
                  <>Certificate ID <code className="font-bold text-brand-lavender bg-surface-elevated px-2.5 py-1 rounded-full border border-surface-border">{certificateId}</code> is authentic.</>
                ) : (
                  <>We couldn't verify a certificate with ID <code className="font-bold text-brand-lavender bg-surface-elevated px-2.5 py-1 rounded-full border border-surface-border">{certificateId}</code>.</>
                )}
              </p>

              {result.valid && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="card rounded-3xl overflow-hidden text-left bg-surface-card border border-surface-border shadow-glow-sm"
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-[#100C22]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#9E97B8]">Certificate Details</span>
                    <Badge color="green">AUTHENTIC</Badge>
                  </div>

                  <div className="p-6 flex flex-col gap-4">
                    {rows.map((row) => (
                      <div key={row.label} className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-[#9E97B8] font-medium">{row.label}</span>
                        <span className="text-[#F3F2F8] font-bold text-right">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <p className="text-xs text-[#9E97B8] font-medium mt-6 max-w-sm mx-auto leading-relaxed">
                This public verification page never exposes personal contact details — it only confirms credentials issued by the club.
              </p>
            </>
          )}
        </section>
      </PageTransition>

      <Footer />
    </div>
  );
}
