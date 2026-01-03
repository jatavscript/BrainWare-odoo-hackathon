import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { FiClock, FiCalendar, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import { format } from 'date-fns';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkInStatus, setCheckInStatus] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    checkTodayAttendance();
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

  const checkTodayAttendance = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const response = await axios.get(`/api/attendance/my?startDate=${today}&endDate=${today}`);
      if (response.data.attendance && response.data.attendance.length > 0) {
        setCheckInStatus(response.data.attendance[0]);
      }
    } catch (error) {
      console.error('Error checking attendance:', error);
    }
  };

  const handleCheckIn = async () => {
    try {
      await axios.post('/api/attendance/checkin');
      checkTodayAttendance();
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      await axios.post('/api/attendance/checkout');
      checkTodayAttendance();
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Check-out failed');
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
    <Layout isAdmin={false}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your overview.</p>
        </div>

        {/* Check In/Out Card */}
        <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Today's Attendance</h3>
              {checkInStatus?.checkIn ? (
                <div className="space-y-1">
                  <p className="text-sm opacity-90">
                    Check-in: {format(new Date(checkInStatus.checkIn), 'hh:mm a')}
                  </p>
                  {checkInStatus.checkOut ? (
                    <p className="text-sm opacity-90">
                      Check-out: {format(new Date(checkInStatus.checkOut), 'hh:mm a')}
                    </p>
                  ) : (
                    <p className="text-sm opacity-90">Status: Working</p>
                  )}
                </div>
              ) : (
                <p className="text-sm opacity-90">Not checked in yet</p>
              )}
            </div>
            <div className="flex space-x-3">
              {!checkInStatus?.checkIn ? (
                <button
                  onClick={handleCheckIn}
                  className="bg-white text-primary-600 px-6 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors"
                >
                  Check In
                </button>
              ) : !checkInStatus?.checkOut ? (
                <button
                  onClick={handleCheckOut}
                  className="bg-white text-primary-600 px-6 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors"
                >
                  Check Out
                </button>
              ) : (
                <div className="flex items-center space-x-2 text-white">
                  <FiCheckCircle className="w-5 h-5" />
                  <span>Completed</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Present Days (This Month)</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.presentDays || 0}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <FiClock className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Leave Requests</p>
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
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.monthlyPayroll ? 'Available' : 'N/A'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiDollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/attendance"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <FiClock className="w-6 h-6 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900">View Attendance</h3>
              <p className="text-sm text-gray-600 mt-1">Check your attendance records</p>
            </a>
            <a
              href="/leave"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <FiCalendar className="w-6 h-6 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Apply for Leave</h3>
              <p className="text-sm text-gray-600 mt-1">Request time off</p>
            </a>
            <a
              href="/payroll"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <FiDollarSign className="w-6 h-6 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900">View Payroll</h3>
              <p className="text-sm text-gray-600 mt-1">Check salary details</p>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeDashboard;

