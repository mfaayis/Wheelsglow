import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Power, Zap, Package, Shield, Truck, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { HeroLEDDemo } from "../components/HeroLEDDemo";
import { MarqueeTicker } from "../components/MarqueeTicker";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { PRODUCTS } from "../data/products";

/* ─── Reusable section header ─── */
const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
  <p className="text-neon-accent font-mono text-[10px] uppercase tracking-[0.6em] mb-4 flex items-center gap-3">
    <span className="w-8 h-px bg-neon-accent inline-block" />
    {label}
  </p>
);

/* ─── Word-by-word stagger ─── */
const StaggerTitle: React.FC<{ lines: string[]; className?: string }> = ({ lines, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref}>
      {lines.map((line, li) => (
        <div key={li} className="overflow-hidden">
          <motion.div
            initial={{ y: "100%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.8, delay: li * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={className}
          >
            {line}
          </motion.div>
        </div>
      ))}
    </div>
  );
};

const TICKER_ITEMS = [
  "Premium LED Posters", "Remote Controlled", "16 Color Modes", "Museum Grade Print",
  "Free Shipping", "Hand Assembled", "Luxury Cars", "Exotic Motorcycles",
  "24-Hour Dispatch", "1 Year Warranty",
];

const TESTIMONIALS = [
  {
    name: "Arjun Verma",
    role: "Porsche Collector · Mumbai",
    rating: 5,
    quote: "The way the LED highlights the curves of the 911 at night is just incredible. It's the centerpiece of my garage. Pure art.",
    avatar: "AV",
    accent: "#FF6B00",
  },
  {
    name: "Sarah Mehta",
    role: "Interior Designer · Delhi",
    rating: 5,
    quote: "Finally, automotive art that isn't just a flat poster. The depth and lighting transform the entire room atmosphere.",
    avatar: "SM",
    accent: "#FF003D",
  },
  {
    name: "Rahul Kumar",
    role: "Tech Enthusiast · Bengaluru",
    rating: 5,
    quote: "Synced the LED colors with my PC setup. The remote control is seamless. Pure cyberpunk setup vibes.",
    avatar: "RK",
    accent: "#00D1FF",
  },
  {
    name: "Priya Nair",
    role: "Car Enthusiast · Chennai",
    rating: 5,
    quote: "Got the Lamborghini one as a gift for my husband. He was absolutely floored when the LEDs came on. Best purchase ever.",
    avatar: "PN",
    accent: "#CCFF00",
  },
];

const FEATURES = [
  {
    icon: Power,
    title: "Remote Control",
    desc: "Switch between 16 static colors + 4 dynamic modes right from your couch.",
    accent: "#FF003D",
  },
  {
    icon: Package,
    title: "Museum Grade Print",
    desc: "300 GSM matte art paper with UV-resistant inks that stay vibrant for years.",
    accent: "#FF6B00",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "Complimentary pan-India delivery on every order. Tracked & insured.",
    accent: "#00D1FF",
  },
  {
    icon: Shield,
    title: "1 Year Warranty",
    desc: "All LED components covered for a full year. No questions asked replacement.",
    accent: "#CCFF00",
  },
  {
    icon: Zap,
    title: "Instant Glow",
    desc: "Plug-and-play setup. From unboxing to glowing wall art in under 5 minutes.",
    accent: "#7B61FF",
  },
  {
    icon: Star,
    title: "Hand Assembled",
    desc: "Every poster is individually assembled and quality checked before dispatch.",
    accent: "#E8C46A",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Choose Your Dream", desc: "Pick from our curated collection of luxury cars and motorcycles. Select your size and LED color theme." },
  { step: "02", title: "We Craft It", desc: "Our team hand-assembles your poster with precision LED strips and museum-grade printing." },
  { step: "03", title: "Illuminate Your Space", desc: "Receive it in 3–5 days. Mount it, plug it in, and transform your room in minutes." },
];

export function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [activeCategory, setActiveCategory] = useState<'all' | 'cars' | 'motorcycles'>('all');

  const filteredProducts = activeCategory === 'all'
    ? PRODUCTS.slice(0, 8)
    : PRODUCTS.filter(p => p.category === activeCategory).slice(0, 8);

  const prevTestimonial = () => setCurrentTestimonial(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const nextTestimonial = () => setCurrentTestimonial(i => (i + 1) % TESTIMONIALS.length);

  return (
    <main className="relative">

      {/* ═══════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">

        {/* Background hero image with dark overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1920"
            alt="Background"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(255,0,61,0.08) 0%, transparent 60%)' }} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center min-h-screen pt-24 px-6 md:px-20 gap-12 lg:gap-20">

          {/* Left: Text */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <SectionLabel label="Premium LED Wall Art" />
            </motion.div>

            <div className="mb-8">
              <div className="overflow-hidden">
                <motion.h1
                  className="text-[15vw] md:text-[12vw] lg:text-[9vw] leading-[0.85] font-display"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  LIGHT
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.h1
                  className="text-[15vw] md:text-[12vw] lg:text-[9vw] leading-[0.85] font-display"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  UP THE
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.h1
                  className="text-[15vw] md:text-[12vw] lg:text-[9vw] leading-[0.85] font-display text-stroke"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
                >
                  ROOM.
                </motion.h1>
              </div>
            </div>

            <motion.p
              className="max-w-sm text-sm md:text-base text-white/50 font-light leading-relaxed mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Physical wall-mounted art posters with remote-controlled neon LEDs.
              Turn any wall into a cinematic automotive experience.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <Link to="/collection">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="bg-white text-black px-8 py-4 rounded-full font-sans font-bold text-sm flex items-center gap-3 hover:bg-neon-accent hover:text-white transition-all duration-300 uppercase tracking-wider"
                >
                  Shop Collection
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/custom">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="border border-white/20 text-white px-8 py-4 rounded-full font-sans font-bold text-sm flex items-center gap-3 hover:border-neon-accent hover:text-neon-accent transition-all duration-300 uppercase tracking-wider backdrop-blur-sm"
                >
                  Custom Order
                  <Zap className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-10 mt-14 pt-10 border-t border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              {[
                { value: 500, suffix: '+', label: 'Happy Customers' },
                { value: 16, suffix: '', label: 'LED Colors' },
                { value: 48, suffix: 'hr', label: 'Dispatch' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-display text-white">
                    <AnimatedCounter to={stat.value} suffix={stat.suffix} duration={2.5} />
                  </div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: LED Demo */}
          <motion.div
            className="flex-1 relative w-full max-w-lg lg:max-w-none aspect-[4/5] rounded-3xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 60px rgba(255,0,61,0.1)' }}
          >
            <HeroLEDDemo />

            {/* Floating badge */}
            <motion.div
              className="absolute -left-6 top-1/4 glass-strong px-5 py-4 rounded-2xl hidden lg:block"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-2xl font-display">16</p>
              <p className="text-[9px] font-mono uppercase tracking-widest text-white/40">LED Colors</p>
            </motion.div>

            <motion.div
              className="absolute -right-6 bottom-1/4 glass-strong px-5 py-4 rounded-2xl hidden lg:block"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
              <p className="text-2xl font-display">300<span className="text-base">gsm</span></p>
              <p className="text-[9px] font-mono uppercase tracking-widest text-white/40">Museum Grade</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/30">Scroll</span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ─── Marquee Ticker ─── */}
      <div className="border-y border-white/5 py-4 overflow-hidden">
        <MarqueeTicker
          items={TICKER_ITEMS}
          itemClassName="text-white/50 hover:text-white transition-colors cursor-default"
          separator="✦"
        />
      </div>

      {/* ═══════════════════════════════════════════════════
          FEATURED PRODUCTS
      ═══════════════════════════════════════════════════ */}
      <section className="px-6 md:px-20 py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <SectionLabel label="Our Collection" />
            <StaggerTitle
              lines={["Featured", "Art"]}
              className="text-[12vw] md:text-[9vw] leading-[0.85] font-display"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'cars', 'motorcycles'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-neon-accent text-white'
                    : 'border border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="text-center mt-12">
          <Link to="/collection">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(255,0,61,0.3)' }}
              whileTap={{ scale: 0.96 }}
              className="border border-white/15 text-white px-10 py-4 rounded-full font-mono text-xs uppercase tracking-[0.3em] hover:border-neon-accent hover:text-neon-accent transition-all duration-300"
            >
              View All Products
            </motion.button>
          </Link>
        </div>
      </section>

      {/* ─── Reverse Ticker ─── */}
      <MarqueeTicker
        items={["Neon Glow", "Remote Control", "Wall Art", "LED Strips", "Luxury Posters", "Premium Quality"]}
        reverse
        itemClassName="text-white/20"
        separator="·"
        speed={25}
      />

      {/* ═══════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════ */}
      <section className="px-6 md:px-20 py-28 border-t border-white/5">
        <div className="text-center mb-16">
          <SectionLabel label="The Process" />
          <StaggerTitle
            lines={["How It", "Works"]}
            className="text-[12vw] md:text-[8vw] leading-[0.85] font-display"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 rounded-3xl overflow-hidden">
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="p-12 bg-bg-dark hover:bg-white/[0.02] transition-colors group relative overflow-hidden"
            >
              {/* Step number */}
              <div
                className="text-[6rem] font-display leading-none mb-6 opacity-10 group-hover:opacity-20 transition-opacity absolute top-8 right-8"
                style={{ color: ['#FF003D', '#FF6B00', '#00D1FF'][i] }}
              >
                {step.step}
              </div>

              <div className="relative z-10">
                <div
                  className="w-12 h-1 mb-8 rounded-full"
                  style={{ background: ['#FF003D', '#FF6B00', '#00D1FF'][i] }}
                />
                <h3 className="text-2xl md:text-3xl mb-4 font-display">{step.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURES GRID
      ═══════════════════════════════════════════════════ */}
      <section className="px-6 md:px-20 py-28">
        <div className="mb-16">
          <SectionLabel label="Why WheelsGlow" />
          <StaggerTitle
            lines={["Everything", "Included"]}
            className="text-[12vw] md:text-[8vw] leading-[0.85] font-display"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass p-8 rounded-2xl group cursor-default relative overflow-hidden"
            >
              {/* Hover accent glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 100%, ${feature.accent}0D 0%, transparent 70%)` }}
              />

              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-6"
                style={{ background: `${feature.accent}15`, border: `1px solid ${feature.accent}30` }}
              >
                <feature.icon className="w-5 h-5" style={{ color: feature.accent }} />
              </div>

              <div className="relative">
                <h3 className="text-xl mb-3 font-display">{feature.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          COMPARISON TABLE
      ═══════════════════════════════════════════════════ */}
      <section className="px-6 md:px-20 py-28 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel label="The Difference" />
            <StaggerTitle
              lines={["Standard vs.", "WheelsGlow"]}
              className="text-[12vw] md:text-[8vw] leading-[0.85] font-display"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 rounded-3xl overflow-hidden">
            {/* Standard */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="p-10 md:p-14 bg-black/40 space-y-8"
            >
              <h4 className="text-2xl font-display opacity-30">Standard Poster</h4>
              <ul className="space-y-5">
                {[
                  "Flat 2D appearance",
                  "Invisible in the dark",
                  "150 GSM standard paper",
                  "No interactive features",
                  "Static, boring decor",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-white/25 text-sm">
                    <span className="text-white/20 text-lg">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* WheelsGlow */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="p-10 md:p-14 relative overflow-hidden"
              style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(255,0,61,0.08) 0%, rgba(0,0,0,0.6) 70%)' }}
            >
              <div className="absolute top-6 right-6 bg-neon-accent text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                Superior
              </div>
              <h4 className="text-2xl font-display text-neon-accent mb-8">WheelsGlow LED</h4>
              <ul className="space-y-5">
                {[
                  { text: "Dynamic depth & dimension", color: "#FF003D" },
                  { text: "Vibrant neon glow at night", color: "#FF6B00" },
                  { text: "300 GSM museum-grade paper", color: "#00D1FF" },
                  { text: "Remote-controlled 16 colors", color: "#CCFF00" },
                  { text: "Immersive atmosphere piece", color: "#FF003D" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-white text-sm">
                    <span style={{ color: item.color, textShadow: `0 0 10px ${item.color}` }}>✓</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHAT'S IN THE BOX
      ═══════════════════════════════════════════════════ */}
      <section className="px-6 md:px-20 py-28 border-t border-white/5">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          <div className="flex-1">
            <SectionLabel label="Unboxing Experience" />
            <StaggerTitle
              lines={["Inside", "The Box"]}
              className="text-[12vw] md:text-[8vw] leading-[0.85] font-display mb-12"
            />
            <div className="space-y-6">
              {[
                { item: "The Poster", detail: "Your chosen art in 24×36 inch premium matte finish.", num: "01", color: "#FF003D" },
                { item: "LED Controller", detail: "Wireless remote — 16 static colors, 4 lighting modes, dimmer.", num: "02", color: "#FF6B00" },
                { item: "Power Adapter", detail: "12V DC adapter with 3-meter transparent cable included.", num: "03", color: "#00D1FF" },
                { item: "Mounting Kit", detail: "Heavy-duty wall brackets + spirit level guide.", num: "04", color: "#CCFF00" },
              ].map((box, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-5 items-start group"
                >
                  <div
                    className="text-xs font-mono font-bold mt-1"
                    style={{ color: box.color }}
                  >
                    {box.num}
                  </div>
                  <div>
                    <h4 className="text-lg font-display">{box.item}</h4>
                    <p className="text-white/35 text-sm">{box.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className="flex-1 relative w-full max-w-md lg:max-w-none"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="aspect-[4/5] relative rounded-3xl overflow-hidden glass">
              <img
                src="https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=800"
                alt="Product contents"
                className="w-full h-full object-cover opacity-50"
                referrerPolicy="no-referrer"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse at 50% 80%, rgba(255,107,0,0.3) 0%, transparent 60%)' }}
              />
            </div>

            {/* Floating badge */}
            <motion.div
              className="absolute -bottom-6 -left-6 glass-strong p-6 rounded-2xl hidden md:block"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-4xl font-display leading-none">100<span className="text-lg">%</span></p>
              <p className="text-[9px] font-mono uppercase tracking-widest text-white/40 mt-1">Hand-Assembled</p>
            </motion.div>

            <motion.div
              className="absolute -top-6 -right-6 glass-strong p-5 rounded-2xl hidden md:block"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <p className="text-2xl font-display text-neon-accent leading-none">4</p>
              <p className="text-[9px] font-mono uppercase tracking-widest text-white/40 mt-1">Items Inside</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SOCIAL PROOF STRIP
      ═══════════════════════════════════════════════════ */}
      <section className="border-y border-white/5 py-12">
        <div className="px-6 md:px-20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            {[
              { value: 500, suffix: '+', label: 'Customers Served' },
              { value: 4.9, suffix: '/5', label: 'Average Rating', isFloat: true },
              { value: 98, suffix: '%', label: 'Satisfaction Rate' },
              { value: 48, suffix: 'hr', label: 'Avg. Dispatch' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-display text-white mb-1">
                  {stat.isFloat ? (
                    <span>4.9{stat.suffix}</span>
                  ) : (
                    <><AnimatedCounter to={stat.value as number} suffix={stat.suffix} duration={2} /></>
                  )}
                </div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">{stat.label}</p>
              </motion.div>
            ))}

            <div className="text-center">
              <div className="flex gap-1 justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">Google Reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════ */}
      <section className="px-6 md:px-20 py-28">
        <div className="mb-12">
          <SectionLabel label="Customer Stories" />
          <StaggerTitle
            lines={["The", "Enthusiasts"]}
            className="text-[12vw] md:text-[8vw] leading-[0.85] font-display"
          />
        </div>

        <div className="relative">
          {/* Desktop: grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="glass p-8 rounded-2xl flex flex-col gap-6 group hover:border-white/20 transition-colors"
                style={{ '--accent': t.accent } as React.CSSProperties}
              >
                <div className="flex gap-1">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-sm text-white/70 leading-relaxed flex-1 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold font-mono"
                    style={{ background: `${t.accent}22`, color: t.accent, border: `1px solid ${t.accent}44` }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t.name}</p>
                    <p className="text-[10px] font-mono text-white/35 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile: single slider */}
          <div className="md:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="glass p-8 rounded-2xl"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(TESTIMONIALS[currentTestimonial].rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-base text-white/70 leading-relaxed italic mb-6">
                  "{TESTIMONIALS[currentTestimonial].quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: `${TESTIMONIALS[currentTestimonial].accent}22`, color: TESTIMONIALS[currentTestimonial].accent }}
                  >
                    {TESTIMONIALS[currentTestimonial].avatar}
                  </div>
                  <div>
                    <p className="font-bold">{TESTIMONIALS[currentTestimonial].name}</p>
                    <p className="text-[10px] font-mono text-white/35">{TESTIMONIALS[currentTestimonial].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center justify-center gap-4 mt-6">
              <button onClick={prevTestimonial} className="p-2 glass rounded-full hover:bg-white/10">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTestimonial(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentTestimonial ? 'bg-neon-accent w-4' : 'bg-white/20'}`}
                  />
                ))}
              </div>
              <button onClick={nextTestimonial} className="p-2 glass rounded-full hover:bg-white/10">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════════ */}
      <section className="px-6 md:px-20 py-28 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel label="Got Questions?" />
            <StaggerTitle
              lines={["Frequently", "Asked"]}
              className="text-[12vw] md:text-[8vw] leading-[0.85] font-display"
            />
          </div>
          <div className="space-y-4">
            {[
              { q: "How do I power the poster?", a: "Each poster comes with a 12V DC power adapter that plugs into any standard wall outlet. The cable is transparent and discreet." },
              { q: "Can I change the LED colors?", a: "Yes! The included remote lets you choose from 16 static colors and 4 dynamic lighting modes including fade, strobe, and pulse." },
              { q: "Is it safe to leave on overnight?", a: "Absolutely. We use low-heat, high-efficiency LEDs designed for continuous use. The poster remains completely cool to the touch." },
              { q: "What sizes are available?", a: "We currently offer A3 (30×42cm), A2 (42×59cm), and A1 (59×84cm) sizes. All sizes include the LED system and remote." },
              { q: "Do you ship pan-India?", a: "Yes! Free shipping to all major Indian cities. Orders are dispatched within 48 hours and delivered in 3–7 business days." },
            ].map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          NEWSLETTER
      ═══════════════════════════════════════════════════ */}
      <section className="px-6 md:px-20 py-28 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[2rem] overflow-hidden p-12 md:p-20"
          style={{ background: 'linear-gradient(135deg, rgba(255,0,61,0.08) 0%, rgba(255,107,0,0.05) 50%, rgba(0,0,0,0.8) 100%)', border: '1px solid rgba(255,0,61,0.15)' }}
        >
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(255,0,61,0.4) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 relative z-10">
            <div>
              <SectionLabel label="Exclusive Access" />
              <h2 className="text-[10vw] md:text-[5vw] leading-[0.85] font-display mb-4">
                Join<br />
                <span className="text-stroke">The Club.</span>
              </h2>
              <p className="text-white/40 text-sm max-w-xs">
                Early access to limited drops, custom builds, and exclusive discounts before anyone else.
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="bg-white/5 border border-white/10 px-6 py-4 rounded-full focus:outline-none focus:border-neon-accent transition-colors min-w-0 sm:min-w-[280px] text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="bg-neon-accent text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-neon-orange transition-colors whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

/* ─── FAQ Accordion Item ─── */
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left group"
      >
        <h4 className="text-base font-sans font-semibold group-hover:text-neon-accent transition-colors">{q}</h4>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-neon-accent text-2xl leading-none flex-shrink-0 ml-4"
        >
          +
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-white/45 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
