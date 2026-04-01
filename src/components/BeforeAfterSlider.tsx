import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

interface BeforeAfterSliderProps {
  image: string;
  ledColor: string;
  ledGlowPosition?: string;
  className?: string;
  aspectRatio?: string;
  initialPosition?: number;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  image,
  ledColor,
  ledGlowPosition = "50% 60%",
  className = "",
  aspectRatio = "16/10",
  initialPosition = 50,
}) => {
  const [pos, setPos] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(4, Math.min(clientX - rect.left, rect.width - 4));
    setPos((x / rect.width) * 100);
  }, []);

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setHasInteracted(true);
    updatePos(e.clientX);
  };
  const onMouseMove = useCallback(
    (e: MouseEvent) => { if (isDragging) updatePos(e.clientX); },
    [isDragging, updatePos]
  );
  const onMouseUp = useCallback(() => setIsDragging(false), []);

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setHasInteracted(true);
    updatePos(e.touches[0].clientX);
  };
  const onTouchMove = useCallback(
    (e: TouchEvent) => { if (isDragging) { e.preventDefault(); updatePos(e.touches[0].clientX); } },
    [isDragging, updatePos]
  );
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

  // Hint animation on first render
  useEffect(() => {
    if (hasInteracted) return;
    const timer = setTimeout(() => {
      let direction = 1;
      let current = initialPosition;
      const anim = setInterval(() => {
        current += direction * 0.5;
        setPos(current);
        if (current >= 62) direction = -1;
        if (current <= 38) direction = 1;
        if (Math.abs(current - initialPosition) < 0.5 && direction === 1 && current > initialPosition) {
          clearInterval(anim);
          setPos(initialPosition);
        }
      }, 16);
      return () => clearInterval(anim);
    }, 1200);
    return () => clearTimeout(timer);
  }, [hasInteracted, initialPosition]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none ${isDragging ? "cursor-grabbing" : "cursor-ew-resize"} ${className}`}
      style={{ aspectRatio }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* ── AFTER layer (LED ON) — full width, bottom */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt="LED ON"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(1.05) saturate(1.15)" }}
          draggable={false}
          referrerPolicy="no-referrer"
        />
        {/* Color glow where car lights are */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 45% 30% at ${ledGlowPosition}, ${ledColor}70 0%, ${ledColor}28 40%, transparent 68%)`,
          }}
        />
        {/* Bottom LED strip glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 5%, ${ledColor} 50%, transparent 95%)`,
            boxShadow: `0 0 12px 2px ${ledColor}`,
          }}
        />
        {/* ON label */}
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ledColor, boxShadow: `0 0 6px ${ledColor}` }} />
          <span className="text-[9px] font-mono uppercase tracking-widest text-white">LED ON</span>
        </div>
      </div>

      {/* ── BEFORE layer (LED OFF) — clipped to left of slider */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src={image}
          alt="LED OFF"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.28) grayscale(0.65)" }}
          draggable={false}
          referrerPolicy="no-referrer"
        />
        {/* OFF label */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
          <span className="text-[9px] font-mono uppercase tracking-widest text-white/50">LED OFF</span>
        </div>
      </div>

      {/* ── Divider line */}
      <div
        className="absolute top-0 bottom-0 w-px z-30 pointer-events-none"
        style={{ left: `${pos}%`, background: "rgba(255,255,255,0.85)" }}
      >
        {/* Handle */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center gap-1 pointer-events-auto cursor-ew-resize"
          style={{ boxShadow: "0 0 0 3px rgba(255,255,255,0.3), 0 4px 20px rgba(0,0,0,0.5)" }}
        >
          <div className="flex gap-0.5">
            <svg width="5" height="14" viewBox="0 0 5 14" fill="none">
              <path d="M2.5 1L0.5 4H4.5L2.5 1ZM2.5 13L0.5 10H4.5L2.5 13ZM2.5 5V9" stroke="#555" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Drag hint (disappears after interaction) */}
      {!hasInteracted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute top-3 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7H12M2 7L5 4M2 7L5 10M12 7L9 4M12 7L9 10" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span className="text-[9px] font-mono uppercase tracking-widest text-white/70">Drag to compare</span>
        </motion.div>
      )}
    </div>
  );
};
