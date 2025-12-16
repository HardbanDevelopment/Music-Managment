<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# HardbanRecords Lab

## Overview
HardbanRecords Lab is a production-ready platform for music and publishing management with AI-assisted creation, analytics, and distribution.

## Tech Stack
- **Backend**: Node.js, Express, Supabase
- **Frontend**: React, Vite, Tailwind CSS
- **AI**: Google Generative AI
- **Testing**: Vitest, React Testing Library

## Project Structure
- `src/`: Main source code
  - `components/`: Reusable UI components
  - `pages/`: Page components mapped to routes
  - `providers/`: Context providers (Auth, Toast)
  - `routes/`: Routing configuration
  - `services/`: API services
  - `types/`: TypeScript definitions
  - `utils/`: Utility functions
- `server.cjs`: Backend server entry point
- `tests/`: Unit and integration tests

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` with:
   - `SUPABASE_URL=`
   - `SUPABASE_ANON_KEY=`
   - `SUPABASE_SERVICE_ROLE_KEY=`
   - `GEMINI_API_KEY=`
3. Start dev servers:
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## Scripts
- `npm run dev`: Starts Vite and the backend concurrently
- `npm run build`: Builds the frontend
- `npm run typecheck`: Runs TypeScript checks
- `npm run lint`: Runs ESLint
- `npm test`: Runs unit tests with Vitest

## Documentation
See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architectural overview.
