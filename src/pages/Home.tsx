import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { PRODUCTS } from "../data/products";

export function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center px-6 md:px-20 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10"
        >
          <h2 className="text-[12vw] md:text-[15vw] leading-[0.85] mb-8 font-display">
            Light Up<br />
            <span 
              className="text-transparent uppercase" 
              style={{ 
                WebkitTextStroke: '2px rgba(255, 255, 255, 0.9)', 
                letterSpacing: '-0.08em',
              }}
            >
              THE ROOM
            </span>
          </h2>
          
          <div className="flex flex-col md:flex-row md:items-end gap-12">
            <p className="max-w-md text-sm md:text-base text-white/60 font-light leading-relaxed">
              Premium LED-illuminated art posters for automotive enthusiasts. 
              Handcrafted physical posters with remote-controlled neon effects.
              Starting from <span className="text-white font-mono">₹500</span>.
            </p>
            
            <Link to="/collection">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-10 py-5 rounded-full font-display text-xl flex items-center gap-4 hover:bg-neon-accent hover:text-white transition-colors"
              >
                Explore Collection
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Large Background Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none opacity-5 select-none">
          <h1 className="text-[40vw] text-center whitespace-nowrap">PREMIUM</h1>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-6 md:px-20 py-32">
        <div className="flex justify-between items-end mb-16">
          <div>
            <p className="text-neon-accent font-mono text-xs uppercase tracking-[0.5em] mb-4">New Arrivals</p>
            <motion.h2 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-[10vw] md:text-[8vw] leading-[0.85]"
            >
              Featured<br />
              <span className="text-transparent stroke-white stroke-1" style={{ WebkitTextStroke: '1px white' }}>Art</span>
            </motion.h2>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-xs text-white/40 font-mono uppercase tracking-widest">Scroll to explore</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-20 py-32 border-y border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
          {[
            { title: "Remote Control", desc: "Switch lighting modes and brightness from your couch." },
            { title: "Premium Print", desc: "High-resolution museum-grade paper with matte finish." },
            { title: "Easy Mount", desc: "Comes with pre-installed mounting brackets and cable management." }
          ].map((feature, i) => (
            <div key={i} className="space-y-4">
              <span className="text-neon-accent font-mono text-sm">0{i + 1}</span>
              <h3 className="text-3xl">{feature.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Section */}
      <section className="px-6 md:px-20 py-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-neon-accent font-mono text-xs uppercase tracking-[0.5em] mb-4">The Difference</p>
            <motion.h2 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-[8vw] md:text-[6vw] leading-[0.85]"
            >
              Standard vs.<br />
              <span className="text-transparent stroke-white stroke-1" style={{ WebkitTextStroke: '1px white' }}>WheelsGlow</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden">
            <div className="p-12 space-y-8 bg-black/20">
              <h4 className="text-2xl font-bold opacity-40">Standard Poster</h4>
              <ul className="space-y-6 text-white/30">
                <li className="flex items-center gap-4">✕ Flat 2D appearance</li>
                <li className="flex items-center gap-4">✕ Invisible in the dark</li>
                <li className="flex items-center gap-4">✕ Standard 150 GSM paper</li>
                <li className="flex items-center gap-4">✕ No interactive elements</li>
                <li className="flex items-center gap-4">✕ Basic wall decor</li>
              </ul>
            </div>
            <div className="p-12 space-y-8 bg-neon-accent/5 relative">
              <div className="absolute top-8 right-8 bg-neon-accent text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Superior</div>
              <h4 className="text-2xl font-bold text-neon-accent">WheelsGlow LED</h4>
              <ul className="space-y-6">
                <li className="flex items-center gap-4 text-white"><span className="text-neon-accent">✓</span> Dynamic 3D depth effect</li>
                <li className="flex items-center gap-4 text-white"><span className="text-neon-accent">✓</span> Vibrant neon glow at night</li>
                <li className="flex items-center gap-4 text-white"><span className="text-neon-accent">✓</span> 300 GSM Museum-grade paper</li>
                <li className="flex items-center gap-4 text-white"><span className="text-neon-accent">✓</span> Remote-controlled lighting</li>
                <li className="flex items-center gap-4 text-white"><span className="text-neon-accent">✓</span> Immersive atmosphere piece</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Inside the Box Section */}
      <section className="px-6 md:px-20 py-32 bg-white/5">
        <div className="flex flex-col md:flex-row gap-20 items-center">
          <div className="flex-1">
            <p className="text-neon-accent font-mono text-xs uppercase tracking-[0.5em] mb-4">Unboxing Experience</p>
            <motion.h2 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-[10vw] md:text-[8vw] leading-[0.85] mb-12"
            >
              Inside<br />
              <span className="text-transparent stroke-white stroke-1" style={{ WebkitTextStroke: '1px white' }}>The Box</span>
            </motion.h2>
            <div className="space-y-8">
              {[
                { item: "The Poster", detail: "24x36 inch premium matte finish art print." },
                { item: "LED Controller", detail: "Wireless remote with 16 color modes and dimming." },
                { item: "Power Adapter", detail: "12V DC adapter with 3-meter transparent cable." },
                { item: "Mounting Kit", detail: "Heavy-duty wall brackets and leveling guide." }
              ].map((box, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-1 h-12 bg-neon-accent mt-1" />
                  <div>
                    <h4 className="text-xl font-bold">{box.item}</h4>
                    <p className="text-white/40 text-sm">{box.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="aspect-square glass rounded-3xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=800" 
                alt="Product Detail"
                className="w-full h-full object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 glass p-8 rounded-2xl hidden md:block">
              <p className="text-4xl font-display">100%</p>
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">Hand-Assembled</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 md:px-20 py-32">
        <div className="mb-20">
          <p className="text-neon-accent font-mono text-xs uppercase tracking-[0.5em] mb-4">Community</p>
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-[10vw] md:text-[8vw] leading-[0.85]"
          >
            The<br />
            <span className="text-transparent stroke-white stroke-1" style={{ WebkitTextStroke: '1px white' }}>Enthusiasts</span>
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Arjun V.", role: "Porsche Collector", quote: "The way the LED highlights the curves of the 911 at night is just incredible. It's the center piece of my garage." },
            { name: "Sarah M.", role: "Interior Designer", quote: "Finally, automotive art that isn't just a flat poster. The depth and lighting add so much atmosphere to the room." },
            { name: "Rahul K.", role: "Tech Enthusiast", quote: "The remote control integration is seamless. I've synced the colors with my PC setup. Pure cyberpunk vibes." }
          ].map((t, i) => (
            <div key={i} className="glass p-10 rounded-3xl space-y-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => <div key={j} className="w-1 h-1 bg-neon-accent" />)}
              </div>
              <p className="text-lg italic text-white/80 leading-relaxed">"{t.quote}"</p>
              <div>
                <p className="font-bold">{t.name}</p>
                <p className="text-xs font-mono text-white/40 uppercase tracking-widest">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 md:px-20 py-32">
        <div className="max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-[12vw] md:text-[10vw] leading-[0.85] mb-16 text-center"
          >
            F A<br />
            <span className="text-transparent stroke-white stroke-1" style={{ WebkitTextStroke: '1px white' }}>Q</span>
          </motion.h2>
          <div className="space-y-6">
            {[
              { q: "How do I power the poster?", a: "Each poster comes with a 12V DC power adapter. It plugs into any standard wall outlet. The cable is transparent to remain discreet." },
              { q: "Can I change the colors?", a: "Yes! The included remote control allows you to switch between 16 static colors and 4 dynamic lighting modes." },
              { q: "Is it safe to leave on?", a: "Absolutely. We use low-heat, high-efficiency LEDs that are designed for long-term use. The posters remain cool to the touch." },
              { q: "Do you ship worldwide?", a: "We currently ship to over 50 countries. Shipping times vary by location but usually take 7-14 business days." }
            ].map((faq, i) => (
              <div key={i} className="glass p-8 rounded-2xl">
                <h4 className="text-xl font-bold mb-4">{faq.q}</h4>
                <p className="text-white/40 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-6 md:px-20 py-32 border-t border-white/5">
        <div className="glass p-12 md:p-24 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-md">
            <motion.h2 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-[8vw] md:text-[6vw] leading-[0.85] mb-6"
            >
              Join<br />
              <span className="text-transparent stroke-white stroke-1" style={{ WebkitTextStroke: '1px white' }}>The Club</span>
            </motion.h2>
            <p className="text-white/40">Get early access to limited drops and custom customization tips.</p>
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-white/5 border border-white/10 px-8 py-5 rounded-full focus:outline-none focus:border-neon-accent transition-colors min-w-[300px]"
            />
            <button className="bg-white text-black px-10 py-5 rounded-full font-bold hover:bg-neon-accent hover:text-white transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
