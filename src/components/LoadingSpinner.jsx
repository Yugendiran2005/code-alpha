import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = { sm: 'h-8 w-8', md: 'h-12 w-12', lg: 'h-16 w-16' };
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-2 border-gray-600 border-t-blue-500 ${sizes[size]}`} />
      {text && <p className="text-gray-400 mt-4 text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
