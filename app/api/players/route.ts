import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { ensureTables } from '@/lib/db'

export async function GET() {
  await ensureTables();
  const { rows } = await sql`
    WITH last7 AS (
      SELECT handle, date, COALESCE(end_weight,0) * COALESCE(reps,0) * COALESCE(sets,0) AS volume
      FROM entries
      WHERE date >= CURRENT_DATE - INTERVAL '7 days'
    ),
    agg AS ( SELECT handle, SUM(volume) AS seven_day_volume FROM last7 GROUP BY handle ),
    latest AS ( SELECT handle, MAX(date) AS latest_date FROM entries GROUP BY handle ),
    all_handles AS ( SELECT handle FROM players )
    SELECT ah.handle,
           COALESCE(a.seven_day_volume,0) AS "sevenDayVolume",
           to_char(l.latest_date, 'YYYY-MM-DD') AS "latestDate"
    FROM all_handles ah
    LEFT JOIN agg a ON a.handle = ah.handle
    LEFT JOIN latest l ON l.handle = ah.handle
    ORDER BY "sevenDayVolume" DESC, "latestDate" DESC NULLS LAST
  `;
  return NextResponse.json({ players: rows });
}
