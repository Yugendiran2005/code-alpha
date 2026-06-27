import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
    <div className="w-full">
      <Outlet />
    </div>
  </div>
);

export default AuthLayout;
