import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { ensureTables } from '@/lib/db'

export async function GET(req: Request) {
  await ensureTables();
  const { searchParams } = new URL(req.url);
  const handle = searchParams.get('handle');
  const limit = Number(searchParams.get('limit') ?? 1000);
  if (handle) {
    const { rows } = await sql`SELECT id, to_char(date,'YYYY-MM-DD') as date, handle, exercise, machine, start_weight, end_weight, sets, reps, rpe, muscle_mass, body_weight, body_fat, notes FROM entries WHERE handle=${handle} ORDER BY date ASC LIMIT ${limit}`
    return NextResponse.json({ entries: rows })
  } else {
    const { rows } = await sql`SELECT id, to_char(date,'YYYY-MM-DD') as date, handle, exercise, machine, start_weight, end_weight, sets, reps, rpe, muscle_mass, body_weight, body_fat, notes FROM entries ORDER BY created_at DESC LIMIT ${limit}`
    return NextResponse.json({ entries: rows })
  }
}

export async function POST(req: Request) {
  await ensureTables();
  const body = await req.json();
  const id = crypto.randomUUID();
  const fields = {
    id,
    date: body.date,
    handle: body.handle?.trim(),
    pin: body.pin?.trim(),
    exercise: body.exercise?.trim(),
    machine: body.machine || null,
    start_weight: body.start_weight ? Number(body.start_weight) : null,
    end_weight: body.end_weight ? Number(body.end_weight) : null,
    sets: body.sets ? Number(body.sets) : null,
    reps: body.reps ? Number(body.reps) : null,
    rpe: body.rpe ? Number(body.rpe) : null,
    muscle_mass: body.muscle_mass ? Number(body.muscle_mass) : null,
    body_weight: body.body_weight ? Number(body.body_weight) : null,
    body_fat: body.body_fat ? Number(body.body_fat) : null,
    notes: body.notes || null
  };

  if (!fields.date || !fields.handle || !fields.exercise || !fields.pin) {
    return new NextResponse('Missing required fields', { status: 400 });
  }

  const player = await sql`SELECT pin FROM players WHERE handle=${fields.handle}`;
  if (player.rowCount === 0) return new NextResponse('Unknown handle. Ask coach to add you.', { status: 401 });
  if (player.rows[0].pin !== fields.pin) return new NextResponse('Invalid PIN.', { status: 401 });

  await sql`
    INSERT INTO entries (id, date, handle, exercise, machine, start_weight, end_weight, sets, reps, rpe, muscle_mass, body_weight, body_fat, notes)
    VALUES (${fields.id}, ${fields.date}, ${fields.handle}, ${fields.exercise}, ${fields.machine}, ${fields.start_weight}, ${fields.end_weight},
            ${fields.sets}, ${fields.reps}, ${fields.rpe}, ${fields.muscle_mass}, ${fields.body_weight}, ${fields.body_fat}, ${fields.notes})
  `;

  return NextResponse.json({ ok: true, id });
}
