import { NextResponse } from 'next/server';
import { ensureTables, sql } from '../../../lib/db.js';

export async function POST(req) {
  await ensureTables();
  const body = await req.json();
  const key = (body.key || '').trim();
  const handle = (body.handle || '').trim();
  const pin = (body.pin || '').trim();

  if (!key || !handle || !pin) return new NextResponse('Missing fields', { status: 400 });
  if (key !== process.env.ADMIN_KEY) return new NextResponse('Unauthorized', { status: 401 });

  await sql`INSERT INTO players (handle, pin) VALUES (${handle}, ${pin})
           ON CONFLICT (handle) DO UPDATE SET pin = EXCLUDED.pin`;

  return NextResponse.json({ ok: true });
}
