const fs = require("fs");
const path = require("path");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const Club = require("../models/Club");
const { CERT_DIR, generateCertificate } = require("../utils/generateCertificate");
const { sendEmail } = require("../utils/sendEmail");

// GET /api/certificates/:registrationId — public (Student)
// Downloads their own certificate PDF, only available once attended = true and issued.
async function downloadCertificate(req, res, next) {
  try {
    const { registrationId } = req.params;

    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    if (!registration.attended) {
      return res.status(403).json({ error: "Certificate not available — attendance not confirmed" });
    }

    if (!registration.certificateId) {
      return res.status(403).json({
        error: "Your attendance is confirmed! Your certificate is currently queued for generation by the club organizers. Once issued, it will be emailed directly to you and will be available here.",
        queued: true,
      });
    }

    const filePath = path.join(CERT_DIR, `${registration.certificateId}.pdf`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Certificate file not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="certificate-${registration.certificateId}.pdf"`);
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    next(err);
  }
}

// GET /api/certificates/verify/:certificateId — public
async function verifyCertificate(req, res, next) {
  try {
    const { certificateId } = req.params;

    const registration = await Registration.findOne({ certificateId, attended: true })
      .populate("eventId", "title eventDate")
      .populate("clubId", "name");

    if (!registration) {
      return res.status(404).json({ valid: false });
    }

    res.json({
      valid: true,
      attendeeName: registration.attendeeName,
      eventTitle: registration.eventId?.title,
      clubName: registration.clubId?.name,
      date: registration.eventId?.eventDate,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/clubs/:slug/events/:eventId/certificates/generate — Club Member only
// Manual trigger: Generates certificates for all attended users in the queue and forwards them to their email.
async function generateCertificatesForEvent(req, res, next) {
  try {
    const { eventId } = req.params;

    const [event, club] = await Promise.all([
      Event.findOne({ _id: eventId, clubId: req.clubId }),
      Club.findById(req.clubId),
    ]);

    if (!event) return res.status(404).json({ error: "Event not found" });
    if (!club) return res.status(404).json({ error: "Club not found" });

    // Find all attended registrations for this event that are queued (no certificateId yet)
    // If req.body.forceAll is true, regenerate for all attended
    const filter = {
      clubId: req.clubId,
      eventId,
      attended: true,
    };
    if (!req.body?.forceAll) {
      filter.certificateId = null;
    }

    const queue = await Registration.find(filter);

    if (queue.length === 0) {
      return res.json({
        ok: true,
        message: "No pending attendees in queue. All checked-in attendees already have certificates.",
        totalGenerated: 0,
        results: [],
      });
    }

    const results = [];

    for (const registration of queue) {
      try {
        const { certificateId, certificateUrl, filePath } = await generateCertificate({
          registration,
          event,
          club,
        });

        registration.certificateId = certificateId;
        registration.certificateUrl = certificateUrl;
        await registration.save();

        // Forward certificate directly to the attendee's email
        await sendEmail({
          to: registration.attendeeEmail,
          subject: `Your Certificate of Participation: ${event.title}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; color: #111117; line-height: 1.6;">
              <div style="background: linear-gradient(135deg, #4F46E5 0%, #8B5CF6 100%); padding: 24px; border-radius: 12px 12px 0 0; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Certificate of Participation</h1>
                <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 14px;">${club.name}</p>
              </div>
              <div style="padding: 28px 24px; background: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                <p style="font-size: 16px;">Dear <strong>${registration.attendeeName}</strong>,</p>
                <p>Congratulations on attending <strong>${event.title}</strong>!</p>
                <p>Your official Certificate of Participation has been issued by <strong>${club.name}</strong> and is attached to this email as a verified PDF document.</p>
                
                <div style="background: #F8F8FB; border: 1px solid #EEF0FF; padding: 16px; border-radius: 8px; margin: 20px 0; text-align: center;">
                  <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6B7280; font-weight: bold;">Certificate ID</p>
                  <p style="margin: 4px 0 0 0; font-size: 20px; font-family: monospace; font-weight: bold; color: #4F46E5;">${certificateId}</p>
                </div>

                <p style="font-size: 13px; color: #6B7280;">Anyone can verify the authenticity of this certificate at any time using the attached QR code or by visiting the public verification portal.</p>
                <p style="margin-top: 24px; font-size: 14px;">Warm regards,<br/><strong>${club.name} Team</strong></p>
              </div>
            </div>
          `,
          attachments: [
            {
              filename: `Certificate-${registration.attendeeName.replace(/[^a-zA-Z0-9]/g, "-")}.pdf`,
              path: filePath,
              contentType: "application/pdf",
            },
          ],
        });

        results.push({
          registrationId: registration._id,
          attendeeName: registration.attendeeName,
          attendeeEmail: registration.attendeeEmail,
          certificateId,
          status: "issued_and_emailed",
        });
      } catch (itemErr) {
        console.error(`[certificate] Failed for ${registration.attendeeEmail}:`, itemErr.message);
        results.push({
          registrationId: registration._id,
          attendeeName: registration.attendeeName,
          attendeeEmail: registration.attendeeEmail,
          status: "failed",
          error: itemErr.message,
        });
      }
    }

    const successful = results.filter((r) => r.status === "issued_and_emailed").length;

    res.json({
      ok: true,
      message: `Successfully generated and emailed ${successful} of ${queue.length} certificate(s).`,
      totalGenerated: successful,
      results,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  downloadCertificate,
  verifyCertificate,
  generateCertificatesForEvent,
};
