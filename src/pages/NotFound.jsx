import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gradient mb-4">404</h1>
        <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          icon={Home}
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
