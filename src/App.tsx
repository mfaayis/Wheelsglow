import { motion } from "framer-motion";
import { CursorBackground } from "./components/CursorBackground";
import { ProductCard, type Product } from "./components/ProductCard";
import { Menu, ShoppingBag, User, ArrowRight, Instagram, Twitter, Facebook } from "lucide-react";

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Porsche 911 GT3",
    price: 899,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
    color: "#FF6B00",
    description: "Neon Orange Edition"
  },
  {
    id: 2,
    name: "Ducati Panigale",
    price: 749,
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800",
    color: "#FF003D",
    description: "Racing Red Glow"
  },
  {
    id: 3,
    name: "Cyberpunk GTR",
    price: 999,
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800",
    color: "#00D1FF",
    description: "Electric Blue Series"
  },
  {
    id: 4,
    name: "Lamborghini Revuelto",
    price: 949,
    image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=800",
    color: "#CCFF00",
    description: "Acid Green Illumination"
  }
];

export default function App() {
  return (
    <div className="min-h-screen">
      <CursorBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-8 flex justify-between items-center mix-blend-difference">
        <div className="flex items-center gap-8">
          <Menu className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
          <h1 className="text-3xl tracking-tighter">WheelsGlow</h1>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-8 text-xs font-mono uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-neon-accent transition-colors">Collection</a>
            <a href="#" className="hover:text-neon-accent transition-colors">Custom</a>
            <a href="#" className="hover:text-neon-accent transition-colors">About</a>
          </div>
          <div className="flex gap-6">
            <User className="w-5 h-5 cursor-pointer hover:text-neon-accent transition-colors" />
            <div className="relative">
              <ShoppingBag className="w-5 h-5 cursor-pointer hover:text-neon-accent transition-colors" />
              <span className="absolute -top-2 -right-2 bg-neon-accent text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">2</span>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="h-screen flex flex-col justify-center px-6 md:px-20 relative overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10"
          >
            <h2 className="text-[12vw] md:text-[15vw] leading-[0.85] mb-8">
              Light Up<br />
              <span className="text-transparent stroke-white stroke-1" style={{ WebkitTextStroke: '1px white' }}>The Road</span>
            </h2>
            
            <div className="flex flex-col md:flex-row md:items-end gap-12">
              <p className="max-w-md text-sm md:text-base text-white/60 font-light leading-relaxed">
                Premium LED-illuminated art posters for automotive enthusiasts. 
                Handcrafted physical posters with remote-controlled neon effects.
                Starting from <span className="text-white font-mono">₹500</span>.
              </p>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-10 py-5 rounded-full font-display text-xl flex items-center gap-4 hover:bg-neon-accent hover:text-white transition-colors"
              >
                Explore Collection
                <ArrowRight className="w-6 h-6" />
              </motion.button>
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
              <h2 className="text-5xl md:text-7xl">Featured Art</h2>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-xs text-white/40 font-mono uppercase tracking-widest">Scroll to explore</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS.map((product) => (
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
              <h2 className="text-5xl md:text-7xl">Standard vs. WheelsGlow</h2>
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
              <h2 className="text-5xl md:text-7xl mb-12">Inside the Box</h2>
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
            <h2 className="text-5xl md:text-7xl">The Enthusiasts</h2>
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
            <h2 className="text-5xl md:text-7xl mb-16 text-center">FAQ</h2>
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
              <h2 className="text-4xl md:text-5xl mb-6">Join the Club</h2>
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

      {/* Footer */}
      <footer className="px-6 md:px-20 py-20 bg-black">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2 space-y-8">
            <h1 className="text-4xl">WheelsGlow</h1>
            <p className="max-w-xs text-white/40 text-sm">
              Elevating your space with the fusion of automotive art and neon technology.
            </p>
            <div className="flex gap-6">
              <Instagram className="w-5 h-5 text-white/40 hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 text-white/40 hover:text-white cursor-pointer" />
              <Facebook className="w-5 h-5 text-white/40 hover:text-white cursor-pointer" />
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="font-mono text-xs uppercase tracking-widest">Shop</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li className="hover:text-white cursor-pointer">All Posters</li>
              <li className="hover:text-white cursor-pointer">Car Series</li>
              <li className="hover:text-white cursor-pointer">Motorcycle Series</li>
              <li className="hover:text-white cursor-pointer">Custom Orders</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-mono text-xs uppercase tracking-widest">Support</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li className="hover:text-white cursor-pointer">Shipping Policy</li>
              <li className="hover:text-white cursor-pointer">Returns</li>
              <li className="hover:text-white cursor-pointer">FAQ</li>
              <li className="hover:text-white cursor-pointer">Contact</li>
            </ul>
          </div>
        </div>
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between gap-6 text-[10px] font-mono text-white/20 uppercase tracking-widest">
          <p>© 2026 WheelsGlow Store. All rights reserved.</p>
          <div className="flex gap-8">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
