import { ProductCard } from "../components/ProductCard";
import { PRODUCTS } from "../data/products";
import { motion } from "framer-motion";

export function Collection() {
  return (
    <div className="px-6 md:px-20 py-12 min-h-screen">
      <div className="mb-16">
        <p className="text-neon-accent font-mono text-xs uppercase tracking-[0.5em] mb-4">Complete Series</p>
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[10vw] md:text-[8vw] leading-[0.85]"
        >
          All<br />
          <span className="text-transparent stroke-white stroke-1" style={{ WebkitTextStroke: '1px white' }}>Posters</span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
