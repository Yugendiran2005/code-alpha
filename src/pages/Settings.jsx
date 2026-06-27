import React, { useState } from 'react';
import { Bell, Globe, Camera, Save } from 'lucide-react';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const Toggle = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
    <div className="w-10 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4" />
  </label>
);

const Settings = () => {
  const [settings, setSettings] = useState({
    confidence_threshold: 0.5, theme: 'dark', notifications: true,
    language: 'en', default_camera: 0, auto_save: true,
    show_tracking_ids: true, show_confidence: true, enable_sound: false,
  });
  const [dirty, setDirty] = useState(false);

  const handle = (k, v) => { setSettings(s => ({ ...s, [k]: v })); setDirty(true); };
  const save = () => { toast.success('Settings saved'); setDirty(false); };
  const reset = () => {
    setSettings({ confidence_threshold: 0.5, theme: 'dark', notifications: true, language: 'en', default_camera: 0, auto_save: true, show_tracking_ids: true, show_confidence: true, enable_sound: false });
    setDirty(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <p className="text-sm text-gray-400 mt-1">Configure your preferences</p>
        </div>
        {dirty && (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={reset}>Reset</Button>
            <Button icon={Save} onClick={save}>Save</Button>
          </div>
        )}
      </div>

      {/* Detection */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-4">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Camera className="w-5 h-5 text-blue-400" />Detection</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-gray-300">Confidence Threshold</label>
              <span className="text-sm text-white font-medium">{(settings.confidence_threshold * 100).toFixed(0)}%</span>
            </div>
            <input type="range" min="0" max="1" step="0.05" value={settings.confidence_threshold} onChange={e => handle('confidence_threshold', parseFloat(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Default Camera</label>
            <select value={settings.default_camera} onChange={e => handle('default_camera', parseInt(e.target.value))} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value={0}>Camera 0 (Default)</option><option value={1}>Camera 1</option><option value={2}>Camera 2</option>
            </select>
          </div>
          <Row label="Auto-save Detections" desc="Automatically save results" checked={settings.auto_save} onChange={e => handle('auto_save', e.target.checked)} />
          <Row label="Show Tracking IDs" desc="Display tracking IDs on objects" checked={settings.show_tracking_ids} onChange={e => handle('show_tracking_ids', e.target.checked)} />
          <Row label="Show Confidence" desc="Display confidence percentages" checked={settings.show_confidence} onChange={e => handle('show_confidence', e.target.checked)} />
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-4">
        <h3 className="text-white font-semibold mb-4">Appearance</h3>
        <div className="flex gap-3">
          <button onClick={() => handle('theme', 'dark')} className={`flex-1 p-3 rounded-lg border text-center text-sm ${settings.theme === 'dark' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-gray-600 text-gray-400 hover:border-gray-500'}`}>🌙 Dark</button>
          <button onClick={() => handle('theme', 'light')} className={`flex-1 p-3 rounded-lg border text-center text-sm ${settings.theme === 'light' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-gray-600 text-gray-400 hover:border-gray-500'}`}>☀️ Light</button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-4">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-blue-400" />Notifications</h3>
        <Row label="Enable Notifications" desc="Receive detection alerts" checked={settings.notifications} onChange={e => handle('notifications', e.target.checked)} />
        <Row label="Sound Alerts" desc="Play sound on detection" checked={settings.enable_sound} onChange={e => handle('enable_sound', e.target.checked)} />
      </div>

      {/* General */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-4">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-blue-400" />General</h3>
        <label className="block text-sm text-gray-300 mb-1">Language</label>
        <select value={settings.language} onChange={e => handle('language', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="en">English</option><option value="es">Español</option><option value="fr">Français</option><option value="de">Deutsch</option><option value="zh">中文</option>
        </select>
      </div>

      {dirty && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button size="lg" icon={Save} onClick={save}>Save Changes</Button>
        </div>
      )}
    </div>
  );
};

const Row = ({ label, desc, checked, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
    <div>
      <p className="text-sm text-white">{label}</p>
      {desc && <p className="text-xs text-gray-500">{desc}</p>}
    </div>
    <Toggle checked={checked} onChange={onChange} />
  </div>
);

export default Settings;
