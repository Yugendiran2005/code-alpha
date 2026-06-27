import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Camera, Upload, History, BarChart3, 
  User, Settings, Eye, X 
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Live Detection', path: '/live-detection', icon: Camera },
  { name: 'Upload Video', path: '/upload-video', icon: Upload },
  { name: 'History', path: '/detection-history', icon: History },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const closeOnMobile = () => {
    if (window.innerWidth < 1024) toggleSidebar();
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-800 border-r border-gray-700 
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">Detection System</h2>
              <p className="text-gray-400 text-xs">v1.0.0</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="px-3 py-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeOnMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">CodeAlpha Internship</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
