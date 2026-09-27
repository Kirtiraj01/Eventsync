import { request, API_BASE } from "./client";

// ---------- Public: club ----------

export function listClubs() {
  return request("/api/clubs");
}

export function getClub(slug) {
  return request(`/api/clubs/${slug}`);
}

// ---------- Public: events ----------

export function listAllPublicEvents() {
  return request("/api/events");
}

export function listEvents(slug) {
  if (!slug || slug === "all") return listAllPublicEvents();
  return request(`/api/clubs/${slug}/events`);
}

export function getEvent(slug, eventId) {
  return request(`/api/clubs/${slug}/events/${eventId}`);
}

// ---------- Public: registration ----------

export function registerForEvent(slug, eventId, { attendeeName, attendeeEmail }) {
  return request(`/api/clubs/${slug}/events/${eventId}/register`, {
    method: "POST",
    body: { attendeeName, attendeeEmail },
  });
}

// ---------- Public: certificates ----------

export function downloadCertificateUrl(registrationId) {
  // GET returns a PDF stream directly — used as an href/window.open target, not JSON
  return `${API_BASE}/api/certificates/${registrationId}`;
}

export function verifyCertificate(certificateId) {
  return request(`/api/certificates/verify/${certificateId}`);
}

export function generateCertificates(slug, token, eventId, options = {}) {
  return request(`/api/clubs/${slug}/events/${eventId}/certificates/generate`, {
    method: "POST",
    token,
    body: options,
  });
}

// ---------- Club Member: auth ----------

export function login(email, password) {
  return request(`/api/auth/login`, {
    method: "POST",
    body: { email, password },
  });
}

export function getMe(token) {
  return request(`/api/auth/me`, { token });
}

// ---------- Club Member: events ----------

export function listAllEventsForMember(slug, token) {
  return request(`/api/clubs/${slug}/events/all`, { token });
}

export function createEvent(slug, token, { title, description, eventDate, location }) {
  return request(`/api/clubs/${slug}/events`, {
    method: "POST",
    token,
    body: { title, description, eventDate, location },
  });
}

export function updateEvent(slug, token, eventId, { title, description, eventDate, location }) {
  return request(`/api/clubs/${slug}/events/${eventId}`, {
    method: "PATCH",
    token,
    body: { title, description, eventDate, location },
  });
}

export function deleteEvent(slug, token, eventId) {
  return request(`/api/clubs/${slug}/events/${eventId}`, {
    method: "DELETE",
    token,
  });
}

export function getEventAnalytics(slug, token, eventId) {
  return request(`/api/clubs/${slug}/events/${eventId}/analytics`, { token });
}

// ---------- Club Member: registrations ----------

export function listRegistrations(slug, token, eventId) {
  return request(`/api/clubs/${slug}/events/${eventId}/registrations`, { token });
}

// ---------- Club Member: scan ----------

export function scanTicket(slug, token, ticketToken) {
  return request(`/api/clubs/${slug}/scan`, {
    method: "POST",
    token,
    body: { ticketToken },
  });
}
