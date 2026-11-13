import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Box, Expand, ExternalLink, Layers, Minimize, Pause, Play, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CanvasBoundary } from "@/components/world/CanvasBoundary";
import { InspectScene, type Hotspot, type ModelSource } from "@/components/inspect/InspectScene";
import { getArtifact } from "@/data/artifacts";
import { NASA_MODELS } from "@/game/nasaModels";
import { prefersReducedMotion } from "@/lib/progress";
import { sfx } from "@/lib/sound";
import { hasWebGL } from "@/lib/webgl";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inspect/$id")({
  ssr: false,
  loader: ({ params }) => {
    const artifact = getArtifact(params.id);
    if (!artifact) throw notFound();
    return { artifact };
  },
  head: ({ loaderData }) => {
    const a = loaderData?.artifact;
    if (!a) return { meta: [{ title: "Model not found — CosmoSmriti" }] };
    const title = `Inspect ${a.shortName} in 3D — CosmoSmriti`;
    const description = `Rotate, zoom and take apart a 3D model of ${a.officialName}. Tap numbered markers to learn what each part did.`;
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
  notFoundComponent: () => (
    <div className="bg-space flex min-h-[100svh] flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="display text-4xl">There's no model for this memory</h1>
      <Button variant="signal" asChild><Link to="/archive">Open the Memory Archive</Link></Button>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div role="alert" className="bg-space flex min-h-[100svh] flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="display text-3xl">The 3D viewer couldn't start</h1>
      <p className="text-sm text-muted-foreground">{error instanceof Error ? error.message : String(error)}</p>
      <Button variant="hud" asChild><Link to="/archive">Back to the archive</Link></Button>
    </div>
  ),
  component: InspectPage,
});

function InspectPage() {
  const { artifact: a } = Route.useLoaderData();
  const nasa = a.reconstruction.nasaModel;
  const root = useRef<HTMLDivElement>(null);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [source, setSource] = useState<ModelSource>(nasa ? "nasa" : "reconstruction");
  const [descentOnly, setDescentOnly] = useState(nasa?.descentStageOnly ?? false);
  const [explode, setExplode] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [resetNonce, setResetNonce] = useState(0);
  const [ready, setReady] = useState(false);
  const [framedHeight, setFramedHeight] = useState(0);
  const [fsAvailable, setFsAvailable] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    setWebgl(hasWebGL());
    const r = prefersReducedMotion();
    setReduced(r);
    setAutoRotate(!r);
    setFsAvailable(!!document.fullscreenEnabled);
    const onFs = () => setFullscreen(document.fullscreenElement === root.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const usingNasa = source === "nasa" && !!nasa;
  const hotspots = useMemo<Hotspot[]>(
    () =>
      a.components.flatMap((c, index) => {
        const at = usingNasa ? c.nasaAnchor : c.anchor;
        return at ? [{ index, name: c.name, at }] : [];
      }),
    [a, usingNasa],
  );

  const onSelect = useCallback((i: number | null) => {
    setSelected(i);
    if (i !== null) sfx.click();
  }, []);
  const onReady = useCallback(() => setReady(true), []);

  const switchSource = (s: ModelSource) => {
    if (s === source) return;
    setSource(s);
    setSelected(null);
    setFramedHeight(0);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void root.current?.requestFullscreen().catch(() => setFsAvailable(false));
  };

  const part = selected !== null ? a.components[selected] : null;
  const partShown = selected !== null && hotspots.some((h) => h.index === selected);
  const meta = nasa ? NASA_MODELS[nasa.id] : null;
  const accent = a.planet === "moon" ? "text-moon" : "text-mars";

  return (
    <div ref={root} className="fixed inset-0 flex flex-col bg-ink md:flex-row" data-scene-ready={ready ? "true" : undefined}>
      {/* Viewer */}
      <div className="relative min-h-0 flex-1">
        {webgl === false ? (
          <NoWebGL id={a.id} />
        ) : webgl ? (
          <CanvasBoundary fallback={<NoWebGL id={a.id} />}>
            <InspectScene
              artifact={a}
              source={source}
              descentStageOnly={descentOnly}
              explode={explode}
              autoRotate={autoRotate}
              reducedMotion={reduced}
              hotspots={hotspots}
              selected={selected}
              onSelect={onSelect}
              resetNonce={resetNonce}
              onReady={onReady}
              framedHeight={framedHeight}
              setFramedHeight={setFramedHeight}
            />
          </CanvasBoundary>
        ) : null}

        {webgl && framedHeight === 0 && (
          <p className="hud-chip pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" role="status">
            {usingNasa ? "Loading NASA model…" : "Building model…"}
          </p>
        )}

        {/* top bar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start gap-2 p-3 md:p-5">
          <Button variant="hud" size="icon-lg" asChild aria-label="Back to the memory" className="pointer-events-auto shrink-0">
            <Link to="/memory/$id" params={{ id: a.id }}><ArrowLeft /></Link>
          </Button>
          <div className="panel pointer-events-auto min-w-0 px-4 py-2">
            <p className="eyebrow text-primary">3D inspection · Memory {String(a.number).padStart(2, "0")}</p>
            <h1 className={cn("display truncate text-xl md:text-2xl", accent)}>{a.shortName}</h1>
          </div>
        </div>

        {/* controls */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-3 md:p-5">
          <div className="panel pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-2 p-2">
            {nasa && (
              <div role="group" aria-label="Which model" className="flex rounded-full border border-border p-0.5">
                <ToggleChip active={source === "nasa"} onClick={() => switchSource("nasa")}>NASA model</ToggleChip>
                <ToggleChip active={source === "reconstruction"} onClick={() => switchSource("reconstruction")}>Reconstruction</ToggleChip>
              </div>
            )}
            {usingNasa && nasa?.descentStageOnly && (
              <ToggleChip active={!descentOnly} onClick={() => { setDescentOnly((d) => !d); setSelected(null); setFramedHeight(0); }} title="Show the full lunar module as it landed">
                <Layers className="size-3.5" /> {descentOnly ? "Show as it landed" : "Show what stayed"}
              </ToggleChip>
            )}
            <label className="flex min-h-11 items-center gap-2 rounded-full px-3 text-xs">
              <span className="eyebrow">Take apart</span>
              <Slider value={[Math.round(explode * 100)]} onValueChange={(v) => setExplode((v[0] ?? 0) / 100)} max={100} step={5} className="w-24 md:w-32" aria-label="Exploded view amount" />
            </label>
            <Button variant="hud" size="icon-lg" onClick={() => setAutoRotate((r) => !r)} aria-label={autoRotate ? "Stop turning" : "Turn slowly"} aria-pressed={autoRotate} title={autoRotate ? "Stop turning" : "Turn slowly"}>
              {autoRotate ? <Pause /> : <Play />}
            </Button>
            <Button variant="hud" size="icon-lg" onClick={() => { setResetNonce((n) => n + 1); setExplode(0); }} aria-label="Reset view" title="Reset view">
              <RotateCcw />
            </Button>
            {fsAvailable && (
              <Button variant="hud" size="icon-lg" onClick={toggleFullscreen} aria-label={fullscreen ? "Exit full screen" : "Full screen"} title={fullscreen ? "Exit full screen" : "Full screen"}>
                {fullscreen ? <Minimize /> : <Expand />}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Panel */}
      <aside className="max-h-[42svh] shrink-0 overflow-y-auto border-t border-border bg-background/95 p-5 md:max-h-none md:w-[380px] md:border-l md:border-t-0" aria-label="Parts and model details">
        <section aria-live="polite" className="min-h-[96px]">
          {part ? (
            <div className="animate-fade-up">
              <p className="eyebrow text-primary">Part {selected! + 1}</p>
              <h2 className="display mt-1 text-3xl">{part.name}</h2>
              {!partShown && <p className="mt-1 text-xs text-muted-foreground">Not shown as a separate part in this model.</p>}
              <dl className="mt-3 space-y-2 text-sm">
                <div><dt className="eyebrow">Purpose</dt><dd>{part.purpose}</dd></div>
                <div><dt className="eyebrow">How it worked</dt><dd className="text-muted-foreground">{part.how}</dd></div>
                <div><dt className="eyebrow text-primary">Simply put</dt><dd>{part.kid}</dd></div>
              </dl>
            </div>
          ) : (
            <div>
              <p className="eyebrow">How to inspect</p>
              <p className="mt-2 text-sm text-muted-foreground">Drag to turn all the way around, pinch or scroll to zoom. Tap a numbered marker, or a part below, to learn what it did. Slide “Take apart” for an exploded view.</p>
            </div>
          )}
        </section>

        <h3 className="eyebrow mb-2 mt-6">Parts</h3>
        <ol className="space-y-1.5">
          {a.components.map((c, i) => {
            const shown = hotspots.some((h) => h.index === i);
            return (
              <li key={c.name}>
                <button
                  type="button"
                  onClick={() => onSelect(selected === i ? null : i)}
                  aria-pressed={selected === i}
                  className={cn("flex min-h-11 w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition-colors", selected === i ? "border-primary/60 bg-primary/10" : "border-border hover:border-primary/40")}
                >
                  <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-xs", shown ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground")}>{i + 1}</span>
                  <span className="flex-1">{c.name}</span>
                  {!shown && <span className="text-[10px] uppercase tracking-wider text-muted-foreground">not marked</span>}
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 rounded-xl border border-dashed border-border p-4 text-xs leading-relaxed text-muted-foreground">
          {usingNasa && meta && nasa ? (
            <>
              <p className="flex items-center gap-1.5 font-medium text-foreground"><ShieldCheck className="size-4 text-success" /> Authentic NASA 3D model</p>
              <p className="mt-1">“{meta.title}” from NASA 3D Resources · {meta.credit}.</p>
              <p className="mt-1">{nasa.note}</p>
              {nasa.descentStageOnly && <p className="mt-1">{descentOnly ? "Showing only the descent stage, the part that stayed." : "Showing the whole lunar module as it landed; the top half later lifted off."}</p>}
              <a href={meta.pageUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-primary hover:underline">Model page on NASA Science <ExternalLink className="size-3" /></a>
            </>
          ) : (
            <>
              <p className="flex items-center gap-1.5 font-medium text-foreground"><Box className="size-4" /> Educational reconstruction</p>
              <p className="mt-1">Built from simple shapes by CosmoSmriti to show the overall form and main parts. It is not an authentic NASA model, and sizes and details are approximate.</p>
              {nasa && <p className="mt-1">Switch to “NASA model” to see NASA's own 3D model.</p>}
            </>
          )}
        </div>
        <Button variant="hud" asChild className="mt-4 h-10 w-full">
          <Link to="/memory/$id" params={{ id: a.id }}>Read the full story</Link>
        </Button>
      </aside>
    </div>
  );
}

function ToggleChip({ active, onClick, children, title }: { active: boolean; onClick: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={title}
      className={cn(
        "inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function NoWebGL({ id }: { id: string }) {
  return (
    <div className="bg-space flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="display text-3xl">3D isn't available on this device</p>
      <p className="max-w-sm text-sm text-muted-foreground">You can still explore every part in the list, and read about them in the memory's Parts tab.</p>
      <Button variant="hud" asChild><Link to="/memory/$id" params={{ id }}>Back to the memory</Link></Button>
    </div>
  );
}
