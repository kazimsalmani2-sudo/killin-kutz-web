"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Clock, Calendar, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ServicesSection() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Grooming' },
    { id: 'cuts', label: 'Cuts & Shaves' },
    { id: 'spa', label: 'Spa & Care' },
    { id: 'packages', label: 'V.I.P. Packages' }
  ];

  const services = [
    {
      id: '1',
      name: 'Haircut & Styling',
      category: 'cuts',
      price: '₹250',
      duration: '30 min',
      desc: 'Precision scissors and clipper work, complete with shampoo, scalp conditioning, and professional styling.',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=400&auto=format&fit=crop',
      features: ['Facial Outline Consult', 'Scalp Clarifying Wash', 'Hot Towel Massage']
    },
    {
      id: '2',
      name: 'Beard Styling & Hot Towel Shave',
      category: 'cuts',
      price: '₹150',
      duration: '25 min',
      desc: 'Detailed razor framing, trimming, hot-towel steam wraps, skin hydration, and aromatic conditioning.',
      image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=400&auto=format&fit=crop',
      features: ['Straight-Razor Definition', 'Aromatic Oil Massage', 'Cold Sponge Seal']
    },
    {
      id: '3',
      name: 'Hair + Beard Combo',
      category: 'cuts',
      price: '₹350',
      duration: '50 min',
      desc: 'The ultimate essential package combining precision haircutting with tailored beard sculpting and shaves.',
      image: 'https://images.unsplash.com/photo-1512690118275-1100023f50bc?q=80&w=400&auto=format&fit=crop',
      features: ['Precision Haircut', 'Razor Beard Sculpting', 'Hot Towel Shoulder Massage']
    },
    {
      id: '4',
      name: "Men's Facial & Grooming",
      category: 'spa',
      price: '₹800',
      duration: '60 min',
      desc: 'Deep skin cleansing, organic pore vacuuming, botanical clay masks, and relaxing facial massage.',
      image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=400&auto=format&fit=crop',
      features: ['Active Pore Vacuum', 'Cooling Clay Mask', 'Botanical Hydration']
    },
    {
      id: '5',
      name: 'Head Spa & Massage',
      category: 'spa',
      price: '₹1500',
      duration: '90 min',
      desc: 'Deep root hydration treatment, essential oil massage, structural therapy, and premium relaxation scalp spa.',
      image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=400&auto=format&fit=crop',
      features: ['Intense Scalp Steam', 'Hot Oil Root Massage', 'Frizz-Free Blowdry']
    },
    {
      id: '6',
      name: 'Luxury Facial & Cleanup',
      category: 'spa',
      price: '₹1200',
      duration: '60 min',
      desc: 'Advanced facial detailing including herbal clay scrubs, anti-tan cleanup, detan wraps, and steam massage.',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400&auto=format&fit=crop',
      features: ['Herbal Scrub Exfoliation', 'Anti-tan Cleanup', 'Detox Skin Steam']
    },
    {
      id: '7',
      name: 'Manicure & Pedicure',
      category: 'spa',
      price: '₹800',
      duration: '75 min',
      desc: 'Luxury hand and foot detailing, exfoliation, cuticle treatment, and relaxing stress-relief massage.',
      image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?q=80&w=400&auto=format&fit=crop',
      features: ['Salt Water Exfoliation', 'Nail Detailing & Polish', 'Relaxing Hand/Foot Massage']
    },
    {
      id: '8',
      name: 'Executive Package',
      category: 'packages',
      price: '₹1800',
      originalPrice: '₹2000',
      saveBadge: 'SAVE 10%',
      duration: '120 min',
      desc: 'Haircut + Beard + Facial',
      image: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=400&auto=format&fit=crop',
      features: ['Premium Precision Haircut', 'Classic Beard Sculpting & Shave', "Men's Facial & Grooming"]
    },
    {
      id: '9',
      name: 'Platinum Groom Package',
      category: 'packages',
      price: '₹2800',
      originalPrice: '₹3500',
      saveBadge: 'SAVE 20%',
      duration: '180 min',
      desc: 'All Services',
      image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=400&auto=format&fit=crop',
      features: ['Haircut & Styling', 'Beard Styling & Shave', "Men's Facial & Cleanup", 'Head Spa & Massage', 'Manicure & Pedicure']
    },
    {
      id: '10',
      name: 'Spa Day Package',
      category: 'packages',
      price: '₹2500',
      originalPrice: '₹3100',
      saveBadge: 'SAVE 19%',
      duration: '150 min',
      desc: 'Facial + Head Spa + Manicure',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400&auto=format&fit=crop',
      features: ['Luxury Facial & Cleanup', 'Head Spa & Massage', 'Manicure & Pedicure']
    }
  ];

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(s => s.category === activeCategory);

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-luxury-black">
      {/* Dynamic ambient lights */}
      <div className="absolute w-[35rem] h-[35rem] bg-gold-500/5 blur-[120px] rounded-full top-0 left-1/4 pointer-events-none" />
      <div className="absolute w-[30rem] h-[30rem] bg-gold-950/15 blur-[100px] rounded-full bottom-0 right-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Our Masterpieces
          </div>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold tracking-tight text-luxury-light">
            Luxury Grooming <span className="gold-gradient-text">Menu</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Choose from our highly specialized grooming treatments. Every service is tailored with premium, organic formulas and elite craftsmanship.
          </p>
        </div>

        {/* Categories Tab Swapper */}
        <div className="flex justify-center gap-2.5 mb-16 overflow-x-auto pb-3 pr-2 scroll-smooth no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`shrink-0 px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 border ${
                activeCategory === c.id
                  ? 'bg-gold-500 border-transparent text-luxury-black shadow-[0_4px_15px_rgba(212,175,55,0.3)]'
                  : 'bg-luxury-gray/60 border-gold-500/10 text-gray-500 hover:text-gold-400 hover:border-gold-500/30'
              } cursor-pointer`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Active Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map((s, index) => {
              const isPackage = s.category === 'packages';
              return (
                <motion.div
                  layout
                  key={s.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="glass rounded-3xl overflow-hidden group flex flex-col justify-between hover:border-gold-500/40 hover:-translate-y-1 transition-all duration-350 shadow-lg relative"
                >
                  {/* Image background wrapper */}
                  <div className="h-56 overflow-hidden relative border-b border-gold-500/10">
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 to-transparent opacity-60 z-10" />
                    <img
                      src={s.image}
                      alt={s.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Price bubble / Packages total price & strikethrough original price */}
                    {isPackage ? (
                      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-[#FCFAF2] border border-gold-500/35 px-3.5 py-1.5 rounded-xl shadow-lg">
                        <span className="text-xs text-gray-500 line-through font-semibold">{s.originalPrice}</span>
                        <span className="text-sm font-extrabold text-[#A58229]">{s.price}</span>
                      </div>
                    ) : (
                      <span className="absolute bottom-4 right-4 z-20 px-3.5 py-1.5 rounded-xl bg-luxury-black/95 border border-gold-500/35 font-extrabold text-gold-400 text-base shadow-lg">
                        {s.price}
                      </span>
                    )}
                    
                    {/* Save Badge for packages */}
                    {isPackage && (
                      <span className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-gold-500 text-luxury-black font-extrabold text-[10px] uppercase tracking-widest shadow-md">
                        {s.saveBadge}
                      </span>
                    )}
                    
                    {/* Duration overlay */}
                    <span className="absolute bottom-4 left-4 z-20 text-[10px] font-bold text-gray-400 flex items-center gap-1 bg-luxury-black/75 px-2.5 py-1 rounded-lg border border-gray-800">
                      <Clock className="w-3.5 h-3.5 text-gold-500" />
                      {s.duration}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-playfair text-xl font-bold text-luxury-light group-hover:text-gold-400 transition-colors">
                        {s.name}
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-light">
                        {s.desc}
                      </p>
                      
                      {/* Bullet features */}
                      <ul className="space-y-2 pt-2 border-t border-gray-900/60">
                        {s.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                            <CheckCircle className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href="/booking"
                      className="w-full text-center py-3.5 rounded-full border border-gold-500/20 text-gold-400 hover:text-luxury-black hover:bg-gold-500 hover:border-transparent text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow-[0_4px_15px_rgba(212,175,55,0.2)]"
                    >
                      {isPackage ? 'Book This Package →' : 'Reserve Slot'}
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Services CTA Banner */}
        <div className="mt-20 glass rounded-3xl p-8 sm:p-12 text-center border border-gold-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-500/[0.02] via-gold-500/[0.05] to-gold-500/[0.02] z-0" />
          <div className="relative z-10 space-y-6">
            <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-luxury-light">
              Desire a Bespoke Treatment Package?
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              We provide private consultations for weddings, bridal coordinates, and VIP group sessions. Get in touch to schedule a custom luxury grooming layout.
            </p>
            <Link
              href="/#contact"
              onClick={(e) => {
                e.preventDefault();
                const contactSec = document.getElementById('contact');
                if (contactSec) {
                  const yOffset = -80;
                  const y = contactSec.getBoundingClientRect().top + window.pageYOffset + yOffset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gold-500 hover:bg-gold-400 text-luxury-black font-extrabold text-xs uppercase tracking-widest shadow-lg hover:shadow-[0_4px_20px_rgba(212,175,55,0.35)] transition-all cursor-pointer"
            >
              Contact Event Planner
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
