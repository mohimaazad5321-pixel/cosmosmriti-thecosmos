import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { heightAt, type TerrainModel } from "@/game/terrain";
import { prefersReducedMotion } from "@/lib/progress";

export interface FlyRequest {
  x: number;
  z: number;
  distance: number;
  nonce: number;
}

const MOVE_SPEED = 28; // world units per second
const FLY_SECONDS = 1.6;
const LIMIT = 88;

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Orbit camera + camera-relative WASD/arrow movement + cinematic fly-to. */
export function CameraRig({ model, fly, start, shiftPx }: { model: TerrainModel; fly: FlyRequest | null; start: [number, number]; shiftPx: number }) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera, size } = useThree();
  const shift = useRef(0);
  const keys = useRef(new Set<string>());
  const anim = useRef<{ t: number; fromPos: THREE.Vector3; toPos: THREE.Vector3; fromTgt: THREE.Vector3; toTgt: THREE.Vector3 } | null>(null);

  // initial framing
  useEffect(() => {
    const y = heightAt(model, start[0], start[1]);
    camera.position.set(start[0] + 6, y + 78, start[1] + 122);
    controls.current?.target.set(start[0], y, start[1]);
    controls.current?.update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      keys.current.add(e.key.toLowerCase());
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    const blur = () => keys.current.clear();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);

  useEffect(() => {
    if (!fly || !controls.current) return;
    const tgtY = heightAt(model, fly.x, fly.z) + 1.2;
    const toTgt = new THREE.Vector3(fly.x, tgtY, fly.z);
    // keep the current viewing direction, but come closer
    const dir = camera.position.clone().sub(controls.current.target).setY(0);
    if (dir.lengthSq() < 0.01) dir.set(0.6, 0, 1);
    dir.normalize();
    const toPos = toTgt.clone().add(dir.multiplyScalar(fly.distance)).setY(tgtY + fly.distance * 0.55);
    if (prefersReducedMotion()) {
      camera.position.copy(toPos);
      controls.current.target.copy(toTgt);
      controls.current.update();
      return;
    }
    anim.current = { t: 0, fromPos: camera.position.clone(), toPos, fromTgt: controls.current.target.clone(), toTgt };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fly?.nonce]);

  useFrame((_, delta) => {
    const c = controls.current;
    if (!c) return;
    const dt = Math.min(delta, 0.05);

    if (anim.current) {
      const a = anim.current;
      a.t = Math.min(1, a.t + dt / FLY_SECONDS);
      const k = ease(a.t);
      // arc upward mid-flight for a cinematic swoop
      const lift = Math.sin(k * Math.PI) * 10;
      camera.position.lerpVectors(a.fromPos, a.toPos, k).setY(THREE.MathUtils.lerp(a.fromPos.y, a.toPos.y, k) + lift);
      c.target.lerpVectors(a.fromTgt, a.toTgt, k);
      if (a.t >= 1) anim.current = null;
    } else {
      const k = keys.current;
      let fx = 0;
      let rx = 0;
      if (k.has("w") || k.has("arrowup")) fx += 1;
      if (k.has("s") || k.has("arrowdown")) fx -= 1;
      if (k.has("d") || k.has("arrowright")) rx += 1;
      if (k.has("a") || k.has("arrowleft")) rx -= 1;
      if (fx || rx) {
        const forward = c.target.clone().sub(camera.position).setY(0).normalize();
        const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();
        const move = forward.multiplyScalar(fx).add(right.multiplyScalar(rx)).normalize().multiplyScalar(MOVE_SPEED * dt);
        const nx = THREE.MathUtils.clamp(c.target.x + move.x, -LIMIT, LIMIT);
        const nz = THREE.MathUtils.clamp(c.target.z + move.z, -LIMIT, LIMIT);
        const dx = nx - c.target.x;
        const dz = nz - c.target.z;
        const ny = heightAt(model, nx, nz) + 1.2;
        const dy = ny - c.target.y;
        c.target.set(nx, ny, nz);
        camera.position.x += dx;
        camera.position.z += dz;
        camera.position.y += dy;
      }
    }
    c.update();
    // slide the view so the focused artifact stays visible beside an open side panel
    const want = shiftPx;
    shift.current += (want - shift.current) * Math.min(1, dt * 5);
    const pc = camera as THREE.PerspectiveCamera;
    if (Math.abs(shift.current) > 0.5) pc.setViewOffset(size.width, size.height, shift.current, 0, size.width, size.height);
    else if (pc.view?.enabled) pc.clearViewOffset();
    // never dip below the ground
    const ground = heightAt(model, camera.position.x, camera.position.z) + 1.5;
    if (camera.position.y < ground) camera.position.y = ground;
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={6}
      maxDistance={150}
      maxPolarAngle={Math.PI * 0.47}
      screenSpacePanning={false}
    />
  );
}
