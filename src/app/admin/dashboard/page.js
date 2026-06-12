"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3, CalendarDays, Users, Scissors,
  Wallet, Settings, LogOut, Check, X, Eye, Menu,
  Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight,
  Phone, Mail, Star, Bell, Lock, Save, Trophy,
  MessageSquare, Filter, CalendarRange, AlertCircle
} from 'lucide-react';
import {
  collection, query, orderBy, onSnapshot, doc,
  updateDoc, deleteDoc, addDoc, setDoc, serverTimestamp, getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
  BarChart as HBarChart
} from 'recharts';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const s = (status || 'pending').toLowerCase();
  const map = {
    confirmed:  'bg-emerald-100 text-emerald-700 border-emerald-200',
    pending:    'bg-amber-100   text-amber-700   border-amber-200',
    cancelled:  'bg-red-100    text-red-700    border-red-200',
    completed:  'bg-[#B8860B]/15 text-[#7a5c06] border-[#B8860B]/30',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${map[s] || map.pending}`}>
      {status || 'Pending'}
    </span>
  );
}

function StatCard({ title, value, sub, icon: Icon, accent = '#B8860B' }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border-l-4 p-6 flex flex-col gap-2" style={{ borderColor: accent }}>
      <div className="flex justify-between items-start">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-tight">{title}</p>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${accent}18` }}>
          <Icon className="w-5 h-5" style={{ color: accent }} />
        </div>
      </div>
      <p className="text-3xl font-bold text-[#1C1208]">{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-[#B8860B]' : 'bg-gray-300'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;
  const sizeClass = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }[size] || 'max-w-lg';
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeClass} max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 className="font-playfair font-bold text-xl text-[#1C1208]">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Drawer({ isOpen, onClose, title, children }) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 z-[150] bg-black/40" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full z-[160] w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="font-playfair font-bold text-xl text-[#1C1208]">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </>
  );
}

const TABS = [
  { name: 'Overview',      icon: BarChart3 },
  { name: 'Appointments',  icon: CalendarDays },
  { name: 'Clients',       icon: Users },
  { name: 'Services',      icon: Scissors },
  { name: 'Revenue',       icon: Wallet },
  { name: 'Settings',      icon: Settings },
];

// ─── FIRESTORE HELPERS ────────────────────────────────────────────────────────

async function fsUpdateBooking(id, data) {
  try {
    await updateDoc(doc(db, 'bookings', id), data);
    return true;
  } catch { return false; }
}

async function fsDeleteService(id) {
  try { await deleteDoc(doc(db, 'services', id)); return true; }
  catch { return false; }
}

async function fsSaveService(id, data) {
  try {
    if (id) {
      await updateDoc(doc(db, 'services', id), data);
    } else {
      await addDoc(collection(db, 'services'), { ...data, createdAt: serverTimestamp() });
    }
    return true;
  } catch { return false; }
}

async function fsUpdateSettings(data) {
  try {
    await setDoc(doc(db, 'settings', 'salon'), data, { merge: true });
    return true;
  } catch { return false; }
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [bookings, setBookings]       = useState([]);
  const [clients, setClients]         = useState([]);
  const [services, setServices]       = useState([]);
  const [salonSettings, setSalonSettings] = useState(null);
  const [fsReady, setFsReady]         = useState(false);

  // Auth guard
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.replace('/');
    }
  }, [user, authLoading, router]);

  // Firestore real-time listeners
  useEffect(() => {
    let unsubs = [];
    try {
      unsubs.push(
        onSnapshot(query(collection(db, 'bookings'), orderBy('createdAt', 'desc')), snap => {
          setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          setFsReady(true);
        }, () => setFsReady(false))
      );
      unsubs.push(
        onSnapshot(collection(db, 'clients'), snap =>
          setClients(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      );
      unsubs.push(
        onSnapshot(collection(db, 'services'), snap =>
          setServices(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      );
      unsubs.push(
        onSnapshot(doc(db, 'settings', 'salon'), d => {
          if (d.exists()) setSalonSettings(d.data());
        })
      );
    } catch {
      console.warn('Firebase not configured — add keys to src/lib/firebase.js');
    }
    return () => unsubs.forEach(u => u && u());
  }, []);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#B8860B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const navTo = (tab) => { setActiveTab(tab); setIsSidebarOpen(false); };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F0E8] font-sans">

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 z-50 w-60 flex-shrink-0
        bg-[#1C1208] flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="px-5 py-6 border-b border-[#B8860B]/20 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#B8860B] rounded-lg flex items-center justify-center flex-shrink-0">
            <Scissors className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-playfair font-bold text-white text-base leading-tight tracking-wider uppercase">Killin Kutz</p>
            <p className="text-[10px] text-[#B8860B] uppercase tracking-widest font-bold">Admin Panel</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {TABS.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => navTo(name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === name
                  ? 'bg-[#B8860B] text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-[#B8860B]/15'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" /> {name}
            </button>
          ))}
        </nav>

        {/* Firebase status indicator */}
        <div className="px-4 py-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold ${fsReady ? 'bg-emerald-900/30 text-emerald-400' : 'bg-amber-900/30 text-amber-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${fsReady ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
            {fsReady ? 'FIREBASE CONNECTED' : 'LOCAL MODE'}
          </div>
        </div>

        {/* Logout */}
        <div className="px-3 pb-4 border-t border-[#B8860B]/20 pt-3">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="md:hidden flex items-center gap-4 px-4 py-3 bg-white border-b border-gray-200 flex-shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-[#1C1208]" />
          </button>
          <span className="font-playfair font-bold text-lg text-[#1C1208]">
            {activeTab}
          </span>
        </header>

        {/* Scrollable page content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
            {activeTab === 'Overview'     && <OverviewTab     bookings={bookings} clients={clients} />}
            {activeTab === 'Appointments' && <AppointmentsTab bookings={bookings} />}
            {activeTab === 'Clients'      && <ClientsTab      clients={clients} bookings={bookings} />}
            {activeTab === 'Services'     && <ServicesTab     services={services} />}
            {activeTab === 'Revenue'      && <RevenueTab      bookings={bookings} />}
            {activeTab === 'Settings'     && <SettingsTab     settings={salonSettings} />}
          </div>
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 1 — OVERVIEW
// ─────────────────────────────────────────────────────────────────────────────

function OverviewTab({ bookings, clients }) {
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.date === today);
  const todayRevenue  = todayBookings.reduce((a, b) => b.status !== 'cancelled' ? a + Number(b.amount || 0) : a, 0);
  const totalRevenue  = bookings.reduce((a, b) => ['confirmed','completed'].includes((b.status||'').toLowerCase()) ? a + Number(b.amount||0) : a, 0);

  // Build 7-day chart from real data + fallback
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    const rev = bookings.filter(b => b.date === key && ['confirmed','completed'].includes((b.status||'').toLowerCase()))
                        .reduce((a, b) => a + Number(b.amount||0), 0);
    return { name: d.toLocaleDateString('en-IN', { weekday: 'short' }), revenue: rev || [12000,8000,15000,20000,25000,40000,35000][i] };
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-[#1C1208]">Good Morning, Admin! 👋</h1>
          <p className="text-gray-500 text-sm mt-1">{new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard title="Today's Appointments" value={todayBookings.length}      icon={CalendarDays} sub={`${todayBookings.filter(b=>b.status==='confirmed').length} confirmed`} />
        <StatCard title="Today's Revenue"      value={`₹${todayRevenue.toLocaleString('en-IN')}`} icon={Wallet} sub="Paid bookings only" accent="#16a34a" />
        <StatCard title="Total Clients"        value={clients.length || '—'}      icon={Users}  sub="All-time registered" accent="#2563eb" />
        <StatCard title="Avg Rating"           value="4.8 / 5"                   icon={Star}   sub="Based on 128 reviews" accent="#d97706" />
      </div>

      {/* Two-column content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming today */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-[#1C1208]">Upcoming Appointments Today</h3>
            <span className="text-xs font-bold text-[#B8860B] bg-[#B8860B]/10 px-2 py-0.5 rounded-full">{todayBookings.length} total</span>
          </div>
          <div className="divide-y divide-gray-50">
            {todayBookings.slice(0, 5).map(b => (
              <div key={b.id} className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#B8860B]/15 text-[#B8860B] flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {(b.clientName || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{b.clientName}</p>
                    <p className="text-xs text-gray-500">{b.service} • {b.time} • {b.stylist}</p>
                  </div>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
            {todayBookings.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-400 text-sm">No appointments today.</div>
            )}
          </div>
        </div>

        {/* Recent bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-[#1C1208]">Recent Bookings</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {bookings.slice(0, 5).map(b => (
              <div key={b.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{b.clientName}</p>
                    <span className="font-mono text-[10px] text-gray-400">#{b.bookingRef || b.id?.substring(0,6)}</span>
                  </div>
                  <p className="text-xs text-gray-500">{b.service} • {b.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#B8860B]">₹{Number(b.amount||0).toLocaleString('en-IN')}</p>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-400 text-sm">No recent bookings.</div>
            )}
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-[#1C1208] mb-6">7-Day Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={last7} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe2" />
            <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
            <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={v => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} cursor={{ fill: '#F5F0E820' }} />
            <Bar dataKey="revenue" fill="#B8860B" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 2 — APPOINTMENTS
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

function AppointmentsTab({ bookings }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch]             = useState('');
  const [dateFilter, setDateFilter]     = useState('');
  const [page, setPage]                 = useState(1);
  const [drawer, setDrawer]             = useState(null);   // booking object
  const [confirmCancel, setConfirmCancel] = useState(null); // booking id

  const filtered = bookings.filter(b => {
    const matchStatus = statusFilter === 'All' || (b.status||'').toLowerCase() === statusFilter.toLowerCase();
    const matchSearch = !search || [b.clientName, b.clientEmail, b.clientPhone].some(v => (v||'').toLowerCase().includes(search.toLowerCase()));
    const matchDate   = !dateFilter || b.date === dateFilter;
    return matchStatus && matchSearch && matchDate;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const confirm = async (id) => {
    const ok = await fsUpdateBooking(id, { status: 'confirmed' });
    if (!ok) alert('Could not update: Firebase not configured. Add your keys to src/lib/firebase.js');
  };

  const cancel = async (id) => {
    const ok = await fsUpdateBooking(id, { status: 'cancelled' });
    setConfirmCancel(null);
    if (!ok) alert('Could not update: Firebase not configured.');
  };

  const complete = async (id) => {
    await fsUpdateBooking(id, { status: 'completed' });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-playfair font-bold text-[#1C1208]">Appointments</h1>
        <span className="text-sm text-gray-500 font-medium">{filtered.length} total</span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search client…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#B8860B]"
          />
        </div>
        <input
          type="date" value={dateFilter} onChange={e => { setDateFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#B8860B]"
        />
        <select
          value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#B8860B]"
        >
          {['All','Confirmed','Pending','Cancelled','Completed'].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="bg-[#1C1208] text-white">
              {['Booking ID','Client','Service','Stylist','Date & Time','Amount','Status','Actions'].map(h => (
                <th key={h} className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginated.map(b => (
              <tr key={b.id} className="hover:bg-[#F5F0E8]/60 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">#{b.bookingRef || b.id?.substring(0,8)}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold">{b.clientName}</p>
                  <p className="text-xs text-gray-400">{b.clientPhone}</p>
                </td>
                <td className="px-4 py-3">{b.service}</td>
                <td className="px-4 py-3 text-gray-600">{b.stylist || '—'}</td>
                <td className="px-4 py-3">
                  <p>{b.date}</p>
                  <p className="text-xs text-gray-400">{b.time}</p>
                </td>
                <td className="px-4 py-3 font-bold text-[#B8860B]">₹{Number(b.amount||0).toLocaleString('en-IN')}</td>
                <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => confirm(b.id)} title="Confirm" className="p-1.5 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"><Check className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setConfirmCancel(b.id)} title="Cancel" className="p-1.5 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors"><X className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDrawer(b)} title="View Details" className="p-1.5 rounded border border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B] hover:text-white transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr><td colSpan="8" className="py-12 text-center text-gray-400 text-sm">No appointments match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:border-[#B8860B] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            onClick={() => setPage(n)}
            className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${page === n ? 'bg-[#B8860B] text-white' : 'border border-gray-200 hover:border-[#B8860B]'}`}
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:border-[#B8860B] transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Booking Details Drawer */}
      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title="Booking Details">
        {drawer && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="w-14 h-14 rounded-full bg-[#B8860B]/15 text-[#B8860B] text-2xl font-bold flex items-center justify-center">
                {(drawer.clientName||'U')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-xl font-bold text-[#1C1208]">{drawer.clientName}</p>
                <StatusBadge status={drawer.status} />
              </div>
            </div>

            {[
              ['Booking ID',   `#${drawer.bookingRef || drawer.id?.substring(0,8)}`],
              ['Service',      drawer.service],
              ['Stylist',      drawer.stylist || 'Any Available'],
              ['Date',         drawer.date],
              ['Time',         drawer.time],
              ['Amount',       `₹${Number(drawer.amount||0).toLocaleString('en-IN')}`],
              ['Phone',        drawer.clientPhone],
              ['Email',        drawer.clientEmail],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-start">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
                <span className="text-sm font-semibold text-[#1C1208] text-right max-w-[60%]">{value || '—'}</span>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
              <button onClick={() => { confirm(drawer.id); setDrawer(null); }} className="w-full py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700">✓ Confirm Booking</button>
              <button onClick={() => { setConfirmCancel(drawer.id); setDrawer(null); }} className="w-full py-2.5 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600">✗ Cancel Booking</button>
              <button onClick={() => { complete(drawer.id); setDrawer(null); }} className="w-full py-2.5 border border-[#B8860B] text-[#B8860B] text-sm font-bold rounded-lg hover:bg-[#B8860B] hover:text-white transition-colors">★ Mark as Completed</button>
              {drawer.clientPhone && (
                <a href={`https://wa.me/91${drawer.clientPhone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#25D366] text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" /> WhatsApp Client
                </a>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Cancel confirmation modal */}
      <Modal isOpen={!!confirmCancel} onClose={() => setConfirmCancel(null)} title="Cancel Booking?" size="sm">
        <p className="text-gray-600 mb-6">Are you sure you want to cancel this booking? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => cancel(confirmCancel)} className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600">Yes, Cancel</button>
          <button onClick={() => setConfirmCancel(null)} className="flex-1 py-2.5 border border-gray-300 font-bold rounded-lg hover:bg-gray-50">Go Back</button>
        </div>
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 3 — CLIENTS
// ─────────────────────────────────────────────────────────────────────────────

function ClientsTab({ clients, bookings }) {
  const [search, setSearch]           = useState('');
  const [selectedClient, setSelectedClient] = useState(null);

  const filtered = clients.filter(c =>
    [c.name, c.email, c.phone].some(v => (v||'').toLowerCase().includes(search.toLowerCase()))
  );

  const getClientBookings = (email) => bookings.filter(b => b.clientEmail === email);
  const getClientTotalSpent = (email) => getClientBookings(email)
    .filter(b => ['confirmed','completed'].includes((b.status||'').toLowerCase()))
    .reduce((a, b) => a + Number(b.amount||0), 0);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-playfair font-bold text-[#1C1208]">Clients</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#B8860B]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="bg-[#1C1208] text-white">
              {['Avatar','Name','Email','Phone','Total Bookings','Last Visit','Total Spent','Actions'].map(h => (
                <th key={h} className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-[#F5F0E8]/50 transition-colors">
                <td className="px-4 py-3">
                  {c.photoURL
                    ? <img src={c.photoURL} alt={c.name} className="w-9 h-9 rounded-full object-cover" />
                    : <div className="w-9 h-9 rounded-full bg-[#B8860B]/15 text-[#B8860B] font-bold flex items-center justify-center">{(c.name||'U')[0].toUpperCase()}</div>
                  }
                </td>
                <td className="px-4 py-3 font-semibold">{c.name}</td>
                <td className="px-4 py-3 text-gray-500">{c.email}</td>
                <td className="px-4 py-3 text-gray-500">{c.phone}</td>
                <td className="px-4 py-3 text-center">{c.totalBookings || fetchClientBookings(c.email).length}</td>
                <td className="px-4 py-3 text-gray-500">{c.lastVisit || '—'}</td>
                <td className="px-4 py-3 font-bold text-[#B8860B]">₹{(c.totalSpent || fetchClientTotalSpent(c.email)).toLocaleString('en-IN')}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setSelectedClient(c)} className="px-3 py-1.5 text-xs font-bold text-[#B8860B] border border-[#B8860B] rounded-lg hover:bg-[#B8860B] hover:text-white transition-colors">
                    <Eye className="w-3 h-3 inline mr-1" />View
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="8" className="py-12 text-center text-gray-400">No clients found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Client Profile Modal */}
      <Modal isOpen={!!selectedClient} onClose={() => setSelectedClient(null)} title="Client Profile" size="xl">
        {selectedClient && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-5 border-b border-gray-100">
              <div className="w-20 h-20 rounded-full bg-[#B8860B]/15 text-[#B8860B] text-3xl font-bold flex items-center justify-center flex-shrink-0">
                {(selectedClient.name||'U')[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-playfair font-bold text-[#1C1208]">{selectedClient.name}</h2>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{selectedClient.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{selectedClient.phone}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Member since {selectedClient.joinedAt?.toDate?.()?.toLocaleDateString('en-IN') || '—'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Spent</p>
                <p className="text-3xl font-bold text-[#B8860B]">₹{(selectedClient.totalSpent || getClientTotalSpent(selectedClient.email)).toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Booking history */}
            <div>
              <h3 className="font-bold text-lg text-[#1C1208] mb-3">Booking History</h3>
              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      {['Service','Date','Amount','Status'].map(h => <th key={h} className="px-4 py-2.5 text-left text-xs font-bold uppercase">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {getClientBookings(selectedClient.email).map(b => (
                      <tr key={b.id}>
                        <td className="px-4 py-2.5 font-semibold">{b.service}</td>
                        <td className="px-4 py-2.5 text-gray-500">{b.date}</td>
                        <td className="px-4 py-2.5 font-bold text-[#B8860B]">₹{Number(b.amount||0).toLocaleString('en-IN')}</td>
                        <td className="px-4 py-2.5"><StatusBadge status={b.status} /></td>
                      </tr>
                    ))}
                    {getClientBookings(selectedClient.email).length === 0 && (
                      <tr><td colSpan="4" className="py-6 text-center text-gray-400 text-xs">No booking history found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {selectedClient.phone && (
              <a
                href={`https://wa.me/91${selectedClient.phone.replace(/\D/g,'')}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1ebe5d] transition-colors text-sm"
              >
                <MessageSquare className="w-4 h-4" /> Send WhatsApp Message
              </a>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 4 — SERVICES
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_SERVICE = { name: '', category: 'Cuts & Shaves', duration: 30, price: '', description: '', isActive: true };

function ServicesTab({ services }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null); // null=new, or service object
  const [form, setForm]           = useState(EMPTY_SERVICE);
  const [saving, setSaving]       = useState(false);

  const openNew  = () => { setEditing(null); setForm(EMPTY_SERVICE); setModalOpen(true); };
  const openEdit = (s) => { setEditing(s); setForm({ name: s.name, category: s.category, duration: s.duration, price: s.price, description: s.description || '', isActive: s.isActive ?? true }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.name || !form.price) return alert('Name and price are required.');
    setSaving(true);
    const ok = await fsSaveService(editing?.id || null, form);
    setSaving(false);
    if (ok) setModalOpen(false);
    else alert('Saved locally only. Add Firebase keys to persist to Firestore.');
  };

  const handleToggle = async (s) => {
    await fsUpdateDoc_service(s.id, { isActive: !s.isActive });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    const ok = await fsDeleteService(id);
    if (!ok) alert('Could not delete: Firebase not configured.');
  };

  const fsUpdateDoc_service = async (id, data) => {
    try { await updateDoc(doc(db, 'services', id), data); } catch {}
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-playfair font-bold text-[#1C1208]">Services</h1>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-[#B8860B] text-white text-sm font-bold rounded-xl hover:bg-[#9a7009] transition-colors">
          <Plus className="w-4 h-4" /> Add New Service
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="bg-[#1C1208] text-white">
              {['Service Name','Category','Duration','Price','Status','Actions'].map(h => (
                <th key={h} className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {services.map(s => (
              <tr key={s.id} className="hover:bg-[#F5F0E8]/50 transition-colors">
                <td className="px-4 py-3 font-semibold">{s.name}</td>
                <td className="px-4 py-3 text-gray-500">{s.category}</td>
                <td className="px-4 py-3 text-gray-500">{s.duration} Min</td>
                <td className="px-4 py-3 font-bold text-[#B8860B]">₹{Number(s.price||0).toLocaleString('en-IN')}</td>
                <td className="px-4 py-3"><Toggle checked={s.isActive} onChange={() => handleToggle(s)} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(s)} className="p-1.5 text-blue-500 bg-blue-50 rounded hover:bg-blue-100"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 text-red-500 bg-red-50 rounded hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr><td colSpan="6" className="py-12 text-center text-gray-400">No services yet. Add your first service above.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Service' : 'Add New Service'}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Service Name *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#B8860B] text-sm" placeholder="e.g. Executive Haircut" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#B8860B] text-sm">
              {['Cuts & Shaves','Spa & Care','V.I.P. Packages'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Duration (Min)</label>
              <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#B8860B] text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#B8860B] text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#B8860B] text-sm resize-none" />
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-semibold text-gray-700">Active Status</span>
            <Toggle checked={form.isActive} onChange={v => setForm({ ...form, isActive: v })} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-3 bg-[#B8860B] text-white font-bold rounded-xl hover:bg-[#9a7009] disabled:opacity-60 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Service'}
            </button>
            <button onClick={() => setModalOpen(false)} className="flex-1 py-3 border border-gray-300 font-bold rounded-xl hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 5 — REVENUE
// ─────────────────────────────────────────────────────────────────────────────

function RevenueTab({ bookings }) {
  const [range, setRange] = useState('week');

  const getDays = () => {
    const n = range === 'week' ? 7 : range === 'month' ? 30 : 90;
    return Array.from({ length: n }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (n - 1 - i));
      return d.toISOString().split('T')[0];
    });
  };

  const days = getDays();
  const rangeBookings = bookings.filter(b => days.includes(b.date) && ['confirmed','completed'].includes((b.status||'').toLowerCase()));

  const totalRev   = rangeBookings.reduce((a, b) => a + Number(b.amount||0), 0);
  const totalBooks = rangeBookings.length;
  const avgPerBook = totalBooks ? Math.round(totalRev / totalBooks) : 0;

  // Daily revenue for line chart
  const dailyData = days.map(d => ({
    name: new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    revenue: rangeBookings.filter(b => b.date === d).reduce((a, b) => a + Number(b.amount||0), 0)
  }));

  // Revenue by service
  const byService = {};
  rangeBookings.forEach(b => { byService[b.service] = (byService[b.service] || 0) + Number(b.amount||0); });
  const serviceData = Object.entries(byService)
    .sort((a, b) => b[1] - a[1]).slice(0, 8)
    .map(([name, amount]) => ({ name: name?.split(' ').slice(0,2).join(' ') || 'Unknown', amount }));

  // Top clients
  const byClient = {};
  rangeBookings.forEach(b => {
    const k = b.clientName || 'Unknown';
    byClient[k] = (byClient[k] || 0) + Number(b.amount||0);
  });
  const topClients = Object.entries(byClient).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const medals = ['🥇','🥈','🥉','4️⃣','5️⃣'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-playfair font-bold text-[#1C1208]">Revenue Analytics</h1>
        <div className="flex gap-2">
          {[['week','This Week'],['month','This Month'],['quarter','3 Months']].map(([v,l]) => (
            <button key={v} onClick={() => setRange(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${range === v ? 'bg-[#B8860B] text-white' : 'border border-gray-200 text-gray-600 hover:border-[#B8860B]'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard title="Total Revenue"     value={`₹${totalRev.toLocaleString('en-IN')}`} icon={Wallet}      sub={`${range === 'week' ? '7' : range === 'month' ? '30' : '90'} days`} />
        <StatCard title="Total Bookings"    value={totalBooks}                               icon={CalendarDays} sub="Confirmed + Completed" accent="#2563eb" />
        <StatCard title="Avg Per Booking"   value={`₹${avgPerBook.toLocaleString('en-IN')}`} icon={BarChart3}   sub="Revenue per booking" accent="#7c3aed" />
      </div>

      {/* Daily line chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-[#1C1208] mb-5">Daily Revenue</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={dailyData} margin={{ left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe2" />
            <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} interval={range === 'quarter' ? 6 : 'preserveStartEnd'} />
            <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={v => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} />
            <Line type="monotone" dataKey="revenue" stroke="#B8860B" strokeWidth={2.5} dot={{ r: 3, fill: '#B8860B' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue by service & top clients side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by service */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-[#1C1208] mb-5">Revenue by Service</h3>
          {serviceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={serviceData} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" stroke="#9ca3af" tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} width={90} />
                <Tooltip formatter={v => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} />
                <Bar dataKey="amount" fill="#B8860B" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm py-8 text-center">No data for this period.</p>}
        </div>

        {/* Top 5 clients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-[#1C1208] mb-5">Top 5 Clients by Spending</h3>
          <div className="space-y-4">
            {topClients.map(([name, amount], i) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl w-8">{medals[i]}</span>
                  <div>
                    <p className="font-semibold text-sm">{name}</p>
                    <div className="h-1.5 rounded-full bg-gray-100 mt-1 w-32">
                      <div className="h-full rounded-full bg-[#B8860B]"
                           style={{ width: `${Math.round((amount / topClients[0][1]) * 100)}%` }} />
                    </div>
                  </div>
                </div>
                <span className="font-bold text-[#B8860B]">₹{Number(amount).toLocaleString('en-IN')}</span>
              </div>
            ))}
            {topClients.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No data for this period.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 6 — SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

function SettingsTab({ settings }) {
  const [salon, setSalon] = useState({
    name: settings?.name || 'Killin Kutz',
    address: settings?.address || 'Chembur, Mumbai',
    phone: settings?.phone || '+91 76780 37492',
    email: settings?.email || 'admin@killinkutz.com',
    hours: settings?.hours || 'Mon–Sat: 9am – 8pm, Sun: 10am – 6pm',
  });

  const [notifs, setNotifs] = useState({
    email: settings?.notifications?.email ?? true,
    whatsapp: settings?.notifications?.whatsapp ?? true,
    reminder: settings?.notifications?.reminder ?? true,
  });

  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [saved, setSaved]   = useState(false);

  const saveSalon = async () => {
    await fsUpdateSettings({ ...salon, notifications: notifs });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-3xl font-playfair font-bold text-[#1C1208]">Settings</h1>

      {/* Salon Info */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-[#1C1208]">Salon Information</h2>
        </div>
        <div className="p-6 space-y-4">
          {[
            ['Salon Name',    'name',    'text',  'Killin Kutz'],
            ['Address',       'address', 'text',  'Chembur, Mumbai'],
            ['Phone',         'phone',   'text',  '+91 XXXXX XXXXX'],
            ['Email',         'email',   'email', 'admin@killinkutz.com'],
            ['Business Hours','hours',   'text',  'Mon–Sat: 9am – 8pm'],
          ].map(([label, key, type, ph]) => (
            <div key={key}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
              <input type={type} value={salon[key]} onChange={e => setSalon({ ...salon, [key]: e.target.value })}
                placeholder={ph} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#B8860B] text-sm" />
            </div>
          ))}
          <button onClick={saveSalon} className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors ${saved ? 'bg-emerald-600 text-white' : 'bg-[#B8860B] text-white hover:bg-[#9a7009]'}`}>
            <Save className="w-4 h-4" /> {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </section>

      {/* Notification Settings */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-[#1C1208]">Notification Settings</h2>
        </div>
        <div className="p-6 space-y-5">
          {[
            ['email',    <Mail className="w-4 h-4" />,    'Email notification on new booking'],
            ['whatsapp', <MessageSquare className="w-4 h-4" />, 'WhatsApp notification on new booking'],
            ['reminder', <Bell className="w-4 h-4" />,    'Send reminder to client 2 hours before appointment'],
          ].map(([key, icon, label]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <div className="p-1.5 bg-[#B8860B]/10 rounded-lg text-[#B8860B]">{icon}</div>
                {label}
              </div>
              <Toggle checked={notifs[key]} onChange={v => setNotifs({ ...notifs, [key]: v })} />
            </div>
          ))}
          <button onClick={saveSalon} className="px-6 py-3 bg-[#B8860B] text-white rounded-xl font-bold text-sm hover:bg-[#9a7009]">
            Save Notifications
          </button>
        </div>
      </section>

      {/* Admin Account */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-[#1C1208]">Admin Account</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Admin Email</label>
            <input type="email" defaultValue="admin@killinkutz.com" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#B8860B] text-sm" />
          </div>
          <hr className="border-gray-100" />
          <p className="text-sm font-bold text-gray-700">Change Password</p>
          {[['current','Current Password'],['next','New Password'],['confirm','Confirm New Password']].map(([k, ph]) => (
            <div key={k} className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="password" value={pwForm[k]} onChange={e => setPwForm({ ...pwForm, [k]: e.target.value })}
                placeholder={ph} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#B8860B] text-sm" />
            </div>
          ))}
          <button className="px-6 py-3 bg-[#1C1208] text-white rounded-xl font-bold text-sm hover:bg-black flex items-center gap-2">
            <Lock className="w-4 h-4" /> Update Password
          </button>
        </div>
      </section>
    </div>
  );
}
