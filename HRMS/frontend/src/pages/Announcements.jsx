import React, { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Announcements() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    const res = await api.get('/announcements');
    setItems(res.data.data);
  };

  useEffect(() => { load(); }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    await api.post('/announcements', { title, message });
    setTitle(''); setMessage('');
    await load();
  };

  const onDelete = async (id) => {
    await api.delete(`/announcements/${id}`);
    await load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Announcements</h1>

      {(user.role === 'admin' || user.role === 'hr') && (
        <form onSubmit={onCreate} className="card p-4 space-y-2">
          <input placeholder="Title" className="border rounded-md px-3 py-2 w-full" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <textarea placeholder="Message" className="border rounded-md px-3 py-2 w-full" value={message} onChange={(e)=>setMessage(e.target.value)} />
          <button className="btn">Publish</button>
        </form>
      )}

      <div className="grid gap-3">
        {items.map((a)=> (
          <div key={a._id} className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{a.title}</div>
                <div className="text-sm text-gray-500">By {a.createdBy?.name} • {new Date(a.createdAt).toLocaleString()}</div>
              </div>
              {(user.role === 'admin' || user.role === 'hr') && (
                <button className="btn" onClick={()=>onDelete(a._id)}>Delete</button>
              )}
            </div>
            <div className="mt-2 text-gray-700">{a.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
