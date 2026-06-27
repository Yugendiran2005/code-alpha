import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">Profile</h2>
        <p className="text-sm text-gray-400 mt-1">Your account information</p>
      </div>
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{user?.name || 'User'}</h3>
            <p className="text-gray-400 text-sm">{user?.email || 'unknown'}</p>
            <span className="inline-block mt-1 px-3 py-0.5 bg-blue-600/20 text-blue-300 rounded-full text-xs font-medium">
              {user?.role || 'user'}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Name</label>
            <div className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm">{user?.name || '—'}</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
            <div className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm">{user?.email || '—'}</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Role</label>
            <div className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm">{user?.role || 'user'}</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Member since</label>
            <div className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm">January 2024</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
