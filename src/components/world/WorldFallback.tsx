import type { Artifact, Planet } from "@/data/types";
import { TrekMap } from "@/components/map/TrekMap";
import { OVERVIEW } from "@/game/trek";

/** Non-3D exploration for devices without WebGL: NASA's real map with every site at its true coordinates. */
export function WorldFallback({ planet, items, discovered, onSelect }: { planet: Planet; items: { artifact: Artifact; xz: [number, number] }[]; discovered: string[]; onSelect: (id: string) => void }) {
  const o = OVERVIEW[planet];
  return (
    <div className="bg-space flex min-h-full items-center justify-center p-4 pb-28 pt-28">
      <div className="w-full max-w-4xl">
        <p className="mb-3 text-center text-sm text-muted-foreground">
          3D isn't available on this device, so here is NASA's real map instead. Every memory is still discoverable: tap a signal.
        </p>
        <TrekMap
          planet={planet}
          center={{ lat: o.lat, lon: o.lon }}
          zoom={o.zoom}
          className="h-[60svh]"
          label={`Map of ${planet === "moon" ? "the Moon" : "Mars"} with ${items.length} memory sites`}
          markers={items.map(({ artifact: a }) => {
            const found = discovered.includes(a.id);
            return {
              id: a.id,
              lat: a.coordinates.lat,
              lon: a.coordinates.lon,
              label: found ? `${a.shortName}, ${a.missionYear}` : `Unknown memory from ${a.missionYear}`,
              chip: found ? a.shortName : `? · ${a.missionYear}`,
              emphasis: !found,
              onSelect: () => onSelect(a.id),
            };
          })}
        />
      </div>
    </div>
  );
}
