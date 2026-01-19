# MLMS - Mall Leasing Management System

Philippines Edition - Mall Alpha MVP

## Project Structure

```
leasing/
├── backend/          # Express API (Node.js/TypeScript)
│   ├── src/
│   ├── migrations/   # node-pg-migrate migrations
│   └── package.json
│
├── frontend/         # Next.js (React/TypeScript)
│   ├── app/
│   ├── components/
│   └── package.json
│
├── IMPLEMENTATION_PLAN.md
└── README.md
```

## Technology Stack

- **Backend**: Node.js/Express (TypeScript)
- **Frontend**: Next.js 14+ (TypeScript)
- **Database**: Supabase (PostgreSQL) - Local/Staging
- **Authentication**: JWT + HTTP-only cookies + refresh token rotation
- **Migrations**: node-pg-migrate

## Quick Start (Phase 0 - Setup)

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account (free tier works for local/staging)
- Git

### Setup Steps

See **[SETUP.md](./SETUP.md)** for detailed setup instructions.

**Quick Summary:**
1. Install dependencies (`npm install` in both backend/ and frontend/)
2. Set up Supabase database and configure `.env` files
3. Run database migrations (`npm run migrate:up` in backend/)
4. Start development servers

**Access:**
- Backend API: http://localhost:3001/api/v1
- Frontend: http://localhost:3000
- Health Check: http://localhost:3001/api/v1/health

## Development Workflow

1. Review [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for phase details
2. Complete each phase before proceeding to next
3. Test features before moving forward
4. Get approval before proceeding to next phase

## MVP Timeline

6-7 weeks (Jan 14, 2026 → March 2026)

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for detailed phase breakdown.

## First Mall

- **Mall Alpha** (single mall focus for MVP)
