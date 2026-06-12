"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Scissors, Mail, Lock, User, Phone, CheckSquare,
  Sparkles, AlertCircle, ArrowLeft, Eye, EyeOff, Check
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// ── Indian Phone Validation ──────────────────────────────────────────────────
const isValidIndianPhone = (phone) => {
  const cleaned = phone.replace(/\s+/g, '');
  return /^(\+91)?[6-9]\d{9}$/.test(cleaned);
};

// ── Password Strength ────────────────────────────────────────────────────────
function getPasswordStrength(password) {
  if (!password) return null;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  if (password.length >= 10 && hasUpper && hasNumber && hasSymbol) {
    return { label: 'Strong', color: '#22c55e', width: '100%' };
  }
  if (password.length >= 6 && (hasNumber || hasUpper)) {
    return { label: 'Medium', color: '#eab308', width: '66%' };
  }
  return { label: 'Weak', color: '#ef4444', width: '33%' };
}

export default function SignupPage() {
  const router = useRouter();
  const { signup, loginWithGoogle } = useAuth();

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [shakeBtn, setShakeBtn] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Post-register welcome screen state
  const [showWelcome, setShowWelcome] = useState(false);
  const [registeredName, setRegisteredName] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'phone') setPhoneError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    // Indian phone validation
    if (formData.phone && !isValidIndianPhone(formData.phone)) {
      setPhoneError('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    if (!termsChecked) {
      setShakeBtn(true);
      setTimeout(() => setShakeBtn(false), 600);
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      signup(formData.name, formData.email, formData.password, formData.phone);
      const firstName = formData.name.split(' ')[0];
      setRegisteredName(firstName);
      setShowWelcome(true);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setErrorMsg('');
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch (err) {
      if (err.message === 'GOOGLE_AUTH_NOT_CONFIGURED') {
        setErrorMsg('Google sign-in is not configured yet. Please use email registration.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Sign-in cancelled. Try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setErrorMsg('Popup blocked. Please allow popups for this site.');
      } else {
        setErrorMsg(err.message || 'Google sign-in failed.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const strength = getPasswordStrength(formData.password);

  // ── Welcome Screen ────────────────────────────────────────────────────────
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-luxury-black text-luxury-light flex flex-col relative overflow-hidden">
        <div className="absolute w-[40rem] h-[40rem] bg-gold-500/5 blur-[120px] rounded-full top-0 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div
          className="flex-grow flex flex-col items-center justify-center px-4 text-center"
          style={{ animation: 'fadeIn 0.6s ease both' }}
        >
          {/* Gold Scissors Icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-[0_8px_30px_rgba(212,175,55,0.35)] mb-6">
            <Scissors className="w-10 h-10 text-luxury-black fill-current" />
          </div>

          <h1 className="font-playfair text-3xl sm:text-4xl font-bold tracking-tight text-luxury-light mb-3">
            Welcome to the Lounge, {registeredName}! ✂️
          </h1>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-10 leading-relaxed">
            Your VIP account is ready. Book your first executive grooming session now.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs mx-auto">
            <button
              onClick={() => router.push('/booking')}
              className="flex-1 py-4 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-luxury-black font-extrabold text-xs uppercase tracking-widest shadow-[0_4px_15px_rgba(212,175,55,0.25)] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Book My Appointment →
            </button>
            <button
              onClick={() => router.push('/services')}
              className="flex-1 py-4 rounded-full border border-gold-500/40 hover:border-gold-500 text-gold-500 font-extrabold text-xs uppercase tracking-widest hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Explore Services
            </button>
          </div>
        </div>
        <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(20px);} to {opacity:1; transform:translateY(0);} }`}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black text-luxury-light flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Background spotlights */}
      <div className="absolute w-[35rem] h-[35rem] bg-gold-500/5 blur-[120px] rounded-full top-10 left-10 pointer-events-none" />
      <div className="absolute w-[30rem] h-[30rem] bg-gold-950/10 blur-[100px] rounded-full bottom-10 right-10 pointer-events-none" />

      <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-4 relative z-10">
        <div className="w-full max-w-md glass rounded-3xl p-6 sm:p-10 border border-gold-500/10 shadow-2xl relative overflow-hidden">

          {/* Brand Logo */}
          <div className="text-center space-y-4 mb-4">
            <Link href="/" className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 items-center justify-center border border-gold-300/30 shadow-lg">
              <Scissors className="w-6 h-6 text-luxury-black fill-current" />
            </Link>
            <div>
              <h2 className="font-playfair text-2xl font-bold tracking-tight text-luxury-light">
                VIP Membership
              </h2>
              <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">
                Create Lounge Account
              </p>
            </div>
          </div>

          {/* VIP Benefits Bar */}
          <div className="flex items-center justify-center gap-0 mb-6 mt-2 flex-wrap">
            {[
              'Priority Booking',
              'Exclusive Member Discounts',
              'Early Access to V.I.P. Packages',
            ].map((benefit, i, arr) => (
              <React.Fragment key={benefit}>
                <div className="flex items-center gap-1 px-2 py-1">
                  <Check className="w-3 h-3 text-gold-500 flex-shrink-0" />
                  <span className="text-[10px] text-gold-500 font-semibold whitespace-nowrap">{benefit}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="w-px h-3 bg-gold-500/25 mx-1" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* Google Sign-Up */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="w-full py-3.5 rounded-xl border border-gold-500/30 bg-white/60 hover:bg-white/80 text-luxury-light font-semibold text-xs flex items-center justify-center gap-2.5 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 mb-4"
          >
            {googleLoading ? (
              <span className="w-4 h-4 border-2 border-gold-500/40 border-t-gold-500 rounded-full animate-spin" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {googleLoading ? 'Opening Google...' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gold-500/15" />
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">or</span>
            <div className="flex-1 h-px bg-gold-500/15" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-gold-500" /> Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Imran Shaikh"
                className="w-full px-4 py-3 rounded-xl bg-luxury-gray border border-gray-850 text-xs focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 text-luxury-light"
              />
            </div>

            {/* Phone — Indian format */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-gold-500" /> Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g. +91 98765 43210"
                className={`w-full px-4 py-3 rounded-xl bg-luxury-gray border text-xs focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 text-luxury-light ${
                  phoneError ? 'border-red-500/50' : 'border-gray-850'
                }`}
              />
              {phoneError && (
                <p className="text-red-400 text-[10px] font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {phoneError}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-gold-500" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="e.g. client@email.com"
                className="w-full px-4 py-3 rounded-xl bg-luxury-gray border border-gray-850 text-xs focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 text-luxury-light"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-gold-500" /> Security Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-luxury-gray border border-gray-850 text-xs focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 text-luxury-light"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold-500 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {strength && (
                <div className="space-y-1 pt-1">
                  <div className="w-full h-1 rounded-full bg-gray-850 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: strength.width, backgroundColor: strength.color }}
                    />
                  </div>
                  <p className="text-[10px] font-semibold" style={{ color: strength.color }}>
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                <CheckSquare className="w-3.5 h-3.5 text-gold-500" /> Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-luxury-gray border border-gray-850 text-xs focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 text-luxury-light"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold-500 transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms & Privacy Checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsChecked}
                  onChange={e => setTermsChecked(e.target.checked)}
                  className="sr-only"
                />
                <div
                  onClick={() => setTermsChecked(!termsChecked)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                    termsChecked ? 'bg-gold-500 border-gold-500' : 'border-gold-500/40 bg-luxury-gray'
                  }`}
                >
                  {termsChecked && <Check className="w-2.5 h-2.5 text-luxury-black" />}
                </div>
              </div>
              <label htmlFor="terms" className="text-[10px] text-gray-500 leading-relaxed cursor-pointer select-none" onClick={() => setTermsChecked(!termsChecked)}>
                I agree to the{' '}
                <Link href="/terms" className="text-gold-500 underline hover:text-gold-400 font-semibold" onClick={e => e.stopPropagation()}>
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-gold-500 underline hover:text-gold-400 font-semibold" onClick={e => e.stopPropagation()}>
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-luxury-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(212,175,55,0.25)] hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50 ${
                shakeBtn ? 'animate-[shake_0.5s_ease]' : ''
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Creating VIP Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center border-t border-gray-900/30 pt-6 text-xs text-gray-500 flex justify-between items-center">
            <span>Already have an account?</span>
            <Link href="/auth/login" className="text-gold-500 hover:text-gold-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
