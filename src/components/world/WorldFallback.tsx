import { HelpCircle } from "lucide-react";
import type { Artifact, Planet } from "@/data/types";
import { eyeImages } from "@/components/landing/RobotGuide";
import { cn } from "@/lib/utils";

/** Non-3D exploration for devices without WebGL: a flat map with the same markers. */
export function WorldFallback({ planet, items, discovered, onSelect }: { planet: Planet; items: { artifact: Artifact; xz: [number, number] }[]; discovered: string[]; onSelect: (id: string) => void }) {
  return (
    <div className="bg-space flex min-h-full items-center justify-center p-6 pt-28">
      <div className="w-full max-w-3xl">
        <p className="mb-4 text-center text-sm text-muted-foreground">
          3D isn't available on this device, so here is a simple map. Every memory is still discoverable.
        </p>
        <div className="relative aspect-square w-full overflow-hidden rounded-full border border-border">
          <img src={eyeImages[planet]} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60" />
          {items.map(({ artifact, xz }) => {
            const found = discovered.includes(artifact.id);
            return (
              <button
                key={artifact.id}
                type="button"
                onClick={() => onSelect(artifact.id)}
                className={cn("hud-chip absolute -translate-x-1/2 -translate-y-1/2 px-3 py-2", found ? "text-foreground" : "text-primary")}
                style={{ left: `${50 + (xz[0] / 180) * 100}%`, top: `${50 + (xz[1] / 180) * 100}%` }}
              >
                {found ? artifact.shortName : <><HelpCircle className="size-3" /> {artifact.missionYear}</>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
