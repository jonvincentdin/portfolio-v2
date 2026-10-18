"use client";

import React from "react";
import type { Experience } from "@/lib/schemas";
import { Reveal } from "@/components/motion/Reveal";
import { AngularPanel } from "@/components/ui/AngularPanel";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";

/*
  Required CSS to be added to globals.css:
  
  .exp-grid-paper {
    background-image: repeating-linear-gradient(var(--border) 0 1px, transparent 1px 100%),
                      repeating-linear-gradient(90deg, var(--border) 0 1px, transparent 1px 100%);
    background-size: 24px 24px;
    opacity: 0.05;
  }

  .exp-bracket-corners {
    position: relative;
  }
  .exp-bracket-corners::before,
  .exp-bracket-corners::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-color: var(--accent);
    border-style: solid;
    pointer-events: none;
    z-index: 10;
  }
  .exp-bracket-corners::before {
    top: 0;
    left: 0;
    border-width: 2px 0 0 2px;
  }
  .exp-bracket-corners::after {
    bottom: 0;
    right: 0;
    border-width: 0 2px 2px 0;
  }

  .exp-fold-corner {
    position: absolute;
    top: -1px;
    right: -1px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 24px 24px 0;
    border-color: transparent var(--background-primary) transparent transparent;
    z-index: 20;
  }
  
  .exp-fold-corner::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 24px 0 0 24px;
    border-color: var(--surface) transparent transparent transparent;
    border-bottom-left-radius: 2px;
    box-shadow: -2px 2px 4px rgba(0,0,0,0.4);
  }

  .exp-dossier-hover {
    transition: all 0.3s ease;
  }
  .exp-dossier-hover:hover {
    border-color: var(--accent);
    box-shadow: inset 0 0 20px rgba(232, 180, 0, 0.05), 0 0 15px rgba(232, 180, 0, 0.1);
  }
*/

interface DossierTemplateProps {
  entries: Experience[];
}

function formatMonth(value: string): string {
  const [year, month] = value.split("-").map(Number);
  return new Date(year, month - 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function DossierTemplate({ entries }: DossierTemplateProps) {
  return (
    <div className="w-full space-y-8 sm:space-y-12">
      {entries.map((entry, index) => {
        const startDate = formatMonth(entry.startDate);
        const endDate = entry.current ? "PRESENT" : entry.endDate ? formatMonth(entry.endDate) : "UNKNOWN";

        return (
          <Reveal key={entry.id} delayMs={index * 80}>
            <AngularPanel className="relative p-0 overflow-hidden exp-dossier-hover exp-bracket-corners">
              {/* Fold Corner Effect */}
              <div className="exp-fold-corner" />

              {/* Grid Background */}
              <div className="absolute inset-0 exp-grid-paper pointer-events-none" />

              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <span className="text-[120px] font-heading text-foreground-muted opacity-15 -rotate-12 select-none tracking-widest whitespace-nowrap">
                  CLASSIFIED
                </span>
              </div>

              {/* Content Wrapper */}
              <div className="relative z-10 flex flex-col p-6 sm:p-8">
                
                {/* Header Tab */}
                <div className="flex justify-between items-center border-b-2 border-border-strong pb-4 mb-6">
                  <div className="font-technical text-accent text-body-lg sm:text-heading-sm uppercase tracking-wider">
                    FILE #{String(index + 1).padStart(2, '0')} // {entry.company}
                  </div>
                  <div className="text-technical-label text-foreground-muted px-2 py-1 border border-border">
                    {entry.current ? "ACTIVE" : "ARCHIVED"}
                  </div>
                </div>

                {/* Dossier Specs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8">
                  <div className="space-y-1">
                    <TechnicalLabel>SUBJECT</TechnicalLabel>
                    <div className="text-heading-sm font-heading uppercase text-foreground-primary">
                      {entry.position}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <TechnicalLabel>PERIOD</TechnicalLabel>
                    <div className="text-body-lg font-technical text-foreground-primary uppercase">
                      {startDate} — {endDate}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <TechnicalLabel>LOCATION</TechnicalLabel>
                    <div className="text-body-md font-technical text-foreground-muted uppercase">
                      {entry.location}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <TechnicalLabel>CLEARANCE LEVEL</TechnicalLabel>
                    <div className="text-body-md font-technical text-foreground-muted uppercase">
                      {entry.current ? "TOP SECRET (ACTIVE)" : "RESTRICTED (ARCHIVED)"}
                    </div>
                  </div>
                </div>

                {/* Operations / Responsibilities */}
                <div className="space-y-4 relative">
                  <TechnicalLabel>OPERATIONS LOG</TechnicalLabel>
                  <div className="space-y-4">
                    {entry.responsibilities.map((resp, i) => (
                      <div key={i} className="flex space-x-4 items-start">
                        <div className="text-accent font-technical text-technical-label mt-1 opacity-70 shrink-0">
                          [{String(i + 1).padStart(2, '0')}]
                        </div>
                        <div className="text-body-md text-foreground-primary font-body">
                          {resp}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                {entry.technologies && entry.technologies.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-border-strong">
                    <TechnicalLabel className="mb-3 block">KNOWN ARSENAL</TechnicalLabel>
                    <div className="flex flex-wrap gap-2">
                      {entry.technologies.map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-surface border border-border text-foreground-primary font-technical text-technical-label uppercase">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AngularPanel>
          </Reveal>
        );
      })}
    </div>
  );
}
