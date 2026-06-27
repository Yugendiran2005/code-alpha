import React from 'react';
import { cn } from '../utils/cn';

const Input = ({ label, error, icon: Icon, className, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
      )}
      <input
        className={cn(
          'w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm',
          Icon && 'pl-10',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
);

export default Input;
