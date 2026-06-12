"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, Award, Heart, Star, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutSection() {
  const team = [
    {
      name: "Marcus Vance",
      role: "Founder & Master Barber",
      desc: "Specializes in traditional hot-towel razor shaves, line-ups, and structural hair crafting.",
      exp: "15+ Years Experience",
      rating: "4.9",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"
    },
    {
      name: "Arthur Pendelton",
      role: "Senior Styling Director",
      desc: "Expert in luxury hair coloring, high-fashion cuts, texture reconstruction, and balayage.",
      exp: "10+ Years Experience",
      rating: "4.8",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop"
    },
    {
      name: "Chloe Sterling",
      role: "Therapeutic Specialist",
      desc: "Deep head massage expert, signature organic hair spa treatments, and clarifying facial care.",
      exp: "8+ Years Experience",
      rating: "5.0",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop"
    }
  ];

  const values = [
    { icon: <Trophy className="w-5 h-5 text-gold-400" />, title: "Precision Excellence", desc: "Every cut is a handcrafted artwork designed to match your skeletal facial profile." },
    { icon: <Award className="w-5 h-5 text-gold-400" />, title: "Elite Hospitality", desc: "Relax with standard single-malt beverages, high-speed Wi-Fi, and private premium lounge chairs." },
    { icon: <Heart className="w-5 h-5 text-gold-400" />, title: "Organic Care", desc: "We formulate grooming treatments exclusively using botanical botanical ingredients." }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-luxury-dark/40">
      {/* Background orbs */}
      <div className="absolute w-[25rem] h-[25rem] bg-gold-500/5 blur-[90px] rounded-full top-1/4 -right-36 pointer-events-none" />
      <div className="absolute w-[30rem] h-[30rem] bg-gold-950/10 blur-[110px] rounded-full -bottom-24 left-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Story Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          
          {/* Left: Imagery Grid */}
          <div className="relative grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="h-64 rounded-3xl overflow-hidden border border-gold-500/10 shadow-xl group">
                <img
                  src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=500&auto=format&fit=crop"
                  alt="Styling Cut"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="h-44 rounded-3xl overflow-hidden border border-gold-500/10 shadow-xl group">
                <img
                  src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=500&auto=format&fit=crop"
                  alt="Razor Shave"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="h-44 rounded-3xl overflow-hidden border border-gold-500/10 shadow-xl group">
                <img
                  src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=500&auto=format&fit=crop"
                  alt="Clarifying Facial"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="h-64 rounded-3xl overflow-hidden border border-gold-500/10 shadow-xl group">
                <img
                  src="https://images.unsplash.com/photo-1512690118275-1100023f50bc?q=80&w=500&auto=format&fit=crop"
                  alt="Interior"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            {/* Absolute badge */}
            <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] p-6 rounded-2xl glass border border-gold-500/20 shadow-2xl text-center select-none pointer-events-none hidden sm:block">
              <span className="font-playfair text-3xl font-extrabold text-gold-400">10+</span>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Awards Won</p>
            </div>
          </div>

          {/* Right: Content */}
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 text-xs font-bold tracking-widest uppercase">
                <Sparkles className="w-3 h-3" />
                Salon Story
              </div>
              <h2 className="font-playfair text-4xl sm:text-5xl font-bold tracking-tight text-luxury-light">
                Crafting Grooming into a <span className="gold-gradient-text">Premium Ritual</span>
              </h2>
            </div>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Founded on the belief that a grooming appointment should be an experience rather than a task, Killin Kutz Salon was created to offer an oasis of luxury. We blend classical barbering traditions with high-fashion salon advancements to provide grooming services tailored specifically to your personality.
            </p>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Our lounge is meticulously detailed, showcasing rich mahogany furniture, glassmorphic partitions, custom high-fidelity speakers, and private grooming chairs that grant complete relaxation.
            </p>
            
            {/* Value columns */}
            <div className="grid grid-cols-1 gap-4 pt-4">
              {values.map((v, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl glass hover:border-gold-500/30 transition-all duration-350">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
                    {v.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-luxury-light uppercase tracking-wide">{v.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
