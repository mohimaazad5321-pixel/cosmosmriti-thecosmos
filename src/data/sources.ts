import type { HistoricalImage, SourceRef } from "./types";

/** NASA Image and Video Library asset (public domain, credit NASA). */
export function nasaImage(
  nasaId: string,
  size: "medium" | "small" | "orig",
  caption: string,
  date: string,
  credit = "NASA",
): HistoricalImage {
  return {
    nasaId,
    url: `https://images-assets.nasa.gov/image/${nasaId}/${nasaId}~${size}.jpg`,
    caption,
    date,
    credit,
  };
}

export const imageDetailUrl = (nasaId: string) => `https://images.nasa.gov/details/${nasaId}`;

export const src = {
  missionPage: (n: number): SourceRef => ({
    label: `Apollo ${n} mission overview`,
    publisher: "NASA",
    url: `https://www.nasa.gov/mission/apollo-${n}/`,
    kind: "nasa",
  }),
  alsj: (n: number): SourceRef => ({
    label: `Apollo ${n} Lunar Surface Journal (transcripts & photo index)`,
    publisher: "NASA Apollo Lunar Surface Journal",
    url: `https://www.hq.nasa.gov/alsj/a${n}/a${n}.html`,
    kind: "archive",
  }),
  nssdca: (id: string, name: string): SourceRef => ({
    label: `${name} — NSSDCA spacecraft record ${id}`,
    publisher: "NASA Space Science Data Coordinated Archive",
    url: `https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=${id}`,
    kind: "archive",
  }),
  scienceMission: (slug: string, name: string): SourceRef => ({
    label: `${name} mission page`,
    publisher: "NASA Science",
    url: `https://science.nasa.gov/mission/${slug}/`,
    kind: "nasa",
  }),
  apolloIndex: {
    label: "Apollo program summary & ALSEP background",
    publisher: "NASA Space Science Data Coordinated Archive",
    url: "https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo.html",
    kind: "archive",
  } as SourceRef,
  lrv: {
    label: "The Apollo Lunar Roving Vehicle — fact sheet",
    publisher: "NASA Space Science Data Coordinated Archive",
    url: "https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html",
    kind: "archive",
  } as SourceRef,
  pathfinderSummary: {
    label: "Mars Pathfinder project summary",
    publisher: "NASA Space Science Data Coordinated Archive",
    url: "https://nssdc.gsfc.nasa.gov/planetary/mesur.html",
    kind: "archive",
  } as SourceRef,
  lroc: {
    label: "Lunar Reconnaissance Orbiter Camera — Apollo site imagery",
    publisher: "LROC / Arizona State University (NASA LRO mission)",
    url: "https://www.lroc.asu.edu/",
    kind: "archive",
  } as SourceRef,
  image: (nasaId: string, title: string): SourceRef => ({
    label: `Image ${nasaId}: ${title}`,
    publisher: "NASA Image and Video Library",
    url: imageDetailUrl(nasaId),
    kind: "nasa",
  }),
};

/** Data services the project references (verified reachable during build). */
export const dataServices: SourceRef[] = [
  { label: "Moon Trek — lunar mapping portal", publisher: "NASA Solar System Treks", url: "https://trek.nasa.gov/moon/", kind: "nasa" },
  { label: "Mars Trek — Martian mapping portal", publisher: "NASA Solar System Treks", url: "https://trek.nasa.gov/mars/", kind: "nasa" },
  { label: "NASA Image and Video Library", publisher: "NASA", url: "https://images.nasa.gov/", kind: "nasa" },
  { label: "NASA Open APIs portal", publisher: "NASA", url: "https://api.nasa.gov/", kind: "nasa" },
  { label: "NASA 3D Resources", publisher: "NASA Science", url: "https://science.nasa.gov/3d-resources/", kind: "nasa" },
  { label: "Planetary Data System", publisher: "NASA PDS", url: "https://pds.nasa.gov/", kind: "archive" },
  { label: "NASA Technical Reports Server", publisher: "NASA STI Program", url: "https://ntrs.nasa.gov/", kind: "archive" },
  { label: "Apollo Lunar Surface Journal", publisher: "NASA", url: "https://www.hq.nasa.gov/alsj/", kind: "archive" },
];
