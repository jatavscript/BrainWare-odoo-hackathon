import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { FiClock, FiCheckCircle, FiXCircle, FiMinus } from 'react-icons/fi';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('week'); // 'day' or 'week'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate, viewMode]);

  const fetchAttendance = async () => {
    try {
      const startDate = viewMode === 'week'
        ? format(startOfWeek(selectedDate), 'yyyy-MM-dd')
        : format(selectedDate, 'yyyy-MM-dd');
      
      const endDate = viewMode === 'week'
        ? format(endOfWeek(selectedDate), 'yyyy-MM-dd')
        : format(selectedDate, 'yyyy-MM-dd');

      // Try admin endpoint first, fallback to my
      let url = `/api/attendance?startDate=${startDate}&endDate=${endDate}`;
      try {
        const response = await axios.get(url);
        setAttendance(response.data.attendance);
        setIsAdmin(true);
      } catch {
        url = `/api/attendance/my?startDate=${startDate}&endDate=${endDate}`;
        const response = await axios.get(url);
        setAttendance(response.data.attendance);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <FiCheckCircle className="w-5 h-5 text-green-600" />;
      case 'absent':
        return <FiXCircle className="w-5 h-5 text-red-600" />;
      case 'half-day':
        return <FiMinus className="w-5 h-5 text-yellow-600" />;
      case 'leave':
        return <FiClock className="w-5 h-5 text-blue-600" />;
      default:
        return <FiMinus className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'absent':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'half-day':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'leave':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const weekDays = viewMode === 'week'
    ? eachDayOfInterval({
        start: startOfWeek(selectedDate),
        end: endOfWeek(selectedDate),
      })
    : [selectedDate];

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
    <Layout isAdmin={isAdmin}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
            <p className="text-gray-600 mt-1">
              {isAdmin ? 'View all employee attendance' : 'Track your attendance records'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'day'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'week'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Weekly
            </button>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                if (viewMode === 'week') {
                  newDate.setDate(newDate.getDate() - 7);
                } else {
                  newDate.setDate(newDate.getDate() - 1);
                }
                setSelectedDate(newDate);
              }}
              className="btn-secondary"
            >
              Previous
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {viewMode === 'week'
                ? `Week of ${format(startOfWeek(selectedDate), 'MMM d')} - ${format(endOfWeek(selectedDate), 'MMM d, yyyy')}`
                : format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h2>
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                if (viewMode === 'week') {
                  newDate.setDate(newDate.getDate() + 7);
                } else {
                  newDate.setDate(newDate.getDate() + 1);
                }
                setSelectedDate(newDate);
              }}
              className="btn-secondary"
            >
              Next
            </button>
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {isAdmin && (
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Employee
                    </th>
                  )}
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Check In
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Check Out
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Hours
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                    <td
                      colSpan={isAdmin ? 6 : 5}
                      className="py-8 text-center text-gray-500"
                    >
                      No attendance records found
                    </td>
                  </tr>
                ) : (
                  attendance.map((record) => (
                    <tr
                      key={record._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      {isAdmin && (
                        <td className="py-3 px-4 text-sm">
                          {record.employeeId?.personalDetails?.firstName}{' '}
                          {record.employeeId?.personalDetails?.lastName}
                          <br />
                          <span className="text-xs text-gray-500">
                            {record.employeeId?.employeeId}
                          </span>
                        </td>
                      )}
                      <td className="py-3 px-4 text-sm">
                        {format(new Date(record.date), 'MMM d, yyyy')}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {record.checkIn
                          ? format(new Date(record.checkIn), 'hh:mm a')
                          : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {record.checkOut
                          ? format(new Date(record.checkOut), 'hh:mm a')
                          : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {record.workingHours || 0} hrs
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            record.status
                          )}`}
                        >
                          {getStatusIcon(record.status)}
                          <span className="capitalize">{record.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        {viewMode === 'week' && attendance.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card">
              <p className="text-sm text-gray-600 mb-1">Present Days</p>
              <p className="text-2xl font-bold text-green-600">
                {attendance.filter((a) => a.status === 'present').length}
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600 mb-1">Absent Days</p>
              <p className="text-2xl font-bold text-red-600">
                {attendance.filter((a) => a.status === 'absent').length}
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600 mb-1">Half Days</p>
              <p className="text-2xl font-bold text-yellow-600">
                {attendance.filter((a) => a.status === 'half-day').length}
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600 mb-1">Total Hours</p>
              <p className="text-2xl font-bold text-primary-600">
                {attendance.reduce((sum, a) => sum + (a.workingHours || 0), 0).toFixed(1)} hrs
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Attendance;

