import { useState } from "react";
import { ExternalLink, ImageOff } from "lucide-react";
import type { HistoricalImage } from "@/data/types";
import { imageDetailUrl } from "@/data/sources";
import { cn } from "@/lib/utils";

export function NasaFigure({ image, className, imgClassName, eager = false }: { image: HistoricalImage; className?: string; imgClassName?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return (
    <figure className={cn("overflow-hidden rounded-xl border border-border bg-muted", className)}>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink">
        {!failed ? (
          <img
            src={image.url}
            alt={image.caption}
            loading={eager ? "eager" : "lazy"}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={cn("h-full w-full object-cover transition-opacity duration-700", loaded ? "opacity-100" : "opacity-0", imgClassName)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-sm text-muted-foreground">
            <ImageOff className="size-6" />
            The NASA image could not load right now.
          </div>
        )}
        {!loaded && !failed && <div className="absolute inset-0 animate-pulse bg-secondary" />}
      </div>
      <figcaption className="space-y-1 p-3 text-xs text-muted-foreground">
        <p className="text-foreground/90">{image.caption}</p>
        <p className="flex flex-wrap items-center gap-x-2 font-mono">
          <span>{image.date}</span>·<span>{image.credit}</span>·
          <a href={imageDetailUrl(image.nasaId)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
            {image.nasaId} <ExternalLink className="size-3" />
          </a>
        </p>
      </figcaption>
    </figure>
  );
}
