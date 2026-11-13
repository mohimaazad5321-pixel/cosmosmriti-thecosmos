import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ExternalLink, Minus, Plus } from "lucide-react";
import type { Planet } from "@/data/types";
import { gridSize, kmPerPixel, layersFor, TILE, tileUrl, toLatLon, toPixel, type TrekLayer } from "@/game/trek";
import { cn } from "@/lib/utils";

export interface MapMarker {
  id: string;
  lat: number;
  lon: number;
  label: string;
  /** Short chip text shown on the map (defaults to label). */
  chip?: string;
  approximate?: boolean;
  onSelect?: () => void;
  emphasis?: boolean;
}

interface Props {
  planet: Planet;
  center: { lat: number; lon: number };
  zoom: number;
  markers: MapMarker[];
  className?: string;
  /** Accessible description of what the map shows. */
  label: string;
}

/**
 * Real NASA Trek basemap (orbital mosaics and shaded-relief elevation), drawn as a plain tile grid.
 * Markers sit at true published coordinates — unlike the 3D worlds, nothing is compressed here.
 */
export function TrekMap({ planet, center: initialCenter, zoom: initialZoom, markers, className, label }: Props) {
  const layers = useMemo(() => layersFor(planet), [planet]);
  const [layerId, setLayerId] = useState(layers[0]!.id);
  const layer: TrekLayer = layers.find((l) => l.id === layerId) ?? layers[0]!;
  const [zoom, setZoom] = useState(Math.min(initialZoom, layer.maxZoom));
  const [center, setCenter] = useState(initialCenter);
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const drag = useRef<{ x: number; y: number; cx: number; cy: number } | null>(null);
  const [failed, setFailed] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => e && setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => setZoom((z) => Math.min(z, layer.maxZoom)), [layer.maxZoom]);

  const c = toPixel(zoom, center.lat, center.lon);
  const { cols, rows } = gridSize(zoom);
  const worldW = cols * TILE;
  const worldH = rows * TILE;
  // keep the view inside the poles
  const cy = Math.max(Math.min(size.h / 2, worldH / 2), Math.min(c.y, worldH - Math.min(size.h / 2, worldH / 2)));
  const left = c.x - size.w / 2;
  const top = cy - size.h / 2;

  const tiles = useMemo(() => {
    if (!size.w) return [];
    const out: { key: string; src: string; x: number; y: number }[] = [];
    const c0 = Math.floor(left / TILE);
    const c1 = Math.floor((left + size.w) / TILE);
    const r0 = Math.max(0, Math.floor(top / TILE));
    const r1 = Math.min(rows - 1, Math.floor((top + size.h) / TILE));
    for (let r = r0; r <= r1; r++) {
      for (let col = c0; col <= c1; col++) {
        const wrapped = ((col % cols) + cols) % cols;
        out.push({ key: `${zoom}-${r}-${col}`, src: tileUrl(layer, zoom, r, wrapped), x: col * TILE - left, y: r * TILE - top });
      }
    }
    return out;
  }, [left, top, size.w, size.h, zoom, rows, cols, layer]);

  const place = (lat: number, lon: number) => {
    const p = toPixel(zoom, lat, lon);
    const raw = p.x - left;
    // the map wraps east–west: use the copy of the marker nearest the middle of the view
    const x = raw - Math.round((raw - size.w / 2) / worldW) * worldW;
    return { x, y: p.y - top };
  };

  const zoomBy = useCallback((d: number) => setZoom((z) => Math.max(0, Math.min(layer.maxZoom, z + d))), [layer.maxZoom]);
  const panBy = (dx: number, dy: number) => {
    const ll = toLatLon(zoom, c.x + dx, cy + dy);
    setCenter({ lat: Math.max(-89, Math.min(89, ll.lat)), lon: ll.lon });
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button,a,select")) return;
    drag.current = { x: e.clientX, y: e.clientY, cx: c.x, cy };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const ll = toLatLon(zoom, d.cx - (e.clientX - d.x), d.cy - (e.clientY - d.y));
    setCenter({ lat: Math.max(-89, Math.min(89, ll.lat)), lon: ll.lon });
  };
  const onPointerUp = () => (drag.current = null);
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = 64;
    const k: Record<string, () => void> = {
      ArrowLeft: () => panBy(-step, 0),
      ArrowRight: () => panBy(step, 0),
      ArrowUp: () => panBy(0, -step),
      ArrowDown: () => panBy(0, step),
      "+": () => zoomBy(1),
      "=": () => zoomBy(1),
      "-": () => zoomBy(-1),
    };
    const fn = k[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  };

  const scaleKm = kmPerPixel(planet, zoom) * 100;

  return (
    <figure className={cn("overflow-hidden rounded-xl border border-border bg-ink", className)}>
      <div
        ref={box}
        role="application"
        aria-label={`${label}. Use arrow keys to pan and plus or minus to zoom.`}
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative h-full min-h-[260px] w-full cursor-grab touch-none select-none overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring active:cursor-grabbing"
      >
        {tiles.map((t) => (
          <img
            key={t.key}
            src={t.src}
            alt=""
            draggable={false}
            width={TILE}
            height={TILE}
            onError={() => setFailed((f) => f + 1)}
            className="pointer-events-none absolute max-w-none"
            style={{ left: t.x, top: t.y, width: TILE, height: TILE }}
          />
        ))}

        {markers.map((m, mi) => {
          const p = place(m.lat, m.lon);
          // markers sharing one site (Pathfinder and Sojourner) stack upward instead of hiding each other
          const stack = markers.slice(0, mi).filter((o) => o.lat === m.lat && o.lon === m.lon).length;
          p.y -= stack * 30;
          if (p.x < -40 || p.x > size.w + 40 || p.y < -40 || p.y > size.h + 40) return null;
          const Tag = m.onSelect ? "button" : "div";
          return (
            <Tag
              key={m.id}
              {...(m.onSelect ? { type: "button" as const, onClick: m.onSelect } : {})}
              aria-label={m.onSelect ? m.label : undefined}
              className={cn("absolute flex -translate-x-1/2 -translate-y-full flex-col items-center", m.onSelect && "cursor-pointer")}
              style={{ left: p.x, top: p.y }}
            >
              <span className={cn("hud-chip mb-1 whitespace-nowrap", m.emphasis ? "text-primary" : "text-foreground")}>{m.chip ?? m.label}</span>
              <span className={cn("block size-3 rounded-full border-2 border-background shadow", m.emphasis ? "bg-primary" : "bg-foreground")} />
            </Tag>
          );
        })}

        {/* controls */}
        <div className="absolute right-2 top-2 flex flex-col gap-1">
          <button type="button" onClick={() => zoomBy(1)} disabled={zoom >= layer.maxZoom} aria-label="Zoom in" className="hud-chip size-10 justify-center p-0 disabled:opacity-40"><Plus className="size-4" /></button>
          <button type="button" onClick={() => zoomBy(-1)} disabled={zoom <= 0} aria-label="Zoom out" className="hud-chip size-10 justify-center p-0 disabled:opacity-40"><Minus className="size-4" /></button>
        </div>
        <div className="absolute bottom-2 right-2 flex flex-wrap gap-1" role="group" aria-label="Map layer">
          {layers.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLayerId(l.id)}
              aria-pressed={l.id === layer.id}
              className={cn("hud-chip min-h-9", l.id === layer.id ? "text-primary" : "text-muted-foreground")}
            >
              {l.kind === "imagery" ? "Photo" : "Elevation"}
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-2 font-mono text-[10px] text-foreground/90">
          <span className="block h-1 w-[100px] border-x border-b border-foreground/80" />
          <span className="rounded bg-background/70 px-1">≈ {scaleKm >= 10 ? Math.round(scaleKm) : scaleKm.toFixed(1)} km</span>
        </div>
        {failed > 6 && (
          <p className="absolute inset-x-0 bottom-8 mx-auto w-fit rounded bg-background/80 px-3 py-1 text-xs text-muted-foreground">Some NASA map tiles didn't load. Check your connection.</p>
        )}
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
        <span>{layer.label} · {layer.credit}</span>
        <a href={layer.infoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-primary">About this map <ExternalLink className="size-3" /></a>
      </figcaption>
    </figure>
  );
}
