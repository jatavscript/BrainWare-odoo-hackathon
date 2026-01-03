import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { BarChart3, Users, CalendarDays, Bell, Home, LogOut, ScrollText, User, Settings as SettingsIcon } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();

  const nav = [
    { to: '/', label: 'Dashboard', icon: Home },
    { to: '/employees', label: 'Employees', icon: Users, roles: ['admin', 'hr'] },
    { to: '/attendance', label: 'Attendance', icon: CalendarDays },
    { to: '/leaves', label: 'Leaves', icon: ScrollText },
    { to: '/announcements', label: 'Announcements', icon: Bell },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen grid grid-cols-12 bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      <aside className="col-span-12 md:col-span-3 lg:col-span-2 p-4 space-y-4 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-blue-600" />
          <span className="font-semibold">HRMS</span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Signed in as<br/><span className="font-medium text-gray-800 dark:text-gray-200">{user?.name}</span> — {user?.role}</div>
        <nav className="space-y-1">
          {nav.map((item) => {
            if (item.roles && !item.roles.includes(user?.role)) return null;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-blue-50 dark:hover:bg-gray-800'}`}
              >
                <Icon size={18} /> {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="grid grid-cols-1">
          <button className="btn w-full" onClick={logout}><LogOut size={18}/> Logout</button>
        </div>
      </aside>
      <main className="col-span-12 md:col-span-9 lg:col-span-10 p-6 space-y-6">
        <Outlet />
      </main>
    </div>
  );
}
