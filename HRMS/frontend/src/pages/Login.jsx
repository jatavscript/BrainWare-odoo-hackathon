import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Eye, EyeOff, ShieldCheck, BarChart3, Users } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('admin@hrms.com');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-900">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Login Form */}
        <form onSubmit={onSubmit} className="card w-full p-8 space-y-6 shadow-lg">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Sign in to your HRMS</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Secure HR portal — access your employee dashboard</p>
          </div>

          {error && (
            <div role="alert" className="text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                className="w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                aria-label={showPwd ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 px-3 grid place-items-center text-gray-500 hover:text-gray-700"
                onClick={()=>setShowPwd(v=>!v)}
              >
                {showPwd ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>

          <button
            className="btn w-full disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <div className="text-sm text-center">
            No account? <Link className="text-blue-600 hover:underline" to="/register" state={location.state}>Register</Link>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <ShieldCheck size={16} className="text-blue-600" /> Employee / Admin Access
          </div>
        </form>

        {/* Right: Branding / Info */}
        <div className="card w-full p-8 space-y-6 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-blue-600" />
              <h2 className="text-xl font-semibold">HR Management System</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage employees, attendance, and leave in one place.</p>
          </div>

          <div className="grid gap-3 text-sm">
            <div className="p-3 rounded-md bg-blue-50 border border-blue-100 text-gray-900 dark:text-gray-900">
              <div className="flex items-center gap-2 font-medium text-blue-700"><Users size={16}/> Admin</div>
              <div>Email: <code className="text-gray-900">admin@hrms.com</code></div>
              <div>Password: <code className="text-gray-900">Admin@123</code></div>
            </div>
            <div className="p-3 rounded-md bg-indigo-50 border border-indigo-100 text-gray-900 dark:text-gray-900">
              <div className="flex items-center gap-2 font-medium text-indigo-700"><Users size={16}/> HR</div>
              <div>Email: <code className="text-gray-900">hr@hrms.com</code></div>
              <div>Password: <code className="text-gray-900">Hr@12345</code></div>
            </div>
            <div className="p-3 rounded-md bg-emerald-50 border border-emerald-100 text-gray-900 dark:text-gray-900">
              <div className="flex items-center gap-2 font-medium text-emerald-700"><Users size={16}/> Employee</div>
              <div>Email: <code className="text-gray-900">jane@hrms.com</code></div>
              <div>Password: <code className="text-gray-900">Password@123</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
