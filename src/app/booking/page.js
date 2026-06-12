"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingForm from '@/components/BookingForm';
import { Calendar, Sparkles } from 'lucide-react';

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-luxury-black text-luxury-light flex flex-col relative overflow-hidden">
      
      {/* Sticky Top Navbar */}
      <Navbar />

      {/* Background orbs */}
      <div className="absolute w-[35rem] h-[35rem] bg-gold-500/5 blur-[120px] rounded-full -top-24 -left-36 pointer-events-none" />
      <div className="absolute w-[30rem] h-[30rem] bg-gold-950/10 blur-[100px] rounded-full top-1/2 right-0 pointer-events-none" />

      {/* Main Content */}
      <main className="flex-grow pt-32 pb-24 relative z-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Executive Scheduling
          </div>
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold tracking-tight text-luxury-light">
            Book An <span className="gold-gradient-text">Appointment</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-xs sm:text-sm font-light leading-relaxed">
            Fill out our secure calendar scheduling module below. Choose your favorite senior stylist, date, time slot, and grooming package in seconds.
          </p>
        </div>

        {/* Core Booking Form widget */}
        <BookingForm />

      </main>

      {/* Global Footer */}
      <Footer />

    </div>
  );
}
