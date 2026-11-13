import type { Planet } from "@/data/types";
import { fbm, mulberry32 } from "./rng";
import { WORLD_SIZE } from "./projection";

interface Crater {
  x: number;
  z: number;
  r: number;
  depth: number;
}

export interface TerrainModel {
  planet: Planet;
  craters: Crater[];
  flatten: { x: number; z: number; r: number }[];
  seed: number;
}

export function createTerrainModel(planet: Planet, flattenAt: [number, number][]): TerrainModel {
  const seed = planet === "moon" ? 1969 : 1997;
  const rnd = mulberry32(seed);
  const craters: Crater[] = [];
  const count = planet === "moon" ? 90 : 34;
  const half = WORLD_SIZE / 2;
  for (let i = 0; i < count; i++) {
    // power-law sizes: many small, few large
    const r = planet === "moon" ? 1.5 + Math.pow(rnd(), 3.2) * 22 : 2 + Math.pow(rnd(), 3) * 16;
    craters.push({ x: (rnd() * 2 - 1) * half, z: (rnd() * 2 - 1) * half, r, depth: r * (planet === "moon" ? 0.22 : 0.14) });
  }
  return { planet, craters, seed, flatten: flattenAt.map(([x, z]) => ({ x, z, r: 7 })) };
}

function craterProfile(d: number, r: number, depth: number) {
  const t = d / r;
  if (t > 2.2) return 0;
  const bowl = t < 1 ? -(1 - t * t) * depth : 0;
  const rim = depth * 0.45 * Math.exp(-((t - 1) * (t - 1)) / 0.06);
  return bowl + rim;
}

function rawHeight(m: TerrainModel, x: number, z: number) {
  const s = m.seed;
  let h: number;
  if (m.planet === "moon") {
    h = fbm(x * 0.012, z * 0.012, s, 5) * 7 + fbm(x * 0.06, z * 0.06, s + 7, 3) * 0.9;
  } else {
    // Mars: broad mesas + wind-carved ridges + a dry channel
    const base = fbm(x * 0.009, z * 0.009, s, 5);
    const mesa = Math.tanh(base * 3) * 9;
    const ridges = (1 - Math.abs(fbm(x * 0.03 + 3, z * 0.03, s + 3, 4))) * 1.8;
    const channel = -4 * Math.exp(-Math.pow((z - 25 * Math.sin(x * 0.02)) / 9, 2)) * (x > -20 ? 1 : 0.3);
    h = mesa + ridges + channel + fbm(x * 0.08, z * 0.08, s + 9, 3) * 0.5;
  }
  for (const c of m.craters) {
    const dx = x - c.x;
    const dz = z - c.z;
    const d2 = dx * dx + dz * dz;
    if (d2 < (c.r * 2.2) ** 2) h += craterProfile(Math.sqrt(d2), c.r, c.depth);
  }
  return h;
}

/** Height of the illustrative terrain at (x, z). Areas around artifacts are gently levelled. */
export function heightAt(m: TerrainModel, x: number, z: number) {
  let h = rawHeight(m, x, z);
  for (const f of m.flatten) {
    const d = Math.hypot(x - f.x, z - f.z);
    if (d < f.r * 2) {
      const target = rawHeightCenter(m, f.x, f.z);
      const w = d < f.r ? 1 : 1 - (d - f.r) / f.r;
      const ws = w * w * (3 - 2 * w);
      h = h * (1 - ws) + target * ws;
    }
  }
  return h;
}

const centerCache = new WeakMap<TerrainModel, Map<string, number>>();
function rawHeightCenter(m: TerrainModel, x: number, z: number) {
  let c = centerCache.get(m);
  if (!c) centerCache.set(m, (c = new Map()));
  const k = `${x},${z}`;
  let v = c.get(k);
  if (v === undefined) {
    v = rawHeight(m, x, z);
    c.set(k, v);
  }
  return v;
}
