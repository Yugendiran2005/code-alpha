import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      {/* Sidebar - overlay on mobile, inline on desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <Sidebar isOpen={true} toggleSidebar={() => {}} />
      </div>
      
      {/* Mobile sidebar (overlay) */}
      <div className="lg:hidden">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto bg-gray-900">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
