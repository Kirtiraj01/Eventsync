/**
 * Automated Production Integration Test Suite for ClubHub API
 * Run with: npm test (or node tests/api.test.js)
 */
require("dotenv").config();
const assert = require("assert");
const mongoose = require("mongoose");
const { generateTicketJWT } = require("../utils/generateTicketJWT");

const BASE = process.env.BASE_URL || "http://localhost:5050";

async function runSuite() {
  console.log("==================================================");
  console.log("🚀 Starting EventSync API Integration Test Suite");
  console.log(`Target: ${BASE}`);
  console.log("==================================================\n");

  let testsPassed = 0;
  let testsTotal = 0;

  async function test(name, fn) {
    testsTotal++;
    process.stdout.write(`• Test [${testsTotal}] ${name}... `);
    try {
      await fn();
      testsPassed++;
      console.log("PASSED ✅");
    } catch (err) {
      console.log("FAILED ❌");
      console.error("  Error:", err.message);
      throw err;
    }
  }

  // 1. Health Check
  await test("GET /health returns 200 and ok: true", async () => {
    const res = await fetch(`${BASE}/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.strictEqual(data.service, "eventsync-server");
  });

  // 2. Auth: Invalid Login
  await test("POST /api/auth/login with bad password returns 401", async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "robotics@clubhub.app", password: "wrongpassword123" }),
    });
    assert.strictEqual(res.status, 401);
  });

  // 3. Auth: Valid Login
  let token, clubSlug, clubId;
  await test("POST /api/auth/login with valid credentials returns JWT and club info", async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "robotics@clubhub.app", password: "robotics123" }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.token, "Token should be present");
    assert.strictEqual(data.clubSlug, "robotics-club");
    assert.strictEqual(data.clubName, "Robotics Club");
    token = data.token;
    clubSlug = data.clubSlug;
    clubId = data.clubId;
  });

  // 4. Auth: GET /api/auth/me
  await test("GET /api/auth/me verifies valid session", async () => {
    const res = await fetch(`${BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.email, "robotics@clubhub.app");
    assert.strictEqual(data.clubSlug, "robotics-club");
  });

  // 5. Cross-Tenant Security Guard
  await test("Cross-tenant guard blocks token from one club acting on another slug", async () => {
    const res = await fetch(`${BASE}/api/clubs/coding-society/events/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.strictEqual(res.status, 403);
    const data = await res.json();
    assert.ok(data.error.includes("Forbidden"));
  });

  // 6. Public Clubs & Events
  await test("GET /api/clubs and GET /api/events return public arrays", async () => {
    const [clubsRes, eventsRes] = await Promise.all([
      fetch(`${BASE}/api/clubs`),
      fetch(`${BASE}/api/events`),
    ]);
    assert.strictEqual(clubsRes.status, 200);
    assert.strictEqual(eventsRes.status, 200);
    const clubs = await clubsRes.json();
    const events = await eventsRes.json();
    assert.ok(Array.isArray(clubs), "Clubs should be an array");
    assert.ok(Array.isArray(events), "Events should be an array");
  });

  // 7. Event Creation (POST)
  let createdEventId;
  await test("POST /api/clubs/:slug/events creates an event", async () => {
    const res = await fetch(`${BASE}/api/clubs/${clubSlug}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: "Test Automated Verification Event",
        description: "Created by automated integration test suite",
        eventDate: new Date(Date.now() + 7 * 86400000).toISOString(),
        location: "Virtual Room A",
      }),
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.ok(data._id);
    assert.strictEqual(data.title, "Test Automated Verification Event");
    createdEventId = data._id;
  });

  // 8. Event Update (PATCH)
  await test("PATCH /api/clubs/:slug/events/:id updates event details", async () => {
    const res = await fetch(`${BASE}/api/clubs/${clubSlug}/events/${createdEventId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: "Test Automated Verification Event (Updated)",
        location: "Auditorium 2",
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.title, "Test Automated Verification Event (Updated)");
    assert.strictEqual(data.location, "Auditorium 2");
  });

  // 9. Registration (POST)
  let regId;
  await test("POST /api/clubs/:slug/events/:id/register registers attendee", async () => {
    const res = await fetch(`${BASE}/api/clubs/${clubSlug}/events/${createdEventId}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attendeeName: "Test Student",
        attendeeEmail: "test.student@university.edu",
      }),
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.ok(data.registrationId);
    regId = data.registrationId;
  });

  // 10. Duplicate Registration (POST -> 409)
  await test("Duplicate registration returns 409 Conflict", async () => {
    const res = await fetch(`${BASE}/api/clubs/${clubSlug}/events/${createdEventId}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attendeeName: "Test Student",
        attendeeEmail: "test.student@university.edu",
      }),
    });
    assert.strictEqual(res.status, 409);
  });

  // 11. Ticket Scanning (POST /api/clubs/:slug/scan)
  let ticketToken;
  await test("POST /api/clubs/:slug/scan checks in attendee, queues for certificate (no auto-generation)", async () => {
    ticketToken = generateTicketJWT({ _id: regId, clubId, eventId: createdEventId });
    const res = await fetch(`${BASE}/api/clubs/${clubSlug}/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ticketToken }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, "checked_in");
    assert.strictEqual(data.attendeeName, "Test Student");
    assert.strictEqual(data.queuedForCertificate, true);

    // Verify in registrations table that certificateId is NOT yet generated
    const checkRes = await fetch(`${BASE}/api/clubs/${clubSlug}/events/${createdEventId}/registrations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const regList = await checkRes.json();
    const student = regList.find((r) => r._id === regId);
    assert.ok(student, "Student should exist");
    assert.strictEqual(student.attended, true, "Student should be attended");
    assert.strictEqual(student.certificateId, null, "Certificate must NOT be auto-generated on scan");
  });

  // 12. Duplicate Scan Detection (POST /api/clubs/:slug/scan -> already_scanned)
  await test("Duplicate ticket scan returns status already_scanned", async () => {
    const res = await fetch(`${BASE}/api/clubs/${clubSlug}/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ticketToken }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, "already_scanned");
  });

  // 13. Manual Batch Certificate Generation (POST /api/clubs/:slug/events/:eventId/certificates/generate)
  await test("Manual trigger generates and emails certificates for queued attendees", async () => {
    const res = await fetch(`${BASE}/api/clubs/${clubSlug}/events/${createdEventId}/certificates/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ forceAll: false }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.strictEqual(data.totalGenerated, 1);
    assert.ok(data.results[0].certificateId);

    // Verify certificate is now attached
    const checkRes = await fetch(`${BASE}/api/clubs/${clubSlug}/events/${createdEventId}/registrations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const regList = await checkRes.json();
    const student = regList.find((r) => r._id === regId);
    assert.ok(student.certificateId, "Certificate ID should now be assigned after manual generation");
  });

  // 14. Event Analytics (GET)
  await test("GET /api/clubs/:slug/events/:id/analytics returns turnout aggregation", async () => {
    const res = await fetch(`${BASE}/api/clubs/${clubSlug}/events/${createdEventId}/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.totalRegistrations, 1);
    assert.strictEqual(data.totalAttended, 1);
    assert.strictEqual(data.attendanceRate, 100);
  });

  // 14. Cascade Deletion (DELETE)
  await test("DELETE /api/clubs/:slug/events/:id removes event and cascade-cleans registrations", async () => {
    const res = await fetch(`${BASE}/api/clubs/${clubSlug}/events/${createdEventId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);

    // Verify registrations are gone
    const checkRes = await fetch(`${BASE}/api/clubs/${clubSlug}/events/${createdEventId}/registrations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const regList = await checkRes.json();
    assert.strictEqual(regList.length, 0, "Registrations should be cascade deleted");
  });

  console.log("\n==================================================");
  console.log(`🎉 ALL ${testsPassed}/${testsTotal} INTEGRATION TESTS PASSED!`);
  console.log("==================================================");
}

runSuite().catch((err) => {
  console.error("\n❌ Test Suite Aborted due to failure.");
  process.exit(1);
});
