"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Scissors, LogOut, LayoutDashboard, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor scroll to trigger sticky effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleLinkClick = (e, href) => {
    // If it's a hash link and we're on the homepage, let's smooth scroll to it
    if (href.startsWith('/#') && pathname === '/') {
      e.preventDefault();
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        setMobileMenuOpen(false);
        const yOffset = -80; // height of fixed navbar
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-nav py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.3)]'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Elegant Brand Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center border border-gold-300/40 shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-transform duration-500 group-hover:rotate-12">
                <Scissors className="w-5 h-5 text-luxury-black fill-current" />
              </div>
              <span className="font-playfair text-xl sm:text-2xl font-bold tracking-wider uppercase text-luxury-light">
                Killin <span className="gold-gradient-text">Kutz</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-sm font-medium tracking-wide uppercase text-gray-400 hover:text-gold-400 transition-colors duration-300 relative py-1 group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Right Action Icons & Auth Controls */}
            <div className="hidden lg:flex items-center gap-4">


              {/* Booking Shortcut Button */}
              <Link
                href="/booking"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-luxury-black font-semibold text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                Book Now
              </Link>

              {/* Authentication Dropdown / Button */}
              {user ? (
                <div className="relative group">
                  <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-gold-500/30 bg-gold-500/5 hover:bg-gold-500/10 text-gold-400 hover:text-gold-300 text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer">
                    {user.role === 'admin' ? (
                      <LayoutDashboard className="w-3.5 h-3.5" />
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                    {user.name.split(' ')[0]}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-[#0f0f13] border border-gold-500/20 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden flex flex-col">
                    {user.role === 'admin' ? (
                      <Link href="/admin/dashboard" className="px-4 py-3 text-xs uppercase tracking-widest font-bold text-gray-300 hover:bg-gold-500/10 hover:text-gold-400 transition-colors">Admin Dashboard</Link>
                    ) : (
                      <>
                        <Link href="/profile" className="px-4 py-3 text-xs uppercase tracking-widest font-bold text-gray-300 hover:bg-gold-500/10 hover:text-gold-400 transition-colors">My Profile</Link>
                        <Link href="/profile" className="px-4 py-3 text-xs uppercase tracking-widest font-bold text-gray-300 hover:bg-gold-500/10 hover:text-gold-400 transition-colors border-t border-gray-800">My Appointments</Link>
                        <Link href="/profile" className="px-4 py-3 text-xs uppercase tracking-widest font-bold text-gray-300 hover:bg-gold-500/10 hover:text-gold-400 transition-colors border-t border-gray-800 flex justify-between">My Rewards <span className="bg-gold-500 text-black px-1.5 rounded text-[9px]">120</span></Link>
                      </>
                    )}
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-3 text-xs uppercase tracking-widest font-bold text-red-400 hover:bg-red-500/10 border-t border-gray-800 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-gray-700 bg-luxury-gray/40 hover:border-gold-500/30 hover:text-gold-400 text-xs font-semibold uppercase tracking-wider text-gray-400 transition-all duration-300 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Trigger */}
            <div className="flex items-center gap-3 lg:hidden">

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-9 h-9 rounded-full border border-gold-500/20 flex items-center justify-center text-gray-400 hover:text-gold-400 bg-luxury-gray/40"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed top-[70px] left-0 w-full z-40 bg-luxury-black/95 backdrop-blur-xl border-b border-gold-500/10 lg:hidden overflow-hidden"
          >
            <div className="px-5 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    handleLinkClick(e, link.href);
                    if (!link.href.startsWith('/#')) {
                      setMobileMenuOpen(false);
                    }
                  }}
                  className="block text-base font-semibold tracking-widest uppercase text-gray-400 hover:text-gold-400 py-2 border-b border-gray-900"
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 flex flex-col gap-3">
                <Link
                  href="/booking"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-luxury-black font-bold text-sm uppercase tracking-wider shadow-[0_4px_15px_rgba(212,175,55,0.2)]"
                >
                  Book Appointment
                </Link>

                {user ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href={user.role === 'admin' ? '/admin/dashboard' : '/profile'}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-3 rounded-full border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider"
                    >
                      {user.role === 'admin' ? 'Dashboard' : 'Profile'}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="py-3 rounded-full border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-bold uppercase tracking-wider"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3.5 rounded-full border border-gray-700 text-gray-300 font-bold text-xs uppercase tracking-wider"
                  >
                    Client Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
