import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Award, CheckCircle2, Lightbulb, XCircle, Search } from "lucide-react";
import { PageShell } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getArtifact } from "@/data/artifacts";
import { detectiveCases, quiz } from "@/data/extras";
import { QUIZ_ACE_SCORE } from "@/lib/achievements";
import { useProgress } from "@/lib/progress";
import { sfx } from "@/lib/sound";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/challenges")({
  head: () => ({
    meta: [
      { title: "Artifact Detective & Cosmic Quiz — CosmoSmriti" },
      { name: "description", content: "Optional challenges: solve artifact detective cases with clues, and test yourself in the Cosmic Quiz with instant explanations." },
      { property: "og:title", content: "Artifact Detective & Cosmic Quiz — CosmoSmriti" },
      { property: "og:description", content: "Clue-based detective cases and a quiz about the spacecraft left on the Moon and Mars." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChallengesPage,
});

function ChallengesPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-4 py-14 md:px-8">
        <p className="eyebrow text-primary">Optional challenges</p>
        <h1 className="display mt-3 text-5xl md:text-7xl">Think like an explorer</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">Nothing is locked behind these. They're here for curiosity, and every answer comes with an explanation.</p>
        <Tabs defaultValue="detective" className="mt-10">
          <TabsList className="h-auto rounded-full bg-secondary/60 p-1">
            <TabsTrigger value="detective" className="rounded-full px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Artifact Detective</TabsTrigger>
            <TabsTrigger value="quiz" className="rounded-full px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Cosmic Quiz</TabsTrigger>
          </TabsList>
          <TabsContent value="detective" className="mt-8"><Detective /></TabsContent>
          <TabsContent value="quiz" className="mt-8"><Quiz /></TabsContent>
        </Tabs>
      </section>
    </PageShell>
  );
}

function Detective() {
  const solved = useProgress((s) => s.detectiveSolved);
  const solveCase = useProgress((s) => s.solveCase);
  const [ci, setCi] = useState(0);
  const [clues, setClues] = useState(1);
  const [picked, setPicked] = useState<string | null>(null);
  const c = detectiveCases[ci]!;
  const correct = picked === c.answer;

  const go = (n: number) => {
    setCi(n);
    setClues(1);
    setPicked(null);
  };

  return (
    <div className="panel p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow flex items-center gap-2"><Search className="size-3" /> Case {ci + 1} of {detectiveCases.length}</p>
        <div className="flex gap-1">
          {detectiveCases.map((d, k) => (
            <button key={d.id} type="button" onClick={() => go(k)} aria-label={`Case ${k + 1}`} className={cn("size-8 rounded-full border font-mono text-xs", k === ci ? "border-primary text-primary" : "border-border text-muted-foreground", solved.includes(d.id) && "bg-success/20 text-success")}>
              {k + 1}
            </button>
          ))}
        </div>
      </div>
      <h2 className="display mt-4 text-4xl">{c.title}</h2>
      <ol className="mt-6 space-y-3">
        {c.clues.slice(0, clues).map((cl, k) => (
          <li key={k} className="animate-fade-up flex gap-3 rounded-xl border border-border bg-secondary/30 p-4">
            <span className="font-mono text-xs text-primary">CLUE {k + 1}</span>
            <span>{cl}</span>
          </li>
        ))}
      </ol>
      {clues < c.clues.length && !picked && (
        <Button variant="hud" className="mt-4 h-10" onClick={() => setClues((n) => n + 1)}><Lightbulb /> Reveal another clue</Button>
      )}
      <p className="eyebrow mt-8">Which memory is it?</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {c.options.map((id) => {
          const a = getArtifact(id)!;
          const state = picked ? (id === c.answer ? "right" : id === picked ? "wrong" : "idle") : "idle";
          return (
            <button
              key={id}
              type="button"
              disabled={!!picked}
              onClick={() => {
                setPicked(id);
                if (id === c.answer) {
                  solveCase(c.id);
                  sfx.discover();
                } else sfx.click();
              }}
              className={cn(
                "flex min-h-14 items-center justify-between rounded-xl border p-4 text-left transition-colors",
                state === "right" && "border-success bg-success/10",
                state === "wrong" && "border-destructive bg-destructive/10",
                state === "idle" && "border-border hover:border-primary/60",
              )}
            >
              <span>{a.shortName} <span className="text-xs text-muted-foreground">· {a.missionYear}</span></span>
              {state === "right" && <CheckCircle2 className="size-5 text-success" />}
              {state === "wrong" && <XCircle className="size-5 text-destructive" />}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className="animate-fade-up mt-6 rounded-xl border border-border p-4">
          <p className="font-semibold">{correct ? `Solved${clues === 1 ? " with just one clue!" : "!"}` : "Not quite, and that's how detectives learn."}</p>
          <p className="mt-1 text-sm text-muted-foreground">{c.explanation}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="hud" size="sm" className="h-9" asChild><Link to="/memory/$id" params={{ id: c.answer }}>Read its story</Link></Button>
            {!correct && <Button variant="hud" size="sm" className="h-9" onClick={() => setPicked(null)}>Try again</Button>}
            {ci < detectiveCases.length - 1 && <Button variant="signal" size="sm" className="h-9" onClick={() => go(ci + 1)}>Next case</Button>}
          </div>
        </div>
      )}
    </div>
  );
}

function Quiz() {
  const recordQuiz = useProgress((s) => s.recordQuiz);
  const best = useProgress((s) => s.quizBest);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = quiz[qi]!;

  if (done) {
    const ace = score >= QUIZ_ACE_SCORE;
    return (
      <div className="panel p-8 text-center">
        <Award className={cn("mx-auto size-14", ace ? "text-primary" : "text-muted-foreground")} />
        <p className="display mt-4 text-6xl">{score}/{quiz.length}</p>
        <p className="mt-2 text-muted-foreground">{ace ? "Quiz Ace badge unlocked! It's in your passport." : `Score ${QUIZ_ACE_SCORE} or more to earn the Quiz Ace badge.`}</p>
        {best !== null && <p className="mt-1 text-xs text-muted-foreground">Best score: {best}/{quiz.length}</p>}
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="signal" onClick={() => { setQi(0); setPicked(null); setScore(0); setDone(false); }}>Play again</Button>
          <Button variant="hud" asChild><Link to="/passport">See passport</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="panel p-6 md:p-8">
      <div className="flex items-center gap-4">
        <Progress value={(qi / quiz.length) * 100} className="h-1.5 flex-1 bg-secondary" />
        <span className="font-mono text-xs text-muted-foreground">{qi + 1}/{quiz.length}</span>
      </div>
      <h2 className="display mt-6 text-3xl md:text-4xl">{q.question}</h2>
      <div className="mt-6 grid gap-3">
        {q.options.map((o, k) => {
          const state = picked === null ? "idle" : k === q.answer ? "right" : k === picked ? "wrong" : "idle";
          return (
            <button
              key={o}
              type="button"
              disabled={picked !== null}
              onClick={() => {
                setPicked(k);
                if (k === q.answer) { setScore((s) => s + 1); sfx.discover(); } else sfx.click();
              }}
              className={cn(
                "flex min-h-14 items-center justify-between rounded-xl border p-4 text-left transition-colors",
                state === "right" && "border-success bg-success/10",
                state === "wrong" && "border-destructive bg-destructive/10",
                state === "idle" && "border-border hover:border-primary/60",
              )}
            >
              {o}
              {state === "right" && <CheckCircle2 className="size-5 text-success" />}
              {state === "wrong" && <XCircle className="size-5 text-destructive" />}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="animate-fade-up mt-6 rounded-xl border border-border p-4">
          <p className="font-semibold">{picked === q.answer ? "Correct!" : "Good try!"}</p>
          <p className="mt-1 text-sm text-muted-foreground">{q.explanation}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {q.artifactId && <Button variant="hud" size="sm" className="h-9" asChild><Link to="/memory/$id" params={{ id: q.artifactId }}>Learn more</Link></Button>}
            <Button
              variant="signal"
              size="sm"
              className="h-9"
              onClick={() => {
                if (qi === quiz.length - 1) {
                  recordQuiz(score);
                  setDone(true);
                } else {
                  setQi(qi + 1);
                  setPicked(null);
                }
              }}
            >
              {qi === quiz.length - 1 ? "See my score" : "Next question"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
