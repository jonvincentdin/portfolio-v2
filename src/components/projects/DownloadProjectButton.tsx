"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

type DownloadState = "idle" | "preparing" | "building" | "ready";

type DownloadProjectButtonProps = {
  slug: string;
  folderName: string;
  className?: string;
};

const LABELS: Record<DownloadState, string> = {
  idle: "Download Project",
  preparing: "Preparing Archive...",
  building: "Building Zip...",
  ready: "Download Ready",
};

/**
 * Triggers the whole-project ZIP download (spec §62–§63) via the
 * `/api/projects/[slug]/download` route. The actual archive is generated
 * and streamed server-side in one request/response — there's no real
 * multi-stage progress to report — so the "preparing/building" states here
 * are a brief, deliberately short (spec §69: "keep it fast") texture
 * matching the interaction pattern described in spec §46, not a literal
 * progress tracker. The browser's native download (triggered via a
 * temporary anchor click) starts as soon as the "building" step completes.
 */
export function DownloadProjectButton({ slug, folderName, className }: DownloadProjectButtonProps) {
  const [state, setState] = useState<DownloadState>("idle");

  function handleClick() {
    if (state !== "idle") return;

    setState("preparing");

    window.setTimeout(() => {
      setState("building");

      window.setTimeout(() => {
        const link = document.createElement("a");
        link.href = `/api/projects/${slug}/download`;
        link.download = `${folderName}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setState("ready");
        window.setTimeout(() => setState("idle"), 2000);
      }, 350);
    }, 250);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state !== "idle"}
      className={cn(
        "group inline-flex items-center gap-3 bg-accent px-6 py-3 font-technical text-technical-label uppercase tracking-[0.1em] text-accent-foreground transition-colors duration-150 hover:bg-accent/90 disabled:cursor-default disabled:opacity-80",
        className,
      )}
    >
      {LABELS[state]}
      {state === "idle" ? (
        <span
          className="inline-block transition-transform duration-150 group-hover:translate-y-0.5"
          aria-hidden="true"
        >
          ↓
        </span>
      ) : null}
    </button>
  );
}
