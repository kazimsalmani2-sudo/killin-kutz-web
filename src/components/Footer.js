"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Scissors, MapPin, Phone, Mail, Clock, Send, Shield, Sparkles } from 'lucide-react';

const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const YoutubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><polygon points="10 15 15 12 10 9"/></svg>;

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="relative bg-luxury-black border-t border-gold-500/10 overflow-hidden pt-20 pb-8 z-10">
      {/* Background ambient orbs */}
      <div className="absolute w-96 h-96 bg-gold-500/5 blur-[120px] rounded-full bottom-0 right-0 pointer-events-none" />
      <div className="absolute w-80 h-80 bg-gold-950/20 blur-[100px] rounded-full -left-20 top-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Bio */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center border border-gold-300/30">
                <Scissors className="w-4 h-4 text-luxury-black fill-current" />
              </div>
              <span className="font-playfair text-xl font-bold tracking-wider uppercase">
                Killin <span className="gold-gradient-text">Kutz</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Elevating local grooming into an artistic ritual. Experience high-end hair design, luxury shaves, and top-tier styling in a state-of-the-art lounge.
            </p>
            <div className="flex items-center gap-3">
              {/* TODO: Add real social media URLs */}
              {[
                { icon: <InstagramIcon />, href: '#' },
                { icon: <FacebookIcon />, href: '#' },
                { icon: <YoutubeIcon />, href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-9 h-9 rounded-full border border-gray-800 flex items-center justify-center text-gold-400 hover:text-gold-300 hover:border-gold-500/40 bg-luxury-gray/40 hover:scale-110 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold tracking-widest uppercase text-gold-400">Quick Links</h4>
            <ul className="space-y-3.5">
              {[
                { name: 'Home Lounge', href: '/' },
                { name: 'Salon Story', href: '/about' },
                { name: 'Luxury Services', href: '/services' },
                { name: 'Style Showcase', href: '/gallery' },
                { name: 'Book Session', href: '/booking' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-gold-400 text-sm transition-colors duration-300 flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-gold-500/40" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Lounge Hours */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold tracking-widest uppercase text-gold-400">Lounge Hours & Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <span>2nd Rd, opposite Mani's Lunch Home, Kandhari Colony, Chembur Gaothan, Chembur, Mumbai, Maharashtra 400071</span>
              </li>
              <li className="flex flex-col gap-1 text-sm text-gray-400 pl-7 -mt-2">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                  <span>+91 76780 37492</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                  <span>+91 75060 87492</span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                <span>info@killinkutz.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <Clock className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-gray-300">Mon - Sun: 10:00 AM - 8:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold tracking-widest uppercase text-gold-400">V.I.P. Dispatch</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Subscribe to unlock seasonal grooming edits, priority schedules, and members-only events.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-full bg-luxury-gray/80 border border-gray-800 text-sm focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 text-luxury-light"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 w-9 h-9 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 flex items-center justify-center text-luxury-black hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
            {subscribed && (
              <p className="text-xs text-gold-400 font-semibold flex items-center gap-1.5 animate-pulse">
                <Sparkles className="w-3 h-3" />
                Welcome to the inner circle! Check your inbox.
              </p>
            )}
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 border-t border-gray-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Killin Kutz Salon. All Rights Reserved. Crafted for premium excellence.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link href="/#about" className="hover:text-gold-400">Terms of Service</Link>
            <span>·</span>
            <Link href="/#about" className="hover:text-gold-400">Privacy Policy</Link>
            <span>·</span>
            <span className="flex items-center gap-1 text-gold-500/60">
              <Shield className="w-3.5 h-3.5" /> Secure Booking
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
