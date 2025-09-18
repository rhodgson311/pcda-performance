import { NextResponse } from 'next/server';
import { ensureTables, sql } from '../../../lib/db.js';

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const header = lines[0].split(',').map(s => s.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(','); // simple parser; no quoted commas
    if (cols.length < 4) continue;
    const obj = {};
    header.forEach((h, idx) => obj[h] = (cols[idx] ?? '').trim());
    rows.push(obj);
  }
  return rows;
}

export async function POST(req) {
  await ensureTables();
  const form = await req.formData();
  const key = (form.get('key') || '').toString();
  if (key !== process.env.ADMIN_KEY) return new NextResponse('Unauthorized', { status: 401 });
  const file = form.get('file');
  if (!file) return new NextResponse('No file', { status: 400 });
  const text = await file.text();
  const rows = parseCSV(text);

  let imported = 0, skipped = 0;
  for (const r of rows) {
    try {
      const handle = (r.handle || '').trim();
      const pin = (r.pin || '').trim();
      if (!handle || !pin || !r.exercise || !r.date) { skipped++; continue; }

      // verify PIN
      const player = await sql`SELECT pin FROM players WHERE handle=${handle}`;
      if (player.rowCount === 0 || player.rows[0].pin !== pin) { skipped++; continue; }

      const id = crypto.randomUUID();
      await sql`
        INSERT INTO entries (id, date, handle, exercise, machine, start_weight, end_weight, sets, reps, rpe, muscle_mass, body_weight, body_fat, notes)
        VALUES (${id}, ${r.date}, ${handle}, ${r.exercise}, ${r.machine || null},
                ${r.start_weight || null}, ${r.end_weight || null}, ${r.sets || null}, ${r.reps || null}, ${r.rpe || null},
                ${r.muscle_mass || null}, ${r.body_weight || null}, ${r.body_fat || null}, ${r.notes || null})
      `;
      imported++;
    } catch (e) {
      skipped++;
    }
  }

  return NextResponse.json({ imported, skipped });
}
