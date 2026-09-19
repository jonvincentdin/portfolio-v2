"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import type { AudioSettings } from "@/lib/schemas";

type AudioEngineProps = { settings: AudioSettings };
type AudioCategory = "ui" | "navigation" | "transition" | "hover";

const SOUND_FREQUENCIES: Record<string, [number, number]> = {
  "ui-click": [520, 0.045],
  "ui-soft-click": [380, 0.035],
  "ui-open": [460, 0.07],
  "ui-close": [300, 0.06],
  "ui-toggle": [640, 0.05],
  "ui-success": [760, 0.1],
  "ui-error": [180, 0.09],
  "navigation-shift": [420, 0.06],
  "transition-whoosh": [260, 0.08],
};

function categoryFor(soundId: string): AudioCategory {
  if (soundId.startsWith("navigation")) return "navigation";
  if (soundId.startsWith("transition")) return "transition";
  if (soundId.includes("hover")) return "hover";
  return "ui";
}

export function AudioEngine({ settings }: AudioEngineProps) {
  const pathname = usePathname();
  const editing = pathname.startsWith("/editor") || pathname.startsWith("/owner");
  const [previewAudio, setPreviewAudio] = useState<AudioSettings | null>(null);
  const activeSettings = previewAudio ?? settings;
  const muted = useSyncExternalStore(
    (onStoreChange) => {
      const handleStorage = (event: StorageEvent) => {
        if (event.key === "portfolio-audio-muted") onStoreChange();
      };
      window.addEventListener("storage", handleStorage);
      window.addEventListener("portfolio-audio-muted-change", onStoreChange);
      return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener("portfolio-audio-muted-change", onStoreChange);
      };
    },
    () => {
      const stored = window.localStorage.getItem("portfolio-audio-muted");
      return stored === null ? settings.masterMuted : stored === "true";
    },
    () => settings.masterMuted,
  );
  const contextRef = useRef<AudioContext | null>(null);
  const voices = useRef<OscillatorNode[]>([]);
  const cooldowns = useRef(new Map<string, number>());
  const audioCache = useRef(new Map<string, HTMLAudioElement>());
  const backgroundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handlePreviewSettings = (event: Event) => {
      const next = (event as CustomEvent<{ audio?: AudioSettings }>).detail?.audio;
      if (next) setPreviewAudio(next);
    };
    window.addEventListener("portfolio-site-experience-preview", handlePreviewSettings);
    return () => window.removeEventListener("portfolio-site-experience-preview", handlePreviewSettings);
  }, []);

  useEffect(() => {
    const cache = audioCache.current;
    const getContext = () => {
      if (!contextRef.current) contextRef.current = new AudioContext();
      return contextRef.current;
    };
    const sourceFor = (asset: string) => asset.startsWith("library/") ? `/content-media/${asset}` : asset;

    const startBackgroundMusic = () => {
      const music = activeSettings.backgroundMusic;
      if (!activeSettings.enabled || muted || activeSettings.masterMuted || !music.enabled || !music.asset) return;
      const source = sourceFor(music.asset);
      const canonicalSource = new URL(source, window.location.href).href;
      let player = backgroundRef.current;
      if (!player || player.src !== canonicalSource) {
        player?.pause();
        player = new Audio(source);
        backgroundRef.current = player;
      }
      player.loop = music.loop;
      player.preload = "auto";
      player.volume = Math.min(1, activeSettings.masterVolume * music.volume);
      void player.play().catch(() => undefined);
    };

    const play = (soundId: string) => {
      if (!activeSettings.enabled || muted || activeSettings.masterMuted) return;
      const sound = activeSettings.sounds[soundId] ?? { enabled: true, volume: 0.5 };
      if (!sound.enabled) return;
      const now = performance.now();
      if ((cooldowns.current.get(soundId) ?? 0) > now) return;
      if (voices.current.length >= 4) return;
      cooldowns.current.set(soundId, now + 70);
      const category = categoryFor(soundId);
      const categoryVolume = activeSettings[`${category}Volume` as keyof AudioSettings] as number;

      if (sound.asset) {
        const source = sourceFor(sound.asset);
        const cached = cache.get(source);
        const player = cached ? cached.cloneNode(true) as HTMLAudioElement : new Audio(source);
        player.volume = Math.min(1, activeSettings.masterVolume * categoryVolume * sound.volume);
        player.currentTime = 0;
        void player.play().catch(() => undefined);
        return;
      }

      const context = getContext();
      const [frequency, duration] = SOUND_FREQUENCIES[soundId] ?? SOUND_FREQUENCIES["ui-soft-click"];
      const scheduleTone = () => {
        if (context.state !== "running") return;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const start = context.currentTime;
        const peak = Math.min(0.12, activeSettings.masterVolume * categoryVolume * sound.volume * 0.6);
        oscillator.type = soundId.includes("whoosh") ? "sine" : "triangle";
        oscillator.frequency.setValueAtTime(frequency, start);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.72, start + duration);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak), start + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        oscillator.connect(gain).connect(context.destination);
        voices.current.push(oscillator);
        oscillator.onended = () => { voices.current = voices.current.filter((voice) => voice !== oscillator); };
        oscillator.start(start);
        oscillator.stop(start + duration + 0.02);
      };
      if (context.state === "suspended") void context.resume().then(scheduleTone).catch(() => undefined);
      else scheduleTone();
    };

    const handlePointer = (event: PointerEvent) => {
      const element = event.target instanceof Element
        ? event.target.closest<HTMLElement>("[data-audio],button,a,[role=button],input,select,textarea")
        : null;
      if (!element) return;
      startBackgroundMusic();
      const soundId = element.dataset.audio ?? (element.matches("button,a,[role=button]") ? "ui-click" : undefined);
      if (soundId) play(soundId);
    };
    const handleHover = (event: PointerEvent) => {
      const element = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-audio-hover]") : null;
      if (!element || (event.relatedTarget instanceof Node && element.contains(event.relatedTarget))) return;
      play(element.dataset.audioHover || "ui-soft-click");
    };
    const handlePreview = (event: Event) => {
      const soundId = (event as CustomEvent<{ soundId?: string }>).detail?.soundId;
      if (soundId) {
        startBackgroundMusic();
        play(soundId);
      }
    };

    document.addEventListener("pointerdown", handlePointer, true);
    if (!editing) document.addEventListener("pointerover", handleHover, true);
    window.addEventListener("portfolio-audio-preview", handlePreview);
    for (const sound of Object.values(activeSettings.sounds)) {
      if (!sound.asset) continue;
      const source = sourceFor(sound.asset);
      if (!cache.has(source)) {
        const player = new Audio(source);
        player.preload = "auto";
        cache.set(source, player);
      }
    }
    return () => {
      document.removeEventListener("pointerdown", handlePointer, true);
      document.removeEventListener("pointerover", handleHover, true);
      window.removeEventListener("portfolio-audio-preview", handlePreview);
      backgroundRef.current?.pause();
      backgroundRef.current = null;
      contextRef.current?.close();
      contextRef.current = null;
      cache.clear();
    };
  }, [activeSettings, editing, muted]);

  const isMuted = muted || activeSettings.masterMuted;
  if (!activeSettings.enabled || editing) return null;
  return <button type="button" aria-label={isMuted ? "Turn sound on" : "Mute sound"} aria-pressed={!isMuted} onClick={() => { const next = !muted; window.localStorage.setItem("portfolio-audio-muted", String(next)); window.dispatchEvent(new Event("portfolio-audio-muted-change")); }} className="fixed bottom-4 left-4 z-20 border border-border-strong bg-background-primary/80 px-3 py-2 font-technical text-[10px] uppercase tracking-[0.12em] text-foreground-muted backdrop-blur-sm hover:border-accent hover:text-accent">{isMuted ? "Sound off" : "Sound on"}</button>;
}
