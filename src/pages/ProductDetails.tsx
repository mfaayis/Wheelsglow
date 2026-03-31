import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Power, ShoppingBag, ArrowLeft } from "lucide-react";
import { PRODUCTS } from "../data/products";
import { useCart } from "../context/CartContext";

export function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [isLit, setIsLit] = useState(false);
  
  const product = PRODUCTS.find(p => p.id === Number(id));

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-4xl">Product not found.</div>;
  }

  return (
    <div className="px-6 md:px-20 py-12 min-h-[80vh]">
      <Link to="/collection" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 uppercase tracking-widest font-mono text-xs">
        <ArrowLeft className="w-4 h-4" />
        Back to Collection
      </Link>

      <div className="flex flex-col md:flex-row gap-16 items-start">
        {/* Detail Image */}
        <div className="w-full md:w-1/2 relative glass rounded-[2rem] overflow-hidden group">
          <div className="aspect-[3/4] relative">
            <img 
              src={product.image} 
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-700 ${isLit ? 'brightness-110 contrast-110 scale-105' : 'brightness-50 grayscale-[0.8]'}`}
            />
            
            {/* LED Glow Overlay */}
            <div 
              className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${isLit ? 'opacity-100' : 'opacity-0'}`}
              style={{
                background: `radial-gradient(circle at 50% 50%, ${product.color}22 0%, transparent 70%)`,
                boxShadow: `inset 0 0 100px ${product.color}33`
              }}
            />

            {/* Toggle Button */}
            <button 
              onClick={() => setIsLit(!isLit)}
              className={`absolute top-6 right-6 z-10 p-4 rounded-full transition-all duration-300 ${isLit ? 'bg-white text-black scale-110' : 'bg-black/40 text-white hover:bg-black/60'}`}
            >
              <Power className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 md:sticky md:top-32 space-y-12">
          <div>
            <p className="text-neon-accent font-mono text-xs uppercase tracking-[0.5em] mb-4">{product.description}</p>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl leading-none tracking-tighter mb-4"
            >
              {product.name}
            </motion.h1>
            <p className="text-3xl font-mono text-white/80">₹{product.price}</p>
          </div>

          <div className="space-y-6 text-white/50 leading-relaxed max-w-lg">
            <p>
              Experience the perfect fusion of automotive passion and cyberpunk aesthetics. This premium artwork is printed on 300 GSM museum-grade matte paper, ensuring vivid colors even when the lights are off.
            </p>
            <p>
              When activated, the integrated LED backlighting highlights the contours of the {product.name}, creating a stunning 3D depth effect that transforms your space instantly.
            </p>
          </div>

          <div className="space-y-4 pt-8 border-t border-white/10">
            <button 
              onClick={() => addToCart(product)}
              className="w-full sm:w-auto bg-white text-black px-12 py-5 rounded-full font-bold text-lg hover:bg-neon-accent hover:text-white transition-all flex items-center justify-center gap-3"
            >
              <ShoppingBag className="w-5 h-5" />
              Add to Cart
            </button>
          </div>

          <ul className="space-y-4 text-sm font-mono text-white/40">
            <li className="flex gap-4"><span>Shipping</span><span className="text-white">Free standard delivery</span></li>
            <li className="flex gap-4"><span>Included</span><span className="text-white">Poster, LED Remote, 12V Adapter</span></li>
            <li className="flex gap-4"><span>Warranty</span><span className="text-white">1 Year Limited</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
