import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, TrendingUp, Clock, CheckCircle, Truck, AlertCircle,
  RefreshCw, LogOut, Eye, Search, Edit2, X, Check, Loader2,
  IndianRupee, Users, Mail
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isFirebaseReady } from "../lib/firebase";
import { dataApi } from "../lib/dataApi";

// ── Status config
const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  "Delivered":  { color: "#22c55e", bg: "rgba(34,197,94,0.1)",   icon: CheckCircle },
  "In Transit": { color: "#00BFFF", bg: "rgba(0,191,255,0.1)",   icon: Truck },
  "Dispatched": { color: "#FF6B00", bg: "rgba(255,107,0,0.1)",   icon: Package },
  "Processing": { color: "#E8C46A", bg: "rgba(232,196,106,0.1)", icon: Clock },
  "Cancelled":  { color: "#FF003D", bg: "rgba(255,0,61,0.1)",    icon: AlertCircle },
};
const VALID_STATUSES = ["Processing", "Dispatched", "In Transit", "Delivered", "Cancelled"];

// ── Stat card
function StatCard({ label, value, icon: Icon, color, sub, delay = 0 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="glass rounded-2xl p-6 relative overflow-hidden group"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 80% 20%, ${color}0A 0%, transparent 70%)` }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <span className="text-[9px] font-mono uppercase tracking-widest text-white/25">{label}</span>
      </div>
      <div className="text-3xl font-display mb-1 tracking-tight">{value}</div>
      <p className="text-[10px] text-white/25 font-mono">{sub}</p>
    </motion.div>
  );
}

// ── Login screen (Firebase Auth or fallback)
function LoginScreen() {
  const { signIn, error, clearError, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  // Fallback login (no Firebase) — use env var password
  const FALLBACK_PASSWORD = (import.meta as any).env?.VITE_ADMIN_PASSWORD || "wg-admin-2026";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError();
    setSubmitting(true);
    try {
      if (isFirebaseReady) {
        await signIn(email, password);
      } else {
        // Express backend fallback — use hardcoded env password
        if (password !== FALLBACK_PASSWORD) {
          setLocalError("Incorrect password.");
          return;
        }
        // For local dev without Firebase, we simulate login
        // This won't persist — Firebase should be used in production
        window.sessionStorage.setItem("wg-admin-authed", "true");
        window.location.reload();
      }
    } catch {}
    finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,0,61,0.05) 0%, transparent 70%)' }} />

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-neon-accent/10 border border-neon-accent/20 mb-5">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-neon-accent" stroke="currentColor">
              <rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="1.5" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-3xl font-display tracking-tight mb-1">Admin Access</h1>
          <p className="text-white/30 text-xs font-mono uppercase tracking-widest">WheelsGlow Dashboard</p>
        </div>

        <div className="glass rounded-2xl p-8 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isFirebaseReady && (
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 block mb-2">Email</label>
                <input
                  type="email" required value={email} onChange={e => { setEmail(e.target.value); setLocalError(""); clearError(); }}
                  placeholder="admin@wheelsglow.com"
                  className="w-full bg-white/5 border border-white/10 px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:border-neon-accent/60 transition-colors placeholder:text-white/20"
                />
              </div>
            )}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 block mb-2">Password</label>
              <input
                type="password" required value={password} onChange={e => { setPassword(e.target.value); setLocalError(""); clearError(); }}
                placeholder="••••••••••"
                className="w-full bg-white/5 border border-white/10 px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:border-neon-accent/60 transition-colors placeholder:text-white/20"
              />
            </div>

            <AnimatePresence>
              {(error || localError) && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="p-3 rounded-lg bg-neon-accent/10 border border-neon-accent/25 text-neon-accent text-xs font-mono flex items-center gap-2">
                  <X className="w-3.5 h-3.5 flex-shrink-0" />
                  {error || localError}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
              disabled={submitting}
              className="w-full bg-white text-black py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-neon-accent hover:text-white transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : "Sign In"}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-white/15 text-[10px] font-mono mt-6">
          {isFirebaseReady ? "Secured by Firebase Authentication" : "Local development mode"}
        </p>
      </motion.div>
    </div>
  );
}

// ── Dashboard tabs
type Tab = 'orders' | 'contacts';

export function AdminDashboard() {
  const { user, isAdmin, loading, signOut } = useAuth();

  // Fallback session for local dev without Firebase
  const [localAuthed] = useState(() => window.sessionStorage.getItem("wg-admin-authed") === "true");

  const showDashboard = isAdmin || (!isFirebaseReady && localAuthed);

  const [orders, setOrders] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [fetching, setFetching] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editTracking, setEditTracking] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setFetching(true);
    try {
      const [{ orders: o, stats: s }, c] = await Promise.all([
        dataApi.getOrders(filterStatus, search),
        dataApi.getContacts(),
      ]);
      setOrders(o);
      setStats(s);
      setContacts(c);
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  }, [filterStatus, search]);

  useEffect(() => { if (showDashboard) loadData(); }, [showDashboard, loadData]);

  const handleSaveEdit = async () => {
    if (!editingOrder) return;
    setSaving(true);
    try {
      await dataApi.updateOrder(editingOrder.id, { status: editStatus, trackingId: editTracking });
      setOrders(prev => prev.map(o => o.id === editingOrder.id ? { ...o, status: editStatus, trackingId: editTracking } : o));
      setEditingOrder(null);
    } catch {} finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/20" />
      </div>
    );
  }

  if (!showDashboard) return <LoginScreen />;

  return (
    <div className="px-6 md:px-12 py-10 min-h-screen">
      {/* ── Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="text-neon-accent font-mono text-[10px] uppercase tracking-[0.5em] mb-1">WheelsGlow</p>
          <h1 className="text-4xl font-display">Dashboard</h1>
          {user && <p className="text-white/30 text-xs font-mono mt-1">{user.email}</p>}
        </div>
        <div className="flex gap-3">
          <motion.button whileHover={{ scale: 1.05 }} onClick={loadData} disabled={fetching}
            className="p-2.5 glass rounded-xl text-white/40 hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => { signOut(); window.sessionStorage.removeItem("wg-admin-authed"); }}
            className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl text-white/40 hover:text-neon-accent font-mono text-xs uppercase tracking-widest transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </motion.button>
        </div>
      </motion.div>

      {/* ── Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard delay={0}    label="Revenue"           value={`₹${stats.revenue?.toLocaleString('en-IN')}`} icon={IndianRupee} color="#22c55e" sub={`${stats.total} total orders`} />
          <StatCard delay={0.05} label="Delivered"         value={stats.delivered}                              icon={CheckCircle} color="#22c55e" sub="Completed" />
          <StatCard delay={0.1}  label="In Transit"        value={stats.inTransit}                              icon={Truck}       color="#00BFFF" sub="Out for delivery" />
          <StatCard delay={0.15} label="Processing"        value={stats.processing}                             icon={Clock}       color="#E8C46A" sub="Being prepared" />
        </div>
      )}

      {/* ── Tabs */}
      <div className="flex gap-1 mb-6 p-1 glass rounded-xl w-fit">
        {[{ id: 'orders', label: 'Orders', icon: Package }, { id: 'contacts', label: `Messages (${contacts.length})`, icon: Mail }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}>
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── ORDERS */}
      {activeTab === 'orders' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl overflow-hidden">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders…"
                className="w-52 bg-white/5 border border-white/10 pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-white/30 transition-colors" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["All", ...VALID_STATUSES.slice(0, 4)].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-3 py-2 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-neon-accent text-white' : 'border border-white/10 text-white/40 hover:text-white hover:border-white/30'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Table — desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Order ID", "Customer", "Product · Size", "Amount", "Status", "Date", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[9px] font-mono uppercase tracking-widest text-white/25">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fetching ? (
                  <tr><td colSpan={7} className="text-center py-16"><Loader2 className="w-5 h-5 animate-spin text-white/20 mx-auto" /></td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-16 text-white/25 font-mono text-xs">No orders yet.</td></tr>
                ) : (
                  orders.map((order, i) => {
                    const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG["Processing"];
                    return (
                      <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4 font-mono text-xs text-neon-accent font-bold">{order.id}</td>
                        <td className="px-5 py-4">
                          <div className="text-sm font-semibold">{order.customerName}</div>
                          <div className="text-[10px] text-white/30 font-mono">{order.city}, {order.state}</div>
                          <div className="text-[10px] text-white/20 font-mono">{order.customerPhone}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-sm text-white/80">{order.productName}</div>
                          <div className="text-[10px] text-white/35 font-mono">{order.size}</div>
                        </td>
                        <td className="px-5 py-4 text-sm font-bold">₹{order.amount?.toLocaleString('en-IN')}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl w-fit" style={{ background: cfg.bg }}>
                            <cfg.icon className="w-3 h-3" style={{ color: cfg.color }} />
                            <span className="text-[10px] font-mono" style={{ color: cfg.color }}>{order.status}</span>
                          </div>
                          {order.trackingId && <p className="text-[9px] text-white/25 font-mono mt-1">{order.trackingId}</p>}
                        </td>
                        <td className="px-5 py-4 text-xs text-white/25 font-mono">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '-'}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-1.5">
                            <Link to={`/track?order=${order.id}`}>
                              <motion.button whileHover={{ scale: 1.1 }} className="p-2 glass rounded-lg text-white/30 hover:text-white transition-colors">
                                <Eye className="w-3.5 h-3.5" />
                              </motion.button>
                            </Link>
                            <motion.button whileHover={{ scale: 1.1 }} onClick={() => { setEditingOrder(order); setEditStatus(order.status); setEditTracking(order.trackingId || ""); }}
                              className="p-2 glass rounded-lg text-white/30 hover:text-neon-accent transition-colors">
                              <Edit2 className="w-3.5 h-3.5" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-white/5">
            {orders.map((order) => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG["Processing"];
              return (
                <div key={order.id} className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs text-neon-accent font-bold">{order.id}</span>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg" style={{ background: cfg.bg }}>
                      <cfg.icon className="w-3 h-3" style={{ color: cfg.color }} />
                      <span className="text-[9px] font-mono" style={{ color: cfg.color }}>{order.status}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{order.customerName} · <span className="text-white/40">{order.city}</span></p>
                    <p className="text-xs text-white/40 mt-0.5">{order.productName} · {order.size}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">₹{order.amount?.toLocaleString('en-IN')}</span>
                    <button onClick={() => { setEditingOrder(order); setEditStatus(order.status); setEditTracking(order.trackingId || ""); }}
                      className="text-xs font-mono text-neon-accent hover:underline">Edit →</button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-5 py-3.5 border-t border-white/5 flex justify-between items-center">
            <p className="text-[10px] font-mono text-white/25">{orders.length} orders shown</p>
            <p className="text-[10px] font-mono text-white/25">Revenue: ₹{orders.reduce((s, o) => s + (o.amount || 0), 0).toLocaleString('en-IN')}</p>
          </div>
        </motion.div>
      )}

      {/* ── CONTACTS */}
      {activeTab === 'contacts' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl overflow-hidden">
          {contacts.length === 0 ? (
            <div className="text-center py-16 text-white/25 font-mono text-sm">No messages yet.</div>
          ) : (
            <div className="divide-y divide-white/5">
              {contacts.map((c: any, i) => (
                <motion.div key={c.id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="p-6 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                    <div>
                      <p className="font-bold">{c.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-white/40 font-mono">{c.email}</span>
                        {c.phone && <span className="text-xs text-white/30 font-mono">{c.phone}</span>}
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-white/20">
                      {c.createdAt?.toDate ? c.createdAt.toDate().toLocaleDateString('en-IN') : c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '-'}
                    </span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">{c.message}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* ── Edit Order Modal */}
      <AnimatePresence>
        {editingOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }} className="glass rounded-2xl p-8 w-full max-w-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-display">Update Order</h3>
                  <p className="text-xs text-neon-accent font-mono mt-0.5">{editingOrder.id}</p>
                </div>
                <button onClick={() => setEditingOrder(null)} className="p-2 hover:bg-white/10 rounded-xl text-white/40 transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 block mb-2">Status</label>
                  <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className="w-full bg-black border border-white/15 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-neon-accent transition-colors">
                    {VALID_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 block mb-2">Courier Tracking ID</label>
                  <input value={editTracking} onChange={e => setEditTracking(e.target.value)} placeholder="e.g. DTDC1234567"
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-neon-accent transition-colors font-mono" />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setEditingOrder(null)} className="flex-1 py-3 glass rounded-xl text-xs font-mono uppercase tracking-widest text-white/40 hover:text-white transition-colors">Cancel</button>
                <motion.button whileHover={{ scale: 1.02 }} onClick={handleSaveEdit} disabled={saving}
                  className="flex-1 py-3 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-neon-accent hover:text-white transition-all flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Save</>}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8">
        <Link to="/" className="px-5 py-3 glass rounded-xl font-mono text-xs uppercase tracking-widest text-white/30 hover:text-white transition-colors">← Back to Store</Link>
      </div>
    </div>
  );
}
