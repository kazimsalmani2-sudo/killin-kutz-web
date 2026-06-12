"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Check, AlertCircle, Phone, Mail, FileText, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createAppointment } from '@/lib/bookingService';
import Link from 'next/link';

export default function BookingForm() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    stylist: 'Any Available',
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Auto-fill user details if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        phone: user.phone || ''
      }));
    }
  }, [user]);

  // Synchronized Services List
  const services = [
    { id: '1', name: 'Haircut & Styling', price: '₹250', duration: '30 min', category: 'CUTS & SHAVES' },
    { id: '2', name: 'Beard Styling & Hot Towel Shave', price: '₹150', duration: '25 min', category: 'CUTS & SHAVES' },
    { id: '3', name: 'Hair + Beard Combo', price: '₹350', duration: '50 min', category: 'CUTS & SHAVES' },
    { id: '4', name: "Men's Facial & Grooming", price: '₹800', duration: '60 min', category: 'SPA & CARE' },
    { id: '5', name: 'Head Spa & Massage', price: '₹1500', duration: '90 min', category: 'SPA & CARE' },
    { id: '6', name: 'Luxury Facial & Cleanup', price: '₹1200', duration: '60 min', category: 'SPA & CARE' },
    { id: '7', name: 'Manicure & Pedicure', price: '₹800', duration: '75 min', category: 'SPA & CARE' },
    { id: '8', name: 'Executive Package', price: '₹1800', duration: '120 min', category: 'V.I.P. PACKAGES' },
    { id: '9', name: 'Platinum Groom Package', price: '₹2800', duration: '180 min', category: 'V.I.P. PACKAGES' },
    { id: '10', name: 'Spa Day Package', price: '₹2500', duration: '150 min', category: 'V.I.P. PACKAGES' }
  ];

  const stylists = [
    { name: "Any Available", specialty: "All Services" },
    { name: "Marcus", specialty: "Fades & Tapers" },
    { name: "Dev", specialty: "Beard Sculpting" },
    { name: "Jordan", specialty: "Spa & Treatments" },
    { name: "Ricky", specialty: "V.I.P. Packages" }
  ];

  const timeSlots = [
    "10:00 AM", "10:30 AM", "11:00 AM", 
    "11:35 AM", "12:00 PM", "12:30 PM",
    "01:00 PM", "01:30 PM", "02:00 PM", 
    "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM",
    "05:30 PM", "06:00 PM", "06:30 PM",
    "07:00 PM", "07:30 PM"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.service) {
        setErrorMsg('Please select a service.');
        return;
      }
      if (!formData.date || !formData.time) {
        setErrorMsg('Please select a date and time.');
        return;
      }
    }
    setErrorMsg('');
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    setStep(prev => prev - 1);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setErrorMsg('Please fill in your contact details.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const selectedServiceObj = services.find(s => s.name === formData.service);
      const servicePrice = selectedServiceObj ? selectedServiceObj.price : '₹250';

      const saved = await createAppointment({
        userId: user?.uid || null,
        service: formData.service,
        servicePrice,
        stylist: formData.stylist,
        date: formData.date,
        time: formData.time,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        notes: formData.notes || '',
      });

      setConfirmedBookingData(saved);
      setBookingConfirmed(true);
    } catch (err) {
      console.error('Booking failed:', err);
      setErrorMsg('Failed to save booking. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      service: '',
      date: '',
      time: '',
      stylist: 'Any Available',
      name: user ? user.name : '',
      phone: user ? user.phone || '' : '',
      email: user ? user.email : '',
      notes: ''
    });
    setStep(1);
    setBookingConfirmed(false);
    setConfirmedBookingData(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      
      {/* Error Message */}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {!bookingConfirmed ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="mx-4 bg-[#FCFAF2] rounded-3xl p-6 sm:p-10 border border-[#E8DEC1] shadow-2xl relative overflow-hidden text-[#3B362E] font-sans"
          >
            {/* Step 1: Exactly like the Screenshot */}
            {step === 1 && (
              <div className="space-y-8">
                <h2 className="text-xl sm:text-2xl font-black tracking-wide text-[#2D2A26] uppercase">
                  1. CHOOSE YOUR SERVICE & TIME
                </h2>
                
                {/* SELECT A SERVICE */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold tracking-widest text-[#8F8161] uppercase">
                    SELECT A SERVICE
                  </h3>
                  
                  {['CUTS & SHAVES', 'SPA & CARE', 'V.I.P. PACKAGES'].map((category) => (
                    <div key={category} className="space-y-3">
                      <span className="block text-[10px] font-bold text-[#A58229] uppercase tracking-widest">
                        ★ {category}
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.filter(s => s.category === category).map((s) => (
                          <div
                            key={s.id}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, service: s.name }));
                              setErrorMsg('');
                            }}
                            className={`p-4 rounded-2xl cursor-pointer flex flex-col justify-between h-[100px] transition-all border ${
                              formData.service === s.name
                                ? 'bg-[#E5D7B7] border-[#C6AF77] shadow-inner'
                                : 'bg-[#F1EBD8] border-[#E5D7B7] hover:border-[#C6AF77]'
                            }`}
                          >
                            <h4 className="font-bold text-sm text-[#3B362E]">{s.name}</h4>
                            <div className="flex justify-between items-end mt-auto">
                              <span className="text-xs text-[#6F6656] font-medium flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" /> {s.duration}
                              </span>
                              <span className="text-sm font-bold text-[#A58229]">{s.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* SELECT DATE & TIME GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  
                  {/* SELECT DATE */}
                  <div>
                    <h3 className="text-sm font-bold tracking-widest text-[#8F8161] uppercase mb-4">
                      SELECT DATE
                    </h3>
                    <div className="relative">
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={handleInputChange}
                        suppressHydrationWarning
                        className="w-full px-4 py-3.5 rounded-xl bg-[#F1EBD8] border border-[#E5D7B7] text-[#3B362E] focus:outline-none focus:border-[#C6AF77] focus:ring-1 focus:ring-[#C6AF77]"
                      />
                    </div>
                  </div>

                  {/* SELECT TIME */}
                  <div>
                    <h3 className="text-sm font-bold tracking-widest text-[#8F8161] uppercase mb-4">
                      SELECT TIME
                    </h3>
                    <div className="grid grid-cols-3 gap-3 max-h-[165px] overflow-y-auto pr-2 custom-scrollbar">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, time: slot }));
                            setErrorMsg('');
                          }}
                          className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                            formData.time === slot
                              ? 'bg-[#E5D7B7] border-[#C6AF77] text-[#3B362E]'
                              : 'bg-[#F1EBD8] border-[#E5D7B7] text-[#6F6656] hover:border-[#C6AF77]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>



                {/* Continue Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full py-4 rounded-full bg-[#D3C49B] hover:bg-[#C6AF77] text-[#5A5038] font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Personal Info */}
            {step === 2 && (
              <form onSubmit={handleSubmitBooking} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-10 h-10 rounded-full bg-[#F1EBD8] border border-[#E5D7B7] flex items-center justify-center text-[#5A5038] hover:bg-[#E5D7B7] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h2 className="text-xl sm:text-2xl font-black tracking-wide text-[#2D2A26] uppercase">
                    2. YOUR DETAILS
                  </h2>
                </div>

                {/* Appointment Summary Box */}
                <div className="p-5 rounded-2xl bg-[#F1EBD8] border border-[#E5D7B7] text-[#3B362E] space-y-2">
                  <h4 className="text-xs font-bold text-[#8F8161] uppercase tracking-widest">Appointment Summary</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500 block">Service</span>
                      <strong className="font-bold">{formData.service}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Date & Time</span>
                      <strong className="font-bold">{formData.date} at {formData.time}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Stylist</span>
                      <strong className="font-bold">{formData.stylist}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Price</span>
                      <strong className="font-bold text-[#A58229]">{services.find(s => s.name === formData.service)?.price || '₹250'}</strong>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#8F8161] uppercase tracking-widest flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 rounded-xl bg-[#F1EBD8] border border-[#E5D7B7] text-[#3B362E] focus:outline-none focus:border-[#C6AF77]"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#8F8161] uppercase tracking-widest flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl bg-[#F1EBD8] border border-[#E5D7B7] text-[#3B362E] focus:outline-none focus:border-[#C6AF77]"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-bold text-[#8F8161] uppercase tracking-widest flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. client@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#F1EBD8] border border-[#E5D7B7] text-[#3B362E] focus:outline-none focus:border-[#C6AF77]"
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-bold text-[#8F8161] uppercase tracking-widest flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> Additional Notes
                    </label>
                    <textarea
                      name="notes"
                      rows="2"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any styling preferences?"
                      className="w-full px-4 py-3 rounded-xl bg-[#F1EBD8] border border-[#E5D7B7] text-[#3B362E] focus:outline-none focus:border-[#C6AF77]"
                    />
                  </div>
                </div>

                {/* Confirm Button Styled to match BOOK NOW gold style */}
                <div className="pt-6 border-t border-[#E8DEC1]">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-luxury-black font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    Confirm Booking <Check className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Custom Scrollbar CSS for time slots */}
            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: #F1EBD8;
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #8F8161;
                border-radius: 4px;
              }
            `}</style>
          </motion.div>
        ) : (
          /* Confirmation Message (Adapted to Light Theme) */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-4 bg-[#FCFAF2] border border-[#E8DEC1] rounded-3xl p-8 sm:p-12 shadow-2xl relative max-w-lg mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-[#E5D7B7] flex items-center justify-center mx-auto mb-6 shadow-md"
            >
              <Check className="w-10 h-10 text-[#3B362E] font-extrabold" />
            </motion.div>

            <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#2D2A26]">Booking Confirmed!</h3>
            <p className="text-[#6F6656] text-sm mt-3 max-w-sm mx-auto">
              Your appointment for <strong>{confirmedBookingData.service}</strong> with <strong>{confirmedBookingData.stylist}</strong> on <strong>{confirmedBookingData.date}</strong> at <strong>{confirmedBookingData.time}</strong> has been scheduled successfully.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/dashboard"
                className="w-full py-3.5 rounded-full bg-[#3B362E] text-[#F1EBD8] text-xs font-bold uppercase tracking-widest shadow-lg transition-colors text-center cursor-pointer"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={resetForm}
                className="w-full py-3.5 rounded-full border border-[#D3C49B] bg-transparent text-[#5A5038] hover:bg-[#F1EBD8] text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                Book Another Service
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
