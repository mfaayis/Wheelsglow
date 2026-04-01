import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Trash2, Check, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { dataApi } from "../lib/dataApi";

const INDIAN_STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry","Chandigarh"];

export function Checkout() {
  const { items, totalPrice, clearCart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: "", customerEmail: "", customerPhone: "",
    address: "", city: "", state: "Maharashtra", pincode: "", notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ orderId: string } | null>(null);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return setError("Your cart is empty.");
    setLoading(true);
    setError("");
    try {
      const product = items[0];
      const orderId = await dataApi.createOrder({
        ...form,
        productId: product.id,
        productName: product.name,
        size: product.description || "-",
        amount: totalPrice,
      });
      clearCart();
      setSuccess({ orderId });
    } catch (err: any) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-3xl p-12 max-w-md w-full text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 bg-green-500/15 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-500/25">
            <Check className="w-8 h-8 text-green-400" />
          </motion.div>
          <h1 className="text-4xl font-display mb-2">ORDER PLACED!</h1>
          <p className="text-white/40 text-sm mb-8">Your WheelsGlow poster is being prepared. We'll update you on WhatsApp.</p>
          <div className="glass rounded-xl p-5 mb-8">
            <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-1">Order ID</p>
            <p className="text-2xl font-display text-neon-accent tracking-wider">{success.orderId}</p>
            <p className="text-xs text-white/30 mt-2 font-mono">Save this ID to track your order</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link to={`/track?order=${success.orderId}`}>
              <motion.button whileHover={{ scale: 1.03 }} className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-wide text-sm hover:bg-neon-accent hover:text-white transition-all">
                Track My Order →
              </motion.button>
            </Link>
            <Link to="/">
              <button className="w-full py-3 text-white/35 font-mono text-xs uppercase tracking-widest hover:text-white transition-colors">← Back to Store</button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-20 py-12 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate(-1)} className="p-2 glass rounded-xl text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-4xl font-display">Checkout</h1>
          <p className="text-white/35 text-sm font-mono">{items.length} item{items.length !== 1 ? 's' : ''} · ₹{totalPrice.toLocaleString('en-IN')}</p>
        </div>
      </motion.div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingCart className="w-12 h-12 text-white/15 mx-auto mb-4" />
          <p className="text-white/35 mb-6">Your cart is empty</p>
          <Link to="/collection">
            <motion.button whileHover={{ scale: 1.04 }} className="bg-white text-black px-8 py-4 rounded-full font-bold uppercase text-sm">Browse Collection</motion.button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
          {/* Order form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
            <div className="glass rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-display">Contact Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 block mb-2">Full Name *</label>
                  <input required value={form.customerName} onChange={e => set("customerName", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-neon-accent/60 transition-colors" placeholder="Arjun Verma" />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 block mb-2">Phone *</label>
                  <input required value={form.customerPhone} onChange={e => set("customerPhone", e.target.value)} type="tel" pattern="[0-9]{10}"
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-neon-accent/60 transition-colors" placeholder="9876543210" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 block mb-2">Email *</label>
                <input required value={form.customerEmail} onChange={e => set("customerEmail", e.target.value)} type="email"
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-neon-accent/60 transition-colors" placeholder="your@email.com" />
              </div>
            </div>

            <div className="glass rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-display">Delivery Address</h2>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 block mb-2">Full Address *</label>
                <textarea required value={form.address} onChange={e => set("address", e.target.value)} rows={2}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-neon-accent/60 transition-colors resize-none" placeholder="House/Flat No., Street, Landmark" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 block mb-2">City *</label>
                  <input required value={form.city} onChange={e => set("city", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-neon-accent/60 transition-colors" placeholder="Mumbai" />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 block mb-2">State *</label>
                  <select value={form.state} onChange={e => set("state", e.target.value)} className="w-full bg-black border border-white/10 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-neon-accent/60 transition-colors">
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 block mb-2">Pincode *</label>
                  <input required value={form.pincode} onChange={e => set("pincode", e.target.value)} pattern="[0-9]{6}"
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-neon-accent/60 transition-colors" placeholder="400001" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 block mb-2">Delivery Notes (optional)</label>
                <input value={form.notes} onChange={e => set("notes", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-neon-accent/60 transition-colors" placeholder="Leave at door, ring bell…" />
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-display mb-4">Payment</h2>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-yellow-400/20 bg-yellow-400/5">
                <span className="text-2xl">💵</span>
                <div>
                  <p className="text-sm font-bold text-yellow-400">Cash on Delivery</p>
                  <p className="text-xs text-white/35 mt-0.5">Pay when your poster arrives. No advance payment required.</p>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="p-4 bg-neon-accent/8 border border-neon-accent/25 rounded-xl text-sm text-neon-accent">
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
              className="w-full bg-white text-black py-5 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-neon-accent hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order…</> : <>Place Order · ₹{totalPrice.toLocaleString('en-IN')}</>}
            </motion.button>
          </form>

          {/* Order summary */}
          <div className="lg:col-span-2 space-y-5">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-display mb-5">Your Cart</h2>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.imageOn || item.image} alt={item.name} className="w-16 h-14 object-cover rounded-xl brightness-75" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold leading-tight truncate">{item.name}</p>
                      <p className="text-[10px] text-white/35 font-mono mt-0.5 truncate">{item.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-5 h-5 glass rounded flex items-center justify-center text-white/40 hover:text-white text-xs">−</button>
                        <span className="text-xs w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-5 h-5 glass rounded flex items-center justify-center text-white/40 hover:text-white text-xs">+</button>
                        <button onClick={() => removeFromCart(item.id)} className="ml-2 text-white/20 hover:text-neon-accent transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-display text-lg">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/5 mt-6 pt-5 space-y-2.5">
                <div className="flex justify-between text-sm text-white/40"><span>Subtotal</span><span>₹{totalPrice.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-sm text-green-400"><span>Shipping</span><span>Free</span></div>
                <div className="flex justify-between font-display text-xl border-t border-white/5 pt-4"><span>Total</span><span>₹{totalPrice.toLocaleString('en-IN')}</span></div>
              </div>
            </div>
            <div className="space-y-2">
              {["Free pan-India shipping", "Cash on delivery — pay on arrival", "Dispatched within 48 hours", "Order updates via WhatsApp"].map(item => (
                <div key={item} className="flex items-center gap-3 text-xs text-white/35">
                  <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />{item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
