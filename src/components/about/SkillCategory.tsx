"use client";

import { useId, useState } from "react";
import { AngularPanel } from "@/components/ui/AngularPanel";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import type { SkillCategory as SkillCategoryData } from "@/lib/schemas";
import { SkillItem } from "./SkillItem";

type SkillCategoryProps = {
  category: SkillCategoryData;
};

/** A scannable skill cluster with an accessible, touch-friendly detail toggle. */
export function SkillCategory({ category }: SkillCategoryProps) {
  const [expanded, setExpanded] = useState(true);
  const detailsId = useId();

  return (
    <AngularPanel className="p-6 sm:p-8">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={detailsId}
        data-cursor="button"
        data-audio="ui-toggle"
        onClick={() => setExpanded((current) => !current)}
        className="motion-control group flex w-full items-start justify-between gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <span>
          <TechnicalLabel accent as="span" className="mb-2 block">
            {category.category}
          </TechnicalLabel>
          <span className="font-technical text-[10px] uppercase tracking-[0.08em] text-foreground-muted">
            {category.skills.length} {category.skills.length === 1 ? "system" : "systems"}
          </span>
        </span>
        <span aria-hidden="true" className="font-technical text-technical-label text-accent transition-transform motion-micro group-aria-expanded:rotate-45">
          +
        </span>
      </button>
      <div id={detailsId} hidden={!expanded} className="mt-5">
        <div className="flex flex-wrap gap-2 border-b border-border/60 pb-4">
          {category.skills.filter((skill) => skill.featured).map((skill) => (
            <span key={skill.name} className="border border-accent/50 px-2 py-1 font-technical text-[10px] uppercase tracking-[0.08em] text-accent">
              {skill.name}
            </span>
          ))}
        </div>
        <div className="divide-y divide-border/60">
          {category.skills.map((skill) => <SkillItem key={skill.name} skill={skill} />)}
        </div>
      </div>
    </AngularPanel>
  );
}
