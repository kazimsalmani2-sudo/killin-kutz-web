"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactSection from '@/components/ContactSection';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-luxury-black text-luxury-light flex flex-col relative overflow-hidden">
      <Navbar />
      <main className="flex-grow pt-20">
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
