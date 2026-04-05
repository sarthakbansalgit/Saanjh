import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Heart, Eye, EyeOff, ArrowRight } from 'lucide-react';
import axios from 'axios';
import API from '../api';
import './Signup.css';

const registerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState('');

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    // Preserve the data if passed from previous verification step
    const verifiedEmail = sessionStorage.getItem('verifiedEmail');
    if (verifiedEmail) {
      setValue('email', verifiedEmail);
    }
    const tempPhone = sessionStorage.getItem('tempPhone');
    if (tempPhone) {
      setValue('phone', tempPhone);
    }
    const tempPassword = sessionStorage.getItem('tempPassword');
    if (tempPassword) {
      setValue('password', tempPassword);
      setValue('confirmPassword', tempPassword);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerMsg('');
    try {
      const response = await axios.post(`${API}/auth/page1/createuser`, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        createdBy: 'Self'
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.authToken);
        window.alert('Successfully Registered! You are now logged in.');
        window.location.replace(window.location.pathname + '#/');
        window.location.reload();
      } else {
        setServerMsg(response.data.error || 'Validation error');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setServerMsg(err.response.data.errors.map((e) => e.msg).join(', '));
      } else if (err.response?.data?.error) {
        setServerMsg(err.response.data.error);
      } else {
        setServerMsg('Server error. Please check connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-min-h-screen">
      {/* Background decorations */}
      <div className="signup-bg-decor top-decor" />
      <div className="signup-bg-decor bottom-decor" />

      <div className="signup-form-wrapper">
        {/* Logo */}
        <Link to="/" className="signup-logo-link">
          <div className="signup-logo-icon">
            <Heart size={24} color="#fff" fill="#fff" />
          </div>
          <span className="signup-logo-text">Saanjh</span>
        </Link>

        {/* Register Card */}
        <div className="signup-glass-card">
          <div className="text-center signup-header-text">
            <h1 className="signup-title">Create Your Account</h1>
            <p className="signup-subtitle">Start your journey to finding love</p>
          </div>

          {serverMsg && <div className="signup-server-error">⚠️ {serverMsg}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
            <div className="signup-field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="signup-input"
                autoComplete="off"
                {...register('name')}
              />
              {errors.name && <p className="signup-error">{errors.name.message}</p>}
            </div>

            <div className="signup-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="signup-input"
                autoComplete="off"
                {...register('email')}
              />
              {errors.email && <p className="signup-error">{errors.email.message}</p>}
            </div>

            <div className="signup-field">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="10-digit number"
                className="signup-input"
                autoComplete="off"
                {...register('phone')}
              />
              {errors.phone && <p className="signup-error">{errors.phone.message}</p>}
            </div>

            <div className="signup-field">
              <label>Password</label>
              <div className="pwd-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  className="signup-input"
                  autoComplete="off"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="pwd-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="signup-error">{errors.password.message}</p>}
            </div>

            <div className="signup-field">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="signup-input"
                autoComplete="off"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && <p className="signup-error">{errors.confirmPassword.message}</p>}
            </div>

            <button 
              type="submit" 
              className="signup-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="signup-footer-text">
            Already have an account?{' '}
            <Link to="/login" className="signup-signin-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}