import { useEffect, useRef } from "react";
import moonImg from "@/assets/eye-moon.png";
import marsImg from "@/assets/eye-mars.jpg";
import type { Planet } from "@/data/types";
import { cn } from "@/lib/utils";

interface Props {
  stage: number; // opening sequence stage
  talking: boolean;
  hovered: Planet | null;
  onHover: (p: Planet | null) => void;
  onChoose: (p: Planet, rect: DOMRect) => void;
}

const EYES: { planet: Planet; cx: number; label: string; img: string }[] = [
  { planet: "moon", cx: 215, label: "The Moon", img: moonImg },
  { planet: "mars", cx: 385, label: "Mars", img: marsImg },
];

const VB_W = 600;
const VB_H = 540;
const EYE_CY = 238;
const EYE_R = 84;

export const eyeImages: Record<Planet, string> = { moon: moonImg, mars: marsImg };

/** Smriti, the Cosmic Memory Keeper. Left eye holds the Moon, right eye holds Mars. */
export function RobotGuide({ stage, talking, hovered, onHover, onChoose }: Props) {
  const root = useRef<HTMLDivElement>(null);

  // Eyes follow the pointer via CSS variables (no React re-render per move).
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width * 0.8)));
      const y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height * 0.8)));
      el.style.setProperty("--look-x", x.toFixed(3));
      el.style.setProperty("--look-y", y.toFixed(3));
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  const lit = stage >= 3;
  const planetsVisible = stage >= 4;

  return (
    <div
      ref={root}
      className={cn("relative mx-auto select-none", stage >= 2 ? "animate-robot-in" : "opacity-0")}
      style={{ width: "min(520px, 84vw, 50vh)", aspectRatio: `${VB_W} / ${VB_H}` }}
    >
      <div className={cn("absolute inset-0", stage >= 7 && "animate-float")}>
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <linearGradient id="shell" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: "oklch(0.36 0.03 262)" }} />
              <stop offset="55%" style={{ stopColor: "oklch(0.22 0.025 262)" }} />
              <stop offset="100%" style={{ stopColor: "oklch(0.15 0.02 262)" }} />
            </linearGradient>
            <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" style={{ stopColor: "var(--signal)", stopOpacity: 0.9 }} />
              <stop offset="50%" style={{ stopColor: "var(--foreground)", stopOpacity: 0.15 }} />
              <stop offset="100%" style={{ stopColor: "var(--mars)", stopOpacity: 0.7 }} />
            </linearGradient>
            <radialGradient id="face" cx="50%" cy="40%" r="70%">
              <stop offset="0%" style={{ stopColor: "oklch(0.17 0.03 262)" }} />
              <stop offset="100%" style={{ stopColor: "oklch(0.08 0.015 262)" }} />
            </radialGradient>
          </defs>

          {/* antenna */}
          <line x1="300" y1="72" x2="300" y2="30" className="stroke-muted-foreground" strokeWidth="5" strokeLinecap="round" />
          <circle cx="300" cy="24" r="11" className={cn("fill-signal", lit ? "opacity-100" : "opacity-30")} />
          {lit && <circle cx="300" cy="24" r="11" className="animate-pulse-ring fill-signal" style={{ transformOrigin: "300px 24px" }} />}

          {/* ears */}
          <rect x="34" y="190" width="46" height="130" rx="23" fill="url(#shell)" className="stroke-border" strokeWidth="2" />
          <rect x="520" y="190" width="46" height="130" rx="23" fill="url(#shell)" className="stroke-border" strokeWidth="2" />
          <rect x="50" y="236" width="14" height="38" rx="7" className={cn("fill-moon transition-opacity duration-700", lit ? "opacity-80" : "opacity-10")} />
          <rect x="536" y="236" width="14" height="38" rx="7" className={cn("fill-mars transition-opacity duration-700", lit ? "opacity-90" : "opacity-10")} />

          {/* neck & collar */}
          <path d="M235 400 L365 400 L385 450 L215 450 Z" fill="url(#shell)" className="stroke-border" strokeWidth="2" />
          <path d="M150 470 Q300 430 450 470 L470 540 L130 540 Z" fill="url(#shell)" className="stroke-border" strokeWidth="2" />
          <text x="300" y="505" textAnchor="middle" className="fill-muted-foreground font-mono" fontSize="13" letterSpacing="5">
            MEMORY KEEPER
          </text>

          {/* head */}
          <rect x="70" y="72" width="460" height="334" rx="150" fill="url(#shell)" />
          <rect x="70" y="72" width="460" height="334" rx="150" fill="none" stroke="url(#rim)" strokeWidth="2.5" />
          {/* faceplate */}
          <rect x="104" y="122" width="392" height="246" rx="118" fill="url(#face)" className="stroke-border" strokeWidth="2" />
          {/* brow lights */}
          <rect x="160" y="138" width="110" height="5" rx="2.5" className={cn("fill-moon transition-opacity duration-1000", lit ? "opacity-50" : "opacity-0")} />
          <rect x="330" y="138" width="110" height="5" rx="2.5" className={cn("fill-mars transition-opacity duration-1000", lit ? "opacity-60" : "opacity-0")} />

          {/* mouth: LED equaliser */}
          {Array.from({ length: 9 }).map((_, i) => {
            const x = 300 - 4 * 13 + i * 13 - 3;
            const h = 6 + (4 - Math.abs(4 - i)) * 3;
            return (
              <rect
                key={i}
                x={x}
                y={342 - h / 2}
                width="6"
                height={h}
                rx="3"
                className={cn("fill-signal transition-opacity", lit ? "opacity-90" : "opacity-15", talking && "animate-talk")}
                style={{ animationDelay: `${(i % 4) * 0.09}s` }}
              />
            );
          })}
        </svg>

        {/* Eyes are real buttons layered on the SVG */}
        {EYES.map((e) => {
          const isHover = hovered === e.planet;
          const size = ((EYE_R * 2) / VB_W) * 100;
          return (
            <button
              key={e.planet}
              type="button"
              disabled={stage < 7}
              aria-label={`Explore ${e.label}`}
              onPointerEnter={() => onHover(e.planet)}
              onPointerLeave={() => onHover(null)}
              onFocus={() => onHover(e.planet)}
              onBlur={() => onHover(null)}
              onClick={(ev) => onChoose(e.planet, (ev.currentTarget as HTMLElement).getBoundingClientRect())}
              className={cn(
                "group absolute rounded-full outline-none transition-transform duration-500 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default",
                stage >= 7 && "cursor-pointer hover:scale-[1.06]",
              )}
              style={{
                left: `${((e.cx - EYE_R) / VB_W) * 100}%`,
                top: `${((EYE_CY - EYE_R) / VB_H) * 100}%`,
                width: `${size}%`,
                aspectRatio: "1",
              }}
            >
              {/* socket ring */}
              <span
                className={cn(
                  "absolute inset-0 rounded-full border-2 transition-all duration-700",
                  e.planet === "moon" ? "border-moon/30" : "border-mars/40",
                  lit ? "opacity-100" : "opacity-20",
                  isHover && (e.planet === "moon" ? "glow-moon border-moon/80" : "glow-mars border-mars/90"),
                )}
              />
              <span className="absolute inset-[8%] overflow-hidden rounded-full bg-ink">
                {planetsVisible && (
                  <img
                    src={e.img}
                    alt=""
                    width={768}
                    height={768}
                    draggable={false}
                    className="animate-ignite h-full w-full object-cover transition-transform duration-700 ease-out"
                    style={{
                      transform: `translate(calc(var(--look-x, 0) * 7%), calc(var(--look-y, 0) * 7%)) scale(${isHover ? 1.22 : 1.08})`,
                    }}
                  />
                )}
                {/* glass highlight + inner shadow for depth */}
                <span className="pointer-events-none absolute inset-0 rounded-full eye-glass" />
                {/* iris ring */}
                <span
                  className={cn(
                    "animate-spin-slow pointer-events-none absolute inset-[3%] rounded-full border border-dashed transition-opacity duration-700",
                    e.planet === "moon" ? "border-moon/40" : "border-mars/50",
                    lit ? "opacity-100" : "opacity-0",
                  )}
                />
              </span>
              {/* eyelid */}
              {stage >= 4 && <span aria-hidden className="animate-blink absolute inset-[6%] rounded-full bg-secondary" />}
              {/* name label */}
              <span
                className={cn(
                  "eyebrow pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap transition-all duration-300",
                  isHover ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
                  e.planet === "moon" ? "text-moon" : "text-mars",
                )}
              >
                {e.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
