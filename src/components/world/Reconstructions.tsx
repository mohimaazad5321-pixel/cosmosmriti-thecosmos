import type { ReconstructionKind } from "@/data/types";

/**
 * Educational reconstructions built from simple shapes. They convey overall form and
 * major parts; they are NOT authentic NASA models and are labelled as such in the UI.
 */
const M = {
  foil: { color: "#c8952e", metalness: 0.85, roughness: 0.32 },
  foilDark: { color: "#7a5a20", metalness: 0.8, roughness: 0.4 },
  silver: { color: "#cfd4da", metalness: 0.9, roughness: 0.28 },
  white: { color: "#e9e6df", metalness: 0.05, roughness: 0.6 },
  black: { color: "#1b1d22", metalness: 0.3, roughness: 0.6 },
  solar: { color: "#1c2747", metalness: 0.6, roughness: 0.25 },
  airbag: { color: "#d8cdb8", metalness: 0, roughness: 0.9 },
};

type Mat = keyof typeof M;
const mat = (k: Mat) => <meshStandardMaterial {...M[k]} />;

function Leg({ angle, reach = 2.1, height = 1.6 }: { angle: number; reach?: number; height?: number }) {
  const x = Math.cos(angle);
  const z = Math.sin(angle);
  const len = Math.hypot(reach - 1, height);
  const tilt = Math.atan2(reach - 1, height);
  return (
    <group>
      <mesh position={[x * (1 + (reach - 1) / 2), height / 2 + 0.2, z * (1 + (reach - 1) / 2)]} rotation={[z * tilt, 0, -x * tilt]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, len, 8]} />
        {mat("silver")}
      </mesh>
      <mesh position={[x * reach, 0.06, z * reach]} castShadow>
        <cylinderGeometry args={[0.38, 0.42, 0.1, 16]} />
        {mat("silver")}
      </mesh>
    </group>
  );
}

function LMDescent() {
  return (
    <group>
      <mesh position={[0, 1.9, 0]} castShadow>
        <cylinderGeometry args={[1.45, 1.45, 1.4, 8]} />
        {mat("foil")}
      </mesh>
      <mesh position={[0, 2.64, 0]} castShadow>
        <cylinderGeometry args={[1.3, 1.45, 0.08, 8]} />
        {mat("foilDark")}
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <coneGeometry args={[0.55, 0.8, 24, 1, true]} />
        {mat("black")}
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <Leg key={i} angle={Math.PI / 4 + (i * Math.PI) / 2} reach={2.5} height={1.8} />
      ))}
      {/* ladder */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[1.62, 0.5 + i * 0.3, 0]} castShadow>
          <boxGeometry args={[0.05, 0.04, 0.5]} />
          {mat("silver")}
        </mesh>
      ))}
      {/* plaque */}
      <mesh position={[1.47, 1.9, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.45, 0.3]} />
        {mat("silver")}
      </mesh>
    </group>
  );
}

function ALSEP() {
  return (
    <group>
      {/* central station with sunshade */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.9, 0.5, 0.6]} />
        {mat("white")}
      </mesh>
      <mesh position={[0, 0.85, 0]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[1.1, 0.03, 0.8]} />
        {mat("silver")}
      </mesh>
      <mesh position={[0.2, 1.2, -0.2]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 6]} />
        {mat("silver")}
      </mesh>
      {/* RTG with fins */}
      <group position={[-2.6, 0, 0.8]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.7, 12]} />
          {mat("black")}
        </mesh>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[Math.cos((i * Math.PI) / 4) * 0.28, 0.45, Math.sin((i * Math.PI) / 4) * 0.28]} rotation={[0, -(i * Math.PI) / 4, 0]} castShadow>
            <boxGeometry args={[0.18, 0.66, 0.02]} />
            {mat("black")}
          </mesh>
        ))}
      </group>
      {/* seismometer dome */}
      <mesh position={[2.3, 0.05, 1.4]} castShadow>
        <sphereGeometry args={[0.32, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        {mat("silver")}
      </mesh>
      <mesh position={[2.3, 0.02, 1.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.8, 24]} />
        {mat("silver")}
      </mesh>
      {/* magnetometer: three arms */}
      <group position={[1.8, 0.5, -1.8]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[0, (i * Math.PI * 2) / 3, Math.PI / 2]} position={[Math.cos((i * Math.PI * 2) / 3) * 0.4, 0, -Math.sin((i * Math.PI * 2) / 3) * 0.4]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.8, 6]} />
            {mat("white")}
          </mesh>
        ))}
        <mesh position={[0, -0.25, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.5, 6]} />
          {mat("silver")}
        </mesh>
      </group>
      {/* other instrument box */}
      <mesh position={[-1.6, 0.25, -1.6]} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.4]} />
        {mat("foil")}
      </mesh>
      {/* cables */}
      {([[-2.6, 0.8], [2.3, 1.4], [1.8, -1.8], [-1.6, -1.6]] as const).map(([x, z], i) => (
        <mesh key={i} position={[x / 2, 0.03, z / 2]} rotation={[0, -Math.atan2(z, x), Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, Math.hypot(x, z), 4]} />
          {mat("white")}
        </mesh>
      ))}
    </group>
  );
}

function WireWheel({ position, r = 0.41 }: { position: [number, number, number]; r?: number }) {
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      <mesh castShadow>
        <torusGeometry args={[r, 0.09, 8, 24]} />
        <meshStandardMaterial color="#8f8b82" metalness={0.7} roughness={0.5} wireframe />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.12, 0.12, 0.2, 12]} />
        {mat("silver")}
      </mesh>
    </group>
  );
}

function LRV() {
  return (
    <group>
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[3.1, 0.1, 1.3]} />
        {mat("silver")}
      </mesh>
      {([[-1.15, -0.85], [-1.15, 0.85], [1.15, -0.85], [1.15, 0.85]] as const).map(([x, z], i) => (
        <group key={i}>
          <WireWheel position={[x, 0.41, z]} />
          <mesh position={[x, 0.9, z]} castShadow>
            <boxGeometry args={[0.9, 0.04, 0.3]} />
            {mat("foil")}
          </mesh>
        </group>
      ))}
      {/* seats */}
      {[-0.3, 0.3].map((z) => (
        <group key={z} position={[-0.1, 0.65, z]}>
          <mesh position={[0, 0.12, 0]} castShadow>
            <boxGeometry args={[0.5, 0.05, 0.45]} />
            {mat("black")}
          </mesh>
          <mesh position={[-0.25, 0.4, 0]} castShadow>
            <boxGeometry args={[0.05, 0.55, 0.45]} />
            {mat("black")}
          </mesh>
        </group>
      ))}
      {/* control console */}
      <mesh position={[0.5, 0.95, 0]} castShadow>
        <boxGeometry args={[0.2, 0.4, 0.4]} />
        {mat("black")}
      </mesh>
      {/* umbrella antenna */}
      <mesh position={[1.25, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 1.4, 6]} />
        {mat("silver")}
      </mesh>
      <mesh position={[1.25, 2.2, 0]} rotation={[0, 0, -0.3]} castShadow>
        <coneGeometry args={[0.5, 0.25, 20, 1, true]} />
        <meshStandardMaterial color="#d7d2c8" metalness={0.6} roughness={0.4} side={2} />
      </mesh>
      {/* TV camera */}
      <mesh position={[1.4, 1.3, 0.3]} castShadow>
        <boxGeometry args={[0.25, 0.15, 0.15]} />
        {mat("white")}
      </mesh>
    </group>
  );
}

function SixWheels({ length, width, r, y }: { length: number; width: number; r: number; y: number }) {
  return (
    <>
      {[-1, 0, 1].flatMap((i) =>
        [-1, 1].map((s) => (
          <mesh key={`${i}${s}`} position={[i * (length / 2), y, s * (width / 2)]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[r, r, r * 0.8, 16]} />
            {mat("silver")}
          </mesh>
        )),
      )}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, y + r * 0.9, s * (width / 2)]} castShadow>
          <boxGeometry args={[length * 1.05, r * 0.3, r * 0.3]} />
          {mat("silver")}
        </mesh>
      ))}
    </>
  );
}

function Sojourner() {
  return (
    <group scale={1.6}>
      <SixWheels length={0.5} width={0.48} r={0.065} y={0.065} />
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.45, 0.12, 0.32]} />
        {mat("foil")}
      </mesh>
      <mesh position={[0, 0.275, 0]} castShadow>
        <boxGeometry args={[0.6, 0.02, 0.45]} />
        {mat("solar")}
      </mesh>
      <mesh position={[0.25, 0.22, 0]} castShadow>
        <boxGeometry args={[0.04, 0.05, 0.12]} />
        {mat("black")}
      </mesh>
    </group>
  );
}

function MER() {
  return (
    <group>
      <SixWheels length={1.2} width={1.15} r={0.13} y={0.13} />
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[1.1, 0.35, 0.8]} />
        {mat("white")}
      </mesh>
      {/* solar wings */}
      <mesh position={[0, 0.76, 0]} castShadow>
        <boxGeometry args={[1.6, 0.03, 1.1]} />
        {mat("solar")}
      </mesh>
      <mesh position={[-0.95, 0.76, 0]} rotation={[0, 0, 0.04]} castShadow>
        <boxGeometry args={[0.6, 0.03, 1.4]} />
        {mat("solar")}
      </mesh>
      {[-0.75, 0.75].map((z) => (
        <mesh key={z} position={[0.3, 0.76, z]} castShadow>
          <boxGeometry args={[0.8, 0.03, 0.5]} />
          {mat("solar")}
        </mesh>
      ))}
      {/* mast */}
      <mesh position={[0.45, 1.25, 0.25]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 1.0, 8]} />
        {mat("white")}
      </mesh>
      <mesh position={[0.45, 1.8, 0.25]} castShadow>
        <boxGeometry args={[0.18, 0.12, 0.42]} />
        {mat("white")}
      </mesh>
      {/* arm */}
      <mesh position={[0.85, 0.45, -0.1]} rotation={[0, 0, -0.9]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 6]} />
        {mat("silver")}
      </mesh>
      {/* antenna */}
      <mesh position={[-0.3, 1.05, -0.25]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
        {mat("silver")}
      </mesh>
    </group>
  );
}

function Pathfinder() {
  const petal = (rot: number) => (
    <mesh key={rot} position={[Math.cos(rot) * 1.05, 0.12, Math.sin(rot) * 1.05]} rotation={[-Math.PI / 2, 0, -rot + Math.PI / 2]} castShadow receiveShadow>
      <circleGeometry args={[1.1, 3]} />
      <meshStandardMaterial {...M.solar} side={2} />
    </mesh>
  );
  return (
    <group>
      {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map(petal)}
      <mesh position={[0, 0.25, 0]} rotation={[0, Math.PI / 6, 0]} castShadow>
        <cylinderGeometry args={[0.65, 0.75, 0.3, 3]} />
        {mat("foil")}
      </mesh>
      {/* deflated airbags */}
      {[0.4, 2.5, 4.6].map((a) => (
        <mesh key={a} position={[Math.cos(a) * 1.9, 0.18, Math.sin(a) * 1.9]} scale={[1, 0.35, 1]} castShadow>
          <sphereGeometry args={[0.55, 12, 8]} />
          {mat("airbag")}
        </mesh>
      ))}
      {/* IMP mast */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.0, 6]} />
        {mat("silver")}
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[0.25, 0.14, 0.14]} />
        {mat("white")}
      </mesh>
      {/* ramp */}
      <mesh position={[-1.5, 0.15, 0.2]} rotation={[0, 0, 0.18]} castShadow>
        <boxGeometry args={[0.9, 0.02, 0.3]} />
        {mat("silver")}
      </mesh>
    </group>
  );
}

function Phoenix() {
  return (
    <group>
      <mesh position={[0, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.75, 0.75, 0.3, 10]} />
        {mat("foil")}
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[0, 1.15, s * 1.75]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow>
            <circleGeometry args={[1.05, 10]} />
            <meshStandardMaterial {...M.solar} side={2} />
          </mesh>
        </group>
      ))}
      {[0, 1, 2].map((i) => (
        <Leg key={i} angle={(i * Math.PI * 2) / 3 + Math.PI / 6} reach={1.3} height={0.9} />
      ))}
      {/* robotic arm */}
      <mesh position={[1.05, 1.15, 0]} rotation={[0, 0, -0.5]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.1, 6]} />
        {mat("silver")}
      </mesh>
      <mesh position={[1.75, 0.55, 0]} rotation={[0, 0, 0.7]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 1.2, 6]} />
        {mat("silver")}
      </mesh>
      <mesh position={[2.15, 0.12, 0]} castShadow>
        <boxGeometry args={[0.18, 0.1, 0.14]} />
        {mat("silver")}
      </mesh>
      {/* trench */}
      <mesh position={[2.2, 0.02, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.4, 0.9]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.8} />
      </mesh>
      {/* camera mast */}
      <mesh position={[-0.35, 1.7, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.0, 6]} />
        {mat("white")}
      </mesh>
      <mesh position={[-0.35, 2.25, 0]} castShadow>
        <boxGeometry args={[0.2, 0.14, 0.3]} />
        {mat("white")}
      </mesh>
    </group>
  );
}

export function Reconstruction({ kind }: { kind: ReconstructionKind }) {
  switch (kind) {
    case "lm-descent":
      return <LMDescent />;
    case "alsep":
      return <ALSEP />;
    case "lrv":
      return <LRV />;
    case "pathfinder":
      return <Pathfinder />;
    case "sojourner":
      return <Sojourner />;
    case "mer":
      return <MER />;
    case "phoenix":
      return <Phoenix />;
  }
}
