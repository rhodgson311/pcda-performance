'use client'
import { useState } from 'react';

export default function LogPage() {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0,10),
    handle: '',
    pin: '',
    exercise: '',
    machine: '',
    start_weight: '',
    end_weight: '',
    sets: '',
    reps: '',
    rpe: '',
    muscle_mass: '',
    body_weight: '',
    body_fat: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true); setOk(null); setErr(null);
    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error(await res.text());
      setOk('Logged! Add another or view your dashboard.');
      setForm(f => ({ ...f, exercise: '', machine: '', start_weight:'', end_weight:'', sets:'', reps:'', rpe:'', notes:'' }));
    } catch (e:any) {
      setErr(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Log a Session (PIN Protected)</h1>
      <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
        <div><div className="label">Date</div><input className="input" type="date" name="date" value={form.date} onChange={onChange} required/></div>
        <div><div className="label">Player Handle (public)</div><input className="input" name="handle" value={form.handle} onChange={onChange} placeholder="e.g. alex" required/></div>
        <div><div className="label">PIN (private)</div><input className="input" name="pin" value={form.pin} onChange={onChange} placeholder="****" required/></div>
        <div><div className="label">Exercise</div><input className="input" name="exercise" value={form.exercise} onChange={onChange} placeholder="Squat" required/></div>
        <div><div className="label">Machine</div><input className="input" name="machine" value={form.machine} onChange={onChange} placeholder="Hack squat / Smith"/></div>
        <div><div className="label">Start Weight (kg)</div><input className="input" type="number" name="start_weight" value={form.start_weight} onChange={onChange}/></div>
        <div><div className="label">End Weight (kg)</div><input className="input" type="number" name="end_weight" value={form.end_weight} onChange={onChange}/></div>
        <div><div className="label">Sets</div><input className="input" type="number" name="sets" value={form.sets} onChange={onChange}/></div>
        <div><div className="label">Reps</div><input className="input" type="number" name="reps" value={form.reps} onChange={onChange}/></div>
        <div><div className="label">RPE (1–10)</div><input className="input" type="number" name="rpe" value={form.rpe} onChange={onChange} min={1} max={10}/></div>
        <div><div className="label">Muscle Mass (kg)</div><input className="input" type="number" name="muscle_mass" value={form.muscle_mass} onChange={onChange}/></div>
        <div><div className="label">Body Weight (kg)</div><input className="input" type="number" name="body_weight" value={form.body_weight} onChange={onChange}/></div>
        <div><div className="label">Body Fat %</div><input className="input" type="number" name="body_fat" value={form.body_fat} onChange={onChange} step="0.1"/></div>
        <div className="md:col-span-2"><div className="label">Notes</div><textarea className="input" name="notes" value={form.notes} onChange={onChange} rows={3} placeholder="Focus cues, tempo, etc."/></div>
        <div className="md:col-span-2 flex gap-3">
          <button className="btn" disabled={submitting}>{submitting ? "Saving…" : "Save Entry"}</button>
          <a className="btn-secondary" href="/players">View Players</a>
        </div>
        {ok && <div className="text-green-700">{ok}</div>}
        {err && <div className="text-red-700">{err}</div>}
      </form>
    </div>
  )
}
