import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Bell, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded hover:bg-gray-700 text-gray-300 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-white font-semibold text-base hidden sm:block">
          Smart Object Detection
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative p-1.5 rounded hover:bg-gray-700 text-gray-300">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-700"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-gray-200 text-sm hidden sm:block">
              {user?.name || 'User'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded shadow-lg py-1 z-50">
              <button
                onClick={() => { navigate('/profile'); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                <User className="w-4 h-4" />
                Profile
              </button>
              <button
                onClick={() => { navigate('/settings'); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <hr className="border-gray-700 my-1" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
