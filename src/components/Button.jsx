import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', disabled, loading, icon: Icon, className = '', ...props }) => {
  
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-500 focus:ring-gray-400',
    outline: 'border border-gray-500 text-gray-300 hover:bg-gray-700 focus:ring-blue-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'text-gray-400 hover:text-white hover:bg-gray-700',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
