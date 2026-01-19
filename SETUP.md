# Phase 0 Setup - Quick Start Guide

## ✅ What's Been Created

### Backend (`/backend`)
- ✅ Express + TypeScript project structure
- ✅ Database connection pool (PostgreSQL)
- ✅ Migration system setup (node-pg-migrate)
- ✅ Initial database schema migration (all tables from PRD)
- ✅ Health check endpoint
- ✅ Basic server setup with CORS, cookie parser, error handling
- ✅ TypeScript configuration
- ✅ ESLint configuration

### Frontend (`/frontend`)
- ✅ Next.js 14+ project with App Router
- ✅ TypeScript configuration
- ✅ API client setup (axios)
- ✅ Basic project structure
- ✅ Type definitions

## 📋 Next Steps to Get Running

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Set Up Supabase Database

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Go to Project Settings → Database
4. Copy the connection string (Connection String → URI format)

### 3. Configure Backend Environment

Create `backend/.env` file:

```env
NODE_ENV=development
PORT=3001

# Use your Supabase connection string
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_change_in_production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cookie Configuration
COOKIE_SECURE=false
COOKIE_HTTP_ONLY=true
COOKIE_SAME_SITE=lax

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 4. Run Database Migrations

```bash
cd backend
npm run migrate:up
```

This will create all the database tables from the PRD schema.

### 5. Configure Frontend Environment

Create `frontend/.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 6. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 7. Test the Setup

1. Backend health check: http://localhost:3001/api/v1/health
2. Frontend: http://localhost:3000

## 📁 Project Structure

```
leasing/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── pool.ts          # Database connection pool
│   │   ├── types/
│   │   │   └── index.ts         # TypeScript types
│   │   └── server.ts            # Express server
│   ├── migrations/
│   │   └── 001_initial_schema.ts # Database schema migration
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── globals.css          # Global styles
│   ├── lib/
│   │   └── api.ts               # API client
│   ├── types/
│   │   └── index.ts             # TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── IMPLEMENTATION_PLAN.md       # Detailed phase plan
├── README.md                    # Project overview
└── SETUP.md                     # This file
```

## 🔍 Verification Checklist

After setup, verify:

- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Supabase database connection configured
- [ ] Database migrations run successfully
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Health check endpoint returns 200 OK
- [ ] Frontend loads at http://localhost:3000

## 🚀 Phase 0 Next Steps

Once setup is verified, Phase 0 continues with:

1. Authentication system implementation
   - User model and routes
   - JWT token generation
   - HTTP-only cookie setup
   - Refresh token rotation
   - RBAC middleware

2. API foundation
   - Error handling middleware (enhanced)
   - Request validation (Zod)
   - Additional middleware setup

3. Testing
   - Database connection tests
   - Authentication flow tests

## 📝 Notes

- Database schema includes ALL tables from PRD (including Phase 2 tables)
- Migrations are ready but some tables won't be used until later phases
- Authentication foundation will be added next
- This is the foundation for all future development
