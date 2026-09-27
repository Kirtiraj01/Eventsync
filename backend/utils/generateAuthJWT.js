const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "clubhub_auth_super_secret_key_12345";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Signs a Club Member session JWT. Separate secret (JWT_SECRET) from the
 * ticket-signing secret (TICKET_SECRET) — see generateTicketJWT.js.
 */
function generateAuthJWT(clubMember) {
  return jwt.sign(
    {
      memberId: clubMember._id.toString(),
      clubId: clubMember.clubId.toString(),
      email: clubMember.email,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function verifyAuthJWT(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { generateAuthJWT, verifyAuthJWT };
