# ClubHub — Backend

Multi-tenant Express/MongoDB API. Frontend not built yet (design still TBD) —
this is the standalone backend, testable via Postman/curl per the spec's
recommended build order.

## Setup

```bash
cd server
npm install
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, TICKET_SECRET (two DIFFERENT random strings)
```

> **Puppeteer note:** `npm install` downloads a bundled Chromium for
> certificate PDF generation. If you're on a restricted network, see
> Puppeteer's docs for `PUPPETEER_SKIP_DOWNLOAD` / pointing at an existing
> Chrome install — just make sure a browser is available at runtime.

Seed a couple of test clubs + Club Member logins (spec says clubs are
seeded directly, no signup flow):

```bash
npm run seed
```

This creates:
- **Robotics Club** (`robotics-club`) — login `robotics@clubhub.app` / `robotics123`
- **Coding Society** (`coding-society`) — login `coding@clubhub.app` / `coding123`

Run the server:

```bash
npm run dev    # nodemon, auto-restart
# or
npm start
```

Server boots on `http://localhost:5000` (or `PORT` from `.env`).

## Quick smoke test (curl)

```bash
# Public: get club info
curl http://localhost:5000/api/clubs/robotics-club

# Public: list upcoming events (empty until you create one)
curl http://localhost:5000/api/clubs/robotics-club/events

# Club Member: log in
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"robotics@clubhub.app","password":"robotics123"}'
# -> { token, clubId, clubSlug, clubName }

# Club Member: create an event (paste the token from above)
TOKEN="paste-token-here"
curl -X POST http://localhost:5000/api/clubs/robotics-club/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Intro to ROS","description":"Robot Operating System 101","eventDate":"2026-09-15T14:00:00Z","location":"Lab 3"}'

# Public: register a student for that event (use the eventId from the response above)
EVENT_ID="paste-event-id-here"
curl -X POST http://localhost:5000/api/clubs/robotics-club/events/$EVENT_ID/register \
  -H "Content-Type: application/json" \
  -d '{"attendeeName":"Kirtiraj","attendeeEmail":"kirtiraj@example.com"}'
# check the server console — no SMTP configured by default, so the email
# (with QR attached) is logged there instead of actually sent.

# Grab the registrationId from the DB or Mongo shell to get the ticketToken,
# then simulate a scan at the door:
curl -X POST http://localhost:5000/api/clubs/robotics-club/scan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"ticketToken":"paste-ticket-jwt-here"}'
# -> { attendeeName, status: "checked_in", attendedAt }
# This also generates a certificate PDF under backend/certificates/

# Public: verify a certificate (use the certificateId returned above / from DB)
curl http://localhost:5000/api/certificates/verify/CERT_ID_HERE
```

## Testing tenant isolation (the important one)

Log in as **both** seeded clubs, then try using Robotics Club's token
against Coding Society's slug:

```bash
curl -X POST http://localhost:5000/api/clubs/coding-society/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ROBOTICS_TOKEN" \
  -d '{"title":"Should fail","eventDate":"2026-09-15T14:00:00Z"}'
# -> 403 Forbidden: token does not belong to this club
```

## What's implemented

Matches `PROJECT_SPEC.md` exactly:

- ✅ 4 Mongoose models (Club, ClubMember, Event, Registration) with `clubId` on every tenant-scoped collection
- ✅ Club Member JWT auth (`/api/auth/login`) — separate secret from ticket JWTs
- ✅ `tenant.middleware.js` — resolves `:slug` → `req.clubId`, never trusts body-supplied clubId
- ✅ `auth.middleware.js` — verifies Club Member JWT, cross-checks `decoded.clubId === req.clubId` (403 on mismatch)
- ✅ Event CRUD, scoped to `clubId`
- ✅ Public registration → signed ticket JWT → QR PNG → emailed (Nodemailer, console-mock fallback if SMTP unset)
- ✅ QR scan endpoint: verifies signature + clubId cross-check + marks attendance
- ✅ Certificate generation (Puppeteer → PDF) fired synchronously after a successful scan, served statically from `/certificates`
- ✅ Public certificate verify route, deliberately separate from the download route
- ✅ Analytics endpoint: total registrations, total attended, attendance rate, registrations-over-time
- ✅ Seed script for clubs/Club Member logins (no public signup, per spec)

Not built yet (frontend — pending your design decisions):
`client/` — React pages listed in the spec (`ClubPage`, `EventRegisterPage`,
`MemberDashboard`, `ScannerPage`, etc.)
