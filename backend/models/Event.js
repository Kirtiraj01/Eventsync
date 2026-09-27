const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    clubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    eventDate: { type: Date, required: true },
    location: { type: String, default: "" },
    posterUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

// Every list query for a club's events filters by clubId + date -> compound index
eventSchema.index({ clubId: 1, eventDate: 1 });

module.exports = mongoose.model("Event", eventSchema);
