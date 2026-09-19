"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CURSOR_PRESETS } from "@/lib/cursor/presets";
import type { CursorSettings } from "@/lib/schemas";

type CursorEngineProps = { settings: CursorSettings };
type CursorState = "default" | "link" | "button" | "view" | "drag" | "open" | "external" | "text" | "disabled" | "media";

function getTargetState(target: EventTarget | null): { state: CursorState; label: string; icon: string } {
  const element = target instanceof Element ? target : null;
  const explicit = element?.closest<HTMLElement>("[data-cursor]");
  if (explicit) {
    return {
      state: (explicit.dataset.cursor as CursorState) || "default",
      label: explicit.dataset.cursorLabel || "",
      icon: explicit.dataset.cursorIcon || "",
    };
  }

  const link = element?.closest<HTMLAnchorElement>("a");
  if (link) return { state: link.target === "_blank" ? "external" : "link", label: "", icon: link.target === "_blank" ? "↗" : "" };
  if (element?.closest("button")) return { state: "button", label: "", icon: "" };
  if (element?.closest("input, textarea, select")) return { state: "text", label: "", icon: "" };
  if (element?.closest("[draggable=true]")) return { state: "drag", label: "DRAG", icon: "" };
  if (element?.closest("img, video, [data-cursor-media]")) return { state: "media", label: "OPEN", icon: "" };
  return { state: "default", label: "", icon: "" };
}

export function CursorEngine({ settings }: CursorEngineProps) {
  const pathname = usePathname();
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState("");
  const [pressed, setPressed] = useState(false);
  const coreRef = useRef<HTMLSpanElement>(null);
  const outerRef = useRef<HTMLSpanElement>(null);
  const trailRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const pressedRef = useRef(false);
  const target = useRef({ x: -100, y: -100 });
  const outer = useRef({ x: -100, y: -100 });
  const lastPoint = useRef({ x: -100, y: -100, time: 0 });
  const velocity = useRef({ x: 0, y: 0, amount: 0 });

  useEffect(() => {
    const pointerQuery = window.matchMedia("(pointer: fine)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const editing = pathname.startsWith("/editor") || pathname.startsWith("/owner");
    if (!settings.enabled || !pointerQuery.matches || reducedMotionQuery.matches || editing) return;

    document.documentElement.classList.add("cursor-engine-enabled");

    const updateVisuals = () => {
      const point = target.current;
      outer.current = point;
      const speed = velocity.current.amount;
      const direction = velocity.current;
      const velocityTrailEnabled = settings.preset === "velocity" || settings.preset === "custom";
      const extension = velocityTrailEnabled ? Math.min(settings.trail.length, speed * settings.trail.velocitySensitivity * settings.motionStrength) : 0;
      const coreRotation = settings.core.rotation + (settings.core.shape === "diamond" ? 45 : 0);
      const outerRotation = settings.outer.shape === "diamond" ? 45 : 0;
      const compression = pressedRef.current ? settings.behavior.clickCompression : 1;

      coreRef.current?.style.setProperty("transform", `translate3d(${point.x}px, ${point.y}px, 0) rotate(${coreRotation}deg) scale(${compression})`);
      outerRef.current?.style.setProperty("transform", `translate3d(${point.x}px, ${point.y}px, 0) rotate(${outerRotation}deg)`);
      trailRef.current?.style.setProperty("transform", `translate3d(${point.x - direction.x * extension}px, ${point.y - direction.y * extension}px, 0) rotate(${Math.atan2(direction.y, direction.x) * 57.2958}deg)`);
      trailRef.current?.style.setProperty("--trail-length", `${extension}px`);
      glowRef.current?.style.setProperty("transform", `translate3d(${point.x}px, ${point.y}px, 0)`);
    };

    if (target.current.x < 0 || target.current.y < 0) {
      const startPoint = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      target.current = startPoint;
      outer.current = startPoint;
      updateVisuals();
    }

    const updateTarget = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const now = performance.now();
      const previous = lastPoint.current;
      const elapsed = Math.max(8, now - previous.time);
      const dx = event.clientX - previous.x;
      const dy = event.clientY - previous.y;
      const distance = Math.hypot(dx, dy);
      const amount = Math.min(40, distance / elapsed * 16);
      target.current = { x: event.clientX, y: event.clientY };
      velocity.current = { x: distance ? dx / distance : 0, y: distance ? dy / distance : 0, amount };
      lastPoint.current = { x: event.clientX, y: event.clientY, time: now };
      updateVisuals();
      const next = getTargetState(event.target);
      setCursorState(next.state);
      setLabel(next.label);
      setIcon(next.icon);
    };
    const hide = () => {
      setCursorState("default");
      setLabel("");
      setIcon("");
    };
    const press = () => { pressedRef.current = true; setPressed(true); updateVisuals(); };
    const release = () => { pressedRef.current = false; setPressed(false); updateVisuals(); };

    document.addEventListener("pointermove", updateTarget, { passive: true, capture: true });
    document.documentElement.addEventListener("mouseleave", hide, { passive: true });
    window.addEventListener("blur", hide, { passive: true });
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("pointercancel", release, { passive: true });
    return () => {
      document.removeEventListener("pointermove", updateTarget, true);
      document.documentElement.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      pressedRef.current = false;
      document.documentElement.classList.remove("cursor-engine-enabled");
    };
  }, [pathname, settings]);

  const editing = pathname.startsWith("/editor") || pathname.startsWith("/owner");
  if (!settings.enabled || editing) return null;
  const preset = CURSOR_PRESETS[settings.preset];
  const color = settings.colorMode === "custom" ? settings.customColor : settings.core.color;
  const variables = {
    "--cursor-scale": settings.scale,
    "--cursor-opacity": settings.opacity,
    "--cursor-core-size": `${settings.core.size}px`,
    "--cursor-core-color": color,
    "--cursor-core-border": settings.core.borderColor,
    "--cursor-core-border-width": `${settings.core.borderWidth}px`,
    "--cursor-core-opacity": settings.core.opacity,
    "--cursor-core-rotation": `${settings.core.rotation}deg`,
    "--cursor-hover-expansion": `${settings.behavior.hoverExpansion}px`,
    "--cursor-click-compression": settings.behavior.clickCompression,
    "--cursor-outer-size": `${settings.outer.size}px`,
    "--cursor-outer-color": settings.outer.color,
    "--cursor-outer-border-width": `${settings.outer.borderWidth}px`,
    "--cursor-outer-opacity": settings.outer.opacity,
    "--cursor-trail-opacity": settings.trail.opacity,
    "--cursor-trail-thickness": `${settings.trail.thickness}px`,
    "--cursor-glow-color": settings.glow.color,
    "--cursor-glow-radius": `${settings.glow.radius}px`,
    "--cursor-glow-opacity": settings.glow.opacity * settings.glow.intensity,
    "--cursor-label-size": `${settings.label.fontSize}px`,
    "--cursor-label-weight": settings.label.fontWeight,
    "--cursor-label-color": settings.label.textColor,
    "--cursor-label-background": settings.label.background,
    "--cursor-label-padding": `${settings.label.padding}px`,
    "--cursor-label-radius": `${settings.label.borderRadius}px`,
    "--cursor-label-distance": `${settings.label.distance}px`,
  } as React.CSSProperties;

  return (
    <div className="cursor-engine" data-state={cursorState} data-pressed={pressed} data-core-shape={settings.core.shape} data-outer-shape={settings.outer.shape} data-crosshair={preset.crosshair} data-telemetry={preset.telemetry} data-velocity-trail={preset.velocityTrail} style={variables} aria-hidden="true">
      {preset.glow || settings.glow.enabled ? <span ref={glowRef} className="cursor-engine__glow" /> : null}
      {settings.trail.enabled && (preset.velocityTrail || settings.trail.length > 0) ? <span ref={trailRef} className="cursor-engine__trail" /> : null}
      {settings.outer.enabled ? <span ref={outerRef} className="cursor-engine__outer" /> : null}
      <span ref={coreRef} className="cursor-engine__core" />
      {preset.crosshair ? <span className="cursor-engine__crosshair" /> : null}
      {preset.telemetry ? <span className="cursor-engine__telemetry" /> : null}
      {settings.label.enabled && (label || icon) ? <span className="cursor-engine__label">{icon || label}</span> : null}
    </div>
  );
}
