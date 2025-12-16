<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# HardbanRecords Lab

## Overview
HardbanRecords Lab is a production-ready platform for music and publishing management with AI-assisted creation, analytics, and distribution.

## Tech Stack
- Backend: Node.js, Express, Supabase
- Frontend: React, Vite, Tailwind CSS
- AI: Google Generative AI

## Getting Started
1. Install dependencies: `npm install`
2. Create `.env.local` with:
   - `SUPABASE_URL=`
   - `SUPABASE_ANON_KEY=`
   - `SUPABASE_SERVICE_ROLE_KEY=`
   - `GEMINI_API_KEY=`
3. Start dev servers:
   - Frontend: `npx vite` (http://localhost:3000)
   - Backend: `node server.js` (http://localhost:3001)

## Scripts
- `npm run dev` starts Vite and the backend concurrently
- `npm run build` builds the frontend
- `npm run typecheck` runs TypeScript checks
- `npm run lint` runs ESLint

## Notes
- API endpoints are defined in `server.js`
- Frontend API calls are centralized in `services/api.ts`
