import { NextResponse } from 'next/server';
import { ensureTables, sql } from '../../lib/db.js';

export async function GET() {
  await ensureTables();
  const { rows } = await sql`
    SELECT id, handle, exercise, to_char(date, 'YYYY-MM-DD') as date,
           COALESCE(end_weight,0) as end_weight, COALESCE(reps,0) as reps, COALESCE(sets,0) as sets,
           COALESCE(rpe,0) as rpe
    FROM entries
    WHERE end_weight IS NOT NULL AND reps IS NOT NULL AND sets IS NOT NULL
    ORDER BY (end_weight * reps * sets) DESC, date DESC
    LIMIT 6
  `;
  return NextResponse.json({ highlights: rows });
}
