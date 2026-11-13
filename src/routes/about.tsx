import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { PageShell } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { dataServices } from "@/data/sources";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About CosmoSmriti — Why Forgotten Space Memories Matter" },
      { name: "description", content: "The mission behind CosmoSmriti, how it uses NASA sources, and why the equipment humanity left on the Moon and Mars deserves to be remembered." },
      { property: "og:title", content: "About CosmoSmriti" },
      { property: "og:description", content: "Ten memories. Two worlds. One human story." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const SECTIONS = [
  { h: "Our mission", p: "CosmoSmriti combines the Bengali word smriti, meaning memory, with cosmos. It preserves and tells the stories of human-made equipment left on the Moon and Mars, so that visitors don't just read about a spacecraft: they discover it." },
  { h: "Why left-behind equipment matters", p: "Every descent stage, instrument and rover marks a moment when people solved a hard problem far from home. These objects are historical sites. Remembering why they were sent, and what they achieved, connects today's explorers with those who came before." },
  { h: "Historical equipment, not working spacecraft", p: "The ten artifacts here are inactive. Some were left behind by design, some are instrument collections that were switched off, and some are robotic explorers that fell silent. CosmoSmriti explains which is which for each one. They are different from spacecraft operating today." },
  { h: "How we use sources", p: "Dates, coordinates, figures and photographs come from NASA mission pages, the NASA Space Science Data Coordinated Archive, the Apollo Lunar Surface Journal and the NASA Image and Video Library. Each memory has an Evidence tab linking to them. Narrative wording, kid-friendly explanations and 3D reconstructions are created by CosmoSmriti and labelled as such." },
  { h: "About the 3D worlds", p: "The landscapes are illustrative, generated to feel like the Moon and Mars. Artifact sites are placed using their published coordinates, projected and compressed so every site fits in one explorable area. Coordinates are marked as measured from orbit or approximate. The objects are simplified educational reconstructions, not authentic NASA models." },
];

function AboutPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-4 py-14 md:px-8">
        <p className="eyebrow text-primary">About CosmoSmriti</p>
        <h1 className="display mt-3 text-5xl md:text-7xl">Humanity explored other worlds.</h1>
        <p className="display mt-2 text-3xl italic text-muted-foreground md:text-4xl">Some of its greatest creations remained there.</p>

        <div className="mt-14 space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.h} className="grid gap-3 md:grid-cols-[220px_1fr]">
              <h2 className="eyebrow pt-1 text-foreground">{s.h}</h2>
              <p className="text-lg leading-relaxed text-foreground/85">{s.p}</p>
            </section>
          ))}
        </div>

        <section className="mt-16">
          <h2 className="eyebrow mb-4 text-foreground">Data services & archives referenced</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {dataServices.map((d) => (
              <li key={d.url}>
                <a href={d.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 rounded-xl border border-border p-4 text-sm hover:border-primary/60">
                  <span><span className="block font-medium">{d.label}</span><span className="text-xs text-muted-foreground">{d.publisher}</span></span>
                  <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 rounded-xl border border-border bg-secondary/40 p-5 text-sm text-muted-foreground">
          CosmoSmriti is an independent educational project created for the NASA Space Apps Challenge. It is not affiliated with, sponsored by or endorsed by NASA. NASA images are used under NASA's media usage guidelines.
        </p>

        <div className="my-24 text-center">
          <p className="wordmark text-sm text-muted-foreground">Ten memories.</p>
          <p className="wordmark mt-2 text-sm text-muted-foreground">Two worlds.</p>
          <p className="wordmark mt-2 text-sm text-muted-foreground">One human story.</p>
          <p className="display mt-10 text-5xl md:text-7xl">The universe never forgets.</p>
          <p className="display text-signal-gradient mt-2 text-5xl italic md:text-7xl">Now, neither will we.</p>
          <div className="mt-10 flex justify-center gap-3">
            <Button variant="moon" size="xl" asChild><Link to="/explore/$planet" params={{ planet: "moon" }}>Explore the Moon</Link></Button>
            <Button variant="mars" size="xl" asChild><Link to="/explore/$planet" params={{ planet: "mars" }}>Explore Mars</Link></Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
