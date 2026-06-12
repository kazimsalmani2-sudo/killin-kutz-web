"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServicesSection from '@/components/ServicesSection';
import PackageBuilder from '@/components/PackageBuilder';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-luxury-black text-luxury-light flex flex-col relative overflow-hidden">
      <Navbar />
      <main className="flex-grow pt-20">
        <ServicesSection />
        <PackageBuilder />
      </main>
      <Footer />
    </div>
  );
}
