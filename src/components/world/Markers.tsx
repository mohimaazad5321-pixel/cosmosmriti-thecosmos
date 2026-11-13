import { useRef, useState, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Artifact } from "@/data/types";
import type { HiddenMemory } from "@/data/extras";
import { cn } from "@/lib/utils";
import { Reconstruction } from "./Reconstructions";

const SIGNAL = "#f2c063";
const PLANET_TINT = { moon: "#dfe6f2", mars: "#ff9a62" };

interface MarkerProps {
  artifact: Artifact;
  position: [number, number, number];
  discovered: boolean;
  active: boolean;
  revealing: boolean;
  onSelect: (id: string) => void;
  labelsRoot: RefObject<HTMLDivElement | null>;
}

export function ArtifactMarker({ artifact, position, discovered, active, revealing, onSelect, labelsRoot }: MarkerProps) {
  const ring = useRef<THREE.Mesh>(null);
  const gem = useRef<THREE.Mesh>(null);
  const beam = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  const tint = discovered ? PLANET_TINT[artifact.planet] : SIGNAL;
  const showModel = discovered || revealing;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ring.current) {
      const k = (t * 0.6 + artifact.number * 0.13) % 1;
      ring.current.scale.setScalar(1 + k * 3.5);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - k) * (discovered ? 0.25 : 0.7);
    }
    if (gem.current) {
      gem.current.rotation.y = t * 0.8;
      gem.current.position.y = 4.2 + Math.sin(t * 1.6 + artifact.number) * 0.35;
      const s = revealing ? 1 + Math.sin(t * 20) * 0.25 : hover ? 1.25 : 1;
      gem.current.scale.setScalar(s);
    }
    if (beam.current) {
      (beam.current.material as THREE.MeshBasicMaterial).opacity = (discovered ? 0.08 : 0.18) + Math.sin(t * 2 + artifact.number) * 0.05 + (revealing ? 0.3 : 0);
    }
  });

  const handle = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onSelect(artifact.id);
  };

  return (
    <group position={position}>
      {showModel && (
        <group onClick={handle} onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; }} onPointerOut={() => { setHover(false); document.body.style.cursor = ""; }}>
          <Reconstruction kind={artifact.reconstruction.kind} />
        </group>
      )}
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <ringGeometry args={[0.9, 1.05, 48]} />
        <meshBasicMaterial color={tint} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={beam} position={[0, 10, 0]}>
        <cylinderGeometry args={[0.18, 0.5, 20, 16, 1, true]} />
        <meshBasicMaterial color={tint} transparent opacity={0.15} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      {/* the clickable signal */}
      <mesh
        ref={gem}
        position={[0, 4.2, 0]}
        onClick={handle}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHover(false); document.body.style.cursor = ""; }}
      >
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color={tint} emissive={tint} emissiveIntensity={discovered ? 0.6 : 1.6} roughness={0.3} metalness={0.2} toneMapped={false} />
      </mesh>
      {/* invisible, generous hit area for touch */}
      <mesh position={[0, 3, 0]} onClick={handle} visible={false}>
        <cylinderGeometry args={[2.2, 2.2, 7, 8]} />
        <meshBasicMaterial />
      </mesh>
      <Html position={[0, 6.2, 0]} center portal={labelsRoot as RefObject<HTMLElement>} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
        <div
          className={cn(
            "hud-chip whitespace-nowrap transition-all duration-300",
            discovered ? (artifact.planet === "moon" ? "text-moon" : "text-mars") : "text-primary",
            hover || active || revealing ? "scale-110 opacity-100" : discovered ? "opacity-80" : "opacity-70",
          )}
        >
          {discovered ? (
            <>
              <span className="text-muted-foreground">{String(artifact.number).padStart(2, "0")}</span>
              {artifact.shortName} · {artifact.missionYear}
            </>
          ) : hover || revealing ? (
            <>Unknown memory detected</>
          ) : (
            <>? · {artifact.missionYear}</>
          )}
        </div>
      </Html>
    </group>
  );
}

export function HiddenGlint({ memory, position, found, onFind }: { memory: HiddenMemory; position: [number, number, number]; found: boolean; onFind: (m: HiddenMemory) => void }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const tw = 0.5 + 0.5 * Math.sin(t * 3 + position[0]);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = found ? 0.15 : 0.25 + tw * 0.6;
    ref.current.rotation.y = t;
  });
  return (
    <mesh
      ref={ref}
      position={[position[0], position[1] + 0.8, position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onFind(memory);
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      <octahedronGeometry args={[0.35, 0]} />
      <meshBasicMaterial color="#e8f1ff" transparent toneMapped={false} />
    </mesh>
  );
}
