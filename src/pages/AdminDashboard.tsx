import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, TrendingUp, Clock, CheckCircle, Truck, AlertCircle, BarChart2, RefreshCw, LogOut, Eye, Search } from "lucide-react";
import { MOCK_ORDERS } from "../data/products";
import { Link } from "react-router-dom";

const ADMIN_PASSWORD = "admin123";

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  "Delivered":   { color: "#22c55e", bg: "rgba(34,197,94,0.1)",   icon: CheckCircle },
  "In Transit":  { color: "#00BFFF", bg: "rgba(0,191,255,0.1)",  icon: Truck },
  "Dispatched":  { color: "#FF6B00", bg: "rgba(255,107,0,0.1)",  icon: Package },
  "Processing":  { color: "#E8C46A", bg: "rgba(232,196,106,0.1)", icon: Clock },
  "Cancelled":   { color: "#FF003D", bg: "rgba(255,0,61,0.1)",   icon: AlertCircle },
};

export function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) { setAuthed(true); setError(false); }
    else { setError(true); setPassword(""); }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-10 w-full max-w-sm text-center"
        >
          <div className="w-14 h-14 bg-neon-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-neon-accent/20">
            <BarChart2 className="w-7 h-7 text-neon-accent" />
          </div>
          <h1 className="text-3xl font-display mb-2">ADMIN</h1>
          <p className="text-white/40 text-sm mb-8">WheelsGlow Dashboard</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter admin password"
              className={`w-full bg-white/5 border px-5 py-4 rounded-xl text-sm focus:outline-none transition-colors ${error ? 'border-neon-accent text-neon-accent' : 'border-white/10 focus:border-white/30'}`}
            />
            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-neon-accent text-xs font-mono">
                  ✕ Incorrect password
                </motion.p>
              )}
            </AnimatePresence>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-neon-accent hover:text-white transition-all">
              Sign In
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  const totalRevenue = MOCK_ORDERS.reduce((sum, o) => sum + o.amount, 0);
  const delivered = MOCK_ORDERS.filter(o => o.status === "Delivered").length;
  const inTransit = MOCK_ORDERS.filter(o => o.status === "In Transit" || o.status === "Dispatched").length;
  const processing = MOCK_ORDERS.filter(o => o.status === "Processing").length;

  const filtered = MOCK_ORDERS.filter(o => {
    const matchSearch = !search || o.id.includes(search.toUpperCase()) || o.customer.toLowerCase().includes(search.toLowerCase()) || o.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const STAT_CARDS = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: "#22c55e", sub: `${MOCK_ORDERS.length} orders total` },
    { label: "Delivered", value: delivered, icon: CheckCircle, color: "#22c55e", sub: "Successfully completed" },
    { label: "In Transit / Dispatched", value: inTransit, icon: Truck, color: "#00BFFF", sub: "Out for delivery" },
    { label: "Processing", value: processing, icon: Clock, color: "#E8C46A", sub: "Being prepared" },
  ];

  return (
    <div className="px-6 md:px-12 py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-10">
        <div>
          <p className="text-neon-accent font-mono text-[10px] uppercase tracking-[0.5em] mb-1">WheelsGlow</p>
          <h1 className="text-4xl font-display">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => window.location.reload()} className="p-2.5 glass rounded-xl hover:bg-white/10 transition-colors text-white/50 hover:text-white">
            <RefreshCw className="w-4 h-4" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => setAuthed(false)} className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl hover:bg-white/10 transition-colors text-white/50 hover:text-neon-accent font-mono text-xs uppercase tracking-widest">
            <LogOut className="w-4 h-4" />
            Sign Out
          </motion.button>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-6 relative overflow-hidden group"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(ellipse at 80% 20%, ${card.color}08 0%, transparent 70%)` }} />
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${card.color}18`, border: `1px solid ${card.color}30` }}>
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">{card.label}</span>
            </div>
            <div className="text-3xl font-display mb-1">{card.value}</div>
            <p className="text-[10px] text-white/30 font-mono">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Orders Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-white/5">
          <h2 className="text-xl font-display">Orders</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search orders..."
                className="w-full sm:w-52 bg-white/5 border border-white/10 pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            {/* Status filter */}
            <div className="flex gap-2 flex-wrap">
              {["All", "Processing", "Dispatched", "In Transit", "Delivered"].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-2 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-neon-accent text-white' : 'border border-white/10 text-white/40 hover:border-white/30 hover:text-white'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["Order ID", "Customer", "Product", "Size", "Amount", "Status", "Date", ""].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-[9px] font-mono uppercase tracking-widest text-white/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((order, i) => {
                  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG["Processing"];
                  const StatusIcon = cfg.icon;
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-neon-accent">{order.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold">{order.customer}</div>
                        <div className="text-[10px] text-white/30 font-mono">{order.city}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/70">{order.product}</td>
                      <td className="px-6 py-4 text-xs text-white/40 font-mono">{order.size}</td>
                      <td className="px-6 py-4 text-sm font-bold">₹{order.amount.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl w-fit" style={{ background: cfg.bg }}>
                          <StatusIcon className="w-3 h-3" style={{ color: cfg.color }} />
                          <span className="text-[10px] font-mono" style={{ color: cfg.color }}>{order.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-white/30 font-mono">{order.date}</td>
                      <td className="px-6 py-4">
                        <Link to={`/track?order=${order.id}`}>
                          <motion.button whileHover={{ scale: 1.1 }} className="p-2 glass rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                            <Eye className="w-4 h-4" />
                          </motion.button>
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-white/5">
          {filtered.map((order, i) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG["Processing"];
            const StatusIcon = cfg.icon;
            return (
              <motion.div key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs text-neon-accent">{order.id}</span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: cfg.bg }}>
                    <StatusIcon className="w-3 h-3" style={{ color: cfg.color }} />
                    <span className="text-[9px] font-mono" style={{ color: cfg.color }}>{order.status}</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm">{order.customer} <span className="text-white/30">· {order.city}</span></p>
                  <p className="text-xs text-white/50 mt-0.5">{order.product} · {order.size}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">₹{order.amount.toLocaleString('en-IN')}</span>
                  <Link to={`/track?order=${order.id}`} className="text-xs font-mono text-neon-accent hover:underline">Track →</Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/30 font-mono text-sm">No orders match your filter.</div>
        )}

        <div className="px-6 py-4 border-t border-white/5 flex justify-between items-center">
          <p className="text-[10px] font-mono text-white/30">{filtered.length} of {MOCK_ORDERS.length} orders</p>
          <p className="text-[10px] font-mono text-white/30">Total Shown: ₹{filtered.reduce((s, o) => s + o.amount, 0).toLocaleString('en-IN')}</p>
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-8 flex flex-wrap gap-4">
        <Link to="/" className="px-5 py-3 glass rounded-xl font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/5 transition-all">← Back to Store</Link>
        <Link to="/track" className="px-5 py-3 glass rounded-xl font-mono text-xs uppercase tracking-widest text-white/50 hover:text-neon-accent hover:border-neon-accent/30 transition-all">Track an Order</Link>
      </motion.div>
    </div>
  );
}
