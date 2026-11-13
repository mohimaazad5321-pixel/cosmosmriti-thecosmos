import type { Planet } from "@/data/types";

/**
 * NASA Solar System Treks WMTS tiles (equirectangular, "default028mm" tile matrix set).
 * Verified: level z has 2^(z+1) columns × 2^z rows of 256 px tiles, top-left at 180°W 90°N,
 * east-positive longitude, CORS open. Layer ids and max levels come from each layer's
 * WMTSCapabilities.xml.
 */
export interface TrekLayer {
  id: string;
  planet: Planet;
  label: string;
  kind: "imagery" | "elevation";
  ext: "jpg" | "png";
  maxZoom: number;
  credit: string;
  /** Trek product metadata page. */
  infoUrl: string;
}

export const TREK_LAYERS: TrekLayer[] = [
  {
    id: "LRO_WAC_Mosaic_Global_303ppd_v02",
    planet: "moon",
    label: "Surface photo (LRO WAC mosaic)",
    kind: "imagery",
    ext: "jpg",
    maxZoom: 8,
    credit: "NASA/GSFC/Arizona State University · LRO WAC global mosaic via NASA Moon Trek",
    infoUrl: "https://trek.nasa.gov/moon/TrekWS/rest/cat/metadata/fgdc/html?label=LRO_WAC_Mosaic_Global_303ppd_v02",
  },
  {
    id: "LRO_LOLA_ClrShade_Global_128ppd_v04",
    planet: "moon",
    label: "Elevation (LOLA colour shaded relief)",
    kind: "elevation",
    ext: "png",
    maxZoom: 5,
    credit: "NASA/GSFC LOLA team · colour shaded relief via NASA Moon Trek",
    infoUrl: "https://trek.nasa.gov/moon/TrekWS/rest/cat/metadata/fgdc/html?label=LRO_LOLA_ClrShade_Global_128ppd_v04",
  },
  {
    id: "Mars_Viking_MDIM21_ClrMosaic_global_232m",
    planet: "mars",
    label: "Surface photo (Viking colour mosaic)",
    kind: "imagery",
    ext: "jpg",
    maxZoom: 7,
    credit: "NASA/JPL/USGS · Viking MDIM 2.1 colour mosaic via NASA Mars Trek",
    infoUrl: "https://trek.nasa.gov/mars/TrekWS/rest/cat/metadata/fgdc/html?label=Mars_Viking_MDIM21_ClrMosaic_global_232m",
  },
  {
    id: "Mars_MGS_MOLA_ClrShade_merge_global_463m",
    planet: "mars",
    label: "Elevation (MOLA colour shaded relief)",
    kind: "elevation",
    ext: "jpg",
    maxZoom: 7,
    credit: "NASA/GSFC MOLA team · colour shaded relief via NASA Mars Trek",
    infoUrl: "https://trek.nasa.gov/mars/TrekWS/rest/cat/metadata/fgdc/html?label=Mars_MGS_MOLA_ClrShade_merge_global_463m",
  },
];

export const TILE = 256;
const BODY: Record<Planet, string> = { moon: "Moon", mars: "Mars" };

export const layersFor = (planet: Planet) => TREK_LAYERS.filter((l) => l.planet === planet);

export function tileUrl(layer: TrekLayer, z: number, row: number, col: number): string {
  return `https://trek.nasa.gov/tiles/${BODY[layer.planet]}/EQ/${layer.id}/1.0.0/default/default028mm/${z}/${row}/${col}.${layer.ext}`;
}

/** Tile grid size at level z. */
export const gridSize = (z: number) => ({ cols: 2 ** (z + 1), rows: 2 ** z });

/** Global pixel position of a coordinate at level z (x grows east, y grows south). */
export function toPixel(z: number, lat: number, lon: number): { x: number; y: number } {
  const { cols, rows } = gridSize(z);
  const l = ((((lon + 180) % 360) + 360) % 360) / 360;
  return { x: l * cols * TILE, y: ((90 - lat) / 180) * rows * TILE };
}

export function toLatLon(z: number, x: number, y: number): { lat: number; lon: number } {
  const { cols, rows } = gridSize(z);
  const w = cols * TILE;
  const wrapped = ((x % w) + w) % w;
  return { lat: 90 - (y / (rows * TILE)) * 180, lon: (wrapped / w) * 360 - 180 };
}

/** Approximate ground size of one pixel at the equator, for the scale note. */
export const RADIUS_KM: Record<Planet, number> = { moon: 1737.4, mars: 3389.5 };
export function kmPerPixel(planet: Planet, z: number): number {
  const { cols } = gridSize(z);
  return (2 * Math.PI * RADIUS_KM[planet]) / (cols * TILE);
}

/** Opening view for each planet's overview map, chosen so the sites start in view. */
export const OVERVIEW: Record<Planet, { lat: number; lon: number; zoom: number }> = {
  moon: { lat: 11, lon: 4, zoom: 3 },
  mars: { lat: 15, lon: 25, zoom: 1 },
};
