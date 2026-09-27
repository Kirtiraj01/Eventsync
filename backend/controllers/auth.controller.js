const bcrypt = require("bcryptjs");
const ClubMember = require("../models/ClubMember");
const Club = require("../models/Club");
const { generateAuthJWT } = require("../utils/generateAuthJWT");

// POST /api/auth/login
// body: { email, password }
// Club Member only. Students never call this.
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const member = await ClubMember.findOne({ email: email.toLowerCase().trim() });
    if (!member) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, member.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const club = await Club.findById(member.clubId);
    if (!club) {
      // Shouldn't happen, but don't leak a token for a dangling account
      return res.status(500).json({ error: "Club account is misconfigured" });
    }

    const token = generateAuthJWT(member);

    res.json({
      token,
      clubId: club._id.toString(),
      clubSlug: club.slug,
      clubName: club.name,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me — Club Member only, sanity-check / rehydrate session
async function me(req, res, next) {
  try {
    const club = await Club.findById(req.clubId);
    if (!club) return res.status(404).json({ error: "Club not found" });

    res.json({
      clubId: club._id.toString(),
      clubSlug: club.slug,
      clubName: club.name,
      email: req.member.email,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, me };
