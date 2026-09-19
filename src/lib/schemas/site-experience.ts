import { z } from "zod";

const HexColorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/, "must be a six-digit hex color");

export const CursorPresetSchema = z.enum(["precision", "crosshair", "telemetry", "velocity", "minimal", "halo", "custom"]);
export const CursorShapeSchema = z.enum(["circle", "square", "diamond", "cross", "ring"]);
export const CursorColorModeSchema = z.enum(["accent", "custom", "inverted"]);

const DEFAULT_CURSOR_CORE = { shape: "circle" as const, size: 7, color: "#e8b400", borderColor: "#e8b400", borderWidth: 1, opacity: 1, rotation: 0 };
const DEFAULT_CURSOR_OUTER = { enabled: true, shape: "ring" as const, size: 34, color: "#e8b400", borderWidth: 1, opacity: 0.7, trailDelay: 0.08, elasticity: 0.45 };
const DEFAULT_CURSOR_TRAIL = { enabled: true, length: 18, thickness: 2, opacity: 0.22, fadeDuration: 0.25, velocitySensitivity: 0.35, smoothness: 0.75 };
const DEFAULT_CURSOR_GLOW = { enabled: true, color: "#e8b400", intensity: 0.18, radius: 90, opacity: 0.35 };
const DEFAULT_CURSOR_LABEL = { enabled: true, fontSize: 10, fontWeight: 500, textColor: "#0a0a0a", background: "#e8b400", padding: 4, borderRadius: 0, distance: 16 };
const DEFAULT_CURSOR_BEHAVIOR = { hoverExpansion: 1.6, clickCompression: 0.75, velocityStretch: 0.5, magnetism: 0, interactiveLabels: true };
const DEFAULT_CURSOR = { enabled: true, preset: "precision" as const, scale: 1, opacity: 0.9, motionStrength: 0.8, interactionStrength: 0.8, colorMode: "accent" as const, customColor: "#e8b400", core: DEFAULT_CURSOR_CORE, outer: DEFAULT_CURSOR_OUTER, trail: DEFAULT_CURSOR_TRAIL, glow: DEFAULT_CURSOR_GLOW, label: DEFAULT_CURSOR_LABEL, behavior: DEFAULT_CURSOR_BEHAVIOR };
const DEFAULT_BACKGROUND_MUSIC = { enabled: false, volume: 0.15, loop: true };
const DEFAULT_AUDIO = { enabled: true, masterMuted: false, masterVolume: 0.35, uiVolume: 0.5, navigationVolume: 0.45, transitionVolume: 0.35, hoverVolume: 0.18, backgroundMusic: DEFAULT_BACKGROUND_MUSIC, sounds: {} };

export const CursorSettingsSchema = z.object({
  enabled: z.boolean().default(true),
  preset: CursorPresetSchema.default("precision"),
  scale: z.number().min(0.75).max(1.5).default(1),
  opacity: z.number().min(0).max(1).default(0.9),
  motionStrength: z.number().min(0).max(1).default(0.8),
  interactionStrength: z.number().min(0).max(1).default(0.8),
  colorMode: CursorColorModeSchema.default("accent"),
  customColor: HexColorSchema.default("#e8b400"),
  core: z.object({
    shape: CursorShapeSchema.default("circle"),
    size: z.number().min(2).max(32).default(7),
    color: HexColorSchema.default("#e8b400"),
    borderColor: HexColorSchema.default("#e8b400"),
    borderWidth: z.number().min(0).max(4).default(1),
    opacity: z.number().min(0).max(1).default(1),
    rotation: z.number().min(-45).max(45).default(0),
  }).default(DEFAULT_CURSOR_CORE),
  outer: z.object({
    enabled: z.boolean().default(true),
    shape: CursorShapeSchema.default("ring"),
    size: z.number().min(12).max(140).default(34),
    color: HexColorSchema.default("#e8b400"),
    borderWidth: z.number().min(0).max(4).default(1),
    opacity: z.number().min(0).max(1).default(0.7),
    trailDelay: z.number().min(0).max(0.5).default(0.08),
    elasticity: z.number().min(0).max(1).default(0.45),
  }).default(DEFAULT_CURSOR_OUTER),
  trail: z.object({
    enabled: z.boolean().default(true),
    length: z.number().min(0).max(80).default(18),
    thickness: z.number().min(1).max(16).default(2),
    opacity: z.number().min(0).max(1).default(0.22),
    fadeDuration: z.number().min(0.05).max(1).default(0.25),
    velocitySensitivity: z.number().min(0).max(2).default(0.35),
    smoothness: z.number().min(0).max(1).default(0.75),
  }).default(DEFAULT_CURSOR_TRAIL),
  glow: z.object({
    enabled: z.boolean().default(true),
    color: HexColorSchema.default("#e8b400"),
    intensity: z.number().min(0).max(1).default(0.18),
    radius: z.number().min(20).max(240).default(90),
    opacity: z.number().min(0).max(1).default(0.35),
  }).default(DEFAULT_CURSOR_GLOW),
  label: z.object({
    enabled: z.boolean().default(true),
    fontSize: z.number().min(8).max(18).default(10),
    fontWeight: z.number().min(400).max(800).default(500),
    textColor: HexColorSchema.default("#0a0a0a"),
    background: HexColorSchema.default("#e8b400"),
    padding: z.number().min(2).max(12).default(4),
    borderRadius: z.number().min(0).max(12).default(0),
    distance: z.number().min(4).max(40).default(16),
  }).default(DEFAULT_CURSOR_LABEL),
  behavior: z.object({
    hoverExpansion: z.number().min(0).max(3).default(1.6),
    clickCompression: z.number().min(0.4).max(1).default(0.75),
    velocityStretch: z.number().min(0).max(2).default(0.5),
    magnetism: z.number().min(0).max(0.4).default(0),
    interactiveLabels: z.boolean().default(true),
  }).default(DEFAULT_CURSOR_BEHAVIOR),
  customAsset: z.string().max(512).optional(),
});

export const AudioSoundSettingSchema = z.object({
  enabled: z.boolean().default(true),
  volume: z.number().min(0).max(1).default(0.5),
  asset: z.string().max(512).optional(),
});

export const AudioSettingsSchema = z.object({
  enabled: z.boolean().default(true),
  masterMuted: z.boolean().default(false),
  masterVolume: z.number().min(0).max(1).default(0.35),
  uiVolume: z.number().min(0).max(1).default(0.5),
  navigationVolume: z.number().min(0).max(1).default(0.45),
  transitionVolume: z.number().min(0).max(1).default(0.35),
  hoverVolume: z.number().min(0).max(1).default(0.18),
  backgroundMusic: z.object({
    enabled: z.boolean().default(false),
    volume: z.number().min(0).max(1).default(0.15),
    loop: z.boolean().default(true),
    asset: z.string().max(512).optional(),
  }).default(DEFAULT_BACKGROUND_MUSIC),
  sounds: z.record(z.string(), AudioSoundSettingSchema).default({}),
});

/* --------------------------------------------------------------------------
   Project Sections — must be defined BEFORE SiteExperienceSchema so the
   schema reference resolves correctly at runtime.
   -------------------------------------------------------------------------- */

export const ProjectSectionTemplateSchema = z.enum([
  "showroom",
  "carousel",
  "grid",
  "timeline",
  "spotlight",
  "film-strip",
]);

export const ProjectSectionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  kicker: z.string().optional(),
  template: ProjectSectionTemplateSchema.default("showroom"),
  /** undefined / empty array = include all visible projects */
  projectSlugs: z.array(z.string()).optional(),
  visible: z.boolean().default(true),
});

export type ProjectSectionTemplate = z.infer<typeof ProjectSectionTemplateSchema>;
export type ProjectSection = z.infer<typeof ProjectSectionSchema>;

export const DEFAULT_PROJECT_SECTIONS: ProjectSection[] = [
  { id: "main", label: "Projects", kicker: "03 / Work", template: "showroom", visible: true },
];

/* -------------------------------------------------------------------------- */

export const SiteExperienceSchema = z.object({
  cursor: CursorSettingsSchema.default(DEFAULT_CURSOR),
  audio: AudioSettingsSchema.default(DEFAULT_AUDIO),
  projectSections: z.array(ProjectSectionSchema).optional(),
});

export const DEFAULT_SITE_EXPERIENCE = SiteExperienceSchema.parse({
  cursor: {},
  audio: {
    sounds: {
      "ui-click": {},
      "ui-soft-click": {},
      "ui-open": {},
      "ui-close": {},
      "ui-toggle": {},
      "ui-success": {},
      "ui-error": {},
      "navigation-shift": {},
      "transition-whoosh": {},
    },
  },
  projectSections: [
    { id: "main", label: "Projects", kicker: "03 / Work", template: "showroom", visible: true },
  ],
});

export type CursorSettings = z.infer<typeof CursorSettingsSchema>;
export type CursorPreset = z.infer<typeof CursorPresetSchema>;
export type AudioSettings = z.infer<typeof AudioSettingsSchema>;
export type SiteExperience = z.infer<typeof SiteExperienceSchema>;
