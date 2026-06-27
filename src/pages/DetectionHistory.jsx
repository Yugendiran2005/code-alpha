import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Trash2, Eye, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import mockAPI from '../services/mockData';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import Input from '../components/Input';
import { formatDateTime } from '../utils/helpers';
import toast from 'react-hot-toast';

const DetectionHistory = () => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    object: '',
    source: '',
    min_confidence: '',
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    loadHistory();
  }, [page, filters]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        ...filters,
      };
      const data = await mockAPI.getHistory(params);
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
      toast.error('Failed to load detection history');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // In real app, this would trigger API call with search param
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page
  };

  const handleExport = (format) => {
    toast.success(`Exporting as ${format.toUpperCase()}...`);
    // In real app, this would trigger download
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this detection?')) {
      toast.success('Detection deleted successfully');
      loadHistory();
    }
  };

  const clearFilters = () => {
    setFilters({
      object: '',
      source: '',
      min_confidence: '',
    });
    setSearchTerm('');
    setPage(1);
  };

  if (loading && !history) {
    return <LoadingSpinner text="Loading detection history..." />;
  }

  const filteredData = history?.data?.filter(item =>
    item.object_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.video_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Detection History</h1>
          <p className="text-gray-400">View and manage all detection records</p>
        </div>
        
        {/* Export Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            icon={Download}
            onClick={() => handleExport('csv')}
          >
            Export CSV
          </Button>
          <Button
            variant="outline"
            icon={Download}
            onClick={() => handleExport('excel')}
          >
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6 border border-slate-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <Input
            placeholder="Search detections..."
            icon={Search}
            value={searchTerm}
            onChange={handleSearch}
          />

          {/* Object Filter */}
          <select
            value={filters.object}
            onChange={(e) => handleFilterChange('object', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Objects</option>
            <option value="person">Person</option>
            <option value="car">Car</option>
            <option value="bus">Bus</option>
            <option value="truck">Truck</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="bicycle">Bicycle</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
          </select>

          {/* Source Filter */}
          <select
            value={filters.source}
            onChange={(e) => handleFilterChange('source', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Sources</option>
            <option value="webcam">Webcam</option>
            <option value="upload">Upload</option>
          </select>

          {/* Clear Filters */}
          <Button
            variant="ghost"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4 border border-slate-700">
          <p className="text-gray-400 text-sm">Total Records</p>
          <p className="text-2xl font-bold text-white">{history?.total || 0}</p>
        </div>
        <div className="glass rounded-xl p-4 border border-slate-700">
          <p className="text-gray-400 text-sm">Current Page</p>
          <p className="text-2xl font-bold text-white">{page} / {history?.pages || 1}</p>
        </div>
        <div className="glass rounded-xl p-4 border border-slate-700">
          <p className="text-gray-400 text-sm">Showing</p>
          <p className="text-2xl font-bold text-white">{filteredData.length} records</p>
        </div>
        <div className="glass rounded-xl p-4 border border-slate-700">
          <p className="text-gray-400 text-sm">Per Page</p>
          <p className="text-2xl font-bold text-white">{limit}</p>
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl border border-slate-700 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Object</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Confidence</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Tracking ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Source</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Video</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Timestamp</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredData.map((detection) => (
                <tr
                  key={detection.id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-white">#{detection.id}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-600/20 text-purple-400 capitalize">
                      {detection.object_name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                          style={{ width: `${detection.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-white">
                        {(detection.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-slate-700 text-gray-300">
                      #{detection.tracking_id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      detection.source === 'webcam'
                        ? 'bg-blue-600/20 text-blue-400'
                        : 'bg-green-600/20 text-green-400'
                    }`}>
                      {detection.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {detection.video_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {formatDateTime(detection.timestamp)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-gray-400 hover:text-white" />
                      </button>
                      <button
                        onClick={() => handleDelete(detection.id)}
                        className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-slate-800/50 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, history?.total || 0)} of {history?.total || 0} results
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            
            <div className="flex items-center space-x-1">
              {[...Array(Math.min(5, history?.pages || 1))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      page === pageNum
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'hover:bg-slate-700 text-gray-400'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setPage(p => Math.min(history?.pages || 1, p + 1))}
              disabled={page === (history?.pages || 1)}
              className="p-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DetectionHistory;
