# BlogBook Frontend

Next.js social blog UI with Tailwind CSS, PrimeReact, and TanStack React Query — Facebook-inspired feed design.

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

> Dev uses webpack (`next dev --webpack`) to avoid a known Turbopack panic on `/profile` in this monorepo layout on Windows.

Open [http://localhost:3000](http://localhost:3000). Ensure the backend API is running on port 5000.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server

## Environment

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Data layer

API state is managed with **TanStack React Query**:

- `hooks/queries/` — `useQuery` hooks for posts, comments, admin data
- `hooks/mutations/` — `useMutation` hooks with automatic cache invalidation
- `lib/queryKeys.js` — centralized query key factory

React Query DevTools are available in development (bottom-left corner).
