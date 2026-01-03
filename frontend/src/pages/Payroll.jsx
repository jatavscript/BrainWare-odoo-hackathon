import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { FiDollarSign, FiDownload } from 'react-icons/fi';
import { format } from 'date-fns';

const Payroll = () => {
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchPayroll();
  }, [selectedMonth, selectedYear]);

  const fetchPayroll = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedMonth) params.append('month', selectedMonth);
      if (selectedYear) params.append('year', selectedYear);

      // Try admin endpoint first
      try {
        const response = await axios.get(`/api/payroll?${params.toString()}`);
        setPayroll(response.data.payroll);
        setIsAdmin(true);
      } catch {
        const response = await axios.get(`/api/payroll/my?${params.toString()}`);
        setPayroll(response.data.payroll);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error fetching payroll:', error);
    } finally {
      setLoading(false);
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
            <h1 className="text-3xl font-bold text-gray-900">Payroll</h1>
            <p className="text-gray-600 mt-1">
              {isAdmin ? 'View and manage employee payroll' : 'View your salary details'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="input-field"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {format(new Date(2000, month - 1), 'MMMM')}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="input-field"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {payroll.length === 0 ? (
          <div className="card text-center py-12">
            <FiDollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No payroll records found</p>
            {isAdmin && (
              <p className="text-sm text-gray-400 mt-2">
                Generate payroll for employees to view their records
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {payroll.map((record) => (
              <div key={record._id} className="card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {isAdmin
                        ? `${record.employeeId?.personalDetails?.firstName} ${record.employeeId?.personalDetails?.lastName}`
                        : 'Salary Slip'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {format(new Date(record.year, record.month - 1), 'MMMM yyyy')}
                    </p>
                  </div>
                  <button className="btn-secondary flex items-center space-x-2">
                    <FiDownload className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Earnings</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Base Salary</span>
                        <span className="font-medium">
                          ${record.baseSalary?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Allowances</span>
                        <span className="font-medium">
                          ${record.allowances?.toLocaleString() || 0}
                        </span>
                      </div>
                      {record.bonus > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Bonus</span>
                          <span className="font-medium">
                            ${record.bonus?.toLocaleString() || 0}
                          </span>
                        </div>
                      )}
                      {record.overtime > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Overtime</span>
                          <span className="font-medium">
                            ${record.overtime?.toLocaleString() || 0}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Deductions</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Deductions</span>
                        <span className="font-medium text-red-600">
                          -${record.deductions?.toLocaleString() || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Attendance</p>
                      <p className="text-xs text-gray-500">
                        {record.presentDays} present / {record.totalDays} total days
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Net Salary</p>
                      <p className="text-2xl font-bold text-primary-600">
                        ${record.netSalary?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {record.status && (
                  <div className="mt-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        record.status === 'paid'
                          ? 'bg-green-50 text-green-700'
                          : record.status === 'processed'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-yellow-50 text-yellow-700'
                      }`}
                    >
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Payroll;

