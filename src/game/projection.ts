import type { Planet } from "@/data/types";

/**
 * Equirectangular projection of real coordinates into the illustrative world plane.
 * Relative positions follow the published coordinates; distances are compressed
 * (not to map scale) so all sites fit in one explorable landscape.
 */
export const PROJECTION: Record<Planet, { lon0: number; lat0: number; sx: number; sz: number }> = {
  moon: { lon0: 4, lat0: 11, sx: 2.6, sz: 2.6 },
  mars: { lon0: 25, lat0: 27, sx: 0.42, sz: 0.9 },
};

export function toWorld(planet: Planet, lat: number, lon: number): [number, number] {
  const p = PROJECTION[planet];
  return [(lon - p.lon0) * p.sx, -(lat - p.lat0) * p.sz];
}

/**
 * Small display offsets for artifacts that share one landing site, so both markers
 * are clickable. Recorded here (not in the data) because it is a presentation choice.
 */
export const DISPLAY_OFFSET: Record<string, [number, number]> = {
  sojourner: [5, 3],
};

export function artifactWorldPos(planet: Planet, id: string, lat: number, lon: number): [number, number] {
  const [x, z] = toWorld(planet, lat, lon);
  const o = DISPLAY_OFFSET[id] ?? [0, 0];
  return [x + o[0], z + o[1]];
}

export const WORLD_SIZE = 220;
