import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Power, ShoppingCart, Zap } from "lucide-react";
import { useCart } from "../context/CartContext";

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  imageOn?: string;
  color: string;
  description: string;
  category?: string;
  sizes?: string[];
  ledColors?: string[];
  badge?: string;
  whatLightsUp?: string;
  ledEffect?: string;
  specs?: Record<string, string>;
  inBox?: string[];
}

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [isLit, setIsLit] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 10;
    const y = -((e.clientY - rect.top - rect.height / 2) / rect.height) * 10;
    setTilt({ x, y });
  };

  const badgeStyles: Record<string, string> = {
    'Best Seller': 'bg-gold text-black',
    'Hot': 'bg-neon-accent text-white',
    'New': 'bg-neon-blue text-black',
    'Limited': 'bg-white/90 text-black',
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: 'transform 0.12s ease, box-shadow 0.5s ease',
        boxShadow: isLit
          ? `0 0 40px ${product.color}55, 0 0 80px ${product.color}22, 0 20px 60px rgba(0,0,0,0.7)`
          : '0 10px 40px rgba(0,0,0,0.5)',
      }}
      className="group relative glass rounded-2xl overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div
        className="relative overflow-hidden cursor-pointer"
        style={{ aspectRatio: '16/10' }}
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isLit ? 'brightness-100 saturate-110' : 'brightness-40 grayscale-[0.6]'
          }`}
          referrerPolicy="no-referrer"
        />

        {/* LED color glow overlay — only in light area */}
        <AnimatePresence>
          {isLit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at ${product.id <= 2 ? '65% 70%' : '50% 55%'}, ${product.color}55 0%, ${product.color}11 40%, transparent 70%)`,
              }}
            />
          )}
        </AnimatePresence>

        {/* Bottom LED strip glow */}
        {isLit && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
            style={{ background: `linear-gradient(90deg, transparent, ${product.color}, transparent)`, boxShadow: `0 0 12px ${product.color}` }}
          />
        )}

        {/* Badge */}
        {product.badge && (
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest z-10 ${badgeStyles[product.badge] || 'bg-white text-black'}`}>
            {product.badge}
          </div>
        )}

        {/* Power toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsLit(!isLit); }}
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-full transition-all duration-300 ${
            isLit ? 'bg-white text-black' : 'bg-black/50 text-white/80 hover:bg-black/70 backdrop-blur-sm'
          }`}
          style={isLit ? { boxShadow: `0 0 15px ${product.color}99` } : {}}
        >
          {isLit && <span className="absolute inset-0 rounded-full animate-glow-ring border" style={{ borderColor: product.color }} />}
          <Power className="w-4 h-4" />
        </button>

        {/* "What lights up" badge — visible on hover */}
        {product.whatLightsUp && (
          <div className="absolute bottom-3 left-3 right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <div className="glass px-3 py-1.5 rounded-xl text-[9px] font-mono text-white/70 leading-snug">
              💡 {product.whatLightsUp}
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1 gap-4">
        <div className="cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg leading-tight">{product.name}</h3>
          </div>
          <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">{product.description}</p>

          {/* LED Color swatches */}
          {product.ledColors && (
            <div className="flex items-center gap-2 mt-2">
              {product.ledColors.map((c, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ background: c, boxShadow: `0 0 5px ${c}` }}
                />
              ))}
              <span className="text-[9px] text-white/30 font-mono uppercase">LED</span>
            </div>
          )}
        </div>

        {/* Price & Actions */}
        <div className="mt-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-xl font-display text-white">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <span className="text-xs text-white/30 line-through ml-2 font-mono">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => addToCart(product)}
              className="bg-white text-black px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wide hover:bg-neon-accent hover:text-white transition-all flex items-center gap-2"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add
            </button>
            <Link to={`/product/${product.id}`} className="p-2.5 glass rounded-xl hover:bg-white/10 transition-colors">
              <Zap className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
