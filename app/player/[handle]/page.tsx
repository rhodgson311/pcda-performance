'use client'
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PlayerPage() {
  const params = useParams();
  const handle = decodeURIComponent(params?.handle as string);
  const [entries, setEntries] = useState<any[]>([]);
  const [exercise, setExercise] = useState<string>('All');

  useEffect(() => {
    fetch(`/api/entries?handle=${encodeURIComponent(handle)}`).then(r => r.json()).then(d => setEntries(d.entries));
  }, [handle]);

  const exercises = useMemo(() => ['All', ...Array.from(new Set(entries.map(e => e.exercise).filter(Boolean)))], [entries]);

  const filtered = useMemo(() => {
    const arr = exercise === 'All' ? entries : entries.filter(e => e.exercise === exercise);
    return arr.slice().sort((a,b) => a.date.localeCompare(b.date));
  }, [entries, exercise]);

  return (
    <div className="grid gap-8">
      <div className="card">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{handle}</h1>
            <p className="text-sm text-gray-600">Public dashboard</p>
          </div>
          <div className="min-w-[200px]">
            <div className="label mb-1">Filter by exercise</div>
            <select className="input" value={exercise} onChange={e => setExercise(e.target.value)}>
              {exercises.map(ex => <option key={ex}>{ex}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Strength & RPE</h2>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={filtered}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="end_weight" name="End Weight (kg)" />
            <Line type="monotone" dataKey="rpe" name="RPE" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Body Composition</h2>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={filtered}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="muscle_mass" name="Muscle Mass (kg)" />
            <Line type="monotone" dataKey="body_weight" name="Body Weight (kg)" />
            <Line type="monotone" dataKey="body_fat" name="Body Fat (%)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th><th>Exercise</th><th>Machine</th><th>End Wt</th><th>Sets</th><th>Reps</th><th>RPE</th>
            </tr>
          </thead>
        <tbody>
          {filtered.slice(-20).reverse().map(e => (
            <tr key={e.id}>
              <td>{e.date}</td><td>{e.exercise}</td><td>{e.machine || '—'}</td>
              <td>{e.end_weight ?? '—'}</td><td>{e.sets ?? '—'}</td><td>{e.reps ?? '—'}</td><td>{e.rpe ?? '—'}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}
