"use client";

/*
  Required CSS for BlueprintTemplate (add to your global CSS or a module):
  .exp-blueprint-bg {
    background-color: rgba(0, 15, 30, 0.4);
    background-image: 
      repeating-linear-gradient(rgba(255, 255, 255, 0.08) 0, rgba(255, 255, 255, 0.08) 1px, transparent 1px, transparent 32px),
      repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0, rgba(255, 255, 255, 0.08) 1px, transparent 1px, transparent 32px);
  }
  .exp-blueprint-entry:hover {
    box-shadow: 0 0 20px rgba(200, 220, 255, 0.08);
  }
  .exp-dimension-line {
    position: relative;
    border-top: 1px solid var(--foreground-muted);
  }
  .exp-dimension-line::before, .exp-dimension-line::after {
    content: '';
    position: absolute;
    top: -4px;
    height: 9px;
    width: 1px;
    background-color: var(--foreground-muted);
  }
  .exp-dimension-line::before { left: 0; }
  .exp-dimension-line::after { right: 0; }
  .exp-leader-line {
    position: relative;
  }
  .exp-leader-line::before {
    content: '';
    position: absolute;
    top: 50%;
    right: 100%;
    width: 2rem;
    height: 1px;
    background-color: var(--foreground-muted);
    margin-right: 0.5rem;
  }
  @media (max-width: 768px) {
    .exp-leader-line::before {
      display: none;
    }
  }
*/

import React from "react";
import { Education } from "@/lib/schemas";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { Reveal } from "@/components/motion/Reveal";

interface BlueprintTemplateProps {
  entries: Education[];
}

export function BlueprintTemplate({ entries }: BlueprintTemplateProps) {
  return (
    <div className="exp-blueprint-bg min-h-[500px] w-full p-4 md:p-8 rounded-sm border border-border-strong relative overflow-hidden font-technical uppercase">
      {/* Blueprint Content */}
      <div className="flex flex-col gap-12 max-w-4xl mx-auto relative z-10">
        {entries.map((entry, index) => {
          const marker = String.fromCharCode(65 + index); // A, B, C...
          
          return (
            <Reveal key={entry.id} delayMs={index * 80}>
              <div className="exp-blueprint-entry group relative flex flex-col md:flex-row gap-6 p-6 border border-border bg-surface/40 transition-all duration-300">
                {/* Cross-section marker */}
                <div className="absolute -left-3 -top-3 bg-background-primary px-2 border border-border text-accent text-technical-label font-bold tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 border border-accent inline-block"></span>
                  SEC {marker}-{marker}&#39;
                </div>

                <div className="flex-1 flex flex-col gap-4 mt-2">
                  {/* Institution & Program */}
                  <div>
                    <h3 className="text-display-lg text-foreground-primary tracking-wider mb-2">
                      {entry.institution}
                    </h3>
                    <div className="flex items-center">
                      <div className="exp-leader-line text-accent text-body-lg ml-0 md:ml-10 inline-block bg-background-primary/50 px-2 border border-border/50">
                        {entry.program}
                      </div>
                    </div>
                  </div>

                  {/* Dimension line for dates */}
                  <div className="my-4">
                    <div className="flex justify-between text-technical-label text-foreground-muted mb-1 px-1">
                      <span>{entry.startYear}</span>
                      <span>{entry.endYear || "PRESENT"}</span>
                    </div>
                    <div className="exp-dimension-line w-full"></div>
                  </div>

                  {/* Description */}
                  {entry.description && (
                    <p className="text-body-md text-foreground-muted lowercase font-body">
                      {entry.description}
                    </p>
                  )}

                  {/* Achievements */}
                  {entry.achievements && entry.achievements.length > 0 && (
                    <div className="mt-4 flex flex-col gap-2">
                      <TechnicalLabel>SPECS/ACHIEVEMENTS</TechnicalLabel>
                      <ul className="flex flex-col gap-2">
                        {entry.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start gap-3 text-body-sm text-foreground-primary">
                            <span className="mt-[4px] min-w-[6px] h-[6px] border border-accent bg-transparent block"></span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Blueprint decor */}
                <div className="absolute bottom-4 right-4 opacity-20 pointer-events-none hidden md:block">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="19" stroke="currentColor" strokeDasharray="2 4"/>
                    <path d="M20 0V40M0 20H40" stroke="currentColor" strokeWidth="0.5"/>
                  </svg>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
