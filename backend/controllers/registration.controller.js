const Event = require("../models/Event");
const Registration = require("../models/Registration");
const { generateTicketJWT } = require("../utils/generateTicketJWT");
const { generateQRBuffer } = require("../utils/generateQR");
const { sendEmail } = require("../utils/sendEmail");

// POST /api/clubs/:slug/events/:eventId/register — public (Student)
// body: { attendeeName, attendeeEmail }
// Creates Registration, signs ticket JWT, generates QR image, emails it.
// Returns { registrationId } — never returns the raw ticket token to the client.
async function registerForEvent(req, res, next) {
  try {
    const { eventId } = req.params;
    const { attendeeName, attendeeEmail } = req.body;

    if (!attendeeName || !attendeeEmail) {
      return res.status(400).json({ error: "attendeeName and attendeeEmail are required" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(attendeeEmail)) {
      return res.status(400).json({ error: "attendeeEmail is not a valid email address" });
    }

    // Event must belong to this tenant — clubId comes from tenant middleware, not the body
    const event = await Event.findOne({ _id: eventId, clubId: req.clubId });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Prevent duplicate registration for the same event + email within this club
    const existing = await Registration.findOne({
      clubId: req.clubId,
      eventId,
      attendeeEmail: attendeeEmail.toLowerCase().trim(),
    });
    if (existing) {
      return res.status(409).json({ error: "You have already registered for this event", registrationId: existing._id });
    }

    // Create registration first so we have a real registrationId to sign into the ticket
    const registration = await Registration.create({
      clubId: req.clubId,
      eventId,
      attendeeName: attendeeName.trim(),
      attendeeEmail: attendeeEmail.toLowerCase().trim(),
      ticketToken: "pending",
    });

    const ticketToken = generateTicketJWT(registration);
    registration.ticketToken = ticketToken;
    await registration.save();

    const qrBuffer = await generateQRBuffer(ticketToken);

    const eventDateStr = new Date(event.eventDate).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    await sendEmail({
      to: registration.attendeeEmail,
      subject: `Your ticket for ${event.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>You're registered! 🎉</h2>
          <p>Hi ${registration.attendeeName},</p>
          <p>You're confirmed for <strong>${event.title}</strong>.</p>
          <p><strong>When:</strong> ${eventDateStr}<br/>
             <strong>Where:</strong> ${event.location || "TBA"}</p>
          <p>Show the attached QR code at the door to check in.</p>
        </div>
      `,
      attachments: [
        {
          filename: "ticket-qr.png",
          content: qrBuffer,
          contentType: "image/png",
        },
      ],
    });

    res.status(201).json({ registrationId: registration._id });
  } catch (err) {
    next(err);
  }
}

// GET /api/clubs/:slug/events/:eventId/registrations — Club Member only — list registrations
async function listRegistrations(req, res, next) {
  try {
    const { eventId } = req.params;
    const registrations = await Registration.find({ clubId: req.clubId, eventId })
      .select("-ticketToken") // never expose the raw ticket JWT over the API
      .sort({ createdAt: -1 })
      .lean();

    res.json(registrations);
  } catch (err) {
    next(err);
  }
}

module.exports = { registerForEvent, listRegistrations };
