import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { PageShell } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { eraEvents } from "@/data/extras";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Mission Time Machine — CosmoSmriti" },
      { name: "description", content: "Travel from 1959 to 2021 through the history of Moon and Mars exploration, connected to CosmoSmriti's ten featured artifacts." },
      { property: "og:title", content: "Mission Time Machine — CosmoSmriti" },
      { property: "og:description", content: "Scrub through six decades of Moon and Mars exploration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TimelinePage,
});

const YEARS = Array.from(new Set(eraEvents.map((e) => e.year))).sort((a, b) => a - b);

function TimelinePage() {
  const [i, setI] = useState(YEARS.indexOf(1969));
  const year = YEARS[i] ?? 1969;
  const events = useMemo(() => eraEvents.filter((e) => e.year === year), [year]);

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-8">
        <p className="eyebrow text-primary">Mission Time Machine</p>
        <h1 className="display mt-3 text-5xl md:text-7xl">Travel through time</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">Move the dial to explore how Moon and Mars exploration evolved. Starred events are memories you can discover in CosmoSmriti.</p>

        <div className="panel mt-10 p-6 md:p-10">
          <div className="flex items-center justify-between gap-4">
            <Button variant="hud" size="icon-lg" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0} aria-label="Previous year"><ChevronLeft /></Button>
            <p className="display text-signal-gradient text-7xl md:text-9xl" aria-live="polite">{year}</p>
            <Button variant="hud" size="icon-lg" onClick={() => setI((v) => Math.min(YEARS.length - 1, v + 1))} disabled={i === YEARS.length - 1} aria-label="Next year"><ChevronRight /></Button>
          </div>
          <Slider className="mt-8" min={0} max={YEARS.length - 1} step={1} value={[i]} onValueChange={(v) => setI(v[0] ?? 0)} aria-label="Choose a year" />
          <div className="mt-3 flex justify-between font-mono text-xs text-muted-foreground">
            {YEARS.map((y, k) => (
              <button key={y} type="button" onClick={() => setI(k)} className={cn("hidden px-0.5 hover:text-primary md:block", k === i && "text-primary")}>
                {y}
              </button>
            ))}
            <span className="md:hidden">{YEARS[0]}</span>
            <span className="md:hidden">{YEARS[YEARS.length - 1]}</span>
          </div>

          <ul key={year} className="mt-10 grid gap-4 md:grid-cols-2">
            {events.map((e, k) => (
              <li key={e.title} className={cn("animate-fade-up rounded-2xl border p-6", e.artifactId ? "border-primary/40 bg-primary/5" : "border-border")} style={{ animationDelay: `${k * 100}ms` }}>
                <div className="flex items-center gap-2">
                  <span className={cn("eyebrow", e.planet === "moon" ? "text-moon" : "text-mars")}>{e.planet === "moon" ? "Moon" : "Mars"}</span>
                  <span className="eyebrow">· {e.date}</span>
                  {e.artifactId && <Star className="size-3.5 fill-primary text-primary" aria-label="Featured memory" />}
                </div>
                <h2 className="display mt-2 text-3xl">{e.title}</h2>
                <p className="mt-2 text-muted-foreground">{e.text}</p>
                {e.artifactId && (
                  <Button variant="signal" size="sm" className="mt-4 h-9" asChild>
                    <Link to="/memory/$id" params={{ id: e.artifactId }}>Open this memory</Link>
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </div>

        <ol className="mt-14 grid gap-2 md:grid-cols-2">
          {eraEvents.map((e) => (
            <li key={e.title} className="flex gap-4 border-b border-border/60 py-3 text-sm">
              <span className="w-20 shrink-0 font-mono text-muted-foreground">{e.date}</span>
              <span className={cn("w-12 shrink-0", e.planet === "moon" ? "text-moon" : "text-mars")}>{e.planet === "moon" ? "Moon" : "Mars"}</span>
              <span className={e.artifactId ? "text-primary" : ""}>{e.title}</span>
            </li>
          ))}
        </ol>
      </section>
    </PageShell>
  );
}
