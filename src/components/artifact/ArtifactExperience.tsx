import { Link } from "@tanstack/react-router";
import { ExternalLink, MapPin, Info, Radio, AlertTriangle, BookOpen, Baby, FlaskConical, Puzzle, Sparkles, Clock, History, ShieldCheck, Box, Rotate3d, Map as MapIcon } from "lucide-react";
import { TrekMap } from "@/components/map/TrekMap";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { Artifact } from "@/data/types";
import { artifactsByPlanet, statusLabel } from "@/data/artifacts";
import { NASA_MODELS } from "@/game/nasaModels";
import { cn } from "@/lib/utils";
import { FlipCard } from "./FlipCard";
import { NasaFigure } from "./NasaFigure";

const TABS = [
  { v: "story", label: "The Story", icon: BookOpen },
  { v: "eli10", label: "Like I'm 10", icon: Baby },
  { v: "scientist", label: "Scientist", icon: FlaskConical },
  { v: "parts", label: "Parts", icon: Puzzle },
  { v: "facts", label: "Did you know?", icon: Sparkles },
  { v: "timeline", label: "Timeline", icon: Clock },
  { v: "thennow", label: "Then vs Now", icon: History },
  { v: "map", label: "Real map", icon: MapIcon },
  { v: "signal", label: "Last Signal", icon: Radio },
  { v: "evidence", label: "Evidence", icon: ShieldCheck },
] as const;

export function fmtCoord(lat: number, lon: number) {
  const la = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}`;
  const lo = `${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? "E" : "W"}`;
  return `${la}, ${lo}`;
}

export function ArtifactHeader({ a }: { a: Artifact }) {
  const accent = a.planet === "moon" ? "text-moon" : "text-mars";
  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="eyebrow text-primary">Memory {String(a.number).padStart(2, "0")}</span>
        <span className={cn("eyebrow", accent)}>· {a.planet === "moon" ? "The Moon" : "Mars"}</span>
        <span className="eyebrow">· {a.missionYear}</span>
      </div>
      <h2 className="display text-4xl md:text-5xl">{a.officialName}</h2>
      <p className="text-muted-foreground">{a.purpose}</p>
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="rounded-full border-border px-3 py-1 font-normal">{a.missionName}</Badge>
        <Badge variant="outline" className="rounded-full border-border px-3 py-1 font-normal">{a.category}</Badge>
        <Badge variant="outline" className="rounded-full border-primary/50 px-3 py-1 font-normal text-primary">{statusLabel[a.status]}</Badge>
      </div>
      <div className="grid gap-3 rounded-xl border border-border bg-secondary/40 p-4 text-sm sm:grid-cols-2">
        <div>
          <p className="eyebrow mb-1 flex items-center gap-1"><MapPin className="size-3" /> Location</p>
          <p>{a.landingSite}</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{fmtCoord(a.coordinates.lat, a.coordinates.lon)}</p>
          <p className="mt-1 text-xs">
            <span className={cn("rounded-full px-2 py-0.5", a.coordinateAccuracy === "orbital-measured" ? "bg-success/15 text-success" : "bg-primary/15 text-primary")}>
              {a.coordinateAccuracy === "orbital-measured" ? "Measured from orbit" : "Approximate · landing site"}
            </span>
          </p>
        </div>
        <div>
          <p className="eyebrow mb-1 flex items-center gap-1"><Info className="size-3" /> Why it's still there</p>
          <p className="text-muted-foreground">{a.statusExplanation}</p>
        </div>
        <p className="text-xs text-muted-foreground sm:col-span-2">{a.coordinateNote}</p>
      </div>
    </header>
  );
}

/** Says exactly what the 3D object is: NASA's own model or a CosmoSmriti reconstruction. */
function ModelProvenance({ a }: { a: Artifact }) {
  const nasa = a.reconstruction.nasaModel;
  const meta = nasa ? NASA_MODELS[nasa.id] : null;
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border p-4 text-xs text-muted-foreground sm:flex-row sm:items-center">
      <p className="flex flex-1 items-start gap-2">
        {nasa && meta ? (
          <>
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
            <span>
              The 3D object is NASA's own model, “{meta.title}” from NASA 3D Resources ({meta.credit}). {nasa.note} On low-power devices the 3D world shows a simplified CosmoSmriti reconstruction instead. Photos below are original NASA images.
            </span>
          </>
        ) : (
          <>
            <Box className="mt-0.5 size-4 shrink-0" />
            <span>The 3D object is an educational reconstruction built for CosmoSmriti. It is not an authentic NASA model; NASA 3D Resources has no model of this artifact. Photos below are original NASA images.</span>
          </>
        )}
      </p>
      <Button variant="signal" size="sm" asChild className="h-10 shrink-0 px-5">
        <Link to="/inspect/$id" params={{ id: a.id }}><Rotate3d /> Inspect in 3D</Link>
      </Button>
    </div>
  );
}

export function ArtifactExperience({ a, compact = false }: { a: Artifact; compact?: boolean }) {
  const accent: "moon" | "mars" = a.planet;
  return (
    <div className="space-y-6">
      <ArtifactHeader a={a} />
      <ModelProvenance a={a} />

      <Tabs defaultValue="story" className="w-full">
        <div className="-mx-1 overflow-x-auto pb-1">
          <TabsList className="h-auto gap-1 rounded-full bg-secondary/60 p-1">
            {TABS.map((t) => (
              <TabsTrigger key={t.v} value={t.v} className="gap-1.5 rounded-full px-3 py-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground md:text-sm">
                <t.icon className="size-3.5" /> {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="story" className="mt-6 space-y-6">
          {a.images[0] && <NasaFigure image={a.images[0]} eager />}
          <ol className="relative space-y-6 border-l border-border pl-6">
            {a.story.map((s, i) => (
              <li key={s.heading} className="animate-fade-up" style={{ animationDelay: `${i * 120}ms` }}>
                <span className="absolute -left-[7px] mt-1.5 size-3 rounded-full bg-primary" />
                <h3 className="display text-2xl">{s.heading}</h3>
                <div className="prose-museum mt-2"><p>{s.text}</p></div>
              </li>
            ))}
          </ol>
          {a.images[1] && <NasaFigure image={a.images[1]} />}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
            <p className="eyebrow mb-2 text-primary">Why it matters</p>
            <p className="text-sm leading-relaxed">{a.scientificContribution}</p>
          </div>
        </TabsContent>

        <TabsContent value="eli10" className="mt-6 space-y-5">
          <div className={cn("rounded-2xl border p-6", accent === "moon" ? "border-moon/30 bg-moon/5" : "border-mars/40 bg-mars/10")}>
            <p className="eyebrow mb-3">Explain like I'm 10</p>
            <div className="space-y-4 text-lg leading-relaxed">
              {a.eli10.paragraphs.map((p) => <p key={p}>{p}</p>)}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border p-4">
              <p className="eyebrow mb-2">Think of it like…</p>
              <p>{a.eli10.comparison}</p>
            </div>
            <div className="rounded-xl border border-primary/40 bg-primary/5 p-4">
              <p className="eyebrow mb-2 text-primary">Your turn to wonder</p>
              <p>{a.eli10.question}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scientist" className="mt-6 space-y-4">
          {a.scientist.map((s) => (
            <section key={s.heading} className="rounded-xl border border-border p-5">
              <h3 className="font-mono text-sm uppercase tracking-widest text-primary">{s.heading}</h3>
              <p className="mt-2 leading-relaxed text-foreground/90">{s.text}</p>
            </section>
          ))}
          <p className="text-xs text-muted-foreground">Technical details summarised from the references in the Evidence tab.</p>
        </TabsContent>

        <TabsContent value="parts" className="mt-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">Tap a part to learn what it did.</p>
            <Button variant="hud" size="sm" asChild className="h-9 px-4">
              <Link to="/inspect/$id" params={{ id: a.id }}><Rotate3d /> See the parts in 3D</Link>
            </Button>
          </div>
          <div className={cn("grid gap-3", compact ? "" : "sm:grid-cols-2")}>
            {a.components.map((c, i) => (
              <details key={c.name} className="group rounded-xl border border-border bg-secondary/30 p-4 open:border-primary/50 open:bg-primary/5">
                <summary className="flex cursor-pointer list-none items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/15 font-mono text-xs text-primary">{i + 1}</span>
                  <span className="font-semibold">{c.name}</span>
                </summary>
                <dl className="mt-3 space-y-2 text-sm">
                  <div><dt className="eyebrow">Purpose</dt><dd>{c.purpose}</dd></div>
                  <div><dt className="eyebrow">How it worked</dt><dd className="text-muted-foreground">{c.how}</dd></div>
                  <div><dt className="eyebrow text-primary">Simply put</dt><dd>{c.kid}</dd></div>
                </dl>
              </details>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="facts" className="mt-6">
          <div className={cn("grid gap-4", compact ? "" : "sm:grid-cols-3")}>
            {a.didYouKnow.map((f) => <FlipCard key={f.front} front={f.front} back={f.back} accent={accent} />)}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <ol className="relative space-y-0">
            {a.timeline.map((e, i) => (
              <li key={i} className="relative grid grid-cols-[96px_1fr] gap-4 pb-6">
                <span className="pt-0.5 text-right font-mono text-xs text-muted-foreground">{e.date}</span>
                <div className="relative border-l border-border pl-5">
                  <span className={cn("absolute -left-[6px] top-1 size-[11px] rounded-full border-2", accent === "moon" ? "border-moon bg-background" : "border-mars bg-background")} />
                  <p className="font-semibold">{e.label}</p>
                  {e.detail && <p className="text-sm text-muted-foreground">{e.detail}</p>}
                </div>
              </li>
            ))}
          </ol>
        </TabsContent>

        <TabsContent value="thennow" className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="eyebrow mb-2">Then</p>
              <NasaFigure image={a.thenNow.then} />
            </div>
            <div>
              <p className="eyebrow mb-2">Later</p>
              {a.thenNow.now ? (
                <NasaFigure image={a.thenNow.now} imgClassName="object-contain" />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No verified later image included yet. We won't show an unrelated picture in its place.
                </div>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm">
            <p className="eyebrow mb-1">What changed / viewpoint</p>
            <p>{a.thenNow.changed}</p>
            <p className="eyebrow mb-1 mt-3">What is known today</p>
            <p>{a.thenNow.knownToday}</p>
          </div>
        </TabsContent>

        <TabsContent value="map" className="mt-6 space-y-3">
          <TrekMap
            planet={a.planet}
            center={a.coordinates}
            zoom={a.planet === "moon" ? 5 : 4}
            className="h-[340px]"
            label={`NASA map around ${a.landingSite}`}
            markers={artifactsByPlanet(a.planet).map((o) => ({
              id: o.id,
              lat: o.coordinates.lat,
              lon: o.coordinates.lon,
              label: o.shortName,
              emphasis: o.id === a.id,
            }))}
          />
          <p className="text-xs text-muted-foreground">
            The marker sits at the published {a.coordinateAccuracy === "orbital-measured" ? "position measured from orbit" : "landing-site coordinate"} ({fmtCoord(a.coordinates.lat, a.coordinates.lon)}). Unlike the 3D world, distances on this map are real. The hardware itself is far too small to see at these zoom levels.
          </p>
        </TabsContent>

        <TabsContent value="signal" className="mt-6 space-y-4">
          <div className={cn("relative overflow-hidden rounded-2xl border p-6", a.lastSignal.available ? "border-primary/40 bg-primary/5" : "border-border")}>
            <p className="eyebrow mb-2 flex items-center gap-2"><Radio className="size-3" /> Last documented signal or event</p>
            <p className="display text-4xl">{a.lastSignal.available ? a.lastSignal.date : "No final signal"}</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div><dt className="eyebrow">Context</dt><dd>{a.lastSignal.context}</dd></div>
              <div><dt className="eyebrow">What happened</dt><dd>{a.lastSignal.whatHappened}</dd></div>
              <div><dt className="eyebrow">Afterward</dt><dd>{a.lastSignal.afterward}</dd></div>
            </dl>
          </div>
          {a.lastSignal.myth && (
            <p className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <span><strong>Myth check:</strong> {a.lastSignal.myth}</span>
            </p>
          )}
          <p className="text-xs text-muted-foreground">CosmoSmriti never invents dramatic final messages. Dates come from the sources in the Evidence tab.</p>
        </TabsContent>

        <TabsContent value="evidence" className="mt-6 space-y-4">
          <ul className="space-y-2">
            {a.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer" className="group flex items-start justify-between gap-3 rounded-xl border border-border p-4 hover:border-primary/60">
                  <span>
                    <span className="block font-medium group-hover:text-primary">{s.label}</span>
                    <span className="text-xs text-muted-foreground">{s.publisher} · {s.kind === "nasa" ? "NASA source" : "NASA archive"}</span>
                  </span>
                  <ExternalLink className="mt-1 size-4 shrink-0 text-muted-foreground" />
                </a>
              </li>
            ))}
            {a.images.map((img) => (
              <li key={img.nasaId} className="text-xs text-muted-foreground">
                Photo {img.nasaId}: NASA Image and Video Library · {img.credit}
              </li>
            ))}
          </ul>
          <div className="rounded-xl border border-border bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
            <p><strong className="text-foreground">From NASA sources:</strong> dates, coordinates, mission facts, figures and photos.</p>
            <p className="mt-1"><strong className="text-foreground">Written by CosmoSmriti:</strong> the narrative wording, child-friendly explanations, comparisons, questions and 3D reconstructions.</p>
            <p className="mt-1">CosmoSmriti is an independent educational project and is not endorsed by NASA.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
