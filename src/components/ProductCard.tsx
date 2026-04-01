import { motion } from "framer-motion";
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Power, ShoppingCart, Zap, Star } from "lucide-react";
import { useCart } from "../context/CartContext";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  color: string;
  description: string;
  category?: string;
  sizes?: string[];
  ledColors?: string[];
  badge?: string;
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
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = ((e.clientX - centerX) / rect.width) * 12;
    const y = -((e.clientY - centerY) / rect.height) * 12;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const handleImageClick = () => navigate(`/product/${product.id}`);

  const badgeColors: Record<string, string> = {
    'Best Seller': 'bg-gold text-black',
    'New': 'bg-neon-blue text-black',
    'Hot': 'bg-neon-accent text-white',
    'Limited': 'bg-white text-black',
    'Premium': 'bg-gold text-black',
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: 'transform 0.1s ease, box-shadow 0.6s ease',
        boxShadow: isLit
          ? `0 0 30px ${product.color}55, 0 0 60px ${product.color}22, 0 20px 60px rgba(0,0,0,0.6)`
          : '0 20px 60px rgba(0,0,0,0.5)',
      }}
      className="group relative glass rounded-2xl overflow-hidden flex flex-col card-glow"
    >
      {/* Image Section */}
      <div className="relative cursor-pointer aspect-[3/4] overflow-hidden" onClick={handleImageClick}>
        {/* Base Image */}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isLit ? 'brightness-110 contrast-110 saturate-110' : 'brightness-45 grayscale-[0.7]'
          }`}
          referrerPolicy="no-referrer"
        />

        {/* LED Color Glow Overlay */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${isLit ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: `radial-gradient(ellipse at 50% 80%, ${product.color}44 0%, ${product.color}11 50%, transparent 75%)`,
            boxShadow: `inset 0 -60px 80px ${product.color}33, inset 0 0 40px ${product.color}11`,
          }}
        />

        {/* Bottom LED Strip */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-500 ${isLit ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: `linear-gradient(90deg, transparent, ${product.color}, transparent)`, boxShadow: `0 0 15px ${product.color}` }}
        />

        {/* Badge */}
        {product.badge && (
          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest z-10 ${badgeColors[product.badge] || 'bg-white text-black'}`}>
            {product.badge}
          </div>
        )}

        {/* LED Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLit(!isLit);
          }}
          className={`absolute top-4 right-4 z-10 p-3 rounded-full transition-all duration-400 ${
            isLit ? 'bg-white text-black scale-110' : 'bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm'
          }`}
          style={isLit ? { boxShadow: `0 0 20px ${product.color}88` } : {}}
        >
          {/* Pulse ring when lit */}
          {isLit && (
            <span
              className="absolute inset-0 rounded-full animate-glow-ring"
              style={{ borderColor: product.color }}
            />
          )}
          <Power className="w-4 h-4" />
        </button>

        {/* Price Tag */}
        <div className="absolute bottom-4 left-4 glass px-3 py-1.5 rounded-full text-xs font-mono tracking-widest text-white z-10">
          ₹{product.price.toLocaleString('en-IN')}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="cursor-pointer" onClick={handleImageClick}>
          <h3 className="text-xl mb-1 text-white leading-tight">{product.name}</h3>
          <p className="text-xs text-white/40 font-mono uppercase tracking-widest">{product.description}</p>

          {/* LED Color Swatches */}
          {product.ledColors && (
            <div className="flex gap-2 mt-3">
              {product.ledColors.map((c, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full border border-white/10"
                  style={{ background: c, boxShadow: `0 0 6px ${c}` }}
                />
              ))}
              <span className="text-white/30 text-[10px] font-mono ml-1 self-center">LED COLORS</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 bg-white text-black hover:bg-neon-accent hover:text-white"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
          <Link
            to={`/product/${product.id}`}
            className="p-3 glass rounded-xl text-white hover:bg-white/10 transition-colors"
          >
            <Zap className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
