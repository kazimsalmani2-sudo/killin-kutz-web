"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GallerySection from '@/components/GallerySection';

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-luxury-black text-luxury-light flex flex-col relative overflow-hidden">
      <Navbar />
      <main className="flex-grow pt-20">
        <GallerySection />
      </main>
      <Footer />
    </div>
  );
}
