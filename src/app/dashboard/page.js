"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Scissors, Calendar, Receipt, LogOut, Trash2, Shield, AlertCircle, FileText, CheckCircle, RefreshCw, Eye, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  
  const [appointments, setAppointments] = useState([]);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  // Authenticate user & load their specific bookings
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login');
      } else {
        loadBookings();
      }
    }
  }, [user, authLoading]);

  const loadBookings = () => {
    setLoading(true);
    const allBookings = JSON.parse(localStorage.getItem('killinkutz_appointments') || '[]');
    
    // Filter by active client's email coordinates
    const userEmail = user?.email?.toLowerCase();
    const userBookings = allBookings.filter(b => b.email?.toLowerCase() === userEmail);
    
    // Reverse to show newest bookings first
    setAppointments(userBookings.reverse());
    setLoading(false);
  };

  const handleCancelAppointment = (id) => {
    const allBookings = JSON.parse(localStorage.getItem('killinkutz_appointments') || '[]');
    
    // Update appointment status to Cancelled in local storage
    const updated = allBookings.map(b => 
      b.id === id ? { ...b, status: 'Cancelled' } : b
    );
    
    localStorage.setItem('killinkutz_appointments', JSON.stringify(updated));
    setCancelTarget(null);
    if (selectedAppt?.id === id) {
      setSelectedAppt(prev => ({ ...prev, status: 'Cancelled' }));
    }
    loadBookings();
  };

  const statusStyles = {
    Confirmed: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    Cancelled: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-400' },
    Completed: { bg: 'bg-gold-500/10', border: 'border-gold-500/30', text: 'text-gold-400', dot: 'bg-gold-500' }
  };

  const totalCount = appointments.length;
  const upcomingCount = appointments.filter(a => a.status === 'Confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-gold-500/10 border-t-gold-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black text-luxury-light flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Background radial effects */}
      <div className="absolute w-[35rem] h-[35rem] bg-gold-500/5 blur-[120px] rounded-full -top-24 -left-36 pointer-events-none" />
      <div className="absolute w-[30rem] h-[30rem] bg-gold-950/10 blur-[100px] rounded-full bottom-0 right-0 pointer-events-none" />

      {/* Main Content */}
      <main className="flex-grow pt-32 pb-24 relative z-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        
        {/* Header Dashboard section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-gray-900 pb-8 mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">VIP Client Room</span>
            </div>
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold tracking-tight text-luxury-light">
              Welcome, <span className="gold-gradient-text">{user.name}</span>
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm font-light">Track and manage all your booked luxury styling sessions.</p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/booking"
              className="py-3 px-5 rounded-full bg-gold-500 hover:bg-gold-400 text-luxury-black text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition-all duration-300"
            >
              <Calendar className="w-3.5 h-3.5" />
              Book New Session
            </Link>
            <button
              onClick={logout}
              className="py-3 px-4 rounded-full border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-10">
          {[
            { label: 'Total Bookings', value: totalCount, color: 'text-luxury-light' },
            { label: 'Upcoming Slots', value: upcomingCount, color: 'text-emerald-400' },
            { label: 'Completed Care', value: completedCount, color: 'text-gold-400' }
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-4 sm:p-6 text-center border border-gold-500/5 shadow-md">
              <span className={`text-2xl sm:text-3xl font-extrabold ${stat.color}`}>{stat.value}</span>
              <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-1.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Bookings List Layout */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-900 pb-3">
            <h3 className="font-playfair text-lg font-bold text-luxury-light flex items-center gap-2">
              <Scissors className="w-4 h-4 text-gold-400" />
              Appointment History
            </h3>
            <button
              onClick={loadBookings}
              className="text-[10px] text-gray-500 hover:text-gold-400 font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-gold-500/20 border-t-gold-500 animate-spin mx-auto" />
            </div>
          ) : appointments.length === 0 ? (
            /* Empty State */
            <div className="glass rounded-3xl p-12 text-center border border-gold-500/5 shadow-lg space-y-6">
              <div className="w-16 h-16 rounded-full bg-gold-500/5 border border-gold-500/10 flex items-center justify-center mx-auto text-gold-400/40">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="font-playfair text-lg font-bold text-luxury-light">No Appointments Yet</h4>
                <p className="text-gray-500 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
                  You haven't reserved any grooming sessions yet. Book your first session to unlock VIP rewards.
                </p>
              </div>
              <Link
                href="/booking"
                className="inline-flex py-3.5 px-6 rounded-full bg-gold-500 hover:bg-gold-400 text-luxury-black text-xs font-bold uppercase tracking-wider shadow-lg transition-all"
              >
                Schedule First Appointment
              </Link>
            </div>
          ) : (
            /* Active booking cards */
            <div className="space-y-4">
              {appointments.map((appt) => {
                const sc = statusStyles[appt.status] || statusStyles.Confirmed;
                return (
                  <div
                    key={appt.id}
                    onClick={() => setSelectedAppt(appt)}
                    className="glass rounded-2xl p-5 sm:p-6 border border-gold-500/5 hover:border-gold-500/20 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gold-500/5 border border-gold-500/15 flex items-center justify-center text-gold-400 shrink-0">
                        <Scissors className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm sm:text-base text-luxury-light group-hover:text-gold-400 transition-colors">
                          {appt.service}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Stylist: <span className="text-gray-300 font-semibold">{appt.stylist}</span>
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {appt.date} &nbsp;·&nbsp; {appt.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-gray-900/60 pt-3 sm:pt-0 gap-3">
                      <span className="font-extrabold text-gold-400 text-base">{appt.servicePrice}</span>
                      
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold border ${sc.bg} ${sc.border} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {appt.status}
                        </span>
                        
                        <span className="text-[10px] text-gray-600 font-bold group-hover:text-gold-400 group-hover:translate-x-0.5 transition-all">
                          Details →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>

      <Footer />

      {/* ── BOOKING DETAIL RECEIPT MODAL ── */}
      {selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedAppt(null)}>
          <div
            className="glass rounded-3xl border border-gold-500/20 max-w-md w-full overflow-hidden shadow-2xl relative animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-luxury-dark px-6 py-4 border-b border-gold-500/10 flex justify-between items-center">
              <div>
                <h4 className="font-playfair text-base font-bold text-luxury-light">{selectedAppt.service}</h4>
                <p className="text-[10px] text-gold-400 font-bold">Booking ID: #{selectedAppt.bookingId}</p>
              </div>
              <button
                onClick={() => setSelectedAppt(null)}
                className="w-8 h-8 rounded-full bg-luxury-gray hover:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-luxury-light transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4">
              {/* Status Badge */}
              <div className="flex justify-between items-center border-b border-gray-900 pb-3">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Status</span>
                {(() => {
                  const sc = statusStyles[selectedAppt.status] || statusStyles.Confirmed;
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${sc.bg} ${sc.border} ${sc.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {selectedAppt.status}
                    </span>
                  );
                })()}
              </div>

              {/* Specific info rows */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-900/40">
                  <span className="text-gray-500">Stylist:</span>
                  <span className="font-bold text-gray-300">{selectedAppt.stylist}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-900/40">
                  <span className="text-gray-500">Scheduled Date:</span>
                  <span className="font-bold text-gray-300">{selectedAppt.date}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-900/40">
                  <span className="text-gray-500">Time Slot:</span>
                  <span className="font-bold text-gray-300">{selectedAppt.time}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-900/40">
                  <span className="text-gray-500">Amount Charged:</span>
                  <span className="font-bold text-gold-400">{selectedAppt.servicePrice}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-900/40">
                  <span className="text-gray-500">Booked On:</span>
                  <span className="font-bold text-gray-400">{selectedAppt.bookedOn}</span>
                </div>
                {selectedAppt.notes && (
                  <div className="pt-2">
                    <span className="text-gray-500 block mb-1">Styling Notes:</span>
                    <p className="p-3 bg-luxury-gray/80 rounded-xl text-gray-400 italic text-[11px] leading-relaxed border border-gray-900">
                      {selectedAppt.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Barcode representation */}
              <div className="pt-4 flex flex-col items-center gap-1 text-center border-t border-gray-900">
                <div className="h-7 w-full flex items-center justify-center gap-[2px] opacity-25">
                  {[...Array(30)].map((_, idx) => (
                    <span key={idx} className="h-full bg-luxury-light" style={{ width: `${idx % 3 === 0 ? '3px' : '1px'}` }} />
                  ))}
                </div>
                <span className="text-[8px] font-mono text-gray-600 tracking-wider">ENTRY-PASS-APPROVED</span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="bg-luxury-dark p-6 border-t border-gold-500/10 flex gap-3">
              {selectedAppt.status === 'Confirmed' && (
                <button
                  onClick={() => setCancelTarget(selectedAppt.id)}
                  className="flex-1 py-3 rounded-full border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Cancel Slot
                </button>
              )}
              <button
                onClick={() => setSelectedAppt(null)}
                className="flex-1 py-3 rounded-full bg-gold-500 hover:bg-gold-400 text-luxury-black text-xs font-bold uppercase tracking-widest shadow-lg cursor-pointer"
              >
                Close Ticket
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── CANCEL CONFIRMATION MODAL ── */}
      {cancelTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="glass border border-red-500/30 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4 text-red-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h4 className="font-playfair text-lg font-bold text-luxury-light">Cancel Appointment?</h4>
            <p className="text-gray-500 text-xs mt-2 mb-6 leading-relaxed">
              Are you sure you want to cancel this booking? This slot will immediately be re-opened for active guests.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelTarget(null)}
                className="flex-1 py-3 rounded-full border border-gray-800 text-gray-400 hover:text-luxury-light text-xs font-bold uppercase tracking-widest cursor-pointer"
              >
                Keep Slot
              </button>
              <button
                onClick={() => handleCancelAppointment(cancelTarget)}
                className="flex-1 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-widest shadow-lg cursor-pointer"
              >
                Cancel Slot
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
