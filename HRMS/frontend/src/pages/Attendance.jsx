import React, { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

export default function Attendance() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    const res = await api.get('/attendance/me');
    setItems(res.data.data);
  };

  useEffect(() => { load(); }, []);

  const checkIn = async () => {
    setLoading(true); setMessage('');
    try { await api.post('/attendance/check-in'); await load(); setMessage('Checked in'); } catch (e) { setMessage(e?.response?.data?.message || 'Failed'); } finally { setLoading(false); }
  };
  const checkOut = async () => {
    setLoading(true); setMessage('');
    try { await api.post('/attendance/check-out'); await load(); setMessage('Checked out'); } catch (e) { setMessage(e?.response?.data?.message || 'Failed'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Attendance</h1>
      <div className="flex gap-2">
        <button className="btn" onClick={checkIn} disabled={loading}>Check In</button>
        <button className="btn" onClick={checkOut} disabled={loading}>Check Out</button>
      </div>
      {message && <div className="text-sm text-gray-600">{message}</div>}
      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">Date</th>
              <th className="p-3">Check In</th>
              <th className="p-3">Check Out</th>
              <th className="p-3">Hours</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i._id} className="border-t">
                <td className="p-3">{new Date(i.date).toLocaleDateString()}</td>
                <td className="p-3">{i.checkIn ? new Date(i.checkIn).toLocaleTimeString() : '-'}</td>
                <td className="p-3">{i.checkOut ? new Date(i.checkOut).toLocaleTimeString() : '-'}</td>
                <td className="p-3">{i.totalHours?.toFixed(2)}</td>
                <td className="p-3">{i.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
