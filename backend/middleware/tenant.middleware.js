const Club = require("../models/Club");

/**
 * Resolves :slug from the URL to a Club document, attaches req.clubId and
 * req.club. Used on all routes scoped under /api/clubs/:slug/...
 *
 * This is the ONLY place clubId should ever come from for public routes —
 * never trust a clubId sent in a request body.
 */
async function tenantMiddleware(req, res, next) {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ error: "Missing club slug" });
    }

    const club = await Club.findOne({ slug: slug.toLowerCase() });
    if (!club) {
      return res.status(404).json({ error: "Club not found" });
    }

    req.club = club;
    req.clubId = club._id.toString();
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = tenantMiddleware;
