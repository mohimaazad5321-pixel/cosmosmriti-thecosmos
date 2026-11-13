export type Planet = "moon" | "mars";

/** How the hardware came to stay on another world. */
export type ArtifactStatus =
  | "left-by-design" // deliberately left behind as part of the mission plan
  | "instruments-switched-off" // a collection of instruments, later commanded off
  | "mission-ended"; // a robotic explorer that stopped communicating

export type CoordinateAccuracy =
  | "orbital-measured" // object position measured in later orbital imagery (rounded)
  | "landing-site"; // landing-site coordinate, NOT the exact object position

export type ReconstructionKind =
  | "lm-descent"
  | "alsep"
  | "lrv"
  | "pathfinder"
  | "sojourner"
  | "mer"
  | "phoenix";

export interface SourceRef {
  label: string;
  publisher: string;
  url: string;
  /** nasa = NASA-hosted page; archive = NASA-funded archive (ALSJ, NSSDCA, PDS); */
  kind: "nasa" | "archive";
}

export interface HistoricalImage {
  nasaId: string;
  url: string;
  caption: string;
  date: string; // ISO date the image was taken or released, per NASA metadata
  credit: string;
}

export interface TimelineEvent {
  date: string; // display date
  label: string;
  detail?: string;
}

export interface ArtifactComponent {
  name: string;
  purpose: string;
  how: string;
  kid: string;
}

export interface LastSignal {
  /** false = no single artifact-specific final signal exists; explain honestly */
  available: boolean;
  date?: string;
  context: string;
  whatHappened: string;
  afterward: string;
  myth?: string;
}

export interface ThenNow {
  then: HistoricalImage;
  now?: HistoricalImage;
  changed: string;
  knownToday: string;
}

export interface Artifact {
  id: string;
  number: number; // 1..10
  planet: Planet;
  officialName: string;
  shortName: string;
  missionName: string;
  missionYear: number;
  category: string;
  coordinates: { lat: number; lon: number }; // degrees, east-positive longitude
  coordinateSystem: string;
  coordinateAccuracy: CoordinateAccuracy;
  coordinateNote: string;
  landingSite: string;
  status: ArtifactStatus;
  statusExplanation: string;
  purpose: string;
  teaser: string; // one-line hook shown in archive
  story: { heading: string; text: string }[];
  scientificContribution: string;
  eli10: { paragraphs: string[]; comparison: string; question: string };
  scientist: { heading: string; text: string }[];
  didYouKnow: { front: string; back: string }[];
  timeline: TimelineEvent[];
  images: HistoricalImage[];
  thenNow: ThenNow;
  lastSignal: LastSignal;
  components: ArtifactComponent[];
  reconstruction: { kind: ReconstructionKind };
  sources: SourceRef[];
}
