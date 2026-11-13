import { useLayoutEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import lmFull from "@/assets/models/nasa-apollo-lunar-module.glb.asset.json";
import lmDescent from "@/assets/models/nasa-apollo-lm-descent-stage.glb.asset.json";
import merModel from "@/assets/models/nasa-mer-opportunity.glb.asset.json";
import type { NasaModelId } from "@/data/types";
import { isDescentStagePart, NASA_MODELS } from "@/game/nasaModels";

/** Which file to load. `parts` keeps every mesh separate (inspector); otherwise the lighter world file. */
export function nasaModelUrl(id: NasaModelId, opts: { descentStageOnly?: boolean; parts?: boolean }): string {
  if (id === "mer-opportunity") return merModel.url;
  if (opts.descentStageOnly && !opts.parts) return lmDescent.url;
  return lmFull.url;
}

interface Props {
  id: NasaModelId;
  descentStageOnly?: boolean;
  /** Keep separate parts (for exploded views); the world uses the lighter pre-cut file. */
  parts?: boolean;
  /** Scale to this height, centred on x/z, base on y = 0. Omit to keep native units. */
  height?: number;
  castShadow?: boolean;
  onLoaded?: (root: THREE.Object3D) => void;
}

/** Authentic NASA 3D Resources model, cloned per instance so the cached scene is never mutated. */
export function NasaModel({ id, descentStageOnly = false, parts = false, height, castShadow = true, onLoaded }: Props) {
  const url = nasaModelUrl(id, { descentStageOnly, parts });
  const { scene } = useGLTF(url);
  const root = useRef<THREE.Group>(null);

  const clone = useMemo(() => {
    const c = scene.clone(true);
    c.updateMatrixWorld(true);
    if (descentStageOnly && parts) {
      // Remove ascent-stage parts from the full model (the pre-cut world file has none).
      const box = new THREE.Box3();
      const drop: THREE.Object3D[] = [];
      c.traverse((o) => {
        if ((o as THREE.Mesh).isMesh && !isDescentStagePart(box.setFromObject(o).getCenter(new THREE.Vector3()).y)) drop.push(o);
      });
      drop.forEach((o) => o.removeFromParent());
    }
    c.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = castShadow;
        o.receiveShadow = true;
      }
    });
    if (height) {
      const b = new THREE.Box3().setFromObject(c);
      const size = b.getSize(new THREE.Vector3());
      const s = size.y > 0 ? height / size.y : 1;
      const wrapper = new THREE.Group();
      wrapper.add(c);
      c.scale.multiplyScalar(s);
      c.position.set(-((b.min.x + b.max.x) / 2) * s, -b.min.y * s, -((b.min.z + b.max.z) / 2) * s);
      return wrapper;
    }
    return c;
  }, [scene, descentStageOnly, parts, height, castShadow]);

  useLayoutEffect(() => {
    if (root.current) onLoaded?.(root.current);
  }, [clone, onLoaded]);

  return (
    <group ref={root}>
      <primitive object={clone} />
    </group>
  );
}

export const nasaModelTitle = (id: NasaModelId) => NASA_MODELS[id].title;
