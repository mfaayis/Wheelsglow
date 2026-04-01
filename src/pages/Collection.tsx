import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { PRODUCTS } from "../data/products";

export function Collection() {
  return (
    <div className="px-6 md:px-20 py-16 min-h-screen">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-14">
        <p className="text-neon-accent font-mono text-[10px] uppercase tracking-[0.6em] mb-4 flex items-center gap-3">
          <span className="w-6 h-px bg-neon-accent" />Full Collection
        </p>
        <h1 className="text-[12vw] md:text-[8vw] leading-[0.85] font-display">
          All<br />
          <span style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.7)', color: 'transparent' }}>Posters</span>
        </h1>
      </motion.div>

      {/* Drag hint */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-neon-accent animate-pulse" />
          <span className="text-white font-bold text-sm">Drag the slider on each card</span>
        </div>
        <span className="text-white/40 text-sm">to see the before/after LED effect — only the car's own lights illuminate.</span>
      </motion.div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PRODUCTS.map((product, i) => (
          <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {/* What's in the box */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-20 glass rounded-3xl p-8 md:p-12">
        <h2 className="text-3xl font-display mb-8">What's In The Box</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "🖼️", label: "LED Poster", desc: "300 GSM matte print with pre-mounted LED strip" },
            { icon: "📡", label: "RF Remote", desc: "24-key wireless remote, 16 colors, 4 modes" },
            { icon: "🔌", label: "12V Adapter", desc: "3m transparent cable + 12V 2A DC adapter" },
            { icon: "🔧", label: "Mount Kit", desc: "Wall brackets + spirit level + screws" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-3xl mb-3">{item.icon}</div>
              <p className="font-bold text-sm mb-1">{item.label}</p>
              <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <p className="text-white/30 text-sm font-mono mb-4">Need help choosing?</p>
        <Link to="/contact">
          <motion.button whileHover={{ scale: 1.04 }} className="border border-white/15 text-white/60 px-8 py-4 rounded-full font-mono text-xs uppercase tracking-widest hover:border-neon-accent hover:text-neon-accent transition-all">
            Contact Us →
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
