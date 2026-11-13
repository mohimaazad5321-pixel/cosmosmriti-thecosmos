import { describe, expect, it } from "vitest";
import { artifacts, getArtifact } from "@/data/artifacts";
import { explodeOffset, fitScale } from "@/game/explode";
import { gridSize, tileUrl, toLatLon, toPixel, TREK_LAYERS } from "@/game/trek";
import { isDescentStagePart, LM_DESCENT_TOP_Y } from "@/game/nasaModels";

describe("NASA Trek tiles", () => {
  it("level 0 is two tiles wide and one tall; each level doubles", () => {
    expect(gridSize(0)).toEqual({ cols: 2, rows: 1 });
    expect(gridSize(3)).toEqual({ cols: 16, rows: 8 });
  });

  it("puts 180°W 90°N at the top-left corner and 0°,0° in the centre", () => {
    expect(toPixel(0, 90, -180)).toEqual({ x: 0, y: 0 });
    expect(toPixel(0, 0, 0)).toEqual({ x: 256, y: 128 });
  });

  it("round-trips a landing site through pixels", () => {
    const a11 = getArtifact("apollo-11-eagle")!;
    const p = toPixel(6, a11.coordinates.lat, a11.coordinates.lon);
    const back = toLatLon(6, p.x, p.y);
    expect(back.lat).toBeCloseTo(a11.coordinates.lat, 6);
    expect(back.lon).toBeCloseTo(a11.coordinates.lon, 6);
  });

  it("builds the verified Moon Trek WMTS url (row before column)", () => {
    const wac = TREK_LAYERS.find((l) => l.id === "LRO_WAC_Mosaic_Global_303ppd_v02")!;
    expect(tileUrl(wac, 2, 1, 3)).toBe("https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/2/1/3.jpg");
  });
});

describe("3D inspector", () => {
  it("does not move parts when the view is not exploded", () => {
    for (const v of explodeOffset([0, 1, 0], [2, 3, -1], 0)) expect(Math.abs(v)).toBe(0);
  });

  it("moves parts directly away from the centre when exploded", () => {
    const [x, y, z] = explodeOffset([0, 1, 0], [2, 1, 0], 1);
    expect(x).toBeGreaterThan(0);
    expect(y).toBe(0);
    expect(z).toBe(0);
  });

  it("scales any model to the same framing radius", () => {
    expect(fitScale([2, 2, 2], Math.sqrt(3))).toBeCloseTo(1);
    expect(fitScale([4, 4, 4], Math.sqrt(3))).toBeCloseTo(0.5);
  });

  it("treats lunar-module parts above the cut line as the ascent stage", () => {
    expect(isDescentStagePart(1.0)).toBe(true);
    expect(isDescentStagePart(LM_DESCENT_TOP_Y + 0.5)).toBe(false);
  });
});

describe("museum data", () => {
  it("every memory now has a later NASA image in Then vs Now", () => {
    for (const a of artifacts) expect(a.thenNow.now, a.id).toBeDefined();
  });

  it("only the two Apollo descent stages, Spirit and Opportunity use NASA's own models", () => {
    const withNasa = artifacts.filter((a) => a.reconstruction.nasaModel).map((a) => a.id).sort();
    expect(withNasa).toEqual(["apollo-11-eagle", "apollo-17-challenger", "opportunity", "spirit"]);
  });

  it("credits NASA 3D Resources in the sources of every memory that shows a NASA model", () => {
    for (const a of artifacts.filter((x) => x.reconstruction.nasaModel)) {
      expect(a.sources.some((s) => s.url.startsWith("https://science.nasa.gov/3d-resources/")), a.id).toBe(true);
    }
  });

  it("cites every later image in the memory's sources", () => {
    for (const a of artifacts) {
      const id = a.thenNow.now!.nasaId;
      const cited = a.sources.some((s) => s.url.includes(id)) || a.images.some((i) => i.nasaId === id);
      expect(cited, `${a.id} → ${id}`).toBe(true);
    }
  });

  it("gives every memory at least one clickable hotspot on its reconstruction", () => {
    for (const a of artifacts) expect(a.components.some((c) => c.anchor), a.id).toBe(true);
  });
});
