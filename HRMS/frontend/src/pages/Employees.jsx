import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Employees() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [departments, setDepartments] = useState([]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: 'Password@123',
    employeeId: '',
    department: '',
    designation: '',
    status: 'Active',
    avatarUrl: ''
  });
  const [message, setMessage] = useState('');

  const load = async () => {
    const res = await api.get('/employees', { params: { q, status, page, limit } });
    setItems(res.data.data); setTotal(res.data.pagination.total);
  };

  const loadDepartments = async () => {
    const res = await api.get('/departments');
    setDepartments(res.data.data || []);
  };

  useEffect(() => { load(); }, [q, status, page]);
  useEffect(() => { loadDepartments(); }, []);

  const pages = useMemo(() => Math.ceil(total / limit) || 1, [total, limit]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
        <h1 className="text-xl font-semibold">Employees</h1>
        <div className="flex gap-2">
          <input placeholder="Search" className="border rounded-md px-3 py-2" value={q} onChange={(e)=>setQ(e.target.value)} />
          <select className="border rounded-md px-3 py-2" value={status} onChange={(e)=>setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option>Active</option>
            <option>On Leave</option>
            <option>Resigned</option>
          </select>
        </div>
      </div>

      {(user?.role === 'admin' || user?.role === 'hr') && (
        <div className="card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Add Employee</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input placeholder="Name" className="border rounded-md px-3 py-2" value={form.name} onChange={(e)=>setForm(v=>({...v,name:e.target.value}))} />
            <input placeholder="Email" className="border rounded-md px-3 py-2" value={form.email} onChange={(e)=>setForm(v=>({...v,email:e.target.value}))} />
            <input type="password" placeholder="Password" className="border rounded-md px-3 py-2" value={form.password} onChange={(e)=>setForm(v=>({...v,password:e.target.value}))} />
            <input placeholder="Employee ID" className="border rounded-md px-3 py-2" value={form.employeeId} onChange={(e)=>setForm(v=>({...v,employeeId:e.target.value}))} />
            <select className="border rounded-md px-3 py-2" value={form.department} onChange={(e)=>setForm(v=>({...v,department:e.target.value}))}>
              <option value="">Select Department</option>
              {departments.map((d)=> (<option key={d._id} value={d._id}>{d.name}</option>))}
            </select>
            <input placeholder="Designation" className="border rounded-md px-3 py-2" value={form.designation} onChange={(e)=>setForm(v=>({...v,designation:e.target.value}))} />
            <select className="border rounded-md px-3 py-2" value={form.status} onChange={(e)=>setForm(v=>({...v,status:e.target.value}))}>
              <option>Active</option>
              <option>On Leave</option>
              <option>Resigned</option>
            </select>
            <input placeholder="Avatar URL (optional)" className="border rounded-md px-3 py-2" value={form.avatarUrl} onChange={(e)=>setForm(v=>({...v,avatarUrl:e.target.value}))} />
          </div>
          <div className="flex items-center gap-3">
            <button
              className="btn"
              onClick={async ()=>{
                setCreating(true); setMessage('');
                try {
                  await api.post('/employees', form);
                  setForm({ name:'', email:'', password:'Password@123', employeeId:'', department:'', designation:'', status:'Active', avatarUrl:'' });
                  await load();
                  setMessage('Employee created');
                } catch (e) {
                  setMessage(e?.response?.data?.message || 'Failed creating employee');
                } finally { setCreating(false); }
              }}
              disabled={creating || !form.name || !form.email || !form.password || !form.employeeId}
            >{creating ? 'Creating...' : 'Create Employee'}</button>
            {message && <div className="text-sm text-gray-600">{message}</div>}
          </div>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">EmpID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Department</th>
              <th className="p-3">Designation</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((e)=> (
              <tr key={e._id} className="border-t">
                <td className="p-3">{e.employeeId}</td>
                <td className="p-3">{e.user?.name}</td>
                <td className="p-3">{e.user?.email}</td>
                <td className="p-3">{e.department?.name || '-'}</td>
                <td className="p-3">{e.designation}</td>
                <td className="p-3">{e.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">Total: {total}</div>
        <div className="flex gap-2">
          <button className="btn" onClick={()=>setPage(Math.max(1, page-1))} disabled={page<=1}>Prev</button>
          <div className="px-3 py-2">{page} / {pages}</div>
          <button className="btn" onClick={()=>setPage(Math.min(pages, page+1))} disabled={page>=pages}>Next</button>
        </div>
      </div>
    </div>
  );
}
