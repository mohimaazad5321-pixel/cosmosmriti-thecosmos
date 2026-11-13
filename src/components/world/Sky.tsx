import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import type { Planet } from "@/data/types";
import { makeEarthTexture, makeGlowTexture } from "./textures";

export const SUN_DIR: Record<Planet, [number, number, number]> = {
  moon: [90, 32, 30],
  mars: [-85, 42, 50],
};

function MarsSkyDome() {
  const geo = useMemo(() => {
    const g = new THREE.SphereGeometry(420, 32, 16);
    const pos = g.getAttribute("position") as THREE.BufferAttribute;
    const colors = new Float32Array(pos.count * 3);
    const horizon = new THREE.Color("#d9a27a");
    const zenith = new THREE.Color("#6e4a3a");
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const t = THREE.MathUtils.clamp(pos.getY(i) / 420, 0, 1);
      c.copy(horizon).lerp(zenith, Math.pow(t, 0.6));
      colors.set([c.r, c.g, c.b], i * 3);
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo}>
      <meshBasicMaterial vertexColors side={THREE.BackSide} fog={false} depthWrite={false} />
    </mesh>
  );
}

function Earth() {
  const tex = useMemo(() => makeEarthTexture(), []);
  const ref = useRef<THREE.Mesh>(null);
  useEffect(() => () => tex.dispose(), [tex]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += Math.min(dt, 0.05) * 0.02;
  });
  return (
    <group position={[-60, 14, -300]}>
      <mesh ref={ref}>
        <sphereGeometry args={[16, 48, 24]} />
        <meshStandardMaterial map={tex} roughness={0.8} fog={false} />
      </mesh>
      <mesh scale={1.08}>
        <sphereGeometry args={[16, 32, 16]} />
        <meshBasicMaterial color="#6fa8ff" transparent opacity={0.12} side={THREE.BackSide} fog={false} />
      </mesh>
    </group>
  );
}

function SunGlow({ planet }: { planet: Planet }) {
  const tex = useMemo(() => makeGlowTexture(), []);
  useEffect(() => () => tex.dispose(), [tex]);
  const d = new THREE.Vector3(...SUN_DIR[planet]).normalize().multiplyScalar(380);
  return (
    <sprite position={d} scale={planet === "moon" ? [60, 60, 1] : [45, 45, 1]}>
      <spriteMaterial map={tex} color={planet === "moon" ? "#fff6e6" : "#fff1d6"} transparent depthWrite={false} fog={false} blending={THREE.AdditiveBlending} />
    </sprite>
  );
}

/** Drifting dust motes near the ground. */
export function Dust({ planet, count }: { planet: Planet; count: number }) {
  const tex = useMemo(() => makeGlowTexture(), []);
  const { geo, speeds } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 180;
      p[i * 3 + 1] = Math.random() * 18;
      p[i * 3 + 2] = (Math.random() - 0.5) * 180;
      s[i] = 0.3 + Math.random();
    }
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return { geo: g, speeds: s };
  }, [count]);
  useEffect(() => () => { geo.dispose(); tex.dispose(); }, [geo, tex]);
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const a = geo.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let x = a.getX(i) + (planet === "mars" ? 1.6 : 0.15) * (speeds[i] ?? 1) * dt;
      let y = a.getY(i) + Math.sin(x * 0.05 + i) * 0.02;
      if (x > 90) x = -90;
      if (y > 18) y = 0;
      a.setXY(i, x, y);
    }
    a.needsUpdate = true;
  });
  return (
    <points geometry={geo}>
      <pointsMaterial
        map={tex}
        size={planet === "mars" ? 0.45 : 0.25}
        color={planet === "mars" ? "#e7b38a" : "#d9dde6"}
        transparent
        opacity={planet === "mars" ? 0.55 : 0.35}
        depthWrite={false}
      />
    </points>
  );
}

export function Sky({ planet }: { planet: Planet }) {
  if (planet === "moon") {
    return (
      <>
        <color attach="background" args={["#020307"]} />
        <fog attach="fog" args={["#020307", 130, 245]} />
        <Stars radius={320} depth={60} count={3500} factor={5} saturation={0.1} fade speed={0.3} />
        <Earth />
        <SunGlow planet="moon" />
      </>
    );
  }
  return (
    <>
      <color attach="background" args={["#c99474"]} />
      <fog attach="fog" args={["#cf9a77", 80, 225]} />
      <MarsSkyDome />
      <SunGlow planet="mars" />
    </>
  );
}
