import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';

const Profile = () => {
  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get('id');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [employeeId, isAdmin]);

  const fetchProfile = async () => {
    try {
      const url = employeeId
        ? `/api/profile/${employeeId}`
        : '/api/profile';
      const response = await axios.get(url);
      setProfile(response.data.user);
      setFormData(response.data.user);
      setIsAdmin(response.data.user?.role === 'admin' || response.data.user?.role === 'hr');
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = employeeId && isAdmin
        ? `/api/profile/${employeeId}`
        : '/api/profile';
      const response = await axios.put(url, formData);
      setProfile(response.data.user);
      setEditing(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Update failed');
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

  if (!profile) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Profile not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isAdmin={isAdmin}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-1">Manage your profile information</p>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <FiEdit2 className="w-4 h-4" />
              <span>Edit</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="card text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              {profile.personalDetails?.profilePicture ? (
                <img
                  src={profile.personalDetails.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-primary-600">
                  {profile.personalDetails?.firstName?.[0] || profile.email[0].toUpperCase()}
                </span>
              )}
            </div>
            {editing && (
              <input
                type="text"
                name="personalDetails.profilePicture"
                value={formData.personalDetails?.profilePicture || ''}
                onChange={handleChange}
                className="input-field"
                placeholder="Profile picture URL"
              />
            )}
          </div>

          {/* Personal Details */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="personalDetails.firstName"
                  value={formData.personalDetails?.firstName || ''}
                  onChange={handleChange}
                  disabled={!editing || (!isAdmin && !employeeId)}
                  className="input-field disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="personalDetails.lastName"
                  value={formData.personalDetails?.lastName || ''}
                  onChange={handleChange}
                  disabled={!editing || (!isAdmin && !employeeId)}
                  className="input-field disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="input-field disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  name="personalDetails.phone"
                  value={formData.personalDetails?.phone || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  className="input-field disabled:bg-gray-100"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  name="personalDetails.address"
                  value={formData.personalDetails?.address || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  className="input-field disabled:bg-gray-100"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Job Details */}
          {isAdmin && (
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    name="jobDetails.department"
                    value={formData.jobDetails?.department || ''}
                    onChange={handleChange}
                    disabled={!editing}
                    className="input-field disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    name="jobDetails.position"
                    value={formData.jobDetails?.position || ''}
                    onChange={handleChange}
                    disabled={!editing}
                    className="input-field disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={profile.employeeId}
                    disabled
                    className="input-field disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type
                  </label>
                  <select
                    name="jobDetails.employmentType"
                    value={formData.jobDetails?.employmentType || 'full-time'}
                    onChange={handleChange}
                    disabled={!editing}
                    className="input-field disabled:bg-gray-100"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Salary Details */}
          {isAdmin && (
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Salary Structure</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Salary
                  </label>
                  <input
                    type="number"
                    name="salary.baseSalary"
                    value={formData.salary?.baseSalary || 0}
                    onChange={handleChange}
                    disabled={!editing}
                    className="input-field disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allowances
                  </label>
                  <input
                    type="number"
                    name="salary.allowances"
                    value={formData.salary?.allowances || 0}
                    onChange={handleChange}
                    disabled={!editing}
                    className="input-field disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deductions
                  </label>
                  <input
                    type="number"
                    name="salary.deductions"
                    value={formData.salary?.deductions || 0}
                    onChange={handleChange}
                    disabled={!editing}
                    className="input-field disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          )}

          {editing && (
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary flex items-center space-x-2">
                <FiSave className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setFormData(profile);
                }}
                className="btn-secondary flex items-center space-x-2"
              >
                <FiX className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default Profile;

