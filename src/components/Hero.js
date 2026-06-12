"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronDown, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  const [particles, setParticles] = React.useState([]);

  React.useEffect(() => {
    setParticles([...Array(12)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${2 + Math.random() * 3}s`,
      animationDelay: `${Math.random() * 5}s`
    })));
  }, []);

  const handleScrollDown = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-luxury-black overflow-hidden pt-20">
      {/* Background Zooming Salon Ambiance Image */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#FCFAF2]">
        {/* Soft light overlay to wash out the image and make text pop */}
        <div className="absolute inset-0 bg-[#FCFAF2]/50 z-10" />
        
        <motion.img
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 0.4 }}
          transition={{ 
            scale: { duration: 25, ease: "linear", repeat: Infinity, repeatType: "reverse" },
            opacity: { duration: 1.5, ease: "easeOut" }
          }}
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2074&auto=format&fit=crop"
          alt="Premium Salon Interior"
          className="w-full h-full object-cover select-none pointer-events-none origin-center mix-blend-luminosity"
        />
      </div>

      {/* Light orbs & Particle Effects */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        <div className="absolute w-[35rem] h-[35rem] bg-gold-500/5 blur-[120px] rounded-full -top-36 -left-36 animate-float-orb-1" />
        <div className="absolute w-[30rem] h-[30rem] bg-gold-950/20 blur-[100px] rounded-full top-1/2 right-0 translate-y-[-50%] animate-float-orb-2" />
        
        {/* Floating Gold Embers Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((style, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gold-400 opacity-40 animate-pulse"
              style={style}
            />
          ))}
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-6 sm:space-y-8 mt-8">
        
        {/* Gold Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs font-extrabold tracking-widest uppercase select-none"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-gold-300" />
          The Ultimate Grooming Landmark
        </motion.div>

        {/* Large Luxury Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="font-playfair text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-luxury-light leading-[1.05]"
        >
          Killin <span className="gold-gradient-text italic">Kutz</span> Salon
        </motion.h1>

        {/* Premium Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-2xl mx-auto text-base sm:text-xl lg:text-2xl text-gray-400 font-light tracking-wide leading-relaxed"
        >
          Premium Haircuts & Grooming Experience for the modern vanguard. Elevating cuts into a masterpiece of executive craft.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link
            href="/booking"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:opacity-90 text-luxury-black font-extrabold text-sm uppercase tracking-widest shadow-[0_4px_25px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_35px_rgba(212,175,55,0.55)] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-luxury-black" />
            Book Executive Session
          </Link>
          
          <Link
            href="/#services"
            onClick={(e) => {
              e.preventDefault();
              const servicesSec = document.getElementById('services');
              if (servicesSec) {
                const yOffset = -80;
                const y = servicesSec.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-gray-800 hover:border-gold-500/40 text-gray-300 hover:text-gold-400 bg-luxury-gray/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            Explore Services
          </Link>
        </motion.div>

      </div>

      {/* Animated Scroll Down Prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        onClick={handleScrollDown}
        className="absolute bottom-10 left-1/2 translate-x-[-50%] z-10 flex flex-col items-center gap-1 cursor-pointer text-gray-500 hover:text-gold-400 transition-colors"
      >
        <span className="text-[10px] font-bold tracking-widest uppercase opacity-75">Scroll Down</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </motion.div>
    </section>
  );
}
