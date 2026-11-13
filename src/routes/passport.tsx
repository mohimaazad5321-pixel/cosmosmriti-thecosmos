import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Lock, RotateCcw } from "lucide-react";
import { PageShell } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { artifacts } from "@/data/artifacts";
import { detectiveCases, hiddenMemories } from "@/data/extras";
import { computeAchievements, countByPlanet, totalByPlanet } from "@/lib/achievements";
import { useProgress, useProgressHydrated } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/passport")({
  head: () => ({
    meta: [
      { title: "Cosmic Memory Passport — CosmoSmriti" },
      { name: "description", content: "Your digital exploration passport: stamps for every memory recovered on the Moon and Mars, plus achievements." },
      { property: "og:title", content: "Cosmic Memory Passport — CosmoSmriti" },
      { property: "og:description", content: "Collect a stamp for every artifact you discover on the Moon and Mars." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PassportPage,
});

function PassportPage() {
  const hydrated = useProgressHydrated();
  const s = useProgress();
  const achievements = computeAchievements(s);
  const moon = countByPlanet(s.discovered, "moon");
  const mars = countByPlanet(s.discovered, "mars");
  const challengesDone = s.detectiveSolved.length + (s.quizBest !== null ? 1 : 0);

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          {/* passport cover */}
          <div className="panel relative h-fit overflow-hidden p-7">
            <div className="absolute -right-16 -top-16 size-48 rounded-full border border-primary/20" />
            <div className="absolute -right-8 -top-8 size-32 rounded-full border border-primary/30" />
            <p className="eyebrow text-primary">Cosmic Memory Passport</p>
            <p className="wordmark mt-2 text-sm">Cosmo<span className="text-primary">smriti</span></p>
            <label htmlFor="explorer" className="eyebrow mt-8 block">Explorer name</label>
            <Input id="explorer" value={s.explorerName} placeholder="Your name (saved only on this device)" onChange={(e) => s.setExplorerName(e.target.value)} className="mt-2 border-border bg-secondary/50" />
            <dl className="mt-8 grid grid-cols-2 gap-4">
              <Stat label="Moon" value={`${moon}/${totalByPlanet("moon")}`} className="text-moon" />
              <Stat label="Mars" value={`${mars}/${totalByPlanet("mars")}`} className="text-mars" />
              <Stat label="Memories" value={`${moon + mars}/${artifacts.length}`} className="text-primary" />
              <Stat label="Hidden" value={`${s.hidden.length}/${hiddenMemories.length}`} />
              <Stat label="Challenges" value={`${challengesDone}/${detectiveCases.length + 1}`} />
              <Stat label="Quiz best" value={s.quizBest === null ? "—" : `${s.quizBest}/10`} />
            </dl>
            <p className="mt-6 text-xs text-muted-foreground">No account needed. Progress is stored anonymously in this browser.</p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="mt-3 px-0 text-muted-foreground hover:bg-transparent hover:text-destructive"><RotateCcw /> Restart exploration</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-border bg-card">
                <AlertDialogHeader>
                  <AlertDialogTitle>Restart your exploration?</AlertDialogTitle>
                  <AlertDialogDescription>This clears all stamps, hidden memories, quiz scores and solved cases on this device.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep my progress</AlertDialogCancel>
                  <AlertDialogAction onClick={() => s.reset()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Restart</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* stamps */}
          <div>
            <h1 className="display text-5xl md:text-6xl">Stamps</h1>
            <p className="mt-2 text-muted-foreground">Each memory you recover in a world earns a stamp.</p>
            <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {artifacts.map((a) => {
                const got = hydrated && s.discovered.includes(a.id);
                return (
                  <li key={a.id}>
                    <Link to="/memory/$id" params={{ id: a.id }} className="block" aria-label={got ? `${a.shortName} stamp` : `Memory ${a.number} not yet recovered`}>
                      <div className={cn("relative flex aspect-square items-center justify-center rounded-full border-2 border-dashed", got ? (a.planet === "moon" ? "border-moon/60" : "border-mars/70") : "border-border")}>
                        {got ? (
                          <div className={cn("animate-stamp flex size-[86%] flex-col items-center justify-center rounded-full border-4 text-center", a.planet === "moon" ? "border-moon text-moon" : "border-mars text-mars")}>
                            <span className="font-mono text-[10px] tracking-widest">{a.planet === "moon" ? "LUNA" : "MARS"} · {String(a.number).padStart(2, "0")}</span>
                            <span className="display px-2 text-lg leading-none">{a.shortName}</span>
                            <span className="font-mono text-xs">{a.missionYear}</span>
                          </div>
                        ) : (
                          <span className="font-mono text-xs text-muted-foreground">{String(a.number).padStart(2, "0")} · ?</span>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <h2 className="display mt-14 text-4xl">Achievements</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {achievements.map((ach) => {
                const on = hydrated && ach.unlocked;
                return (
                  <li key={ach.id} className={cn("flex items-center gap-4 rounded-xl border p-4", on ? "border-primary/50 bg-primary/5" : "border-border opacity-70")}>
                    <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-full", on ? "bg-primary text-primary-foreground glow-signal" : "bg-secondary text-muted-foreground")}>
                      {on ? <Award className="size-5" /> : <Lock className="size-4" />}
                    </span>
                    <div>
                      <p className="font-semibold">{ach.title}</p>
                      <p className="text-sm text-muted-foreground">{ach.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="signal" asChild><Link to="/challenges">Try the challenges</Link></Button>
              <Button variant="hud" asChild><Link to="/archive">Open the archive</Link></Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Stat({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className={cn("display text-3xl", className)}>{value}</dd>
    </div>
  );
}
