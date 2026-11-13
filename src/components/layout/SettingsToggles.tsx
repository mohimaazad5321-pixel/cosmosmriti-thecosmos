import { Volume2, VolumeX, Sparkles, PauseCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/lib/progress";
import { sfx } from "@/lib/sound";

export function SettingsToggles({ compact = false }: { compact?: boolean }) {
  const muted = useProgress((s) => s.muted);
  const reduceMotion = useProgress((s) => s.reduceMotion);
  const toggleMuted = useProgress((s) => s.toggleMuted);
  const toggleReduceMotion = useProgress((s) => s.toggleReduceMotion);
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="hud"
        size={compact ? "icon" : "icon-lg"}
        onClick={() => {
          toggleMuted();
          setTimeout(() => sfx.click(), 0);
        }}
        aria-pressed={!muted}
        aria-label={muted ? "Turn sound on" : "Mute sound"}
        title={muted ? "Sound is off" : "Sound is on"}
      >
        {muted ? <VolumeX /> : <Volume2 />}
      </Button>
      <Button
        variant="hud"
        size={compact ? "icon" : "icon-lg"}
        onClick={toggleReduceMotion}
        aria-pressed={reduceMotion}
        aria-label={reduceMotion ? "Allow animations" : "Reduce motion"}
        title={reduceMotion ? "Motion reduced" : "Reduce motion"}
      >
        {reduceMotion ? <PauseCircle /> : <Sparkles />}
      </Button>
    </div>
  );
}
