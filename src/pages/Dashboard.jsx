import React, { useEffect, useState } from 'react';
import { Eye, Video, Activity, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import mockAPI from '../services/mockData';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [s, d] = await Promise.all([
        mockAPI.getStatistics(),
        mockAPI.getDashboard(),
      ]);
      setStats(s);
      setDashboard(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading..." />;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">Dashboard</h2>
        <p className="text-sm text-gray-400 mt-1">Overview of your detection system</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Detections" value={stats.total_detections.toLocaleString()} icon={Eye} trend="up" trendValue="+12.5%" />
        <StatCard title="Videos Processed" value={stats.videos_processed} icon={Video} trend="up" trendValue="+8.2%" />
        <StatCard title="Active Sessions" value={stats.active_sessions} icon={Activity} />
        <StatCard title="Today's Detections" value={stats.today_count} icon={TrendingUp} trend="up" trendValue="+24.3%" />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent detections */}
        <div className="card p-5">
          <h3 className="text-white font-semibold mb-4">Recent Detections</h3>
          <div className="space-y-2">
            {dashboard.recent_detections.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 bg-gray-800 rounded">
                <div>
                  <p className="text-white text-sm capitalize">{item.object}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
                <span className="text-xs font-medium text-green-400">
                  {(item.confidence * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System status */}
        <div className="card p-5">
          <h3 className="text-white font-semibold mb-4">System Status</h3>
          <div className="space-y-3">
            <Row label="Model" value="YOLOv8 Active" green />
            <Row label="Speed" value="30 FPS" />
            <Row label="Threshold" value="0.5" />
            <Row label="Today's Videos" value={dashboard.today.videos} />
            <Row label="Weekly Avg" value={`${dashboard.week.daily_average}/day`} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* Simple row for status display */
const Row = ({ label, value, green }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
    <span className="text-sm text-gray-400">{label}</span>
    <span className={`text-sm font-medium ${green ? 'text-green-400' : 'text-white'}`}>
      {value}
    </span>
  </div>
);

export default Dashboard;
