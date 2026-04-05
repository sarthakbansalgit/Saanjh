import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import axios from 'axios';
import API from '../api';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // By default Mongoose schema requires name, age, and gender.
      // Since this is a simple signup, we securely inject placeholders 
      // that the user can update in their dashboard later.
      const payload = {
        name: "New User", 
        age: "18", 
        gender: "Not Specified",
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      };

      const res = await axios.post(`${API}/auth/page1/createuser`, payload);

      if (res.data.success) {
        localStorage.setItem('token', res.data.authToken);
        navigate('/'); // Redirect to home or dashboard after successful simple login
      } else {
        setError(res.data.error || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Server Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#fcf0f4' }}>
      <div 
        className="w-full max-w-md p-8 md:p-10 relative" 
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(168, 60, 116, 0.08)'
        }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#2a1a20]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Create Your Account
          </h1>
          <p className="text-[#88787f]" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem' }}>
            Start your journey to finding love
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-[#2a1a20] font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#b83b7e] focus:ring-1 focus:ring-[#b83b7e] outline-none transition-colors"
              style={{ backgroundColor: '#fafafa', color: '#4a4a4a' }}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[#2a1a20] font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#b83b7e] focus:ring-1 focus:ring-[#b83b7e] outline-none transition-colors"
              style={{ backgroundColor: '#fafafa', color: '#4a4a4a' }}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[#2a1a20] font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#b83b7e] focus:ring-1 focus:ring-[#b83b7e] outline-none transition-colors pr-12"
                style={{ backgroundColor: '#fafafa', color: '#4a4a4a' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[#2a1a20] font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              minLength={8}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#b83b7e] focus:ring-1 focus:ring-[#b83b7e] outline-none transition-colors"
              style={{ backgroundColor: '#fafafa', color: '#4a4a4a' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all hover:opacity-90 mt-2"
            style={{ backgroundColor: '#b83b7e' }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-[#88787f]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold transition-colors" style={{ color: '#b83b7e', textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}