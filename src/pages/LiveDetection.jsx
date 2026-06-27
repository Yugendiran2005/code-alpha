import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Play, Pause, StopCircle, Settings as SettingsIcon, Download, Maximize } from 'lucide-react';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { DETECTION_CLASSES } from '../utils/constants';

const LiveDetection = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [fps, setFps] = useState(0);
  const [detections, setDetections] = useState([]);
  const [stats, setStats] = useState({
    totalObjects: 0,
    person: 0,
    car: 0,
    other: 0,
  });
  const [confidence, setConfidence] = useState(0.5);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Simulate webcam detection
  useEffect(() => {
    if (isDetecting && !isPaused) {
      simulateDetection();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDetecting, isPaused]);

  const simulateDetection = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const frameRate = 30;
    let lastTime = Date.now();
    let frameCount = 0;

    const animate = () => {
      if (!isDetecting || isPaused) return;

      // Draw background (simulating webcam feed)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add grid pattern
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Simulate random detections
      if (Math.random() > 0.7) {
        const newDetections = [];
        const numDetections = Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < numDetections; i++) {
          const detection = {
            class: DETECTION_CLASSES[Math.floor(Math.random() * DETECTION_CLASSES.length)],
            confidence: confidence + Math.random() * (1 - confidence),
            x: Math.random() * (canvas.width - 200),
            y: Math.random() * (canvas.height - 200),
            width: 100 + Math.random() * 150,
            height: 100 + Math.random() * 150,
            trackId: Math.floor(Math.random() * 100),
          };
          newDetections.push(detection);
        }

        setDetections(newDetections);

        // Update stats
        setStats(prev => ({
          totalObjects: prev.totalObjects + numDetections,
          person: prev.person + newDetections.filter(d => d.class.name === 'Person').length,
          car: prev.car + newDetections.filter(d => d.class.name === 'Car').length,
          other: prev.other + newDetections.filter(d => !['Person', 'Car'].includes(d.class.name)).length,
        }));
      }

      // Draw detections
      detections.forEach(det => {
        // Draw bounding box
        ctx.strokeStyle = det.class.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(det.x, det.y, det.width, det.height);

        // Draw label background
        const label = `${det.class.name} ${(det.confidence * 100).toFixed(0)}% #${det.trackId}`;
        ctx.font = 'bold 14px Arial';
        const textWidth = ctx.measureText(label).width;
        
        ctx.fillStyle = det.class.color;
        ctx.fillRect(det.x, det.y - 25, textWidth + 16, 25);

        // Draw label text
        ctx.fillStyle = '#ffffff';
        ctx.fillText(label, det.x + 8, det.y - 8);
      });

      // Calculate FPS
      frameCount++;
      const now = Date.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const startDetection = () => {
    setIsDetecting(true);
    setIsPaused(false);
    setStats({ totalObjects: 0, person: 0, car: 0, other: 0 });
    toast.success('Detection started!');
  };

  const pauseDetection = () => {
    setIsPaused(!isPaused);
    toast.success(isPaused ? 'Detection resumed' : 'Detection paused');
  };

  const stopDetection = () => {
    setIsDetecting(false);
    setIsPaused(false);
    setDetections([]);
    setFps(0);
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    toast.success('Detection stopped');
  };

  const takeScreenshot = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `detection_${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      toast.success('Screenshot saved!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Live Detection</h1>
          <p className="text-gray-400">Real-time object detection using webcam (Simulated)</p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {!isDetecting ? (
            <Button icon={Play} onClick={startDetection}>
              Start Detection
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                icon={isPaused ? Play : Pause}
                onClick={pauseDetection}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                variant="danger"
                icon={StopCircle}
                onClick={stopDetection}
              >
                Stop
              </Button>
              <Button
                variant="outline"
                icon={Download}
                onClick={takeScreenshot}
              >
                Screenshot
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Video Feed */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl border border-slate-700 overflow-hidden"
          >
            {/* Video Header */}
            <div className="bg-slate-800/50 px-6 py-4 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isDetecting && !isPaused ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
                  <span className="text-white font-medium">
                    {isDetecting ? (isPaused ? 'Paused' : 'Live') : 'Offline'}
                  </span>
                </div>
                {isDetecting && (
                  <div className="text-sm text-gray-400">
                    {fps} FPS
                  </div>
                )}
              </div>
              
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <Maximize className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Canvas */}
            <div className="relative bg-slate-900 aspect-video flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={960}
                height={540}
                className="w-full h-full"
              />
              {!isDetecting && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50">
                  <Camera className="w-16 h-16 text-gray-600 mb-4" />
                  <p className="text-gray-400 text-lg">Click "Start Detection" to begin</p>
                  <p className="text-gray-500 text-sm mt-2">Webcam simulation with YOLOv8</p>
                </div>
              )}
            </div>

            {/* Video Footer - Detection Info */}
            {isDetecting && (
              <div className="bg-slate-800/50 px-6 py-4 border-t border-slate-700">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Current Detections</p>
                    <p className="text-xl font-bold text-white">{detections.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Confidence</p>
                    <p className="text-xl font-bold text-white">{(confidence * 100).toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Model</p>
                    <p className="text-sm font-medium text-white">YOLOv8n</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Resolution</p>
                    <p className="text-sm font-medium text-white">960×540</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar - Stats & Controls */}
        <div className="space-y-6">
          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2" />
              Settings
            </h3>
            
            <div className="space-y-4">
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
                  disabled={isDetecting}
                />
              </div>
            </div>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-lg font-bold text-white mb-4">Statistics</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span className="text-gray-400">Total Objects</span>
                <span className="text-xl font-bold text-white">{stats.totalObjects}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span className="text-gray-400">Persons</span>
                <span className="text-xl font-bold text-purple-400">{stats.person}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span className="text-gray-400">Vehicles</span>
                <span className="text-xl font-bold text-blue-400">{stats.car}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span className="text-gray-400">Others</span>
                <span className="text-xl font-bold text-green-400">{stats.other}</span>
              </div>
            </div>
          </motion.div>

          {/* Current Detections */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-lg font-bold text-white mb-4">Current Frame</h3>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {detections.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No detections</p>
              ) : (
                detections.map((det, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: det.class.color }}
                      ></div>
                      <span className="text-sm text-white">{det.class.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">#{det.trackId}</div>
                      <div className="text-xs text-green-400">
                        {(det.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LiveDetection;
