import { marsArtifacts } from "./artifacts-mars";
import { moonArtifacts } from "./artifacts-moon";
import type { Artifact, Planet } from "./types";

export const artifacts: Artifact[] = [...moonArtifacts, ...marsArtifacts];

export const artifactsByPlanet = (planet: Planet) => artifacts.filter((a) => a.planet === planet);

export const getArtifact = (id: string) => artifacts.find((a) => a.id === id);

export const planetMeta: Record<Planet, { name: string; tagline: string; other: Planet }> = {
  moon: { name: "The Moon", tagline: "Lunar Memory World", other: "mars" },
  mars: { name: "Mars", tagline: "Red Planet Memory World", other: "moon" },
};

export const statusLabel: Record<Artifact["status"], string> = {
  "left-by-design": "Left behind by design",
  "instruments-switched-off": "Instrument collection · switched off",
  "mission-ended": "Robotic mission · fell silent",
};
