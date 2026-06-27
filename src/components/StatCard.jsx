import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => {
  return (
    <div className="card p-5 hover:border-gray-500 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          {trend && (
            <div className="flex items-center gap-1.5 mt-2">
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {trendValue}
              </span>
              <span className="text-xs text-gray-500">vs last week</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-gray-700 rounded-lg">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
