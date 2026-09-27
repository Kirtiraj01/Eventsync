import { useRef } from "react";
import { Link } from "react-router-dom";
import { IconArrowRight, IconCalendar, IconPin, IconChevronRight } from "../icons/Icons";

// Helper to reliably extract Month & Day for the Astrix glass date badge
function getMonthAndDay(event) {
  if (typeof event === "object" && event !== null) {
    if (event.eventDateRaw) {
      const d = new Date(event.eventDateRaw);
      if (!isNaN(d.getTime())) {
        const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
        const day = d.toLocaleDateString("en-US", { day: "2-digit" });
        return { month, day, full: event.date };
      }
    }
    if (event.date) {
      return getMonthAndDay(event.date);
    }
  }

  const dateStr = String(event || "");
  if (!dateStr) return { month: "JAN", day: "25", full: "Sun, 25 Jan" };
  const parts = dateStr.replace(/,/g, "").split(" ");
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  let month = "JAN";
  let day = "25";

  for (const p of parts) {
    const upper = p.toUpperCase();
    if (months.includes(upper) || months.some((m) => upper.startsWith(m))) {
      month = upper.slice(0, 3);
    } else if (!isNaN(p) && p.length <= 2) {
      day = p.padStart(2, "0");
    }
  }

  return { month, day, full: dateStr };
}

// Preset color themes for visual diversity across the cards (Astrix moodboard)
const THEMES = [
  {
    bg: "from-[#2A0C54] via-[#150930] to-[#0A0518]",
    radial: "rgba(217,70,239,0.35)",
    ribbonText: "FREE ADMISSION FOR STUDENTS • PASS",
    genre: "LIVE & CONCERT",
    symbol: "🎤",
    accent: "text-rose-400",
  },
  {
    bg: "from-[#0F224D] via-[#0A142D] to-[#0A0518]",
    radial: "rgba(56,189,248,0.35)",
    ribbonText: "OFFICIAL CAMPUS ACCESS • PASS",
    genre: "HACKATHON & KEYNOTE",
    symbol: "⚡",
    accent: "text-cyan-400",
  },
  {
    bg: "from-[#351048] via-[#1C0A2A] to-[#0A0518]",
    radial: "rgba(168,85,247,0.35)",
    ribbonText: "DOOR SCAN PASS VERIFIED",
    genre: "CULTURE & EXHIBIT",
    symbol: "🎭",
    accent: "text-purple-400",
  },
  {
    bg: "from-[#2A1D0B] via-[#191106] to-[#0A0518]",
    radial: "rgba(251,146,60,0.35)",
    ribbonText: "LIMITED STUDENT PASSES • FAST PASS",
    genre: "ACOUSTIC & WORKSHOP",
    symbol: "🎸",
    accent: "text-amber-400",
  },
];

function getTheme(id = 0) {
  const seed = String(id);
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % THEMES.length;
  return THEMES[hash];
}

// 1. Tall Vertical Poster Card (Column 1 & 5 in reference media_1789623034115.png)
export function TallPosterCard({ event }) {
  const { month, day } = getMonthAndDay(event);
  const slug = event.clubSlug || "campus";
  const theme = getTheme(event.id || event._id || event.title);

  return (
    <Link
      to={`/club/${slug}/events/${event.id}/register`}
      className="group w-[290px] sm:w-[320px] h-[490px] sm:h-[510px] shrink-0 rounded-[28px] bg-[#120E28] border border-[#2E2458] hover:border-[#7C5CFC] overflow-hidden relative flex flex-col justify-between p-5 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer select-none"
    >
      {/* Clean Poster Image Background with tasteful dark vignette */}
      {event.posterUrl && (
        <img
          src={event.posterUrl}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out pointer-events-none"
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0814] via-[#0B0814]/70 to-black/35 pointer-events-none" />

      {/* Top Header: Club Presents on Left, Glass Date Badge on Right */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] font-bold text-brand-lavender bg-[#0B0814]/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 shadow-sm">
            PASS
          </span>
          <div className="text-left">
            <p className="font-mono text-[10px] tracking-wider uppercase font-bold text-white/90 leading-tight">
              {event.clubName ? event.clubName.toUpperCase() : "CAMPUS EVENTS"}
            </p>
            <p className="font-mono text-[9px] tracking-widest text-text-muted uppercase">PRESENTS</p>
          </div>
        </div>

        {/* Astrix Glass Date Badge */}
        <div className="bg-[#0B0814]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-center shadow-md">
          <p className="font-mono text-[10px] tracking-widest uppercase font-bold text-brand-lavender">{month}</p>
          <p className="font-heading font-extrabold text-base text-white leading-none mt-0.5">{day}</p>
        </div>
      </div>

      {/* Bottom Poster Headline Block */}
      <div className="relative z-10 text-center flex flex-col gap-1 mt-auto">
        <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-wider leading-none group-hover:text-brand-lavender transition-colors truncate">
          {event.title}
        </h3>
        <p className="font-mono text-[10px] font-bold text-brand-lavender tracking-[0.25em] uppercase mt-0.5">
          {theme.genre}
        </p>

        <div className="pt-2 border-t border-white/10 mt-1">
          <p className="font-mono text-[10px] text-text-muted uppercase truncate">
            FEATURING {event.location || "MAIN AUDITORIUM"} • {event.time || "6:00 PM"}
          </p>
        </div>

        {/* Solid Lavender Get Pass Button */}
        <div className="mt-2 w-full bg-brand-lavender text-[#0B0814] font-heading font-extrabold text-xs py-2.5 rounded-full group-hover:bg-[#D4C2FF] shadow-glow-sm flex items-center justify-center gap-1.5 transition-all">
          <span>Get Pass</span>
          <IconArrowRight width={13} height={13} />
        </div>
      </div>
    </Link>
  );
}

// 2. Horizontal Stacked Card (Column 2 & 4 in reference media_1789623034115.png)
export function HorizontalStackedCard({ event }) {
  const { month, day } = getMonthAndDay(event);
  const slug = event.clubSlug || "campus";

  return (
    <Link
      to={`/club/${slug}/events/${event.id}/register`}
      className="group h-[238px] rounded-2xl bg-[#120E28] border border-[#2E2458] hover:border-[#7C5CFC] overflow-hidden flex flex-col shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none"
    >
      {/* Top 16:9 Banner Graphic with Poster */}
      <div className="h-32 relative bg-[#1A1435] overflow-hidden flex flex-col justify-between p-3">
        {event.posterUrl && (
          <img
            src={event.posterUrl}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out pointer-events-none"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#120E28] via-black/40 to-black/25 pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between">
          <div className="bg-[#0B0814]/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-left">
            <p className="font-mono text-[9px] font-bold text-brand-lavender uppercase">{month} {day}</p>
            <p className="font-mono text-[9px] text-text-muted">{event.time || "10:00 PM"}</p>
          </div>

          <span className="font-mono text-[9px] font-bold text-white/90 bg-[#0B0814]/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
            CAMPUS
          </span>
        </div>

        <div className="relative z-10">
          <p className="font-heading font-extrabold text-sm text-white uppercase tracking-wider truncate drop-shadow-md">
            {event.title}
          </p>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="p-3 flex-1 flex flex-col justify-between bg-[#120E28]">
        <div>
          <h4 className="font-heading font-bold text-sm text-white group-hover:text-brand-lavender transition-colors truncate">
            {event.title}
          </h4>
          <p className="font-mono text-[11px] text-text-muted mt-0.5 truncate">
            {event.date} • {event.time || "10:00 PM onwards"}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-text-muted border-t border-[#1F183E] mt-1">
          <span className="truncate max-w-[170px]">{event.location || "Campus Hall"}</span>
          <span className="text-brand-lavender font-bold group-hover:underline">Pass →</span>
        </div>
      </div>
    </Link>
  );
}

// 3. Medium Poster Card (Column 3 in reference media_1789623034115.png)
export function MediumPosterCard({ event }) {
  const { month, day } = getMonthAndDay(event);
  const slug = event.clubSlug || "campus";

  return (
    <Link
      to={`/club/${slug}/events/${event.id}/register`}
      className="group w-[240px] sm:w-[260px] h-[490px] sm:h-[510px] shrink-0 rounded-2xl bg-[#120E28] border border-[#2E2458] hover:border-[#7C5CFC] overflow-hidden flex flex-col shadow-lg transition-all duration-300 hover:-translate-y-1.5 cursor-pointer select-none"
    >
      {/* Top 65% Graphic Poster */}
      <div className="h-[330px] relative bg-[#1A1435] overflow-hidden flex flex-col justify-between p-4">
        {event.posterUrl && (
          <img
            src={event.posterUrl}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out pointer-events-none"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#120E28] via-black/40 to-black/25 pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between">
          <span className="font-mono text-[9px] font-bold text-brand-lavender uppercase tracking-wider bg-[#0B0814]/85 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
            {event.clubName ? event.clubName.slice(0, 14).toUpperCase() : "CLUB"}
          </span>

          <div className="bg-[#0B0814]/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-center">
            <p className="font-mono text-[9px] text-brand-lavender font-bold">{day}</p>
            <p className="font-mono text-[8px] text-text-muted uppercase">{month}</p>
          </div>
        </div>

        {/* Center Poster Headline */}
        <div className="relative z-10 text-center my-auto">
          <p className="font-heading font-extrabold text-2xl text-white tracking-wide uppercase drop-shadow-md truncate">
            {event.title}
          </p>
          <p className="font-mono text-[10px] text-brand-lavender uppercase tracking-wider mt-1 truncate">
            {event.clubName || "CAMPUS SOCIETY"}
          </p>
        </div>

        <div className="relative z-10">
          <span className="font-mono text-[9px] text-white/90 bg-[#0B0814]/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            {event.daysLeft || 3} days left
          </span>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-[#120E28]">
        <div>
          <h4 className="font-heading font-bold text-sm text-white group-hover:text-brand-lavender transition-colors truncate">
            {event.title}
          </h4>
          <p className="font-mono text-xs text-text-muted mt-1 truncate">
            {event.date} • {event.time || "10:00 PM onwards"}
          </p>
        </div>

        <div className="mt-auto pt-2">
          <div className="w-full bg-brand-lavender text-[#0B0814] font-heading font-extrabold text-xs py-2.5 rounded-full group-hover:bg-[#D4C2FF] shadow-glow-sm flex items-center justify-center gap-1.5 transition-all">
            <span>Get Pass</span>
            <IconArrowRight width={12} height={12} />
          </div>
        </div>
      </div>
    </Link>
  );
}

// Master Staggered Gallery (Renders events in the exact layout from media_1789623034115.png)
export default function AstrixEventsGallery({ events = [] }) {
  const scrollRef = useRef(null);

  if (!events || events.length === 0) return null;

  // Build the staggered column sequence matching media_1789623034115.png:
  // Col 0: Tall Poster
  // Col 1: Stack of 2
  // Col 2: Medium Poster
  // Col 3: Stack of 2
  // Col 4: Tall Poster
  // ... repeats cleanly without duplicate cards
  const columns = [];
  let eventIdx = 0;
  let patternStep = 0;

  while (eventIdx < events.length) {
    const remaining = events.length - eventIdx;
    const step = patternStep % 4;

    if (step === 0 || (remaining === 1 && step !== 2)) {
      // Tall Poster Card
      columns.push({
        type: "tall",
        key: `tall-${events[eventIdx].id || eventIdx}`,
        event: events[eventIdx],
      });
      eventIdx += 1;
    } else if (step === 1 || step === 3) {
      if (remaining >= 2) {
        // Stack of 2 Horizontal Cards
        columns.push({
          type: "stack",
          key: `stack-${events[eventIdx].id || eventIdx}`,
          topEvent: events[eventIdx],
          bottomEvent: events[eventIdx + 1],
        });
        eventIdx += 2;
      } else {
        // Only 1 left, render as medium poster
        columns.push({
          type: "medium",
          key: `medium-${events[eventIdx].id || eventIdx}`,
          event: events[eventIdx],
        });
        eventIdx += 1;
      }
    } else if (step === 2) {
      // Medium Poster Card
      columns.push({
        type: "medium",
        key: `medium-${events[eventIdx].id || eventIdx}`,
        event: events[eventIdx],
      });
      eventIdx += 1;
    }

    patternStep += 1;
  }

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full py-4 group/gallery">
      {/* Optional subtle scroll arrows for easy desktop navigation */}
      {columns.length > 3 && (
        <>
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#120E28]/90 border border-[#2E2458] text-white hover:text-brand-lavender hover:border-[#7C5CFC] flex items-center justify-center shadow-2xl backdrop-blur-md transition-all opacity-0 group-hover/gallery:opacity-100 cursor-pointer rotate-180"
          >
            <IconChevronRight width={18} height={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#120E28]/90 border border-[#2E2458] text-white hover:text-brand-lavender hover:border-[#7C5CFC] flex items-center justify-center shadow-2xl backdrop-blur-md transition-all opacity-0 group-hover/gallery:opacity-100 cursor-pointer"
          >
            <IconChevronRight width={18} height={18} />
          </button>
        </>
      )}

      <div
        ref={scrollRef}
        className="w-full overflow-x-auto scrollbar-none px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center gap-4 sm:gap-5 flex-nowrap min-w-max mx-auto justify-start xl:justify-center">
          {columns.map((col) => {
            if (col.type === "tall") {
              return <TallPosterCard key={col.key} event={col.event} />;
            }
            if (col.type === "stack") {
              return (
                <div key={col.key} className="w-[280px] sm:w-[310px] shrink-0 flex flex-col gap-4">
                  <HorizontalStackedCard event={col.topEvent} />
                  <HorizontalStackedCard event={col.bottomEvent} />
                </div>
              );
            }
            if (col.type === "medium") {
              return <MediumPosterCard key={col.key} event={col.event} />;
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
