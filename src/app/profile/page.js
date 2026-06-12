"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User as UserIcon, CalendarDays, Award, Settings, Phone, Mail, ArrowRight, History, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function UserProfile() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [appointments, setAppointments] = useState([]);
  
  // Profile form state
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login');
      } else {
        setFormData({ name: user.name, phone: user.phone || '', email: user.email });
        loadUserAppointments();
      }
    }
  }, [user, authLoading, router]);

  const loadUserAppointments = () => {
    const allBookings = JSON.parse(localStorage.getItem('killinkutz_appointments') || '[]');
    // Filter bookings belonging to this user
    const userBookings = allBookings.filter(b => b.email === user?.email);
    setAppointments(userBookings.reverse());
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Update logic for localStorage (Phase 1)
    const registeredUsers = JSON.parse(localStorage.getItem('killinkutz_registered_users') || '[]');
    const updatedUsers = registeredUsers.map(u => 
      u.email === user.email ? { ...u, name: formData.name, phone: formData.phone } : u
    );
    localStorage.setItem('killinkutz_registered_users', JSON.stringify(updatedUsers));
    
    const activeUser = { ...user, name: formData.name, phone: formData.phone };
    localStorage.setItem('killinkutz_user', JSON.stringify(activeUser));
    
    alert('Profile updated successfully!');
    window.location.reload();
  };

  const cancelAppointment = (id) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      const allBookings = JSON.parse(localStorage.getItem('killinkutz_appointments') || '[]');
      const updated = allBookings.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b);
      localStorage.setItem('killinkutz_appointments', JSON.stringify(updated));
      loadUserAppointments();
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-gold-500/10 border-t-gold-500 animate-spin" />
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending');
  const pastAppointments = appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled');

  return (
    <div className="min-h-screen bg-luxury-black text-luxury-light flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 max-w-6xl mx-auto w-full px-4 sm:px-6">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gray-200/20 pb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gold-500/20 border-2 border-gold-500 flex items-center justify-center text-3xl font-playfair font-bold text-gold-600">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-playfair font-bold">{user.name}</h1>
              <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest flex items-center gap-2">
                <Award className="w-4 h-4 text-gold-500" /> VIP Member
              </p>
            </div>
          </div>
          
          <div className="bg-luxury-gray p-4 rounded-2xl border border-gray-300 min-w-[200px] text-center shadow-md">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Loyalty Points</p>
            <p className="text-4xl font-bold text-gold-600 my-1">120</p>
            <p className="text-[10px] text-gray-400">₹60 value on next visit</p>
          </div>
        </div>

        {/* Layout: Sidebar + Content */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Tabs Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all ${
                activeTab === 'profile' ? 'bg-gold-500 text-white shadow-lg' : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200'
              }`}
            >
              <UserIcon className="w-5 h-5" /> My Profile
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all ${
                activeTab === 'appointments' ? 'bg-gold-500 text-white shadow-lg' : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200'
              }`}
            >
              <CalendarDays className="w-5 h-5" /> Appointments
            </button>
            
            <div className="pt-8">
              <button
                onClick={logout}
                className="text-xs text-red-500 hover:text-red-700 font-bold uppercase tracking-widest px-5 py-2 w-full text-left"
              >
                Logout Account
              </button>
            </div>
          </aside>

          {/* Tab Content */}
          <div className="flex-1">
            
            {/* MY PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl animate-[fadeIn_0.3s_ease-out]">
                <h2 className="text-2xl font-playfair font-bold mb-6">Personal Information</h2>
                <form onSubmit={handleSaveProfile} className="space-y-6 max-w-lg">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gold-500 outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        value={formData.phone} 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gold-500 outline-none"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address (Read Only)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="email" 
                        value={formData.email} 
                        disabled
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <button type="submit" className="px-8 py-4 bg-gold-500 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gold-600 transition-colors shadow-lg">
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* MY APPOINTMENTS TAB */}
            {activeTab === 'appointments' && (
              <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                
                {/* UPCOMING */}
                <div>
                  <h3 className="text-xl font-playfair font-bold mb-4 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-gold-500" /> Upcoming Sessions
                  </h3>
                  
                  {upcomingAppointments.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500">
                      <p>No upcoming appointments.</p>
                      <button onClick={() => router.push('/booking')} className="mt-4 text-gold-600 font-bold hover:underline">Book a session →</button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingAppointments.map(appt => (
                        <div key={appt.id} className="bg-white border border-gold-500/30 rounded-2xl p-6 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <div className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-[10px] font-bold uppercase mb-2">{appt.status}</div>
                            <h4 className="font-bold text-lg">{appt.service}</h4>
                            <p className="text-gray-500 text-sm mt-1">{appt.date} at {appt.time} • Stylist: {appt.stylist}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="font-bold text-lg text-gold-600">₹{parseInt(appt.servicePrice?.replace(/[^0-9]/g, '')) || 0}</p>
                            <button 
                              onClick={() => cancelAppointment(appt.id)}
                              className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cancel Appointment"
                            >
                              <XCircle className="w-6 h-6" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* PAST */}
                <div>
                  <h3 className="text-xl font-playfair font-bold mb-4 flex items-center gap-2">
                    <History className="w-5 h-5 text-gray-400" /> Past History
                  </h3>
                  
                  {pastAppointments.length === 0 ? (
                    <p className="text-gray-500 text-sm pl-7">No past history found.</p>
                  ) : (
                    <div className="space-y-4">
                      {pastAppointments.map(appt => (
                        <div key={appt.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 opacity-80">
                          <div>
                            <div className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase mb-2 ${appt.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                              {appt.status}
                            </div>
                            <h4 className="font-bold text-gray-700">{appt.service}</h4>
                            <p className="text-gray-500 text-xs mt-1">{appt.date} at {appt.time} • {appt.stylist}</p>
                          </div>
                          <button 
                            onClick={() => router.push('/booking')}
                            className="text-xs font-bold uppercase tracking-widest text-gold-600 border border-gold-600 px-4 py-2 rounded-full hover:bg-gold-50"
                          >
                            Book Again
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
