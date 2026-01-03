import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiUser,
  FiClock,
  FiCalendar,
  FiDollarSign,
  FiBarChart2,
} from 'react-icons/fi';

const Layout = ({ children, isAdmin = false }) => {
  const location = useLocation();

  const navItems = isAdmin
    ? [
        { path: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
        { path: '/profile', icon: FiUser, label: 'Profile' },
        { path: '/attendance', icon: FiClock, label: 'Attendance' },
        { path: '/leave', icon: FiCalendar, label: 'Leave' },
        { path: '/payroll', icon: FiDollarSign, label: 'Payroll' },
        { path: '/analytics', icon: FiBarChart2, label: 'Analytics' },
      ]
    : [
        { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
        { path: '/profile', icon: FiUser, label: 'Profile' },
        { path: '/attendance', icon: FiClock, label: 'Attendance' },
        { path: '/leave', icon: FiCalendar, label: 'Leave' },
        { path: '/payroll', icon: FiDollarSign, label: 'Payroll' },
      ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-primary-600">Dayflow</h1>
            <p className="text-sm text-gray-500 mt-1">HR Management System</p>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">User</p>
                <p className="text-xs text-gray-500 capitalize">{isAdmin ? 'Admin' : 'Employee'}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

