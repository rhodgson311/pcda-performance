const { sql } = require('@vercel/postgres');

async function ensureTables() {
  await sql`CREATE TABLE IF NOT EXISTS players (handle TEXT PRIMARY KEY, pin TEXT NOT NULL);`;
  await sql`CREATE TABLE IF NOT EXISTS entries (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    date DATE NOT NULL,
    handle TEXT NOT NULL REFERENCES players(handle) ON DELETE CASCADE,
    exercise TEXT NOT NULL,
    machine TEXT,
    start_weight NUMERIC,
    end_weight NUMERIC,
    sets INTEGER,
    reps INTEGER,
    rpe INTEGER,
    muscle_mass NUMERIC,
    body_weight NUMERIC,
    body_fat NUMERIC,
    notes TEXT
  );`;
  await sql`CREATE INDEX IF NOT EXISTS idx_entries_handle_date ON entries(handle, date);`;
  await sql`INSERT INTO players (handle, pin) VALUES ('alex','1111') ON CONFLICT (handle) DO NOTHING;`;
  await sql`INSERT INTO players (handle, pin) VALUES ('jordan','2222') ON CONFLICT (handle) DO NOTHING;`;
  await sql`INSERT INTO players (handle, pin) VALUES ('sam','3333') ON CONFLICT (handle) DO NOTHING;`;
}

module.exports = { ensureTables, sql };
