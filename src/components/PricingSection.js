"use client";
import React from 'react';
import { Check, Sparkles, Scissors, Landmark } from 'lucide-react';
import Link from 'next/link';

export default function PricingSection() {
  const plans = [
    {
      name: "Basic Groom Plan",
      price: "₹75",
      period: "monthly",
      desc: "Perfect for maintaining a crisp, professional clean look.",
      icon: <Scissors className="w-5 h-5 text-gray-400" />,
      features: [
        "2 Precision haircuts with wash",
        "1 Hot-towel beard line-up",
        "Complimentary high-speed Wi-Fi",
        "Standard soft beverage bar",
        "Online calendar scheduling"
      ],
      popular: false,
      btnText: "Subscribe Basic"
    },
    {
      name: "Executive Premium",
      price: "₹140",
      period: "monthly",
      desc: "Our most sought-after styling membership.",
      icon: <Sparkles className="w-5 h-5 text-gold-400" />,
      features: [
        "4 Precision cuts with spa wash",
        "2 Hot-towel razor beard sculpts",
        "1 Detoxing charcoal face cleanup",
        "Complimentary single-malt drink",
        "Priority slot reservation",
        "10% Off styling store products"
      ],
      popular: true,
      btnText: "Join Executive Circle"
    },
    {
      name: "Royal Black VIP",
      price: "₹350",
      period: "monthly",
      desc: "Ultimate luxury. The pinnacle of personal branding.",
      icon: <Landmark className="w-5 h-5 text-gold-300" />,
      features: [
        "Unlimited haircuts & spa styling",
        "Unlimited straight-razor hot shaves",
        "Unlimited facials & scalp massages",
        "Private VIP grooming suite",
        "Unlimited top-shelf open bar",
        "Free guest grooming pass (1/mo)",
        "Dedicated master stylist assignment"
      ],
      popular: false,
      btnText: "Enter Royal Suite"
    }
  ];

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-luxury-dark/40">
      {/* Light spots */}
      <div className="absolute w-[30rem] h-[30rem] bg-gold-500/5 blur-[100px] rounded-full top-1/4 left-0 pointer-events-none" />
      <div className="absolute w-[25rem] h-[25rem] bg-gold-950/15 blur-[90px] rounded-full bottom-0 right-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            V.I.P. Memberships
          </div>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold tracking-tight text-luxury-light">
            Luxury Membership <span className="gold-gradient-text">Plans</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Subscribe to our seasonal membership plans to lock in your priority calendar slots, senior stylist consults, and access our VIP lounge amenities.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`glass rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative transition-all duration-350 hover:-translate-y-1 hover:shadow-2xl ${
                p.popular
                  ? 'border-gold-500/60 bg-gold-500/[0.03] shadow-[0_10px_35px_rgba(212,175,55,0.08)] ring-1 ring-gold-500/20'
                  : 'border-gold-500/5 shadow-xl'
              }`}
            >
              {/* Popular Tag */}
              {p.popular && (
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gold-500 text-luxury-black font-extrabold text-[9px] uppercase tracking-widest shadow-md">
                  Most Popular
                </span>
              )}

              {/* Title & Cost */}
              <div className="space-y-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                    {p.icon}
                  </div>
                  <h3 className="font-playfair text-lg sm:text-xl font-bold text-luxury-light">{p.name}</h3>
                </div>

                <p className="text-gray-500 text-xs sm:text-sm font-light leading-relaxed">{p.desc}</p>

                {/* Price block */}
                <div className="flex items-baseline gap-1 pt-2 border-b border-gray-900 pb-6">
                  <span className="text-4xl sm:text-5xl font-black text-luxury-light tracking-tight">{p.price}</span>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">/ {p.period}</span>
                </div>

                {/* Features List */}
                <ul className="space-y-3.5 pt-4">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-400 font-medium">
                      <Check className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Subscribe button */}
              <div className="pt-8 mt-6 border-t border-gray-900/60">
                <Link
                  href="/booking"
                  className={`w-full text-center py-3.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                    p.popular
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-luxury-black shadow-[0_4px_15px_rgba(212,175,55,0.3)]'
                      : 'bg-luxury-gray border border-gray-800 text-gray-400 hover:text-gold-400 hover:border-gold-500/30'
                  }`}
                >
                  {p.btnText}
                </Link>
              </div>

            </div>
          ))}
        </div>

        {/* Small T&C note */}
        <p className="text-center text-[10px] text-gray-600 mt-10">
          * Memberships can be paused or cancelled at any time through your User Dashboard. Billing is securely processed via credit card.
        </p>

      </div>
    </section>
  );
}
