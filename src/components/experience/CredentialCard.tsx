"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { AngularPanel } from "@/components/ui/AngularPanel";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { getCollectionMediaUrl } from "@/lib/content/media";
import { cn } from "@/lib/utils/cn";

type CredentialCardProps = {
  kind: "certification" | "achievement";
  title: string;
  organization: string;
  date: string;
  description?: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
};

/** Shared, schema-compatible interaction surface for credentials and awards. */
export function CredentialCard({ kind, title, organization, date, description, credentialId, credentialUrl, image }: CredentialCardProps) {
  const [selected, setSelected] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const detailsId = useId();
  const collection = kind === "certification" ? "certifications" : "achievements";
  const imageUrl = image ? getCollectionMediaUrl(collection, image) : undefined;
  const hasDetails = Boolean(description || credentialId || credentialUrl);

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    const card = cardRef.current;
    if (!card || event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    card.style.setProperty("--credential-light-x", `${Math.round(x * 100)}%`);
    card.style.setProperty("--credential-light-y", `${Math.round(y * 100)}%`);
    card.style.setProperty("--credential-tilt-x", `${((0.5 - y) * 1.8).toFixed(2)}deg`);
    card.style.setProperty("--credential-tilt-y", `${((x - 0.5) * 1.8).toFixed(2)}deg`);
  }

  function resetPointer() {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--credential-light-x", "50%");
    card.style.setProperty("--credential-light-y", "50%");
    card.style.setProperty("--credential-tilt-x", "0deg");
    card.style.setProperty("--credential-tilt-y", "0deg");
  }

  return (
    <article
      ref={cardRef}
      className="credential-card"
      data-selected={selected}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <AngularPanel className="credential-card__surface p-5 sm:p-6">
        <button
          type="button"
          aria-expanded={hasDetails ? selected : undefined}
          aria-controls={hasDetails ? detailsId : undefined}
          data-cursor="button"
          data-audio="ui-toggle"
          onClick={() => { if (hasDetails) setSelected((current) => !current); }}
          className={cn("motion-control relative z-10 grid w-full gap-5 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:grid-cols-[minmax(9rem,0.8fr)_1.2fr]", !hasDetails && "cursor-default")}
        >
          {imageUrl && !imageFailed ? (
            <span className="relative block aspect-[4/3] overflow-hidden border border-border bg-background-primary">
              <Image src={imageUrl} alt={`${title} visual`} fill sizes="(min-width: 640px) 30vw, 100vw" className="credential-card__image object-cover" onError={() => setImageFailed(true)} />
            </span>
          ) : imageUrl ? (
            <span className="flex aspect-[4/3] items-center justify-center border border-dashed border-border-strong px-4 text-center font-technical text-[10px] uppercase tracking-[0.08em] text-foreground-muted">Image unavailable</span>
          ) : null}
          <span className="flex min-w-0 flex-col justify-between gap-5">
            <span>
              <TechnicalLabel accent as="span" className="mb-2 block">{date}</TechnicalLabel>
              <span className="block font-heading text-heading-md uppercase tracking-tight">{title}</span>
              <span className="mt-1 block font-body text-body-md text-foreground-muted">{organization}</span>
            </span>
            {hasDetails ? <span className="flex items-center justify-between gap-4 border-t border-border pt-4 font-technical text-technical-label uppercase tracking-[0.08em] text-foreground-muted"><span>{selected ? "Close details" : "Inspect details"}</span><span className="text-accent transition-transform motion-micro" aria-hidden="true">{selected ? "—" : "+"}</span></span> : null}
          </span>
        </button>

        {selected && hasDetails ? (
          <div id={detailsId} className="credential-card__details" aria-live="polite">
            <div>
              {description ? <p className="font-body text-body-md text-foreground-muted">{description}</p> : null}
              {credentialId ? <p className="mt-3 font-technical text-technical-label uppercase tracking-[0.08em] text-foreground-muted">ID: {credentialId}</p> : null}
              {credentialUrl ? <ArrowLink href={credentialUrl} external className="mt-4">{kind === "certification" ? "Verify credential" : "View reference"}</ArrowLink> : null}
            </div>
          </div>
        ) : null}
      </AngularPanel>
    </article>
  );
}
