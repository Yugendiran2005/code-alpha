import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const res = await login(form.email, form.password, form.rememberMe);
    setLoading(false);
    if (res.success) { toast.success('Login successful'); navigate('/dashboard'); }
    else toast.error(res.error || 'Login failed');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center">
            <Eye className="w-7 h-7 text-white" />
          </div>
        </div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Welcome back</h2>
          <p className="text-gray-400 text-sm mt-1">Sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Email" type="email" name="email" placeholder="Enter your email" icon={Mail} value={form.email} onChange={handleChange} error={errors.email} />
          <Input label="Password" type="password" name="password" placeholder="Enter your password" icon={Lock} value={form.password} onChange={handleChange} error={errors.password} />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="rememberMe" checked={form.rememberMe} onChange={handleChange} className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" />
              <span className="text-sm text-gray-400">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">Forgot password?</Link>
          </div>
          <Button type="submit" className="w-full" size="lg" loading={loading}>Sign In</Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account? <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
