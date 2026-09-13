"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { ProfileImage } from "@/lib/profile";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";

export function ProfileUploader({ initialProfile, onSaved }: { initialProfile: ProfileImage | null; onSaved: (profile: ProfileImage) => void }) {
  const [preview, setPreview] = useState(initialProfile?.url ?? null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => () => { if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview); }, [preview]);

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return;
    const objectUrl = URL.createObjectURL(file); setPreview(objectUrl); setBusy(true); setMessage(null);
    const form = new FormData(); form.append("file", file);
    try {
      const response = await fetch("/api/editor/profile", { method: "POST", body: form });
      const body = await response.json(); if (!response.ok) throw new Error(body.message || "Unable to upload image.");
      setPreview(body.profile.url); onSaved(body.profile); setMessage("Profile image saved.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to upload image."); }
    finally { setBusy(false); }
  }

  return <div className="border-t border-border pt-6"><TechnicalLabel accent as="div">Profile Image</TechnicalLabel><div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center"><div className="relative h-32 w-32 overflow-hidden border border-border bg-surface [clip-path:polygon(12%_0,100%_0,88%_100%,0_100%)]">{preview ? <Image src={preview} alt="Current profile preview" fill sizes="128px" unoptimized className="object-cover" /> : <div className="flex h-full items-center justify-center p-4 text-center font-technical text-technical-label uppercase text-foreground-muted">No image</div>}</div><div><label htmlFor="profile-image" className="inline-flex cursor-pointer bg-accent px-5 py-3 font-technical text-technical-label uppercase tracking-[0.1em] text-accent-foreground hover:opacity-90">{busy ? "Uploading..." : "Choose JPG / PNG / WEBP"}<input id="profile-image" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={upload} disabled={busy} className="sr-only" /></label><p className="mt-3 max-w-sm font-technical text-technical-label uppercase tracking-[0.08em] text-foreground-muted">5 MB maximum · 200–6000 px · stored outside Git.</p></div></div><p role="status" className="mt-4 font-technical text-technical-label uppercase tracking-[0.08em] text-accent">{message}</p></div>;
}
