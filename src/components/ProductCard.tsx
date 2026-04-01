import { motion } from "framer-motion";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Zap } from "lucide-react";
import { useCart } from "../context/CartContext";
import { BeforeAfterSlider } from "./BeforeAfterSlider";

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  color: string;
  description: string;
  category?: string;
  sizes?: string[];
  ledColors?: string[];
  badge?: string;
  ledGlowPosition?: string;
  whatLightsUp?: string;
  ledEffect?: string;
  specs?: Record<string, string>;
  inBox?: string[];
}

const BADGE_STYLES: Record<string, string> = {
  "Best Seller": "bg-yellow-400 text-black",
  "Hot": "bg-neon-accent text-white",
  "New": "bg-cyan-400 text-black",
  "Limited": "bg-white text-black",
};

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6 }}
      className="group relative glass rounded-2xl overflow-hidden flex flex-col"
    >
      {/* Before/After Slider — main visual */}
      <div className="relative">
        <BeforeAfterSlider
          image={product.image}
          ledColor={product.color}
          ledGlowPosition={product.ledGlowPosition}
          initialPosition={52}
        />

        {/* Badge */}
        {product.badge && (
          <div className={`absolute top-3 left-3 z-40 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest pointer-events-none ${BADGE_STYLES[product.badge] || "bg-white text-black"}`}>
            {product.badge}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div
          className="cursor-pointer"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-lg leading-tight pr-2">{product.name}</h3>
            {/* LED color dots */}
            {product.ledColors && (
              <div className="flex gap-1.5 mt-1 flex-shrink-0">
                {product.ledColors.map((c, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full border border-white/10"
                    style={{ background: c, boxShadow: `0 0 5px ${c}` }}
                  />
                ))}
              </div>
            )}
          </div>
          <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">{product.description}</p>
          {product.whatLightsUp && (
            <p className="text-[10px] text-white/30 mt-2 leading-relaxed">💡 {product.whatLightsUp}</p>
          )}
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-2xl font-display">₹{product.price.toLocaleString("en-IN")}</span>
            {product.originalPrice && (
              <span className="text-xs text-white/30 line-through ml-2 font-mono">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => addToCart(product)}
              className="bg-white text-black px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wide hover:bg-neon-accent hover:text-white transition-all flex items-center gap-2"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add
            </motion.button>
            <Link to={`/product/${product.id}`}>
              <motion.button
                whileHover={{ scale: 1.04 }}
                className="p-2.5 glass rounded-xl hover:bg-white/10 transition-colors"
              >
                <Zap className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
