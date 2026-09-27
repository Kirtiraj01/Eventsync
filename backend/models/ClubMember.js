const mongoose = require("mongoose");

// The login account for a club. One document per club — this represents
// the "Club Member" role's shared credentials, not an individual person.
const clubMemberSchema = new mongoose.Schema(
  {
    clubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
      unique: true, // exactly one login per club
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClubMember", clubMemberSchema);
