"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Scissors, Sparkles, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Hello there! I am KUTZ-AI, your digital concierge. Welcome to Killin Kutz. How can I assist you with your premium grooming experience today?`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = [
    { label: "Book Appointment 📅", query: "I would like to book an appointment." },
    { label: "Pricing & Services 💇‍♂️", query: "What are your services and prices?" },
    { label: "Lounge Location 📍", query: "Where are you located and what are your hours?" },
    { label: "Special Offers 💎", query: "Do you have any VIP membership plans?" }
  ];

  const handleSendMessage = (textToSend) => {
    if (!textToSend.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      let replyText = "";
      const lower = textToSend.toLowerCase();

      if (lower.includes('book') || lower.includes('appointment') || lower.includes('schedule')) {
        replyText = `Absolutely! You can book an appointment in seconds by clicking the 'Book Now' button in the navbar, or visiting our booking form directly at /booking. We let you choose your favorite stylist, date, time, and service. Let me know if you need help picking a stylist!`;
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('services') || lower.includes('haircut')) {
        replyText = `We offer a wide range of luxury treatments! Key highlights include:\n\n• Haircut & Styling: ₹250 (30 mins)\n• Beard Styling & Hot Towel Shave: ₹150 (25 mins)\n• Executive Styling Package: ₹1800 (120 mins)\n• Head Spa & Massage: ₹1500 (90 mins)\n\nYou can review all of these in our interactive Services section!`;
      } else if (lower.includes('location') || lower.includes('where') || lower.includes('address') || lower.includes('hours') || lower.includes('time')) {
        replyText = `We are located at 2nd Rd, opposite Mani's Lunch Home, Kandhari Colony, Chembur Gaothan, Chembur, Mumbai, Maharashtra 400071.\n\nOur hours are:\n• Mon - Sun: 10:00 AM - 8:00 PM`;
      } else if (lower.includes('membership') || lower.includes('vip') || lower.includes('special') || lower.includes('offer')) {
        replyText = `Yes! We offer exclusive VIP packages:\n\n• Basic Groom Plan (₹75/mo): 2 haircuts, 1 beard line-up\n• Executive Premium (₹140/mo): 4 haircuts, 2 beard sculpts, charcoal detan\n• Royal Black VIP (₹350/mo): Unlimited grooming, private VIP suite, top shelf bar access.\n\nReview them in detail at our Pricing section!`;
      } else if (lower.includes('stylist') || lower.includes('barber') || lower.includes('team')) {
        replyText = `Our lounge features world-renowned stylists: Marcus (Fades & Tapers expert), Dev (Beard Sculpting), Jordan (Spa & Treatments), and Ricky (VIP Packages). You can select your stylist directly inside our booking flow!`;
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        replyText = `Hello! Hope you are having a stylish day. What grooming advice or appointment assistance do you need?`;
      } else {
        replyText = `That sounds interesting! Our expert team is ready to deliver the best results. To secure a slot or discuss custom requirements, we recommend booking a short consultation session at /booking or calling us at +91 76780 37492.`;
      }

      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'bot',
        text: replyText,
        timestamp: new Date()
      }]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-24 z-40">
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-luxury-black shadow-[0_4px_25px_rgba(212,175,55,0.4)] flex items-center justify-center cursor-pointer transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6 fill-current" />}
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute bottom-18 right-0 w-[350px] sm:w-[400px] h-[550px] rounded-3xl glass border border-gold-500/20 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-gold-500/10 bg-luxury-dark/90 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h3 className="font-playfair font-bold text-sm text-gold-400 tracking-wide flex items-center gap-1.5">
                    Kutz concierge
                    <Sparkles className="w-3.5 h-3.5 text-gold-300 animate-pulse" />
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    AI Stylist Active
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-luxury-light transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.sender === 'user' 
                      ? 'bg-gold-500/10 border-gold-500/30 text-gold-400' 
                      : 'bg-luxury-gray border-gray-800 text-gray-400'
                  }`}>
                    {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Scissors className="w-3.5 h-3.5" />}
                  </div>
                  <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-luxury-black font-medium rounded-tr-none'
                      : 'bg-luxury-gray/90 text-gray-300 border border-gray-800/80 rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className="block text-[8px] mt-1.5 text-right opacity-60">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-luxury-gray border border-gray-800 flex items-center justify-center text-gray-400 text-xs">
                    <Scissors className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-luxury-gray/90 border border-gray-800 px-4 py-3.5 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    {[...Array(3)].map((_, i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompt Pill Buttons */}
            {messages.length === 1 && (
              <div className="px-5 py-2.5 bg-luxury-dark/40 border-t border-gold-500/5 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt.query)}
                    className="shrink-0 px-3 py-1.5 rounded-full bg-luxury-gray hover:bg-gold-500/10 border border-gray-800 hover:border-gold-500/30 text-[10px] sm:text-xs text-gray-400 hover:text-gold-400 transition-all cursor-pointer"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="p-4 border-t border-gold-500/10 bg-luxury-dark/90 flex gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about booking or services..."
                className="flex-1 px-4 py-3 rounded-full bg-luxury-gray/80 border border-gray-800 text-xs focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 text-luxury-light"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-luxury-black hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4 fill-current" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
