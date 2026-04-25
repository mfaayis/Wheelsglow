import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ArrowLeft, Check, Package, Shield, Truck, Zap, Heart, ChevronDown, Star } from "lucide-react";
import { PRODUCTS, SIZE_PRICES } from "../data/products";
import { BeforeAfterSlider } from "../components/BeforeAfterSlider";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { SEO } from "../components/SEO";

const Accordion = ({ title, data, initialOpen = true }: { title: string; data: Record<string, string>; initialOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  return (
    <div className="border border-white/10 rounded-xl mb-4 overflow-hidden bg-white/5 backdrop-blur-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors"
      >
        <span className="font-bold text-sm tracking-wide text-white">{title}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-white/5 space-y-3 bg-black/20">
              {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex gap-4">
                  <span className="w-1/3 text-xs font-mono uppercase tracking-widest text-white/40">{key}</span>
                  <span className="w-2/3 text-xs text-white/90">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const product = PRODUCTS.find(p => p.id === parseInt(id || "0"));

  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[1] || "");
  const [added, setAdded] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

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
      <SEO 
        title={`${product.name} LED Art Poster | WheelsGlow — Buy Online India`}
        description={`Buy the ${product.name} luxury LED art poster. ${product.description} Only the car's lights glow — cinematic wall art. Free pan-India shipping. Starting ₹999.`}
        keywords={`${product.name} LED poster, ${product.name} wall art, buy ${product.name} poster India, WheelsGlow LED art`}
        image={`https://www.wheelsglow.store${product.imageOn || product.image}`}
        canonical={`https://www.wheelsglow.store/product/${product.id}`}
        type="product"
        product={{
          name: product.name,
          description: product.description || '',
          image: `https://www.wheelsglow.store${product.imageOn || product.image}`,
          price: product.price,
          currency: 'INR',
          availability: 'InStock',
          brand: 'WheelsGlow',
          sku: `WG-${product.id}-A2`,
        }}
      />

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

        {/* ── Product Information (Detailed) ── */}
        <div className="max-w-7xl mx-auto mt-16 pt-12 border-t border-white/10">
          <h2 className="text-3xl font-display mb-10">Product information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 items-start">
            
            {/* Left Column */}
            <div>
              <Accordion title="Style" data={{
                "Orientation": "Portrait / Landscape",
                "Item Shape": "Rectangular",
                "Theme": "Vehicle",
                "Colour": product.name,
                "Product Style": "LED Wall Art",
                "Room Type": "Bedroom, Living Room, Garage, Office"
              }} initialOpen={true} />
              <Accordion title="Features & Specs" data={{
                "Frame Type": "Unframed / Floating look",
                "Special Features": "LED Light, Plug-in Power, Weatherproof",
                "Mounting Type": "Wall Mount",
                "Is Framed": "Acrylic Board Backing"
              }} initialOpen={true} />
              <Accordion title="User guide" data={{
                "Recommended Uses": "Car Enthusiast Decor, Ambient Lighting, Wall Art"
              }} initialOpen={false} />
              <Accordion title="Materials & Care" data={{
                "Material Type": "Acrylic Board & PVC",
                "Frame Material": "Premium acrylic board backing",
                "Finish Type": "Matte UV Resistant",
                "Paint Type": "High-resolution Digital Print",
                "Cover Material": "Scratch-resistant Coating"
              }} initialOpen={false} />
            </div>

            {/* Right Column */}
            <div>
              <Accordion title="Measurements" data={{
                "Size": selectedSize.split(" — ")[1] || "30x42 cm",
                "Item Dimensions L x W": selectedSize.split(" — ")[1]?.replace('×', 'L x ') + 'W Centimeters' || "42L x 30W Centimeters",
                "Item Weight": selectedSize.includes("A1") ? "1200 Grams" : selectedSize.includes("A2") ? "800 Grams" : "450 Grams",
                "Unit Count": "1.0 Count"
              }} initialOpen={true} />
              <Accordion title="Item details" data={{
                "Brand Name": "WheelsGlow",
                "Country of Origin": "India",
                "Manufacturer": "WheelsGlow, India",
                "Importer Contact": "WheelsGlow, New Delhi",
                "Item Type Name": "Sports Car LED Wall Art with PowerLEDs",
                "Manufacturer Contact": "wheelsglow.store@gmail.com",
                "Packer Contact": "WheelsGlow, New Delhi",
                "SKU": `WG-${product.id}-${selectedSize.split(" ")[0] || "A3"}`
              }} initialOpen={true} />
            </div>
          </div>
        </div>

        {/* ── What's in the Box ── */}
        <div className="max-w-7xl mx-auto mt-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-8 max-w-2xl">
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


        {/* ── Customer Reviews ── */}
        <div className="max-w-7xl mx-auto mt-16 pt-12 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-display mb-1">Customer Reviews</h2>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                <span className="text-white/60 text-sm font-mono">4.9 · {product.id === 1 ? '312' : '198'} reviews</span>
              </div>
            </div>
            <div className="flex gap-3">
              {[5,4,3,2,1].map(s => (
                <div key={s} className="flex items-center gap-1">
                  <span className="text-xs text-white/40 font-mono">{s}★</span>
                  <div className="w-16 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: s === 5 ? '88%' : s === 4 ? '9%' : '2%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {product.id === 1 ? (
            /* ── Porsche: Photo review cards ── */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Arjun K.", city: "Mumbai", role: "Gaming Room", rating: 5, date: "Apr 18, 2026", review: "The red taillights glow exactly like the real car — not the whole frame, just the lights. It looks incredible in the dark. My gaming setup has never looked this premium.", avatar: "AK", accent: "#FF2200", photo: "/review-gaming.jpg" },
                { name: "Vikram S.", city: "Delhi", role: "Home Office", rating: 5, date: "Apr 15, 2026", review: "I've recommended this to 6 clients. The LED effect is so tasteful — precise, not gimmicky. Exactly what a premium product should feel like.", avatar: "VS", accent: "#00BFFF", photo: "/review-office.jpg" },
                { name: "Priya M.", city: "Chennai", role: "Living Room", rating: 5, date: "Apr 12, 2026", review: "Ordered for my husband's birthday. He called it the best gift ever. The red taillight glow at night is absolutely unreal — everyone who visits asks about it.", avatar: "PM", accent: "#FF2200", photo: "/review-living.jpg" },
                { name: "Rahul D.", city: "Bengaluru", role: "Man Cave", rating: 5, date: "Apr 10, 2026", review: "The Porsche taillights glowing at 2am in my man cave is pure cinema. Guests always stop and stare. Best ₹1299 I've ever spent.", avatar: "RD", accent: "#FF6B00", photo: "/review-mancave.jpg" },
                { name: "Aditya R.", city: "Hyderabad", role: "Bedroom", rating: 5, date: "Apr 7, 2026", review: "Hangs right above my bed. Every morning I wake up to the Porsche taillights glowing — it genuinely makes me feel like I own the car.", avatar: "AR", accent: "#CCFF00", photo: "/review-bedroom.jpg" },
                { name: "Karan P.", city: "Pune", role: "Car Garage", rating: 5, date: "Apr 4, 2026", review: "Put it in my garage next to my actual car. The quality is insane for the price — feels like a gallery piece from a luxury showroom.", avatar: "KP", accent: "#FF2200", photo: "/review-garage.jpg" },
              ].filter((_, i) => showAllReviews || i < 3).map((r, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="glass rounded-2xl overflow-hidden flex flex-col group">
                  {/* Room Photo */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={r.photo}
                      alt={`${r.name}'s ${r.role}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Room badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest"
                      style={{ background: `${r.accent}33`, color: r.accent, border: `1px solid ${r.accent}55`, backdropFilter: 'blur(8px)' }}>
                      {r.role}
                    </div>
                    {/* Stars */}
                    <div className="absolute bottom-3 right-3 flex gap-0.5">
                      {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <p className="text-sm text-white/70 leading-relaxed italic flex-1">"{r.review}"</p>
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                          style={{ background: `${r.accent}22`, color: r.accent, border: `1px solid ${r.accent}44` }}>{r.avatar}</div>
                        <div>
                          <p className="text-sm font-bold leading-tight">{r.name}</p>
                          <p className="text-[9px] font-mono text-white/30 mt-0.5">{r.city} · {r.date}</p>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono text-green-400/70 bg-green-400/10 px-2 py-0.5 rounded-full">✓ Verified</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Show more / less button */}
            <motion.button
              onClick={() => setShowAllReviews(v => !v)}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="mt-6 w-full py-3.5 rounded-xl border border-white/10 text-white/50 hover:border-neon-accent hover:text-neon-accent text-sm font-mono uppercase tracking-widest transition-all"
            >
              {showAllReviews ? '↑ Show less' : 'Show all 6 reviews ↓'}
            </motion.button>
          ) : (
            /* ── BMW: Text-only review cards ── */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Rahul Kumar", city: "Bengaluru", rating: 5, date: "Apr 20, 2026", review: "The BMW M4 angel eyes at midnight are absolutely cinematic. Just plug it in and it glows. Blue rings look exactly like the real headlights. Worth every rupee.", avatar: "RK", verified: true },
                { name: "Sarah Mehta", city: "Delhi", rating: 5, date: "Apr 14, 2026", review: "As an interior designer I've recommended this to clients already. The precision is unreal — only the headlight rings glow, nothing else. So tasteful and premium.", avatar: "SM", verified: true },
                { name: "Dev Sharma", city: "Pune", rating: 5, date: "Apr 8, 2026", review: "Incredible product. The acrylic backing is solid, the print quality is perfect. Honestly looks like a piece of art from a luxury store. 10/10 recommend.", avatar: "DS", verified: true },
              ].map((r, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-6 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: 'rgba(0,191,255,0.15)', color: '#00BFFF', border: '1px solid rgba(0,191,255,0.25)' }}>{r.avatar}</div>
                      <div>
                        <p className="text-sm font-bold">{r.name}</p>
                        <p className="text-[10px] text-white/35 font-mono">{r.city}</p>
                      </div>
                    </div>
                    {r.verified && <span className="text-[9px] text-green-400 font-mono bg-green-400/10 px-2 py-0.5 rounded-full">✓ Verified</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">{[...Array(r.rating)].map((_, j) => <Star key={j} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}</div>
                    <span className="text-[10px] text-white/30 font-mono">{r.date}</span>
                  </div>
                  <p className="text-sm text-white/65 leading-relaxed">"{r.review}"</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* ── Related Product */}
        {otherProduct && (
          <div className="max-w-7xl mx-auto mt-16">
            <h2 className="text-2xl font-display mb-8">Also Available</h2>
            <div className="max-w-md">
              <Link to={`/product/${otherProduct.id}`}>
                <motion.div whileHover={{ scale: 1.01 }} className="glass rounded-2xl overflow-hidden flex items-center gap-5 p-4 cursor-pointer">
                  <img src={otherProduct.imageOn || otherProduct.image} alt={otherProduct.name}
                    className="w-24 h-16 object-cover rounded-xl" loading="lazy" />
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
