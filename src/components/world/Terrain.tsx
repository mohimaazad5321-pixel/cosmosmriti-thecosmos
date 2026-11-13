import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { Planet } from "@/data/types";
import { fbm } from "@/game/rng";
import { heightAt, type TerrainModel } from "@/game/terrain";
import { WORLD_SIZE } from "@/game/projection";
import { makeGrainTexture } from "./textures";

export function Terrain({ model, planet, segments }: { model: TerrainModel; planet: Planet; segments: number }) {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, segments, segments);
    g.rotateX(-Math.PI / 2);
    const pos = g.getAttribute("position") as THREE.BufferAttribute;
    const colors = new Float32Array(pos.count * 3);
    const col = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = heightAt(model, x, z);
      pos.setY(i, y);
      const n = fbm(x * 0.05, z * 0.05, 5, 3);
      if (planet === "moon") {
        const maria = THREE.MathUtils.smoothstep(fbm(x * 0.006 + 10, z * 0.006, 3, 4), -0.05, 0.25);
        const l = THREE.MathUtils.lerp(0.6, 0.3, maria) * (0.9 + n * 0.18) + Math.max(0, y) * 0.004;
        col.setRGB(l, l * 0.99, l * 0.97);
      } else {
        const basalt = THREE.MathUtils.smoothstep(fbm(x * 0.01 + 4, z * 0.01, 8, 4), 0.05, 0.4);
        const dust = THREE.MathUtils.smoothstep(y, 2, 7);
        col.setRGB(0.66, 0.36, 0.22);
        col.lerp(new THREE.Color(0.3, 0.19, 0.15), basalt * 0.8);
        col.lerp(new THREE.Color(0.8, 0.52, 0.34), dust * 0.5);
        col.multiplyScalar(0.92 + n * 0.16);
      }
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, [model, planet, segments]);

  const grain = useMemo(() => makeGrainTexture(planet === "moon" ? 11 : 22), [planet]);

  useEffect(() => () => {
    geometry.dispose();
    grain.dispose();
  }, [geometry, grain]);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors map={grain} roughness={1} metalness={0} />
    </mesh>
  );
}
