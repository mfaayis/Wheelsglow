import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ArrowLeft, CheckCircle } from "lucide-react";

export function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("processing");
    // Mock processing delay
    setTimeout(() => {
      setStatus("success");
      clearCart();
    }, 2000);
  };

  if (status === "success") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
        <CheckCircle className="w-24 h-24 text-neon-accent mb-8" />
        <h1 className="text-5xl md:text-7xl text-center mb-6">Payment<br/>Successful</h1>
        <p className="text-white/40 font-mono uppercase tracking-widest mb-12 text-center">Your LED poster is being prepared.</p>
        <Link to="/" className="bg-white text-black px-12 py-5 rounded-full font-bold hover:bg-neon-accent hover:text-white transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-20 py-12 min-h-[80vh] max-w-4xl mx-auto">
      <Link to="/cart" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 uppercase tracking-widest font-mono text-xs">
        <ArrowLeft className="w-4 h-4" />
        Back to Cart
      </Link>

      <h1 className="text-5xl md:text-7xl mb-12">Checkout</h1>

      <div className="flex flex-col md:flex-row gap-16">
        <form onSubmit={handleSubmit} className="flex-1 space-y-8">
          <div className="glass p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-mono uppercase tracking-widest border-b border-white/10 pb-4">Contact Info</h3>
            <div className="space-y-4">
              <input type="email" required placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-neon-accent transition-colors" />
              <div className="flex gap-4">
                <input type="text" required placeholder="First Name" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-neon-accent transition-colors" />
                <input type="text" required placeholder="Last Name" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-neon-accent transition-colors" />
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-mono uppercase tracking-widest border-b border-white/10 pb-4">Shipping</h3>
            <div className="space-y-4">
              <input type="text" required placeholder="Address" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-neon-accent transition-colors" />
              <input type="text" required placeholder="City" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-neon-accent transition-colors" />
              <div className="flex gap-4">
                <input type="text" required placeholder="State / Province" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-neon-accent transition-colors" />
                <input type="text" required placeholder="Postal Code" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-neon-accent transition-colors" />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={status === "processing"}
            className="w-full bg-white text-black py-5 rounded-full font-bold hover:bg-neon-accent hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "processing" ? "Processing..." : `Pay ₹${totalPrice}`}
          </button>
        </form>

        <div className="w-full md:w-80 space-y-6 glass p-8 rounded-3xl h-fit">
          <h3 className="text-xl font-mono uppercase tracking-widest border-b border-white/10 pb-4">Order</h3>
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm font-mono text-white/60">
                <span>{item.quantity}x {item.name}</span>
                <span className="text-white">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-4 flex justify-between font-bold font-mono">
            <span>Total</span>
            <span className="text-xl text-neon-accent">₹{totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
