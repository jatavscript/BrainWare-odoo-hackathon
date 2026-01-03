import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function load() {
      const me = await api.get('/auth/me');
      setProfile(me.data.user);
    }
    load();
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Profile</h1>
      <div className="card p-4 space-y-2 max-w-xl">
        <div><span className="text-gray-500">Name:</span> <span className="font-medium">{profile.name}</span></div>
        <div><span className="text-gray-500">Email:</span> <span className="font-medium">{profile.email}</span></div>
        <div><span className="text-gray-500">Role:</span> <span className="font-medium">{profile.role}</span></div>
      </div>
    </div>
  );
}
