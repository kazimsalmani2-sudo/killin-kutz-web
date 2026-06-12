"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye, Scissors, MoveHorizontal } from 'lucide-react';

export default function GallerySection() {
  // Before / After Slider States
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (50% is center)
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  const galleryItems = [
    { id: 1, title: "Precision Pompadour", type: "Classic Cut", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=400&auto=format&fit=crop" },
    { id: 2, title: "Metallic Platinum Highlights", type: "Hair Coloring", image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=400&auto=format&fit=crop" },
    { id: 3, title: "Traditional Razor Outline", type: "Hot Beard Shave", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=400&auto=format&fit=crop" },
    { id: 4, title: "Skin Fade Crop", type: "Modern Styling", image: "https://images.unsplash.com/photo-1512690118275-1100023f50bc?q=80&w=400&auto=format&fit=crop" },
    { id: 5, title: "Clarifying Herbal Hair Spa", type: "Deep Treatment", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=400&auto=format&fit=crop" },
    { id: 6, title: "The Executive Full Set", type: "VIP Grooming", image: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=400&auto=format&fit=crop" }
  ];

  // Handle Before/After drag events
  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let position = (x / rect.width) * 100;
    if (position < 0) position = 0;
    if (position > 100) position = 100;
    setSliderPosition(position);
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const stopDragging = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const handleMouseUpGlobal = () => stopDragging();
    window.addEventListener('mouseup', handleMouseUpGlobal);
    return () => window.removeEventListener('mouseup', handleMouseUpGlobal);
  }, []);

  return (
    <section id="gallery" className="py-24 relative overflow-hidden bg-luxury-dark/30">
      {/* Background ambient orbs */}
      <div className="absolute w-96 h-96 bg-gold-500/5 blur-[120px] rounded-full top-10 right-0 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-gold-950/15 blur-[100px] rounded-full -left-20 bottom-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Style Showcase
          </div>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold tracking-tight text-luxury-light">
            Lounge <span className="gold-gradient-text">Showcase</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed font-light">
            Take a look at the artistry behind our custom styling. Explore the visual catalog of haircuts, treatments, and our luxury shop atmosphere.
          </p>
        </div>

        {/* ── BEFORE / AFTER INTERACTIVE SLIDER REPLACED WITH SLEEK CARD ── */}
        <div className="mb-20 max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-[#A58229] uppercase tracking-widest flex items-center justify-center gap-1">
              <Scissors className="w-3.5 h-3.5 text-gold-500" />
              Client Transformations
            </span>
            <h3 className="font-playfair text-xl sm:text-2xl font-bold text-luxury-light">
              Grooming Transitions
            </h3>
          </div>

          {/* Placeholder Card styled in gold theme with cream/off-white details */}
          <div className="p-12 rounded-3xl border border-[#D3C49B]/40 bg-[#FCFAF2] text-[#3B362E] text-center shadow-2xl flex flex-col items-center justify-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold text-[#A58229] uppercase tracking-widest flex items-center justify-center gap-1">
              ⭐ Client Transformations
            </span>
            <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#2D2A26]">
              Real client transformations coming soon — visit us to see the difference.
            </h3>
            <p className="text-[#6F6656] text-xs leading-relaxed max-w-md">
              Our executive stylists are crafting clean transitions and premium sculpts daily. Check back soon for high-resolution galleries of our real client updates.
            </p>
            {/* TODO: Replace with real before/after client photos */}
          </div>
        </div>

        {/* ── MASONRY IMAGE GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="glass rounded-3xl overflow-hidden h-72 relative group border border-gold-500/5 hover:border-gold-500/40 shadow-xl transition-all duration-350"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-750"
              />

              {/* Dim overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-luxury-black/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-350 z-10" />

              {/* Hover content details */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end z-20 translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                <div className="space-y-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="inline-block text-[9px] font-bold text-gold-400 uppercase tracking-widest border border-gold-500/20 bg-gold-500/5 px-2 py-0.5 rounded">
                    {item.type}
                  </span>
                  <h4 className="font-playfair text-lg font-bold text-luxury-light">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold uppercase tracking-wider pt-2">
                    <Eye className="w-3.5 h-3.5 text-gold-500" />
                    Enlarge Close Up
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
