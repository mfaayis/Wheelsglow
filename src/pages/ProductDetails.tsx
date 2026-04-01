import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ArrowLeft, Check, Package, Shield, Truck, Zap, Heart } from "lucide-react";
import { PRODUCTS, SIZE_PRICES } from "../data/products";
import { BeforeAfterSlider } from "../components/BeforeAfterSlider";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const product = PRODUCTS.find(p => p.id === parseInt(id || "0"));

  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[1] || "");
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <p className="text-6xl mb-4">🔦</p>
          <h1 className="text-3xl font-display mb-4">Product Not Found</h1>
          <Link to="/collection" className="text-neon-accent underline">← Back to Collection</Link>
        </div>
      </div>
    );
  }

  const currentPrice = SIZE_PRICES[selectedSize] || product.price;
  const otherProduct = PRODUCTS.find(p => p.id !== product.id);

  const handleAddToCart = () => {
    addToCart({ ...product, price: currentPrice, description: `${product.description} · ${selectedSize}` });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Back button */}
      <div className="px-6 md:px-20 pt-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors font-mono text-xs uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="px-6 md:px-20 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">

          {/* ── LEFT: Before/After Slider */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <BeforeAfterSlider
              imageBefore={product.image}
              imageAfter={product.imageOn || product.image}
              ledColor={product.color}
              aspectRatio="4/3"
              initialPosition={48}
              className="rounded-2xl overflow-hidden"
            />
            <p className="text-center text-[10px] font-mono text-white/30 uppercase tracking-widest mt-4">
              ← Drag slider to reveal LED effect
            </p>
          </motion.div>

          {/* ── RIGHT: Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col gap-6">
            {/* Badge */}
            {product.badge && (
              <span className="w-fit px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-yellow-400 text-black">{product.badge}</span>
            )}

            <div>
              <h1 className="text-4xl md:text-5xl font-display leading-tight">{product.name}</h1>
              <p className="text-white/50 font-mono text-sm mt-2">{product.description}</p>
            </div>

            {/* LED Effect */}
            <div className="glass rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ background: product.color, boxShadow: `0 0 8px ${product.color}` }} />
                <p className="text-sm font-bold">What Lights Up</p>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">{product.ledEffect}</p>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <p className="font-bold text-sm">Select Size</p>
                <p className="text-xs text-white/40 font-mono">Size affects price</p>
              </div>
              <div className="flex flex-col gap-3">
                {product.sizes?.map(size => {
                  const price = SIZE_PRICES[size];
                  const isSelected = selectedSize === size;
                  return (
                    <motion.button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-all ${isSelected ? 'border-neon-accent bg-neon-accent/10 text-white' : 'border-white/10 text-white/60 hover:border-white/30 hover:text-white'}`}
                    >
                      <span className="font-mono text-sm">{size}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-display text-lg">₹{price.toLocaleString('en-IN')}</span>
                        {isSelected && <Check className="w-4 h-4 text-neon-accent" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-display">₹{currentPrice.toLocaleString('en-IN')}</span>
              {product.originalPrice && selectedSize === product.sizes?.[1] && (
                <span className="text-lg text-white/30 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              )}
              <span className="text-sm text-green-400 font-mono">Free Shipping</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-all"
                style={{ background: added ? '#22c55e' : 'white', color: 'black' }}
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span key="added" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-2">
                      <Check className="w-4 h-4" /> Added!
                    </motion.span>
                  ) : (
                    <motion.span key="add" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <Link to="/checkout" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => addToCart({ ...product, price: currentPrice })}
                  className="w-full h-full py-4 rounded-xl font-bold text-sm uppercase tracking-wide bg-neon-accent text-white hover:bg-orange-500 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" /> Buy Now
                </motion.button>
              </Link>
              
              {/* Wishlist Button */}
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => toggleWishlist(product.id)}
                className="w-14 h-14 rounded-xl glass border border-white/10 flex items-center justify-center group shrink-0 hover:bg-white/5 transition-colors"
                title="Add to Wishlist"
              >
                <Heart className={`w-5 h-5 transition-colors ${isInWishlist(product.id) ? 'fill-neon-accent text-neon-accent' : 'text-white/50 group-hover:text-white'}`} />
              </motion.button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Truck, label: "Free Shipping", sub: "Pan India" },
                { icon: Shield, label: "1 Year", sub: "LED Warranty" },
                { icon: Package, label: "48hr", sub: "Dispatch" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="glass rounded-xl p-3 text-center">
                  <Icon className="w-4 h-4 mx-auto mb-1.5 text-neon-accent" />
                  <p className="text-xs font-bold">{label}</p>
                  <p className="text-[9px] text-white/40 font-mono">{sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Full Specs */}
        <div className="max-w-7xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Specs Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-2xl p-8">
            <h2 className="text-2xl font-display mb-6">Specifications</h2>
            <div className="space-y-4">
              {Object.entries(product.specs || {}).map(([key, value]) => (
                <div key={key} className="flex gap-4 py-3 border-b border-white/5 last:border-0">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 w-24 flex-shrink-0 pt-0.5">{key}</span>
                  <span className="text-sm text-white/80">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* What's in the Box */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-8">
            <h2 className="text-2xl font-display mb-6">What's In The Box</h2>
            <div className="space-y-4">
              {product.inBox?.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                  <div className="w-7 h-7 rounded-full bg-neon-accent/10 border border-neon-accent/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-neon-accent" />
                  </div>
                  <span className="text-sm text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Related Product */}
        {otherProduct && (
          <div className="max-w-7xl mx-auto mt-16">
            <h2 className="text-2xl font-display mb-8">Also Available</h2>
            <div className="max-w-md">
              <Link to={`/product/${otherProduct.id}`}>
                <motion.div whileHover={{ scale: 1.01 }} className="glass rounded-2xl overflow-hidden flex items-center gap-5 p-4 cursor-pointer">
                  <img src={otherProduct.imageOn || otherProduct.image} alt={otherProduct.name}
                    className="w-24 h-16 object-cover rounded-xl" />
                  <div>
                    <p className="font-bold">{otherProduct.name}</p>
                    <p className="text-xs text-white/40 font-mono">{otherProduct.description}</p>
                    <p className="text-neon-accent font-display mt-1">₹{otherProduct.price.toLocaleString('en-IN')}</p>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-white/40 ml-auto rotate-180" />
                </motion.div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
