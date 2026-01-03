import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { format } from 'date-fns';
import { FiCalendar, FiCheck, FiX, FiClock } from 'react-icons/fi';

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'paid',
    startDate: '',
    endDate: '',
    remarks: '',
  });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      // Try admin endpoint first
      try {
        const response = await axios.get('/api/leave');
        setLeaves(response.data.leaves);
        setIsAdmin(true);
      } catch {
        const response = await axios.get('/api/leave/my');
        setLeaves(response.data.leaves);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/leave', formData);
      setShowModal(false);
      setFormData({
        leaveType: 'paid',
        startDate: '',
        endDate: '',
        remarks: '',
      });
      fetchLeaves();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to apply for leave');
    }
  };

  const handleApprove = async (id, comments = '') => {
    try {
      await axios.put(`/api/leave/${id}/approve`, { adminComments: comments });
      fetchLeaves();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to approve leave');
    }
  };

  const handleReject = async (id, comments = '') => {
    try {
      await axios.put(`/api/leave/${id}/reject`, { adminComments: comments });
      fetchLeaves();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reject leave');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
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
    <Layout isAdmin={isAdmin}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
            <p className="text-gray-600 mt-1">
              {isAdmin ? 'Review and manage leave requests' : 'Apply for leave and track requests'}
            </p>
          </div>
          {!isAdmin && (
            <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-2">
              <FiCalendar className="w-4 h-4" />
              <span>Apply for Leave</span>
            </button>
          )}
        </div>

        {/* Leave Requests Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {isAdmin && (
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Employee
                    </th>
                  )}
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Leave Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Start Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    End Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Days
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Remarks
                  </th>
                  {isAdmin && (
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {leaves.length === 0 ? (
                  <tr>
                    <td
                      colSpan={isAdmin ? 8 : 7}
                      className="py-8 text-center text-gray-500"
                    >
                      No leave requests found
                    </td>
                  </tr>
                ) : (
                  leaves.map((leave) => (
                    <tr
                      key={leave._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      {isAdmin && (
                        <td className="py-3 px-4 text-sm">
                          {leave.employeeId?.personalDetails?.firstName}{' '}
                          {leave.employeeId?.personalDetails?.lastName}
                          <br />
                          <span className="text-xs text-gray-500">
                            {leave.employeeId?.employeeId}
                          </span>
                        </td>
                      )}
                      <td className="py-3 px-4 text-sm capitalize">{leave.leaveType}</td>
                      <td className="py-3 px-4 text-sm">
                        {format(new Date(leave.startDate), 'MMM d, yyyy')}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {format(new Date(leave.endDate), 'MMM d, yyyy')}
                      </td>
                      <td className="py-3 px-4 text-sm">{leave.days} days</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            leave.status
                          )}`}
                        >
                          <span className="capitalize">{leave.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {leave.remarks || '-'}
                      </td>
                      {isAdmin && leave.status === 'pending' && (
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleApprove(leave._id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <FiCheck className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleReject(leave._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <FiX className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Apply Leave Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Apply for Leave</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leave Type
                  </label>
                  <select
                    value={formData.leaveType}
                    onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="paid">Paid Leave</option>
                    <option value="sick">Sick Leave</option>
                    <option value="unpaid">Unpaid Leave</option>
                    <option value="vacation">Vacation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks
                  </label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    className="input-field"
                    rows="3"
                    placeholder="Optional remarks..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button type="submit" className="flex-1 btn-primary">
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Leave;

