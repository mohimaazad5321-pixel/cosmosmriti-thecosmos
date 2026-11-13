/** Pure maths for the 3D inspector: exploded views and framing. No three.js imports. */
export type V3 = [number, number, number];

/** How far parts travel outward at full explosion, as a multiple of their distance from the centre. */
export const EXPLODE_SPREAD = 0.6;
/** Vertical travel is boosted so stacked parts (decks, stages) separate visibly. */
export const EXPLODE_VERTICAL_BOOST = 1.25;
/** At full explosion the model is shown this much smaller (1 + value), so pieces stay on screen. */
export const EXPLODE_ZOOM_OUT = 0.55;
/** Exploded-view easing rate (per second) for `v += (target - v) * (1 - exp(-k dt))`. */
export const EXPLODE_EASE = 6;

/**
 * Offset of a part whose centre is `part`, pushed away from `origin` at explosion `t` (0..1).
 * The inspector passes the model's centre at ground level, so parts spread sideways and rise.
 */
export function explodeOffset(origin: V3, part: V3, t: number): V3 {
  const k = EXPLODE_SPREAD * Math.max(0, Math.min(1, t));
  return [(part[0] - origin[0]) * k, (part[1] - origin[1]) * k * EXPLODE_VERTICAL_BOOST, (part[2] - origin[2]) * k];
}

/** Uniform scale that makes a box of the given size fit a sphere of `radius`. */
export function fitScale(size: V3, radius: number): number {
  const r = Math.hypot(size[0], size[1], size[2]) / 2;
  return r > 0 ? radius / r : 1;
}

export function ease(current: number, target: number, rate: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-rate * Math.min(dt, 0.05)));
}
