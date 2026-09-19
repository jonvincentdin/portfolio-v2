import type { CursorPreset } from "@/lib/schemas";

export const CURSOR_PRESETS: Record<CursorPreset, {
  crosshair: boolean;
  telemetry: boolean;
  velocityTrail: boolean;
  glow: boolean;
}> = {
  precision: { crosshair: false, telemetry: false, velocityTrail: false, glow: false },
  crosshair: { crosshair: true, telemetry: false, velocityTrail: false, glow: false },
  telemetry: { crosshair: false, telemetry: true, velocityTrail: false, glow: false },
  velocity: { crosshair: false, telemetry: false, velocityTrail: true, glow: false },
  minimal: { crosshair: false, telemetry: false, velocityTrail: false, glow: false },
  halo: { crosshair: false, telemetry: false, velocityTrail: false, glow: true },
  custom: { crosshair: false, telemetry: false, velocityTrail: true, glow: true },
};
