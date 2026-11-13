import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ProgressState {
  discovered: string[];
  hidden: string[];
  quizBest: number | null;
  detectiveSolved: string[];
  explorerName: string;
  introSeen: boolean;
  muted: boolean;
  reduceMotion: boolean;
  discover: (id: string) => boolean; // returns true when newly discovered
  findHidden: (id: string) => boolean;
  recordQuiz: (score: number) => void;
  solveCase: (id: string) => void;
  setExplorerName: (name: string) => void;
  setIntroSeen: () => void;
  toggleMuted: () => void;
  toggleReduceMotion: () => void;
  reset: () => void;
}

const initial = {
  discovered: [] as string[],
  hidden: [] as string[],
  quizBest: null as number | null,
  detectiveSolved: [] as string[],
  explorerName: "",
  introSeen: false,
  muted: false,
  reduceMotion: false,
};

/**
 * Anonymous, device-local progress. skipHydration keeps the first client render equal to
 * the server render; ProgressHydrator in __root rehydrates after mount.
 */
export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initial,
      discover: (id) => {
        if (get().discovered.includes(id)) return false;
        set({ discovered: [...get().discovered, id] });
        return true;
      },
      findHidden: (id) => {
        if (get().hidden.includes(id)) return false;
        set({ hidden: [...get().hidden, id] });
        return true;
      },
      recordQuiz: (score) => set({ quizBest: Math.max(score, get().quizBest ?? 0) }),
      solveCase: (id) => {
        if (!get().detectiveSolved.includes(id)) set({ detectiveSolved: [...get().detectiveSolved, id] });
      },
      setExplorerName: (explorerName) => set({ explorerName: explorerName.slice(0, 32) }),
      setIntroSeen: () => set({ introSeen: true }),
      toggleMuted: () => set({ muted: !get().muted }),
      toggleReduceMotion: () => set({ reduceMotion: !get().reduceMotion }),
      reset: () => set({ ...initial, introSeen: true, muted: get().muted, reduceMotion: get().reduceMotion }),
    }),
    {
      name: "cosmosmriti-progress-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        discovered: s.discovered,
        hidden: s.hidden,
        quizBest: s.quizBest,
        detectiveSolved: s.detectiveSolved,
        explorerName: s.explorerName,
        introSeen: s.introSeen,
        muted: s.muted,
        reduceMotion: s.reduceMotion,
      }),
    },
  ),
);

/** True once local progress has been read on the client. */
export function useProgressHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => {
    const unsub = useProgress.persist.onFinishHydration(() => setH(true));
    setH(useProgress.persist.hasHydrated());
    return unsub;
  }, []);
  return h;
}

/** Whether animation should be reduced: OS setting or in-app toggle. */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return useProgress.getState().reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
