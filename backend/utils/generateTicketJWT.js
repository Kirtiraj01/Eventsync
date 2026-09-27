const jwt = require("jsonwebtoken");

const TICKET_SECRET = process.env.TICKET_SECRET || "clubhub_ticket_super_secret_key_12345";
const TICKET_EXPIRES_IN = process.env.TICKET_EXPIRES_IN || "60d";

/**
 * Signs a ticket JWT for a Registration. Uses TICKET_SECRET — a separate
 * secret from JWT_SECRET (Club Member auth) so a leaked ticket can never
 * be replayed as a Club Member session or vice versa.
 */
function generateTicketJWT(registration) {
  return jwt.sign(
    {
      registrationId: registration._id.toString(),
      eventId: registration.eventId.toString(),
      clubId: registration.clubId.toString(),
    },
    TICKET_SECRET,
    { expiresIn: TICKET_EXPIRES_IN }
  );
}

/**
 * Verifies a ticket JWT string. Throws if invalid/expired/tampered.
 */
function verifyTicketJWT(token) {
  return jwt.verify(token, TICKET_SECRET);
}

module.exports = { generateTicketJWT, verifyTicketJWT };
