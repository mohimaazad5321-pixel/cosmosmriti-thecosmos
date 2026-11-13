import { useState } from "react";
import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function FlipCard({ front, back, accent }: { front: string; back: string; accent: "moon" | "mars" }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      data-flipped={flipped}
      aria-pressed={flipped}
      aria-label={flipped ? `Answer: ${back}` : `Question: ${front}. Tap to reveal.`}
      className="flip-card block h-52 w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
    >
      <div className="flip-inner h-full w-full">
        <div className={cn("flip-face absolute inset-0 flex flex-col justify-between rounded-2xl border p-5", accent === "moon" ? "border-moon/30 bg-moon/5" : "border-mars/40 bg-mars/10")}>
          <span className="eyebrow">Did you know?</span>
          <p className="display text-2xl leading-tight">{front}</p>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <RotateCw className="size-3" /> Tap to flip
          </span>
        </div>
        <div className="flip-face flip-back absolute inset-0 flex flex-col justify-center rounded-2xl border border-primary/40 bg-card p-5">
          <p className="text-sm leading-relaxed">{back}</p>
        </div>
      </div>
    </button>
  );
}
