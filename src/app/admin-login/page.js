"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Scissors, Mail, Lock, ShieldCheck, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// STAFF ONLY — Do not link this page anywhere in the navbar or public pages
// Admin access via /admin-login — keep this URL private

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMsg('Please fill in both fields.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const loggedUser = login(formData.email, formData.password);
      if (loggedUser && loggedUser.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        setErrorMsg('Access denied. This portal is for staff only.');
        setLoading(false);
      }
    } catch (err) {
      if (err.message === 'NO_ACCOUNT_FOUND') {
        setErrorMsg('Invalid admin credentials.');
      } else {
        setErrorMsg(err.message || 'Authentication failed.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black text-luxury-light flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background spotlights */}
      <div className="absolute w-[35rem] h-[35rem] bg-gold-500/5 blur-[120px] rounded-full top-10 left-10 pointer-events-none" />
      <div className="absolute w-[30rem] h-[30rem] bg-gold-950/10 blur-[100px] rounded-full bottom-10 right-10 pointer-events-none" />

      <div className="w-full max-w-sm glass rounded-3xl p-8 border border-gold-500/10 shadow-2xl relative z-10">

        {/* Brand + Staff Badge */}
        <div className="text-center space-y-3 mb-8">
          <Link href="/" className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 items-center justify-center border border-gold-300/30 shadow-lg">
            <Scissors className="w-6 h-6 text-luxury-black fill-current" />
          </Link>

          {/* STAFF ONLY badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
            <span className="text-[10px] font-extrabold text-gold-500 uppercase tracking-widest">Staff Only</span>
          </div>

          <div>
            <h1 className="font-playfair text-2xl font-bold tracking-tight text-luxury-light">
              Admin Portal
            </h1>
            <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">
              Killin Kutz Staff Access
            </p>
          </div>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-gold-500" /> Admin Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="admin@killinkutz.com"
              className="w-full px-4 py-3.5 rounded-xl bg-luxury-gray border border-gray-850 text-xs focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 text-luxury-light"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-gold-500" /> Staff Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter staff password"
                className="w-full px-4 py-3.5 pr-10 rounded-xl bg-luxury-gray border border-gray-850 text-xs focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 text-luxury-light"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold-500 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-luxury-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(212,175,55,0.25)] hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Authenticating...' : 'Enter Admin Panel'}
          </button>
        </form>

        {/* Back to site */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-[10px] text-gray-500 hover:text-gold-500 transition-colors uppercase tracking-widest font-semibold">
            ← Back to Killin Kutz
          </Link>
        </div>
      </div>
    </div>
  );
}
