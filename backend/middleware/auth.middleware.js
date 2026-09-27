const { verifyAuthJWT } = require("../utils/generateAuthJWT");

/**
 * Verifies the Club Member's JWT from the Authorization header.
 *
 * If this route was also passed through tenant.middleware.js first
 * (req.clubId already set from the :slug), this middleware enforces that
 * decoded.clubId === req.clubId, returning 403 on mismatch. This is what
 * stops a Club Member from one club acting on another club's data even
 * if they guess/forge the URL — defense in depth beyond query filtering.
 */
function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Missing or malformed Authorization header" });
    }

    let decoded;
    try {
      decoded = verifyAuthJWT(token);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Cross-tenant guard: if the route already resolved a clubId from the
    // URL slug, the authenticated member's clubId MUST match it.
    if (req.clubId && decoded.clubId !== req.clubId) {
      return res.status(403).json({ error: "Forbidden: token does not belong to this club" });
    }

    req.member = decoded; // { memberId, clubId, email }
    // If tenant middleware didn't run first (e.g. a non-slug route), still
    // expose clubId from the token so controllers can rely on req.clubId.
    if (!req.clubId) req.clubId = decoded.clubId;

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authMiddleware;
