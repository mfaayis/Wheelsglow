import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Power } from 'lucide-react';

const OFF_IMAGE = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200";
const ON_IMAGE  = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200";

export const HeroLEDDemo: React.FC = () => {
  const [isLit, setIsLit] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* Poster Image with LED effect */}
      <div className={`w-full h-full transition-all duration-700 ${isLit ? 'led-on' : 'led-off'}`}>
        <img
          src={OFF_IMAGE}
          alt="WheelsGlow LED Poster"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* LED Color Overlay — only visible when lit */}
      <AnimatePresence>
        {isLit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 60% 80%, rgba(255,107,0,0.35) 0%, rgba(255,0,61,0.2) 40%, transparent 70%)',
              boxShadow: 'inset 0 -60px 80px rgba(255,0,61,0.4), inset 60px 0 80px rgba(255,107,0,0.2)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Bottom edge neon strip — visible when lit */}
      <AnimatePresence>
        {isLit && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="absolute bottom-0 left-0 right-0 h-1 rounded-full"
            style={{ background: 'linear-gradient(90deg, #FF003D, #FF6B00, #FF003D)', boxShadow: '0 0 20px #FF6B00, 0 0 40px #FF003D' }}
          />
        )}
      </AnimatePresence>

      {/* LED Toggle Button */}
      <motion.button
        onClick={() => setIsLit(!isLit)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`absolute bottom-6 right-6 flex items-center gap-3 px-5 py-3 rounded-full font-mono text-xs uppercase tracking-widest font-bold transition-all duration-500 z-10 ${
          isLit
            ? 'bg-white text-black neon-glow-red'
            : 'bg-black/50 text-white border border-white/20 backdrop-blur-sm'
        }`}
      >
        {/* Pulse ring when lit */}
        {isLit && (
          <span className="absolute inset-0 rounded-full border border-white/40 animate-glow-ring" />
        )}
        <Power className={`w-4 h-4 ${isLit ? 'text-neon-accent' : ''}`} />
        {isLit ? 'LED ON' : 'LED OFF'}
      </motion.button>

      {/* Status indicator dots */}
      <div className="absolute top-6 left-6 flex gap-1.5 z-10">
        {['#FF003D', '#FF6B00', '#00D1FF', '#CCFF00'].map((c, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            animate={isLit ? { opacity: [0.4, 1, 0.4], scale: [0.8, 1, 0.8] } : { opacity: 0.2, scale: 0.8 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            style={{ background: c, boxShadow: isLit ? `0 0 8px ${c}` : 'none' }}
          />
        ))}
      </div>

      {/* Tag */}
      <div className="absolute top-6 right-6 z-10">
        <div className="glass px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-white/60">
          {isLit ? '● LIVE' : '○ OFF'}
        </div>
      </div>
    </div>
  );
};
