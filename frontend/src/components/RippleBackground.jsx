import { useEffect, useRef } from "react";

const DOT_COUNT = 20000;
const DOT_SIZE = 1.2;

// Diffusion (fills space)
const DIFFUSION = 0.02;

// 🌊 Wave (visual only)
const WAVE_SPEED = 7;        // ✅ 1.5x faster
const WAVE_WIDTH = 70;
const WAVE_STRENGTH = 5;
const OFFSET_DAMPING = 0.5;

// 🎨 Color
const BASE_HUE = 200;          // calm indigo
const HUE_SHIFT = 100;          // subtle travel

export default function RippleBackground() {
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const wavesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize dots
    dotsRef.current = Array.from({ length: DOT_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      ox: 0,
      oy: 0,
      hueOffset: 0, // 🎨 temporary color shift
    }));

    // Tap → create wave
    window.addEventListener("pointerdown", (e) => {
      wavesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        r: 0,
      });
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move waves
      wavesRef.current.forEach((w) => (w.r += WAVE_SPEED));
      wavesRef.current = wavesRef.current.filter(
        (w) => w.r < Math.hypot(canvas.width, canvas.height)
      );

      for (const d of dotsRef.current) {
        // 1️⃣ Base diffusion
        d.x += (Math.random() - 0.5) * DIFFUSION;
        d.y += (Math.random() - 0.5) * DIFFUSION;

        if (d.x < 0) d.x += canvas.width;
        if (d.x > canvas.width) d.x -= canvas.width;
        if (d.y < 0) d.y += canvas.height;
        if (d.y > canvas.height) d.y -= canvas.height;

        // Reset hue influence each frame
        d.hueOffset = 0;

        // 2️⃣ Wave offset + color front
        for (const w of wavesRef.current) {
          const dx = d.x - w.x;
          const dy = d.y - w.y;
          const dist = Math.hypot(dx, dy) || 1;
          const delta = Math.abs(dist - w.r);

          if (delta < WAVE_WIDTH) {
            const t = 1 - delta / WAVE_WIDTH;

            // Positional offset (visual only)
            const strength = t * WAVE_STRENGTH;
            d.ox += (dx / dist) * strength;
            d.oy += (dy / dist) * strength;

            // 🎨 Color-shifting wavefront
            d.hueOffset += HUE_SHIFT * t;
          }
        }

        // 3️⃣ Offset decay (healing)
        d.ox *= OFFSET_DAMPING;
        d.oy *= OFFSET_DAMPING;

        // Draw
        ctx.fillStyle = `hsla(
          ${BASE_HUE + d.hueOffset},
          70%,
          65%,
          0.35
        )`;

        ctx.fillRect(
          d.x + d.ox,
          d.y + d.oy,
          DOT_SIZE,
          DOT_SIZE
        );
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
