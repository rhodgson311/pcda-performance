# PCDA Sports Performance Tracker — v3.2 (JS Only)

**New in v3.2**  
- 📥 **CSV Importer** on `/admin` (Admin Key required).  
- 🏅 **Personal Records** card on player dashboards.

## Deploy
1. Push to GitHub → Import to Vercel.
2. Add **Vercel Postgres**.
3. Set env vars:
   - `POSTGRES_*` (from Vercel Postgres)
   - `ADMIN_KEY` (secret for /admin)
4. Deploy. Tables + demo players (alex/1111, jordan/2222, sam/3333) are created on first request.

## CSV Format
```
date,handle,pin,exercise,machine,start_weight,end_weight,sets,reps,rpe,muscle_mass,body_weight,body_fat,notes
2025-01-10,alex,1111,Squat,Rack,60,80,3,8,8,35,82,12,Good depth
```
Upload this via `/admin`. A sample is in `demo/import_sample.csv`.

> Note: CSV parser is simple (no quoted-commas). Export clean CSVs without embedded commas or quotes.
