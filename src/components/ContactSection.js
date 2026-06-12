"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Phone, Mail, MapPin, Clock, Send, Check } from 'lucide-react';

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formState.name && formState.email && formState.message) {
      setSent(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-luxury-black">
      {/* Ambient background blur circles */}
      <div className="absolute w-96 h-96 bg-gold-500/5 blur-[120px] rounded-full top-10 right-10 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-gold-950/15 blur-[100px] rounded-full -left-20 bottom-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Connect With Us
          </div>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold tracking-tight text-luxury-light">
            Contact The <span className="gold-gradient-text">Lounge</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed font-light">
            Reach out to schedule custom event services, enquire about memberships, or leave a quick note for our executive stylists.
          </p>
        </div>

        {/* Contact Split Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Column 1: Details & Satellite Map Representation */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="font-playfair text-2xl font-bold text-luxury-light">Lounge Details</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Visit us for a luxury grooming consultation or drop us a quick phone call. Walks-ins are accommodated based on active calendar availability.
              </p>
            </div>

            {/* Address cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl glass flex items-start gap-3 border border-gold-500/5">
                <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Address</span>
                  <p className="text-xs text-gray-300 font-semibold mt-1">2nd Rd, opposite Mani's Lunch Home, Kandhari Colony, Chembur Gaothan, Chembur, Mumbai, Maharashtra 400071</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl glass flex items-start gap-3 border border-gold-500/5">
                <Phone className="w-5 h-5 text-gold-500 shrink-0" />
                <div>
                  <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Phone</span>
                  <p className="text-xs text-gray-300 font-semibold mt-1">+91 76780 37492<br/>+91 75060 87492</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl glass flex items-start gap-3 border border-gold-500/5">
                <Mail className="w-5 h-5 text-gold-500 shrink-0" />
                <div>
                  <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Email</span>
                  <p className="text-xs text-gray-300 font-semibold mt-1">info@killinkutz.com</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl glass flex items-start gap-3 border border-gold-500/5">
                <Clock className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Hours</span>
                  <p className="text-xs text-gray-300 font-semibold mt-1">Mon - Sun: 10:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>

            {/* Simulated Satellite Map Replaced by Real Google Maps Embed */}
            <div className="space-y-3">
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">
                Executive Location Map
              </span>
              <div className="relative w-full h-[220px] rounded-3xl overflow-hidden border border-gold-500/20 shadow-xl bg-[#09090b]">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.488319696956!2d72.89886367584143!3d19.042318853037887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c61f267bf0b9%3A0xc3c5f49e0bdeee52!2s2nd%20Rd%2C%20opposite%20Mani&#39;s%20Lunch%20Home%2C%20Kandhari%20Colony%2C%20Chembur%20Gaothan%2C%20Chembur%2C%20Mumbai%2C%20Maharashtra%20400071!5e0!3m2!1sen!2sin!4v1716999999999!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="filter contrast-125 saturate-75 opacity-90"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Column 2: Interactive Contact Message Form */}
          <div className="glass rounded-3xl p-6 sm:p-10 border border-gold-500/10 shadow-2xl relative">
            <div className="space-y-4 mb-6">
              <h3 className="font-playfair text-2xl font-bold text-luxury-light">Send Direct Message</h3>
              <p className="text-gray-450 text-xs sm:text-sm font-light">
                Fill in coordinates below. Our hospitality agent will respond within 12 business hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Your Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formState.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Arthur Pendelton"
                  className="w-full px-5 py-3 rounded-xl bg-luxury-gray border border-gray-850 text-xs focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 text-luxury-light"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formState.email}
                  onChange={handleInputChange}
                  placeholder="e.g. client@email.com"
                  className="w-full px-5 py-3 rounded-xl bg-luxury-gray border border-gray-850 text-xs focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 text-luxury-light"
                />
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Subject (Optional)</label>
                <input
                  type="text"
                  name="subject"
                  value={formState.subject}
                  onChange={handleInputChange}
                  placeholder="e.g. Bridal Packages"
                  className="w-full px-5 py-3 rounded-xl bg-luxury-gray border border-gray-850 text-xs focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 text-luxury-light"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Message Coordinates</label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  value={formState.message}
                  onChange={handleInputChange}
                  placeholder="Tell us what you need..."
                  className="w-full px-5 py-3 rounded-xl bg-luxury-gray border border-gray-850 text-xs focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 text-luxury-light"
                />
              </div>

              {/* Submit trigger button */}
              <button
                type="submit"
                className="w-full py-4 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-luxury-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(212,175,55,0.25)] hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Transmit Message
              </button>
            </form>

            {/* Confirm modal toast */}
            <AnimatePresence>
              {sent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 bg-luxury-black/95 rounded-3xl flex flex-col items-center justify-center p-6 text-center border border-gold-500/20"
                >
                  <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center mb-4">
                    <Check className="w-6 h-6 text-luxury-black font-extrabold" />
                  </div>
                  <h4 className="font-playfair text-xl font-bold text-gold-400">Message Transmitted</h4>
                  <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-xs mx-auto leading-relaxed">
                    Thank you! Your grooming inquiry has been transmitted successfully. A concierge agent will follow up shortly.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
