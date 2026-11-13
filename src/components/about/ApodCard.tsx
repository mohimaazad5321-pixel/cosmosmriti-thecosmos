import { queryOptions, useQuery } from "@tanstack/react-query";
import { ExternalLink, Satellite } from "lucide-react";
import { getApod } from "@/lib/nasa.functions";

export const apodQuery = queryOptions({
  queryKey: ["nasa", "apod"],
  queryFn: () => getApod(),
  staleTime: 60 * 60 * 1000,
});

/** Live content from NASA's open API — kept visually separate from the museum's verified artifact data. */
export function ApodCard() {
  const { data, isPending } = useQuery(apodQuery);
  const img = data?.ok ? (data.apod.mediaType === "image" ? data.apod.url : data.apod.thumbnailUrl) : null;
  return (
    <section className="mt-16" aria-labelledby="apod-title">
      <h2 id="apod-title" className="eyebrow mb-1 flex items-center gap-2 text-foreground"><Satellite className="size-3.5 text-primary" /> Live from NASA today</h2>
      <p className="mb-4 text-xs text-muted-foreground">Astronomy Picture of the Day, loaded live from NASA's open API. It changes daily and is not part of CosmoSmriti's ten memories.</p>
      {isPending ? (
        <div className="grid gap-4 rounded-2xl border border-border p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="aspect-[4/3] animate-pulse rounded-xl bg-secondary" />
          <div className="space-y-3"><div className="h-6 w-2/3 animate-pulse rounded bg-secondary" /><div className="h-24 animate-pulse rounded bg-secondary" /></div>
        </div>
      ) : !data || !data.ok ? (
        <p className="rounded-2xl border border-border p-5 text-sm text-muted-foreground">{data && !data.ok ? data.error : "NASA's picture of the day couldn't be loaded."}</p>
      ) : (
        <article className="grid gap-5 rounded-2xl border border-border p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <a href={data.apod.pageUrl} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl bg-secondary">
            {img ? (
              <img src={img} alt={data.apod.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center p-6 text-center text-sm text-muted-foreground">Today's entry is a {data.apod.mediaType === "video" ? "video" : "special feature"}. Open it on NASA's site.</div>
            )}
          </a>
          <div>
            <p className="font-mono text-xs text-muted-foreground">{data.apod.date}</p>
            <h3 className="display mt-1 text-3xl">{data.apod.title}</h3>
            <p className="mt-3 line-clamp-6 text-sm leading-relaxed text-foreground/85">{data.apod.explanation}</p>
            <p className="mt-3 text-xs text-muted-foreground">{data.apod.copyright ? `Image credit & copyright: ${data.apod.copyright}` : "Image credit: see NASA's APOD page"} · via NASA APOD</p>
            <a href={data.apod.pageUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline">Open on apod.nasa.gov <ExternalLink className="size-3.5" /></a>
          </div>
        </article>
      )}
    </section>
  );
}
