const Club = require("../models/Club");

// GET /api/clubs — public, list all clubs
async function listClubs(req, res, next) {
  try {
    const clubs = await Club.find({}, "name slug logoUrl").sort({ name: 1 }).lean();
    res.json(clubs);
  } catch (err) {
    next(err);
  }
}

// GET /api/clubs/:slug — public, returns club name/logo
// req.club and req.clubId are already resolved by tenant.middleware.js
async function getClub(req, res) {
  const { _id, name, slug, logoUrl } = req.club;
  res.json({ id: _id, name, slug, logoUrl });
}

module.exports = { getClub, listClubs };
