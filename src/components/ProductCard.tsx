import { motion } from "framer-motion";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Power, ShoppingCart, Zap } from "lucide-react";
import { useCart } from "../context/CartContext";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  color: string;
  description: string;
}

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [isLit, setIsLit] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleImageClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative glass rounded-2xl overflow-hidden transition-all duration-500 hover:border-white/10 hover:shadow-[0_0_30px_rgba(229,199,107,0.1)] flex flex-col"
    >
      <div className="relative cursor-pointer aspect-[3/4] overflow-hidden" onClick={handleImageClick}>
        {/* Base Image */}
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ${isLit ? 'brightness-110 contrast-110' : 'brightness-50 grayscale-[0.8]'}`}
          referrerPolicy="no-referrer"
        />
        
        {/* LED Glow Overlay */}
        <div 
          className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${isLit ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: `radial-gradient(circle at 50% 50%, ${product.color}22 0%, transparent 70%)`,
            boxShadow: `inset 0 0 50px ${product.color}33`
          }}
        />

        {/* Toggle Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsLit(!isLit);
          }}
          className={`absolute top-4 right-4 z-10 p-3 rounded-full transition-all duration-300 ${isLit ? 'bg-white text-black scale-110' : 'bg-black/40 text-white hover:bg-black/60'}`}
        >
          <Power className="w-5 h-5" />
        </button>

        {/* Price Tag */}
        <div className="absolute bottom-4 left-4 glass px-3 py-1 rounded-full text-xs font-mono tracking-widest text-white">
          ₹{product.price}
        </div>
      </div>

      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div 
          className="cursor-pointer"
          onClick={handleImageClick}
        >
          <h3 className="text-2xl mb-1 text-white">{product.name}</h3>
          <p className="text-xs text-white/40 font-mono uppercase tracking-widest">{product.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => addToCart(product)}
            className="flex-1 bg-white text-black py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-neon-accent hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </button>
          <Link to={`/product/${product.id}`} className="p-3 glass rounded-lg text-white hover:bg-white/5 transition-colors">
            <Zap className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
