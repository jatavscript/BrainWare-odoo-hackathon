import React, { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

export default function Leaves() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ type: 'Sick', startDate: '', endDate: '', reason: '' });
  const [message, setMessage] = useState('');

  const load = async () => {
    const res = await api.get('/leaves/me');
    setItems(res.data.data);
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault(); setMessage('');
    try {
      await api.post('/leaves', form);
      setForm({ type: 'Sick', startDate: '', endDate: '', reason: '' });
      await load();
      setMessage('Leave applied');
    } catch (e) {
      setMessage(e?.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Leaves</h1>

      <form onSubmit={onSubmit} className="card p-4 space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <select className="border rounded-md px-3 py-2" value={form.type} onChange={(e)=>setForm(v=>({...v,type:e.target.value}))}>
            <option>Sick</option>
            <option>Casual</option>
            <option>Paid</option>
          </select>
          <input type="date" className="border rounded-md px-3 py-2" value={form.startDate} onChange={(e)=>setForm(v=>({...v,startDate:e.target.value}))} />
          <input type="date" className="border rounded-md px-3 py-2" value={form.endDate} onChange={(e)=>setForm(v=>({...v,endDate:e.target.value}))} />
          <input placeholder="Reason" className="border rounded-md px-3 py-2" value={form.reason} onChange={(e)=>setForm(v=>({...v,reason:e.target.value}))} />
        </div>
        <div className="flex items-center gap-3">
          <button className="btn">Apply</button>
          {message && <div className="text-sm text-gray-600">{message}</div>}
        </div>
      </form>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">Type</th>
              <th className="p-3">From</th>
              <th className="p-3">To</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i)=> (
              <tr key={i._id} className="border-t">
                <td className="p-3">{i.type}</td>
                <td className="p-3">{new Date(i.startDate).toLocaleDateString()}</td>
                <td className="p-3">{new Date(i.endDate).toLocaleDateString()}</td>
                <td className="p-3">{i.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
