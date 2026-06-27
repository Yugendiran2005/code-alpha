import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const e = {};
    if (!form.name) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const res = await register({ name: form.name, email: form.email, password: form.password });
    setLoading(false);
    if (res.success) { toast.success('Account created'); navigate('/dashboard'); }
    else toast.error(res.error || 'Registration failed');
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
          <h2 className="text-2xl font-bold text-white">Create account</h2>
          <p className="text-gray-400 text-sm mt-1">Get started with Object Detection</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Full Name" name="name" placeholder="Enter your name" icon={User} value={form.name} onChange={handleChange} error={errors.name} />
          <Input label="Email" type="email" name="email" placeholder="Enter your email" icon={Mail} value={form.email} onChange={handleChange} error={errors.email} />
          <Input label="Password" type="password" name="password" placeholder="Create a password" icon={Lock} value={form.password} onChange={handleChange} error={errors.password} />
          <Input label="Confirm Password" type="password" name="confirmPassword" placeholder="Confirm your password" icon={Lock} value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
          <Button type="submit" className="w-full" size="lg" loading={loading}>Create Account</Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
