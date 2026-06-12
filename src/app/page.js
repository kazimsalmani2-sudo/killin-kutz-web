"use client";
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import Link from 'next/link';


import TestimonialsSection from '@/components/TestimonialsSection';

import { Calendar, Scissors, ArrowRight } from 'lucide-react';

export default function Home() {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingTime, setLoadingTime] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showReload, setShowReload] = useState(false);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [isUnmounted, setIsUnmounted] = useState(false);

  const taglines = [
    "LOADING LUXURY LOUNGE EXPERIENCE",
    "CRAFTING YOUR PERFECT LOOK...",
    "PREPARING YOUR LOUNGE EXPERIENCE...",
    "SHARPENING THE BLADES...",
    "ALMOST READY FOR YOU..."
  ];

  // Setup Framer Motion scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Lock body scroll while splash is visible
  useEffect(() => {
    if (!isUnmounted) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isUnmounted]);

  // Loading timers
  useEffect(() => {
    const minTimer = setTimeout(() => setMinTimeElapsed(true), 1500);
    const loadTimer = setTimeout(() => {
      setAssetsLoaded(true);
      setProgress(100);
    }, 2000);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(loadTimer);
    };
  }, []);

  // Intervals for progress, time, and taglines
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 300);

    const timeInterval = setInterval(() => {
      setLoadingTime(prev => prev + 1000);
    }, 1000);

    const taglineInterval = setInterval(() => {
      setTaglineIndex(prev => (prev + 1) % taglines.length);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(timeInterval);
      clearInterval(taglineInterval);
    };
  }, []);

  // Fallback messages
  useEffect(() => {
    if (loadingTime >= 5000) {
      setLoadingMessage("Taking longer than usual... Please wait");
    }
    if (loadingTime >= 10000) {
      setShowReload(true);
    }
  }, [loadingTime]);

  const shouldHide = minTimeElapsed && assetsLoaded;

  return (
    <div className="relative min-h-screen bg-luxury-black text-luxury-light overflow-x-hidden selection:bg-gold-500 selection:text-luxury-black">
      
      {/* ── SPLASH / LOADING SCREEN ── */}
      {!isUnmounted && (
        <div 
          className={`splash-screen ${shouldHide ? 'fade-out' : ''} fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 select-none`}
          onTransitionEnd={(e) => {
            if (e.target === e.currentTarget && shouldHide) {
              setIsUnmounted(true);
            }
          }}
        >
          {/* Top Progress Bar */}
          <div 
            className="fixed top-0 left-0 h-[4px] bg-[#B8860B] transition-[width] duration-300 ease-out rounded-r-[2px]" 
            style={{ width: `${progress}%` }} 
          />

          {/* Glowing luxury icon spinner */}
          <div className="relative flex items-center justify-center w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-[#B8860B]/20 border-t-[#B8860B] shadow-[0_0_20px_rgba(184,134,11,0.2)] animate-[spinRing_1.5s_linear_infinite]" />
            <div className="animate-[pulseScale_1.5s_ease-in-out_infinite]">
              <Scissors className="w-6 h-6 text-[#B8860B] origin-center" style={{ animation: 'snip 2s ease-in-out infinite' }} />
            </div>
          </div>
          
          <div className="text-center space-y-2 flex flex-col items-center">
            <h2 className="font-playfair text-xl font-bold tracking-widest text-[#B8860B] uppercase">
              Killin Kutz
            </h2>
            <div className="h-4 relative flex justify-center items-center">
              <span 
                className="text-[11px] text-[#B8860B] font-bold uppercase tracking-[0.15em] block animate-[fadeTagline_2s_ease-in-out_infinite]"
                key={taglineIndex}
              >
                {taglines[taglineIndex]}
              </span>
            </div>
            
            {loadingMessage && !showReload && (
              <span className="text-xs text-[#3e2723]/60 mt-2 block font-medium">
                {loadingMessage}
              </span>
            )}

            {showReload && (
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-1.5 border border-[#B8860B] text-[#B8860B] text-xs uppercase tracking-widest rounded hover:bg-[#B8860B] hover:text-white transition-colors"
              >
                ↺ Reload Page
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── SCROLL PROGRESS INDICATOR ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold-500 via-gold-300 to-gold-600 z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* Sticky Top Header Navigation */}
      <Navbar />

      <main className="relative">
        {/* 1. Hero Section */}
        <Hero />

        {/* Short Action Bar linking to separated pages */}
        <div className="bg-[#0f0f13] border-y border-gold-500/10 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-6 sm:gap-12 text-sm uppercase tracking-widest font-bold text-[#d1d5db]">
            <Link href="/about" className="hover:text-gold-400 transition-colors flex items-center gap-2 group">
              Our Story <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/services" className="hover:text-gold-400 transition-colors flex items-center gap-2 group">
              Luxury Services <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/gallery" className="hover:text-gold-400 transition-colors flex items-center gap-2 group">
              Style Showcase <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/contact" className="hover:text-gold-400 transition-colors flex items-center gap-2 group">
              Contact Us <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Testimonials Section */}
        <TestimonialsSection />
      </main>

      {/* Footer credits, newsletter, links */}
      <Footer />



    </div>
  );
}
