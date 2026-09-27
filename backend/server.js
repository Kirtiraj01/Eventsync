require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");

const authRoutes = require("./routes/auth.routes");
const clubRoutes = require("./routes/club.routes");
const certificateRoutes = require("./routes/certificate.routes");
const { listAllPublicEvents } = require("./controllers/event.controller");

const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow PDF previews in iframes/embeds across ports
  })
);

// CORS configuration with environment-aware origins
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.PUBLIC_APP_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // In development or test, allow all localhost ports
      if (process.env.NODE_ENV !== "production") {
        if (/^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
          return callback(null, true);
        }
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS policy: Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

// Rate limit all API endpoints
app.use("/api", apiLimiter);

// Serve generated certificate PDFs statically
const CERT_DIR = path.join(__dirname, "certificates");
if (!fs.existsSync(CERT_DIR)) fs.mkdirSync(CERT_DIR, { recursive: true });
app.use("/certificates", express.static(CERT_DIR));

// Health check endpoint
app.get("/health", (req, res) =>
  res.json({
    ok: true,
    service: "eventsync-server",
    env: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  })
);

// Route mounts
app.get("/api/events", listAllPublicEvents);
app.use("/api/auth", authRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/certificates", certificateRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
let server;

async function start() {
  await connectDB();
  server = app.listen(PORT, () => {
    console.log(`[server] EventSync API running on http://localhost:${PORT}`);
  });
}

// Graceful shutdown handling
function gracefulShutdown(signal) {
  console.log(`\n[server] ${signal} received. Initiating graceful shutdown...`);
  if (server) {
    server.close(async () => {
      console.log("[server] HTTP server closed.");
      try {
        await mongoose.connection.close(false);
        console.log("[db] MongoDB connection closed.");
        process.exit(0);
      } catch (err) {
        console.error("[db] Error closing MongoDB connection:", err);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }

  // Force close after 10s timeout
  setTimeout(() => {
    console.error("[server] Forced shutdown after timeout.");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

start();

module.exports = app;
