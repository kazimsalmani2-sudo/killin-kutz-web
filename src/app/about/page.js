"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutSection from '@/components/AboutSection';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-luxury-black text-luxury-light flex flex-col relative overflow-hidden">
      <Navbar />
      <main className="flex-grow pt-20">
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
