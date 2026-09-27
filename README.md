# EventSync — Campus Club & Event Management Platform

EventSync is a production-grade multi-tenant platform connecting students with university clubs through instant registration, tamper-evident QR ticketing, real-time door check-in, dynamic PDF certificates, and deep analytics.

---

## 🏗️ Architecture

- **Frontend (`/frontend`)**: React 19.2 + Vite 8 + Tailwind CSS 3.4 + Framer Motion 13.1 + React Router v7. Includes an Error Boundary, PageTransitions, animated StatCards, responsive DashboardLayout, and live previews.
- **Backend (`/backend`)**: Express 4.19 + MongoDB / Mongoose 8.5 with Helmet security headers, Express-Rate-Limit, CORS guards, graceful process shutdown, and Puppeteer PDF certificate generation.
- **Database**: MongoDB (local or Atlas) with tenant-isolated indexing and cascade deletion.

---

## 🚀 Quick Start

### 1. Installation

From the project root:

```bash
npm run install:all
```

### 2. Configure Environment

Create `.env` in `backend/` (copy from `backend/.env.example`):

```bash
cp backend/.env.example backend/.env
```

Set `MONGO_URI`, `JWT_SECRET`, and `TICKET_SECRET`.

Create `.env` in `frontend/` (copy from `frontend/.env.example`):

```bash
cp frontend/.env.example frontend/.env
```

### 3. Seed Initial Clubs & Admin Logins

```bash
npm run backend:seed
```

This seeds:
- **Robotics Club** (`robotics-club`): `robotics@clubhub.app` / `robotics123`
- **Coding Society** (`coding-society`): `coding@clubhub.app` / `coding123`

---

## 🏃 Running the Application

### Development (Concurrently running frontend & backend)

```bash
npm run dev:all
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

### Production Build & Start

```bash
# Build frontend for production
npm run build

# Start backend server
npm start
```

---

## 🧪 Automated Testing

EventSync comes with an end-to-end integration test suite that tests all 15 critical API flows (Health, Auth, Cross-Tenant Security, Public Browsing, CRUD, Registration, Duplicate Prevention, QR Ticket Check-In, Attendance Queueing, Batch Certificate Generation, Analytics Aggregation, and Cascade Cleanup):

```bash
npm test
```

---

## 🐳 Docker Deployment

A multi-stage `Dockerfile` is included, preconfigured with Node 20 and system Chromium libraries for Puppeteer:

```bash
# Build Docker image
docker build -t clubhub:latest .

# Run container
docker run -p 5000:5000 --env-file backend/.env clubhub:latest
```

---

## 🛡️ Security & Reliability Features

- **Rate Limiting**: Brute-force protection on `/api/auth/login`, registration spam limiting, and scan throttling.
- **Helmet Headers**: Industry-standard HTTP security headers (`crossOriginResourcePolicy` for secure cross-port PDF streaming).
- **Tenant Isolation**: Defense-in-depth enforcement ensuring Club Member tokens can never operate across tenant slugs.
- **Graceful Shutdown**: Intercepts `SIGTERM`/`SIGINT` to safely drain active connections and close database handles before exiting.
- **React ErrorBoundary**: Prevents app-wide white-screens by catching rendering exceptions gracefully with reload options.
