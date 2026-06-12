"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ArrowRight, Tag } from 'lucide-react';

const SERVICES = [
  { id: 's1', name: "Executive Haircut", price: 1500 },
  { id: 's2', name: "Luxury Beard Sculpt", price: 800 },
  { id: 's3', name: "Charcoal Face Mask", price: 600 },
  { id: 's4', name: "Head Massage", price: 500 },
  { id: 's5', name: "Hair Spa", price: 1200 },
  { id: 's6', name: "Signature Facial", price: 2000 }
];

export default function PackageBuilder() {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (id) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(prev => prev.filter(s => s !== id));
    } else {
      setSelectedServices(prev => [...prev, id]);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    selectedServices.forEach(id => {
      const service = SERVICES.find(s => s.id === id);
      if (service) total += service.price;
    });
    return total;
  };

  const calculateDiscount = (total) => {
    const count = selectedServices.length;
    if (count >= 4) return total * 0.15; // 15% off
    if (count === 3) return total * 0.10; // 10% off
    if (count === 2) return total * 0.05; // 5% off
    return 0;
  };

  const baseTotal = calculateTotal();
  const discount = calculateDiscount(baseTotal);
  const finalPrice = baseTotal - discount;

  const handleBookPackage = () => {
    if (selectedServices.length === 0) return;
    const names = selectedServices.map(id => SERVICES.find(s => s.id === id).name).join(', ');
    router.push(`/booking?package=${encodeURIComponent(names)}&price=${finalPrice}`);
  };

  return (
    <section className="py-20 bg-luxury-black relative overflow-hidden" id="package-builder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/20 bg-gold-500/10 mb-6">
            <Tag className="w-4 h-4 text-gold-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-gold-500">VIP Offers</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-4 text-luxury-light">
            Build Your <span className="text-gold-500">Custom Package</span>
          </h2>
          <p className="text-gray-400">Combine services to unlock exclusive VIP discounts.</p>
          <div className="flex justify-center gap-4 mt-6 text-xs font-bold uppercase tracking-widest text-gray-400">
            <span>2 Services = 5% Off</span>
            <span className="text-gold-600">•</span>
            <span>3 Services = 10% Off</span>
            <span className="text-gold-600">•</span>
            <span>4+ Services = 15% Off</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Services Grid */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SERVICES.map(service => {
              const isSelected = selectedServices.includes(service.id);
              return (
                <div 
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex justify-between items-center ${
                    isSelected 
                      ? 'bg-gold-500/10 border-gold-500 shadow-[0_0_15px_rgba(212,175,55,0.2)]' 
                      : 'bg-[#111115] border-gray-800 hover:border-gold-500/30'
                  }`}
                >
                  <div>
                    <h4 className={`font-bold ${isSelected ? 'text-gold-500' : 'text-gray-200'}`}>{service.name}</h4>
                    <p className="text-gray-500 text-sm mt-1">₹{service.price}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${isSelected ? 'bg-gold-500 border-gold-500 text-black' : 'border-gray-600 text-transparent'}`}>
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Card */}
          <div className="w-full lg:w-1/3 bg-[#111115] rounded-3xl border border-gold-500/20 p-8 shadow-2xl sticky top-32">
            <h3 className="font-playfair text-2xl font-bold mb-6 text-luxury-light">Your Package</h3>
            
            {selectedServices.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-10 border border-dashed border-gray-800 rounded-xl">
                Select services to build your package.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2 mb-6">
                  {selectedServices.map(id => {
                    const service = SERVICES.find(s => s.id === id);
                    return (
                      <div key={id} className="flex justify-between text-sm">
                        <span className="text-gray-300">{service.name}</span>
                        <span className="text-gray-500">₹{service.price}</span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="pt-4 border-t border-gray-800 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-gray-400">₹{baseTotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm font-bold text-emerald-400">
                      <span>Package Discount</span>
                      <span>- ₹{discount}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-800 flex justify-between items-end">
                  <span className="text-sm font-bold text-gray-300 uppercase tracking-widest">Total</span>
                  <div className="text-right">
                    {discount > 0 && <span className="text-gray-500 line-through text-sm mr-2">₹{baseTotal}</span>}
                    <span className="text-3xl font-bold text-gold-500">₹{finalPrice}</span>
                  </div>
                </div>

                <button 
                  onClick={handleBookPackage}
                  className="w-full mt-8 py-4 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-luxury-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(212,175,55,0.25)] transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  Book This Package <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
