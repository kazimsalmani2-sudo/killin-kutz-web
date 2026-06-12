"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Scissors, Mail, Lock, LogIn, AlertCircle, ArrowRight,
  Eye, EyeOff, Phone, CheckCircle, ChevronLeft, Send, Key
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Admin access via /admin-login — keep this URL private

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();

  // Main form state
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // OTP mode toggle
  const [otpMode, setOtpMode] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(0);
  const otpRefs = useRef([]);

  // Forgot password panel
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState(''); // '' | 'sent' | 'error'
  const [forgotLoading, setForgotLoading] = useState(false);

  // OTP countdown timer
  useEffect(() => {
    if (otpTimer <= 0) return;
    const t = setTimeout(() => setOtpTimer(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [otpTimer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMsg('');
  };

  // ── Email/Password Login ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMsg('Please fill in both fields.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      const loggedUser = await login(formData.email, formData.password);
      if (loggedUser) {
        if (loggedUser.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
      setLoading(false);
    }
  };

  // ── Google Sign-In ────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrorMsg('');
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch (err) {
      if (err.message === 'GOOGLE_AUTH_NOT_CONFIGURED') {
        setErrorMsg('Google sign-in is not configured yet. Please use email login.');
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

  // ── OTP Flow ──────────────────────────────────────────────────────────────
  const handleSendOtp = () => {
    if (!otpPhone || otpPhone.replace(/\s/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMsg('');
    setOtpSent(true);
    setOtpTimer(30);
    setOtpDigits(['', '', '', '', '', '']);
    // TODO: Wire to Firebase Phone Auth or SMS gateway
  };

  const handleOtpDigit = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otpDigits];
    updated[index] = value;
    setOtpDigits(updated);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    // Auto-submit when all 6 filled
    if (updated.every(d => d !== '') && updated.join('').length === 6) {
      handleVerifyOtp(updated.join(''));
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (code) => {
    // TODO: Wire to Firebase Phone Auth verifyCode
    console.log('Verifying OTP:', code);
    setErrorMsg('OTP verification not yet wired. (TODO: Firebase Phone Auth)');
  };

  // ── Forgot Password ───────────────────────────────────────────────────────
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) { setForgotStatus('error'); return; }
    setForgotLoading(true);
    try {
      // TODO: Wire to Firebase sendPasswordResetEmail(auth, forgotEmail)
      // import { sendPasswordResetEmail } from "firebase/auth";
      // await sendPasswordResetEmail(auth, forgotEmail);
      // Simulating success for now:
      await new Promise(r => setTimeout(r, 800));
      setForgotStatus('sent');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setForgotStatus('no-account');
      } else {
        setForgotStatus('error');
      }
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black text-luxury-light flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Background spotlights */}
      <div className="absolute w-[35rem] h-[35rem] bg-gold-500/5 blur-[120px] rounded-full top-10 left-10 pointer-events-none" />
      <div className="absolute w-[30rem] h-[30rem] bg-gold-950/10 blur-[100px] rounded-full bottom-10 right-10 pointer-events-none" />

      <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-4 relative z-10">
        <div className="w-full max-w-md glass rounded-3xl p-6 sm:p-10 border border-gold-500/10 shadow-2xl relative overflow-hidden">

          {/* Brand Logo */}
          <div className="text-center space-y-4 mb-8">
            <Link href="/" className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 items-center justify-center border border-gold-300/30 shadow-lg">
              <Scissors className="w-6 h-6 text-luxury-black fill-current" />
            </Link>
            <div>
              <h2 className="font-playfair text-2xl font-bold tracking-tight text-luxury-light">
                Welcome Back
              </h2>
              {/* SECURITY: Testing credentials removed before production deployment */}
              {/* Admin access via /admin-login — keep this URL private */}
              <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">
                Client Entrance
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && errorMsg !== 'NO_ACCOUNT_FOUND' && (
            <div className="mb-5 p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* No Account Found Error with Register link */}
          {errorMsg === 'NO_ACCOUNT_FOUND' && (
            <div className="mb-5 p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-semibold flex items-center gap-2 flex-wrap">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>No account found. Please register first.</span>
              <Link href="/auth/signup" className="text-gold-500 underline hover:text-gold-400 font-bold ml-1 flex items-center gap-0.5">
                Register here <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* ── OTP Mode ── */}
          {otpMode ? (
            <div className="space-y-5">
              {!otpSent ? (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-gold-500" />
                      Mobile Number
                    </label>
                    <div className="flex gap-2">
                      <span className="px-3 py-3.5 rounded-xl bg-luxury-gray border border-gray-850 text-xs text-gold-500 font-bold flex items-center">+91</span>
                      <input
                        type="tel"
                        value={otpPhone}
                        onChange={e => { setOtpPhone(e.target.value); setErrorMsg(''); }}
                        placeholder="98765 43210"
                        maxLength={10}
                        className="flex-1 px-4 py-3.5 rounded-xl bg-luxury-gray border border-gray-850 text-xs focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 text-luxury-light"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSendOtp}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-luxury-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(212,175,55,0.25)] hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Send OTP →
                  </button>
                </>
              ) : (
                <>
                  <p className="text-center text-xs text-gray-500">
                    Enter the 6-digit code sent to <span className="text-gold-500 font-bold">+91 {otpPhone}</span>
                  </p>
                  {/* 6 OTP Digit Boxes */}
                  <div className="flex gap-2 justify-center">
                    {otpDigits.map((d, i) => (
                      <input
                        key={i}
                        ref={el => otpRefs.current[i] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={e => handleOtpDigit(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        className="w-11 h-12 rounded-xl bg-luxury-gray border-2 border-gray-850 text-center text-sm font-bold focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 text-luxury-light transition-colors"
                      />
                    ))}
                  </div>
                  {/* Resend Timer */}
                  <div className="text-center text-xs text-gray-500">
                    {otpTimer > 0 ? (
                      <span>Resend OTP in <span className="text-gold-500 font-bold">0:{String(otpTimer).padStart(2, '0')}</span></span>
                    ) : (
                      <button onClick={handleSendOtp} className="text-gold-500 font-bold hover:text-gold-400 cursor-pointer">
                        Resend OTP
                      </button>
                    )}
                  </div>
                </>
              )}
              <button
                type="button"
                onClick={() => { setOtpMode(false); setOtpSent(false); setOtpPhone(''); setOtpDigits(['','','','','','']); setErrorMsg(''); }}
                className="w-full text-center text-xs text-gray-500 hover:text-gold-500 transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Email Login
              </button>
            </div>
          ) : (
            /* ── Email/Password Form ── */
            <>
              {/* Google Sign-In */}
              <button
                type="button"
                onClick={handleGoogleLogin}
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

              <form onSubmit={handleSubmit} className="space-y-5">
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
                    placeholder="client@email.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-luxury-gray border border-gray-850 text-xs focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 text-luxury-light"
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
                      placeholder="Enter your password"
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

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => { setShowForgot(!showForgot); setForgotStatus(''); setForgotEmail(''); }}
                      className="text-[10px] text-gold-500 hover:text-gold-400 font-semibold cursor-pointer transition-colors"
                    >
                      Forgot your password?
                    </button>
                  </div>

                  {/* Forgot Password Slide Panel */}
                  {showForgot && (
                    <div className="mt-2 p-4 rounded-xl border border-gold-500/15 bg-gold-500/5 space-y-3 animate-in slide-in-from-top-2 duration-200">
                      {forgotStatus === 'sent' ? (
                        <div className="flex flex-col items-center gap-2 py-2">
                          <CheckCircle className="w-6 h-6 text-green-500" />
                          <p className="text-xs text-center text-green-500 font-semibold">Reset link sent! Check your inbox.</p>
                          <button
                            type="button"
                            onClick={() => { setShowForgot(false); setForgotStatus(''); }}
                            className="text-[10px] text-gold-500 hover:text-gold-400 font-semibold cursor-pointer flex items-center gap-1"
                          >
                            <ChevronLeft className="w-3 h-3" /> Back to Login
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleForgotSubmit} className="space-y-2">
                          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest">Enter your registered email</p>
                          <input
                            type="email"
                            value={forgotEmail}
                            onChange={e => setForgotEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full px-3 py-2.5 rounded-lg bg-luxury-gray border border-gray-850 text-xs focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 text-luxury-light"
                          />
                          {forgotStatus === 'no-account' && (
                            <p className="text-[10px] text-red-400 font-semibold">No account found with this email.</p>
                          )}
                          {forgotStatus === 'error' && (
                            <p className="text-[10px] text-red-400 font-semibold">Something went wrong. Try again.</p>
                          )}
                          <div className="flex items-center gap-2">
                            <button
                              type="submit"
                              disabled={forgotLoading}
                              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-luxury-black font-extrabold text-[10px] uppercase tracking-widest flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              {forgotLoading ? (
                                <span className="w-3 h-3 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
                              ) : (
                                <><Send className="w-3 h-3" /> Send Reset Link</>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => { setShowForgot(false); setForgotStatus(''); }}
                              className="text-[10px] text-gray-500 hover:text-gold-500 cursor-pointer flex items-center gap-0.5"
                            >
                              <ChevronLeft className="w-3 h-3" /> Back
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-luxury-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(212,175,55,0.25)] hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" />
                  {loading ? 'Authenticating...' : 'Enter Lounge'}
                </button>

                {/* OTP Toggle */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => { setOtpMode(true); setErrorMsg(''); setShowForgot(false); }}
                    className="text-xs text-gold-500 hover:text-gold-400 font-semibold cursor-pointer transition-colors flex items-center gap-1 mx-auto"
                  >
                    <Key className="w-3.5 h-3.5" /> Login with OTP instead →
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Bottom Register Link */}
          <div className="mt-8 text-center border-t border-gray-900/30 pt-6 text-xs text-gray-500 flex justify-between items-center">
            <span>New VIP Member?</span>
            <Link href="/auth/signup" className="text-gold-500 hover:text-gold-400 font-bold uppercase tracking-wider flex items-center gap-1">
              Register <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
