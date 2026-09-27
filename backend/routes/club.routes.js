const express = require("express");
const router = express.Router({ mergeParams: true });

const tenantMiddleware = require("../middleware/tenant.middleware");
const { getClub, listClubs } = require("../controllers/club.controller");

const eventRoutes = require("./event.routes");
const registrationRoutes = require("./registration.routes");
const scanRoutes = require("./scan.routes");

// Public: list all clubs
router.get("/", listClubs);

// All routes here are nested under /api/clubs/:slug
// tenantMiddleware runs first on every one of them, resolving req.clubId.
router.use("/:slug", tenantMiddleware);

router.get("/:slug", getClub);

router.use("/:slug/events", eventRoutes);
router.use("/:slug", registrationRoutes); // registration nests further under /events/:eventId
router.use("/:slug/scan", scanRoutes);

module.exports = router;
