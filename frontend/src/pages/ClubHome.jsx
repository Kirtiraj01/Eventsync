import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import AstrixEventsGallery from "../components/AstrixEventsGallery";
import PageTransition from "../components/PageTransition";
import CountUp from "../components/CountUp";
import { listAllPublicEvents, listClubs } from "../api/clubhub";
import { toDisplayEvent } from "../utils/format";
import {
  IconUsers,
  IconCalendar,
  IconTrendUp,
  IconSearch,
} from "../icons/Icons";

const categories = [
  "Music",
  "Events",
  "VIP",
  "Technology",
  "Literature",
  "Artist",
  "Collectibles",
  "Live",
  "Concert",
  "Weekend",
];

const stats = [
  { icon: IconUsers, value: "142+", label: "Registered this month" },
  { icon: IconCalendar, value: "8", label: "Active campus events" },
  { icon: IconTrendUp, value: "97%", label: "Verified check-in rate" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

export default function ClubHome() {
  const { slug } = useParams();
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(slug || "all");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([listAllPublicEvents(), listClubs()])
      .then(([eventsData, clubsData]) => {
        if (cancelled) return;
        setEvents(eventsData.map(toDisplayEvent));
        setClubs(clubsData || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Couldn't load campus events");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (slug) {
      setSelectedClub(slug);
    }
  }, [slug]);

  const filteredEvents = events.filter((ev) => {
    const matchesClub = !selectedClub || selectedClub === "all" || ev.clubSlug === selectedClub;
    const matchesSearch =
      !searchTerm.trim() ||
      ev.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ev.location && ev.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ev.clubName && ev.clubName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ev.description && ev.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      !selectedCategory ||
      selectedCategory === "Events" ||
      ev.title?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (ev.description && ev.description.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      (ev.clubName && ev.clubName.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      (ev.location && ev.location.toLowerCase().includes(selectedCategory.toLowerCase()));
    return matchesClub && matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#07050E] font-body flex flex-col text-text-main relative overflow-hidden">
      {/* Astrix Ambient Holographic Prism Accents */}
      <div className="absolute -top-12 -left-12 w-80 h-80 bg-gradient-to-br from-[#7C5CFC]/25 via-[#4E2A96]/15 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-24 -right-12 w-96 h-96 bg-gradient-to-bl from-[#9E7FFF]/20 via-[#7C5CFC]/15 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#7C5CFC]/8 rounded-full blur-[140px] pointer-events-none" />

      <Nav />

      <PageTransition className="flex-1">
        {/* Main Hero Section (Matching Uploaded Astrix Reference) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-4 relative z-10">
          {/* Centered Astrix Headline */}
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-brand-lavender tracking-tight select-none"
            >
              Explore You're First
            </motion.h1>

            {/* Astrix Capsule Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="w-full max-w-2xl mx-auto mt-6 relative flex items-center"
            >
              <span className="absolute left-5 text-[#8E85B4] pointer-events-none">
                <IconSearch width={20} height={20} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Events..."
                className="w-full bg-[#130E28] border border-[#261E4E] focus:border-[#7C5CFC] text-white rounded-full py-3.5 sm:py-4 pl-14 pr-12 text-sm sm:text-base placeholder-[#6B638A] shadow-card-dark outline-none transition-all focus:ring-2 focus:ring-[#7C5CFC]/30 font-heading"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 text-xs text-text-muted hover:text-white bg-[#201942] px-3 py-1.5 rounded-full font-bold cursor-pointer transition-colors"
                >
                  Clear
                </button>
              )}
            </motion.div>

            {/* Category Filter Pills (Exact replica from reference image) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="flex items-center justify-start sm:justify-center gap-2 sm:gap-2.5 overflow-x-auto pt-6 pb-2 scrollbar-none flex-nowrap"
            >
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(isActive ? "" : cat)}
                    className={`text-xs sm:text-sm font-semibold px-4 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer border ${
                      isActive
                        ? "bg-brand-lavender text-[#0B0814] font-bold border-brand-lavender shadow-glow-sm scale-105"
                        : "bg-[#130E28] text-[#F3F2F8] border-[#261E4E] hover:border-[#7C5CFC] hover:text-brand-lavender"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </motion.div>

            {/* Campus Club Filter Pills */}
            {clubs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pt-3 pb-1 scrollbar-none flex-nowrap"
              >
                <button
                  onClick={() => setSelectedClub("all")}
                  className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all cursor-pointer border ${
                    selectedClub === "all"
                      ? "bg-[#7C5CFC]/25 text-brand-lavender border-[#7C5CFC] font-bold shadow-glow-sm"
                      : "bg-[#130E28] text-text-muted border-[#261E4E] hover:border-[#7C5CFC]/50 hover:text-white"
                  }`}
                >
                  All Societies ({events.length})
                </button>
                {clubs.map((c) => {
                  const count = events.filter((ev) => ev.clubSlug === c.slug).length;
                  return (
                    <button
                      key={c.slug}
                      onClick={() => setSelectedClub(c.slug)}
                      className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all cursor-pointer border ${
                        selectedClub === c.slug
                          ? "bg-[#7C5CFC]/25 text-brand-lavender border-[#7C5CFC] font-bold shadow-glow-sm"
                          : "bg-[#130E28] text-text-muted border-[#261E4E] hover:border-[#7C5CFC]/50 hover:text-white"
                      }`}
                    >
                      {c.name} ({count})
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>
        </section>

        {/* Astrix Staggered Events Mosaic Gallery (Exact format from reference) */}
        <section id="events" className="w-full relative mt-2 mb-4">
          {loading && (
            <div className="flex items-center justify-center gap-5 py-12 px-6 overflow-hidden">
              <div className="w-[310px] h-[500px] rounded-[28px] bg-[#140E2D] border border-[#261E4E] animate-pulse shrink-0" />
              <div className="w-[300px] h-[500px] flex flex-col gap-4 shrink-0">
                <div className="h-[240px] rounded-2xl bg-[#140E2D] border border-[#261E4E] animate-pulse" />
                <div className="h-[240px] rounded-2xl bg-[#140E2D] border border-[#261E4E] animate-pulse" />
              </div>
              <div className="w-[260px] h-[500px] rounded-2xl bg-[#140E2D] border border-[#261E4E] animate-pulse shrink-0" />
            </div>
          )}

          {error && !loading && (
            <div className="max-w-xl mx-auto my-8 p-6 rounded-3xl text-center bg-rose-950/30 border border-rose-500/30">
              <p className="text-sm text-rose-300 font-medium">
                Couldn't reach EventSync's server. Make sure the backend is running at{" "}
                <code className="text-white font-mono bg-[#100C22] px-2.5 py-1 rounded-full border border-[#261E4E]">
                  {import.meta.env.VITE_API_URL || "http://localhost:5050"}
                </code>
              </p>
              <p className="text-xs text-rose-400 font-semibold mt-2">{error}</p>
            </div>
          )}

          {!loading && !error && filteredEvents.length === 0 && (
            <div className="max-w-md mx-auto my-12 p-8 rounded-3xl text-center bg-[#15102A] border border-dashed border-[#261E4E]">
              <p className="text-sm font-medium text-text-muted">No campus events found matching your filter.</p>
              <button
                onClick={() => {
                  setSelectedClub("all");
                  setSelectedCategory("");
                  setSearchTerm("");
                }}
                className="mt-3 text-xs font-bold text-brand-lavender hover:underline cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          )}

          {!loading && !error && filteredEvents.length > 0 && (
            <AstrixEventsGallery events={filteredEvents} />
          )}
        </section>

        {/* Astrix Signature Solid Lavender Ticker / Marquee Banner Strip directly below the gallery */}
        <div className="w-full ticker-ribbon bg-brand-lavender text-[#0B0814] py-3.5 font-extrabold text-xs sm:text-sm tracking-wide uppercase overflow-hidden shadow-glow-sm border-y border-[#7C5CFC]/40 my-4 font-ticker">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-8 font-ticker font-bold tracking-wide">
            <span>live on eventsync ✻</span>
            <span>Event : Oasis Bus tour , JLN Stadium , Delhi ✻</span>
            <span>REAL-TIME QR DOOR SCAN ✻</span>
            <span>VERIFIED PDF CERTIFICATES ✻</span>
            <span>MULTI-TENANT CAMPUS CLUBS ✻</span>
            <span>NO ACCOUNT REQUIRED TO REGISTER ✻</span>
            <span>INSTANT EMAIL PASS CONFIRMATION ✻</span>
            <span>LIVE TURN-OUT ANALYTICS ✻</span>
            <span>live on eventsync ✻</span>
            <span>Event : Oasis Bus tour , JLN Stadium , Delhi ✻</span>
            <span>REAL-TIME QR DOOR SCAN ✻</span>
            <span>VERIFIED PDF CERTIFICATES ✻</span>
            <span>MULTI-TENANT CAMPUS CLUBS ✻</span>
            <span>NO ACCOUNT REQUIRED TO REGISTER ✻</span>
            <span>INSTANT EMAIL PASS CONFIRMATION ✻</span>
            <span>LIVE TURN-OUT ANALYTICS ✻</span>
          </div>
        </div>

        {/* Top-line Stats Bar */}
        <section className="max-w-6xl mx-auto px-6 py-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
          >
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={itemVariants}
                whileHover={{ y: -3 }}
                className="card rounded-3xl p-6 bg-[#15102A] border border-[#261E4E] shadow-card-dark flex items-center gap-4 text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#201942] border border-[#3E2F77] text-brand-lavender flex items-center justify-center shrink-0 shadow-glow-sm">
                  <s.icon width={22} height={22} />
                </div>
                <div>
                  <p className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                    <CountUp value={s.value} />
                  </p>
                  <p className="text-xs text-text-muted font-medium mt-0.5">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* How It Works / Value Props */}
        <section id="about" className="max-w-6xl mx-auto px-6 py-16 border-t border-[#1F193B]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Simple. Fast. Verified.
            </h2>
            <p className="text-sm text-text-muted mt-2 font-medium">
              Everything students and campus club organizers need in one unified hub
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card rounded-3xl p-8 bg-[#15102A] border border-[#261E4E] shadow-card-dark flex flex-col gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#201942] border border-[#3E2F77] text-brand-lavender flex items-center justify-center font-bold text-xl shadow-glow-sm">
                1
              </div>
              <h3 className="font-heading font-extrabold text-white text-lg mt-2">1-Click Registration</h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-normal">
                Sign up with just your name and university email. No password or student account needed.
              </p>
            </div>

            <div className="card rounded-3xl p-8 bg-[#15102A] border border-[#261E4E] shadow-card-dark flex flex-col gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#201942] border border-[#3E2F77] text-brand-lavender flex items-center justify-center font-bold text-xl shadow-glow-sm">
                2
              </div>
              <h3 className="font-heading font-extrabold text-white text-lg mt-2">Door QR Check-in</h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-normal">
                Receive your signed QR ticket by email. Organizers scan it at the venue door in milliseconds.
              </p>
            </div>

            <div className="card rounded-3xl p-8 bg-[#15102A] border border-[#261E4E] shadow-card-dark flex flex-col gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#201942] border border-[#3E2F77] text-brand-lavender flex items-center justify-center font-bold text-xl shadow-glow-sm">
                3
              </div>
              <h3 className="font-heading font-extrabold text-white text-lg mt-2">Authentic Certificates</h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-normal">
                Attendance is verified and official certificates are emailed and downloadable with fraud-proof verification.
              </p>
            </div>
          </div>
        </section>
      </PageTransition>

      <Footer />
    </div>
  );
}
