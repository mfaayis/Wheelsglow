import { useEffect, useRef, useState } from 'react';

// Detect touch/mouse device once at module level
const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

export const CursorBackground = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const glowPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const ambientPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const rafRef = useRef<number>();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // On touch devices: no mouse cursor exists — skip the entire RAF loop
    if (isTouchDevice) return;

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      glowPos.current.x = lerp(glowPos.current.x, mousePos.current.x, 0.1);
      glowPos.current.y = lerp(glowPos.current.y, mousePos.current.y, 0.1);
      ambientPos.current.x = lerp(ambientPos.current.x, mousePos.current.x, 0.03);
      ambientPos.current.y = lerp(ambientPos.current.y, mousePos.current.y, 0.03);

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowPos.current.x}px, ${glowPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (ambientRef.current) {
        ambientRef.current.style.transform = `translate3d(${ambientPos.current.x}px, ${ambientPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-bg-dark">

      {/* Cursor glow — desktop only (will-change for GPU layer) */}
      {!isTouchDevice && (
        <>
          <div
            ref={glowRef}
            className="absolute top-0 left-0 transition-opacity duration-700"
            style={{ width: 700, height: 700, opacity: visible ? 1 : 0, willChange: 'transform' }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,0,61,0.18) 0%, rgba(255,107,0,0.07) 45%, transparent 70%)',
                filter: 'blur(28px)',
              }}
            />
          </div>
          <div
            ref={ambientRef}
            className="absolute top-0 left-0 transition-opacity duration-1000"
            style={{ width: 1400, height: 1400, opacity: visible ? 0.75 : 0, willChange: 'transform' }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,0,61,0.07) 0%, rgba(255,107,0,0.04) 40%, transparent 70%)',
                filter: 'blur(80px)',
              }}
            />
          </div>
        </>
      )}

      {/* Static corner orbs — hidden on mobile via CSS */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30 no-mobile-anim animate-blob"
        style={{ background: 'radial-gradient(circle, rgba(255,0,61,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20 no-mobile-anim animate-blob"
        style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.1) 0%, transparent 70%)', filter: 'blur(50px)', animationDelay: '-7s' }}
      />
      <div
        className="absolute top-1/2 -right-40 w-80 h-80 rounded-full opacity-15 no-mobile-anim animate-blob"
        style={{ background: 'radial-gradient(circle, rgba(0, 209, 255, 0.06) 0%, transparent 70%)', filter: 'blur(40px)', animationDelay: '-14s' }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  );
};
