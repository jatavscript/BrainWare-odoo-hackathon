import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { FiBarChart2, FiTrendingUp, FiUsers, FiClock } from 'react-icons/fi';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('attendance');
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/analytics/dashboard');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportData = async () => {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      const endDate = new Date();

      const response = await axios.get(
        `/api/analytics/reports?type=${reportType}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      setReportData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  useEffect(() => {
    if (reportType) {
      fetchReportData();
    }
  }, [reportType]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  // Prepare chart data
  const attendanceChartData = reportData.slice(0, 7).map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    present: item.status === 'present' ? 1 : 0,
    absent: item.status === 'absent' ? 1 : 0,
  }));

  return (
    <Layout isAdmin={true}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">Insights and analytics for your workforce</p>
        </div>

        {/* Key Metrics */}
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
                <p className="text-3xl font-bold text-green-600">{stats?.todayAttendance || 0}</p>
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
                <p className="text-3xl font-bold text-yellow-600">{stats?.pendingLeaves || 0}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FiBarChart2 className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Monthly Payroll</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.monthlyPayroll || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Reports</h2>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="input-field"
            >
              <option value="attendance">Attendance Report</option>
              <option value="payroll">Payroll Report</option>
            </select>
          </div>

          {reportType === 'attendance' && attendanceChartData.length > 0 && (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#10b981" name="Present" />
                  <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {reportType === 'payroll' && (
            <div className="text-center py-12">
              <p className="text-gray-500">Payroll reports coming soon</p>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Records</span>
                <span className="font-semibold">{reportData.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Present Days</span>
                <span className="font-semibold text-green-600">
                  {reportData.filter((r) => r.status === 'present').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Absent Days</span>
                <span className="font-semibold text-red-600">
                  {reportData.filter((r) => r.status === 'absent').length}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Employees</span>
                <span className="font-semibold">{stats?.totalEmployees || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Attendance Rate</span>
                <span className="font-semibold text-primary-600">
                  {stats?.totalEmployees
                    ? Math.round((stats.todayAttendance / stats.totalEmployees) * 100)
                    : 0}
                  %
                </span>
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

export default Analytics;

