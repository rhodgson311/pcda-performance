import Link from "next/link";
import { Suspense } from "react";

async function fetchJSON(path: string) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed request");
  return res.json();
}

async function Leaderboard() {
  const { players } = await fetchJSON("/api/players");
  const { highlights } = await fetchJSON("/api/highlights");
  return (
    <div className="grid gap-8">
      <section className="card">
        <h1 className="text-2xl font-bold mb-2">🏆 Leaderboard (7‑day Volume)</h1>
        <p className="text-sm text-gray-600 mb-4">Sum of (end weight × reps × sets) over the last 7 days.</p>
        <div className="overflow-x-auto">
          <table className="table">
            <thead><tr><th>Rank</th><th>Player</th><th>7‑day Volume</th><th>Latest</th></tr></thead>
            <tbody>
              {players.map((p: any, i: number) => (
                <tr key={p.handle}>
                  <td>#{i+1}</td>
                  <td><Link href={`/player/${p.handle}`} className="underline">{p.handle}</Link></td>
                  <td>{Math.round(p.sevenDayVolume ?? 0).toLocaleString()}</td>
                  <td>{p.latestDate ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2 className="text-xl font-bold mb-2">🔥 Highlights</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {highlights.map((h: any) => (
            <div key={h.id} className="rounded-2xl border p-4">
              <div className="text-sm text-gray-600">{h.date}</div>
              <div className="font-semibold">{h.handle}</div>
              <div>{h.exercise} — {h.end_weight}kg × {h.reps} × {h.sets} (RPE {h.rpe})</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      {/* @ts-expect-error Async Server Component */}
      <Leaderboard />
    </Suspense>
  );
}
