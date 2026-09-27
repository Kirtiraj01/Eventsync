import { useLocation, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import { IconCheckCircle, IconPin, IconCalendar, IconClock, IconMail, IconArrowRight } from "../icons/Icons";

export default function TicketConfirmation() {
  const { slug } = useParams();
  const { state } = useLocation();

  const form = state?.form;
  const event = state?.event;
  const registrationId = state?.registrationId;

  if (!form || !event || !registrationId) {
    return (
      <div className="min-h-screen bg-night font-body flex flex-col text-[#F3F2F8]">
        <Nav />
        <div className="max-w-md mx-auto px-6 py-24 text-center flex-1 flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-[#9E97B8]">
            We don't have your confirmation details handy — this page is only reachable right after registering.
          </p>
          <Link to={`/club/${slug}`} className="text-brand-lavender text-sm font-bold mt-4 inline-flex items-center gap-1 hover:underline">
            ← Back to club events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night font-body flex flex-col text-[#F3F2F8]">
      <Nav />

      <PageTransition className="flex-1">
        <section className="max-w-2xl mx-auto px-6 py-14 sm:py-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
            className="w-16 h-16 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 flex items-center justify-center mx-auto mb-5 shadow-glow-sm"
          >
            <IconCheckCircle width={32} height={32} />
          </motion.div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#F3F2F8] mb-2 tracking-tight">
            You're registered! 🎉
          </h1>
          <p className="text-[#9E97B8] text-sm mb-10 font-medium">
            Your QR pass has been emailed to <span className="text-brand-lavender font-bold">{form.email}</span>
          </p>

          {/* Ticket Card - Boarding Pass Style */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="card rounded-3xl overflow-hidden text-left bg-surface-card border border-surface-border shadow-glow-sm relative"
          >
            <div className={`h-3.5 bg-gradient-to-r ${event.banner || "from-brand-violet to-purple-600"}`} />

            <div className="p-6 sm:p-8 flex flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-brand-lavender uppercase tracking-wider bg-brand-lavender/10 border border-brand-lavender/25 px-3 py-1 rounded-full">
                    Confirmed Pass
                  </span>
                  <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#F3F2F8] mt-2.5">{event.title}</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-[#9E97B8]">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-brand-lavender/10 border border-brand-lavender/25 text-brand-lavender flex items-center justify-center shrink-0">
                    <IconCalendar width={13} height={13} />
                  </span>
                  <span className="font-medium text-[#F3F2F8]">{event.date}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-brand-lavender/10 border border-brand-lavender/25 text-brand-lavender flex items-center justify-center shrink-0">
                    <IconClock width={13} height={13} />
                  </span>
                  <span className="font-medium text-[#F3F2F8]">{event.time}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-brand-lavender/10 border border-brand-lavender/25 text-brand-lavender flex items-center justify-center shrink-0">
                    <IconPin width={13} height={13} />
                  </span>
                  <span className="font-medium text-[#F3F2F8] truncate">{event.location}</span>
                </span>
              </div>

              {/* Perforated tear line with notches */}
              <div className="border-t-2 border-dashed border-surface-border mt-2 pt-5 relative">
                <span className="absolute -left-9 -top-3 w-6 h-6 rounded-full bg-night border border-surface-border" />
                <span className="absolute -right-9 -top-3 w-6 h-6 rounded-full bg-night border border-surface-border" />
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-[#9E97B8] uppercase tracking-wider font-bold text-[10px]">Attendee Name</p>
                    <p className="text-sm font-bold text-[#F3F2F8] mt-0.5">{form.name}</p>
                  </div>
                  <div>
                    <p className="text-[#9E97B8] uppercase tracking-wider font-bold text-[10px]">Registration ID</p>
                    <p className="text-xs font-mono font-bold text-brand-lavender mt-0.5">{registrationId}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="card rounded-2xl p-5 mt-6 flex items-start gap-3.5 text-left bg-surface-elevated/70 border border-surface-border shadow-2xs">
            <span className="w-9 h-9 rounded-xl bg-brand-lavender/10 border border-brand-lavender/25 text-brand-lavender flex items-center justify-center shrink-0 shadow-2xs">
              <IconMail width={18} height={18} />
            </span>
            <p className="text-xs sm:text-sm text-[#9E97B8] font-medium leading-relaxed">
              Your QR ticket was sent as an attachment to your email — that is the pass to show at the door.
              Save your registration ID to download your certificate after attending.
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="mt-8">
            <Link
              to={`/certificate/${registrationId}`}
              className="bg-brand-lavender text-[#0B0814] font-heading font-extrabold rounded-full px-8 py-3.5 inline-flex items-center gap-2 text-sm shadow-glow-sm hover:bg-[#D4C2FF] transition-all cursor-pointer"
            >
              Check Certificate Status <IconArrowRight width={16} height={16} />
            </Link>
          </motion.div>
        </section>
      </PageTransition>

      <Footer />
    </div>
  );
}
