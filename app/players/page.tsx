import Link from "next/link";

async function getPlayers() {
  const res = await fetch("/api/players", { cache: "no-store" });
  return res.json();
}

export default async function PlayersPage() {
  const { players } = await getPlayers();
  return (
    <div className="card">
      <h1 className="text-2xl font-bold mb-4">All Players</h1>
      <ul className="grid md:grid-cols-3 gap-3">
        {players.map((p: any) => (
          <li key={p.handle} className="rounded-xl border p-4">
            <div className="font-semibold">{p.handle}</div>
            <div className="text-sm text-gray-600">Latest: {p.latestDate ?? "—"}</div>
            <div className="mt-2">
              <Link className="underline" href={`/player/${p.handle}`}>View dashboard</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
