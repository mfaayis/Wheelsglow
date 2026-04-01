import React, { useState, useEffect } from "react";
import { Menu, ShoppingBag, User, X, Zap } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

export function Navbar() {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const top = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(top > 60);
      setScrollProgress(docHeight > 0 ? (top / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-white/5">
        <motion.div
          className="h-full origin-left"
          style={{
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, #FF003D, #FF6B00, #FF003D)',
            boxShadow: '0 0 8px rgba(255,0,61,0.8)',
          }}
          transition={{ ease: 'linear' }}
        />
      </div>

      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center transition-all duration-500 ${
          scrolled
            ? 'py-4 bg-black/80 backdrop-blur-2xl border-b border-white/5'
            : 'bg-transparent'
        }`}
        style={{ top: '2px' }} // below progress bar
      >
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="hover:scale-110 transition-transform text-white group"
          >
            <Menu className="w-6 h-6 group-hover:text-neon-accent transition-colors" />
          </button>

          <Link to="/" className="flex items-center group">
            <motion.h1
              className="text-3xl md:text-4xl font-display uppercase leading-none"
              style={{
                WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.9)',
                color: 'transparent',
                letterSpacing: '-0.08em',
              }}
              whileHover={{
                textShadow: '0 0 20px rgba(255,0,61,0.6)',
                WebkitTextStroke: '1.5px rgba(255,0,61,0.9)',
              } as any}
              transition={{ duration: 0.3 }}
            >
              WHEELSGLOW
            </motion.h1>
          </Link>
        </div>

        <div className="flex items-center gap-8">
          {/* Desktop Links */}
          <div className="hidden md:flex gap-8 text-xs font-mono uppercase tracking-[0.3em] items-center text-white">
            {[
              { to: '/collection', label: 'Collection' },
              { to: '/custom', label: 'Custom' },
              { to: '/about', label: 'About' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`relative hover:text-neon-accent transition-colors group ${location.pathname === to ? 'text-neon-accent' : ''}`}
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-neon-accent group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex gap-5 items-center text-white">
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
                    className="absolute -top-2 -right-2 bg-neon-accent text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold text-white"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>
      </nav>

      {/* Slide Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 left-0 h-full w-[85vw] max-w-sm z-[70] flex flex-col"
              style={{ background: 'rgba(0,0,0,0.95)', borderRight: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(40px)' }}
            >
              {/* Top row */}
              <div className="flex justify-between items-center p-8 border-b border-white/5">
                <div>
                  <h2 className="text-sm font-mono font-bold tracking-[0.3em] uppercase text-white">Navigation</h2>
                  <span className="text-[9px] font-mono tracking-widest text-neon-accent uppercase">WheelsGlow // Menu</span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 border border-white/10 rounded-full hover:bg-white/5 hover:text-neon-accent transition-all text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links */}
              <div className="flex flex-col p-8 gap-2 flex-1">
                {[
                  { to: '/', label: 'Home', num: '01' },
                  { to: '/collection', label: 'Collection', num: '02' },
                  { to: '/custom', label: 'Custom Build', num: '03' },
                  { to: '/about', label: 'About Us', num: '04' },
                ].map(({ to, label, num }, i) => (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 + 0.1 }}
                  >
                    <Link
                      to={to}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-baseline gap-4 py-4 border-b border-white/5 group"
                    >
                      <span className="text-neon-accent font-mono text-xs w-6">{num}</span>
                      <span className="text-3xl font-display uppercase tracking-tight text-white group-hover:text-neon-accent transition-colors">
                        {label}
                      </span>
                    </Link>
                  </motion.div>
                ))}

                <div className="mt-6 flex flex-col gap-3">
                  {[
                    { to: '/faq', label: 'FAQ' },
                    { to: '/contact', label: 'Contact' },
                    { to: '/shipping', label: 'Shipping' },
                  ].map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-xs font-mono tracking-widest uppercase text-white/30 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Bottom */}
              <div className="p-8 border-t border-white/5 flex gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 text-center py-3 font-mono text-xs tracking-widest uppercase border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 text-center py-3 font-mono text-xs tracking-widest uppercase bg-neon-accent text-white rounded-xl hover:bg-neon-orange transition-colors"
                >
                  Register
                </Link>
              </div>

              {/* Neon accent bar */}
              <div className="h-1" style={{ background: 'linear-gradient(90deg, #FF003D, #FF6B00)' }} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
