import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

const DOTS = 20;

export default function AmbientBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const clickPulse = useMotionValue(1);

  // Smooth springs
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const pulse = useSpring(clickPulse, { stiffness: 300, damping: 15 });

  const containerRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };

    const click = () => {
      clickPulse.set(1.4);
      setTimeout(() => clickPulse.set(1), 120);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("click", click);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("click", click);
    };
  }, [mouseX, mouseY, clickPulse]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
    >
      {/* Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99,102,241,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99,102,241,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Gradient blobs */}
      <motion.div
        className="absolute w-[520px] h-[520px]
                   bg-indigo-400/20 dark:bg-indigo-500/10
                   rounded-full blur-[120px]"
        animate={{ x: [0, 120, 0], y: [0, 80, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "10%", left: "10%" }}
      />

      <motion.div
        className="absolute w-[620px] h-[620px]
                   bg-fuchsia-400/20 dark:bg-fuchsia-500/10
                   rounded-full blur-[140px]"
        animate={{ x: [0, -140, 0], y: [0, -100, 0] }}
        transition={{ duration: 36, repeat: Infinity, ease: "easeInOut" }}
        style={{ bottom: "10%", right: "10%" }}
      />

      {/* ✅ INTERACTIVE DOTS */}
      {[...Array(DOTS)].map((_, i) => {
        const baseX = (Math.random() - 0.5) * window.innerWidth;
        const baseY = (Math.random() - 0.5) * window.innerHeight;

        return (
          <motion.span
            key={i}
            className="
              absolute w-2 h-2 rounded-full
              bg-indigo-400/60 dark:bg-indigo-300/30
            "
            style={{
              left: "50%",
              top: "50%",
              x: smoothX,
              y: smoothY,
              translateX: baseX * 0.08,
              translateY: baseY * 0.08,
              scale: pulse,
            }}
          />
        );
      })}
    </div>
  );
}
