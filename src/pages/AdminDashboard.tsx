import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, TrendingUp, Clock, CheckCircle, Truck, AlertCircle, BarChart2, RefreshCw, LogOut, Eye, Search, Edit2, X, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { api, ADMIN_KEY } from "../lib/api";

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  "Delivered":   { color: "#22c55e", bg: "rgba(34,197,94,0.1)",   icon: CheckCircle },
  "In Transit":  { color: "#00BFFF", bg: "rgba(0,191,255,0.1)",   icon: Truck },
  "Dispatched":  { color: "#FF6B00", bg: "rgba(255,107,0,0.1)",   icon: Package },
  "Processing":  { color: "#E8C46A", bg: "rgba(232,196,106,0.1)", icon: Clock },
  "Cancelled":   { color: "#FF003D", bg: "rgba(255,0,61,0.1)",    icon: AlertCircle },
};
const VALID_STATUSES = ["Processing", "Dispatched", "In Transit", "Delivered", "Cancelled"];

function StatCard({ label, value, icon: Icon, color, sub }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(ellipse at 80% 20%, ${color}08 0%, transparent 70%)` }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">{label}</span>
      </div>
      <div className="text-3xl font-display mb-1">{value}</div>
      <p className="text-[10px] text-white/30 font-mono">{sub}</p>
    </motion.div>
  );
}

export function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editTracking, setEditTracking] = useState("");
  const [saving, setSaving] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") { setAuthed(true); setPwError(false); }
    else { setPwError(true); setPassword(""); }
  };

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.admin.getOrders({ status: filterStatus === "All" ? undefined : filterStatus, search: search || undefined });
      setOrders(res.data);
      setStats(res.stats);
    } catch {
      // fallback — API not running
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, search]);

  useEffect(() => { if (authed) loadOrders(); }, [authed, loadOrders]);

  const handleSaveEdit = async () => {
    if (!editingOrder) return;
    setSaving(true);
    try {
      await api.admin.updateOrder(editingOrder.id, { status: editStatus, trackingId: editTracking });
      await loadOrders();
      setEditingOrder(null);
    } catch { } finally { setSaving(false); }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-10 w-full max-w-sm text-center">
          <div className="w-14 h-14 bg-neon-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-neon-accent/20">
            <BarChart2 className="w-7 h-7 text-neon-accent" />
          </div>
          <h1 className="text-3xl font-display mb-2">ADMIN</h1>
          <p className="text-white/40 text-sm mb-8">WheelsGlow Dashboard</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setPwError(false); }} placeholder="Admin password"
              className={`w-full bg-white/5 border px-5 py-4 rounded-xl text-sm focus:outline-none transition-colors ${pwError ? 'border-neon-accent text-neon-accent' : 'border-white/10 focus:border-white/30'}`} />
            <AnimatePresence>
              {pwError && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-neon-accent text-xs font-mono">✕ Incorrect password</motion.p>}
            </AnimatePresence>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-neon-accent hover:text-white transition-all">
              Sign In
            </motion.button>
          </form>
          <p className="text-white/20 text-[10px] font-mono mt-6">Password: admin123</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-10 min-h-screen">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-10">
        <div>
          <p className="text-neon-accent font-mono text-[10px] uppercase tracking-[0.5em] mb-1">WheelsGlow</p>
          <h1 className="text-4xl font-display">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.05 }} onClick={loadOrders} disabled={loading} className="p-2.5 glass rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => setAuthed(false)} className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl text-white/50 hover:text-neon-accent font-mono text-xs uppercase tracking-widest">
            <LogOut className="w-4 h-4" /> Sign Out
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard label="Total Revenue" value={`₹${stats.revenue?.toLocaleString('en-IN')}`} icon={TrendingUp} color="#22c55e" sub={`${stats.total} orders total`} />
          <StatCard label="Delivered" value={stats.delivered} icon={CheckCircle} color="#22c55e" sub="Successfully completed" />
          <StatCard label="In Transit / Dispatched" value={stats.inTransit} icon={Truck} color="#00BFFF" sub="Out for delivery" />
          <StatCard label="Processing" value={stats.processing} icon={Clock} color="#E8C46A" sub="Being prepared" />
        </div>
      )}

      {/* Orders Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl overflow-hidden">
        {/* Table controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-white/5">
          <h2 className="text-xl font-display">Orders</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
                className="w-full sm:w-52 bg-white/5 border border-white/10 pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-white/30 transition-colors" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["All", ...VALID_STATUSES.filter(s => s !== "Cancelled")].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-3 py-2 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-neon-accent text-white' : 'border border-white/10 text-white/40 hover:border-white/30 hover:text-white'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["Order ID", "Customer", "Product", "Size", "Amount", "Status", "Date", "Actions"].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-[9px] font-mono uppercase tracking-widest text-white/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-16"><Loader2 className="w-6 h-6 animate-spin text-white/30 mx-auto" /></td></tr>
              ) : (
                <AnimatePresence>
                  {orders.map((order, i) => {
                    const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG["Processing"];
                    return (
                      <motion.tr key={order.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-neon-accent">{order.id}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold">{order.customerName}</div>
                          <div className="text-[10px] text-white/30 font-mono">{order.city}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-white/70">{order.productName}</td>
                        <td className="px-6 py-4 text-xs text-white/40 font-mono">{order.size}</td>
                        <td className="px-6 py-4 text-sm font-bold">₹{order.amount?.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl w-fit" style={{ background: cfg.bg }}>
                            <cfg.icon className="w-3 h-3" style={{ color: cfg.color }} />
                            <span className="text-[10px] font-mono" style={{ color: cfg.color }}>{order.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-white/30 font-mono">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link to={`/track?order=${order.id}`}>
                              <motion.button whileHover={{ scale: 1.1 }} className="p-2 glass rounded-lg hover:bg-white/10 text-white/40 hover:text-white">
                                <Eye className="w-4 h-4" />
                              </motion.button>
                            </Link>
                            <motion.button whileHover={{ scale: 1.1 }} onClick={() => { setEditingOrder(order); setEditStatus(order.status); setEditTracking(order.trackingId || ""); }}
                              className="p-2 glass rounded-lg hover:bg-white/10 text-white/40 hover:text-neon-accent">
                              <Edit2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-white/5">
          {orders.map((order, i) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG["Processing"];
            return (
              <div key={order.id} className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs text-neon-accent">{order.id}</span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: cfg.bg }}>
                    <cfg.icon className="w-3 h-3" style={{ color: cfg.color }} />
                    <span className="text-[9px] font-mono" style={{ color: cfg.color }}>{order.status}</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm">{order.customerName} · <span className="text-white/40">{order.city}</span></p>
                  <p className="text-xs text-white/50">{order.productName} · {order.size}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">₹{order.amount?.toLocaleString('en-IN')}</span>
                  <div className="flex gap-2">
                    <Link to={`/track?order=${order.id}`} className="text-xs font-mono text-neon-accent hover:underline">Track →</Link>
                    <button onClick={() => { setEditingOrder(order); setEditStatus(order.status); setEditTracking(order.trackingId || ""); }} className="text-xs font-mono text-white/40 hover:text-white">Edit</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {orders.length === 0 && !loading && (
          <div className="text-center py-16 text-white/30 font-mono text-sm">No orders found.</div>
        )}

        <div className="px-6 py-4 border-t border-white/5 flex justify-between">
          <p className="text-[10px] font-mono text-white/30">{orders.length} orders</p>
          <p className="text-[10px] font-mono text-white/30">₹{orders.reduce((s, o) => s + (o.amount || 0), 0).toLocaleString('en-IN')}</p>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass rounded-2xl p-8 w-full max-w-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-display">Edit {editingOrder.id}</h3>
                <button onClick={() => setEditingOrder(null)} className="p-2 hover:bg-white/10 rounded-xl text-white/40"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-2">Status</label>
                  <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-neon-accent bg-black">
                    {VALID_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-2">Tracking ID (courier)</label>
                  <input value={editTracking} onChange={e => setEditTracking(e.target.value)} placeholder="DTDC1234567"
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-neon-accent transition-colors font-mono" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setEditingOrder(null)} className="flex-1 py-3 glass rounded-xl font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white">Cancel</button>
                <motion.button whileHover={{ scale: 1.02 }} onClick={handleSaveEdit} disabled={saving}
                  className="flex-1 py-3 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-neon-accent hover:text-white transition-all flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Save</>}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Links */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Link to="/" className="px-5 py-3 glass rounded-xl font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white transition-all">← Store</Link>
        <Link to="/track" className="px-5 py-3 glass rounded-xl font-mono text-xs uppercase tracking-widest text-white/50 hover:text-neon-accent transition-all">Track Order</Link>
      </div>
    </div>
  );
}
