import type { NasaModelId } from "@/data/types";

/**
 * Authentic models from NASA 3D Resources (science.nasa.gov/3d-resources, mirrored at
 * github.com/nasa/NASA-3D-Resources). NASA states the assets are free to download and use
 * under the NASA Images and Media Usage Guidelines. Files were converted from Draco to
 * meshopt compression only; geometry and materials are unchanged.
 */
export interface NasaModelMeta {
  title: string;
  credit: string;
  pageUrl: string;
  repoPath: string;
  /** Height in world units when it stands in for a reconstruction in the 3D worlds. */
  worldHeight: number;
}

export const NASA_MODELS: Record<NasaModelId, NasaModelMeta> = {
  "apollo-lunar-module": {
    title: "Apollo Lunar Module",
    credit: "NASA/Michael D. Carbajal",
    pageUrl: "https://science.nasa.gov/3d-resources/apollo-lunar-module/",
    repoPath: "3D Models/Apollo Lunar Module/Apollo Lunar Module.glb",
    worldHeight: 2.7,
  },
  "mer-opportunity": {
    title: "Mars Exploration Rover – Opportunity (MER-B)",
    credit: "NASA/Ames Research Center",
    pageUrl: "https://science.nasa.gov/3d-resources/mars-exploration-rover-opportunity-mer-b/",
    repoPath: "3D Models/Mars Exploration Rover - Opportunity (MER-B)/Mars Exploration Rover - Opportunity (MER-B).glb",
    worldHeight: 1.9,
  },
};

/**
 * In the NASA lunar module model (native units), parts centred above this height belong to
 * the ascent stage, which lifted off; everything below is the descent stage left on the Moon.
 * The same value was used to cut the lighter descent-stage file used in the worlds.
 */
export const LM_DESCENT_TOP_Y = 2.35;

export const isDescentStagePart = (centerY: number) => centerY <= LM_DESCENT_TOP_Y;
