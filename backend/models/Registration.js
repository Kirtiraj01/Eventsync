const mongoose = require("mongoose");

// Represents a Student's registration for one event. Students never get a
// User document of their own — this record IS their identity in the system.
const registrationSchema = new mongoose.Schema(
  {
    clubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
      index: true, // denormalized on purpose — every query filters by clubId directly, no join
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    attendeeName: { type: String, required: true, trim: true },
    attendeeEmail: { type: String, required: true, trim: true, lowercase: true },

    ticketToken: { type: String, required: true }, // the signed JWT string

    attended: { type: Boolean, default: false },
    attendedAt: { type: Date, default: null },

    certificateId: { type: String, default: null, index: true }, // short public ID for verify URL
    certificateUrl: { type: String, default: null }, // path/URL to generated PDF
  },
  { timestamps: true }
);

// Fast tenant-scoped lookups and duplicate-registration checks
registrationSchema.index({ clubId: 1, eventId: 1, attendeeEmail: 1 });

module.exports = mongoose.model("Registration", registrationSchema);
