# Warsaw Salon Explorer

A full-stack web app for discovering and exploring hair and beauty salons in Warsaw. Browse by district, search by name, filter by service, and view detailed salon profiles.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Radix UI |
| Backend | NestJS 10, TypeScript |
| Database | PostgreSQL with TypeORM |
| Data source | Google Places API |

---

## Prerequisites

- Node.js 18+
- PostgreSQL running locally
- A Google Places API key with the **Places API** enabled

---

## Environment Variables

### Backend — `apps/backend/.env`

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=salon
DB_PASSWORD=salon
DB_NAME=salons
GOOGLE_PLACES_API_KEY=your_key_here
```

### Frontend — `apps/frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Running the Project

### 1. Install dependencies

From the project root:

```bash
npm install
```

### 2. Set up the database

Create the PostgreSQL database and user:

```sql
CREATE USER salon WITH PASSWORD 'salon';
CREATE DATABASE salons OWNER salon;
```

### 3. Configure environment variables

```bash
cp apps/backend/.env.example apps/backend/.env
# Fill in your GOOGLE_PLACES_API_KEY in apps/backend/.env

cp apps/frontend/.env.example apps/frontend/.env.local
# NEXT_PUBLIC_API_URL is already set to http://localhost:3001
```

### 4. Seed the database

This fetches real Warsaw salon data from the Google Places API and inserts it into the database.

```bash
cd apps/backend
npm run seed
```

The script runs 5 search queries across Warsaw (hair salons, beauty salons, barbers, manicure/pedicure), deduplicates results, enriches each place with details, and inserts them. Expect ~100–200 salons and a couple of minutes to complete.

### 5. Start the app

From the project root, run both frontend and backend together:

```bash
npm run dev
```

Or separately:

```bash
npm run backend   # NestJS on http://localhost:3001
npm run frontend  # Next.js on http://localhost:3000
```

### 6. Open the app

Visit [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/salons` | List salons. Supports `?search=`, `?district=`, `?service=`, `?page=`, `?limit=` |
| `GET` | `/salons/:id` | Get a single salon by ID |
| `PATCH` | `/salons/:id` | Update a salon's fields |

---

## What I'd Improve

**Role-based auth with JWT**
The `PATCH` endpoint is currently open. I'd add role-based authentication using JWT tokens — users would log in to receive a signed token, and the token's role claim would gate write operations. `@nestjs/passport` with a JWT strategy is the natural fit here. Admins could edit listings; regular users would have read-only access.

**Redis caching on the listing endpoint**
`GET /salons` is read-heavy and the data changes infrequently. I'd cache the response in Redis via `cache-manager` with a short TTL, and invalidate the relevant cache keys on any successful `PATCH`. This would significantly reduce database load under traffic.

**Map view for nearby discovery**
Every salon already has latitude/longitude from the Places API. I'd add an interactive map (Mapbox or Google Maps JS SDK) alongside the card grid so users can visually spot salons near them rather than browsing through paginated cards. A "near me" button using the Geolocation API would make this even more useful.

**Scaling to all of Poland**
Expanding beyond Warsaw would need considerably more thought. The Google Places API has per-day quotas and per-request costs, so the seed strategy would need to be rate-limited and run incrementally city by city. At scale the backend would need rate limiting on public endpoints to prevent abuse. For hosting, I'd look at AWS — RDS for managed Postgres, ElastiCache for Redis, and ECS or Lambda for the API — with the considerations that come with that: VPC configuration, secret management via Secrets Manager, and CDN caching for the Next.js frontend via CloudFront.
