import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../components/DashboardLayout";
import EventCard from "../components/EventCard";
import { useAuth } from "../context/AuthContext";
import { createEvent, updateEvent, getEvent } from "../api/clubhub";
import { toDisplayEvent, POSTER_PRESETS } from "../utils/format";

export default function EventEditor() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { clubSlug, token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
    posterUrl: "",
  });
  const [loadingEvent, setLoadingEvent] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEditing || !clubSlug || !id) return;
    let cancelled = false;
    setLoadingEvent(true);

    getEvent(clubSlug, id)
      .then((data) => {
        if (cancelled || !data) return;
        const d = new Date(data.eventDate);
        const dateStr = !isNaN(d.getTime()) ? d.toISOString().split("T")[0] : "";
        const timeStr = !isNaN(d.getTime()) ? d.toTimeString().slice(0, 5) : "";
        setForm({
          title: data.title || "",
          description: data.description || "",
          date: dateStr,
          time: timeStr,
          location: data.location || "",
          capacity: "",
          posterUrl: data.posterUrl || "",
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Couldn't load event for editing");
      })
      .finally(() => {
        if (!cancelled) setLoadingEvent(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isEditing, clubSlug, id]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const eventDateIso = form.date && form.time ? new Date(`${form.date}T${form.time}`).toISOString() : null;

  const previewRaw = {
    _id: id || "preview",
    title: form.title || "Your event title",
    location: form.location,
    eventDate: eventDateIso || new Date().toISOString(),
    posterUrl: form.posterUrl,
  };
  const previewEvent = { ...toDisplayEvent(previewRaw), id: id || "preview" };
  if (!form.location) previewEvent.location = "Venue not set";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.title || !eventDateIso) {
      setError("Title, date, and time are required.");
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing) {
        await updateEvent(clubSlug, token, id, {
          title: form.title,
          description: form.description,
          eventDate: eventDateIso,
          location: form.location,
          posterUrl: form.posterUrl,
        });
      } else {
        await createEvent(clubSlug, token, {
          title: form.title,
          description: form.description,
          eventDate: eventDateIso,
          location: form.location,
          posterUrl: form.posterUrl,
        });
      }
      navigate("/dashboard/events");
    } catch (err) {
      setError(err.message || (isEditing ? "Couldn't update the event" : "Couldn't create the event"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title={isEditing ? "Edit event" : "Create event"}
      subtitle={isEditing ? "Update your event details" : "This will appear on your public club page once published"}
    >
      {loadingEvent ? (
        <div className="card rounded-3xl p-12 text-center text-[#9E97B8] text-sm font-medium bg-surface-card border border-surface-border">
          Loading event details…
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-3 card rounded-3xl p-6 sm:p-8 bg-surface-card border border-surface-border shadow-glow-sm"
          >
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9E97B8] mb-1.5">Event title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Hackathon Night"
                  value={form.title}
                  onChange={update("title")}
                  className="input-modern"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9E97B8] mb-1.5">Description</label>
                <textarea
                  rows={4}
                  placeholder="What's this event about?"
                  value={form.description}
                  onChange={update("description")}
                  className="input-modern-rect resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#9E97B8] mb-1.5">Date</label>
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={update("date")}
                    className="input-modern [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#9E97B8] mb-1.5">Time</label>
                  <input
                    required
                    type="time"
                    value={form.time}
                    onChange={update("time")}
                    className="input-modern [color-scheme:dark]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9E97B8] mb-1.5">Location</label>
                <input
                  type="text"
                  placeholder="e.g. CS Block, Lab 3"
                  value={form.location}
                  onChange={update("location")}
                  className="input-modern"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9E97B8] mb-1.5">
                  Capacity <span className="text-[#9E97B8]/70 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 150"
                  value={form.capacity}
                  onChange={update("capacity")}
                  className="input-modern sm:w-44"
                />
              </div>

              {/* Poster Picker */}
              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9E97B8] mb-1">
                  Event Poster
                </label>
                <p className="text-xs text-text-muted mb-3 font-normal">
                  Select a clean campus poster preset or provide a custom image link
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3">
                  {POSTER_PRESETS.map((preset) => {
                    const isSelected = form.posterUrl === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setForm({ ...form, posterUrl: preset.url })}
                        className={`relative rounded-2xl overflow-hidden border p-1 text-left transition-all cursor-pointer group ${
                          isSelected
                            ? "border-brand-lavender ring-2 ring-brand-lavender/50 bg-[#1D173D]"
                            : "border-[#261E4E] hover:border-[#7C5CFC]/60 bg-[#130E28]"
                        }`}
                      >
                        <div className="h-16 rounded-xl overflow-hidden relative">
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <span className="absolute bottom-1 left-1.5 right-1.5 text-[10px] font-bold text-white truncate">
                            {preset.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <input
                  type="url"
                  placeholder="Or paste custom image URL (e.g. https://...)"
                  value={form.posterUrl}
                  onChange={update("posterUrl")}
                  className="input-modern text-xs"
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm font-semibold text-rose-300 bg-rose-950/40 border border-rose-800/60 rounded-2xl px-4 py-2.5"
                >
                  {error}
                </motion.p>
              )}

              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-surface-border flex-wrap">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary font-semibold rounded-full px-7 py-3 text-sm disabled:opacity-60 shadow-glow-sm cursor-pointer"
                >
                  {submitting ? (isEditing ? "Updating…" : "Publishing…") : isEditing ? "Save changes" : "Publish event"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/events")}
                  className="btn-secondary font-semibold rounded-full px-7 py-3 text-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>

          {/* Live preview */}
          <div className="lg:col-span-2 sticky top-24">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#9E97B8] uppercase tracking-wider">
                Live Preview
              </span>
              <span className="text-[11px] font-semibold text-brand-lavender bg-brand-lavender/10 border border-brand-lavender/25 px-2.5 py-0.5 rounded-full">
                Student View
              </span>
            </div>
            <div className="max-w-sm">
              <EventCard event={previewEvent} slugOverride={clubSlug} />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
