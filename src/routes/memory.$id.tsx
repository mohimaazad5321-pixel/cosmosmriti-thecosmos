import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Compass } from "lucide-react";
import { PageShell } from "@/components/layout/SiteHeader";
import { ArtifactExperience } from "@/components/artifact/ArtifactExperience";
import { Button } from "@/components/ui/button";
import { artifacts, getArtifact } from "@/data/artifacts";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/memory/$id")({
  loader: ({ params }) => {
    const artifact = getArtifact(params.id);
    if (!artifact) throw notFound();
    return { artifact };
  },
  head: ({ loaderData }) => {
    const a = loaderData?.artifact;
    if (!a) return { meta: [{ title: "Memory not found — CosmoSmriti" }] };
    const title = `${a.shortName} (${a.missionYear}) — CosmoSmriti`;
    return {
      meta: [
        { title },
        { name: "description", content: `${a.teaser} ${a.purpose}` },
        { property: "og:title", content: title },
        { property: "og:description", content: a.teaser },
        { property: "og:type", content: "article" },
        ...(a.images[0] ? [{ property: "og:image", content: a.images[0].url }, { name: "twitter:image", content: a.images[0].url }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="display text-5xl">This memory isn't in the archive</h1>
        <Button variant="signal" className="mt-8" asChild><Link to="/archive">Open the Memory Archive</Link></Button>
      </div>
    </PageShell>
  ),
  component: MemoryPage,
});

function MemoryPage() {
  const { artifact: a } = Route.useLoaderData();
  const found = useProgress((s) => s.discovered.includes(a.id));
  const idx = artifacts.findIndex((x) => x.id === a.id);
  const prev = artifacts[idx - 1];
  const next = artifacts[idx + 1];
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Button variant="hud" asChild className="h-10"><Link to="/archive"><ArrowLeft /> Memory Archive</Link></Button>
          <Button variant={a.planet === "moon" ? "moon" : "mars"} asChild className="h-10">
            <Link to="/explore/$planet" params={{ planet: a.planet }} search={{ memory: a.id }}>
              <Compass /> {found ? "See it in the 3D world" : "Find it in the 3D world"}
            </Link>
          </Button>
        </div>
        {!found && (
          <p className="mb-6 rounded-xl border border-primary/40 bg-primary/5 p-4 text-sm">
            You're reading this file before recovering it. Find its signal on {a.planet === "moon" ? "the Moon" : "Mars"} to earn its passport stamp.
          </p>
        )}
        <ArtifactExperience a={a} />
        <div className="mt-12 flex justify-between gap-4 border-t border-border pt-6 text-sm">
          {prev ? <Link to="/memory/$id" params={{ id: prev.id }} className="text-muted-foreground hover:text-primary">← {String(prev.number).padStart(2, "0")} {prev.shortName}</Link> : <span />}
          {next ? <Link to="/memory/$id" params={{ id: next.id }} className="text-muted-foreground hover:text-primary">{String(next.number).padStart(2, "0")} {next.shortName} →</Link> : <span />}
        </div>
      </div>
    </PageShell>
  );
}
