import { memo, Suspense, useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Artifact, Vec3 } from "@/data/types";
import { ease, EXPLODE_EASE, EXPLODE_ZOOM_OUT, explodeOffset, fitScale, type V3 } from "@/game/explode";
import { NasaModel } from "@/components/world/NasaModel";
import { Reconstruction } from "@/components/world/Reconstructions";
import { makeGrainTexture } from "@/components/world/textures";
import { cn } from "@/lib/utils";

/** Models are scaled so their bounding sphere has this radius, whatever their native units. */
const FIT_RADIUS = 2.6;
const CAMERA_START: V3 = [5.2, 3.4, 6.2];

export type ModelSource = "nasa" | "reconstruction";

export interface Hotspot {
  index: number;
  name: string;
  at: Vec3;
}

export interface InspectSceneProps {
  artifact: Artifact;
  source: ModelSource;
  descentStageOnly: boolean;
  explode: number;
  autoRotate: boolean;
  reducedMotion: boolean;
  hotspots: Hotspot[];
  selected: number | null;
  onSelect: (index: number | null) => void;
  resetNonce: number;
  onReady: () => void;
}

interface Part {
  obj: THREE.Object3D;
  base: THREE.Vector3;
  off: THREE.Vector3;
}

type ButtonRefs = MutableRefObject<(HTMLButtonElement | null)[]>;

/**
 * Frames the model, then drives the exploded view and the hotspot buttons from refs (no React state
 * per frame). Hotspots are plain DOM buttons projected onto the canvas each frame; each one follows
 * the part it sits on when the model is taken apart.
 */
function ModelRig({ children, explode, reducedMotion, hotspots, buttons, onFramed }: {
  children: ReactNode;
  explode: number;
  reducedMotion: boolean;
  hotspots: Hotspot[];
  buttons: ButtonRefs;
  onFramed: (height: number) => void;
}) {
  const fit = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const parts = useRef<Part[]>([]);
  /** Per hotspot: offset (inner-local units) at full explosion, borrowed from the part it sits on. */
  const hotOff = useRef<THREE.Vector3[]>([]);
  const t = useRef(-1);
  /** Framing at rest: scale and the native-space point that sits at the origin. */
  const frame = useRef({ s: 1, cx: 0, minY: 0, cz: 0 });
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const { camera, size } = useThree();

  useLayoutEffect(() => {
    const f = fit.current;
    const m = inner.current;
    if (!f || !m) return;
    f.scale.setScalar(1);
    f.position.set(0, 0, 0);
    f.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(m);
    const bsize = box.getSize(new THREE.Vector3());
    const c = box.getCenter(new THREE.Vector3());
    const s = fitScale([bsize.x, bsize.y, bsize.z], FIT_RADIUS);
    f.scale.setScalar(s);
    f.position.set(-c.x * s, -box.min.y * s, -c.z * s);
    f.updateMatrixWorld(true);
    frame.current = { s, cx: c.x, minY: box.min.y, cz: c.z };

    // parts spread out sideways from the centre and upward from the ground, so nothing sinks below it
    const wbox = new THREE.Box3().setFromObject(m);
    const wc = wbox.getCenter(new THREE.Vector3()).setY(wbox.min.y);
    const list: (Part & { box: THREE.Box3; world: THREE.Vector3 })[] = [];
    m.traverse((o) => {
      if (!(o as THREE.Mesh).isMesh || !o.parent) return;
      const pbox = new THREE.Box3().setFromObject(o);
      const pc = pbox.getCenter(new THREE.Vector3());
      const [ox, oy, oz] = explodeOffset([wc.x, wc.y, wc.z], [pc.x, pc.y, pc.z], 1);
      const world = new THREE.Vector3(ox, oy, oz);
      const wp = o.getWorldPosition(new THREE.Vector3());
      const a = o.parent.worldToLocal(wp.clone());
      const b = o.parent.worldToLocal(wp.clone().add(world));
      list.push({ obj: o, base: o.position.clone(), off: b.sub(a), box: pbox, world });
    });
    parts.current = list;

    // each hotspot moves with the smallest part containing it (or the nearest part)
    hotOff.current = hotspots.map((h) => {
      const p = f.localToWorld(new THREE.Vector3(...h.at));
      let best: (typeof list)[number] | null = null;
      let bestScore = Infinity;
      for (const part of list) {
        const inside = part.box.containsPoint(p);
        const sz = part.box.getSize(new THREE.Vector3());
        const score = inside ? sz.x * sz.y * sz.z : 1e6 + part.box.distanceToPoint(p);
        if (score < bestScore) {
          bestScore = score;
          best = part;
        }
      }
      return best ? best.world.clone().divideScalar(s) : new THREE.Vector3();
    });
    t.current = -1;
    onFramed(bsize.y * s);
    return () => {
      list.forEach((p) => p.obj.position.copy(p.base));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, delta) => {
    const f = fit.current;
    if (!f) return;
    const prev = t.current < 0 ? 0 : t.current;
    let next = reducedMotion ? explode : ease(prev, explode, EXPLODE_EASE, delta);
    if (Math.abs(next - explode) < 1e-3) next = explode;
    if (next !== t.current) {
      t.current = next;
      for (const p of parts.current) p.obj.position.copy(p.base).addScaledVector(p.off, next);
      // pull back as the model comes apart so the pieces stay in view
      const { s, cx, minY, cz } = frame.current;
      const k = s / (1 + EXPLODE_ZOOM_OUT * next);
      f.scale.setScalar(k);
      f.position.set(-cx * k, -minY * k, -cz * k);
    }
    hotspots.forEach((h, i) => {
      const el = buttons.current[i];
      if (!el) return;
      const off = hotOff.current[i];
      tmp.set(h.at[0], h.at[1], h.at[2]);
      if (off) tmp.addScaledVector(off, t.current);
      f.localToWorld(tmp);
      tmp.project(camera);
      const visible = tmp.z < 1 && Math.abs(tmp.x) < 1.2 && Math.abs(tmp.y) < 1.2;
      el.style.opacity = visible ? "1" : "0";
      el.style.pointerEvents = visible ? "auto" : "none";
      el.style.transform = `translate(-50%, -50%) translate(${((tmp.x + 1) / 2) * size.width}px, ${((1 - tmp.y) / 2) * size.height}px)`;
    });
  });

  return (
    <group ref={fit}>
      <group ref={inner}>{children}</group>
    </group>
  );
}

function CameraReset({ nonce, target }: { nonce: number; target: number }) {
  const { camera, controls } = useThree();
  useEffect(() => {
    camera.position.set(...CAMERA_START);
    const c = controls as unknown as OrbitControlsImpl | null;
    if (c) {
      c.target.set(0, target, 0);
      c.update();
    } else {
      camera.lookAt(0, target, 0);
    }
  }, [nonce, target, camera, controls]);
  return null;
}

function Ground({ moon }: { moon: boolean }) {
  const tex = useMemo(() => {
    const t = makeGrainTexture(moon ? 7 : 11);
    t.repeat.set(5, 5);
    return t;
  }, [moon]);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[9, 64]} />
      <meshStandardMaterial map={tex} color={moon ? "#8d8f94" : "#9a5a3c"} roughness={0.95} metalness={0} />
    </mesh>
  );
}

function ReadyAfterFrame({ onReady, armed }: { onReady: () => void; armed: boolean }) {
  const done = useRef(false);
  useFrame(() => {
    if (armed && !done.current) {
      done.current = true;
      onReady();
    }
  });
  return null;
}

function Contents(p: SceneProps & { buttons: ButtonRefs }) {
  const moon = p.artifact.planet === "moon";
  const nasa = p.artifact.reconstruction.nasaModel;
  const modelKey = `${p.source}-${p.descentStageOnly}`;
  const model =
    p.source === "nasa" && nasa ? (
      <NasaModel id={nasa.id} descentStageOnly={p.descentStageOnly} parts />
    ) : (
      <Reconstruction kind={p.artifact.reconstruction.kind} />
    );
  return (
    <>
      <color attach="background" args={[moon ? "#07080b" : "#140906"]} />
      <fog attach="fog" args={[moon ? "#07080b" : "#140906", 14, 26]} />
      <directionalLight position={[6, 9, 4]} intensity={moon ? 2.4 : 2} color={moon ? "#fff8ee" : "#ffe2c4"} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0005} />
      <ambientLight intensity={moon ? 0.25 : 0.4} />
      <hemisphereLight args={[moon ? "#9aa6c0" : "#e8b08a", moon ? "#1a1c22" : "#4a2416", 0.5]} />
      <Environment resolution={64}>
        <Lightformer intensity={1.6} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[12, 12, 1]} color="#ffffff" />
        <Lightformer intensity={0.8} position={[-6, 2, -2]} rotation-y={Math.PI / 2} scale={[20, 3, 1]} color={moon ? "#8aa0c8" : "#d0703f"} />
        <Lightformer intensity={0.6} position={[6, 2, 3]} rotation-y={-Math.PI / 2} scale={[20, 3, 1]} color="#ffe6c8" />
      </Environment>
      <Ground moon={moon} />
      <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={12} blur={2.4} far={6} resolution={512} />
      {/* No Html in the fallback: drei's Html unmounting mid-render breaks React. The page shows a loading chip. */}
      <Suspense fallback={null}>
        <ModelRig
          key={modelKey}
          explode={p.explode}
          reducedMotion={p.reducedMotion}
          hotspots={p.hotspots}
          buttons={p.buttons}
          onFramed={p.setFramedHeight}
        >
          {model}
        </ModelRig>
      </Suspense>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        autoRotate={p.autoRotate}
        autoRotateSpeed={0.9}
        minDistance={3}
        maxDistance={16}
        maxPolarAngle={Math.PI / 2 - 0.04}
        target={[0, p.framedHeight / 2, 0]}
      />
      <CameraReset nonce={p.resetNonce} target={p.framedHeight / 2} />
      <ReadyAfterFrame onReady={p.onReady} armed={p.framedHeight > 0} />
    </>
  );
}

type SceneProps = InspectSceneProps & { framedHeight: number; setFramedHeight: (h: number) => void };

/** Memoised so panel state (selected part text, toggles) never re-creates the canvas. */
export const InspectScene = memo(function InspectScene(props: SceneProps) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ fov: 40, near: 0.1, far: 80, position: CAMERA_START }}
        gl={{ antialias: true }}
        onPointerMissed={() => props.onSelect(null)}
      >
        <Contents {...props} buttons={buttons} />
      </Canvas>
      {/* hotspot buttons, positioned every frame by ModelRig */}
      <div className="pointer-events-none absolute inset-0">
        {props.hotspots.map((h, i) => (
          <button
            key={`${props.source}-${h.index}`}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            type="button"
            onClick={() => props.onSelect(props.selected === h.index ? null : h.index)}
            aria-label={`Part ${h.index + 1}: ${h.name}`}
            aria-pressed={props.selected === h.index}
            style={{ opacity: 0 }}
            className={cn(
              "absolute left-0 top-0 flex size-9 items-center justify-center rounded-full border-2 font-mono text-xs font-semibold shadow-lg transition-[opacity,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              props.selected === h.index ? "z-10 border-primary bg-primary text-primary-foreground ring-4 ring-primary/30" : "border-primary/80 bg-background/85 text-primary hover:bg-background",
            )}
          >
            {h.index + 1}
          </button>
        ))}
      </div>
    </div>
  );
});
