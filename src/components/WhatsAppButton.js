"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  const url = "https://wa.me/917678037492";

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 260, damping: 20 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group flex items-center justify-center w-[56px] h-[56px] rounded-full bg-[#25D366] text-white shadow-[0_4px_15px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_25px_rgba(37,211,102,0.6)] border border-[#25D366]/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        title="Chat with us on WhatsApp"
      >
        {/* Pulsing ring indicator */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
        
        {/* White WhatsApp SVG Icon */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="28" 
          height="28" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-white fill-current"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
        
        {/* Tooltip */}
        <span className="absolute right-16 px-3 py-1.5 rounded-lg bg-[#FCFAF2] text-[#A58229] border border-[#E8DEC1] text-xs font-semibold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl translate-x-2 group-hover:translate-x-0">
          Chat with us on WhatsApp
        </span>
      </a>
    </motion.div>
  );
}
