import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/progress";
import { cn } from "@/lib/utils";

/** 2D canvas starfield with twinkle and drifting cosmic dust. Random only on the client. */
export function Starfield({ className, density = 1 }: { className?: string; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0;
    let h = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    type Star = { x: number; y: number; r: number; p: number; s: number; warm: boolean };
    let stars: Star[] = [];
    const dust: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.floor(((w * h) / 2600) * density);
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() < 0.06 ? 1.4 + Math.random() : 0.3 + Math.random() * 0.9,
        p: Math.random() * Math.PI * 2,
        s: 0.4 + Math.random() * 1.6,
        warm: Math.random() < 0.18,
      }));
      dust.length = 0;
      for (let i = 0; i < 40 * density; i++) {
        dust.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.08, vy: -0.02 - Math.random() * 0.06, r: 0.6 + Math.random() * 1.6, a: 0.05 + Math.random() * 0.12 });
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const tw = 0.55 + 0.45 * Math.sin(s.p + t * 0.001 * s.s);
        ctx.globalAlpha = tw;
        ctx.fillStyle = s.warm ? "rgb(255,226,190)" : "rgb(225,232,255)";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const d of dust) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.y < -5) d.y = h + 5;
        if (d.x < -5) d.x = w + 5;
        if (d.x > w + 5) d.x = -5;
        ctx.globalAlpha = d.a;
        ctx.fillStyle = "rgb(240,210,160)";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    if (prefersReducedMotion()) {
      draw(0);
    } else {
      const loop = (t: number) => {
        draw(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}
