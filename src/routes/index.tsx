import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, RotateCcw, SkipForward } from "lucide-react";
import { Starfield } from "@/components/landing/Starfield";
import { RobotGuide, eyeImages } from "@/components/landing/RobotGuide";
import { MobileNav, NAV, Wordmark } from "@/components/layout/SiteHeader";
import { SettingsToggles } from "@/components/layout/SettingsToggles";
import { Button } from "@/components/ui/button";
import type { Planet } from "@/data/types";
import { prefersReducedMotion, useProgress, useProgressHydrated } from "@/lib/progress";
import { sfx } from "@/lib/sound";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CosmoSmriti — Choose Your World" },
      { name: "description", content: "Meet Smriti, the Cosmic Memory Keeper, and choose the Moon or Mars to discover ten pieces of human history left on other worlds." },
      { property: "og:title", content: "CosmoSmriti — The Universe Never Forgets" },
      { property: "og:description", content: "An interactive 3D museum of humanity's forgotten memories on the Moon and Mars." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

// Opening sequence: 1 stars, 2 robot, 3 eyes light, 4 planets, 5 welcome, 6 title, 7 choose
const SCHEDULE = [0, 500, 2000, 2900, 3700, 5200, 6100];

const LINES = {
  welcome: "Hello, explorer. I am Smriti, keeper of cosmic memories.",
  idle: "Humanity explored other worlds. Some of its creations stayed behind. Which world shall we visit?",
  moon: "The Moon: five memories from the Apollo missions, 1969 to 1972.",
  mars: "Mars: five robotic explorers that landed between 1997 and 2008.",
} as const;

function Landing() {
  const navigate = useNavigate();
  const hydrated = useProgressHydrated();
  const introSeen = useProgress((s) => s.introSeen);
  const setIntroSeen = useProgress((s) => s.setIntroSeen);
  const [stage, setStage] = useState(0);
  const [hovered, setHovered] = useState<Planet | null>(null);
  const [warp, setWarp] = useState<{ planet: Planet; rect: DOMRect; go: boolean } | null>(null);
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const play = (fast: boolean) => {
    clear();
    setStage(0);
    if (fast || prefersReducedMotion()) {
      setStage(7);
      return;
    }
    SCHEDULE.forEach((ms, i) => {
      timers.current.push(window.setTimeout(() => setStage(i + 1), ms));
    });
  };

  // Start once saved progress is known, so returning visitors get a short intro.
  useEffect(() => {
    if (!hydrated) return;
    play(introSeen);
    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  useEffect(() => {
    if (stage >= 7) setIntroSeen();
  }, [stage, setIntroSeen]);

  const choose = (planet: Planet, rect: DOMRect) => {
    sfx.warp();
    if (prefersReducedMotion()) {
      void navigate({ to: "/explore/$planet", params: { planet } });
      return;
    }
    setWarp({ planet, rect, go: false });
    requestAnimationFrame(() => requestAnimationFrame(() => setWarp((w) => (w ? { ...w, go: true } : w))));
    window.setTimeout(() => void navigate({ to: "/explore/$planet", params: { planet } }), 1150);
  };

  const line = hovered ? LINES[hovered] : stage >= 7 ? LINES.idle : LINES.welcome;
  const talking = stage >= 5 && stage < 7;

  return (
    <div className="bg-space relative min-h-[100svh] overflow-hidden">
      <Starfield className={cn("transition-opacity duration-[2000ms]", stage >= 1 ? "opacity-100" : "opacity-0")} />

      {/* top bar */}
      <div className="relative z-20 flex items-center justify-between px-4 py-4 md:px-8">
        <div className={cn("transition-opacity duration-700", stage >= 6 ? "opacity-100" : "opacity-0")}>
          <Wordmark />
        </div>
        <div className="flex items-center gap-2">
          {stage < 7 ? (
            <Button variant="hud" size="sm" onClick={() => play(true)} className="h-9 px-4">
              <SkipForward /> Skip intro
            </Button>
          ) : (
            <>
              <Button variant="hud" size="sm" onClick={() => play(false)} className="hidden h-9 px-4 sm:inline-flex">
                <RotateCcw /> Replay intro
              </Button>
              <SettingsToggles compact />
              <MobileNav triggerClassName="lg:inline-flex" />
            </>
          )}
        </div>
      </div>

      <main id="main" className="relative z-10 flex min-h-[calc(100svh-72px)] flex-col items-center justify-center px-4 pb-10">
        {/* speech */}
        <div
          aria-live="polite"
          className={cn(
            "panel mb-4 max-w-md px-5 py-3 text-center text-sm leading-relaxed transition-all duration-700 md:text-base",
            stage >= 5 ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          <span className="eyebrow mr-2 text-primary">Smriti</span>
          {line}
        </div>

        <RobotGuide stage={stage} talking={talking} hovered={hovered} onHover={setHovered} onChoose={choose} />

        <div className="mt-8 text-center">
          <h1 className={cn("wordmark text-2xl text-foreground md:text-4xl", stage >= 6 ? "animate-fade-up" : "opacity-0")}>
            Cosmo<span className="text-primary">smriti</span>
          </h1>
          <p className={cn("display mt-3 text-xl italic text-muted-foreground md:text-2xl", stage >= 6 ? "animate-fade-up [animation-delay:200ms]" : "opacity-0")}>
            The universe never forgets.
          </p>
          <p className={cn("mt-2 text-sm text-muted-foreground", stage >= 6 ? "animate-fade-up [animation-delay:350ms]" : "opacity-0")}>
            <span className="text-primary">Smriti</span> (<span lang="bn">স্মৃতি</span>) is the Bengali word for memory.
          </p>
          <div className={cn("mt-7 flex flex-col items-center gap-4", stage >= 7 ? "animate-fade-up" : "pointer-events-none opacity-0")}>
            <p className="eyebrow text-primary">Choose your world · tap an eye</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="moon" size="xl" asChild>
                <Link to="/explore/$planet" params={{ planet: "moon" }} onMouseEnter={() => setHovered("moon")} onMouseLeave={() => setHovered(null)}>
                  Enter the Moon <ArrowRight />
                </Link>
              </Button>
              <Button variant="mars" size="xl" asChild>
                <Link to="/explore/$planet" params={{ planet: "mars" }} onMouseEnter={() => setHovered("mars")} onMouseLeave={() => setHovered(null)}>
                  Enter Mars <ArrowRight />
                </Link>
              </Button>
            </div>
            <nav className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground" aria-label="Museum sections">
              {NAV.slice(3).map((n) => (
                <Link key={n.label} {...n.link} className="hover:text-primary">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </main>

      {/* cinematic warp into the chosen planet */}
      {warp && (
        <div className="pointer-events-none fixed inset-0 z-50" aria-hidden>
          <div
            className="absolute overflow-hidden rounded-full"
            style={{
              left: warp.rect.left,
              top: warp.rect.top,
              width: warp.rect.width,
              height: warp.rect.height,
              transform: warp.go ? `scale(${(Math.max(window.innerWidth, window.innerHeight) / warp.rect.width) * 2.6})` : "scale(1)",
              transition: "transform 1.15s cubic-bezier(0.7, 0, 0.3, 1)",
            }}
          >
            <img src={eyeImages[warp.planet]} alt="" className="h-full w-full scale-110 object-cover" />
          </div>
          <div className={cn("absolute inset-0 bg-ink transition-opacity delay-700 duration-500", warp.go ? "opacity-100" : "opacity-0")} />
        </div>
      )}
    </div>
  );
}
