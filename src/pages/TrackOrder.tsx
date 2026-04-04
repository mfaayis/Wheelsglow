import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Box, Clock, Package, Truck, CheckCircle, MapPin, PhoneCall, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { dataApi } from "../lib/dataApi";

const STEPS = [
  { id: 1, label: "Order Placed",  icon: Box,          color: "#E8C46A" },
  { id: 2, label: "Processing",    icon: Clock,        color: "#FF6B00" },
  { id: 3, label: "Dispatched",    icon: Package,      color: "#00BFFF" },
  { id: 4, label: "In Transit",    icon: Truck,        color: "#7B61FF" },
  { id: 5, label: "Delivered",     icon: CheckCircle,  color: "#22c55e" },
];
const STATUS_STEP: Record<string, number> = { Processing: 2, Dispatched: 3, "In Transit": 4, Delivered: 5 };
const STEP_NOTES: Record<number, string[]> = {
  1: ["Order received & confirmed"],
  2: ["Poster printing in progress", "LED strip being assembled"],
  3: ["Picked up by courier", "Tracking ID assigned"],
  4: ["En route to your address", "Expected delivery: 1–2 business days"],
  5: ["Delivered to your address", "Thank you for choosing WheelsGlow 🔥"],
};

export function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [input, setInput] = useState(searchParams.get("order") || "");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [animStep, setAnimStep] = useState(0);

  const search = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    setAnimStep(0);
    try {
      const data = await dataApi.trackOrder(id.trim().toUpperCase());
      setOrder(data);
    } catch {
      setError("Order not found. Please double-check your order ID.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); search(input); };

  // Auto-search if order param in URL
  useEffect(() => {
    const param = searchParams.get("order");
    if (param) { setInput(param); search(param); }
  }, []);

  // Animate steps on order load
  useEffect(() => {
    if (!order) return;
    const currentStep = STATUS_STEP[order.status] || 1;
    setAnimStep(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setAnimStep(i);
      if (i >= currentStep) clearInterval(interval);
    }, 400);
    return () => clearInterval(interval);
  }, [order]);

  const currentStep = order ? STATUS_STEP[order.status] || 1 : 0;

  return (
    <div className="min-h-screen px-6 md:px-20 py-16">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="text-neon-accent font-mono text-[10px] uppercase tracking-[0.6em] mb-4 flex items-center justify-center gap-3">
            <span className="w-6 h-px bg-neon-accent" />Track Your Order
          </p>
          <h1 className="text-[14vw] md:text-[9vw] leading-[0.9] font-display mb-4">
            WHERE'S<br />
            <span style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.5)', color: 'transparent' }}>MY ORDER?</span>
          </h1>
          <p className="text-white/35 text-sm max-w-sm mx-auto mt-4">Enter your WheelsGlow order ID — received via WhatsApp after placing your order.</p>
        </motion.div>

        {/* Search form */}
        <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} onSubmit={handleSubmit} className="flex gap-3 mb-10">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/25" />
            <input
              value={input}
              onChange={e => { setInput(e.target.value.toUpperCase()); setError(""); }}
              placeholder="e.g. WG1001234"
              className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-neon-accent/60 transition-colors text-base font-mono tracking-widest placeholder:text-white/20"
            />
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading || !input.trim()}
            className="bg-white text-black px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-neon-accent hover:text-white transition-all flex items-center gap-2 disabled:opacity-40">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Track"}
          </motion.button>
        </motion.form>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-8 text-center mb-8">
              <p className="text-4xl mb-3">📦</p>
              <p className="text-neon-accent font-bold text-sm mb-2">Order Not Found</p>
              <p className="text-white/40 text-sm leading-relaxed">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {order && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-5">

              {/* Order summary */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                  <div>
                    <p className="text-neon-accent font-mono text-xs font-bold mb-1">{order.id}</p>
                    <h2 className="text-xl font-display">{order.productName}</h2>
                    <p className="text-white/40 text-sm mt-1 font-mono">{order.customerName} · {order.city} · {order.size}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-display">₹{order.amount?.toLocaleString('en-IN')}</p>
                    <p className="text-white/25 text-xs font-mono mt-1">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                    </p>
                  </div>
                </div>

                {order.trackingId && (
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <MapPin className="w-4 h-4 text-white/25" />
                    <span className="text-xs text-white/35 font-mono">Courier Tracking: </span>
                    <span className="text-xs font-mono font-bold text-white/70">{order.trackingId}</span>
                  </div>
                )}
              </div>

              {/* Progress tracker */}
              <div className="glass rounded-2xl p-8">
                <h3 className="font-display text-lg mb-8">Delivery Progress</h3>

                {/* Desktop horizontal */}
                <div className="hidden md:block">
                  <div className="relative flex items-center justify-between mb-6">
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/8 rounded-full" />
                    <motion.div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 rounded-full"
                      style={{ background: 'linear-gradient(90deg, #E8C46A, #FF6B00, #00BFFF, #7B61FF, #22c55e)' }}
                      initial={{ width: "0%" }}
                      animate={{ width: `${((Math.min(animStep, currentStep) - 1) / 4) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                    {STEPS.map(step => {
                      const done = animStep >= step.id;
                      const curr = step.id === currentStep;
                      return (
                        <motion.div key={step.id} className="relative z-10"
                          initial={{ scale: 0.5 }} animate={done ? { scale: 1 } : { scale: 0.7 }}
                          transition={{ duration: 0.3, delay: step.id * 0.08 }}>
                          <motion.div className="w-10 h-10 rounded-full flex items-center justify-center border-2"
                            style={{ background: done ? `${step.color}22` : 'rgba(255,255,255,0.04)', borderColor: done ? step.color : 'rgba(255,255,255,0.08)' }}
                            animate={curr && done ? { boxShadow: [`0 0 10px ${step.color}44`, `0 0 22px ${step.color}77`, `0 0 10px ${step.color}44`] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}>
                            <step.icon className="w-4 h-4" style={{ color: done ? step.color : 'rgba(255,255,255,0.15)' }} />
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between">
                    {STEPS.map(step => {
                      const done = animStep >= step.id;
                      const curr = step.id === currentStep;
                      return (
                        <div key={step.id} className="flex flex-col items-center w-20 text-center">
                          <p className="text-[10px] font-mono uppercase tracking-wide" style={{ color: curr && done ? step.color : done ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)' }}>{step.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile vertical */}
                <div className="md:hidden space-y-0">
                  {STEPS.map((step, idx) => {
                    const done = animStep >= step.id;
                    const curr = step.id === currentStep;
                    return (
                      <div key={step.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <motion.div className="w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0"
                            style={{ background: done ? `${step.color}22` : 'transparent', borderColor: done ? step.color : 'rgba(255,255,255,0.08)' }}
                            initial={{ scale: 0.5 }} animate={done ? { scale: 1 } : { scale: 0.7 }}
                            transition={{ delay: step.id * 0.12 }}>
                            <step.icon className="w-3.5 h-3.5" style={{ color: done ? step.color : 'rgba(255,255,255,0.15)' }} />
                          </motion.div>
                          {idx < STEPS.length - 1 && <div className="w-0.5 h-8 my-1 rounded-full" style={{ background: done && animStep > step.id ? step.color : 'rgba(255,255,255,0.06)' }} />}
                        </div>
                        <div className={`${idx < STEPS.length - 1 ? 'pb-6' : ''}`}>
                          <p className="text-sm font-semibold" style={curr && done ? { color: step.color } : { opacity: done ? 1 : 0.2 }}>{step.label}</p>
                          {done && STEP_NOTES[step.id] && STEP_NOTES[step.id].map((n, i) => <p key={i} className="text-xs text-white/35 font-mono mt-0.5">{n}</p>)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Current status */}
                {animStep >= currentStep && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                    className="mt-8 p-5 rounded-xl border"
                    style={{ background: `${STEPS[currentStep - 1]?.color}0D`, borderColor: `${STEPS[currentStep - 1]?.color}28` }}>
                    <p className="text-sm font-bold mb-1.5" style={{ color: STEPS[currentStep - 1]?.color }}>Currently: {order.status}</p>
                    {STEP_NOTES[currentStep]?.map((n, i) => <p key={i} className="text-xs text-white/45 font-mono">{n}</p>)}
                  </motion.div>
                )}
              </div>

              {/* Support */}
              <div className="glass rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                  <PhoneCall className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Need help with your delivery?</p>
                  <p className="text-xs text-white/35 mt-0.5">
                    WhatsApp us at <span className="text-green-400">+91 98765 43210</span> or email <span className="text-neon-accent">support@wheelsglow.store</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 text-center">
          <Link to="/" className="text-white/20 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors">← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
