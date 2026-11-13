import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Compass, FileText, Lock } from "lucide-react";
import { PageShell } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { artifacts, statusLabel } from "@/data/artifacts";
import type { Planet } from "@/data/types";
import { useProgress, useProgressHydrated } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/archive")({
  head: () => ({
    meta: [
      { title: "Memory Archive — CosmoSmriti" },
      { name: "description", content: "Revisit all ten artifacts on the Moon and Mars: photos, mission years, discovery status and source references." },
      { property: "og:title", content: "Memory Archive — CosmoSmriti" },
      { property: "og:description", content: "Ten memories, two worlds: the central archive of CosmoSmriti." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArchivePage,
});

function ArchivePage() {
  const hydrated = useProgressHydrated();
  const discovered = useProgress((s) => s.discovered);
  const [filter, setFilter] = useState<"all" | Planet>("all");
  const [onlyFound, setOnlyFound] = useState(false);
  const list = artifacts
    .filter((a) => filter === "all" || a.planet === filter)
    .filter((a) => !onlyFound || discovered.includes(a.id))
    .sort((a, b) => a.missionYear - b.missionYear || a.number - b.number);
  const count = discovered.filter((d) => artifacts.some((a) => a.id === d)).length;

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <p className="eyebrow text-primary">Memory Archive</p>
        <h1 className="display mt-3 text-5xl md:text-7xl">Ten memories. Two worlds.</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Every artifact in CosmoSmriti, in the order humanity left them. {hydrated && <span className="text-foreground">You've recovered {count} of {artifacts.length}.</span>}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {(["all", "moon", "mars"] as const).map((f) => (
            <Button key={f} variant={filter === f ? "signal" : "hud"} className="h-10" onClick={() => setFilter(f)} aria-pressed={filter === f}>
              {f === "all" ? "All" : f === "moon" ? "The Moon" : "Mars"}
            </Button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <Switch id="only-found" checked={onlyFound} onCheckedChange={setOnlyFound} />
            <Label htmlFor="only-found" className="text-sm text-muted-foreground">Recovered only</Label>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="display text-3xl">No memories recovered here yet</p>
            <p className="mt-2 text-muted-foreground">Head into a world and follow the glowing signals.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="moon" asChild><Link to="/explore/$planet" params={{ planet: "moon" }}>Explore the Moon</Link></Button>
              <Button variant="mars" asChild><Link to="/explore/$planet" params={{ planet: "mars" }}>Explore Mars</Link></Button>
            </div>
          </div>
        ) : (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((a) => {
              const found = discovered.includes(a.id);
              return (
                <li key={a.id} className={cn("group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-colors", found ? "border-border hover:border-primary/50" : "border-dashed border-border")}>
                  <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                    <img
                      src={a.images[0]?.url}
                      alt={found ? (a.images[0]?.caption ?? a.shortName) : "Unrecovered memory"}
                      loading="lazy"
                      className={cn("h-full w-full object-cover transition-all duration-700", found ? "group-hover:scale-105" : "scale-110 opacity-25 blur-md grayscale")}
                    />
                    <span className={cn("hud-chip absolute left-3 top-3", a.planet === "moon" ? "text-moon" : "text-mars")}>
                      {String(a.number).padStart(2, "0")} · {a.planet === "moon" ? "Moon" : "Mars"} · {a.missionYear}
                    </span>
                    {!found && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="hud-chip text-primary"><Lock className="size-3" /> Not yet recovered</span>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="display text-2xl">{found ? a.shortName : `Unknown ${a.category.toLowerCase()}`}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{found ? a.teaser : `${a.missionName} · ${a.missionYear}`}</p>
                    {found && <p className="mt-2 text-xs text-primary">{statusLabel[a.status]} · {a.sources.length} sources</p>}
                    <div className="mt-auto flex flex-wrap gap-2 pt-5">
                      {!found && (
                        <Button variant={a.planet === "moon" ? "moon" : "mars"} size="sm" className="h-9" asChild>
                          <Link to="/explore/$planet" params={{ planet: a.planet }} search={{ memory: a.id }}><Compass /> Find it</Link>
                        </Button>
                      )}
                      <Button variant={found ? "signal" : "hud"} size="sm" className="h-9" asChild>
                        <Link to="/memory/$id" params={{ id: a.id }}><FileText /> {found ? "Open story" : "Read the file"}</Link>
                      </Button>
                      {found && (
                        <Button variant="hud" size="sm" className="h-9" asChild>
                          <Link to="/explore/$planet" params={{ planet: a.planet }} search={{ memory: a.id }}><Compass /> In 3D</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </PageShell>
  );
}
