import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeAfterSliderProps {
  /** LED-OFF image (dark, no glow) */
  imageBefore: string;
  /** LED-ON image (lit up) */
  imageAfter: string;
  ledColor?: string;
  className?: string;
  aspectRatio?: string;
  initialPosition?: number;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  imageBefore,
  imageAfter,
  ledColor = "#FF2200",
  className = "",
  aspectRatio = "16/10",
  initialPosition = 50,
  objectFit = "cover",
  objectPosition = "center",
}) => {
  const [pos, setPos] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Core position updater
  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(2, Math.min(clientX - rect.left, rect.width - 2));
    setPos((x / rect.width) * 100);
  }, []);

  // ── Mouse
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setHasInteracted(true);
    updatePos(e.clientX);
  };
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) updatePos(e.clientX);
  }, [isDragging, updatePos]);
  const onMouseUp = useCallback(() => setIsDragging(false), []);

  // ── Touch
  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setHasInteracted(true);
    updatePos(e.touches[0].clientX);
  };
  const onTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging) { e.preventDefault(); updatePos(e.touches[0].clientX); }
  }, [isDragging, updatePos]);
  const onTouchEnd = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  // ── Auto hint animation (left/right sweep once on first load)
  useEffect(() => {
    if (hasInteracted) return;
    const delay = setTimeout(() => {
      let frame = 0;
      const FRAMES = 80;
      const anim = setInterval(() => {
        frame++;
        // Sweep right then back to center
        if (frame <= 30) setPos(initialPosition + frame * 0.5);
        else if (frame <= 60) setPos(initialPosition + (60 - frame) * 0.5);
        else if (frame === FRAMES) { clearInterval(anim); setPos(initialPosition); }
      }, 20);
    }, 1000);
    return () => clearTimeout(delay);
  }, [hasInteracted, initialPosition]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none ${isDragging ? "cursor-grabbing" : "cursor-ew-resize"} ${className}`}
      style={{ aspectRatio }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* ── AFTER (LED ON) — shows on RIGHT, full-width base layer */}
      <div className="absolute inset-0">
        <img src={imageAfter} alt="LED ON" draggable={false}
          className={`w-full h-full object-${objectFit}`} style={{ objectPosition }} />
        {/* Subtle color halo to enhance the glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 40% at 50% 55%, ${ledColor}18 0%, transparent 65%)` }} />
        {/* ON label — bottom right */}
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full pointer-events-none">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: ledColor, boxShadow: `0 0 6px ${ledColor}` }} />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white">LED ON</span>
        </div>
      </div>

      {/* ── BEFORE (LED OFF) — clips to left of slider */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={imageBefore} alt="LED OFF" draggable={false}
          className={`w-full h-full object-${objectFit}`} style={{ objectPosition }} />
        {/* OFF label — bottom left */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-white/15 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-white/30" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/50">LED OFF</span>
        </div>
      </div>

      {/* ── Divider line */}
      <div className="absolute top-0 bottom-0 z-30 pointer-events-none"
        style={{ left: `${pos}%`, transform: "translateX(-50%)", width: "2px", background: "rgba(255,255,255,0.9)", boxShadow: "0 0 8px rgba(255,255,255,0.6)" }} />

      {/* ── Central handle — draggable pill with ◀ ▶ */}
      <div className="absolute top-1/2 z-40 -translate-y-1/2 pointer-events-auto cursor-ew-resize"
        style={{ left: `${pos}%`, transform: `translateX(-50%) translateY(-50%)` }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <motion.div
          className="flex items-center gap-1.5 bg-white rounded-full shadow-2xl px-3 py-2"
          animate={{ scale: isDragging ? 1.08 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          style={{ boxShadow: isDragging ? `0 0 0 3px ${ledColor}66, 0 8px 30px rgba(0,0,0,0.6)` : "0 4px 20px rgba(0,0,0,0.5)" }}
        >
          {/* Left arrow */}
          <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
            <path d="M7 1L2 7L7 13" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {/* Dot */}
          <div className="w-1 h-4 bg-gray-300 rounded-full" />
          {/* Right arrow */}
          <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
            <path d="M3 1L8 7L3 13" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>

      {/* ── LEFT side edge dragger tab */}
      <motion.div
        className="absolute left-0 top-1/2 z-40 -translate-y-1/2 cursor-ew-resize pointer-events-auto"
        animate={{ x: hasInteracted ? -40 : 0, opacity: hasInteracted ? 0 : 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-r-xl px-2.5 py-3 flex flex-col items-center gap-1.5 shadow-xl">
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path d="M5 1L1 6L5 11" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div className="w-px h-6 bg-gray-400 rounded" />
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path d="M3 1L7 6L3 11" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </motion.div>

      {/* ── RIGHT side edge dragger tab */}
      <motion.div
        className="absolute right-0 top-1/2 z-40 -translate-y-1/2 cursor-ew-resize pointer-events-auto"
        animate={{ x: hasInteracted ? 40 : 0, opacity: hasInteracted ? 0 : 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        onMouseDown={(e) => { e.preventDefault(); setIsDragging(true); setHasInteracted(true); updatePos(e.clientX); }}
        onTouchStart={(e) => { setIsDragging(true); setHasInteracted(true); updatePos(e.touches[0].clientX); }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-l-xl px-2.5 py-3 flex flex-col items-center gap-1.5 shadow-xl">
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path d="M5 1L1 6L5 11" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div className="w-px h-6 bg-gray-400 rounded" />
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path d="M3 1L7 6L3 11" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </motion.div>

      {/* ── "Drag to compare" hint text — fades after first interaction */}
      <AnimatePresence>
        {!hasInteracted && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.2 }}
            className="absolute top-3 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full border border-white/15 pointer-events-none"
          >
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <path d="M1 5H15M1 5L4 2M1 5L4 8M15 5L12 2M15 5L12 8" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/70">Drag to compare</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
