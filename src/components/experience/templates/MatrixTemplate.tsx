"use client";

/*
  MatrixTemplate — Cryptographic credential matrix for Certifications.
  Grid of credential cards with hash-based visual identity, file viewer support,
  and PDF thumbnail rendering.

  No external CSS needed — uses Tailwind + inline styles only.
*/

import { useState, useCallback } from "react";
import Image from "next/image";
import { Certification } from "@/lib/schemas";
import { getCollectionMediaUrl } from "@/lib/content/media";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { Reveal } from "@/components/motion/Reveal";
import { FileViewerModal } from "@/components/experience/FileViewerModal";
import { PdfThumbnail } from "@/components/ui/PdfThumbnail";

interface MatrixTemplateProps {
  certifications: Certification[];
}

/** Deterministic hash-like string derived from a seed (no crypto needed) */
function deterministicHash(seed: string, length = 32): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  const hex = (h >>> 0).toString(16).padStart(8, "0");
  const chars = "0123456789ABCDEF";
  let result = "";
  let val = h >>> 0;
  for (let i = 0; i < length; i++) {
    val = (Math.imul(val, 1664525) + 1013904223) >>> 0;
    result += chars[val % 16];
    if ((i + 1) % 8 === 0 && i < length - 1) result += "-";
  }
  return hex.toUpperCase() + "-" + result;
}

/** Short alphanumeric ID for display */
function shortId(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

interface ViewerState {
  url: string;
  name: string;
  isPdf: boolean;
  credentialUrl?: string;
}

interface MatrixCardProps {
  cert: Certification;
  index: number;
  onInspect: (state: ViewerState) => void;
}

function MatrixCard({ cert, index, onInspect }: MatrixCardProps) {
  const mediaUrl = cert.image ? getCollectionMediaUrl("certifications", cert.image) : null;
  const isPdf = mediaUrl ? mediaUrl.toLowerCase().endsWith(".pdf") : false;
  const hash = deterministicHash(cert.id + cert.title);
  const displayId = shortId(cert.id + cert.issuer);
  const seqNum = String(index + 1).padStart(3, "0");

  const handleInspect = useCallback(() => {
    if (!mediaUrl) return;
    onInspect({
      url: mediaUrl,
      name: cert.title,
      isPdf,
      credentialUrl: cert.credentialUrl || undefined,
    });
  }, [mediaUrl, cert, isPdf, onInspect]);

  return (
    <Reveal
      mode="scroll"
      delayMs={index * 80}
      className="flex h-full flex-col border border-border bg-background-secondary transition-colors duration-200 hover:border-accent/40"
    >
      {/* Card header bar */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-3 py-1.5">
        <span className="font-technical text-[9px] uppercase tracking-widest text-accent">
          CERT-{seqNum}
        </span>
        <span className="font-technical text-[9px] uppercase tracking-widest text-foreground-muted">
          {displayId}
        </span>
      </div>

      {/* Media area */}
      <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border bg-background-primary">
        {mediaUrl ? (
          isPdf ? (
            <PdfThumbnail
              url={mediaUrl}
              alt={cert.title}
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <Image
              src={mediaUrl}
              alt={cert.title}
              fill
              className="object-cover"
              unoptimized
            />
          )
        ) : (
          // Placeholder with matrix-style pattern
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 11px, #fff 11px, #fff 12px), repeating-linear-gradient(90deg, transparent, transparent 11px, #fff 11px, #fff 12px)",
              }}
            />
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div className="border border-accent/30 bg-accent/5 px-2 py-1">
                <span className="font-technical text-[10px] font-bold uppercase tracking-widest text-accent/60">
                  NO FILE
                </span>
              </div>
              <span className="font-technical text-[8px] uppercase tracking-widest text-foreground-muted/50">
                NO DOCUMENT ATTACHED
              </span>
            </div>
          </div>
        )}

        {/* Overlay badge */}
        {mediaUrl && (
          <button
            onClick={handleInspect}
            className="absolute bottom-2 right-2 border border-accent/60 bg-background-primary/90 px-2 py-0.5 font-technical text-[9px] uppercase tracking-wider text-accent opacity-0 transition-opacity duration-200 hover:bg-accent hover:text-background-primary group-hover:opacity-100"
            style={{ opacity: undefined }}
            aria-label={`View ${cert.title}`}
          >
            VIEW ↗
          </button>
        )}
      </div>

      {/* Hash display */}
      <div className="border-b border-border bg-background-primary px-3 py-1.5">
        <p className="break-all font-technical text-[8px] leading-relaxed tracking-wider text-foreground-muted/60">
          {hash.substring(0, 39)}
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="font-heading text-sm font-semibold leading-snug text-foreground-primary line-clamp-2">
          {cert.title}
        </h3>
        <TechnicalLabel className="text-accent">{cert.issuer}</TechnicalLabel>
        <div className="mt-auto flex items-center justify-between pt-2">
          <TechnicalLabel>{cert.date}</TechnicalLabel>
          {cert.credentialId && (
            <span className="font-technical text-[9px] uppercase tracking-widest text-foreground-muted/70">
              #{cert.credentialId.substring(0, 12)}
            </span>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between border-t border-border px-3 py-2">
        {mediaUrl ? (
          <button
            onClick={handleInspect}
            className="font-technical text-[9px] uppercase tracking-widest text-foreground-muted transition-colors hover:text-accent"
          >
            [INSPECT FILE]
          </button>
        ) : (
          <span className="font-technical text-[9px] uppercase tracking-widest text-foreground-muted/40">
            [NO FILE]
          </span>
        )}
        {cert.credentialUrl && (
          <ArrowLink href={cert.credentialUrl} external>
            VERIFY
          </ArrowLink>
        )}
      </div>
    </Reveal>
  );
}

export function MatrixTemplate({ certifications }: MatrixTemplateProps) {
  const [viewer, setViewer] = useState<ViewerState | null>(null);

  const visible = certifications.filter((c) => c.visible !== false);

  if (visible.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center border border-dashed border-border p-8 text-center">
        <TechnicalLabel className="text-foreground-muted">
          NO CREDENTIAL RECORDS FOUND
        </TechnicalLabel>
      </div>
    );
  }

  return (
    <>
      {/* Header bar */}
      <div className="mb-6 flex items-center gap-4 border-b border-border pb-3">
        <span className="font-technical text-[9px] uppercase tracking-widest text-accent">
          CREDENTIAL MATRIX
        </span>
        <span className="h-px flex-1 bg-border" />
        <span className="font-technical text-[9px] uppercase tracking-widest text-foreground-muted">
          {visible.length} RECORD{visible.length !== 1 ? "S" : ""}
        </span>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((cert, i) => (
          <div key={cert.id} className="group flex h-full flex-col">
            <MatrixCard cert={cert} index={i} onInspect={setViewer} />
          </div>
        ))}
      </div>

      {/* File viewer modal */}
      {viewer && (
        <FileViewerModal
          url={viewer.url}
          name={viewer.name}
          isPdf={viewer.isPdf}
          credentialUrl={viewer.credentialUrl}
          onClose={() => setViewer(null)}
        />
      )}
    </>
  );
}
