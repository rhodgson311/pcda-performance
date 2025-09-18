'use client'
import { useState } from 'react';

export default function AdminPage() {
  const [key, setKey] = useState('');
  const [handle, setHandle] = useState('');
  const [pin, setPin] = useState('');
  const [ok, setOk] = useState(null);
  const [err, setErr] = useState(null);
  const [csvResult, setCsvResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setOk(null); setErr(null);
    try {
      const res = await fetch('/api/admin/add-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, handle, pin })
      });
      if (!res.ok) throw new Error(await res.text());
      setOk('Player saved.');
      setHandle(''); setPin('');
    } catch (e) {
      setErr(e.message);
    }
  }

  const importCsv = async (e) => {
    e.preventDefault();
    const file = document.getElementById('csvfile').files[0];
    if (!file) { setErr('Choose a CSV file first.'); return; }
    setBusy(true); setErr(null); setCsvResult(null);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('key', key);
      const res = await fetch('/api/admin/import', { method: 'POST', body: form });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setCsvResult(`${data.imported} rows imported, ${data.skipped} skipped.`);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin</h1>

      <form onSubmit={submit} className="grid gap-3 mb-8">
        <h2 className="text-xl font-semibold">Add / Update Player</h2>
        <div><div className="label">Admin Key</div><input className="input" value={key} onChange={e=>setKey(e.target.value)} placeholder="ADMIN_KEY" required/></div>
        <div className="grid md:grid-cols-2 gap-3">
          <div><div className="label">Handle (public)</div><input className="input" value={handle} onChange={e=>setHandle(e.target.value)} placeholder="e.g. ryan" required/></div>
          <div><div className="label">PIN (private)</div><input className="input" value={pin} onChange={e=>setPin(e.target.value)} placeholder="****" required/></div>
        </div>
        <div className="flex gap-2"><button className="btn">Save Player</button></div>
        {ok && <div className="text-green-700">{ok}</div>}
        {err && <div className="text-red-700">{err}</div>}
      </form>

      <form onSubmit={importCsv} className="grid gap-3">
        <h2 className="text-xl font-semibold">📥 Import CSV</h2>
        <p className="text-sm text-gray-600">Format: <code>date,handle,pin,exercise,machine,start_weight,end_weight,sets,reps,rpe,muscle_mass,body_weight,body_fat,notes</code></p>
        <input id="csvfile" type="file" accept=".csv,text/csv" className="input" />
        <div className="flex gap-2">
          <button className="btn" disabled={busy}>{busy ? 'Importing…' : 'Import CSV'}</button>
        </div>
        {csvResult && <div className="text-green-700">{csvResult}</div>}
      </form>
    </div>
  )
}
