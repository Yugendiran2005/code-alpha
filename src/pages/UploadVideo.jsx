import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Video, X, Play, Download, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { formatFileSize } from '../utils/helpers';
import mockAPI from '../services/mockData';

const UploadVideo = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedVideos, setProcessedVideos] = useState([]);
  const [confidence, setConfidence] = useState(0.5);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Validate file type
    const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid video file (MP4, AVI, MOV, MKV)');
      return;
    }

    // Validate file size (100MB max)
    if (file.size > 100 * 1024 * 1024) {
      toast.error('File size must be less than 100MB');
      return;
    }

    setSelectedFile(file);
    toast.success('Video selected successfully!');
  };

  const processVideo = async () => {
    if (!selectedFile) return;

    setProcessing(true);
    setProgress(0);

    // Simulate video processing
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 200);

    // Simulate API call
    setTimeout(async () => {
      clearInterval(interval);
      setProgress(100);

      // Add to processed videos
      const videos = await mockAPI.getVideos();
      const newVideo = {
        id: processedVideos.length + 1,
        filename: selectedFile.name,
        duration: 125.5,
        fps: 30,
        resolution: '1920x1080',
        file_size: selectedFile.size,
        status: 'completed',
        detections_count: Math.floor(Math.random() * 100) + 20,
        created_at: new Date().toISOString(),
      };

      setProcessedVideos(prev => [newVideo, ...prev]);
      setProcessing(false);
      setProgress(0);
      setSelectedFile(null);
      toast.success('Video processed successfully!');
    }, 4000);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Upload Video</h1>
        <p className="text-gray-400">Upload and process videos for object detection</p>
      </div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-8 border border-slate-700"
      >
        {!selectedFile ? (
          <div
            className={`relative border-2 border-dashed rounded-xl p-12 transition-all ${
              dragActive
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-slate-600 hover:border-purple-500/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleChange}
              className="hidden"
            />

            <div className="text-center">
              <Upload className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Drop your video here
              </h3>
              <p className="text-gray-400 mb-6">
                or click to browse (MP4, AVI, MOV, MKV - Max 100MB)
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                icon={Video}
              >
                Select Video
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Selected File Info */}
            <div className="flex items-start justify-between p-6 bg-slate-800/50 rounded-xl">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Video className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white mb-1">
                    {selectedFile.name}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type}
                  </p>
                </div>
              </div>
              <button
                onClick={clearSelection}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                disabled={processing}
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Confidence Threshold: {(confidence * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={confidence}
                  onChange={(e) => setConfidence(parseFloat(e.target.value))}
                  className="w-full"
                  disabled={processing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Detection Classes
                </label>
                <div className="text-sm text-gray-300">
                  Person, Car, Bus, Truck, Motorcycle, Bicycle, Dog, Cat
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {processing && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Processing video...</span>
                  <span className="text-sm font-semibold text-white">{progress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={clearSelection}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                onClick={processVideo}
                loading={processing}
                icon={processing ? Loader : Play}
              >
                {processing ? 'Processing...' : 'Process Video'}
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Processed Videos List */}
      {processedVideos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-bold text-white mb-6">Processed Videos</h3>
          
          <div className="space-y-4">
            {processedVideos.map((video) => (
              <div
                key={video.id}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">
                      {video.filename}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{formatFileSize(video.file_size)}</span>
                      <span>•</span>
                      <span>{video.detections_count} detections</span>
                      <span>•</span>
                      <span>{video.fps} FPS</span>
                      <span>•</span>
                      <span>{video.resolution}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Download}
                  >
                    Download
                  </Button>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-600/20 text-green-400">
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6 border border-slate-700"
        >
          <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
            <Video className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Supported Formats
          </h3>
          <p className="text-gray-400 text-sm">
            MP4, AVI, MOV, MKV and other common video formats
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6 border border-slate-700"
        >
          <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            YOLOv8 Detection
          </h3>
          <p className="text-gray-400 text-sm">
            State-of-the-art object detection with high accuracy
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6 border border-slate-700"
        >
          <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
            <Download className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Download Results
          </h3>
          <p className="text-gray-400 text-sm">
            Get processed videos with bounding boxes and labels
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadVideo;
