import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Archive, BookMarked, HelpCircle, Keyboard, Locate, X, Repeat } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Wordmark, MobileNav } from "@/components/layout/SiteHeader";
import { SettingsToggles } from "@/components/layout/SettingsToggles";
import { ArtifactExperience } from "@/components/artifact/ArtifactExperience";
import { WorldScene } from "@/components/world/WorldScene";
import { WorldFallback } from "@/components/world/WorldFallback";
import { CanvasBoundary } from "@/components/world/CanvasBoundary";
import type { FlyRequest } from "@/components/world/CameraRig";
import { artifacts, artifactsByPlanet, getArtifact, planetMeta } from "@/data/artifacts";
import { hiddenMemories, type HiddenMemory } from "@/data/extras";
import type { Planet } from "@/data/types";
import { artifactWorldPos } from "@/game/projection";
import { countByPlanet } from "@/lib/achievements";
import { prefersReducedMotion, useProgress, useProgressHydrated } from "@/lib/progress";
import { sfx } from "@/lib/sound";
import { hasWebGL } from "@/lib/webgl";
import { cn } from "@/lib/utils";

const isPlanet = (p: string): p is Planet => p === "moon" || p === "mars";

export const Route = createFileRoute("/explore/$planet")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>): { memory?: string | undefined } => ({ memory: typeof s["memory"] === "string" ? s["memory"] : undefined }),
  beforeLoad: ({ params }) => {
    if (!isPlanet(params.planet)) throw notFound();
  },
  head: ({ params }) => {
    const moon = params.planet === "moon";
    const title = moon ? "Explore the Moon — CosmoSmriti" : "Explore Mars — CosmoSmriti";
    const description = moon
      ? "Walk a 3D lunar landscape and discover five Apollo artifacts left on the Moon between 1969 and 1972."
      : "Explore a 3D Martian landscape and discover five robotic explorers that landed between 1997 and 2008.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ExplorePage,
});

const REVEAL_MS = 1700;

function ExplorePage() {
  const { planet: rawPlanet } = Route.useParams();
  const planet = rawPlanet as Planet;
  const { memory } = Route.useSearch();
  const navigate = useNavigate();
  const hydrated = useProgressHydrated();

  const discovered = useProgress((s) => s.discovered);
  const hiddenFound = useProgress((s) => s.hidden);
  const discover = useProgress((s) => s.discover);
  const findHidden = useProgress((s) => s.findHidden);

  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [lowPower, setLowPower] = useState(false);
  const [wide, setWide] = useState(false);
  const [ready, setReady] = useState(false);
  const [fly, setFly] = useState<FlyRequest | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealing, setRevealing] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(true);
  const revealTimer = useRef<number | undefined>(undefined);
  const labelsRoot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWebgl(hasWebGL());
    setLowPower(window.matchMedia("(max-width: 768px), (pointer: coarse)").matches);
    const mq = window.matchMedia("(min-width: 768px)");
    const upd = () => setWide(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  useEffect(() => {
    setReady(false);
    setSelected(null);
    setRevealing(null);
  }, [planet]);

  const items = useMemo(
    () =>
      artifactsByPlanet(planet)
        .sort((a, b) => a.missionYear - b.missionYear || a.number - b.number)
        .map((a) => ({ artifact: a, xz: artifactWorldPos(planet, a.id, a.coordinates.lat, a.coordinates.lon) })),
    [planet],
  );
  const hidden = useMemo(() => hiddenMemories.filter((h) => h.planet === planet), [planet]);

  const flyTo = useCallback(
    (id: string, distance = 16) => {
      const it = items.find((i) => i.artifact.id === id);
      if (!it) return;
      setFly({ x: it.xz[0], z: it.xz[1], distance, nonce: Date.now() });
    },
    [items],
  );

  const handleSelect = useCallback(
    (id: string) => {
      const a = getArtifact(id);
      if (!a) return;
      flyTo(id);
      setShowHelp(false);
      if (useProgress.getState().discovered.includes(id)) {
        sfx.click();
        setSelected(id);
        return;
      }
      sfx.discover();
      setRevealing(id);
      setSelected(null);
      window.clearTimeout(revealTimer.current);
      revealTimer.current = window.setTimeout(
        () => {
          const isNew = useProgress.getState().discover(id);
          setRevealing(null);
          setSelected(id);
          if (isNew) toast.success(`Memory ${String(a.number).padStart(2, "0")} recovered: ${a.shortName}`, { description: "A new stamp was added to your Cosmic Passport." });
        },
        prefersReducedMotion() ? 50 : REVEAL_MS,
      );
    },
    [flyTo],
  );

  useEffect(() => () => window.clearTimeout(revealTimer.current), []);

  // Deep link: ?memory=<id> flies to the site (and opens it if already recovered)
  useEffect(() => {
    if (!hydrated || !ready || !memory) return;
    const a = getArtifact(memory);
    if (!a || a.planet !== planet) return;
    flyTo(memory);
    if (useProgress.getState().discovered.includes(memory)) setSelected(memory);
    void navigate({ to: "/explore/$planet", params: { planet }, search: { memory: undefined }, replace: true });
  }, [hydrated, ready, memory, planet, flyTo, navigate]);

  const onFindHidden = useCallback(
    (m: HiddenMemory) => {
      const isNew = findHidden(m.id);
      if (isNew) sfx.hidden();
      toast(m.title, { description: m.text, duration: 9000, icon: "✦" });
    },
    [findHidden],
  );

  const onReady = useCallback(() => setReady(true), []);

  const planetCount = countByPlanet(discovered, planet);
  const total = items.length;
  const meta = planetMeta[planet];
  const other = meta.other;
  const selectedArtifact = selected ? getArtifact(selected) : null;
  const revealingArtifact = revealing ? getArtifact(revealing) : null;
  const allCount = discovered.filter((d) => artifacts.some((a) => a.id === d)).length;

  return (
    <div className="fixed inset-0 overflow-hidden bg-ink" data-scene-ready={ready ? "true" : undefined}>
      {/* World */}
      <div className="absolute inset-0">
        {webgl === false ? (
          <WorldFallback planet={planet} items={items} discovered={discovered} onSelect={handleSelect} />
        ) : webgl ? (
          <CanvasBoundary fallback={<WorldFallback planet={planet} items={items} discovered={discovered} onSelect={handleSelect} />}>
            <WorldScene
              key={planet}
              planet={planet}
              artifacts={items}
              hidden={hidden}
              discovered={discovered}
              hiddenFound={hiddenFound}
              activeId={selected}
              revealingId={revealing}
              fly={fly}
              lowPower={lowPower}
              onSelect={handleSelect}
              onFindHidden={onFindHidden}
              onReady={onReady}
              labelsRoot={labelsRoot}
              shiftPx={selected && wide ? 300 : 0}
            />
          </CanvasBoundary>
        ) : null}
      </div>

      {/* 3D labels render into this layer, which sits exactly over the canvas */}
      <div ref={labelsRoot} className="pointer-events-none absolute inset-0 z-10 overflow-hidden" />

      {/* Loading veil */}
      <div className={cn("pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center bg-ink transition-opacity duration-1000", ready || webgl === false ? "opacity-0" : "opacity-100")} aria-hidden={ready}>
        <p className="eyebrow animate-pulse text-primary">Approaching {meta.name}</p>
        <p className="display mt-3 text-4xl">{meta.tagline}</p>
      </div>

      {/* Top HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3 md:p-5">
        <div className="pointer-events-auto flex items-center gap-2">
          <Button variant="hud" size="icon-lg" asChild aria-label="Back to home">
            <Link to="/"><ArrowLeft /></Link>
          </Button>
          <div className="panel hidden px-4 py-2 sm:block">
            <Wordmark className="text-xs" />
            <p className={cn("display text-xl", planet === "moon" ? "text-moon" : "text-mars")}>{meta.tagline}</p>
          </div>
        </div>
        <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2">
          <div className="panel flex items-center gap-3 px-4 py-2">
            <div className="min-w-[120px]">
              <p className="eyebrow">{meta.name} memories</p>
              <div className="mt-1 flex items-center gap-2">
                <Progress value={(planetCount / total) * 100} className="h-1.5 w-20 bg-secondary" />
                <span className="font-mono text-xs">{planetCount}/{total}</span>
              </div>
            </div>
            <div className="hidden border-l border-border pl-3 md:block">
              <p className="eyebrow">Total</p>
              <p className="font-mono text-xs">{allCount}/{artifacts.length} recovered · {artifacts.length - allCount} remaining</p>
            </div>
          </div>
          <Button variant={other === "moon" ? "moon" : "mars"} className="h-11" asChild>
            <Link to="/explore/$planet" params={{ planet: other }}>
              <Repeat /> <span className="hidden sm:inline">Go to {planetMeta[other].name}</span>
            </Link>
          </Button>
          <Button variant="hud" size="icon-lg" asChild aria-label="Memory Archive" title="Memory Archive">
            <Link to="/archive"><Archive /></Link>
          </Button>
          <Button variant="hud" size="icon-lg" asChild aria-label="Cosmic Passport" title="Cosmic Passport" className="hidden sm:inline-flex">
            <Link to="/passport"><BookMarked /></Link>
          </Button>
          <div className="hidden md:block"><SettingsToggles /></div>
          <MobileNav triggerClassName="md:hidden size-11" />
        </div>
      </div>

      {/* Help card */}
      {showHelp && ready && (
        <div className="panel animate-fade-up absolute left-3 top-24 z-20 max-w-xs p-4 text-sm md:left-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="eyebrow flex items-center gap-1 text-primary"><HelpCircle className="size-3" /> How to explore</p>
            <button type="button" onClick={() => setShowHelp(false)} aria-label="Close help" className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
          </div>
          <ul className="space-y-1.5 text-muted-foreground">
            <li>Click the glowing <span className="text-primary">signals</span> to recover memories.</li>
            <li>Drag to look around · scroll or pinch to zoom.</li>
            <li className="hidden md:flex md:items-center md:gap-1"><Keyboard className="size-3.5" /> W A S D or arrow keys to move.</li>
            <li>Small white sparkles hide extra secrets.</li>
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">Illustrative terrain. Sites are placed by their real coordinates, squeezed together so you can visit them all.</p>
        </div>
      )}

      {/* Chronological strip */}
      <nav aria-label="Memories in chronological order" className="absolute inset-x-0 bottom-0 z-20 flex justify-center p-3 md:p-5">
        <ol className="panel flex max-w-full gap-1 overflow-x-auto p-1.5">
          {items.map(({ artifact: a }) => {
            const found = discovered.includes(a.id);
            return (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => {
                    flyTo(a.id);
                    if (found) setSelected(a.id);
                    sfx.click();
                  }}
                  className={cn(
                    "flex min-h-11 items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-left text-xs transition-colors hover:bg-secondary",
                    selected === a.id && "bg-secondary",
                  )}
                >
                  <span className={cn("font-mono", found ? (planet === "moon" ? "text-moon" : "text-mars") : "text-primary")}>{a.missionYear}</span>
                  <span className={found ? "" : "text-muted-foreground"}>{found ? a.shortName : "Unknown"}</span>
                  {!found && <Locate className="size-3 text-muted-foreground" />}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Discovery sequence overlay */}
      {revealingArtifact && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center" role="status" aria-live="assertive">
          <div className="panel animate-fade-up relative overflow-hidden px-10 py-8 text-center">
            <div className="animate-scan absolute inset-x-0 top-0 h-full bg-gradient-to-b from-transparent via-primary/15 to-transparent" />
            <p className="eyebrow text-primary">Unknown memory detected</p>
            <p className="display mt-3 text-4xl">Decoding signal…</p>
            <p className="mt-2 font-mono text-sm text-muted-foreground">Memory {String(revealingArtifact.number).padStart(2, "0")} · {revealingArtifact.missionYear}</p>
          </div>
        </div>
      )}

      {/* Artifact panel */}
      {selectedArtifact && (
        <aside
          className="animate-fade-up absolute inset-y-0 right-0 z-40 flex w-full flex-col border-l border-border bg-background/95 backdrop-blur-xl md:w-[600px]"
          aria-label={`${selectedArtifact.shortName} details`}
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <p className="eyebrow text-primary">Memory recovered</p>
            <div className="flex items-center gap-2">
              <Button variant="hud" size="sm" asChild className="h-9">
                <Link to="/memory/$id" params={{ id: selectedArtifact.id }}>Full page</Link>
              </Button>
              <Button variant="hud" size="icon" onClick={() => setSelected(null)} aria-label="Close and return to the world">
                <X />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6 md:px-8">
            <ArtifactExperience a={selectedArtifact} compact />
          </div>
        </aside>
      )}
    </div>
  );
}
