import React, { useState } from "react";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 px-6 py-8 flex justify-between items-center mix-blend-difference text-white">
        <div className="flex items-center gap-8">
          <button onClick={() => setIsMenuOpen(true)} className="hover:scale-110 transition-transform">
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center">
            <h1 className="text-3xl font-mono font-bold tracking-[0.2em] uppercase leading-none">WheelsGlow</h1>
          </Link>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-8 text-xs font-mono uppercase tracking-[0.3em] items-center">
            <Link to="/collection" className="hover:text-neon-accent transition-colors">Collection</Link>
            <Link to="/custom" className="hover:text-neon-accent transition-colors">Custom</Link>
            <Link to="/about" className="hover:text-neon-accent transition-colors">About</Link>
          </div>
          <div className="flex gap-6 items-center">
            <Link to="/login" className="group">
              <User className="w-5 h-5 group-hover:text-neon-accent transition-colors" />
            </Link>
            <Link to="/cart" className="relative group">
              <ShoppingBag className="w-5 h-5 group-hover:text-neon-accent transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-neon-accent text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile / Left Slide Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[85vw] max-w-sm glass border-r border-white/10 z-[70] p-10 flex flex-col"
            >
              <div className="flex justify-between items-center mb-16">
                <div>
                  <h2 className="text-xl font-mono font-bold tracking-[0.2em] uppercase leading-none">Menu</h2>
                  <span className="text-[8px] font-mono tracking-widest text-neon-accent uppercase">Navigation // 01</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 border border-white/10 rounded-full hover:bg-white/10 hover:text-neon-accent transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-8 flex-1">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-3xl font-display uppercase tracking-tight hover:text-neon-accent transition-colors">Home</Link>
                <Link to="/collection" onClick={() => setIsMenuOpen(false)} className="text-3xl font-display uppercase tracking-tight hover:text-neon-accent transition-colors">Collection</Link>
                <Link to="/custom" onClick={() => setIsMenuOpen(false)} className="text-3xl font-display uppercase tracking-tight hover:text-neon-accent transition-colors">Custom Build</Link>
                <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-3xl font-display uppercase tracking-tight hover:text-neon-accent transition-colors">About Us</Link>
                
                <div className="w-full h-px bg-white/10 my-4" />

                <Link to="/faq" onClick={() => setIsMenuOpen(false)} className="text-sm font-mono tracking-widest uppercase text-white/40 hover:text-white transition-colors">FAQ</Link>
                <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-sm font-mono tracking-widest uppercase text-white/40 hover:text-white transition-colors">Contact</Link>
              </div>

              <div className="mt-auto pt-8 border-t border-white/10 flex gap-4">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex-1 text-center py-3 font-mono text-xs tracking-widest uppercase hover:bg-white/5 rounded-lg transition-colors border border-white/10">Login</Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="flex-1 text-center py-3 font-mono text-xs tracking-widest uppercase bg-white text-black hover:bg-neon-accent hover:text-white rounded-lg transition-colors">Register</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
