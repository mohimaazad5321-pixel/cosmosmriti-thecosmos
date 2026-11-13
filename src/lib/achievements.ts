import { artifacts } from "@/data/artifacts";
import { detectiveCases, hiddenMemories, quiz } from "@/data/extras";
import type { Planet } from "@/data/types";

export interface ProgressSnapshot {
  discovered: string[];
  hidden: string[];
  quizBest: number | null;
  detectiveSolved: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export const QUIZ_ACE_SCORE = 8;

export function countByPlanet(discovered: string[], planet: Planet) {
  const ids = new Set(discovered);
  return artifacts.filter((a) => a.planet === planet && ids.has(a.id)).length;
}

export const totalByPlanet = (planet: Planet) => artifacts.filter((a) => a.planet === planet).length;

export function computeAchievements(p: ProgressSnapshot): Achievement[] {
  const moon = countByPlanet(p.discovered, "moon");
  const mars = countByPlanet(p.discovered, "mars");
  const validDiscovered = moon + mars;
  return [
    { id: "first-memory", title: "First Signal", description: "Recover your first memory.", unlocked: validDiscovered >= 1 },
    { id: "two-worlds", title: "Two Worlds", description: "Recover a memory on both the Moon and Mars.", unlocked: moon >= 1 && mars >= 1 },
    { id: "lunar-archivist", title: "Lunar Archivist", description: `Recover all ${totalByPlanet("moon")} Moon memories.`, unlocked: moon === totalByPlanet("moon") },
    { id: "red-planet-archivist", title: "Red Planet Archivist", description: `Recover all ${totalByPlanet("mars")} Mars memories.`, unlocked: mars === totalByPlanet("mars") },
    { id: "memory-keeper", title: "Cosmic Memory Keeper", description: `Recover all ${artifacts.length} memories.`, unlocked: validDiscovered === artifacts.length },
    { id: "hidden-seeker", title: "Hidden Seeker", description: "Find 3 hidden memories in the worlds.", unlocked: p.hidden.filter((h) => hiddenMemories.some((m) => m.id === h)).length >= 3 },
    { id: "quiz-ace", title: "Quiz Ace", description: `Score ${QUIZ_ACE_SCORE} or more out of ${quiz.length} in the Cosmic Quiz.`, unlocked: (p.quizBest ?? 0) >= QUIZ_ACE_SCORE },
    { id: "detective", title: "Artifact Detective", description: `Solve all ${detectiveCases.length} detective cases.`, unlocked: detectiveCases.every((c) => p.detectiveSolved.includes(c.id)) },
  ];
}
