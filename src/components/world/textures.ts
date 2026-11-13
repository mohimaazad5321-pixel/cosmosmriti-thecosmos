import * as THREE from "three";
import { fbm, mulberry32 } from "@/game/rng";

/** Fine regolith grain, tiled across the terrain. */
export function makeGrainTexture(seed: number) {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  const rnd = mulberry32(seed);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = fbm(x / 18, y / 18, seed, 3) * 0.5 + 0.5;
      const v = 185 + n * 55 + (rnd() - 0.5) * 40;
      const i = (y * size + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = Math.max(0, Math.min(255, v));
      img.data[i + 3] = 255;
    }
  }
  // scattered pebbles
  ctx.putImageData(img, 0, 0);
  for (let k = 0; k < 220; k++) {
    const r = 0.6 + rnd() * 2.2;
    const x = rnd() * size;
    const y = rnd() * size;
    ctx.fillStyle = `rgba(${rnd() < 0.5 ? "70,70,70" : "255,255,255"},${0.25 + rnd() * 0.3})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(36, 36);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Stylised Earth (an illustration, not a satellite map). */
export function makeEarthTexture() {
  const w = 512;
  const h = 256;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = x / w;
      const v = y / h;
      const land = fbm(u * 6, v * 3, 42, 5);
      const cloud = fbm(u * 10 + 3, v * 6, 77, 5);
      const lat = Math.abs(v - 0.5) * 2;
      let r = 20, g = 60, b = 140;
      if (land > 0.08) {
        r = 90 + land * 120; g = 110 + land * 60; b = 60;
      }
      if (lat > 0.85) { r = g = b = 235; }
      if (cloud > 0.12) {
        const k = Math.min(1, (cloud - 0.12) * 4);
        r = r + (245 - r) * k; g = g + (248 - g) * k; b = b + (255 - b) * k;
      }
      const i = (y * w + x) * 4;
      img.data[i] = r; img.data[i + 1] = g; img.data[i + 2] = b; img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Soft radial sprite for glows and dust. */
export function makeGlowTexture() {
  const s = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.3, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  return new THREE.CanvasTexture(c);
}
