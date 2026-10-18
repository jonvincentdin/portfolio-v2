"use client";

import { useEffect, useRef, useState } from "react";

interface PdfThumbnailProps {
  url: string;
  alt?: string;
  className?: string;
}

export function PdfThumbnail({ url, alt = "PDF preview", className = "" }: PdfThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function render() {
      try {
        const pdfjsLib = await import("pdfjs-dist");

        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        }

        const loadingTask = pdfjsLib.getDocument({
          url,
          cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@6.3.289/cmaps/",
          cMapPacked: true,
        });

        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        if (!mounted || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const viewport = page.getViewport({ scale: 1.5 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvas, canvasContext: ctx, viewport }).promise;

        if (mounted) setLoading(false);
      } catch {
        if (mounted) {
          setError(true);
          setLoading(false);
        }
      }
    }

    void render();
    return () => {
      mounted = false;
    };
  }, [url]);

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center border border-dashed border-border-strong bg-background-primary p-4 text-center ${className}`}
      >
        <div className="mb-2 flex h-10 w-10 items-center justify-center border border-accent/50 bg-accent/10">
          <span className="font-technical text-[10px] font-bold uppercase tracking-wider text-accent">
            PDF
          </span>
        </div>
        <span className="font-technical text-[9px] uppercase tracking-widest text-foreground-muted">
          Document Attached
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden border border-border bg-background-primary ${className}`}
    >
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background-primary/90">
          <div className="h-1 w-16 overflow-hidden bg-surface">
            <div className="h-full w-full animate-pulse bg-accent" />
          </div>
          <span className="mt-2 font-technical text-[9px] uppercase tracking-widest text-foreground-muted">
            RENDERING PDF
          </span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        aria-label={alt}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      />
      <div className="absolute bottom-1 right-1 z-10 border border-border/80 bg-background-primary/90 px-1.5 py-0.5">
        <span className="font-technical text-[8px] font-bold uppercase tracking-wider text-accent">
          PDF
        </span>
      </div>
    </div>
  );
}

