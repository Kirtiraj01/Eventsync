const express = require("express");
const router = express.Router();
const { login, me } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

const { authLimiter } = require("../middleware/rateLimiter");

router.post("/login", authLimiter, login);
router.get("/me", authMiddleware, me);

module.exports = router;
