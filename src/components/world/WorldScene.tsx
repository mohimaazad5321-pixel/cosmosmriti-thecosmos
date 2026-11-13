import { memo, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import type { Artifact, Planet } from "@/data/types";
import type { HiddenMemory } from "@/data/extras";
import { createTerrainModel, heightAt } from "@/game/terrain";
import { Terrain } from "./Terrain";
import { Dust, Sky, SUN_DIR } from "./Sky";
import { ArtifactMarker, HiddenGlint } from "./Markers";
import { CameraRig, type FlyRequest } from "./CameraRig";

export interface WorldSceneProps {
  planet: Planet;
  artifacts: { artifact: Artifact; xz: [number, number] }[];
  hidden: HiddenMemory[];
  discovered: string[];
  hiddenFound: string[];
  activeId: string | null;
  revealingId: string | null;
  fly: FlyRequest | null;
  lowPower: boolean;
  onSelect: (id: string) => void;
  onFindHidden: (m: HiddenMemory) => void;
  onReady: () => void;
  labelsRoot: RefObject<HTMLDivElement | null>;
  shiftPx: number;
}

function ReadySignal({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    frames.current++;
    if (frames.current === 2) onReady();
  });
  return null;
}

function Lights({ planet, lowPower }: { planet: Planet; lowPower: boolean }) {
  const sun = SUN_DIR[planet];
  return (
    <>
      <directionalLight
        position={sun}
        intensity={planet === "moon" ? 2.6 : 2.2}
        color={planet === "moon" ? "#fff8ee" : "#ffe2c4"}
        castShadow={!lowPower}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-110}
        shadow-camera-right={110}
        shadow-camera-top={110}
        shadow-camera-bottom={-110}
        shadow-camera-far={400}
        shadow-bias={-0.0004}
      />
      <ambientLight intensity={planet === "moon" ? 0.08 : 0.35} color={planet === "moon" ? "#9fb0d0" : "#f0b48a"} />
      <hemisphereLight args={[planet === "moon" ? "#7f8ca8" : "#e6b08a", planet === "moon" ? "#14161c" : "#5a3020", planet === "moon" ? 0.18 : 0.45]} />
      <Environment resolution={64}>
        <Lightformer intensity={planet === "moon" ? 1.2 : 1.6} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[12, 12, 1]} color={planet === "moon" ? "#ffffff" : "#ffd2aa"} />
        <Lightformer intensity={0.6} position={[-6, 1, -2]} rotation-y={Math.PI / 2} scale={[20, 2, 1]} color={planet === "moon" ? "#8aa0c8" : "#c86b3c"} />
      </Environment>
    </>
  );
}

function SceneContents(p: WorldSceneProps) {
  const model = useMemo(
    () => createTerrainModel(p.planet, p.artifacts.map((a) => a.xz)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [p.planet],
  );
  const start = useMemo<[number, number]>(() => {
    const xs = p.artifacts.map((a) => a.xz[0]);
    const zs = p.artifacts.map((a) => a.xz[1]);
    return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...zs) + Math.max(...zs)) / 2];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.planet]);

  return (
    <>
      <Sky planet={p.planet} />
      <Lights planet={p.planet} lowPower={p.lowPower} />
      <Terrain model={model} planet={p.planet} segments={p.lowPower ? 120 : 200} />
      <Dust planet={p.planet} count={p.lowPower ? 150 : p.planet === "mars" ? 700 : 300} />
      {p.artifacts.map(({ artifact, xz }) => (
        <ArtifactMarker
          key={artifact.id}
          artifact={artifact}
          position={[xz[0], heightAt(model, xz[0], xz[1]), xz[1]]}
          discovered={p.discovered.includes(artifact.id)}
          active={p.activeId === artifact.id}
          revealing={p.revealingId === artifact.id}
          onSelect={p.onSelect}
          labelsRoot={p.labelsRoot}
        />
      ))}
      {p.hidden.map((m) => (
        <HiddenGlint key={m.id} memory={m} position={[m.pos[0], heightAt(model, m.pos[0], m.pos[1]), m.pos[1]]} found={p.hiddenFound.includes(m.id)} onFind={p.onFindHidden} />
      ))}
      <CameraRig model={model} fly={p.fly} start={start} shiftPx={p.shiftPx} />
      <ReadySignal onReady={p.onReady} />
    </>
  );
}

/** Memoised so HUD state changes never resize or re-create the canvas. */
export const WorldScene = memo(function WorldScene(props: WorldSceneProps) {
  return (
    <Canvas
      shadows={!props.lowPower}
      dpr={props.lowPower ? 1 : [1, 1.75]}
      camera={{ fov: 50, near: 0.5, far: 900, position: [40, 30, 60] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onPointerMissed={() => (document.body.style.cursor = "")}
    >
      <SceneContents {...props} />
    </Canvas>
  );
});
