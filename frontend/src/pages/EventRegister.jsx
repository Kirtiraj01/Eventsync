import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import { getClub, getEvent, registerForEvent } from "../api/clubhub";
import { toDisplayEvent } from "../utils/format";
import { IconPin, IconCalendar, IconClock, IconMail, IconArrowRight } from "../icons/Icons";

const nextSteps = [
  "Ticket generated instantly",
  "Emailed directly to you",
  "Show QR at the door",
  "Certificate ready upon check-in",
];

export default function EventRegister() {
  const { slug, id } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    Promise.all([getClub(slug), getEvent(slug, id)])
      .then(([clubData, eventData]) => {
        if (cancelled) return;
        setClub(clubData);
        setEvent(toDisplayEvent(eventData));
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message || "Couldn't load this event");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      const result = await registerForEvent(slug, id, {
        attendeeName: form.name,
        attendeeEmail: form.email,
      });
      navigate(`/club/${slug}/events/${id}/ticket`, {
        state: { form, registrationId: result.registrationId, event },
      });
    } catch (err) {
      setSubmitError(err.message || "Something went wrong — please try again");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-night font-body flex flex-col text-[#F3F2F8]">
        <Nav clubName={club?.name} />
        <div className="max-w-5xl mx-auto px-6 py-24 text-center text-[#9E97B8] text-sm flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2.5">
            <span className="w-4 h-4 rounded-full border-2 border-brand-lavender border-t-transparent animate-spin" />
            <span>Loading event details…</span>
          </div>
        </div>
      </div>
    );
  }

  if (loadError || !event) {
    return (
      <div className="min-h-screen bg-night font-body flex flex-col text-[#F3F2F8]">
        <Nav clubName={club?.name} />
        <div className="max-w-md mx-auto px-6 py-24 text-center flex-1 flex flex-col items-center justify-center">
          <p className="text-sm text-[#9E97B8]">{loadError || "Event not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night font-body flex flex-col text-[#F3F2F8]">
      <Nav clubName={club?.name} />

      <PageTransition className="flex-1">
        <section className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
          {club && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-lavender bg-brand-lavender/10 border border-brand-lavender/25 px-3.5 py-1 rounded-full mb-3 shadow-2xs">
              {club.name}
            </span>
          )}
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#F3F2F8] mb-10 tracking-tight">
            Register for {event.title}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-3 card rounded-3xl p-6 sm:p-8 bg-surface-card border border-surface-border shadow-glow-sm"
            >
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#9E97B8] mb-1.5">Full name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Ananya Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-modern"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#9E97B8] mb-1.5">Email address</label>
                  <input
                    required
                    type="email"
                    placeholder="you@college.edu"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-modern"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#9E97B8] mb-1.5">
                    Phone number <span className="text-[#9E97B8]/70 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98xxxxxx"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input-modern"
                  />
                </div>

                {submitError && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm font-semibold text-rose-300 bg-rose-950/40 border border-rose-800/60 rounded-2xl px-4 py-2.5"
                  >
                    {submitError}
                  </motion.p>
                )}

                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitting}
                    className="bg-brand-lavender text-[#0B0814] font-heading font-extrabold rounded-full px-8 py-3.5 flex items-center gap-2 text-sm disabled:opacity-60 shadow-glow-sm hover:bg-[#D4C2FF] transition-all cursor-pointer"
                  >
                    {submitting ? "Getting your pass…" : "Get my pass"} <IconArrowRight width={16} height={16} />
                  </motion.button>
                  <p className="text-xs text-[#9E97B8] flex items-center gap-1.5 font-medium">
                    <IconMail className="text-brand-lavender shrink-0" width={16} height={16} />
                    Instant delivery to your email
                  </p>
                </div>
              </form>
            </motion.div>

            {/* Event summary card */}
            <aside className="lg:col-span-2 sticky top-24">
              <div className="card rounded-3xl overflow-hidden bg-surface-card border border-surface-border shadow-glow-sm">
                <div className="h-36 relative bg-[#1A1435] overflow-hidden">
                  {event.posterUrl ? (
                    <img
                      src={event.posterUrl}
                      alt={event.title}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${event.banner || "from-brand-violet to-purple-800"}`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 text-[11px] font-semibold bg-night/85 backdrop-blur-md text-[#F3F2F8] border border-white/10 px-3 py-1 rounded-full shadow-xs">
                    {event.daysLeft} days left
                  </span>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <h2 className="font-heading font-bold text-lg text-[#F3F2F8]">{event.title}</h2>

                  <div className="flex flex-col gap-2 text-xs sm:text-sm text-[#9E97B8]">
                    <span className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-brand-lavender/10 border border-brand-lavender/25 text-brand-lavender flex items-center justify-center shrink-0">
                        <IconCalendar width={13} height={13} />
                      </span>
                      {event.date}
                    </span>
                    <span className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-brand-lavender/10 border border-brand-lavender/25 text-brand-lavender flex items-center justify-center shrink-0">
                        <IconClock width={13} height={13} />
                      </span>
                      {event.time}
                    </span>
                    <span className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-brand-lavender/10 border border-brand-lavender/25 text-brand-lavender flex items-center justify-center shrink-0">
                        <IconPin width={13} height={13} />
                      </span>
                      {event.location}
                    </span>
                  </div>

                  <div className="border-t border-surface-border pt-4 mt-1">
                    <p className="text-xs font-bold text-[#9E97B8] uppercase tracking-wider mb-3">What happens next</p>
                    <ol className="flex flex-col gap-2.5">
                      {nextSteps.map((step, i) => (
                        <li key={step} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#9E97B8]">
                          <span className="w-5 h-5 rounded-full bg-brand-lavender/15 text-brand-lavender border border-brand-lavender/25 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <span className="font-medium text-[#F3F2F8]">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </PageTransition>

      <Footer />
    </div>
  );
}
