import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  return (
    <div className="px-6 md:px-20 py-12 min-h-[80vh] max-w-7xl mx-auto">
      <Link to="/collection" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 uppercase tracking-widest font-mono text-xs">
        <ArrowLeft className="w-4 h-4" />
        Continue Shopping
      </Link>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl md:text-8xl mb-16"
      >
        Your Bag ({totalItems})
      </motion.h1>

      {items.length === 0 ? (
        <div className="glass p-12 rounded-3xl text-center space-y-6">
          <p className="text-white/40 font-mono text-sm uppercase tracking-widest cursor-default">Your cart is feeling a bit empty.</p>
          <Link to="/collection" className="inline-block bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-neon-accent hover:text-white transition-colors">
            Start Filling It
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            {items.map(item => (
              <div key={item.id} className="glass p-6 rounded-3xl flex gap-8 items-center relative overflow-hidden group">
                {/* Background Glow */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 10% 50%, ${item.color}, transparent 60%)` }}
                />

                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-24 h-32 object-cover rounded-xl brightness-75"
                />
                
                <div className="flex-1">
                  <h3 className="text-2xl mb-1">{item.name}</h3>
                  <p className="font-mono text-white/40 text-xs tracking-widest mb-4">₹{item.price}</p>
                  
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-white/20 hover:bg-white/10 flex items-center justify-center font-mono"
                    >-</button>
                    <span className="font-mono">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-white/20 hover:bg-white/10 flex items-center justify-center font-mono"
                    >+</button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-mono mb-6">₹{item.price * item.quantity}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-white/40 hover:text-neon-accent transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 glass p-8 rounded-3xl h-fit sticky top-32 space-y-8">
            <h3 className="text-2xl font-mono uppercase tracking-widest border-b border-white/10 pb-4">Summary</h3>
            
            <div className="space-y-4 font-mono text-sm text-white/60">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-white">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span className="text-white">Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex justify-between items-end mb-8">
                <span className="uppercase tracking-widest font-mono text-sm">Total</span>
                <span className="text-4xl font-mono font-bold">₹{totalPrice}</span>
              </div>

              <Link to="/checkout" className="w-full bg-white text-black py-5 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-neon-accent hover:text-white transition-colors">
                Checkout securely
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
