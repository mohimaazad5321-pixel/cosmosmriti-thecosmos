import { describe, expect, it } from "vitest";
import { artifacts, artifactsByPlanet } from "@/data/artifacts";
import { computeAchievements, QUIZ_ACE_SCORE } from "@/lib/achievements";
import { toWorld } from "@/game/projection";

const moonIds = artifactsByPlanet("moon").map((a) => a.id);
const marsIds = artifactsByPlanet("mars").map((a) => a.id);
const base = { discovered: [] as string[], hidden: [] as string[], quizBest: null as number | null, detectiveSolved: [] as string[] };
const unlocked = (p: typeof base, id: string) => computeAchievements(p).find((a) => a.id === id)!.unlocked;

describe("collection rules", () => {
  it("has ten memories: five on the Moon and five on Mars", () => {
    expect(artifacts).toHaveLength(10);
    expect(moonIds).toHaveLength(5);
    expect(marsIds).toHaveLength(5);
  });

  it("numbers memories 1 to 10 without gaps", () => {
    expect(artifacts.map((a) => a.number).sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("places Pathfinder and Sojourner at the same landing site", () => {
    const pf = artifacts.find((a) => a.id === "mars-pathfinder")!;
    const so = artifacts.find((a) => a.id === "sojourner")!;
    expect(so.coordinates).toEqual(pf.coordinates);
  });

  it("gives every memory at least one source reference", () => {
    for (const a of artifacts) expect(a.sources.length).toBeGreaterThan(0);
  });
});

describe("achievements", () => {
  it("Lunar Archivist needs all five Moon memories", () => {
    expect(unlocked({ ...base, discovered: moonIds.slice(0, 4) }, "lunar-archivist")).toBe(false);
    expect(unlocked({ ...base, discovered: moonIds }, "lunar-archivist")).toBe(true);
  });

  it("Memory Keeper needs all ten memories", () => {
    expect(unlocked({ ...base, discovered: [...moonIds, ...marsIds.slice(0, 4)] }, "memory-keeper")).toBe(false);
    expect(unlocked({ ...base, discovered: [...moonIds, ...marsIds] }, "memory-keeper")).toBe(true);
  });

  it("Two Worlds needs one memory on each planet", () => {
    expect(unlocked({ ...base, discovered: moonIds.slice(0, 2) }, "two-worlds")).toBe(false);
    expect(unlocked({ ...base, discovered: [moonIds[0]!, marsIds[0]!] }, "two-worlds")).toBe(true);
  });

  it("Quiz Ace needs a score of 8 or more", () => {
    expect(QUIZ_ACE_SCORE).toBe(8);
    expect(unlocked({ ...base, quizBest: 7 }, "quiz-ace")).toBe(false);
    expect(unlocked({ ...base, quizBest: 8 }, "quiz-ace")).toBe(true);
  });

  it("ignores unknown ids in saved progress", () => {
    expect(unlocked({ ...base, discovered: ["not-a-real-memory"] }, "first-memory")).toBe(false);
  });
});

describe("world projection", () => {
  it("keeps every artifact inside the explorable area", () => {
    for (const a of artifacts) {
      const [x, z] = toWorld(a.planet, a.coordinates.lat, a.coordinates.lon);
      expect(Math.abs(x)).toBeLessThan(88);
      expect(Math.abs(z)).toBeLessThan(88);
    }
  });

  it("keeps north up and east to the right", () => {
    const [, zNorth] = toWorld("moon", 26, 0);
    const [, zSouth] = toWorld("moon", -3, 0);
    expect(zNorth).toBeLessThan(zSouth);
    const [xEast] = toWorld("moon", 0, 30);
    const [xWest] = toWorld("moon", 0, -20);
    expect(xEast).toBeGreaterThan(xWest);
  });
});
