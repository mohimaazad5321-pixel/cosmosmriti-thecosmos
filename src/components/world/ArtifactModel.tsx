import { Suspense } from "react";
import type { Artifact } from "@/data/types";
import { NASA_MODELS } from "@/game/nasaModels";
import { NasaModel } from "./NasaModel";
import { Reconstruction } from "./Reconstructions";

/**
 * The object shown at an artifact's site: NASA's own 3D model when one exists (labelled in the UI),
 * otherwise the procedural reconstruction. The reconstruction also stands in while the model loads
 * and on low-power devices.
 */
export function ArtifactModel({ artifact, preferNasa }: { artifact: Artifact; preferNasa: boolean }) {
  const { kind, nasaModel } = artifact.reconstruction;
  const fallback = <Reconstruction kind={kind} />;
  if (!nasaModel || !preferNasa) return fallback;
  return (
    <Suspense fallback={fallback}>
      <NasaModel id={nasaModel.id} descentStageOnly={nasaModel.descentStageOnly ?? false} height={NASA_MODELS[nasaModel.id].worldHeight} />
    </Suspense>
  );
}

/** Whether the object a visitor sees for this artifact is NASA's model (true) or a reconstruction. */
export const showsNasaModel = (a: Artifact, lowPower: boolean) => !!a.reconstruction.nasaModel && !lowPower;
