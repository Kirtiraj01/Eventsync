const express = require("express");
const router = express.Router({ mergeParams: true });

const authMiddleware = require("../middleware/auth.middleware");
const { scanTicket } = require("../controllers/scan.controller");

const { scanLimiter } = require("../middleware/rateLimiter");

// POST /api/clubs/:slug/scan — Club Member only
router.post("/", authMiddleware, scanLimiter, scanTicket);

module.exports = router;
