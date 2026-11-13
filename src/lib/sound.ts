import { useProgress } from "./progress";

let ctx: AudioContext | null = null;

function audio() {
  if (typeof window === "undefined") return null;
  if (useProgress.getState().muted) return null;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, start: number, dur: number, gain = 0.08, type: OscillatorType = "sine") {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + start;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(a.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

/** Only ever called from user gestures; never autoplays. */
export const sfx = {
  click: () => tone(880, 0, 0.08, 0.04, "triangle"),
  hover: () => tone(660, 0, 0.06, 0.02, "sine"),
  discover: () => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.11, 0.9, 0.06));
  },
  hidden: () => {
    tone(1318.5, 0, 0.5, 0.04);
    tone(1760, 0.08, 0.6, 0.03);
  },
  warp: () => {
    const a = audio();
    if (!a) return;
    const t = a.currentTime;
    const osc = a.createOscillator();
    const g = a.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 1.1);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.03, t + 0.4);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    osc.connect(g).connect(a.destination);
    osc.start(t);
    osc.stop(t + 1.3);
  },
};
