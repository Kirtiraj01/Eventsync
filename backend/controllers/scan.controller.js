const Registration = require("../models/Registration");
const { verifyTicketJWT } = require("../utils/generateTicketJWT");

// POST /api/clubs/:slug/scan — Club Member only
// body: { ticketToken }
// Verifies JWT signature, checks clubId match, marks attended = true.
// Does NOT auto-generate certificates — attendee is placed into the certificate queue
// for manual batch generation and email forwarding by the club administrator.
async function scanTicket(req, res, next) {
  try {
    const { ticketToken } = req.body;
    if (!ticketToken) {
      return res.status(400).json({ error: "ticketToken is required" });
    }

    let decoded;
    try {
      decoded = verifyTicketJWT(ticketToken);
    } catch (err) {
      return res.status(400).json({ error: "Invalid or expired ticket", status: "invalid" });
    }

    // Defense in depth: the ticket's own clubId must match the scanning
    // Club Member's clubId (req.clubId, set by tenant + auth middleware).
    if (decoded.clubId !== req.clubId) {
      return res.status(403).json({ error: "This ticket does not belong to your club", status: "wrong_club" });
    }

    const registration = await Registration.findOne({
      _id: decoded.registrationId,
      clubId: req.clubId,
    });

    if (!registration) {
      return res.status(404).json({ error: "Registration not found", status: "not_found" });
    }

    if (registration.attended) {
      return res.status(200).json({
        attendeeName: registration.attendeeName,
        status: "already_scanned",
        attendedAt: registration.attendedAt,
      });
    }

    // Mark attendance — queued for certificate generation
    registration.attended = true;
    registration.attendedAt = new Date();
    await registration.save();

    res.json({
      attendeeName: registration.attendeeName,
      status: "checked_in",
      attendedAt: registration.attendedAt,
      queuedForCertificate: true,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { scanTicket };
