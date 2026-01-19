# MLMS Frontend

Next.js frontend application for Mall Leasing Management System

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Start Development Server

```bash
npm run dev
```

The application will run on `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## Project Structure

```
frontend/
├── app/              # Next.js App Router
├── components/       # React components
├── lib/              # Utilities and API client
├── types/            # TypeScript types
└── public/           # Static assets
```
