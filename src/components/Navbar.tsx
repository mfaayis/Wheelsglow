import React, { useState, useEffect } from "react";
import { Menu, ShoppingBag, User, X, BarChart2, MapPin } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const top = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(top > 50);
      setScrollProgress(docH > 0 ? (top / docH) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsMenuOpen(false); }, [location]);

  return (
    <>
      {/* Scroll Progress */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-white/5">
        <div
          className="h-full"
          style={{
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, #FF003D, #FF6B00)',
            boxShadow: '0 0 6px rgba(255,0,61,0.8)',
            transition: 'width 0.1s linear',
          }}
        />
      </div>

      {/* Navbar */}
      <nav
        style={{ top: '2px' }}
        className={`fixed w-full z-50 px-6 flex justify-between items-center transition-all duration-400 ${
          scrolled ? 'py-3 bg-black/85 backdrop-blur-2xl border-b border-white/5' : 'py-5 bg-transparent'
        }`}
      >
        {/* Left */}
        <div className="flex items-center gap-5">
          <button onClick={() => setIsMenuOpen(true)} className="text-white hover:text-neon-accent transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/">
            <motion.span
              className="text-2xl md:text-3xl font-display leading-none"
              style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.9)', color: 'transparent', letterSpacing: '-0.06em' }}
              whileHover={{ WebkitTextStroke: '1.5px rgba(255,0,61,0.9)' } as any}
              transition={{ duration: 0.2 }}
            >
              WHEELSGLOW
            </motion.span>
          </Link>
        </div>

        {/* Center links — desktop */}
        <div className="hidden md:flex gap-8 text-[11px] font-mono uppercase tracking-[0.3em] text-white">
          {[
            { to: '/collection', label: 'Collection' },
            { to: '/custom', label: 'Custom' },
            { to: '/track', label: 'Track Order' },
            { to: '/about', label: 'About' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`relative hover:text-neon-accent transition-colors group ${location.pathname === to ? 'text-neon-accent' : ''}`}
            >
              {label}
              <span className={`absolute -bottom-1 left-0 h-px bg-neon-accent transition-all duration-300 ${location.pathname === to ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>
          ))}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-4 text-white">
          <Link to="/admin" className="opacity-40 hover:opacity-100 transition-opacity" title="Admin">
            <BarChart2 className="w-4 h-4" />
          </Link>
          <Link to="/track" className="opacity-40 hover:opacity-100 transition-opacity md:hidden" title="Track">
            <MapPin className="w-4 h-4" />
          </Link>
          <Link to="/login" className="group">
            <User className="w-5 h-5 group-hover:text-neon-accent transition-colors" />
          </Link>
          <Link to="/cart" className="relative group">
            <ShoppingBag className="w-5 h-5 group-hover:text-neon-accent transition-colors" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 bg-neon-accent text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </nav>

      {/* Slide Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 left-0 h-full w-[85vw] max-w-sm z-[70] flex flex-col"
              style={{ background: 'rgba(0,0,0,0.97)', borderRight: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex justify-between items-center p-7 border-b border-white/5">
                <div>
                  <p className="font-display text-2xl leading-none">MENU</p>
                  <span className="text-[9px] font-mono text-neon-accent uppercase tracking-widest">WheelsGlow</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 border border-white/10 rounded-full hover:bg-white/5 text-white/60 hover:text-neon-accent transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col p-7 flex-1 gap-1">
                {[
                  { to: '/', label: 'Home', num: '01' },
                  { to: '/collection', label: 'Collection', num: '02' },
                  { to: '/custom', label: 'Custom Build', num: '03' },
                  { to: '/track', label: 'Track Order', num: '04' },
                  { to: '/about', label: 'About Us', num: '05' },
                ].map(({ to, label, num }, i) => (
                  <motion.div key={to} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 + 0.1 }}>
                    <Link to={to} onClick={() => setIsMenuOpen(false)} className="flex items-baseline gap-4 py-4 border-b border-white/[0.04] group">
                      <span className="text-neon-accent font-mono text-xs w-6">{num}</span>
                      <span className="text-2xl font-display uppercase tracking-tight text-white group-hover:text-neon-accent transition-colors">{label}</span>
                    </Link>
                  </motion.div>
                ))}

                <div className="mt-6 space-y-3">
                  {[{ to: '/faq', label: 'FAQ' }, { to: '/contact', label: 'Contact' }, { to: '/shipping', label: 'Shipping' }, { to: '/admin', label: 'Admin Dashboard' }].map(({ to, label }) => (
                    <Link key={to} to={to} onClick={() => setIsMenuOpen(false)} className="block text-[10px] font-mono tracking-widest uppercase text-white/25 hover:text-white transition-colors">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-7 border-t border-white/5 flex gap-3">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex-1 text-center py-3 font-mono text-xs tracking-widest uppercase border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-white">Login</Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="flex-1 text-center py-3 font-mono text-xs tracking-widest uppercase bg-neon-accent text-white rounded-xl hover:bg-neon-orange transition-colors">Register</Link>
              </div>
              <div className="h-0.5" style={{ background: 'linear-gradient(90deg, #FF003D, #FF6B00)' }} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
