import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Eye, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';
import mockAPI from '../services/mockData';
import { CHART_COLORS } from '../utils/constants';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');
  const [objectDistribution, setObjectDistribution] = useState(null);
  const [timeline, setTimeline] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [distribution, timelineData] = await Promise.all([
        mockAPI.getObjectDistribution(period),
        mockAPI.getTimeline(period),
      ]);
      setObjectDistribution(distribution);
      setTimeline(timelineData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading analytics..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">Comprehensive detection analytics and insights</p>
        </div>
        
        {/* Period Selector */}
        <div className="flex space-x-2">
          {['today', 'week', 'month', 'all'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                period === p
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-slate-800 text-gray-400 hover:text-white'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <Eye className="w-10 h-10 text-purple-500" />
            <span className="text-sm text-gray-400 uppercase">{period}</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            {objectDistribution.total.toLocaleString()}
          </h3>
          <p className="text-gray-400">Total Detections</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-10 h-10 text-green-500" />
            <span className="text-sm text-gray-400">MOST DETECTED</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1 capitalize">
            {objectDistribution.data[0]?.object || 'N/A'}
          </h3>
          <p className="text-gray-400">{objectDistribution.data[0]?.count || 0} detections</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-10 h-10 text-blue-500" />
            <span className="text-sm text-gray-400">CATEGORIES</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            {objectDistribution.data.length}
          </h3>
          <p className="text-gray-400">Object Types</p>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Object Distribution Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-6">Object Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={objectDistribution.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="object" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Object Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-6">Distribution by Percentage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={objectDistribution.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ object, percentage }) => `${object}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {objectDistribution.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Timeline Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-xl font-bold text-white mb-6">Detection Timeline</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeline.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Top Detections List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-xl font-bold text-white mb-6">Top Detected Objects</h3>
        <div className="space-y-3">
          {objectDistribution.data.slice(0, 5).map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="text-white font-medium capitalize">{item.object}</p>
                  <p className="text-sm text-gray-400">{item.percentage}% of total</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{item.count}</p>
                <p className="text-sm text-gray-400">detections</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
