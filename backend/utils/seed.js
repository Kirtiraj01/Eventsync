/**
 * Seeds sample clubs + club member logins directly in the DB, per the
 * spec: "clubs are seeded/created directly in the database for now, not
 * through a public signup flow."
 *
 * Usage: npm run seed
 */
require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Club = require("../models/Club");
const ClubMember = require("../models/ClubMember");

const CLUBS = [
  { name: "Robotics Club", slug: "robotics-club", email: "robotics@clubhub.app", password: "robotics123" },
  { name: "Coding Society", slug: "coding-society", email: "coding@clubhub.app", password: "coding123" },
];

async function seed() {
  await connectDB();

  for (const c of CLUBS) {
    let club = await Club.findOne({ slug: c.slug });
    if (!club) {
      club = await Club.create({ name: c.name, slug: c.slug });
      console.log(`[seed] created club: ${c.name} (${c.slug})`);
    } else {
      console.log(`[seed] club already exists: ${c.name} (${c.slug})`);
    }

    let member = await ClubMember.findOne({ clubId: club._id });
    if (!member) {
      const passwordHash = await bcrypt.hash(c.password, 10);
      member = await ClubMember.create({ clubId: club._id, email: c.email, passwordHash });
      console.log(`[seed]   -> login: ${c.email} / ${c.password}`);
    } else {
      console.log(`[seed]   -> member login already exists: ${member.email}`);
    }
  }

  console.log("[seed] done.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
