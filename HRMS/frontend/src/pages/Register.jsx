import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const location = useLocation();
  const [name, setName] = useState('John Candidate');
  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('Password@123');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMsg(''); setLoading(true);
    try {
      await register({ name, email, password });
      setMsg('Registered successfully. Await HR approval.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-gradient-to-b from-blue-50 to-white">
      <form onSubmit={onSubmit} className="card w-full max-w-md p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Create account</h1>
          <p className="text-gray-500">Employee self-registration</p>
        </div>
        {msg && <div className="text-emerald-600 text-sm">{msg}</div>}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="space-y-1">
          <label className="text-sm">Name</label>
          <input className="w-full border rounded-md px-3 py-2" value={name} onChange={(e)=>setName(e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Email</label>
          <input className="w-full border rounded-md px-3 py-2" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Password</label>
          <input type="password" className="w-full border rounded-md px-3 py-2" value={password} onChange={(e)=>setPassword(e.target.value)} />
        </div>
        <button className="btn w-full" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        <div className="text-sm text-center">Have an account? <Link className="text-blue-600" to="/login" state={location.state}>Sign in</Link></div>
      </form>
    </div>
  );
}
