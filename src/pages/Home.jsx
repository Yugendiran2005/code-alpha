import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Camera, Video, BarChart3, Shield, Zap } from 'lucide-react';
import Button from '../components/Button';

const features = [
  { icon: Camera, title: 'Live Detection', desc: 'Real-time object detection using webcam with YOLOv8' },
  { icon: Video, title: 'Video Processing', desc: 'Upload and process videos with advanced AI algorithms' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Comprehensive analytics and detection insights' },
  { icon: Shield, title: 'Secure & Private', desc: 'End-to-end encryption and secure data storage' },
  { icon: Zap, title: 'High Performance', desc: 'Optimized for speed and accuracy at 30 FPS' },
  { icon: Eye, title: 'AI Powered', desc: 'State-of-the-art deep learning models for detection' },
];

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container max-w-5xl mx-auto px-4 py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Eye className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Smart Object <span className="text-blue-400">Detection</span> & Tracking
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            AI-powered surveillance system with real-time object detection, tracking, and comprehensive analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/register')}>Get Started</Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>Sign In</Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((f, i) => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-500 transition-colors">
              <div className="w-11 h-11 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-t border-gray-700 pt-12">
          <div><h3 className="text-4xl font-bold text-blue-400 mb-2">99.9%</h3><p className="text-gray-400">Detection Accuracy</p></div>
          <div><h3 className="text-4xl font-bold text-blue-400 mb-2">30 FPS</h3><p className="text-gray-400">Real-time Processing</p></div>
          <div><h3 className="text-4xl font-bold text-blue-400 mb-2">8+</h3><p className="text-gray-400">Object Classes</p></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
