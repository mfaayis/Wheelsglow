import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export const CursorBackground = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 40, stiffness: 80 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-bg-dark">
      {/* Mesh Gradient Blobs - Racing Red Theme */}
      <motion.div
        className="absolute w-[900px] h-[900px] bg-red-600/10 rounded-full blur-[140px] animate-blob"
        style={{
          left: useTransform(x, (val) => val - 450),
          top: useTransform(y, (val) => val - 450),
        }}
      />
      
      <motion.div
        className="absolute w-[700px] h-[700px] bg-orange-500/10 rounded-full blur-[120px] animate-blob"
        style={{
          left: useTransform(x, (val) => val - 350),
          top: useTransform(y, (val) => val - 350),
        }}
        transition={{ delay: 0.1 }}
      />

      <motion.div
        className="absolute w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[160px] animate-blob"
        style={{
          left: useTransform(x, (val) => val - 300),
          top: useTransform(y, (val) => val - 300),
        }}
        transition={{ delay: 0.2 }}
      />

      {/* Static Background Texture */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      {/* Grid Shimmer */}
      <div 
        className="absolute inset-0 opacity-[0.05]" 
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Particle Drift */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-neon-accent/10"
          initial={{ 
            x: Math.random() * 100 + "vw", 
            y: Math.random() * 100 + "vh",
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{
            y: [null, "-20vh"],
            opacity: [0, 0.2, 0]
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10
          }}
          style={{
            width: Math.random() * 2 + 1 + 'px',
            height: Math.random() * 2 + 1 + 'px',
          }}
        />
      ))}
    </div>
  );
};
