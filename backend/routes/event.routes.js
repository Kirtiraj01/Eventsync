const express = require("express");
const router = express.Router({ mergeParams: true });

const authMiddleware = require("../middleware/auth.middleware");
const {
  listEvents,
  listAllEventsForMember,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventAnalytics,
} = require("../controllers/event.controller");

// GET /api/clubs/:slug/events — public
router.get("/", listEvents);

// GET /api/clubs/:slug/events/all — Club Member only (dashboard: past + upcoming)
router.get("/all", authMiddleware, listAllEventsForMember);

// POST /api/clubs/:slug/events — Club Member only
router.post("/", authMiddleware, createEvent);

// GET /api/clubs/:slug/events/:eventId — public
router.get("/:eventId", getEvent);

// PATCH /api/clubs/:slug/events/:eventId — Club Member only
router.patch("/:eventId", authMiddleware, updateEvent);

// DELETE /api/clubs/:slug/events/:eventId — Club Member only
router.delete("/:eventId", authMiddleware, deleteEvent);

// GET /api/clubs/:slug/events/:eventId/analytics — Club Member only
router.get("/:eventId/analytics", authMiddleware, getEventAnalytics);

const { generateCertificatesForEvent } = require("../controllers/certificate.controller");

// POST /api/clubs/:slug/events/:eventId/certificates/generate — Club Member only
// Processes queued attendees, generates certificates, and forwards them to email
router.post("/:eventId/certificates/generate", authMiddleware, generateCertificatesForEvent);

module.exports = router;
