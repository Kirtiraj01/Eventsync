const BANNERS = [
  "from-indigo-500 to-violet-500",
  "from-violet-500 to-fuchsia-500",
  "from-blue-500 to-indigo-500",
  "from-indigo-400 to-violet-400",
  "from-purple-500 to-indigo-500",
  "from-violet-500 to-indigo-400",
];

// Deterministic banner pick from the event's id/title so it doesn't
// re-shuffle on every render.
export function bannerForEvent(event) {
  const seed = String(event._id || event.id || event.title || "");
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % BANNERS.length;
  return BANNERS[h];
}

export function daysLeftFor(eventDate) {
  const now = new Date();
  const then = new Date(eventDate);
  const diffMs = then.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}

export function formatEventDate(eventDate) {
  return new Date(eventDate).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatEventTime(eventDate) {
  return new Date(eventDate).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export const POSTER_PRESETS = [
  { id: "hackathon", label: "Hackathon & Dev", url: "/posters/hackathon.jpg" },
  { id: "robotics", label: "Robotics & Lab", url: "/posters/robotics.jpg" },
  { id: "ai-workshop", label: "AI & Tech Workshop", url: "/posters/ai-workshop.jpg" },
  { id: "freshers", label: "Freshers & Campus Meet", url: "/posters/freshers.jpg" },
  { id: "music-concert", label: "Live Music & Stage", url: "/posters/music-concert.jpg" },
  { id: "design-summit", label: "Design & Creative", url: "/posters/design-summit.jpg" },
];

export function posterForEvent(event) {
  if (event?.posterUrl && typeof event.posterUrl === "string" && event.posterUrl.trim()) {
    return event.posterUrl.trim();
  }

  const text = `${event?.title || ""} ${event?.description || ""} ${event?.clubName || ""}`.toLowerCase();

  if (/hackathon|code|coding|dev|hack|builder|software/.test(text)) {
    return "/posters/hackathon.jpg";
  }
  if (/robot|robotics|hardware|drone|bot|electronics/.test(text)) {
    return "/posters/robotics.jpg";
  }
  if (/ai|automation|workshop|machine learning|deep learning|data|lecture|seminar/.test(text)) {
    return "/posters/ai-workshop.jpg";
  }
  if (/fresher|freshers|welcome|orientation|meetup|carnival|fest|campus/.test(text)) {
    return "/posters/freshers.jpg";
  }
  if (/music|concert|band|acoustic|stage|sing|dance|live/.test(text)) {
    return "/posters/music-concert.jpg";
  }
  if (/design|ui|ux|creative|art/.test(text)) {
    return "/posters/design-summit.jpg";
  }

  // Deterministic clean fallback based on event id/title
  const seed = String(event?._id || event?.id || event?.title || "");
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % POSTER_PRESETS.length;
  return POSTER_PRESETS[h].url;
}

// Normalizes a raw backend Event document into the shape the UI components
// (EventCard, registration summary, dashboard lists) expect to render.
export function toDisplayEvent(event) {
  if (!event) return null;
  const club = event.clubId && typeof event.clubId === "object" ? event.clubId : null;
  return {
    id: event._id,
    title: event.title,
    description: event.description || "",
    location: event.location || "TBA",
    date: formatEventDate(event.eventDate),
    time: formatEventTime(event.eventDate),
    daysLeft: daysLeftFor(event.eventDate),
    banner: bannerForEvent(event),
    posterUrl: posterForEvent({ ...event, clubName: club?.name }),
    eventDateRaw: event.eventDate,
    clubName: club?.name || event.clubName || "",
    clubSlug: club?.slug || event.clubSlug || "",
  };
}
