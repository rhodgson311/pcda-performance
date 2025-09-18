# PCDA Sports Performance Tracker — v3 Full

Public motivational tracker for PCDA players with **PIN-protected logging**, **admin player management**, and **exercise filters**.

## Quick Deploy
1. Create a Vercel project and add **Vercel Postgres**.
2. Add env vars (Project → Settings → Environment Variables). See `.env.example`:
   - `POSTGRES_*` (from Vercel Postgres)
   - `ADMIN_KEY` (your secret to access `/admin`)
3. Deploy. First request will auto‑create the tables and seed demo players (`alex/1111`, `jordan/2222`, `sam/3333`).

## Routes
- `/` — Leaderboard + highlights
- `/log` — PIN-protected logging form
- `/players` — List of players
- `/player/[handle]` — Player dashboard with exercise filter
- `/admin` — Add players (requires `ADMIN_KEY`)

## API
- `POST /api/entries` — Create entry (requires handle + pin)
- `GET /api/entries?handle=alex` — List entries
- `GET /api/players` — Leaderboard data
- `GET /api/highlights` — Highlights
- `POST /api/admin/add-player` — Add/update player (requires ADMIN_KEY)

> PINs are stored as plain text for simplicity. You can later migrate to hashed secrets if needed.
