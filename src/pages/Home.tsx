import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Star, ChevronLeft, ChevronRight, Check, X, ShoppingBag } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { MarqueeTicker } from "../components/MarqueeTicker";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { PRODUCTS } from "../data/products";
import { SEO } from "../components/SEO";

const SectionLabel = ({ label }: { label: string }) => (
  <p className="text-neon-accent font-mono text-[10px] uppercase tracking-[0.6em] mb-4 flex items-center gap-3">
    <span className="w-6 h-px bg-neon-accent inline-block" />
    {label}
  </p>
);

const SectionTitle = ({ lines, className = "" }: { lines: string[]; className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref}>
      {lines.map((line, i) => (
        <div key={i} className="overflow-hidden">
          <motion.div
            initial={{ y: "100%" }} animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            className={className}
          >{line}</motion.div>
        </div>
      ))}
    </div>
  );
};

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.07 }} className="border-b border-white/5">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-6 text-left group">
        <h4 className="text-base font-sans font-semibold group-hover:text-neon-accent transition-colors pr-4">{q}</h4>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25 }} className="text-neon-accent text-2xl flex-shrink-0">+</motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <p className="pb-6 text-white/45 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const TICKER_ITEMS = ["Premium LED Posters", "Porsche 911 GT3 RS", "BMW M4 Competition", "Acrylic Board", "Plug-in LED", "Museum Quality Print", "Free Pan-India Shipping", "Hand Assembled", "1 Year Warranty", "48-Hour Dispatch"];

const TESTIMONIALS = [
  { name: "Arjun Verma", role: "Porsche Collector · Mumbai", rating: 5, quote: "The way only the taillights glow is insane — not the whole frame, just the lights. Night time it looks like the real car is parked on my wall.", avatar: "AV", accent: "#FF2200" },
  { name: "Sarah Mehta", role: "Interior Designer · Delhi", rating: 5, quote: "I've recommended this to 6 clients. The LED effect is so tasteful — precise, not gimmicky. Exactly what a premium product should feel like.", avatar: "SM", accent: "#00BFFF" },
  { name: "Rahul Kumar", role: "BMW Enthusiast · Bengaluru", rating: 5, quote: "Those blue angel eyes glowing on my M4 poster at 2am is pure cinema. Best ₹1299 I've spent.", avatar: "RK", accent: "#00BFFF" },
  { name: "Priya Nair", role: "Car Enthusiast · Chennai", rating: 5, quote: "Ordered the Porsche for my husband's birthday. He called it the best gift ever. The red taillight glow is unreal.", avatar: "PN", accent: "#FF2200" },
];

export function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  return (
    <main>
      <SEO 
        title="WheelsGlow | Luxury LED Car Art Posters — Buy Online India"
        description="Premium LED wall art posters. Only the car's headlights & taillights glow — cinematic, true-to-life. Porsche 911 GT3 RS, BMW M4. Free pan-India shipping. Starting ₹999."
        keywords="LED car poster India, luxury LED wall art India, WheelsGlow, buy LED poster online, Porsche LED poster, BMW M4 LED poster, glowing car wall art, car poster with LED lights"
        canonical="https://www.wheelsglow.store/"
      />
      {/* ── HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 60%, rgba(255,0,61,0.1) 0%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-accent/30 bg-neon-accent/5 text-neon-accent font-mono text-[10px] uppercase tracking-[0.4em]">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-accent animate-pulse inline-block" />
            Only The Lights Glow · Not The Frame
          </motion.div>

          {/* Headline */}
          {["ILLUMINATE", "YOUR WALL.", "FEEL THE GLOW."].map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.h1
                className={`text-[14vw] md:text-[11vw] lg:text-[9vw] leading-[0.9] font-display tracking-tight ${i === 2 ? "text-neon-accent" : ""}`}
                style={i === 2 ? { textShadow: '0 0 60px rgba(255,0,61,0.4)' } : {}}
                initial={{ y: "100%" }} animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {line}
              </motion.h1>
            </div>
          ))}

          <motion.p className="max-w-lg text-white/50 text-base leading-relaxed mt-8 mb-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            Physical wall-mounted art posters with precision LED strips behind the car's lights.
            Only the headlights or taillights glow — cinematic, true-to-life.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 mb-16"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
            <Link to="/product/1">
              <motion.button whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(255,0,61,0.3)' }} whileTap={{ scale: 0.96 }}
                className="bg-neon-accent text-white px-8 py-4 rounded-full font-sans font-bold text-sm flex items-center gap-3 transition-all uppercase tracking-wider shadow-lg shadow-neon-accent/20">
                <ShoppingBag className="w-5 h-5" /> Buy Now — ₹1,299
              </motion.button>
            </Link>
            <Link to="/collection">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="bg-white text-black px-8 py-4 rounded-full font-sans font-bold text-sm flex items-center gap-3 hover:bg-neon-accent hover:text-white transition-all uppercase tracking-wider">
                Shop Collection <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link to="/about">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="border border-white/20 text-white px-8 py-4 rounded-full font-sans font-bold text-sm flex items-center gap-3 hover:border-neon-accent hover:text-neon-accent transition-all uppercase tracking-wider backdrop-blur-sm">
                How It Works <Zap className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div className="flex flex-wrap justify-center gap-x-12 gap-y-6 pt-10 border-t border-white/8 w-full"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            {[
              { label: 'Happy Customers', value: 500, suffix: '+' },
              { label: 'Avg. Rating', display: '4.9★' },
              { label: 'Dispatch', value: 48, suffix: 'hr' },
              { label: 'Handcrafted', value: 100, suffix: '%' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-display">
                  {s.display ? s.display : <AnimatedCounter to={s.value!} suffix={s.suffix} duration={2.5} />}
                </div>
                <p className="text-[9px] font-mono uppercase tracking-widest text-white/35 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
          <span className="text-[8px] font-mono uppercase tracking-[0.5em] text-white/25">Scroll</span>
          <motion.div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" animate={{ scaleY: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }} />
        </motion.div>
      </section>

      {/* ── Marquee */}
      <div className="border-y border-white/5 py-4">
        <MarqueeTicker items={TICKER_ITEMS} itemClassName="text-white/40" />
      </div>

      {/* ── PRODUCTS (2 only) */}
      <section className="px-6 md:px-20 py-24" id="products">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <SectionLabel label="The Collection" />
            <SectionTitle lines={["Our", "2 Products"]} className="text-[11vw] md:text-[7vw] leading-[0.85] font-display" />
          </div>
          <Link to="/collection">
            <motion.button whileHover={{ scale: 1.04 }} className="border border-white/15 text-white/60 px-6 py-3 rounded-full font-mono text-xs uppercase tracking-widest hover:border-neon-accent hover:text-neon-accent transition-all">
              View All →
            </motion.button>
          </Link>
        </div>

        {/* Drag hint */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass rounded-2xl p-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-neon-accent animate-pulse" />
            <span className="text-white font-bold text-sm">Drag the slider on each card</span>
          </div>
          <span className="text-white/40 text-sm">to see the before/after LED effect — only the car's own lights illuminate, not the frame.</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PRODUCTS.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── WHY ONLY THE LIGHTS */}
      <section className="px-6 md:px-20 py-24 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel label="The Magic" />
            <SectionTitle lines={["Only The Lights", "Glow."]} className="text-[11vw] md:text-[7vw] leading-[0.85] font-display" />
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="mt-6 text-white/50 max-w-2xl mx-auto text-sm leading-relaxed">
              Unlike generic LED posters that light up the entire frame, WheelsGlow uses precision-placed LED strips
              behind only the car's light cutouts. The effect looks like the actual car parked on your wall.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { car: "Porsche 911 GT3 RS", color: "#FF2200", items: ["Rear taillights — warm red glow", "Brake light horizontal bar — amber orange", "Wheel arch area — subtle warm halo", "Rest of poster — stays dark as printed"] },
              { car: "BMW M4 Competition", color: "#00BFFF", items: ["Angel eye headlight rings — vivid electric blue", "Inner LED daytime running lights — cool white", "Headlight housing halo — blue glow", "Rest of poster — stays dark as printed"] },
            ].map((card) => (
              <motion.div key={card.car} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-3 h-3 rounded-full" style={{ background: card.color, boxShadow: `0 0 8px ${card.color}` }} />
                    <h3 className="font-display text-xl">{card.car}</h3>
                  </div>
                  <p className="text-white/40 text-sm">What lights up:</p>
                </div>
                <div className="p-6 space-y-3">
                  {card.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <span className={`mt-0.5 font-bold ${i < 3 ? 'text-neon-accent' : 'text-white/30'}`}>{i < 3 ? '✓' : '○'}</span>
                      <span className={i < 3 ? 'text-white/80' : 'text-white/30'}>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON */}
      <section className="px-6 md:px-20 py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel label="Why WheelsGlow" />
            <SectionTitle lines={["Standard vs.", "WheelsGlow"]} className="text-[11vw] md:text-[7vw] leading-[0.85] font-display" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 rounded-3xl overflow-hidden">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-10 bg-black/40">
              <h4 className="text-xl font-display opacity-30 mb-6">Generic LED Poster</h4>
              <ul className="space-y-4">
                {["Entire frame lights up uniformly", "Cheap LED strip, no precision cutouts", "Low-res 150gsm print", "No remote or color control", "Wired switch, no wireless"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/25">
                    <X className="w-4 h-4 text-white/20 flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="p-10 relative overflow-hidden"
              style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(255,0,61,0.08) 0%, rgba(0,0,0,0.6) 70%)' }}>
              <div className="absolute top-5 right-5 bg-neon-accent text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Superior</div>
              <h4 className="text-xl font-display text-neon-accent mb-6">WheelsGlow</h4>
              <ul className="space-y-4">
                {[
                  { text: "Only the car's lights glow — precision cutouts", color: "#FF2200" },
                  { text: "Premium acrylic board — durable & lightweight", color: "#FF6B00" },
                  { text: "High-resolution UV-resistant art print", color: "#00BFFF" },
                  { text: "Simple plug-in power — instant on, no setup", color: "#CCFF00" },
                  { text: "Pre-installed hooks — hangs in under 10 min", color: "#FF2200" },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-3 text-sm text-white">
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: item.color }} />{item.text}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS */}
      <section className="px-6 md:px-20 py-24 border-t border-white/5">
        <div className="mb-12">
          <SectionLabel label="Customer Stories" />
          <SectionTitle lines={["The", "Enthusiasts"]} className="text-[11vw] md:text-[7vw] leading-[0.85] font-display" />
        </div>
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="glass p-7 rounded-2xl flex flex-col gap-5">
              <div className="flex gap-1">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}</div>
              <p className="text-sm text-white/65 leading-relaxed italic flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: `${t.accent}22`, color: t.accent, border: `1px solid ${t.accent}44` }}>{t.avatar}</div>
                <div>
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div key={currentTestimonial} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass p-8 rounded-2xl">
              <div className="flex gap-1 mb-4">{[...Array(TESTIMONIALS[currentTestimonial].rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
              <p className="text-base text-white/65 italic mb-6">"{TESTIMONIALS[currentTestimonial].quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: `${TESTIMONIALS[currentTestimonial].accent}22`, color: TESTIMONIALS[currentTestimonial].accent }}>{TESTIMONIALS[currentTestimonial].avatar}</div>
                <div>
                  <p className="font-bold">{TESTIMONIALS[currentTestimonial].name}</p>
                  <p className="text-[9px] font-mono text-white/30">{TESTIMONIALS[currentTestimonial].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={() => setCurrentTestimonial(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="p-2 glass rounded-full"><ChevronLeft className="w-5 h-5" /></button>
            {TESTIMONIALS.map((_, i) => <button key={i} onClick={() => setCurrentTestimonial(i)} className={`rounded-full transition-all ${i === currentTestimonial ? 'bg-neon-accent w-4 h-1.5' : 'bg-white/20 w-1.5 h-1.5'}`} />)}
            <button onClick={() => setCurrentTestimonial(i => (i + 1) % TESTIMONIALS.length)} className="p-2 glass rounded-full"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </section>

      {/* ── FAQ */}
      <section className="px-6 md:px-20 py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel label="Got Questions?" />
            <SectionTitle lines={["Frequently", "Asked"]} className="text-[11vw] md:text-[7vw] leading-[0.85] font-display" />
          </div>
          {[
            { q: "Does the whole poster light up or just the car lights?", a: "Only the car's actual lights illuminate — for the Porsche, it's the rear taillights and brake light bar. For the BMW, it's the LED angel eye headlight rings. The rest of the poster stays dark, exactly like the real car at night." },
            { q: "What sizes do you offer?", a: "All products come in 3 sizes: A3 (30×42cm) at ₹999, A2 (42×59cm) at ₹1,299, and A1 (59×84cm) at ₹1,699." },
            { q: "How is it powered and installed?", a: "A 12V DC adapter plugs into any standard wall socket. The 3-meter transparent cable runs discreetly to the poster. The mounting kit includes brackets and a spirit level guide — setup takes under 10 minutes." },
            { q: "How do I turn the LED on/off?", a: "Simply plug the included power adapter into any standard wall socket. The LED turns on instantly. Unplug to switch it off. No remote or app required — it's always the same signature colour that matches the car's real lights." },
            { q: "How long does delivery take?", a: "All orders are dispatched within 48 hours. Pan-India delivery typically takes 3–7 business days via tracked courier. You'll receive a tracking link after dispatch." },
            { q: "Can I track my order?", a: "Yes — use the Track Order page and enter your order ID (sent via WhatsApp after dispatch) to see live delivery status." },
          ].map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} index={i} />)}
        </div>
      </section>

      {/* ── NEWSLETTER */}
      <section className="px-6 md:px-20 py-24 border-t border-white/5">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative rounded-[2rem] overflow-hidden p-12 md:p-20 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(255,0,61,0.08) 0%, rgba(0,0,0,0.8) 100%)', border: '1px solid rgba(255,0,61,0.12)' }}>
          <SectionLabel label="Stay In The Loop" />
          <h2 className="text-[10vw] md:text-[5vw] leading-[0.9] font-display mb-4">JOIN THE CLUB.</h2>
          <p className="text-white/40 text-sm mb-8 max-w-xs mx-auto">Early access to new posters, limited drops, and exclusive discounts.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="your@email.com" className="flex-1 bg-white/5 border border-white/10 px-6 py-4 rounded-full focus:outline-none focus:border-neon-accent transition-colors text-sm" />
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="bg-neon-accent text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wide">Subscribe</motion.button>
          </div>
        </motion.div>
      </section>

      <section className="px-6 md:px-20 pb-16 text-center">
        <p className="text-white/30 text-sm font-mono">Already ordered? <Link to="/track" className="text-neon-accent underline underline-offset-4 hover:text-white transition-colors">Track your package →</Link></p>
      </section>
    </main>
  );
}
