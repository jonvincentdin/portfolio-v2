"use client";

import { useEffect, useRef, useState } from "react";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import type { MediaLibraryAsset } from "@/lib/media-library";

export function mediaPreviewUrl(value: string | undefined) {
  if (!value) return undefined;
  if (value.startsWith("http") || value.startsWith("/")) return value;
  return `/content-media/${value}`;
}

export function MediaPicker({ label, value, onChange, kind = "image" }: { label: string; value?: string; onChange: (value: string | undefined) => void; kind?: "image" | "audio" | "file" }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState<MediaLibraryAsset[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => { fetch("/api/editor/media").then(async (response) => { if (response.ok) setAssets(((await response.json()).assets ?? []) as MediaLibraryAsset[]); }).catch(() => undefined); }, []);
  async function upload(file: File) {
    setBusy(true); setMessage("Uploading..."); const form = new FormData(); form.append("file", file); form.append("kind", kind);
    try { const response = await fetch("/api/editor/media", { method: "POST", body: form }); const body = await response.json() as { asset?: MediaLibraryAsset; message?: string }; if (!response.ok || !body.asset) throw new Error(body.message || "Unable to upload media."); setAssets((current) => [body.asset!, ...current]); onChange(`library/${body.asset.id}`); setOpen(false); setMessage("Uploaded and selected."); } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to upload media."); } finally { setBusy(false); }
  }
  const compatible = assets.filter((asset) => asset.kind === kind);
  const selectedAsset = value?.startsWith("library/") ? assets.find((asset) => asset.id === value.slice("library/".length)) : undefined;
  const preview = kind === "image" || kind === "audio" ? mediaPreviewUrl(value) : undefined;
  const accept = kind === "image" ? "image/jpeg,image/png,image/webp,image/svg+xml" : kind === "audio" ? "audio/mpeg,audio/wav,audio/ogg,audio/webm,audio/mp4" : undefined;
  return <div className="min-w-0"><TechnicalLabel>{label}</TechnicalLabel><div className="mt-3 flex min-w-0 flex-wrap items-center gap-4">{preview ? <div className="relative flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden border border-border bg-background-primary">{kind === "audio" ? <audio controls preload="metadata" src={preview} className="w-full" aria-label={`${label} preview`} onError={() => setMessage("Selected audio could not be previewed.")} /> : <img src={preview} alt={`${label} preview`} className="h-full w-full object-cover" />}</div> : <div className="flex h-20 w-28 shrink-0 items-center justify-center border border-dashed border-border-strong px-3 text-center font-technical text-[10px] uppercase tracking-[0.08em] text-foreground-muted">No {kind} selected</div>}<div className="flex min-w-[220px] flex-1 flex-wrap gap-2"><button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="border border-border-strong px-3 py-2 font-technical text-technical-label uppercase hover:border-accent hover:text-accent disabled:opacity-50">{busy ? "Uploading..." : value ? "Replace" : "Upload"}</button><button type="button" onClick={() => setOpen((current) => !current)} className="border border-border-strong px-3 py-2 font-technical text-technical-label uppercase hover:border-accent hover:text-accent">{open ? "Close picker" : "Choose existing"}</button>{value ? <button type="button" onClick={() => onChange(undefined)} className="px-2 py-2 font-technical text-technical-label uppercase text-foreground-muted hover:text-red-400">Remove</button> : null}<input ref={inputRef} type="file" accept={accept} className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); event.currentTarget.value = ""; }} /></div></div>{value ? <div className="mt-2 break-all font-mono text-xs text-foreground-muted"><span className="text-accent">Selected media:</span> {selectedAsset?.name ?? value}<span className="ml-2">({selectedAsset?.mimeType ?? (value.startsWith("library/") ? "managed asset" : "content asset")})</span></div> : null}{open ? <div className="mt-4 grid gap-3 border border-border bg-surface p-4 sm:grid-cols-2">{compatible.map((asset) => <button key={asset.id} type="button" onClick={() => { onChange(`library/${asset.id}`); setOpen(false); setMessage("Media selected."); }} className="flex min-w-0 items-center gap-3 border border-border p-2 text-left hover:border-accent">{asset.kind === "image" && asset.url ? <img src={asset.url} alt="" className="h-12 w-16 shrink-0 object-cover" /> : <span className="flex h-12 w-16 shrink-0 items-center justify-center bg-background-primary font-technical text-[10px] uppercase text-foreground-muted">{asset.type}</span>}<span className="min-w-0"><span className="block truncate font-body text-body-sm text-foreground-primary">{asset.name}</span><span className="block font-technical text-[10px] uppercase text-foreground-muted">{asset.mimeType}</span></span></button>)}{compatible.length === 0 ? <p className="font-body text-body-sm text-foreground-muted">No compatible media yet. Upload one to begin.</p> : null}</div> : null}{message ? <p role="status" className="mt-2 font-technical text-[10px] uppercase tracking-[0.08em] text-accent">{message}</p> : null}</div>;
}
