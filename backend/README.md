# MLMS Backend

Express API server for Mall Leasing Management System

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3001

# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/mlms
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mlms
DB_USER=postgres
DB_PASSWORD=your_password_here

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

### 3. Database Setup (Supabase)

1. Create a Supabase project at https://supabase.com
2. Get your database connection string from Supabase dashboard
3. Update `DATABASE_URL` in `.env`

### 4. Run Migrations

```bash
npm run migrate:up
```

### 5. Start Development Server

```bash
npm run dev
```

The server will run on `http://localhost:3001`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run migrate:up` - Run pending migrations
- `npm run migrate:down` - Rollback last migration
- `npm run migrate:create <name>` - Create new migration
- `npm run type-check` - TypeScript type checking
- `npm run lint` - Run ESLint

## API Endpoints

### Health Check
- `GET /api/v1/health` - Health check endpoint
