"use client";

import { useEffect, useState } from "react";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { formatMediaSize, type MediaLibraryAsset } from "@/lib/media-library";

const inputClass = "w-full min-w-0 border-b border-border-strong bg-transparent px-0 py-2 font-body text-body-md text-foreground-primary focus-visible:border-accent focus-visible:outline-none";
const areaClass = "w-full min-w-0 resize-y border border-border bg-background-primary p-3 font-body text-body-md text-foreground-primary focus-visible:border-accent focus-visible:outline-none";

export function MediaLibrary() {
  const [assets, setAssets] = useState<MediaLibraryAsset[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [kind, setKind] = useState<"image" | "audio" | "file">("image");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("Loading library...");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/editor/media").then(async (response) => {
      const body = await response.json();
      if (cancelled) return;
      if (!response.ok) throw new Error(body.message || "Unable to load the media library.");
      setAssets(body.assets); setMessage(`${body.assets.length} library asset${body.assets.length === 1 ? "" : "s"}`);
    }).catch((error) => { if (!cancelled) setMessage(error instanceof Error ? error.message : "Unable to load the media library."); });
    return () => { cancelled = true; };
  }, []);

  async function upload() {
    if (!file) { setMessage("Choose a file first."); return; }
    setBusy(true); setMessage("Saving library asset...");
    const form = new FormData(); form.append("file", file); form.append("kind", kind); form.append("name", name); form.append("description", description);
    try {
      const response = await fetch("/api/editor/media", { method: "POST", body: form });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || "Unable to save library asset.");
      setAssets((current) => [body.asset, ...current]); setFile(null); setName(""); setDescription(""); setMessage("Saved to the media library.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to save library asset."); }
    finally { setBusy(false); }
  }

  async function remove(asset: MediaLibraryAsset) {
    if (asset.usageCount) { setMessage("Linked assets cannot be deleted."); return; }
    if (!window.confirm(`Delete ${asset.name} from the media library?`)) return;
    const response = await fetch("/api/editor/media", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: asset.id }) });
    const body = await response.json();
    if (!response.ok) { setMessage(body.message || "Unable to delete asset."); return; }
    setAssets((current) => current.filter((item) => item.id !== asset.id)); setMessage("Asset removed from the library.");
  }

  const accept = kind === "image" ? "image/jpeg,image/png,image/webp" : kind === "audio" ? "audio/mpeg,audio/wav,audio/ogg,audio/webm,audio/mp4" : undefined;
  return <section className="grid min-w-0 gap-8"><div><TechnicalLabel accent as="div">Media Library / Reusable Assets</TechnicalLabel><h2 className="mt-3 font-heading text-heading-md uppercase tracking-tight">Upload once. Link anywhere.</h2><p className="mt-3 max-w-2xl font-body text-body-md text-foreground-muted">Store images, audio, documents, and archives here. In a project&apos;s Asset Manager, choose a library asset and assign its project path without uploading the binary again.</p></div><div className="border border-border bg-surface p-5 sm:p-6"><TechnicalLabel>New library asset</TechnicalLabel><div className="mt-5 grid gap-5 sm:grid-cols-2"><label className="flex flex-col gap-2"><TechnicalLabel>Asset type</TechnicalLabel><select value={kind} onChange={(event) => setKind(event.target.value as "image" | "audio" | "file")} className={inputClass}><option value="image">Image</option><option value="audio">Audio</option><option value="file">File / archive</option></select></label><label className="flex flex-col gap-2"><TechnicalLabel>Display name</TechnicalLabel><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Optional friendly name" className={inputClass} /></label></div><label className="mt-5 flex flex-col gap-2"><TechnicalLabel>Description</TechnicalLabel><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className={areaClass} /></label><div className="mt-5 flex flex-wrap items-center gap-4"><label className="cursor-pointer border border-border-strong px-4 py-3 font-technical text-technical-label uppercase hover:border-accent hover:text-accent">{file ? file.name : "Choose file"}<input type="file" accept={accept} onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="sr-only" /></label><button type="button" onClick={upload} disabled={busy} className="bg-accent px-4 py-3 font-technical text-technical-label uppercase text-accent-foreground disabled:opacity-50">{busy ? "Saving..." : "Add to library"}</button></div></div><div className="flex items-center justify-between border-b border-border pb-3"><TechnicalLabel>Stored assets</TechnicalLabel><span className="font-technical text-technical-label uppercase text-foreground-muted">{message}</span></div><div className="grid gap-3">{assets.map((asset) => <article key={asset.id} className="flex min-w-0 flex-wrap items-center justify-between gap-4 border border-border bg-surface p-4"><div className="min-w-0"><p className="break-words font-body text-body-md text-foreground-primary">{asset.name}</p><p className="mt-1 break-all font-technical text-technical-label uppercase text-foreground-muted">{asset.kind} / {asset.mimeType} / {formatMediaSize(asset.size)}{asset.usageCount ? ` / linked ${asset.usageCount}x` : ""}</p>{asset.description ? <p className="mt-2 font-body text-body-sm text-foreground-muted">{asset.description}</p> : null}</div><button type="button" onClick={() => void remove(asset)} disabled={Boolean(asset.usageCount)} className="shrink-0 font-technical text-technical-label uppercase text-foreground-muted hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40">Delete</button></article>)}{assets.length === 0 ? <p className="font-body text-body-md text-foreground-muted">No reusable assets yet.</p> : null}</div></section>;
}
