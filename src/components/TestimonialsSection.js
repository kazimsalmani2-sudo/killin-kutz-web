"use client";
import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const reviews = [
    { 
      name: "Rahul M.", 
      service: "Executive Package", 
      stars: 5, 
      review: "Best grooming experience in Mumbai. The hot towel shave alone is worth every rupee." 
    },
    { 
      name: "Aditya K.", 
      service: "V.I.P. Platinum Package", 
      stars: 5, 
      review: "Marcus gave me the cleanest fade I've ever had. Will not go anywhere else." 
    },
    { 
      name: "Sameer T.", 
      service: "Luxury Facial", 
      stars: 5, 
      review: "The spa treatment was incredibly relaxing. Feels like a 5-star hotel experience." 
    }
  ];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-luxury-black">
      {/* Light highlights */}
      <div className="absolute w-96 h-96 bg-gold-500/5 blur-[120px] rounded-full top-10 left-10 pointer-events-none" />
      <div className="absolute w-[30rem] h-[30rem] bg-gold-950/15 blur-[110px] rounded-full bottom-10 right-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 text-xs font-bold tracking-widest uppercase">
            ⭐ Client Reviews
          </div>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold tracking-tight text-luxury-light">
            What Our <span className="gold-gradient-text">Clients Say</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed font-light">
            Read real comments from our esteemed V.I.P. guests who trust us for their grooming rituals.
          </p>
        </div>

        {/* 3 Review Cards with cream background, rounded corners, subtle gold border */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {reviews.map((r, i) => (
            <div 
              key={i} 
              className="p-8 rounded-3xl border border-[#D3C49B]/30 bg-[#FCFAF2] text-[#3B362E] shadow-2xl flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden"
            >
              {/* Quote background element for luxury feel */}
              <Quote className="absolute -top-2 -right-2 w-24 h-24 text-[#E5D7B7]/15 pointer-events-none" />

              <div className="space-y-4">
                {/* 5 gold stars */}
                <div className="flex gap-1">
                  {[...Array(r.stars)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 text-[#A58229] fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="font-sans text-[#3B362E] text-sm leading-relaxed italic">
                  "{r.review}"
                </p>
              </div>

              {/* Client Info */}
              <div className="mt-8 pt-6 border-t border-[#E8DEC1]/60 flex flex-col">
                <span className="font-playfair text-base font-bold text-[#2D2A26]">{r.name}</span>
                <span className="text-[10px] text-[#A58229] font-bold uppercase tracking-widest mt-1">
                  {r.service}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
