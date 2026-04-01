import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, CheckCircle, Truck, Clock, MapPin, Box, PhoneCall } from "lucide-react";
import { MOCK_ORDERS } from "../data/products";
import { Link, useSearchParams } from "react-router-dom";

const STEPS = [
  { id: 1, label: "Order Placed",    icon: Box,          color: "#E8C46A" },
  { id: 2, label: "Processing",      icon: Clock,        color: "#FF6B00" },
  { id: 3, label: "Dispatched",      icon: Package,      color: "#00BFFF" },
  { id: 4, label: "In Transit",      icon: Truck,        color: "#7B61FF" },
  { id: 5, label: "Delivered",       icon: CheckCircle,  color: "#22c55e" },
];

const STATUS_TO_STEP: Record<string, number> = {
  "Processing": 2,
  "Dispatched": 3,
  "In Transit": 4,
  "Delivered": 5,
};

const STEP_DATES: Record<number, string[]> = {
  1: ["Order received", "Confirmation sent via WhatsApp"],
  2: ["Poster printing started", "LED components assembled"],
  3: ["Picked up by courier", "Tracking number assigned"],
  4: ["In transit to your city", "Expected delivery: 1–2 days"],
  5: ["Delivered successfully", "Thank you for choosing WheelsGlow!"],
};

export function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("order") || "");
  const [inputValue, setInputValue] = useState(searchParams.get("order") || "");
  const [order, setOrder] = useState<typeof MOCK_ORDERS[0] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [animStep, setAnimStep] = useState(0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = MOCK_ORDERS.find(o => o.id.toUpperCase() === inputValue.toUpperCase().trim());
    if (found) {
      setOrder(found);
      setOrderId(found.id);
      setNotFound(false);
      setAnimStep(0);
    } else {
      setOrder(null);
      setNotFound(true);
    }
  };

  // Auto-search if URL param present
  useEffect(() => {
    const param = searchParams.get("order");
    if (param) {
      const found = MOCK_ORDERS.find(o => o.id === param);
      if (found) { setOrder(found); setNotFound(false); }
    }
  }, [searchParams]);

  // Animate steps sequentially after order is found
  useEffect(() => {
    if (!order) return;
    const currentStep = STATUS_TO_STEP[order.status] || 1;
    setAnimStep(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setAnimStep(i);
      if (i >= currentStep) clearInterval(interval);
    }, 400);
    return () => clearInterval(interval);
  }, [order]);

  const currentStep = order ? (STATUS_TO_STEP[order.status] || 1) : 0;

  return (
    <div className="min-h-screen px-6 md:px-20 py-16">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="text-neon-accent font-mono text-[10px] uppercase tracking-[0.6em] mb-4 flex items-center justify-center gap-3">
            <span className="w-6 h-px bg-neon-accent" />
            Live Tracking
          </p>
          <h1 className="text-[12vw] md:text-[8vw] leading-[0.9] font-display mb-4">TRACK<br /><span style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.7)', color: 'transparent' }}>YOUR ORDER</span></h1>
          <p className="text-white/40 text-sm">Enter your WheelsGlow order ID (e.g. WG1001–WG1008)</p>
        </motion.div>

        {/* Search */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSearch}
          className="flex gap-3 mb-10"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              value={inputValue}
              onChange={e => { setInputValue(e.target.value); setNotFound(false); }}
              placeholder="WG1001"
              className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-neon-accent transition-colors text-base font-mono tracking-widest"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="bg-white text-black px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-neon-accent hover:text-white transition-all"
          >
            Track
          </motion.button>
        </motion.form>

        {/* Sample IDs tip */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-white/25 text-xs font-mono text-center mb-10">
          Try: WG1001 · WG1002 · WG1003 · WG1004 · WG1005
        </motion.p>

        {/* Not found */}
        <AnimatePresence>
          {notFound && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-8 text-center mb-8">
              <p className="text-neon-accent font-mono text-sm mb-2">Order not found</p>
              <p className="text-white/40 text-sm">Check your order ID and try again, or <Link to="/contact" className="text-neon-accent hover:underline">contact support</Link>.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order found */}
        <AnimatePresence>
          {order && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

              {/* Order Summary Card */}
              <motion.div className="glass rounded-2xl p-6 mb-8">
                <div className="flex items-start justify-between mb-5 flex-wrap gap-4">
                  <div>
                    <p className="text-neon-accent font-mono text-xs mb-1">{order.id}</p>
                    <h2 className="text-xl font-display">{order.product}</h2>
                    <p className="text-white/40 text-sm mt-1">{order.customer} · {order.city} · Size {order.size}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-display">₹{order.amount.toLocaleString('en-IN')}</p>
                    <p className="text-white/30 text-xs font-mono mt-1">{order.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-5 border-t border-white/5">
                  <MapPin className="w-4 h-4 text-white/30" />
                  <div>
                    <span className="text-xs text-white/30 font-mono">Tracking ID: </span>
                    <span className="text-xs font-mono text-white/70">{order.tracking}</span>
                  </div>
                </div>
              </motion.div>

              {/* Animated Step Progress */}
              <div className="glass rounded-2xl p-8 mb-6">
                <h3 className="font-display text-lg mb-8">Delivery Progress</h3>

                {/* Horizontal steps — desktop */}
                <div className="hidden md:block">
                  {/* Step dots + line */}
                  <div className="relative flex items-center justify-between mb-6">
                    {/* Background line */}
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/10" />
                    {/* Filled line */}
                    <motion.div
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5"
                      style={{ background: 'linear-gradient(90deg, #E8C46A, #FF6B00, #00BFFF, #7B61FF, #22c55e)' }}
                      initial={{ width: "0%" }}
                      animate={{ width: animStep >= currentStep ? `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` : `${((animStep - 1) / (STEPS.length - 1)) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />

                    {STEPS.map((step) => {
                      const isDone = animStep >= step.id;
                      const isCurrent = step.id === currentStep;
                      return (
                        <motion.div
                          key={step.id}
                          className="relative z-10 flex flex-col items-center"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={isDone ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0.3 }}
                          transition={{ duration: 0.3, delay: step.id * 0.1 }}
                        >
                          <motion.div
                            className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all"
                            style={{
                              background: isDone ? `${step.color}22` : 'transparent',
                              borderColor: isDone ? step.color : 'rgba(255,255,255,0.1)',
                              boxShadow: isCurrent && animStep >= step.id ? `0 0 20px ${step.color}66` : 'none',
                            }}
                            animate={isCurrent && animStep >= step.id ? { boxShadow: [`0 0 10px ${step.color}44`, `0 0 25px ${step.color}88`, `0 0 10px ${step.color}44`] } : {}}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <step.icon className="w-4 h-4" style={{ color: isDone ? step.color : 'rgba(255,255,255,0.2)' }} />
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Step labels */}
                  <div className="flex justify-between">
                    {STEPS.map((step) => {
                      const isDone = animStep >= step.id;
                      const isCurrent = step.id === currentStep;
                      return (
                        <div key={step.id} className="flex flex-col items-center text-center w-20">
                          <p className={`text-xs font-mono uppercase tracking-wide ${isDone ? 'text-white' : 'text-white/25'}`} style={isCurrent && isDone ? { color: step.color } : {}}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Vertical steps — mobile */}
                <div className="md:hidden space-y-0">
                  {STEPS.map((step, idx) => {
                    const isDone = animStep >= step.id;
                    const isCurrent = step.id === currentStep;
                    const isLast = idx === STEPS.length - 1;
                    return (
                      <div key={step.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <motion.div
                            className="w-9 h-9 rounded-full flex items-center justify-center border-2 flex-shrink-0"
                            style={{ background: isDone ? `${step.color}22` : 'transparent', borderColor: isDone ? step.color : 'rgba(255,255,255,0.1)' }}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={isDone ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0.3 }}
                            transition={{ delay: step.id * 0.15 }}
                          >
                            <step.icon className="w-4 h-4" style={{ color: isDone ? step.color : 'rgba(255,255,255,0.2)' }} />
                          </motion.div>
                          {!isLast && (
                            <motion.div
                              className="w-0.5 flex-1 my-1"
                              style={{ background: isDone && animStep > step.id ? step.color : 'rgba(255,255,255,0.08)' }}
                              initial={{ scaleY: 0 }}
                              animate={isDone ? { scaleY: 1 } : {}}
                              style={{ originY: 0, background: isDone && animStep > step.id ? step.color : 'rgba(255,255,255,0.08)' }}
                              transition={{ delay: step.id * 0.15 + 0.2 }}
                            />
                          )}
                        </div>
                        <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                          <p className={`text-sm font-bold ${isDone ? 'text-white' : 'text-white/25'}`} style={isCurrent && isDone ? { color: step.color } : {}}>
                            {step.label}
                          </p>
                          {isDone && STEP_DATES[step.id] && (
                            <div className="mt-1 space-y-0.5">
                              {STEP_DATES[step.id].map((line, i) => (
                                <p key={i} className="text-xs text-white/40 font-mono">{line}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Current status detail */}
                {animStep >= currentStep && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 p-5 rounded-xl border"
                    style={{ background: `${STEPS[currentStep - 1]?.color}0D`, borderColor: `${STEPS[currentStep - 1]?.color}30` }}
                  >
                    <p className="text-sm font-bold mb-1" style={{ color: STEPS[currentStep - 1]?.color }}>
                      Current Status: {order.status}
                    </p>
                    {STEP_DATES[currentStep]?.map((line, i) => (
                      <p key={i} className="text-xs text-white/50 font-mono">{line}</p>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Support */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="glass rounded-2xl p-6 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-neon-accent/10 border border-neon-accent/20 flex items-center justify-center flex-shrink-0">
                  <PhoneCall className="w-5 h-5 text-neon-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Need help with your order?</p>
                  <p className="text-xs text-white/40 mt-0.5">WhatsApp us at <span className="text-neon-accent">+91 98765 43210</span> or <Link to="/contact" className="text-neon-accent hover:underline">contact support</Link></p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to store */}
        <div className="mt-10 text-center">
          <Link to="/" className="text-white/30 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors">
            ← Back to WheelsGlow
          </Link>
        </div>
      </div>
    </div>
  );
}
