import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { FiUsers, FiClock, FiCalendar, FiDollarSign, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchEmployees();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/analytics/dashboard');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/admin/employees');
      setEmployees(response.data.employees.slice(0, 5)); // Show latest 5
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isAdmin={true}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your workforce efficiently.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalEmployees || 0}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today's Attendance</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.todayAttendance || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiClock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Leaves</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.pendingLeaves || 0}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Monthly Payroll</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.monthlyPayroll || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiDollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Employees */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Employees</h2>
            <Link
              to="/analytics"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Employee ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Department
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Position
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      No employees found
                    </td>
                  </tr>
                ) : (
                  employees.map((employee) => (
                    <tr key={employee._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{employee.employeeId}</td>
                      <td className="py-3 px-4 text-sm">
                        {employee.personalDetails?.firstName} {employee.personalDetails?.lastName}
                      </td>
                      <td className="py-3 px-4 text-sm">{employee.jobDetails?.department || '-'}</td>
                      <td className="py-3 px-4 text-sm">{employee.jobDetails?.position || '-'}</td>
                      <td className="py-3 px-4">
                        <Link
                          to={`/profile?id=${employee._id}`}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <FiEye className="w-5 h-5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/attendance"
                className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FiClock className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-gray-900">View All Attendance</span>
                </div>
              </Link>
              <Link
                to="/leave"
                className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FiCalendar className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-gray-900">Review Leave Requests</span>
                </div>
              </Link>
              <Link
                to="/payroll"
                className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FiDollarSign className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-gray-900">Manage Payroll</span>
                </div>
              </Link>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">System Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Employees</span>
                <span className="font-semibold text-gray-900">{stats?.totalEmployees || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Today's Present</span>
                <span className="font-semibold text-green-600">{stats?.todayAttendance || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending Approvals</span>
                <span className="font-semibold text-yellow-600">{stats?.pendingLeaves || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

