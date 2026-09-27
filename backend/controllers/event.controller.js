const Event = require("../models/Event");
const Registration = require("../models/Registration");

// GET /api/events — public — list all events across all clubs
async function listAllPublicEvents(req, res, next) {
  try {
    const events = await Event.find({})
      .populate("clubId", "name slug logoUrl")
      .sort({ eventDate: -1 })
      .lean();

    res.json(events);
  } catch (err) {
    next(err);
  }
}

// GET /api/clubs/:slug/events — public — list of events for this club
async function listEvents(req, res, next) {
  try {
    const events = await Event.find({ clubId: req.clubId })
      .populate("clubId", "name slug logoUrl")
      .sort({ eventDate: -1 })
      .lean();

    res.json(events);
  } catch (err) {
    next(err);
  }
}

// GET /api/clubs/:slug/events/all — Club Member only — all events (past + upcoming) for dashboard
async function listAllEventsForMember(req, res, next) {
  try {
    const events = await Event.find({ clubId: req.clubId }).sort({ eventDate: -1 }).lean();
    res.json(events);
  } catch (err) {
    next(err);
  }
}

// GET /api/clubs/:slug/events/:eventId — public — single event detail (for registration page)
async function getEvent(req, res, next) {
  try {
    const event = await Event.findOne({ _id: req.params.eventId, clubId: req.clubId })
      .populate("clubId", "name slug logoUrl")
      .lean();
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    next(err);
  }
}

// POST /api/clubs/:slug/events — Club Member only — create event
// body: { title, description, eventDate, location, posterUrl }
async function createEvent(req, res, next) {
  try {
    const { title, description, eventDate, location, posterUrl } = req.body;

    if (!title || !eventDate) {
      return res.status(400).json({ error: "title and eventDate are required" });
    }

    const event = await Event.create({
      clubId: req.clubId, // NEVER from req.body — always from the authenticated member's tenant context
      title,
      description,
      eventDate,
      location,
      posterUrl: posterUrl || "",
    });

    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/clubs/:slug/events/:eventId — Club Member only — edit event
async function updateEvent(req, res, next) {
  try {
    const { title, description, eventDate, location, posterUrl } = req.body;

    const event = await Event.findOneAndUpdate(
      { _id: req.params.eventId, clubId: req.clubId }, // clubId filter prevents cross-tenant edits
      { $set: { title, description, eventDate, location, ...(posterUrl !== undefined && { posterUrl }) } },
      { new: true, runValidators: true }
    );

    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/clubs/:slug/events/:eventId — Club Member only
async function deleteEvent(req, res, next) {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.eventId, clubId: req.clubId });
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Cascade delete any registrations tied to this deleted event within this club
    await Registration.deleteMany({ eventId: req.params.eventId, clubId: req.clubId });

    res.json({ ok: true, deletedEventId: req.params.eventId });
  } catch (err) {
    next(err);
  }
}

// GET /api/clubs/:slug/events/:eventId/analytics — Club Member only
// returns { totalRegistrations, totalAttended, attendanceRate, registrationsOverTime: [...] }
async function getEventAnalytics(req, res, next) {
  try {
    const { eventId } = req.params;

    const event = await Event.findOne({ _id: eventId, clubId: req.clubId });
    if (!event) return res.status(404).json({ error: "Event not found" });

    const [totalRegistrations, totalAttended, registrationsOverTime] = await Promise.all([
      Registration.countDocuments({ clubId: req.clubId, eventId }),
      Registration.countDocuments({ clubId: req.clubId, eventId, attended: true }),
      Registration.aggregate([
        { $match: { clubId: event.clubId, eventId: event._id } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: "$_id", count: 1 } },
      ]),
    ]);

    const attendanceRate = totalRegistrations === 0 ? 0 : Number(((totalAttended / totalRegistrations) * 100).toFixed(1));

    res.json({
      totalRegistrations,
      totalAttended,
      attendanceRate,
      registrationsOverTime,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listAllPublicEvents,
  listEvents,
  listAllEventsForMember,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventAnalytics,
};
