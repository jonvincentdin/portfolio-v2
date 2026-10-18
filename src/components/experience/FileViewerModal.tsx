"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { PdfThumbnail } from "@/components/ui/PdfThumbnail";

interface FileViewerModalProps {
  /** URL to the file (image or PDF) */
  url: string;
  /** Display name of the file */
  name: string;
  /** Whether the file is a PDF */
  isPdf?: boolean;
  /** Optional credential/verify URL */
  credentialUrl?: string;
  onClose: () => void;
}

export function FileViewerModal({
  url,
  name,
  isPdf = false,
  credentialUrl,
  onClose,
}: FileViewerModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll while modal open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === backdropRef.current) onClose();
    },
    [onClose],
  );

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`File viewer: ${name}`}
    >
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col border border-border bg-background-secondary shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2">
          <div className="flex items-center gap-3">
            <span className="font-technical text-[10px] uppercase tracking-widest text-accent">
              {isPdf ? "PDF DOCUMENT" : "IMAGE VIEWER"}
            </span>
            <span className="text-border-strong">|</span>
            <TechnicalLabel className="truncate max-w-[300px]">{name}</TechnicalLabel>
          </div>
          <div className="flex items-center gap-3">
            {credentialUrl && (
              <ArrowLink href={credentialUrl} external>
                VERIFY
              </ArrowLink>
            )}
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center border border-border bg-background-primary text-foreground-muted transition-colors hover:border-accent hover:text-accent"
              aria-label="Close viewer"
            >
              <span className="font-technical text-xs leading-none">✕</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-auto">
          {isPdf ? (
            <iframe
              src={`${url}#toolbar=0&navpanes=0&scrollbar=1`}
              className="h-full min-h-[70vh] w-full border-0"
              title={name}
            />
          ) : (
            <div className="relative flex min-h-[50vh] items-center justify-center p-4">
              <div className="relative max-h-[75vh] max-w-full overflow-hidden">
                <Image
                  src={url}
                  alt={name}
                  width={1200}
                  height={900}
                  className="h-auto max-h-[75vh] w-auto max-w-full object-contain"
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-surface px-4 py-2">
          <span className="font-technical text-[9px] uppercase tracking-widest text-foreground-muted">
            Press ESC or click backdrop to close
          </span>
          {credentialUrl && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-technical text-[9px] uppercase tracking-widest text-foreground-muted transition-colors hover:text-accent"
            >
              Open in New Tab ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
