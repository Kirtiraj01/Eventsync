const express = require("express");
const router = express.Router({ mergeParams: true });

const authMiddleware = require("../middleware/auth.middleware");
const { registerForEvent, listRegistrations } = require("../controllers/registration.controller");

const { registerLimiter } = require("../middleware/rateLimiter");

// POST /api/clubs/:slug/events/:eventId/register — public (Student)
router.post("/events/:eventId/register", registerLimiter, registerForEvent);

// GET /api/clubs/:slug/events/:eventId/registrations — Club Member only
router.get("/events/:eventId/registrations", authMiddleware, listRegistrations);

module.exports = router;
