'use client'
import { useState } from 'react';

export default function AdminPage() {
  const [key, setKey] = useState('');
  const [handle, setHandle] = useState('');
  const [pin, setPin] = useState('');
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: any) => {
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
    } catch (e:any) {
      setErr(e.message);
    }
  }

  return (
    <div className="card max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin — Add Player</h1>
      <form onSubmit={submit} className="grid gap-3">
        <div><div className="label">Admin Key</div><input className="input" value={key} onChange={e=>setKey(e.target.value)} placeholder="ADMIN_KEY" required/></div>
        <div><div className="label">Handle (public)</div><input className="input" value={handle} onChange={e=>setHandle(e.target.value)} placeholder="e.g. ryan" required/></div>
        <div><div className="label">PIN (private)</div><input className="input" value={pin} onChange={e=>setPin(e.target.value)} placeholder="****" required/></div>
        <div className="flex gap-2"><button className="btn">Save Player</button></div>
        {ok && <div className="text-green-700">{ok}</div>}
        {err && <div className="text-red-700">{err}</div>}
      </form>
      <p className="text-sm text-gray-500 mt-4">Requires env var <code>ADMIN_KEY</code>. Do not share publicly.</p>
    </div>
  )
}
